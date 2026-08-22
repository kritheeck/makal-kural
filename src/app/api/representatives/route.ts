import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';
import { Representative } from '@/types/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const verification = searchParams.get('verification');
    const search = searchParams.get('search');

    let reps = mockStore.getRepresentatives();

    if (district && district !== 'all') {
      reps = reps.filter(r => r.district.toLowerCase() === district.toLowerCase());
    }
    if (verification && verification !== 'all') {
      reps = reps.filter(r => r.verification_status === verification);
    }
    if (search) {
      const q = search.toLowerCase();
      reps = reps.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.organization.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: reps.length, data: reps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      role,
      organization,
      categorySpecialty,
      state = 'Tamil Nadu',
      district,
      constituency,
      email,
      xHandle,
      officialWebsite,
      sourceUrl,
      verificationStatus = 'NEEDS_REVIEW',
    } = body;

    if (!name || !role || !organization || !district || !email || !sourceUrl) {
      return NextResponse.json(
        { error: 'Missing mandatory representative fields' },
        { status: 400 }
      );
    }

    const newRep: Representative = {
      id: 'rep-' + Date.now(),
      name,
      role,
      organization,
      category_specialty: categorySpecialty,
      state,
      district,
      constituency,
      email,
      x_handle: xHandle,
      official_website: officialWebsite,
      source_url: sourceUrl,
      verification_status: verificationStatus,
      last_verified_at: verificationStatus === 'VERIFIED' ? new Date().toISOString() : undefined,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockStore.addRepresentative(newRep);

    return NextResponse.json({ success: true, data: newRep });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
