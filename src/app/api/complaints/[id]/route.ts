import { NextRequest, NextResponse } from 'next/server';
import { getComplaintById, getComplaintByReference, updateComplaintStatus } from '@/lib/supabase/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = await getComplaintById(id) || await getComplaintByReference(id);

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: complaint });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, publicMessage, assignedRepresentativeId } = body;

    const updated = await updateComplaintStatus(
      id,
      status,
      publicMessage,
      true,
      assignedRepresentativeId
    );

    if (!updated) {
      return NextResponse.json({ error: 'Complaint not found to update' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
