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
    console.error('Global error caught:', event.error || event.message);
    if (event.message.includes('ResizeObserver loop')) {
      return;
    }
    this.setState({
      hasError: true,
      error: event.error || new Error(event.message),
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
    console.error('Unhandled promise rejection:', event.reason);
    this.setState({ hasError: true, error: event.reason });
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
