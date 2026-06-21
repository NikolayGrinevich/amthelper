import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 120; // Longer for multiple files

const LANGUAGE_NAMES: Record<string, string> = {
  ru: 'Russian (русский)',
  de: 'German (Deutsch)',
  uk: 'Ukrainian (українська)',
  ro: 'Romanian (română)',
};

async function analyzeWithClaude(
  files: { base64: string; mediaType: string; fileName: string }[],
  lang: string
) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  const client = new Anthropic({ apiKey });
  const targetLanguage = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES['ru'];

  // Build content array: all image/document blocks + text prompt
  const content: any[] = [];

  // If multiple files, add a note that these are parts of the same document
  if (files.length > 1) {
    content.push({
      type: 'text',
      text: `This document is presented in ${files.length} photos/pages. They are all parts of the SAME document. Analyze all of them together as one document.`,
    });
  }

  for (const file of files) {
    const isPdf = file.mediaType === 'application/pdf';
    const fileBlock = isPdf
      ? {
          type: 'document' as const,
          source: {
            type: 'base64' as const,
            media_type: 'application/pdf' as const,
            data: file.base64,
          },
        }
      : {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: file.mediaType as
              | 'image/jpeg'
              | 'image/png'
              | 'image/gif'
              | 'image/webp',
            data: file.base64,
          },
        };
    content.push(fileBlock as any);
  }

  content.push({
    type: 'text',
    text: `Analyze this German official document${files.length > 1 ? ' (all images above are parts of the SAME document)' : ''}.

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
}`,
  });

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: content,
      },
    ],
  });

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : '';
  const clean = responseText.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

async function fileToBase64(file: File): Promise<{
  base64: string;
  mediaType: string;
  fileName: string;
}> {
  const buffer = await file.arrayBuffer();

  let mediaType = 'image/jpeg';
  if (file.type === 'application/pdf') mediaType = 'application/pdf';
  else if (file.type === 'image/png') mediaType = 'image/png';
  else if (file.type === 'image/gif') mediaType = 'image/gif';
  else if (file.type === 'image/webp') mediaType = 'image/webp';

  return {
    base64: Buffer.from(buffer).toString('base64'),
    mediaType,
    fileName: file.name,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or validate user
    let userId: string;
    let userTier: string;

    if (authToken.startsWith('demo_token_')) {
      userId = '219d0e4d-401e-405a-b5be-ef1095f6165e';
      userTier = 'pro';
    } else {
      if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authToken);
      if (authError || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      userId = user.id;
      const { data: profile } = await supabaseAdmin
        .from('users')
        .select('tier')
        .eq('id', userId)
        .maybeSingle();
      userTier = profile?.tier || 'free';
    }

    // Free tier limit check
        if (userTier === 'free') {
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          const { count } = await supabaseAdmin
            .from('analyzed_documents')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', startOfMonth.toISOString());

          if (count !== null && count >= 3) {
            return NextResponse.json({
              error: 'Free limit reached',
              message: 'Upgrade to Pro for unlimited access',
              upgradeUrl: '/modules/billing',
            }, { status: 402 });
          }
        }

        // File size check
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'File too large. Max 5MB' },
            { status: 413 }
          );
        }

        const formData = await request.formData();
    const lang = (formData.get('language') as string) || 'ru';

    // Support both single 'file' and multiple 'files[]'
    const files: File[] = [];
    const singleFile = formData.get('file') as File | null;
    const multipleFiles = formData.getAll('files[]') as File[];

    if (singleFile) {
      files.push(singleFile);
    }
    if (multipleFiles.length > 0) {
      files.push(...multipleFiles);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert all files to base64
    const fileData = await Promise.all(files.map(fileToBase64));

    // Send all to Claude in one call
    const analyzedData = await analyzeWithClaude(fileData, lang);

    const firstFile = files[0];

    return NextResponse.json({
      success: true,
      file_name: files.length > 1 ? `${files.length} photos` : firstFile.name,
      file_type: firstFile.type,
      file_size: 0,
      analyzed_data: analyzedData,
      multi_file: files.length > 1,
      file_count: files.length,
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
