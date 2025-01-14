// Performance metrics collection
const metricsCollector = {
  track: (data: any) => {
    if (import.meta.env.DEV) {
      console.debug('[Metrics]', data);
    }
  }
};

// Track page load performance
export function trackPageLoad() {
  if ('performance' in window) {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');

    metricsCollector.track({
      name: 'page_load',
      value: navigationEntry.loadEventEnd - navigationEntry.startTime,
      tags: {
        firstPaint: String(paintEntries.find(entry => entry.name === 'first-paint')?.startTime),
        firstContentfulPaint: String(paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime),
        domInteractive: String(navigationEntry.domInteractive),
        domComplete: String(navigationEntry.domComplete)
      }
    });
  }
}

// Track component render time
export function trackRender(componentName: string, startTime: number) {
  const duration = performance.now() - startTime;
  metricsCollector.track({
    name: 'component_render',
    value: duration,
    tags: { 
      component: componentName,
      timestamp: String(Date.now()),
      route: window.location.pathname
    }
  });
}

// Track API response time
export function trackApiResponse(endpoint: string, duration: number, success: boolean, errorDetails?: string) {
  metricsCollector.track({
    name: 'api_response',
    value: duration,
    tags: {
      endpoint,
      success: String(success),
      error: errorDetails || '',
      timestamp: String(Date.now())
    }
  });
}

// Track resource loading
export function trackResourceLoad() {
  if ('performance' in window) {
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
      metricsCollector.track({
        name: 'resource_load',
        value: resource.duration,
        tags: {
          name: resource.name,
          size: String((resource as PerformanceResourceTiming).transferSize || 0),
          cached: String((resource as PerformanceResourceTiming).transferSize === 0)
        }
      });
    });
  }
}

// Track memory usage
export function trackMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    metricsCollector.track({
      name: 'memory_usage',
      value: memory.usedJSHeapSize,
      tags: {
        total: String(memory.totalJSHeapSize),
        limit: String(memory.jsHeapSizeLimit),
        timestamp: String(Date.now())
      }
    });
  }
}

// Track long tasks
export function observeLongTasks() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          metricsCollector.track({
            name: 'long_task',
            value: entry.duration,
            tags: {
              name: entry.name,
              timestamp: String(Date.now())
            }
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  }
}

// Track network status
export function trackNetworkStatus() {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    metricsCollector.track({
      name: 'network_status',
      value: 1,
      tags: {
        type: connection.effectiveType,
        downlink: String(connection.downlink),
        rtt: String(connection.rtt),
        saveData: String(connection.saveData)
      }
    });
  }
}
