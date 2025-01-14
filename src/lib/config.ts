// Do not expose API key in frontend code
export const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
export const OPENAI_ORG_ID = import.meta.env.OPENAI_ORG_ID;

export function validateOpenAIKey(key?: string): boolean {
  if (!key?.trim()) return false;
  if (!key.startsWith('sk-')) return false;
  if (key.length < 40) return false;
  return true;
}

// AI configuration
export const AI_CONFIG = {
  model: 'gpt-4',
  temperature: 0.3,
  max_tokens: 4096,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  retries: 3,
  retryDelay: 1000,
  timeout: 30000
};
