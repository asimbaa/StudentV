import { OpenAIError } from './errorHandler';
import { sanitizeJsonString, extractJsonFromStream } from './jsonValidator';

export class StreamParser {
  private buffer = '';
  private decoder = new TextDecoder();

  parseChunk(chunk: Uint8Array): string | null {
    this.buffer += this.decoder.decode(chunk, { stream: true });
    return this.extractCompleteJson();
  }

  private extractCompleteJson(): string | null {
    const json = extractJsonFromStream(this.buffer);
    if (json) {
      // Remove processed JSON from buffer
      this.buffer = this.buffer.slice(this.buffer.lastIndexOf('}') + 1);
      return sanitizeJsonString(json);
    }
    return null;
  }

  finalize(): string | null {
    this.buffer += this.decoder.decode(); // Final decode
    return this.extractCompleteJson();
  }

  reset(): void {
    this.buffer = '';
  }
}

export async function* streamJsonResponse(response: Response): AsyncGenerator<string> {
  if (!response.body) {
    throw new OpenAIError('Empty response body', 500, 'EMPTY_RESPONSE');
  }

  const reader = response.body.getReader();
  const parser = new StreamParser();

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        const finalJson = parser.finalize();
        if (finalJson) {
          yield finalJson;
        }
        break;
      }

      const json = parser.parseChunk(value);
      if (json) {
        yield json;
      }
    }
  } finally {
    reader.releaseLock();
    parser.reset();
  }
}
