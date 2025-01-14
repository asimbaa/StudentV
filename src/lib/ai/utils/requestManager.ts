export class RequestManager {
  private controller: AbortController | null = null;

  startRequest(): AbortController {
    this.cancelRequest();
    this.controller = new AbortController();
    return this.controller;
  }

  cancelRequest(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  isActive(): boolean {
    return this.controller !== null;
  }
}
