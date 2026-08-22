import { Complaint, Representative, DeliveryLog } from '@/types/database';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendComplaintEmail(
  complaint: Complaint,
  recipient: Representative
): Promise<EmailSendResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Makkal Kural <noreply@makkalkural.org>';

  const subject = `[Makkal Kural Official Grievance] #${complaint.reference_number} — ${complaint.category.toUpperCase()} — ${complaint.locality}, ${complaint.district}`;

  const isMinisterLevel = recipient.role.toLowerCase().includes('minister') || recipient.role.toLowerCase().includes('mla') || recipient.role.toLowerCase().includes('chief minister');
  const routingNote = isMinisterLevel
    ? 'This grievance has been <strong>directly routed</strong> to the elected representative\'s official account for immediate action and oversight.'
    : 'This is an automated formal notification regarding a verified public grievance registered by a resident of your jurisdiction.';

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #0b132b; color: #ffffff; padding: 24px; text-align: left; border-bottom: 4px solid #10b981; }
          .badge { display: inline-block; background: #10b981; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
          .minister-badge { display: inline-block; background: #f59e0b; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; margin-left: 8px; }
          .severity-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .sev-URGENT { background: #fee2e2; color: #b91c1c; }
          .sev-HIGH { background: #ffedd5; color: #c2410c; }
          .sev-MEDIUM { background: #fef3c7; color: #92400e; }
          .sev-LOW { background: #ecfdf5; color: #047857; }
          .content { padding: 24px; }
          .field-group { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
          .field-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px; }
          .field-value { font-size: 15px; color: #0f172a; }
          .desc-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 16px 0; border-radius: 0 6px 6px 0; font-size: 14px; white-space: pre-wrap; }
          .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          .btn-track { display: inline-block; background: #0b132b; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 12px; }
          .routing-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 16px 0; border-radius: 0 6px 6px 0; font-size: 13px; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Official Public Grievance</span>
            ${isMinisterLevel ? '<span class="minister-badge">Direct Minister / MLA Routing</span>' : ''}
            <h2 style="margin: 0; font-size: 20px;">மக்கள் குரல் — Makkal Kural</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Citizen Grievance Routing & Tracking Portal</p>
          </div>
          <div class="content">
            <p><strong>To:</strong> ${recipient.name} (${recipient.role}), ${recipient.organization}</p>
            <div class="routing-box">${routingNote}</div>

            <div class="field-group">
              <div class="field-label">Reference Number</div>
              <div class="field-value"><strong style="font-family: monospace; font-size: 16px; color: #0b132b;">${complaint.reference_number}</strong></div>
            </div>

            <div class="field-group">
              <div class="field-label">Civic Category & Severity</div>
              <div class="field-value">
                <span>${complaint.category.toUpperCase()} &rsaquo; ${complaint.subcategory}</span>
                &nbsp;&bull;&nbsp;
                <span class="severity-badge sev-${complaint.severity}">${complaint.severity} URGENCY</span>
              </div>
            </div>

            <div class="field-group">
              <div class="field-label">Location & Jurisdiction</div>
              <div class="field-value">
                <strong>${complaint.locality}</strong>, ${complaint.city}, ${complaint.district}, ${complaint.state}
                ${complaint.constituency ? `(Constituency: ${complaint.constituency})` : ''}
              </div>
            </div>

            <div class="field-group">
              <div class="field-label">Grievance Title</div>
              <div class="field-value" style="font-weight: 600;">${complaint.ai_improved_title || complaint.title}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Detailed Description</div>
              <div class="desc-box">${complaint.ai_improved_description || complaint.description}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Submitter Information</div>
              <div class="field-value">
                Name: ${complaint.submitter_name} | Email: ${complaint.submitter_email} | Phone: ${complaint.submitter_phone || 'Not provided'}
              </div>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${complaint.reference_number}" class="btn-track" style="color: #ffffff;">View Online Tracking & Update Status</a>
            </div>
          </div>
          <div class="footer">
            Makkal Kural is a neutral civic technology platform. Verification Source: <a href="${recipient.source_url}">${recipient.source_url}</a>
          </div>
        </div>
      </body>
    </html>
  `;

  if (resendApiKey && !resendApiKey.includes('your_api_key')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipient.email],
          subject,
          html: htmlBody,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true, messageId: data.id };
      } else {
        return { success: false, error: data.message || 'Resend API error' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to dispatch email' };
    }
  }

  return {
    success: true,
    messageId: `sim_msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  };
}
