import { ASSISTANT_CONFIG } from '../ai/assistantConfig';
import { chatRequestHandler } from '../ai/chatRequestHandler';
import { OpenAIError } from '../ai/utils/errorHandler';
import type { Message } from '../ai/types';

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
    if (this.isInitialized) {
      return [{ 
        role: 'assistant', 
        content: this.WELCOME_MESSAGE,
        timestamp: Date.now()
      }];
    }

    try {
      // Validate environment
      if (!import.meta.env.VITE_API_URL?.trim()) {
        throw new OpenAIError(
          'Chat service is currently unavailable',
          401
        );
      }

      this.isInitialized = true;
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
        content: 'Sorry, I\'m currently unavailable. Please try again in a few moments.',
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
      const response = await chatRequestHandler.sendChatRequest([
        {
          role: 'system',
          content: ASSISTANT_CONFIG.instructions
        },
        {
          role: 'user',
          content: message
        }
      ]);

      // Validate response
      if (!response) {
        throw new OpenAIError('Empty response from service', 500);
      }

      try {
        // Verify response is valid JSON
        JSON.parse(response);
        return response;
      } catch (error) {
        throw new OpenAIError('Invalid response format', 500);
      }
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