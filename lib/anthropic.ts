import Anthropic from '@anthropic-ai/sdk';
import { TemplateType, GeneratedLetter } from '@/types';
import { getSystemPrompt } from '@/lib/templates/prompts';

let _anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return _anthropic;
}

export async function generateLetter(
  template: TemplateType,
  userInput: string
): Promise<GeneratedLetter> {
  const anthropic = getAnthropicClient();
  const systemPrompt = getSystemPrompt(template, userInput);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userInput,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  // Extract JSON from response (may be wrapped in markdown code blocks)
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from AI response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    explanation: parsed.explanation || '',
    subject: parsed.subject || '',
    letterDe: parsed.letterDe || '',
  };
}
