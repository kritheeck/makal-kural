import { NextRequest, NextResponse } from 'next/server';
import { fullComplaintSubmissionSchema } from '@/lib/validation';
import { generateReferenceNumber, maskEmail, maskPhone } from '@/lib/utils';
import { routeComplaintToRepresentative } from '@/lib/routing-engine';
import { dispatchComplaintToRepresentative, MultiChannelResult } from '@/lib/delivery-service';
import { createComplaint, getComplaints, createComplaintAttachment, createDeliveryLog, createComplaintUpdate, uploadAttachment } from '@/lib/supabase/database';
import { Complaint, DeliveryLog, DeliveryChannel, DeliveryStatus, ComplaintUpdate, ComplaintStatus } from '@/types/database';
import { withRateLimit, applySecurityHeaders } from '@/lib/rate-limit';
import { createEmailVerification, sendVerificationEmail, sendComplaintConfirmationEmail } from '@/lib/supabase/verification';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Check for admin access — only admins get full PII
    const authHeader = req.headers.get('authorization');
    const xAdminKey = req.headers.get('x-admin-key');
    const adminKey = authHeader?.replace('Bearer ', '').trim() || xAdminKey?.trim();
    const expectedAdminKey = process.env.ADMIN_SECRET_KEY || 'makkal_kural_admin_2026';
    const isAdmin = adminKey === expectedAdminKey;

    const complaints = await getComplaints({ 
      district: district ?? undefined, 
      category: category ?? undefined, 
      status: status ?? undefined, 
      search: search ?? undefined 
    });

    // Mask PII for non-admin requests (public API)
    const safeComplaints = isAdmin ? complaints : complaints.map((c: any) => ({
      ...c,
      submitter_name: c.submitter_name ? c.submitter_name.charAt(0) + '***' : undefined,
      submitter_email: c.submitter_email ? maskEmail(c.submitter_email) : undefined,
      submitter_phone: c.submitter_phone ? maskPhone(c.submitter_phone) : undefined,
    }));

    const response = NextResponse.json({ success: true, count: safeComplaints.length, data: safeComplaints });
    return applySecurityHeaders(response);
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitResponse = withRateLimit(req, { max: 5, windowMs: 60_000 });
    if (rateLimitResponse instanceof NextResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

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
      const response = NextResponse.json(
        { error: 'Invalid form submission', details: validated.error.format() },
        { status: 400 }
      );
      return applySecurityHeaders(response);
    }

    const data = validated.data;
    const refNumber = generateReferenceNumber();
    const complaintId = crypto.randomUUID();

    const routing = await routeComplaintToRepresentative(
      data.category,
      data.district,
      data.constituency
    );

    const assignedRep = routing.representative;

    const now = new Date().toISOString();
    const initialUpdates: ComplaintUpdate[] = [
      {
        id: crypto.randomUUID(),
        complaint_id: complaintId,
        status: 'SUBMITTED',
        message: 'Complaint submitted by citizen and registered with reference ' + refNumber,
        is_public: true,
        created_at: now,
      },
    ];

    const initialDeliveryLogs: DeliveryLog[] = [];
    let finalStatus: ComplaintStatus = 'SUBMITTED';

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
      created_at: now,
      updated_at: now,
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
          created_at: now,
        });
        if (stored) uploadedAttachments.push(stored);
      }
    }

    if (data.submitterEmail) {
      Promise.resolve().then(async () => {
        try {
          await sendComplaintConfirmationEmail(
            data.submitterEmail,
            refNumber,
            data.title,
            data.district,
            'SUBMITTED'
          );
        } catch (err) {
          console.error('Confirmation email failed', err);
        }
      });

      Promise.resolve().then(async () => {
        try {
          const verification = await createEmailVerification(finalComplaintId, data.submitterEmail);
          if (verification) {
            await sendVerificationEmail(data.submitterEmail, verification.token, refNumber);
          }
        } catch (err) {
          console.error('Verification email creation failed', err);
        }
      });
    }

    if (assignedRep && routing.isVerified) {
      const newComplaintObj: Complaint = {
        id: finalComplaintId,
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
        created_at: now,
        updated_at: now,
      };

      Promise.resolve().then(async () => {
        try {
          const multiChannelResult = await dispatchComplaintToRepresentative(newComplaintObj, assignedRep);
          const emailSuccess = multiChannelResult.results.find(r => r.channel === 'EMAIL');
          const updatedStatus = emailSuccess?.status === 'SUCCESS' ? 'EMAIL_SENT' : emailSuccess?.status === 'FAILED' ? 'EMAIL_FAILED' : 'EMAIL_QUEUED';

          await createComplaintUpdate({
            id: crypto.randomUUID(),
            complaint_id: finalComplaintId,
            status: updatedStatus,
            message: `Multi-channel dispatch completed (${multiChannelResult.overallStatus}).`,
            is_public: true,
            created_at: new Date().toISOString(),
          });

          for (const result of multiChannelResult.results) {
            await createDeliveryLog({
              id: crypto.randomUUID(),
              complaint_id: finalComplaintId,
              channel: result.channel as DeliveryChannel,
              recipient: assignedRep.email,
              status: result.status as DeliveryStatus,
              external_message_id: result.externalMessageId,
              external_url: result.externalUrl,
              error_message: result.error,
              sent_at: result.sentAt,
            });
          }
        } catch (err) {
          console.error('Async delivery failed for complaint', finalComplaintId, err);
        }
      });
    }

    const response = NextResponse.json({
      success: true,
      referenceNumber: refNumber,
      complaintId: finalComplaintId,
      assignedRepresentative: assignedRep,
      routingDetails: routing,
      deliveryLogs: initialDeliveryLogs,
      multiChannelResult: null,
      attachments: uploadedAttachments,
    });
    return applySecurityHeaders(response);
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}
