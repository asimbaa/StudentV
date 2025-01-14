import { type Response } from '@/lib/types/api';
import { openAIService } from '../api/openai';

export class ChatProcessor {
  private static instance: ChatProcessor;
  private processingQueue: Promise<any> = Promise.resolve();

  private constructor() {}

  static getInstance(): ChatProcessor {
    if (!ChatProcessor.instance) {
      ChatProcessor.instance = new ChatProcessor();
    }
    return ChatProcessor.instance;
  }

  async processMessage(message: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.processingQueue = this.processingQueue
        .then(() => this.makeRequest(message))
        .then(resolve)
        .catch(reject);
    });
  }

  private async makeRequest(message: string): Promise<Response> {
    try {
      // Validate API key first
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim();
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await openAIService.chat([{
        role: 'system',
        content: 'You are an expert AI immigration assistant helping with Australian student visas.'
      }, {
        role: 'user',
        content: message
      }], false);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process message');
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('AI features are currently unavailable. Please check your OpenAI API key configuration.');
      }
      console.error('Chat processing error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('An unexpected error occurred while processing the message');
    }
  }
}
