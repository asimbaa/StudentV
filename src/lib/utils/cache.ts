interface CacheOptions {
  maxAge?: number;
  maxSize?: number;
  onEvict?: (key: string, value: any) => void;
}

class Cache<T> {
  private cache: Map<string, { value: T; timestamp: number; size: number }>;
  private maxAge: number;
  private maxSize: number;
  private currentSize: number;
  private onEvict?: (key: string, value: T) => void;
  private lastCleanup: number = Date.now();
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxAge = options.maxAge || 5 * 60 * 1000; // 5 minutes
    this.maxSize = options.maxSize || 100;
    this.currentSize = 0;
    this.onEvict = options.onEvict;
  }

  set(key: string, value: T): void {
    // Run cleanup if needed
    if (Date.now() - this.lastCleanup > this.CLEANUP_INTERVAL) {
      this.cleanup();
    }

    // Calculate entry size
    const size = this.calculateSize(value);

    // Evict entries if cache would exceed max size
    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      this.evictOldest();
    }

    // Add new entry
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      size
    });
    this.currentSize += size;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    const now = Date.now();
    if (now - entry.timestamp > this.maxAge) {
      this.delete(key);
      return undefined;
    }

    // Update timestamp on access
    entry.timestamp = now;
    return entry.value;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.delete(key);
      }
    }
    this.lastCleanup = now;
  }

  delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
      this.onEvict?.(key, entry.value);
    }
  }

  clear(): void {
    this.cache.forEach((entry, key) => {
      this.onEvict?.(key, entry.value);
    });
    this.cache.clear();
    this.currentSize = 0;
  }

  private calculateSize(value: T): number {
    if (value instanceof Blob) {
      return value.size;
    }
    if (typeof value === 'string') {
      return value.length * 2; // Approximate size in bytes
    }
    return 1; // Default size for other types
  }

  private evictOldest(): void {
    const oldestEntry = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .shift();

    if (oldestEntry?.[0]) {
      const [key] = oldestEntry;
      this.delete(key);
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      currentSize: this.currentSize,
      maxSize: this.maxSize,
      oldestEntry: Math.min(...Array.from(this.cache.values()).map(e => e.timestamp)),
      newestEntry: Math.max(...Array.from(this.cache.values()).map(e => e.timestamp))
    };
  }
}

// Create specialized caches
export const responseCache = new Cache<string>({
  maxAge: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
  onEvict: (key, value) => {
    if (import.meta.env.DEV) {
      console.debug(`Cache entry evicted: ${key}, size: ${value.length} bytes`);
    }
  }
});

export const documentCache = new Cache<Blob>({
  maxAge: 30 * 60 * 1000, // 30 minutes
  maxSize: 50 * 1024 * 1024, // 50MB
  onEvict: (key) => {
    if (import.meta.env.DEV) {
      console.debug(`Document cache entry evicted: ${key}`);
    }
  }
});
