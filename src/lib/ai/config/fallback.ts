// Fallback responses when OpenAI is unavailable
export const FALLBACK_RESPONSES = {
  welcome: "Welcome! I'm your AI Immigration Assistant. Note: Some AI features are currently limited.",
  error: {
    configuration: "AI features are currently unavailable. Please check back later.",
    network: "Unable to connect to AI services. Please check your connection and try again.",
    timeout: "The request timed out. Please try again.",
    unknown: "An unexpected error occurred. Please try again or contact support.",
    rateLimited: "Too many requests. Please wait a moment before trying again.",
    serverError: "The AI service is temporarily unavailable. Please try again later.",
    invalidResponse: "Received an invalid response from the server. Please try again."
  }
};

export const FALLBACK_SUGGESTIONS = [
  "What documents do I need for a student visa?",
  "How much are the visa fees?",
  "What are the English requirements?",
  "Tell me about studying in Australia"
];
