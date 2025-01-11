export function validateEnv() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is missing');
  }

  if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
    throw new Error('Invalid OpenAI API key format');
  }

  // Validate other required environment variables
  const requiredEnvVars = ['PORT', 'CORS_ORIGIN'];
  const missing = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}