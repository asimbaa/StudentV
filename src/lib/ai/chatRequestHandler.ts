import { API_CONFIG } from './config/constants';
import { OPENAI_CONFIG } from './config/openai';
import { OpenAIError } from './utils/errorHandler';
import type { Message } from './types';

class ChatRequestHandler {
  private static instance: ChatRequestHandler;
  private lastRequestTime: number = 0;
  private controller: AbortController;

  private constructor() {
    this.lastRequestTime = 0;
    this.controller = new AbortController();
  }

  static getInstance(): ChatRequestHandler {
    if (!ChatRequestHandler.instance) {
      ChatRequestHandler.instance = new ChatRequestHandler();
    }
    return ChatRequestHandler.instance;
  }

  async sendChatRequest(messages: Message[]): Promise<string> {
    if (!messages?.length) {
      throw new OpenAIError('No messages provided', 400);
    }

    // Validate API URL
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl?.trim()) {
      throw new OpenAIError(
        'API endpoint not configured',
        500,
        'CONFIGURATION_ERROR'
      );
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < API_CONFIG.rateLimit.delayMs) {
      await new Promise(resolve => 
        setTimeout(resolve, API_CONFIG.rateLimit.delayMs - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = now;

    // Cancel any existing request
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        signal: this.controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Request-ID': `req_${Date.now()}`
        },
        body: JSON.stringify({
          messages,
          model: OPENAI_CONFIG.model,
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 4096
        }),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData;
        
        try {
          if (contentType?.includes('application/json')) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            throw new OpenAIError(
              'Invalid response format from server',
              response.status,
              'INVALID_CONTENT_TYPE',
              text
            );
          }
        } catch (parseError) {
          throw new OpenAIError(
            'Failed to parse error response',
            response.status,
            'PARSE_ERROR'
          );
        }

        throw new OpenAIError(
          errorData?.error?.message || 'Failed to process request',
          response.status,
          errorData?.error?.type || 'API_ERROR'
        );
      }

      // Parse successful response
      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new OpenAIError(
          'Failed to parse JSON response',
          500,
          'PARSE_ERROR',
          error instanceof Error ? error.message : 'Unknown parsing error'
        );
      }

      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new OpenAIError('Empty response from service', 500);
      }

      // Validate JSON content
      try {
        JSON.parse(content);
      } catch (error) {
        throw new OpenAIError(
          'Invalid JSON in response content',
          500,
          'PARSE_ERROR'
        );
      }

      return content;
    } catch (error) {
      if (error instanceof OpenAIError) {
        throw error;
      }
      if (error instanceof SyntaxError) {
        throw new OpenAIError(
          'Invalid JSON response',
          500,
          'PARSE_ERROR'
        );
      }
      throw new OpenAIError(
        'Failed to process request',
        500,
        'REQUEST_ERROR'
      );
    }
  }
}

export const chatRequestHandler = ChatRequestHandler.getInstance();
