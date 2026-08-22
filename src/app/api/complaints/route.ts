import { NextRequest, NextResponse } from 'next/server';
import { fullComplaintSubmissionSchema } from '@/lib/validation';
import { generateReferenceNumber } from '@/lib/utils';
import { routeComplaintToRepresentative } from '@/lib/routing-engine';
import { dispatchComplaintToRepresentative, MultiChannelResult } from '@/lib/delivery-service';
import { mockStore } from '@/lib/supabase/mock-store';
import { Complaint, DeliveryLog, DeliveryChannel, DeliveryStatus, ComplaintUpdate } from '@/types/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let complaints = mockStore.getComplaints();

    if (district && district !== 'all') {
      complaints = complaints.filter(c => c.district.toLowerCase() === district.toLowerCase());
    }
    if (category && category !== 'all') {
      complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (status && status !== 'all') {
      complaints = complaints.filter(c => c.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(
        c =>
          c.reference_number.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.locality.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: complaints.length, data: complaints });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = fullComplaintSubmissionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid form submission', details: validated.error.format() },
        { status: 400 }
      );
    }

    const data = validated.data;
    const refNumber = generateReferenceNumber();

    // 1. Determine verified representative routing
    const routing = routeComplaintToRepresentative(
      data.category,
      data.district,
      data.constituency
    );

    const assignedRep = routing.representative;
    const complaintId = 'cmp-' + Date.now();

    // 2. Build initial updates
    const initialUpdates: ComplaintUpdate[] = [
      {
        id: 'upd-' + Date.now(),
        complaint_id: complaintId,
        status: 'SUBMITTED',
        message: 'Complaint submitted by citizen and registered with reference ' + refNumber,
        is_public: true,
        created_at: new Date().toISOString(),
      },
    ];

    const initialDeliveryLogs: DeliveryLog[] = [];

    // 3. If verified representative exists, dispatch across all available channels
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
          id: 'upd-' + (Date.now() + 1),
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
        id: 'upd-' + (Date.now() + 2),
        complaint_id: complaintId,
        status: emailSuccess?.status === 'SUCCESS' ? 'EMAIL_SENT' : 'EMAIL_FAILED',
        message: `Multi-channel dispatch completed (${multiChannelResult.overallStatus}). Channels: ${channelSummary}.`,
        is_public: true,
        created_at: new Date().toISOString(),
      });

      for (const result of multiChannelResult.results) {
        initialDeliveryLogs.push({
          id: 'del-' + Date.now() + '-' + result.channel,
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

    // 4. Save complaint in store
    const fullComplaint: Complaint = {
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
      assigned_representative: assignedRep,
      is_anonymous: data.isAnonymous,
      submitter_name: data.submitterName,
      submitter_email: data.submitterEmail,
      submitter_phone: data.submitterPhone,
      submitter_language: data.submitterLanguage,
      updates: initialUpdates,
      delivery_logs: initialDeliveryLogs,
      attachments: data.attachments?.map((a, i) => ({
        id: `att-${Date.now()}-${i}`,
        complaint_id: complaintId,
        file_name: a.fileName,
        storage_path: `evidence/${complaintId}/${a.fileName}`,
        file_url: a.fileUrl,
        mime_type: a.mimeType,
        file_size: a.fileSize,
        created_at: new Date().toISOString(),
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockStore.addComplaint(fullComplaint);

    return NextResponse.json({
      success: true,
      referenceNumber: refNumber,
      complaintId: fullComplaint.id,
      assignedRepresentative: assignedRep,
      routingDetails: routing,
      deliveryLogs: initialDeliveryLogs,
      multiChannelResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
