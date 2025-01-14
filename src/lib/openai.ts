import { SYSTEM_PROMPTS } from './ai/config/prompts';
import { RESPONSE_FORMATS, ERROR_MESSAGES } from './ai/config/constants';
import { OpenAIError } from './ai/utils/errorHandler'; 
import { validateJsonStructure } from './ai/utils/jsonValidator'; 
import { validateMessages } from './ai/utils/requestValidator';
import type { OpenAIMessage, OpenAIResponse } from './ai/types/openai';

const API_URL = '/.netlify/functions/chat';
const TIMEOUT = 30000;

export async function chatWithGPT(
  message: string,
  context: keyof typeof SYSTEM_PROMPTS = 'immigration'
): Promise<string> {
  const messages: OpenAIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPTS[context] },
    { role: 'user', content: message }
  ];

  // Validate messages before sending
  validateMessages(messages);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    const response = await fetch(API_URL, { 
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-4-turbo-preview',
        response_format: RESPONSE_FORMATS.json,
        stream: false
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new OpenAIError(
          ERROR_MESSAGES.endpointNotFound,
          404,
          'ENDPOINT_NOT_FOUND'
        );
      }

      const contentType = response.headers.get('content-type');
      let errorData;
      
      try {
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
          if (errorData.error?.message) {
            throw new OpenAIError(errorData.error.message, response.status);
          }
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
        if (parseError instanceof OpenAIError) {
          throw parseError;
        }
        throw new OpenAIError(
          'Failed to parse API response',
          response.status,
          'PARSE_ERROR'
        );
      }
    }

    const data: OpenAIResponse = await response.json();
    validateJsonStructure(data);

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIError(ERROR_MESSAGES.emptyResponse, 500);
    }

    try {
      // Verify content is valid JSON
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }
      return content;
    } catch (error) {
      throw new OpenAIError(
        ERROR_MESSAGES.parseError,
        500,
        'PARSE_ERROR'
      );
    }
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new OpenAIError(ERROR_MESSAGES.timeout, 408);
      }
      throw new OpenAIError(error.message);
    }
    throw new OpenAIError(ERROR_MESSAGES.serverError);
  }
}
