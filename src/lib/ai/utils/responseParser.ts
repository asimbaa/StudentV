import { OpenAIError } from './errorHandler';
import { validateJsonStructure } from './jsonValidator';
import type { OpenAIResponse } from '../types/openai';

export async function parseStreamingResponse(response: Response): Promise<string> {
  if (!response.body) {
    throw new OpenAIError('Empty response body', 500, 'EMPTY_RESPONSE');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Try to extract complete JSON objects
      const jsonMatch = buffer.match(/\{(?:[^{}]|{[^{}]*})*\}/g);
      if (jsonMatch) {
        result = jsonMatch[jsonMatch.length - 1];
        buffer = buffer.slice(buffer.lastIndexOf('}') + 1);
      }
    }

    // Final decode
    buffer += decoder.decode();
    const finalJson = buffer.match(/\{(?:[^{}]|{[^{}]*})*\}/g);
    if (finalJson) {
      result = finalJson[finalJson.length - 1];
    }

    if (!result) {
      throw new OpenAIError('No valid JSON found in response', 500, 'PARSE_ERROR');
    }

    // Validate and sanitize the JSON
    try {
      const sanitized = result.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      const parsed = JSON.parse(sanitized);
      validateJsonStructure(parsed);
      return sanitized;
    } catch (error) {
      throw new OpenAIError(
        'Invalid JSON structure',
        500,
        'PARSE_ERROR'
      );
    }
  } finally {
    reader.releaseLock();
  }
}

export function parseJSONResponse(text: string): OpenAIResponse {
  if (!text.trim()) {
    throw new OpenAIError('Empty response from OpenAI', 500, 'EMPTY_RESPONSE');
  }

  try {
    // Clean the response string
    const sanitized = text
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const data = JSON.parse(sanitized);

    if (!isValidOpenAIResponse(data)) {
      throw new OpenAIError('Invalid response structure', 500, 'INVALID_STRUCTURE');
    }

    return data;
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }
    throw new OpenAIError(
      'Failed to parse response as JSON',
      500,
      'PARSE_ERROR',
      text
    );
  }
}

function isValidOpenAIResponse(data: any): data is OpenAIResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.choices) &&
    data.choices.length > 0 &&
    typeof data.choices[0].message?.content === 'string'
  );
}