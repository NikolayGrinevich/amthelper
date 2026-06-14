import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function generateLetterWithClaude(letterType: string, recipientAddress: string) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY');
  }

  const client = new Anthropic({ apiKey });

  const prompts: Record<string, string> = {
    response: `Generate a formal German response letter to: ${recipientAddress}\n\nFormat it as a proper German business letter with sender address placeholder, date, formal greeting, body about acknowledging receipt of the official letter, and professional closing.`,
    objection: `Generate a formal German letter of objection/appeal to: ${recipientAddress}\n\nFormat it as a proper German business letter with sender address placeholder, date, formal greeting, body expressing objection to a decision, reasoning, and professional closing.`,
    clarification: `Generate a formal German letter requesting clarification to: ${recipientAddress}\n\nFormat it as a proper German business letter with sender address placeholder, date, formal greeting, body with specific questions about the official letter, and professional closing.`,
    appeal: `Generate a formal German appeal letter to: ${recipientAddress}\n\nFormat it as a proper German business letter with sender address placeholder, date, formal greeting, body with reasons for appeal, supporting arguments, and professional closing.`,
  };

  const prompt = prompts[letterType] || prompts.response;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `${prompt}\n\nReturn ONLY the letter content in German, formatted nicely for printing. Include all sections: sender address placeholder [YOUR_ADDRESS], recipient address, date, greeting, body paragraphs, closing, and signature line [YOUR_NAME].`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export async function POST(request: NextRequest) {
  try {
    const { letter_type, recipient_address } = await request.json();

    if (!letter_type || !recipient_address) {
      return NextResponse.json(
        { error: 'Missing letter_type or recipient_address' },
        { status: 400 }
      );
    }

    const content = await generateLetterWithClaude(letter_type, recipient_address);

    return NextResponse.json({
      success: true,
      content,
      letter_type,
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
