import React, { Component, type ReactNode } from 'react';
import { Button } from '../components/ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by App ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            backgroundColor: 'var(--bg-primary, #FFFFFF)',
            color: 'var(--text-primary, #101114)',
            textAlign: 'center',
            fontFamily: 'var(--font-sans, sans-serif)',
          }}
        >
          <div
            style={{
              padding: '32px',
              maxWidth: '520px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-surface, #FBFBFA)',
              border: '1px solid var(--border-medium, rgba(16,17,20,0.14))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '32px' }}>⚠️</span>
            <h1 style={{ fontSize: '20px', fontWeight: 600 }}>화면을 불러오는 중 문제가 발생했습니다</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #575D66)', lineHeight: 1.6 }}>
              일시적인 렌더링 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  fontSize: '12px',
                  backgroundColor: 'var(--bg-secondary, #F6F6F3)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  maxWidth: '100%',
                  overflowX: 'auto',
                  color: 'var(--color-danger, #D63939)',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <Button variant="primary" onClick={this.handleReload}>
              페이지 새로고침
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
