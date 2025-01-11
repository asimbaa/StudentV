export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  allowRequest(clientId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing requests for this client
    let clientRequests = this.requests.get(clientId) || [];
    
    // Remove expired timestamps
    clientRequests = clientRequests.filter(timestamp => timestamp > windowStart);
    
    // Check if under limit
    if (clientRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add new request timestamp
    clientRequests.push(now);
    this.requests.set(clientId, clientRequests);
    
    return true;
  }
}