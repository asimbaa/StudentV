export class RateLimiter {
  private lastRequestTime = 0;
  private readonly minInterval: number;

  constructor(minInterval: number = 500) {
    this.minInterval = minInterval;
  }

  async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }
}