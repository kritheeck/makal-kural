import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';
import { sendComplaintEmail } from '@/lib/email-service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = mockStore.getComplaintById(id);

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    if (!complaint.assigned_representative_id) {
      return NextResponse.json(
        { error: 'No representative assigned to this complaint' },
        { status: 400 }
      );
    }

    const representative = mockStore.getRepresentativeById(complaint.assigned_representative_id);
    if (!representative) {
      return NextResponse.json(
        { error: 'Assigned representative not found' },
        { status: 404 }
      );
    }

    const emailResult = await sendComplaintEmail(complaint, representative);

    if (emailResult.success) {
      if (!complaint.delivery_logs) complaint.delivery_logs = [];
      complaint.delivery_logs.unshift({
        id: 'del-' + Date.now(),
        complaint_id: complaint.id,
        channel: 'EMAIL',
        recipient: representative.email,
        status: 'SUCCESS',
        external_message_id: emailResult.messageId,
        sent_at: new Date().toISOString(),
      });

      if (!complaint.updates) complaint.updates = [];
      complaint.updates.unshift({
        id: 'upd-' + Date.now(),
        complaint_id: complaint.id,
        status: 'EMAIL_SENT',
        message: `Admin manually re-dispatched email dossier to ${representative.name} (${representative.email}).`,
        is_public: true,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: 'Email re-dispatched successfully' });
    } else {
      return NextResponse.json({ error: emailResult.error || 'Failed to resend email' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
