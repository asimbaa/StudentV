interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class JsonRequestHandler {
  private static instance: JsonRequestHandler;
  private controller: AbortController | null = null;

  private constructor() {}

  static getInstance(): JsonRequestHandler {
    if (!JsonRequestHandler.instance) {
      JsonRequestHandler.instance = new JsonRequestHandler();
    }
    return JsonRequestHandler.instance;
  }

  async fetchJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
      retries = 3,
      retryDelay = 1000
    } = options;

    let attempt = 0;

    while (attempt < retries) {
      try {
        // Cancel any existing request
        this.cancelRequest();
        this.controller = new AbortController();

        const timeoutId = setTimeout(() => this.controller?.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: this.controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        return data as T;

      } catch (error) {
        attempt++;
        
        if (attempt === retries) {
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      } finally {
        this.controller = null;
      }
    }

    throw new Error('Request failed after retries');
  }

  cancelRequest(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}

export const jsonRequestHandler = JsonRequestHandler.getInstance();
