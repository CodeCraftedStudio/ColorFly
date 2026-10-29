/**
 * ChromaForge: Accessibility & Diagnostics Studio
 * WCAG 2.1 relative luminance and contrast compliance matrix, suggestions, and theme diagnostics.
 */

import React from 'react';
import { analyzeContrast, getAccessibleForeground } from '../../../shared/colorUtils';
import { sendToExtension } from '../../vscodeApi';
import { ShieldCheckIcon, CheckIcon, SparklesIcon } from '../common/Icons';

interface AccessibilityAndDiagnosticsProps {
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
}

export const AccessibilityAndDiagnostics: React.FC<AccessibilityAndDiagnosticsProps> = ({
  effectiveColors = {},
  stagedColors = {},
}) => {
  const merged = { ...(effectiveColors || {}), ...(stagedColors || {}) };

  // Key visual pairs to analyze
  const criticalPairs = [
    {
      name: 'Editor Normal Text',
      fgId: 'editor.foreground',
      bgId: 'editor.background',
      fg: merged['editor.foreground'] || '#d4d4d4',
      bg: merged['editor.background'] || '#1e1e1e',
      context: 'Primary code reading and writing readability',
    },
    {
      name: 'Primary Sidebar Text',
      fgId: 'sideBar.foreground',
      bgId: 'sideBar.background',
      fg: merged['sideBar.foreground'] || '#cccccc',
      bg: merged['sideBar.background'] || '#252526',
      context: 'File tree and tool navigation clarity',
    },
    {
      name: 'Activity Bar Active Icon',
      fgId: 'activityBar.foreground',
      bgId: 'activityBar.background',
      fg: merged['activityBar.foreground'] || '#ffffff',
      bg: merged['activityBar.background'] || '#333333',
      context: 'Far-left view navigation icon visibility',
    },
    {
      name: 'Status Bar Text',
      fgId: 'statusBar.foreground',
      bgId: 'statusBar.background',
      fg: merged['statusBar.foreground'] || '#ffffff',
      bg: merged['statusBar.background'] || '#007acc',
      context: 'Bottom status notifications and branch indicators',
    },
    {
      name: 'Primary Button Text',
      fgId: 'button.foreground',
      bgId: 'button.background',
      fg: merged['button.foreground'] || '#ffffff',
      bg: merged['button.background'] || '#0e639c',
      context: 'Interactive call-to-action buttons',
    },
    {
      name: 'Terminal Output Text',
      fgId: 'terminal.foreground',
      bgId: 'terminal.background',
      fg: merged['terminal.foreground'] || '#cccccc',
      bg: merged['terminal.background'] || '#1e1e1e',
      context: 'Command line logs and terminal output',
    },
  ];

  const analyzedPairs = criticalPairs.map((pair) => ({
    ...pair,
    analysis: analyzeContrast(pair.fg, pair.bg),
    optimalFg: getAccessibleForeground(pair.bg),
  }));

  const aaPassCount = analyzedPairs.filter((p) => p.analysis.aaNormal).length;
  const aaaPassCount = analyzedPairs.filter((p) => p.analysis.aaaNormal).length;
  const failingCount = analyzedPairs.length - aaPassCount;
  const scorePercent = Math.round((aaPassCount / analyzedPairs.length) * 100);

  const handleFixPair = (fgId: string, suggestedHex: string) => {
    sendToExtension({
      type: 'STAGE_COLOR_CHANGE',
      payload: { id: fgId, value: suggestedHex },
    });
  };

  const handleFixAllFailing = () => {
    const batch: Record<string, string> = {};
    for (const p of analyzedPairs) {
      if (!p.analysis.aaNormal) {
        batch[p.fgId] = p.optimalFg;
      }
    }
    if (Object.keys(batch).length === 0) return;
    sendToExtension({
      type: 'STAGE_COLOR_BATCH',
      payload: { colors: batch },
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Intro Banner & Scorecard */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheckIcon size={18} style={{ color: scorePercent === 100 ? '#16a34a' : '#eab308' }} />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
              WCAG 2.1 Contrast Analysis & Diagnostics
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: 13, color: 'var(--cf-desc-fg)' }}>
            Ensures your VS Code workspace complies with official Web Content Accessibility Guidelines. Evaluates contrast ratios across all critical UI surfaces.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: scorePercent === 100 ? '#16a34a' : '#d97706' }}>
              {scorePercent}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
              {aaPassCount}/{analyzedPairs.length} AA Passing
            </div>
          </div>

          {failingCount > 0 && (
            <button className="btn btn-primary btn-sm" onClick={handleFixAllFailing}>
              <SparklesIcon size={12} />
              <span>Auto-Fix All ({failingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Critical Pairs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--cf-border)', fontWeight: 700, fontSize: 13, color: 'var(--cf-title-fg)' }}>
          Critical UI Text & Background Pairs
        </div>

        <div>
          {analyzedPairs.map((pair) => {
            const { analysis, optimalFg } = pair;

            return (
              <div
                key={pair.name}
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                {/* Left info & demo swatch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 90,
                      height: 48,
                      borderRadius: 6,
                      background: pair.bg,
                      color: pair.fg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 12,
                      border: '1px solid var(--cf-border)',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                  >
                    Sample Text
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--cf-title-fg)' }}>{pair.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                      {pair.context}
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)', color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                      FG: {pair.fg} ({pair.fgId}) • BG: {pair.bg} ({pair.bgId})
                    </div>
                  </div>
                </div>

                {/* Right Ratings & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
                      {analysis.ratio}:1
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, justifyContent: 'flex-end' }}>
                      <span className={`badge ${analysis.aaNormal ? 'badge-success' : 'badge-warning'}`}>
                        AA {analysis.aaNormal ? 'Pass' : 'Fail'}
                      </span>
                      <span className={`badge ${analysis.aaaNormal ? 'badge-success' : 'badge-warning'}`}>
                        AAA {analysis.aaaNormal ? 'Pass' : 'Fail'}
                      </span>
                    </div>
                  </div>

                  {!analysis.aaNormal && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleFixPair(pair.fgId, optimalFg)}
                      title={`Automatically fix text contrast by applying ${optimalFg}`}
                    >
                      Fix ({optimalFg})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WCAG Reference Guide */}
      <div className="card">
        <h3 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>WCAG 2.1 Contrast Reference Standard</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, fontSize: 12 }}>
          <div style={{ background: 'var(--cf-input-bg)', padding: 12, borderRadius: 6, border: '1px solid var(--cf-border)' }}>
            <div style={{ fontWeight: 700, color: '#16a34a' }}>Level AA (Minimum)</div>
            <div style={{ marginTop: 4, color: 'var(--cf-desc-fg)' }}>
              Requires a contrast ratio of at least <strong>4.5:1</strong> for regular text, and <strong>3.0:1</strong> for large or bold text.
            </div>
          </div>

          <div style={{ background: 'var(--cf-input-bg)', padding: 12, borderRadius: 6, border: '1px solid var(--cf-border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--cf-focus-border)' }}>Level AAA (Enhanced)</div>
            <div style={{ marginTop: 4, color: 'var(--cf-desc-fg)' }}>
              Requires a contrast ratio of at least <strong>7.0:1</strong> for normal text, providing comfortable readability in varied lighting conditions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
