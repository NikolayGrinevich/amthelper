import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface AnalysisResult {
  sender?: string;
  recipient?: string;
  deadline?: string;
  key_points?: string[];
  summary?: string;
  document_type?: string;
  required_documents?: string[];
  recipient_address?: string;
}

const LOCALE_LANGUAGE: Record<string, string> = {
  ru: 'Russisch',
  uk: 'Ukrainisch',
  ro: 'Rumänisch',
  de: 'Deutsch',
};

async function generateLetterWithClaude(
  letterType: string,
  analysisData: AnalysisResult | null,
  recipientAddress: string,
  locale: string = 'de'
) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY');
  }

  const client = new Anthropic({ apiKey });

  // Build document context from real analysis data
  let docContext = '';
  if (analysisData) {
    const keyPoints = analysisData.key_points?.length
      ? analysisData.key_points.map((kp: string, i: number) => `${i + 1}. ${kp}`).join('\n')
      : 'Keine spezifischen Punkte angegeben.';
    docContext = `
WICHTIGE DOKUMENTENDATEN (aus der Analyse des Originalschreibens):
- Absender (Behörde/Organisation): ${analysisData.sender || 'Nicht angegeben'}
- Empfänger: ${analysisData.recipient || 'Nicht angegeben'}
- Dokumenttyp: ${analysisData.document_type || 'Nicht angegeben'}
- Frist: ${analysisData.deadline || 'Keine spezifische Frist'}
- Zusammenfassung: ${analysisData.summary || 'Keine Zusammenfassung verfügbar'}
- Hauptpunkte:
${keyPoints}
- Erforderliche Dokumente: ${analysisData.required_documents?.join(', ') || 'Keine spezifischen Dokumente erforderlich'}
- Adresse des Absenders zum Antworten: ${recipientAddress}`;
  }

  const typeLabels: Record<string, string> = {
    response: 'Antwortschreiben',
    objection: 'Widerspruch',
    clarification: 'Nachfrage/Erläuterungsersuchen',
    appeal: 'Einspruch/Berufung',
  };

  const typeLabel = typeLabels[letterType] || 'Antwortschreiben';

  const userLanguage = LOCALE_LANGUAGE[locale] ?? 'Russisch';
  const translateInstruction = locale === 'de'
    ? '"letter_locale": "(gleicher Text wie letter_de)"'
    : `"letter_locale": "Vollständige Übersetzung des Briefes auf ${userLanguage} — damit der Mandant versteht, was geschrieben wurde. Keine Abkürzungen."`;

  const systemPrompt = `Du bist ein erfahrener deutscher Jurist und Experte für Verwaltungsrecht mit über 20 Jahren Berufserfahrung im Umgang mit deutschen Behörden. Du hilfst Menschen mit Migrationshintergrund (russischsprachig, ukrainisch, rumänisch), die Schreiben von deutschen Behörden erhalten und professionelle Antworten benötigen.

DEINE AUFGABE:
Verfasse ein juristisch einwandfreies, grammatikalisch fehlerfreies offizielles ${typeLabel} als Antwort auf das analysierte Dokument.

${docContext}

VERBINDLICHE REGELN FÜR DAS SCHREIBEN:
1. Verwende ausschließlich offiziellen Geschäftsstil — kein umgangssprachlicher Ton
2. Zitiere relevante Gesetze und Paragraphen (SGB II, SGB XII, AufenthG, AO usw.) wo zutreffend
3. Setze konkrete Fristen und fordere schriftliche Bestätigung
4. Verwende ausschließlich echte Daten aus dem Dokument — KEINE Platzhalter wie [NAME] oder [DATUM]
5. Struktur: Betreff → Bezug auf das Schreiben → Sachverhalt → Rechtliche Argumentation → Forderung → Abschluss
6. Wahrung der Verhältnismäßigkeit — sachlicher Ton, keine Aggression
7. Das Schreiben muss sofort versandfertig sein
8. Unterschrift: "Mit freundlichen Grüßen" (kein Name — der Nutzer unterschreibt selbst)
9. Falls der Empfänger namentlich bekannt ist: persönliche Anrede verwenden; andernfalls "Sehr geehrte Damen und Herren"

VERBOTEN:
- Platzhalter in eckigen Klammern (z. B. [Name], [Datum], [Aktenzeichen])
- Allgemeiner Text ohne Bezug zum konkreten Fall
- Erfundene Daten — nur was im Dokument steht
- "Sehr geehrte Damen und Herren" wenn der Empfänger bekannt ist

VERFÜGBARE DOKUMENTDATEN:
- Absender (wer das Dokument geschickt hat)
- Empfänger (der Nutzer)
- Dokumenttyp
- Antwortfrist
- Kernpunkte
- Kurzzusammenfassung

ANTWORTFORMAT — NUR dieses JSON, kein Text davor oder danach:
{
  "letter_de": "vollständiges professionelles Schreiben auf Deutsch",
  ${translateInstruction}
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Erstelle ein professionelles ${typeLabel} basierend auf den obigen Dokumentendaten. Das Schreiben muss juristisch präzise, sofort versandfertig und ohne Platzhalter sein. Zitiere relevante Gesetze wo sinnvoll. Antworte ausschließlich mit dem JSON-Objekt — kein Text außerhalb des JSON.`,
      },
    ],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '{}';

  // Strip markdown code fences if Claude wraps the JSON
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const unescape = (s: string) => s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      letter_de: unescape(parsed.letter_de ?? cleaned),
      letter_locale: unescape(parsed.letter_locale ?? parsed.letter_de ?? cleaned),
    };
  } catch {
    // Fallback: return raw text in both fields
    return { letter_de: unescape(cleaned), letter_locale: unescape(cleaned) };
  }
}

async function getAnalysisDataFromDocument(analyzedDocumentId: string): Promise<{
  analysisResult: AnalysisResult | null;
  recipientAddress: string | null;
}> {
  if (!supabaseAdmin) return { analysisResult: null, recipientAddress: null };

  try {
    const { data, error } = await supabaseAdmin
      .from('analyzed_documents')
      .select('analysis_result')
      .eq('id', analyzedDocumentId)
      .single();

    if (error || !data?.analysis_result) return { analysisResult: null, recipientAddress: null };

    const result = data.analysis_result as AnalysisResult;

    const recipientAddress =
      result.recipient_address || result.sender || result.recipient || null;

    return { analysisResult: result, recipientAddress };
  } catch {
    return { analysisResult: null, recipientAddress: null };
  }
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

    // Free tier limit check (count generated letters, not analyzed docs)
    if (userTier === 'free') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabaseAdmin
        .from('generated_letters')
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

    const {
      letter_type,
      template_type,
      analyzed_document_id,
      recipient_address,
      locale,
    } = await request.json();

    const effectiveLetterType = letter_type || template_type;

    if (!effectiveLetterType) {
      return NextResponse.json(
        { error: 'Missing letter_type or template_type' },
        { status: 400 }
      );
    }

    // Try to get document analysis data if analyzed_document_id is provided
    let analysisData: AnalysisResult | null = null;
    let effectiveRecipientAddress = recipient_address;

    if (analyzed_document_id) {
      const docData = await getAnalysisDataFromDocument(analyzed_document_id);
      analysisData = docData.analysisResult;
      if (!effectiveRecipientAddress && docData.recipientAddress) {
        effectiveRecipientAddress = docData.recipientAddress;
      }
    }

    if (!effectiveRecipientAddress) {
      return NextResponse.json(
        { error: 'Missing recipient_address (provide directly or via analyzed_document_id)' },
        { status: 400 }
      );
    }

    const { letter_de, letter_locale } = await generateLetterWithClaude(
      effectiveLetterType,
      analysisData,
      effectiveRecipientAddress,
      locale ?? 'de'
    );

    return NextResponse.json({
      success: true,
      content: letter_de,
      letter_de,
      letter_locale,
      letter_type: effectiveLetterType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Letter generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500 }
    );
  }
}
