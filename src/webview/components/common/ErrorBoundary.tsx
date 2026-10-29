/**
 * ChromaForge: React Error Boundary Component
 * Catches any render or runtime exceptions in tab views and displays
 * a developer-friendly recovery panel instead of a black screen.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshIcon, WrenchIcon } from './Icons';

interface Props {
  children: ReactNode;
  onResetTab?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ChromaForge Studio Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onResetTab) {
      this.props.onResetTab();
    }
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
          <div
            className="card"
            style={{
              borderColor: '#ef4444',
              background: 'var(--cf-card-bg)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WrenchIcon size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
                  View Render Recovery
                </h2>
                <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                  A non-fatal error occurred while rendering this tab. Studio state is preserved.
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--cf-input-bg)',
                border: '1px solid var(--cf-border)',
                borderRadius: 6,
                padding: 12,
                fontFamily: 'var(--cf-font-mono)',
                fontSize: 12,
                color: '#f87171',
                marginBottom: 20,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error?.toString() || 'Unknown render exception'}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={this.handleReset}>
                <RefreshIcon size={14} />
                <span>Return to Overview Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

