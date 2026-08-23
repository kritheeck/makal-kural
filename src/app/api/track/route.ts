import { NextRequest, NextResponse } from 'next/server';
import { getComplaintWithDetails } from '@/lib/supabase/database';
import { maskEmail, maskPhone } from '@/lib/utils';
import { ComplaintAttachment } from '@/types/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Reference number is required' }, { status: 400 });
    }

    const complaint = await getComplaintWithDetails(ref);

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const attachments: ComplaintAttachment[] = (complaint.attachments || []).map(a => ({
      id: a.id,
      complaint_id: a.complaint_id,
      file_name: a.file_name,
      storage_path: a.storage_path,
      file_url: a.file_url,
      mime_type: a.mime_type,
      file_size: a.file_size,
      created_at: a.created_at,
    }));

    const maskedComplaint = {
      id: complaint.id,
      reference_number: complaint.reference_number,
      category: complaint.category,
      subcategory: complaint.subcategory,
      title: complaint.title,
      description: complaint.description,
      ai_improved_title: complaint.ai_improved_title,
      ai_improved_description: complaint.ai_improved_description,
      state: complaint.state,
      district: complaint.district,
      city: complaint.city,
      constituency: complaint.constituency,
      locality: complaint.locality,
      latitude: complaint.latitude,
      longitude: complaint.longitude,
      severity: complaint.severity,
      status: complaint.status,
      assigned_representative: complaint.assigned_representative,
      submitter_masked_name: complaint.is_anonymous
        ? 'Anonymous Citizen'
        : complaint.submitter_name.charAt(0) + '*** ' + (complaint.submitter_name.split(' ')[1] || ''),
      submitter_masked_email: maskEmail(complaint.submitter_email),
      submitter_masked_phone: maskPhone(complaint.submitter_phone),
      created_at: complaint.created_at,
      updated_at: complaint.updated_at,
      updates: (complaint.updates || []).filter((u: any) => u.is_public),
      attachments,
    };

    return NextResponse.json({ success: true, data: maskedComplaint });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
