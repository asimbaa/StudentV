import { ASSISTANT_CONFIG } from './assistantConfig';
import { chatRequestHandler } from './chatRequestHandler';
import { OpenAIError } from './utils/errorHandler';
import type { Message } from './types';
import { FALLBACK_RESPONSES } from './config/fallback';

class ChatService {
  private static instance: ChatService;
  private isInitialized: boolean = false;
  private readonly WELCOME_MESSAGE = "Hi! I'm your AI Immigration Assistant. How can I help you with your Australian student visa journey?";

  private constructor() {
    this.isInitialized = false;
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async initializeChat(): Promise<Message[]> {
    try {
      // Validate environment
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new OpenAIError(
          'API endpoint not configured',
          500,
          'CONFIGURATION_ERROR'
        );
      }

      if (!this.isInitialized) {
        // Test connection with a simple request
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Request-ID': `req_${Date.now()}`
          },
          body: JSON.stringify({
            messages: [{ role: 'system', content: 'test' }],
            model: 'gpt-4-turbo-preview',
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 4096
          })
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new OpenAIError(
              'API endpoint not found',
              404,
              'ENDPOINT_NOT_FOUND'
            );
          }

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
              'Failed to parse API response',
              response.status,
              'PARSE_ERROR'
            );
          }

          throw new OpenAIError(
            errorData.error?.message || 'Failed to initialize chat service',
            response.status,
            errorData.error?.type || 'INITIALIZATION_ERROR'
          );
        }

        this.isInitialized = true;
      }

      return [{ 
        role: 'assistant', 
        content: this.WELCOME_MESSAGE,
        timestamp: Date.now()
      }];
    } catch (error) {
      console.error('Chat initialization failed:', error);
      this.isInitialized = false;

      return [{
        role: 'assistant',
        content: import.meta.env.DEV
          ? `[DEV] Chat initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration.`
          : FALLBACK_RESPONSES.error.configuration,
        timestamp: Date.now()
      }];
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.isInitialized) {
      const initResult = await this.initializeChat();
      if (!initResult[0]?.content || initResult[0].content.includes('unavailable')) {
        throw new OpenAIError('Service temporarily unavailable', 500);
      }
    }

    try {
      return await chatRequestHandler.sendChatRequest([
        {
          role: 'system',
          content: ASSISTANT_CONFIG.instructions
        },
        {
          role: 'user',
          content: message
        }
      ]);
    } catch (error) {
      if (error instanceof OpenAIError) {
        throw error;
      }
      throw new OpenAIError(
        'Failed to process message',
        500,
        'PROCESSING_ERROR'
      );
    }
  }

  async endChat(): Promise<void> {
    this.isInitialized = false;
  }
}

export const chatService = ChatService.getInstance();