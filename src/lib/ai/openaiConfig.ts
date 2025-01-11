export const OPENAI_CONFIG = {
  baseURL: '/.netlify/functions/openai',
  model: 'gpt-4',
  apiKey: import.meta.env.OPENAI_API_KEY,
  orgId: import.meta.env.OPENAI_ORG_ID,
  defaultParams: {
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false
  },
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.OPENAI_API_KEY}`,
    'OpenAI-Organization': import.meta.env.OPENAI_ORG_ID || ''
  }
};