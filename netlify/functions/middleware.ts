import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const RATE_LIMIT = {
  MAX_REQUESTS: 60,
  WINDOW_MS: 60000, // 1 minute
  requests: new Map<string, number>()
};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRequests = RATE_LIMIT.requests.get(ip) || 0;
  
  if (userRequests >= RATE_LIMIT.MAX_REQUESTS) {
    return true;
  }
  
  RATE_LIMIT.requests.set(ip, userRequests + 1);
  setTimeout(() => {
    RATE_LIMIT.requests.delete(ip);
  }, RATE_LIMIT.WINDOW_MS);
  
  return false;
}

export function withErrorHandler(handler: Handler): Handler {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      console.error('Function error:', error);

      if (error instanceof OpenAI.APIError) {
        return {
          statusCode: error.status || 500,
          body: JSON.stringify({
            error: error.message,
            type: error.type
          })
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error instanceof Error ? error.message : 'Internal server error'
        })
      };
    }
  };
}

export function validateRequest(handler: Handler): Handler {
  return async (event, context) => {
    // Get client IP
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';

    // Check rate limit
    if (isRateLimited(clientIP)) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'Too many requests. Please try again later.' })
      };
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key not configured' })
      };
    }

    // Validate content type
    const contentType = event.headers['content-type'];
    if (!contentType?.includes('application/json')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Content-Type must be application/json' })
      };
    }

    return handler(event, context);
  };
}
