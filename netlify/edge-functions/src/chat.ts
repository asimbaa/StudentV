import { Context } from '@netlify/edge-functions';
import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Content-Type': 'application/json'
};

export default async function handler(req: Request, context: Context) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    // Validate API key first
    const apiKey = Deno.env.get('OPENAI_API_KEY')?.trim();
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // Parse and validate request body
    const { messages, model = 'gpt-4-turbo-preview', ...params } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      ...params
    });

    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Chat function error:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to process chat request',
      type: 'server_error'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
