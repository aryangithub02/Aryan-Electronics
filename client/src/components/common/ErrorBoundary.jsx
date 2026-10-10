import React from 'react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-8 text-center border-red-500/30">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center text-3xl mb-4">
              ⚠
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-300 mb-6">
              An unexpected error occurred while rendering this view. You can reload the page or return to safety.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 bg-slate-900/90 rounded-lg text-left text-xs font-mono text-red-300 overflow-x-auto max-h-40 border border-slate-800">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
              <Button variant="primary" onClick={this.handleReset}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
