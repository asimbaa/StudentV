// Performance marks
export function markPerformance(name: string, data?: Record<string, any>) {
  if (import.meta.env.DEV) {
    performance.mark(name);
    // Clear old marks to prevent memory leaks
    const oldMarks = performance.getEntriesByType('mark')
      .filter(mark => mark.name !== name && Date.now() - mark.startTime > 60000);
    oldMarks.forEach(mark => performance.clearMarks(mark.name));

    if (data) {
      console.debug(`[Performance] ${name}:`, data);
    }
  }
}

// Measure between marks
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (import.meta.env.DEV) {
    try {
      // Clear old measures to prevent memory leaks
      const oldMeasures = performance.getEntriesByType('measure')
        .filter(measure => measure.name !== name && Date.now() - measure.startTime > 60000);
      oldMeasures.forEach(measure => performance.clearMeasures(measure.name));

      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name).pop();
      if (measure) {
        console.debug(`[Performance] ${name}: ${Math.round(measure.duration)}ms`);
      }
    } catch (error) {
      console.warn(`[Performance] Failed to measure ${name}:`, error);
    }
  }
}

// Measure component render time
export function measureRenderTime(componentName: string) {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    if (import.meta.env.DEV) {
      console.debug(`[Performance] ${componentName} rendered in ${Math.round(endTime - startTime)}ms`);
    }
  };
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let waiting = false;
  
  return function throttledFunction(...args: Parameters<T>) {
    if (!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// Measure API response time
export async function measureApiResponse<T>(
  apiCall: () => Promise<T>,
  apiName: string
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const endTime = performance.now();
    if (import.meta.env.DEV) {
      console.debug(`[API] ${apiName} completed in ${Math.round(endTime - startTime)}ms`);
    }
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`[API] ${apiName} failed after ${Math.round(endTime - startTime)}ms:`, error);
    throw error;
  }
}

// Track route changes
export function trackRouteChange(from: string, to: string) {
  markPerformance('route-change', { from, to });
  
  // Track page load metrics
  if ('performance' in window) {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    const metrics = {
      loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
      firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime
    };

    console.debug('[Performance] Route change metrics:', metrics);
  }
}

// Track component mount/unmount
export function trackComponentLifecycle(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    if (import.meta.env.DEV) {
      console.debug(`[Performance] ${componentName} lifecycle: ${Math.round(duration)}ms`);
    }
  };
}

// Track API calls
export async function trackApiCall<T>(
  apiCall: () => Promise<T>,
  name: string
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    if (import.meta.env.DEV) {
      console.debug(`[API] ${name} completed in ${Math.round(duration)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`[API] ${name} failed after ${Math.round(duration)}ms:`, error);
    throw error;
  }
}