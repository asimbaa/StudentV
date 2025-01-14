import { Context } from '@netlify/edge-functions';
import OpenAI from 'openai';
import { RateLimiter } from './utils/rateLimiter';

const rateLimiter = new RateLimiter(60, 60000); // 60 requests per minute

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Content-Type': 'application/json'
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

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
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimiter.allowRequest(clientIP)) {
      return new Response(JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        type: 'rate_limit_error'
      }), {
        status: 429,
        headers: corsHeaders
      });
    }

    // Validate API key first
    const apiKey = Deno.env.get('OPENAI_API_KEY')?.trim();
    if (!apiKey) {
      console.error('[Edge Function] OpenAI API key missing in environment');
      return new Response(JSON.stringify({ 
        error: 'Service temporarily unavailable',
        type: 'CONFIGURATION_ERROR',
        details: 'API key not configured'
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
      console.error('[Edge Function] Invalid OpenAI API key format');
      return new Response(JSON.stringify({ 
        error: 'Service configuration error',
        type: 'INVALID_API_KEY',
        details: 'API key format is invalid'
      }), {
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
    const openai = new OpenAI({
      apiKey: apiKey,
      defaultHeaders: {
        'User-Agent': 'StudentVisaAI/1.0',
        'X-Request-ID': context.requestId
      }
    });

    // Validate response format
    const responseFormat = {
      type: 'json_object' as const
    };

    // Call OpenAI API with retries
    let completion;
    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
      try {
        completion = await openai.chat.completions.create({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 4096,
          response_format: responseFormat,
          ...params
        });
        break;
      } catch (error) {
        attempts++;
        if (attempts === MAX_RETRIES) throw error;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      }
    }

    // Validate response before sending
    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    // Verify JSON content
    try {
      JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      throw new Error('Invalid JSON in OpenAI response content');
    }

    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Chat function error:', error);
    
    // Enhanced error handling
    const errorResponse = {
      error: error instanceof Error ? error.message : 'Failed to process chat request',
      type: 'server_error',
      timestamp: new Date().toISOString(),
      requestId: context.requestId
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: corsHeaders
    });
  }
}
      }
    });

    // Call OpenAI API with retries
    let completion;
    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
      try {
        completion = await openai.chat.completions.create({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 4096,
          response_format: { type: "json_object" },
          ...params
        });
        break;
      } catch (error) {
        attempts++;
        if (attempts === MAX_RETRIES) throw error;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      }
    }

    // Validate response before sending
    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    // Verify JSON content
    try {
      JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      throw new Error('Invalid JSON in OpenAI response content');
    }

    // Validate response before sending
    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    // Verify JSON content
    try {
      JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      throw new Error('Invalid JSON in OpenAI response content');
    }

    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Chat function error:', error);
    
    // Enhanced error handling
    const errorResponse = {
      error: error instanceof Error ? error.message : 'Failed to process chat request',
      type: 'server_error',
      timestamp: new Date().toISOString(),
      requestId: context.requestId
    };

    return new Response(JSON.stringify({ 
      ...errorResponse
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
