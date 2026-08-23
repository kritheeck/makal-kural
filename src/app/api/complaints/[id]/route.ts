import { NextRequest, NextResponse } from 'next/server';
import { getComplaintWithDetails, updateComplaintStatus } from '@/lib/supabase/database';
import { requireAdminAuth, applySecurityHeaders } from '@/lib/admin-auth';
import { sendStatusUpdateEmail } from '@/lib/email-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = await getComplaintWithDetails(id);

    if (!complaint) {
      const response = NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
      return applySecurityHeaders(response);
    }

    const response = NextResponse.json({ success: true, data: complaint });
    return applySecurityHeaders(response);
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdminAuth(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json();
    const { status, publicMessage, assignedRepresentativeId } = body;

    const existing = await getComplaintWithDetails(id);
    const updated = await updateComplaintStatus(
      id,
      status,
      publicMessage,
      true,
      assignedRepresentativeId
    );

    if (!updated) {
      const response = NextResponse.json({ error: 'Complaint not found to update' }, { status: 404 });
      return applySecurityHeaders(response);
    }

    if (existing && existing.submitter_email && status) {
      Promise.resolve().then(async () => {
        try {
          await sendStatusUpdateEmail({
            to: existing.submitter_email,
            subject: `[Makkal Kural] Complaint ${status} — ${existing.reference_number}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #0f172a;">
                <h2>Status Update: ${status}</h2>
                <p>Your complaint <strong>${existing.reference_number}</strong> has been updated.</p>
                ${publicMessage ? `<p>${publicMessage}</p>` : ''}
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${existing.reference_number}">View full timeline</a></p>
              </div>
            `,
          });
        } catch (err) {
          console.error('Status notification email failed', err);
        }
      });
    }

    const response = NextResponse.json({ success: true, data: { id, status } });
    return applySecurityHeaders(response);
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}
