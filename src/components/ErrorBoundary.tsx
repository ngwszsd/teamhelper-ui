// GlobalErrorBoundary.tsx
import React, { Component, type ReactNode } from 'react';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const getErrorMessage = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Error) {
    return value.message;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message?: unknown }).message === 'string'
  ) {
    return (value as { message: string }).message;
  }

  return '';
};

const isResizeObserverLoopError = (value: unknown): boolean => {
  const message = getErrorMessage(value);

  return (
    message.includes(
      'ResizeObserver loop completed with undelivered notifications'
    ) || message.includes('ResizeObserver loop limit exceeded')
  );
};

export class ErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    // TODO: 可以上报给日志系统
  }

  componentDidMount() {
    // 捕获全局未处理的 Promise reject
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    // 捕获全局同步错误
    window.addEventListener('error', this.handleGlobalError);
  }

  handleGlobalError = (event: ErrorEvent) => {
    const message = event.message || getErrorMessage(event.error);

    if (
      isResizeObserverLoopError(message) ||
      isResizeObserverLoopError(event.error)
    ) {
      event.preventDefault();
      return;
    }

    console.error('Global error caught:', event.error || event.message);
    this.setState({
      hasError: true,
      error: event.error || new Error(message || 'Unknown global error'),
    });
  };
  componentWillUnmount() {
    window.removeEventListener(
      'unhandledrejection',
      this.handlePromiseRejection
    );
    window.removeEventListener('error', this.handleGlobalError);
  }

  handlePromiseRejection = (event: PromiseRejectionEvent) => {
    if (isResizeObserverLoopError(event.reason)) {
      return;
    }

    const rejectionError =
      event.reason instanceof Error
        ? event.reason
        : new Error(
            getErrorMessage(event.reason) || 'Unhandled promise rejection'
          );

    console.error('Unhandled promise rejection:', event.reason);
    this.setState({ hasError: true, error: rejectionError });
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1>应用发生错误 😢</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset} style={{ marginTop: '1rem' }}>
            重置应用
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
