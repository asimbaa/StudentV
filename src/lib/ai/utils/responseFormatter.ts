import { OpenAIError } from './errorHandler';
import { validateJsonStructure } from './jsonValidator';
import type { OpenAIResponse } from '../types/openai';

export function formatOpenAIResponse(data: any): OpenAIResponse {
  try {
    validateJsonStructure(data);
    
    return {
      id: data.id,
      object: data.object,
      created: data.created,
      model: data.model,
      choices: data.choices.map((choice: any) => ({
        index: choice.index,
        message: {
          role: choice.message.role,
          content: choice.message.content
        },
        finish_reason: choice.finish_reason
      })),
      usage: data.usage
    };
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }
    throw new OpenAIError(
      'Failed to format OpenAI response',
      500,
      'FORMAT_ERROR'
    );
  }
}

export function extractMessageContent(response: OpenAIResponse): string {
  const content = response?.choices?.[0]?.message?.content;
  if (!content) {
    throw new OpenAIError(
      'No message content in response',
      500,
      'EMPTY_CONTENT'
    );
  }
  return content;
}