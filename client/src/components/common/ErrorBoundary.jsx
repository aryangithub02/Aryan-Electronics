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

    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      /Loading chunk .* failed/i.test(error?.message) ||
      /Unexpected token '<'/i.test(error?.message);

    if (isChunkError) {
      const hasReloaded = JSON.parse(window.sessionStorage.getItem('eb_chunk_reload') || 'false');
      if (!hasReloaded) {
        window.sessionStorage.setItem('eb_chunk_reload', 'true');
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    window.sessionStorage.removeItem('eb_chunk_reload');
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.name === 'ChunkLoadError' ||
        /Loading chunk .* failed/i.test(this.state.error?.message) ||
        /Unexpected token '<'/i.test(this.state.error?.message);

      return (
        <div className="min-h-[500px] flex items-center justify-center p-6">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-8 text-center border-brand-500/30">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 mx-auto flex items-center justify-center text-3xl mb-4">
              {isChunkError ? '🔄' : '⚠'}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isChunkError ? 'Platform Update Available' : 'Something went wrong'}
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              {isChunkError
                ? 'A new production version of Aryan Electronics was deployed. Please reload the page to load the latest features and data.'
                : 'An unexpected error occurred while rendering this view. You can reload the page or return to safety.'}
            </p>
            {this.state.error && !isChunkError && (
              <div className="mb-6 p-3 bg-slate-900/90 rounded-lg text-left text-xs font-mono text-red-300 overflow-x-auto max-h-40 border border-slate-800">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  window.sessionStorage.removeItem('eb_chunk_reload');
                  window.location.reload();
                }}
              >
                {isChunkError ? 'Update & Reload' : 'Reload Page'}
              </Button>
              <Button variant="secondary" onClick={this.handleReset}>
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
