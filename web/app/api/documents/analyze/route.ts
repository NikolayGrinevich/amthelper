import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const LANGUAGE_NAMES: Record<string, string> = {
  ru: 'Russian (русский)',
  de: 'German (Deutsch)',
  uk: 'Ukrainian (українська)',
  ro: 'Romanian (română)',
};

async function analyzeWithClaude(base64Data: string, mediaType: string, lang: string) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  const client = new Anthropic({ apiKey });
  const isPdf = mediaType === 'application/pdf';
  const targetLanguage = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES['ru'];

  const fileBlock = isPdf
    ? {
        type: 'document' as const,
        source: { type: 'base64' as const, media_type: 'application/pdf' as const, data: base64Data },
      }
    : {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: base64Data,
        },
      };

  const prompt = `Analyze this German official document.

CRITICAL: ALL values in your JSON response MUST be written in ${targetLanguage}.
Do NOT use English. Every field — document_type, key_points, required_documents, summary — must be in ${targetLanguage}.
Proper nouns (organization names, city names) keep as-is.

Respond ONLY with valid JSON, no markdown fences:
{
  "sender": "organization name as written in document",
  "recipient": "address as written in document",
  "document_type": "type of document in ${targetLanguage}",
  "key_points": ["point 1 in ${targetLanguage}", "point 2 in ${targetLanguage}"],
  "deadline": "YYYY-MM-DD or null",
  "required_documents": ["document 1 in ${targetLanguage}"],
  "urgency": "low|medium|high|critical",
  "summary": "2-3 sentences in ${targetLanguage}"
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [fileBlock as any, { type: 'text', text: prompt }],
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const clean = responseText.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const lang = (formData.get('language') as string) || 'ru';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    let mediaType = 'image/jpeg';
    if (file.type === 'application/pdf') mediaType = 'application/pdf';
    else if (file.type === 'image/png') mediaType = 'image/png';
    else if (file.type === 'image/gif') mediaType = 'image/gif';
    else if (file.type === 'image/webp') mediaType = 'image/webp';

    const analyzedData = await analyzeWithClaude(base64Data, mediaType, lang);

    return NextResponse.json({
      success: true,
      file_name: file.name,
      file_type: file.type,
      file_size: buffer.byteLength,
      analyzed_data: analyzedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}