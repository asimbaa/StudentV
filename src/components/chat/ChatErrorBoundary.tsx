import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChatErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error logging in development
    if (import.meta.env.DEV) {
      console.error('Chat Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        openAIKey: import.meta.env.VITE_OPENAI_API_KEY ? 'Present' : 'Missing'
      });
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200 mb-2">Chat initialization failed</p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-red-300 whitespace-pre-wrap">
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-sm text-red-200 hover:text-red-100"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}