export const API_CONFIG = {
  baseURL: '/.netlify/edge-functions/chat',
  defaultModel: 'gpt-4-turbo-preview',
  maxTokens: 4096,
  temperature: 0.7,
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  rateLimit: {
    maxRequests: 60,
    windowMs: 60000,
    delayMs: 500
  }
} as const;

export const RESPONSE_FORMATS = {
  json: { type: 'json_object' } as const,
  text: { type: 'text' } as const
} as const;

export const ERROR_MESSAGES = {
  missingApiKey: import.meta.env.DEV ? '[DEV] OpenAI API key not found in environment variables' : 'AI features are currently unavailable',
  invalidApiKey: import.meta.env.DEV ? '[DEV] Invalid OpenAI API key format' : 'AI features are currently unavailable',
  endpointNotFound: import.meta.env.DEV ? '[DEV] API endpoint not found at configured URL' : 'Service temporarily unavailable',
  networkError: 'Network error - please check your connection',
  timeout: 'The request took too long to process. Please try again.',
  parseError: 'Failed to process response',
  emptyResponse: 'Empty response from AI service',
  rateLimited: 'Service is busy. Please wait a moment and try again.',
  serverError: 'Service temporarily unavailable'
} as const;