import { OPENAI_CONFIG } from '../config/openai';
import { OpenAIError } from './errorHandler';

export async function testOpenAIConnection(): Promise<{
  isValid: boolean;
  error?: string;
  details?: string;
}> {
  const apiKey = OPENAI_CONFIG.apiKey;

  // Detailed validation checks
  if (!apiKey) {
    return {
      isValid: false,
      error: 'API_KEY_MISSING',
      details: '[DEV] VITE_OPENAI_API_KEY environment variable is not set'
    };
  }

  const trimmedKey = apiKey.trim();
  if (!trimmedKey.startsWith('sk-')) {
    return {
      isValid: false,
      error: 'API_KEY_INVALID_FORMAT',
      details: '[DEV] API key must start with "sk-"'
    };
  }

  if (trimmedKey.length < 40) {
    return {
      isValid: false, 
      error: 'API_KEY_INVALID_LENGTH',
      details: '[DEV] API key must be at least 40 characters'
    };
  }

  try {
    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...OPENAI_CONFIG.headers
      },
      body: JSON.stringify({
        messages: [{ role: 'system', content: 'test' }],
        model: OPENAI_CONFIG.model
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new OpenAIError(
        error.error?.message || 'API validation failed',
        response.status
      );
    }

    return { isValid: true };
  } catch (error) {
    if (error instanceof OpenAIError) {
      return {
        isValid: false,
        error: 'API_CONNECTION_ERROR',
        details: `[DEV] ${error.message} (Status: ${error.status})`
      };
    }
    return {
      isValid: false,
      error: 'UNKNOWN_ERROR',
      details: `[DEV] ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    };
  }
}
