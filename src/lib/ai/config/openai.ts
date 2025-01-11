import { type OpenAIConfig } from '../types/openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const orgId = import.meta.env.VITE_OPENAI_ORG_ID?.trim();

export const OPENAI_CONFIG: OpenAIConfig = {
  baseURL: '/.netlify/functions/openai',
  model: 'gpt-4-turbo-preview',
  apiKey: apiKey?.trim(),
  orgId,
  isConfigured: Boolean(apiKey?.trim()),
  defaultParams: {
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false
  },
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  headers: { 'Content-Type': 'application/json' }
};