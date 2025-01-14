import { OPENAI_CONFIG } from '../ai/openaiConfig';
import type { Message } from '../ai/types';

class OpenAIService {
  private static instance: OpenAIService;
  private controller: AbortController | null = null;
  private requestQueue: Promise<any> = Promise.resolve();
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 500;

  private constructor() {}

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async chat(messages: Message[], stream = false): Promise<Response> {
    // Cancel any existing request
    this.cancelRequest();
    this.controller = new AbortController();
    
    // Validate API key
    const apiKey = OPENAI_CONFIG.apiKey?.trim();
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = now;

    return new Promise((resolve, reject) => {
      this.requestQueue = this.requestQueue.then(async () => {
        try {
          // Set timeout
          const timeout = setTimeout(() => {
            this.controller?.abort();
          }, OPENAI_CONFIG.timeout);

          const response = await fetch('/.netlify/functions/openai', {
            method: 'POST',
            headers: {
              ...OPENAI_CONFIG.headers
            },
            body: JSON.stringify({
              messages,
              model: OPENAI_CONFIG.model,
              stream
            }),
            signal: this.controller?.signal
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get AI response');
          }

          clearTimeout(timeout);
          resolve(response);
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              reject(new Error('Request timeout - please try again'));
              return;
            }
            reject(error);
            return;
          }
          reject(new Error('An unexpected error occurred'));
        } finally {
          this.controller = null;
        }
      });
    });
  }

  cancelRequest() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}

export const openAIService = OpenAIService.getInstance();
