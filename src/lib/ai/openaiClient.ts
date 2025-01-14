import { OPENAI_CONFIG } from './openaiConfig';
import type { Message } from './types';
import { parseJSONResponse, parseStreamingResponse } from './utils/responseParser';
import { formatJSONRequest, validateRequestBody } from './utils/requestFormatter';

class OpenAIClient {
  private static instance: OpenAIClient;
  private controller: AbortController | null = null;
  private requestQueue: Promise<any> = Promise.resolve();
  private lastRequestTime: number = 0;
  private readonly MIN_REQUEST_INTERVAL = 500;

  private constructor() {
    this.lastRequestTime = 0;
  }

  static getInstance(): OpenAIClient {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAIClient();
    }
    return OpenAIClient.instance;
  }

  async validateConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${OPENAI_CONFIG.baseURL}`, {
        method: 'POST',
        headers: OPENAI_CONFIG.headers,
        body: JSON.stringify({
          endpoint: 'chat/completions',
          payload: {
            messages: [{ role: 'system', content: 'test' }],
            model: OPENAI_CONFIG.model
          }
        })
      });

      if (!response.ok) {
        console.warn('OpenAI API validation failed:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('OpenAI connection validation failed:', error);
      return false;
    }
  }

  async chat(messages: Message[]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.requestQueue = this.requestQueue
        .then(() => this.processChatRequest(messages))
        .then(resolve)
        .catch(reject);
    });
  }

  private async processChatRequest(messages: Message[]): Promise<string> {
    if (!navigator.onLine) {
      throw new Error('No internet connection available');
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

    // Cancel any existing request
    this.cancelRequest();
    this.controller = new AbortController();

    const timeout = setTimeout(() => {
      this.controller?.abort();
    }, OPENAI_CONFIG.timeout);

    try {
      validateRequestBody({ messages, model: OPENAI_CONFIG.model });
      
      const requestBody = formatJSONRequest({
        messages,
        model: OPENAI_CONFIG.model,
        response_format: { type: 'json_object' },
        ...OPENAI_CONFIG.defaultParams
      });

      const response = await fetch(`${OPENAI_CONFIG.baseURL}`, {
        method: 'POST',
        headers: {
          ...OPENAI_CONFIG.headers,
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json',
          'X-Request-ID': `req_${Date.now()}`
        },
        body: requestBody,
        signal: this.controller.signal
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData;
        
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { error: { message: 'Invalid response format from server' } };
        }
        
        throw new Error(
          errorData.error?.message || `HTTP error ${response.status}`
        );
      }

      let data;
      try {
        const responseText = await parseStreamingResponse(response);
        data = parseJSONResponse(responseText);
      } catch (error) {
        // Fallback to direct JSON parsing if streaming fails
        data = await response.json();
      }
      
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('Invalid or empty response from OpenAI API');
      }
      
      return content;
    } catch (error) {
      // Handle JSON parsing errors
      if (error instanceof SyntaxError) { 
        throw new Error('Failed to parse API response');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
      this.controller = null;
    }
  }

  cancelRequest() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}

export const openaiClient = OpenAIClient.getInstance();
