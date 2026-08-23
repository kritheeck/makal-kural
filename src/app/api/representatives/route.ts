import { NextRequest, NextResponse } from 'next/server';
import { getRepresentatives, getRepresentativeById, createRepresentative } from '@/lib/supabase/database';
import { Representative } from '@/types/database';
import { applySecurityHeaders } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const verification = searchParams.get('verification');
    const search = searchParams.get('search');

    const reps = await getRepresentatives({ 
      district: district ?? undefined, 
      verification: verification ?? undefined, 
      search: search ?? undefined 
    });

    const response = NextResponse.json({ success: true, count: reps.length, data: reps });
    return applySecurityHeaders(response);
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get('authorization');
    const providedKey = authHeader?.replace('Bearer ', '').trim();
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

    if (!ADMIN_SECRET_KEY || providedKey !== ADMIN_SECRET_KEY) {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return applySecurityHeaders(response);
    }

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
      const response = NextResponse.json(
        { error: 'Missing mandatory representative fields' },
        { status: 400 }
      );
      return applySecurityHeaders(response);
    }

    const newRep: Representative = {
      id: crypto.randomUUID(),
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

    const saved = await createRepresentative(newRep);
    if (!saved) {
      const response = NextResponse.json({ error: 'Failed to save representative' }, { status: 500 });
      return applySecurityHeaders(response);
    }

    const response = NextResponse.json({ success: true, data: saved });
    return applySecurityHeaders(response);
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    return applySecurityHeaders(response);
  }
}
