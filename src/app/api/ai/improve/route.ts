import { NextRequest, NextResponse } from 'next/server';
import { improveComplaint } from '@/lib/ai-assistant-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, locality, district, language } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required for enhancement' },
        { status: 400 }
      );
    }

    const result = improveComplaint(
      title,
      description,
      category || 'General',
      locality || 'Locality',
      district || 'Tamil Nadu',
      language || 'en'
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal AI service error' },
      { status: 500 }
    );
  }
}
