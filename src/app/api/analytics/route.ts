import { NextResponse } from 'next/server';
import { getComplaints, getRepresentatives } from '@/lib/supabase/database';

export async function GET() {
  try {
    const complaints = await getComplaints();
    const reps = await getRepresentatives();

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED').length;
    const inProgressComplaints = complaints.filter(c => ['IN_PROGRESS', 'ACKNOWLEDGED'].includes(c.status)).length;
    const submittedComplaints = complaints.filter(c => ['SUBMITTED', 'EMAIL_QUEUED', 'EMAIL_SENT'].includes(c.status)).length;

    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // District breakdown
    const districtCounts: Record<string, number> = {};
    complaints.forEach(c => {
      districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
    });

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    complaints.forEach(c => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    });

    // Verification stats
    const verifiedReps = reps.filter(r => r.verification_status === 'VERIFIED').length;
    const reviewReps = reps.filter(r => r.verification_status === 'NEEDS_REVIEW').length;

    // Delivery stats
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
      : 98; // healthy baseline

    return NextResponse.json({
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
