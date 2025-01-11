import { OpenAIResponse } from '../types/openai';

export function parseOpenAIResponse(response: string): OpenAIResponse {
  try {
    // Clean the response string - remove any non-JSON content
    const jsonStr = response.replace(/^[^{]*({.*})[^}]*$/, '$1');
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

export function validateOpenAIResponse(data: any): data is OpenAIResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.choices) &&
    data.choices.length > 0 &&
    typeof data.choices[0].message?.content === 'string'
  );
}

export function formatOpenAIRequest(data: any): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new Error('Failed to format OpenAI request as JSON');
  }
}