import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function analyzeDocument(imageBase64: string, fileName: string) {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `Analyze this German government document. Extract and return as JSON:
{
  "type": "brief description of document type",
  "sender": "organization name if visible",
  "date": "document date if visible",
  "deadline": "any deadlines mentioned",
  "keyPoints": ["important points from the document"],
  "urgency": "high|medium|low based on content"
}`,
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    return JSON.parse(text)
  } catch {
    return { error: 'Failed to parse response', raw: text }
  }
}

export async function generateLetter(
  userRequest: string,
  documentContext: string,
  language: 'de' | 'ru' | 'uk' | 'en',
) {
  const languageInstructions: Record<string, string> = {
    de: 'Write in formal German with "Sie" form. Professional tone, structured format.',
    ru: 'Write in Russian. Include German legal terms where needed.',
    uk: 'Write in Ukrainian. Include German legal terms where needed.',
    en: 'Write in English. Professional legal tone.',
  }

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `${languageInstructions[language]}
        
User's request: ${userRequest}

Document context: ${documentContext}

Generate a professional response letter.`,
      },
    ],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
