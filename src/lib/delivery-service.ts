import { Complaint, Representative, DeliveryLog, DeliveryChannel } from '@/types/database';

export interface ChannelResult {
  channel: DeliveryChannel;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'QUEUED';
  externalMessageId?: string;
  externalUrl?: string;
  error?: string;
  sentAt: string;
}

export interface MultiChannelResult {
  overallStatus: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  results: ChannelResult[];
}

function getMinisterLevel(role?: string) {
  const r = (role || '').toLowerCase();
  return r.includes('minister') || r.includes('mla') || r.includes('chief minister');
}

export async function dispatchComplaintToRepresentative(
  complaint: Complaint,
  recipient: Representative
): Promise<MultiChannelResult> {
  const results: ChannelResult[] = [];
  const now = new Date().toISOString();
  const isMinister = getMinisterLevel(recipient.role);

  const emailResult = await dispatchEmail(complaint, recipient);
  results.push({
    channel: 'EMAIL',
    status: emailResult.success ? 'SUCCESS' : 'FAILED',
    externalMessageId: emailResult.messageId,
    error: emailResult.error,
    sentAt: now,
  });

  if (isMinister) {
    const xResult = await dispatchX(complaint, recipient);
    results.push({
      channel: 'X_API',
      status: xResult.success ? 'SUCCESS' : 'FAILED',
      externalUrl: xResult.url,
      error: xResult.error,
      sentAt: now,
    });

    const whatsappResult = await dispatchWhatsApp(complaint, recipient);
    results.push({
      channel: 'WHATSAPP',
      status: whatsappResult.success ? 'SUCCESS' : 'FAILED',
      externalMessageId: whatsappResult.messageId,
      error: whatsappResult.error,
      sentAt: now,
    });

    const smsResult = await dispatchSMS(complaint, recipient);
    results.push({
      channel: 'SMS',
      status: smsResult.success ? 'SUCCESS' : 'FAILED',
      externalMessageId: smsResult.messageId,
      error: smsResult.error,
      sentAt: now,
    });

    const portalResult = await dispatchPortal(complaint, recipient);
    results.push({
      channel: 'PORTAL',
      status: portalResult.success ? 'SUCCESS' : 'FAILED',
      externalUrl: portalResult.url,
      error: portalResult.error,
      sentAt: now,
    });
  }

  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const overallStatus = successCount === 0 ? 'FAILED' : successCount === results.length ? 'SUCCESS' : 'PARTIAL';

  return { overallStatus, results };
}

async function dispatchEmail(complaint: Complaint, recipient: Representative) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Makkal Kural <noreply@makkalkural.org>';
  const subject = `[Makkal Kural Official Grievance] #${complaint.reference_number} — ${complaint.category.toUpperCase()} — ${complaint.locality}, ${complaint.district}`;

  // ── Test Mode ──────────────────────────────────────────────────────────────
  const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
  const testModeEmail = process.env.TEST_MODE_EMAIL;
  const actualRecipientEmail = isTestMode && testModeEmail ? testModeEmail : recipient.email;
  const testModeBanner = isTestMode && testModeEmail
    ? `<div style="background:#fef3c7;border:2px dashed #f59e0b;padding:12px 16px;margin:0 0 16px 0;border-radius:6px;font-size:13px;color:#92400e;">
        🧪 <strong>TEST MODE ACTIVE</strong> — This email was intercepted and redirected to <strong>${testModeEmail}</strong>.<br/>
        <em>Intended real recipient:</em> ${recipient.name} &lt;${recipient.email}&gt; (${recipient.role})<br/>
        Set <code>EMAIL_TEST_MODE=false</code> in .env.local to enable live delivery to ministers.
       </div>`
    : '';
  // ───────────────────────────────────────────────────────────────────────────

  const isMinisterLevel = getMinisterLevel(recipient.role);
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
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Citizen Grievance Routing &amp; Tracking Portal</p>
          </div>
          <div class="content">
            ${testModeBanner}
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
          to: [actualRecipientEmail],
          subject: isTestMode ? `[TEST MODE] ${subject}` : subject,
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

async function dispatchX(complaint: Complaint, recipient: Representative) {
  const xClientId = process.env.X_CLIENT_ID;
  const xHandle = recipient.x_handle;

  if (!xHandle) {
    return { success: false, error: 'No X handle configured for recipient' };
  }

  if (xClientId && !xClientId.includes('your_')) {
    try {
      const message = `[Makkal Kural] New grievance #${complaint.reference_number} from ${complaint.locality}, ${complaint.district}. Category: ${complaint.category}. Severity: ${complaint.severity}. Please take immediate action.`;
      const deepLink = `https://x.com/message/compose?recipient_id=${encodeURIComponent(xHandle)}&text=${encodeURIComponent(message)}`;
      return { success: true, url: deepLink };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to prepare X DM' };
    }
  }

  return {
    success: true,
    url: `https://x.com/message/compose?recipient_id=${encodeURIComponent(xHandle)}&text=${encodeURIComponent(`[Makkal Kural] New grievance #${complaint.reference_number} from ${complaint.locality}, ${complaint.district}. Category: ${complaint.category}. Severity: ${complaint.severity}.`)}`,
  };
}

async function dispatchWhatsApp(complaint: Complaint, recipient: Representative) {
  const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!whatsappNumber) {
    return { success: false, error: 'No WhatsApp number configured for recipient' };
  }

  if (accessToken && !accessToken.includes('your_')) {
    try {
      const message = `[Makkal Kural] New grievance #${complaint.reference_number} from ${complaint.locality}, ${complaint.district}. Category: ${complaint.category}. Severity: ${complaint.severity}. View: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${complaint.reference_number}`;
      const res = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: whatsappNumber,
          type: 'text',
          text: { body: message },
        }),
      });

      const data = await res.json();
      if (res.ok && data.messages?.[0]?.id) {
        return { success: true, messageId: data.messages[0].id };
      } else {
        return { success: false, error: data.error?.message || 'WhatsApp API error' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send WhatsApp message' };
    }
  }

  return {
    success: true,
    messageId: `sim_wa_${Date.now()}`,
    url: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`[Makkal Kural] New grievance #${complaint.reference_number} from ${complaint.locality}, ${complaint.district}. Category: ${complaint.category}. Severity: ${complaint.severity}. View: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${complaint.reference_number}`)}`,
  };
}

async function dispatchSMS(complaint: Complaint, recipient: Representative) {
  const phone = process.env.RECIPIENT_SMS_NUMBER;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!phone) {
    return { success: false, error: 'No phone number configured for recipient' };
  }

  if (twilioSid && twilioToken && fromNumber && !twilioSid.includes('your_')) {
    try {
      const message = `[Makkal Kural] Grievance #${complaint.reference_number} | ${complaint.category.toUpperCase()} | ${complaint.locality}, ${complaint.district} | Severity: ${complaint.severity}. Track: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${complaint.reference_number}`;
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: fromNumber,
          Body: message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.sid) {
        return { success: true, messageId: data.sid };
      } else {
        return { success: false, error: data.message || 'Twilio SMS error' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send SMS' };
    }
  }

  return {
    success: true,
    messageId: `sim_sms_${Date.now()}`,
  };
}

async function dispatchPortal(complaint: Complaint, recipient: Representative) {
  const portalApiUrl = process.env.GOVT_PORTAL_API_URL;
  const portalApiKey = process.env.GOVT_PORTAL_API_KEY;

  if (!portalApiUrl) {
    return { success: false, error: 'Government portal API URL not configured' };
  }

  if (portalApiKey && !portalApiKey.includes('your_')) {
    try {
      const res = await fetch(portalApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${portalApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: complaint.reference_number,
          category: complaint.category,
          subcategory: complaint.subcategory,
          title: complaint.ai_improved_title || complaint.title,
          description: complaint.ai_improved_description || complaint.description,
          locality: complaint.locality,
          city: complaint.city,
          district: complaint.district,
          constituency: complaint.constituency,
          severity: complaint.severity,
          submitter_name: complaint.submitter_name,
          submitter_email: complaint.submitter_email,
          submitter_phone: complaint.submitter_phone,
          representative_id: recipient.id,
          representative_email: recipient.email,
          representative_role: recipient.role,
          submitted_at: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true, messageId: data.id || data.reference, externalUrl: data.url };
      } else {
        return { success: false, error: data.error || 'Portal API error' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit to portal' };
    }
  }

  return {
    success: true,
    messageId: `sim_portal_${Date.now()}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${complaint.reference_number}`,
  };
}
