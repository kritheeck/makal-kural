import { supabase, isSupabaseConfigured } from './client';

export interface EmailVerification {
  id: string;
  complaint_id: string;
  email: string;
  token: string;
  verified: boolean;
  expires_at: string;
  created_at: string;
}

export async function createEmailVerification(
  complaintId: string,
  email: string
): Promise<EmailVerification | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('email_verifications')
    .insert({
      complaint_id: complaintId,
      email,
      token,
      verified: false,
      expires_at: expiresAt,
    })
    .select()
    .single();
  if (error) { console.error('createEmailVerification error', error); return null; }
  return data;
}

export async function verifyEmailToken(token: string): Promise<{ success: boolean; complaintId?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: false };
  const { data, error } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('token', token)
    .eq('verified', false)
    .maybeSingle();
  if (error || !data) return { success: false };
  if (new Date(data.expires_at).getTime() < Date.now()) return { success: false };
  await supabase.from('email_verifications').update({ verified: true }).eq('id', data.id);
  return { success: true, complaintId: data.complaint_id };
}

export async function getVerificationByComplaint(
  complaintId: string
): Promise<EmailVerification | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('complaint_id', complaintId)
    .order('created_at', { ascending: false })
    .maybeSingle();
  if (error) { console.error('getVerificationByComplaint error', error); return null; }
  return data;
}

export async function sendVerificationEmail(email: string, token: string, referenceNumber: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const subject = `[Makkal Kural] Verify your email for complaint ${referenceNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a;">
      <h2>Verify your email address</h2>
      <p>Please verify your email to receive updates for your complaint <strong>${referenceNumber}</strong>.</p>
      <p><a href="${appUrl}/verify?token=${token}">Verify Email</a></p>
      <p>If you did not submit this complaint, please ignore this email.</p>
    </div>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Makkal Kural <noreply@makkalkural.org>';

  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured. Verification email skipped.');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({ from: fromEmail, to: email, subject, html }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Verification email send failed', res.status, errText);
    }
  } catch (err) {
    console.error('Verification email error', err);
  }
}
