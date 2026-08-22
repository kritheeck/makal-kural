import { NextRequest, NextResponse } from 'next/server';
import { fullComplaintSubmissionSchema } from '@/lib/validation';
import { generateReferenceNumber } from '@/lib/utils';
import { routeComplaintToRepresentative } from '@/lib/routing-engine';
import { dispatchComplaintToRepresentative, MultiChannelResult } from '@/lib/delivery-service';
import { createComplaint, getComplaints, createComplaintAttachment, createDeliveryLog, createComplaintUpdate, uploadAttachment } from '@/lib/supabase/database';
import { Complaint, DeliveryLog, DeliveryChannel, DeliveryStatus, ComplaintUpdate } from '@/types/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const complaints = await getComplaints({ 
      district: district ?? undefined, 
      category: category ?? undefined, 
      status: status ?? undefined, 
      search: search ?? undefined 
    });

    return NextResponse.json({ success: true, count: complaints.length, data: complaints });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: any;
    let files: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const payloadJson = formData.get('payload');
      payload = payloadJson ? JSON.parse(payloadJson as string) : {};
      let idx = 0;
      while (formData.has(`attachment_${idx}`)) {
        files.push(formData.get(`attachment_${idx}`) as File);
        idx++;
      }
    } else {
      payload = await req.json();
    }

    const validated = fullComplaintSubmissionSchema.safeParse(payload);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid form submission', details: validated.error.format() },
        { status: 400 }
      );
    }

    const data = validated.data;
    const refNumber = generateReferenceNumber();

    const routing = await routeComplaintToRepresentative(
      data.category,
      data.district,
      data.constituency
    );

    const assignedRep = routing.representative;
    const complaintId = crypto.randomUUID();

    const initialUpdates: ComplaintUpdate[] = [
      {
        id: crypto.randomUUID(),
        complaint_id: complaintId,
        status: 'SUBMITTED',
        message: 'Complaint submitted by citizen and registered with reference ' + refNumber,
        is_public: true,
        created_at: new Date().toISOString(),
      },
    ];

    const initialDeliveryLogs: DeliveryLog[] = [];

    let finalStatus: any = 'SUBMITTED';
    let multiChannelResult: MultiChannelResult | null = null;

    if (assignedRep && routing.isVerified) {
      const newComplaintObj: Complaint = {
        id: complaintId,
        reference_number: refNumber,
        category: data.category,
        subcategory: data.subcategory,
        title: data.title,
        description: data.description,
        original_language: data.originalLanguage,
        ai_improved_title: data.aiImprovedTitle,
        ai_improved_description: data.aiImprovedDescription,
        translated_description: data.translatedDescription,
        state: data.state,
        district: data.district,
        city: data.city,
        constituency: data.constituency,
        locality: data.locality,
        latitude: data.latitude,
        longitude: data.longitude,
        severity: data.severity,
        status: 'EMAIL_QUEUED',
        assigned_representative_id: assignedRep.id,
        assigned_representative: assignedRep,
        is_anonymous: data.isAnonymous,
        submitter_name: data.submitterName,
        submitter_email: data.submitterEmail,
        submitter_phone: data.submitterPhone,
        submitter_language: data.submitterLanguage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      multiChannelResult = await dispatchComplaintToRepresentative(newComplaintObj, assignedRep);

      const emailSuccess = multiChannelResult.results.find(r => r.channel === 'EMAIL');
      if (emailSuccess && emailSuccess.status === 'SUCCESS') {
        finalStatus = 'EMAIL_SENT';
        initialUpdates.unshift({
          id: crypto.randomUUID(),
          complaint_id: complaintId,
          status: 'EMAIL_SENT',
          message: `Official complaint dossier dispatched to verified authority: ${assignedRep.name} (${assignedRep.organization}).`,
          is_public: true,
          created_at: new Date().toISOString(),
        });
      } else if (emailSuccess && emailSuccess.status === 'FAILED') {
        finalStatus = 'EMAIL_FAILED';
      }

      const channelSummary = multiChannelResult.results.map(r => `${r.channel}: ${r.status}`).join(', ');
      initialUpdates.unshift({
        id: crypto.randomUUID(),
        complaint_id: complaintId,
        status: emailSuccess?.status === 'SUCCESS' ? 'EMAIL_SENT' : 'EMAIL_FAILED',
        message: `Multi-channel dispatch completed (${multiChannelResult.overallStatus}). Channels: ${channelSummary}.`,
        is_public: true,
        created_at: new Date().toISOString(),
      });

      for (const result of multiChannelResult.results) {
        initialDeliveryLogs.push({
          id: crypto.randomUUID(),
          complaint_id: complaintId,
          channel: result.channel as DeliveryChannel,
          recipient: assignedRep.email,
          status: result.status as DeliveryStatus,
          external_message_id: result.externalMessageId,
          external_url: result.externalUrl,
          error_message: result.error,
          sent_at: result.sentAt,
        });
      }
    }

    const savedComplaint = await createComplaint({
      id: complaintId,
      reference_number: refNumber,
      category: data.category,
      subcategory: data.subcategory,
      title: data.title,
      description: data.description,
      original_language: data.originalLanguage,
      ai_improved_title: data.aiImprovedTitle,
      ai_improved_description: data.aiImprovedDescription,
      translated_description: data.translatedDescription,
      state: data.state,
      district: data.district,
      city: data.city,
      constituency: data.constituency,
      locality: data.locality,
      latitude: data.latitude,
      longitude: data.longitude,
      severity: data.severity,
      status: finalStatus,
      assigned_representative_id: assignedRep?.id,
      is_anonymous: data.isAnonymous,
      submitter_name: data.submitterName,
      submitter_email: data.submitterEmail,
      submitter_phone: data.submitterPhone,
      submitter_language: data.submitterLanguage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const finalComplaintId = savedComplaint?.id || complaintId;

    for (const update of initialUpdates) {
      await createComplaintUpdate({ ...update, complaint_id: finalComplaintId });
    }

    for (const log of initialDeliveryLogs) {
      await createDeliveryLog({ ...log, complaint_id: finalComplaintId });
    }

    const uploadedAttachments: { id: string; file_url: string; storage_path: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const upload = await uploadAttachment(file, finalComplaintId);
      if (upload) {
        const stored = await createComplaintAttachment({
          id: crypto.randomUUID(),
          complaint_id: finalComplaintId,
          file_name: file.name,
          storage_path: upload.path,
          file_url: upload.url,
          mime_type: file.type,
          file_size: file.size,
          created_at: new Date().toISOString(),
        });
        if (stored) uploadedAttachments.push(stored);
      }
    }

    return NextResponse.json({
      success: true,
      referenceNumber: refNumber,
      complaintId: finalComplaintId,
      assignedRepresentative: assignedRep,
      routingDetails: routing,
      deliveryLogs: initialDeliveryLogs,
      multiChannelResult,
      attachments: uploadedAttachments,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
