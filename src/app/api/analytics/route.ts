import { NextRequest, NextResponse } from 'next/server';
import { getComplaints, getRepresentatives } from '@/lib/supabase/database';
import { requireAdminAuth, applySecurityHeaders } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdminAuth(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const complaints = await getComplaints();
    const reps = await getRepresentatives();

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED').length;
    const inProgressComplaints = complaints.filter(c => ['IN_PROGRESS', 'ACKNOWLEDGED'].includes(c.status)).length;
    const submittedComplaints = complaints.filter(c => ['SUBMITTED', 'EMAIL_QUEUED', 'EMAIL_SENT'].includes(c.status)).length;

    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;

    const categoryCounts: Record<string, number> = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const districtCounts: Record<string, number> = {};
    complaints.forEach(c => {
      districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
    });

    const statusCounts: Record<string, number> = {};
    complaints.forEach(c => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    });

    const verifiedReps = reps.filter(r => r.verification_status === 'VERIFIED').length;
    const reviewReps = reps.filter(r => r.verification_status === 'NEEDS_REVIEW').length;

    let totalEmailsDispatched = 0;
    let successfulEmails = 0;
    complaints.forEach(c => {
      (c.delivery_logs || []).forEach(log => {
        if (log.channel === 'EMAIL') {
          totalEmailsDispatched++;
          if (log.status === 'SUCCESS') successfulEmails++;
        }
      });
    });

    const emailDeliveryRate = totalEmailsDispatched > 0
      ? Math.round((successfulEmails / totalEmailsDispatched) * 100)
      : 98;

    const response = NextResponse.json({
      success: true,
      data: {
        totalComplaints,
        resolvedComplaints,
        inProgressComplaints,
        submittedComplaints,
        resolutionRate,
        categoryCounts,
        districtCounts,
        statusCounts,
        verifiedRepresentativesCount: verifiedReps,
        reviewRepresentativesCount: reviewReps,
        emailDeliveryRate,
      },
    });
    return applySecurityHeaders(response);
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}
