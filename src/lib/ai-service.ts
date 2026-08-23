export interface AiImprovementResult {
  improved_title: string;
  improved_description: string;
  suggested_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  summary_points: string[];
}

export async function improveComplaintWithAI(params: {
  title: string;
  description: string;
  category: string;
  locality: string;
  language: 'en' | 'ta';
}): Promise<AiImprovementResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes('your_')) return null;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a civic complaint assistant. Improve the complaint to be clear, professional, and actionable for government officials. Respond ONLY with valid JSON.`,
          },
          {
            role: 'user',
            content: JSON.stringify({
              category: params.category,
              locality: params.locality,
              language: params.language,
              title: params.title,
              description: params.description,
            }),
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error('AI improve error', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content) as Partial<AiImprovementResult>;

    return {
      improved_title: parsed.improved_title || params.title,
      improved_description: parsed.improved_description || params.description,
      suggested_severity: parsed.suggested_severity || 'MEDIUM',
      summary_points: Array.isArray(parsed.summary_points) ? parsed.summary_points : [],
    };
  } catch (err) {
    console.error('improveComplaintWithAI failed', err);
    return null;
  }
}
