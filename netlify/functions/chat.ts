import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Content-Type': 'application/json'
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim()
});

export const handler: Handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Validate API key first
    if (!process.env.OPENAI_API_KEY?.trim()) {
      console.error('OpenAI API key not configured');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Service temporarily unavailable' })
      };
    }

    // Parse and validate request body
    const { messages, model = 'gpt-4-turbo-preview', ...params } = JSON.parse(event.body || '{}');

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      ...params
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(completion)
    };
  } catch (error) {
    console.error('Chat function error:', error);
    
    if (error instanceof OpenAI.APIError) {
      return {
        statusCode: error.status || 500,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: error.message,
          type: error.type
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process chat request',
        type: 'server_error'
      })
    };
  }
};