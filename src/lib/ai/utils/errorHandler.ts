export class OpenAIError extends Error {
  public details?: string;
  public retryable: boolean;

  constructor(
    message: string,
    public status: number = 500,
    public type?: string,
    public rawResponse?: string,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'OpenAIError';
    this.retryable = retryable;

    if (import.meta.env.DEV) {
      const debugMessage = [
        `[DEV] ${message}`,
        `Status: ${status}`,
        `Type: ${type || 'UNKNOWN'}`,
        `Retryable: ${this.retryable}`
      ].filter(Boolean).join('\n\n');
      
      this.message = debugMessage;
    }
  }

  static isConfigurationError(error: OpenAIError): boolean {
    return error.status === 401 && error.message.includes('configuration');
  }

  static fromResponse(response: Response, data: any): OpenAIError {
    let message = data?.error?.message || 'Unknown OpenAI error';
    let retryable = false;
    let details = '';
    let rawResponse: string | undefined;
    const debugInfo: Record<string, any> = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      endpoint: response.url,
      timestamp: new Date().toISOString()
    };
    
    // Enhance error messages for common issues
    if (response.status === 401) {
      message = import.meta.env.DEV 
        ? '[DEV] OpenAI API key is invalid or missing. Please add your API key in the settings.'
        : 'Authentication failed. Please try again later.';
      debugInfo.authError = 'API key validation failed';
    } else if (response.status === 429) {
      message = import.meta.env.DEV
        ? '[DEV] OpenAI rate limit exceeded. Consider implementing rate limiting.'
        : 'Service is busy. Please try again in a few moments.';
      debugInfo.rateLimitInfo = {
        retryAfter: response.headers.get('retry-after'),
        limit: response.headers.get('x-ratelimit-limit'),
        remaining: response.headers.get('x-ratelimit-remaining')
      };
      retryable = true;
    } else if (response.status >= 500) {
      message = import.meta.env.DEV
        ? `[DEV] OpenAI server error (${response.status}): ${data?.error?.message || 'Unknown error'}`
        : 'Service temporarily unavailable. Please try again later.';
      debugInfo.serverError = data?.error || 'Unknown server error';
      retryable = true;
    }

    // Store raw response for non-JSON responses
    if (typeof data === 'string') {
      if (data.includes('<!DOCTYPE html>') || response.headers.get('content-type')?.includes('text/html')) {
        rawResponse = data;
        debugInfo.invalidResponseFormat = 'Received HTML instead of JSON';
      }
    }
    
    const error = new OpenAIError(
      message,
      response.status,
      data?.error?.type
    );

    if (import.meta.env.DEV) {
      error.details = details;
      console.error('OpenAI Error:', {
        status: response.status,
        message,
        details,
        type: data?.error?.type,
        retryable,
        debugInfo,
        rawResponse: rawResponse?.substring(0, 500) // Log first 500 chars of raw response
      });
    }
    return error;
  }
  
  static handleError(error: unknown): OpenAIError {
    if (error instanceof OpenAIError) {
      return error;
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return new OpenAIError(
        'Network error - please check your connection',
        503,
        'NETWORK_ERROR',
        undefined,
        true
      );
    }
    
    if (error instanceof SyntaxError) {
      return new OpenAIError(
        import.meta.env.DEV ? 
          `[DEV] JSON parsing error: ${error.message}` :
          'Failed to process API response',
        500,
        'PARSE_ERROR',
        undefined,
        true
      );
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new OpenAIError(
          'Request timeout - please try again',
          408,
          'TIMEOUT',
          undefined,
          true
        );
      }
      return new OpenAIError(error.message);
    }

    return new OpenAIError('An unexpected error occurred');
  }

  static isRateLimitError(error: OpenAIError): boolean {
    return error.status === 429;
  }

  static isAuthError(error: OpenAIError): boolean {
    return error.status === 401;
  }

  static isRetryableError(error: OpenAIError): boolean {
    return error.retryable || error.status >= 500 || error.status === 429;
  }
}
