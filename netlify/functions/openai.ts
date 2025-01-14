import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { validateApiKey, validateMessages } from '../src/lib/ai/utils/requestValidator';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

export const handler: Handler = async (event) => {
  // Validate request method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Validate API key
    validateApiKey(process.env.OPENAI_API_KEY);

    // Parse and validate request body
    const { messages, model = 'gpt-4-turbo-preview', ...params } = JSON.parse(event.body || '{}');
    validateMessages(messages);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content?.trim() || ''
      })),
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4096,
      ...params
    });

    // Validate response
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Ensure valid JSON response
    try {
      JSON.parse(content);
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: completion.id,
        object: 'chat.completion',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content
          },
          finish_reason: 'stop'
        }]
      })
    };
  } catch (error) {
    console.error('OpenAI function error:', error);

    if (error instanceof OpenAI.APIError) {
      return {
        statusCode: error.status || 500,
        headers,
        body: JSON.stringify({
          error: error.message,
          type: error.type
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
        type: 'server_error'
      })
    };
  }
};
