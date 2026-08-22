import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = mockStore.getComplaintById(id) || mockStore.getComplaintByReference(id);

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

    const updated = mockStore.updateComplaintStatus(
      id,
      status,
      publicMessage,
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
