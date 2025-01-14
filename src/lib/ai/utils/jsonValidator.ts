import { OpenAIError } from './errorHandler';

export function validateJsonStructure(data: any): void {
  if (!data || typeof data !== 'object') {
    throw new OpenAIError('Invalid JSON structure: expected object', 500, 'VALIDATION_ERROR');
  }

  if (!Array.isArray(data.choices)) {
    throw new OpenAIError('Invalid JSON structure: missing choices array', 500, 'VALIDATION_ERROR');
  }

  if (!data.choices[0]?.message?.content) {
    throw new OpenAIError('Invalid JSON structure: missing message content', 500, 'VALIDATION_ERROR');
  }

  try {
    // Verify content is valid JSON
    JSON.parse(data.choices[0].message.content);
  } catch (error) {
    throw new OpenAIError(
      'Invalid JSON in message content',
      500,
      'VALIDATION_ERROR',
      data.choices[0]?.message?.content
    );
  }
}

export function sanitizeJsonString(input: string): string {
  if (!input.trim()) {
    throw new OpenAIError('Empty JSON string', 500, 'EMPTY_RESPONSE');
  }

  // Remove control characters and normalize whitespace
  const sanitized = input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Remove any non-JSON content before the first {
  const startIndex = sanitized.indexOf('{');
  if (startIndex === -1) {
    throw new OpenAIError(
      'No JSON object found in response',
      500,
      'PARSE_ERROR',
      sanitized
    );
  }
  
  // Remove any content after the last }
  const endIndex = sanitized.lastIndexOf('}');
  if (endIndex === -1) {
    throw new OpenAIError(
      'Incomplete JSON object in response',
      500,
      'PARSE_ERROR',
      sanitized
    );
  }
  
  const jsonStr = sanitized.slice(startIndex, endIndex + 1);

  // Validate JSON structure
  try {
    JSON.parse(jsonStr);
    return jsonStr;
  } catch (error) {
    throw new OpenAIError(
      'Invalid JSON structure',
      500,
      'PARSE_ERROR'
    );
  }
}

export function extractJsonFromStream(chunk: string): string | null {
  const jsonMatch = chunk.match(/\{(?:[^{}]|{[^{}]*})*\}/g);
  return jsonMatch ? jsonMatch[jsonMatch.length - 1] : null;
}
