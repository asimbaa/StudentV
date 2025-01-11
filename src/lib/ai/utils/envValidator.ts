import { OpenAIError } from './errorHandler';

export function validateEnvironment() {
  const apiKey = import.meta.env.OPENAI_API_KEY?.trim();
  
  if (!apiKey) {
    throw new OpenAIError(
      'Please add your OpenAI API key in the settings to enable AI features',
      401,
      'CONFIGURATION_ERROR'
    );
  }

  if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
    throw new OpenAIError(
      'Invalid API key format. Please check your OpenAI API key',
      401,
      'CONFIGURATION_ERROR'
    );
  }

  return {
    apiKey,
    orgId: import.meta.env.VITE_OPENAI_ORG_ID?.trim(),
    isValid: true
  };
}

export function getApiConfig() {
  const env = validateEnvironment();
  return {
    baseURL: '/.netlify/functions/openai',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.apiKey}`,
      ...(env.orgId ? { 'OpenAI-Organization': env.orgId } : {}),
      'Cache-Control': 'no-store'
    }
  };
}