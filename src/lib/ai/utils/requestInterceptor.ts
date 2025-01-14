import { OpenAIError } from './errorHandler';
import { FALLBACK_RESPONSES } from '../config/fallback';

export async function handleJsonResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  
  if (import.meta.env.DEV) {
    console.debug('Response headers:', {
      contentType,
      status: response.status,
      statusText: response.statusText
    });
  }

  if (!response?.ok) {
    if (contentType?.includes('text/html')) {
      await response.text();
      throw new OpenAIError(
        'Received HTML instead of JSON response', 
        response.status,
        'INVALID_CONTENT_TYPE'
      );
    }

    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      throw OpenAIError.fromResponse(response, errorData);
    }

    // Handle any other non-JSON error responses
    await response.text();
    throw new OpenAIError(
      FALLBACK_RESPONSES.error.unknown,
      response.status,
      'INVALID_RESPONSE'
    );
  }

  // Ensure JSON response
  if (!contentType?.includes('application/json')) {
    throw new OpenAIError(
      `Expected JSON response but received ${contentType || 'unknown'}`,
      500,
      'INVALID_CONTENT_TYPE'
    );
  }

  try {
    const data = await response.json();
    
    // Validate response structure
    if (!data?.choices?.[0]?.message?.content) {
      const text = await response.text();
      throw new OpenAIError(
        'Invalid response structure',
        500,
        'INVALID_STRUCTURE',
        text
      );
    }

    // Verify JSON content
    const content = data.choices[0].message.content;
    try {
      JSON.parse(content);
    } catch (error) {
      throw new OpenAIError(
        'Invalid JSON in response content',
        500,
        'PARSE_ERROR',
        content
      );
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      const responseText = await response.text();
      if (import.meta.env.DEV) {
        console.error('JSON Parse Error:', {
          error: error.message,
          responseText: responseText.substring(0, 200)
        });
      }
      throw new OpenAIError(
        'Failed to parse response as JSON',
        500,
        'PARSE_ERROR',
        responseText
      );
    }
    throw error;
  }
}
