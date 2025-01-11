import type { OpenAIRequest } from '../types/openai';
import { OpenAIError } from './errorHandler';

export function formatJSONRequest(data: Partial<OpenAIRequest>): string {
  try {
    // Validate required fields
    if (!data.messages || !data.model) {
      throw new OpenAIError('Missing required fields: messages and model', 400);
    }

    const request: OpenAIRequest = {
      model: data.model,
      messages: data.messages,
      response_format: {
        type: 'json_object'  // Explicitly request JSON response
      },
      temperature: data.temperature ?? 0.7,
      max_tokens: data.max_tokens ?? 4096,
      stream: data.stream ?? false
    };

    // Validate JSON structure
    try {
      return JSON.stringify(request);
    } catch (error) {
      throw new OpenAIError('Failed to serialize request to JSON', 400);
    }
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }
    throw new OpenAIError('Failed to format request', 500);
  }
}

export function validateRequestBody(body: any): void {
  if (!body?.messages || !Array.isArray(body.messages)) {
    throw new OpenAIError('Messages array is required', 400);
  }

  if (!body.model) {
    throw new OpenAIError('Model is required', 400);
  }

  // Validate message format
  body.messages.forEach((message: any, index: number) => {
    if (!message.role || !message.content) {
      throw new OpenAIError(
        `Invalid message at index ${index}: missing role or content`,
        400
      );
    }
    if (!['system', 'user', 'assistant'].includes(message.role)) {
      throw new OpenAIError(
        `Invalid message role at index ${index}: ${message.role}`,
        400
      );
    }
  });
}