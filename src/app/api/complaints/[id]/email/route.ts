import { NextRequest, NextResponse } from 'next/server';
import { getComplaintById, getRepresentativeById, createDeliveryLog, createComplaintUpdate } from '@/lib/supabase/database';
import { sendComplaintEmail } from '@/lib/email-service';
import { requireAdminAuth, applySecurityHeaders } from '@/lib/admin-auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdminAuth(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { id } = await params;
    const complaint = await getComplaintById(id);

    if (!complaint) {
      const response = NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
      return applySecurityHeaders(response);
    }

    if (!complaint.assigned_representative_id) {
      const response = NextResponse.json(
        { error: 'No representative assigned to this complaint' },
        { status: 400 }
      );
      return applySecurityHeaders(response);
    }

    const representative = await getRepresentativeById(complaint.assigned_representative_id);
    if (!representative) {
      const response = NextResponse.json(
        { error: 'Assigned representative not found' },
        { status: 404 }
      );
      return applySecurityHeaders(response);
    }

    const emailResult = await sendComplaintEmail(complaint, representative);

    if (emailResult.success) {
      await createDeliveryLog({
        id: crypto.randomUUID(),
        complaint_id: complaint.id,
        channel: 'EMAIL',
        recipient: representative.email,
        status: 'SUCCESS',
        external_message_id: emailResult.messageId,
        sent_at: new Date().toISOString(),
      });

      await createComplaintUpdate({
        id: crypto.randomUUID(),
        complaint_id: complaint.id,
        status: 'EMAIL_SENT',
        message: `Admin manually re-dispatched email dossier to ${representative.name} (${representative.email}).`,
        is_public: true,
        created_at: new Date().toISOString(),
      });

      const response = NextResponse.json({ success: true, message: 'Email re-dispatched successfully' });
      return applySecurityHeaders(response);
    } else {
      const response = NextResponse.json({ error: emailResult.error || 'Failed to resend email' }, { status: 500 });
      return applySecurityHeaders(response);
    }
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}
