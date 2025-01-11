export function validateApiKey(key?: string): boolean {
  if (!key?.trim()) {
    if (import.meta.env.DEV) {
      console.error('[DEV] OpenAI API key not found');
    }
    return false;
  }

  const trimmedKey = key.trim();
  if (!trimmedKey.startsWith('sk-') || trimmedKey.length < 40) {
    if (import.meta.env.DEV) {
      console.error('[DEV] Invalid OpenAI API key format');
    }
    return false;
  }

  return true;
}

export function validateResponse(response: Response): void {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (!contentType?.includes('application/json')) {
    throw new Error('Invalid response format: expected JSON');
  }
}

export function validateJsonStructure(data: any): void {
  if (!data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid response structure');
  }
}