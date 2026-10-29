/**
 * ChromaForge: Dedicated Clock & Box Frame Studio Component
 * Customization controls for Header Clock and Status Bar Boxed Frame Clock.
 * Shows time with live seconds ticking in real-time.
 */

import React, { useState, useEffect } from 'react';
import { sendToExtension } from '../../vscodeApi';
import { ClockIcon, CheckIcon, RefreshIcon } from '../common/Icons';

interface ClockStudioProps {
  clockConfig?: {
    showClock: boolean;
    clockFormat: '24h' | '12h';
    clockShowSeconds: boolean;
  };
  headerClockEnabled: boolean;
  onToggleHeaderClock: (enabled: boolean) => void;
}

export const ClockStudio: React.FC<ClockStudioProps> = ({
  clockConfig = { showClock: true, clockFormat: '24h', clockShowSeconds: true },
  headerClockEnabled,
  onToggleHeaderClock,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [frameStyle, setFrameStyle] = useState<'brackets' | 'cyber' | 'solid' | 'minimal'>(() => {
    return (localStorage.getItem('colorfly_clock_frame_style') as any) || 'brackets';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFrameStyleChange = (style: 'brackets' | 'cyber' | 'solid' | 'minimal') => {
    setFrameStyle(style);
    localStorage.setItem('colorfly_clock_frame_style', style);
    window.dispatchEvent(new Event('colorfly_clock_style_change'));
  };

  const handleToggleStatusBarClock = (enabled: boolean) => {
    sendToExtension({
      type: 'UPDATE_CLOCK_CONFIG',
      payload: { showClock: enabled },
    });
  };

  const handleFormatChange = (format: '24h' | '12h') => {
    sendToExtension({
      type: 'UPDATE_CLOCK_CONFIG',
      payload: { clockFormat: format },
    });
  };

  const handleToggleSeconds = (showSeconds: boolean) => {
    sendToExtension({
      type: 'UPDATE_CLOCK_CONFIG',
      payload: { clockShowSeconds: showSeconds },
    });
  };

  // Helper to format time string
  const formatTime = (date: Date, is12h: boolean, showSecs: boolean) => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (is12h) {
      hours = hours % 12;
      hours = hours ? hours : 12;
    }
    const hrsStr = hours.toString().padStart(2, '0');
    const minsStr = date.getMinutes().toString().padStart(2, '0');
    const secsStr = date.getSeconds().toString().padStart(2, '0');

    if (is12h) {
      return showSecs ? `${hrsStr}:${minsStr}:${secsStr} ${ampm}` : `${hrsStr}:${minsStr} ${ampm}`;
    }
    return showSecs ? `${hrsStr}:${minsStr}:${secsStr}` : `${hrsStr}:${minsStr}`;
  };

  const is12h = clockConfig.clockFormat === '12h';
  const timeText = formatTime(currentTime, is12h, clockConfig.clockShowSeconds);

  return (
    <div className="clock-studio-tab animate-tab-fade">
      {/* Studio Header */}
      <div className="dashboard-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--cf-accent), #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <ClockIcon size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--cf-heading-fg)' }}>
              Box Frame Live Clock & Widgets
            </h2>
            <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>
              Real-time digital clock with seconds in custom boxed frame for VS Code Header & Status Bar
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginTop: 20 }}>
        {/* Left Column: Live Box Frame Showcase */}
        <div>
          <div className="studio-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cf-heading-fg)', marginBottom: 6 }}>
              Live Box Frame Clock Preview
            </h3>
            <p style={{ fontSize: 12, color: 'var(--cf-desc-fg)', marginBottom: 20 }}>
              Live real-time preview ticking with exact hour, minute, and second precision.
            </p>

            {/* Big Visual Clock Display */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '36px 20px',
                background: 'var(--cf-surface-secondary)',
                borderRadius: 12,
                border: '1px solid var(--cf-border)',
                marginBottom: 20,
              }}
            >
              <div
                className={`clock-boxed-frame frame-${frameStyle}`}
                style={{
                  fontFamily: 'Consolas, "Fira Code", Monaco, monospace',
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '12px 28px',
                  borderRadius: frameStyle === 'minimal' ? 24 : 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              >
                <ClockIcon size={24} style={{ color: 'var(--cf-accent)' }} />
                <span>
                  {frameStyle === 'brackets' && `[ ${timeText} ]`}
                  {frameStyle === 'cyber' && `⚡ < ${timeText} /> ⚡`}
                  {frameStyle === 'solid' && `| ${timeText} |`}
                  {frameStyle === 'minimal' && `${timeText}`}
                </span>
              </div>

              <div style={{ marginTop: 14, fontSize: 11, color: 'var(--cf-desc-fg)', display: 'flex', gap: 16 }}>
                <span>Date: {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
              </div>
            </div>

            {/* Frame Style Selector */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cf-heading-fg)', marginBottom: 10 }}>
                Frame Design Style
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {[
                  { id: 'brackets', name: 'Square Boxed [ ]', preview: `[ ${timeText} ]` },
                  { id: 'cyber', name: 'Cyberpunk Frame < >', preview: `< ${timeText} />` },
                  { id: 'solid', name: 'Solid Column | |', preview: `| ${timeText} |` },
                  { id: 'minimal', name: 'Minimal Pill Rounded', preview: timeText },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleFrameStyleChange(s.id as any)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      textAlign: 'left',
                      background: frameStyle === s.id ? 'var(--cf-surface-accent)' : 'var(--cf-surface-secondary)',
                      border: `1.5px solid ${frameStyle === s.id ? 'var(--cf-accent)' : 'var(--cf-border)'}`,
                      cursor: 'pointer',
                      color: 'var(--cf-body-fg)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: frameStyle === s.id ? 'var(--cf-accent)' : 'var(--cf-heading-fg)' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', opacity: 0.8, marginTop: 4 }}>
                      {s.preview}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status Bar Settings Card */}
          <div className="studio-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-heading-fg)', marginBottom: 14 }}>
              VS Code Status Bar Clock Widget
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Status bar toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cf-heading-fg)' }}>
                    Show in VS Code Status Bar (Bottom)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
                    Displays `[ 13:30:45 ]` with live seconds at bottom right
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={clockConfig.showClock}
                    onChange={(e) => handleToggleStatusBarClock(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Studio Header toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cf-heading-fg)' }}>
                    Show in Studio Header Bar (Top)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
                    Displays the live boxed clock in the Theme Studio top bar
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={headerClockEnabled}
                    onChange={(e) => onToggleHeaderClock(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Time & Seconds Format Card */}
          <div className="studio-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-heading-fg)', marginBottom: 14 }}>
              Display Options & Precision
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Seconds toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cf-heading-fg)' }}>
                    Show Live Seconds
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
                    Display ticking seconds (`:ss`)
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={clockConfig.clockShowSeconds}
                    onChange={(e) => handleToggleSeconds(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* 24-Hour vs 12-Hour format */}
              <div style={{ paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cf-heading-fg)', marginBottom: 8 }}>
                  Time Format
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    className={`btn btn-sm ${clockConfig.clockFormat === '24h' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleFormatChange('24h')}
                    style={{ justifyContent: 'center' }}
                  >
                    24-Hour (13:30:45)
                  </button>
                  <button
                    className={`btn btn-sm ${clockConfig.clockFormat === '12h' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleFormatChange('12h')}
                    style={{ justifyContent: 'center' }}
                  >
                    12-Hour (01:30:45 PM)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

