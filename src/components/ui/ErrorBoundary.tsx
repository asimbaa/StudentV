import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { trackError } from '@/lib/utils/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Track error with additional context
    trackError(error, {
      componentStack: errorInfo.componentStack,
      boundary: this.constructor.name,
      route: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', {
        error,
        componentStack: errorInfo.componentStack,
        route: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReport = () => {
    if (this.state.error && this.state.errorInfo) {
      const errorReport = {
        error: {
          name: this.state.error.name,
          message: this.state.error.message,
          stack: this.state.error.stack
        },
        componentStack: this.state.errorInfo.componentStack,
        route: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      // Send error report
      console.error('Error Report:', errorReport);
    }
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="p-6 max-w-lg mx-auto my-8">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-white/80 mb-6">
            We apologize for the inconvenience. Please try again or contact support if the issue persists.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <div className="mb-6 space-y-4">
              <pre className="p-4 bg-black/20 rounded-lg text-sm overflow-auto">
                {this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre className="p-4 bg-black/20 rounded-lg text-sm overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <Button onClick={this.handleRetry}>
              Try Again
            </Button>
            <Button variant="outline" onClick={this.handleReport}>
              Report Issue
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
