export interface OpenAIConfig {
  baseURL: string;
  model: string;
  responseFormat?: {
    type: 'json_object' | 'text'
  };
  apiKey: string | undefined;
  orgId: string | undefined;
  isConfigured: boolean;
  defaultParams: {
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    stream: boolean;
    response_format?: {
      type: 'json_object' | 'text'
    };
  };
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  response_format: {
    type: 'json_object' | 'text'
  };
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}