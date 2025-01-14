import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { withErrorHandler, validateRequest } from './middleware';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

export const handler: Handler = withErrorHandler(validateRequest(async (event) => {
  const { endpoint, payload } = JSON.parse(event.body || '{}');

  // Rate limiting headers
  const headers = {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': '59',
    'X-RateLimit-Reset': '3600'
  };

  try {
    const response = await openai.chat.completions.create({
      model: payload.model || 'gpt-4',
      messages: payload.messages,
      temperature: payload.temperature || 0.7,
      max_tokens: payload.max_tokens || 2000,
      stream: payload.stream || false
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    throw error;
  }
}));
