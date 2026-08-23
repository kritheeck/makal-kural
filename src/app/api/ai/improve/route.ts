import { NextRequest, NextResponse } from 'next/server';
import { improveComplaintWithAI } from '@/lib/ai-service';

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

    const result = await improveComplaintWithAI({
      title,
      description,
      category: category || 'General',
      locality: locality || 'Locality',
      language: language || 'en',
    });

    if (!result) {
      const fallback = await import('@/lib/ai-assistant-service').then((m) =>
        m.improveComplaint(title, description, category || 'General', locality || 'Locality', district || 'Tamil Nadu', language || 'en')
      );
      return NextResponse.json({
        success: true,
        data: {
          improvedTitle: fallback.improvedTitle,
          improvedDescription: fallback.improvedDescription,
          translatedDescription: fallback.translatedDescription,
          summaryBullets: fallback.summaryBullets,
          suggestedSubject: fallback.suggestedSubject,
          isAbusiveFiltered: fallback.isAbusiveFiltered,
          aiPowered: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        improvedTitle: result.improved_title,
        improvedDescription: result.improved_description,
        translatedDescription: result.summary_points.join('\n• '),
        summaryBullets: result.summary_points,
        suggestedSubject: `[Makkal Kural] ${result.improved_title}`,
        isAbusiveFiltered: false,
        aiPowered: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal AI service error' },
      { status: 500 }
    );
  }
}
