import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error('Missing ANTHROPIC_API_KEY');
}

export const anthropic = new Anthropic({
  apiKey,
});

export async function analyzeDocumentWithVision(
  base64Image: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `Analyze this German official document (letter from government agency like Finanzamt, Ausländerbehörde, etc.) and provide:

1. Sender (organization name and address)
2. Recipient (address)
3. Document type (e.g., Tax Notice, Residence Permit Decision, etc.)
4. Key points (main topics covered, 3-5 bullet points)
5. Deadline (if mentioned, in format YYYY-MM-DD)
6. Required documents (list what documents are needed for response)
7. Urgency level (low, medium, high, critical)
8. Summary (brief 2-3 sentence summary in Russian)

Respond in valid JSON format only:
{
  "sender": "...",
  "recipient": "...",
  "document_type": "...",
  "key_points": ["...", "..."],
  "deadline": "YYYY-MM-DD or null",
  "required_documents": ["...", "..."],
  "urgency": "low|medium|high|critical",
  "summary": "..."
}`,
          },
        ],
      },
    ],
  });

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`Failed to parse Claude response: ${responseText}`);
  }
}

export async function generateResponseLetter(
  documentContext: string,
  letterType: string,
  recipientAddress: string
) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Based on this German official document context:
${documentContext}

Generate a formal German response letter of type "${letterType}" to:
${recipientAddress}

Format the response as a proper German business letter with:
- Sender address (placeholder: [YOUR_ADDRESS])
- Recipient address
- Date
- Formal greeting (Sehr geehrte Damen und Herren,)
- Body paragraph(s)
- Closing (Mit freundlichen Grüßen,)
- Signature line (placeholder: [YOUR_NAME])

Return ONLY the letter content, no explanations.`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
