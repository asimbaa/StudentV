export function validateMessages(messages: any[]): void {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required');
  }

  messages.forEach((message, index) => {
    if (!message.role || !message.content) {
      throw new Error(`Invalid message at index ${index}: missing role or content`);
    }
    if (!['system', 'user', 'assistant'].includes(message.role)) {
      throw new Error(`Invalid message role at index ${index}: ${message.role}`);
    }
  });
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

export function validateJsonContent(content: string): void {
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure');
    }
  } catch (error) {
    throw new Error('Invalid JSON in response');
  }
}