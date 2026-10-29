/**
 * ChromaForge: Dedicated GUI Settings Studio
 * Configure Studio UI Themes (including Pencil Paper & Animated Hacker), layout density,
 * font sizes, and animation preferences.
 */

import React from 'react';
import { GuiTheme } from '../common/HeaderBar';
import { CheckIcon, RefreshIcon, ClockIcon } from '../common/Icons';
import { sendToExtension } from '../../vscodeApi';

export type GuiDensity = 'compact' | 'comfortable' | 'relaxed';

interface GuiSettingsProps {
  guiTheme: GuiTheme;
  onChangeGuiTheme: (theme: GuiTheme) => void;
  density: GuiDensity;
  onChangeDensity: (density: GuiDensity) => void;
  animationsEnabled: boolean;
  onToggleAnimations: (enabled: boolean) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  onResetSettings: () => void;
  clockConfig?: {
    showClock: boolean;
    clockFormat: '24h' | '12h';
    clockShowSeconds: boolean;
  };
  headerClockEnabled?: boolean;
  onToggleHeaderClock?: (enabled: boolean) => void;
}

export const GuiSettings: React.FC<GuiSettingsProps> = ({
  guiTheme,
  onChangeGuiTheme,
  density,
  onChangeDensity,
  animationsEnabled,
  onToggleAnimations,
  fontSize,
  onChangeFontSize,
  onResetSettings,
  clockConfig = { showClock: true, clockFormat: '24h', clockShowSeconds: true },
  headerClockEnabled = true,
  onToggleHeaderClock,
}) => {
  const themesList: Array<{
    id: GuiTheme;
    name: string;
    badge: string;
    description: string;
    previewBg: string;
    previewFg: string;
    previewAccent: string;
    previewBorder: string;
  }> = [
    {
      id: 'vscode-native',
      name: 'VS Code Native',
      badge: 'Auto',
      description: 'Dynamically adapts to your current VS Code active theme and workbench CSS variables.',
      previewBg: 'var(--vscode-editor-background, #1e1e1e)',
      previewFg: 'var(--vscode-editor-foreground, #d4d4d4)',
      previewAccent: '#007acc',
      previewBorder: 'var(--vscode-panel-border, #3c3c3c)',
    },
    {
      id: 'dark',
      name: 'Studio Obsidian Dark',
      badge: 'Modern Dark',
      description: 'Sleek, deep obsidian glass aesthetic with electric violet accents and high legibility.',
      previewBg: '#0d1117',
      previewFg: '#e6edf3',
      previewAccent: '#6366f1',
      previewBorder: '#30363d',
    },
    {
      id: 'light',
      name: 'Studio Clean Light',
      badge: 'Crisp Light',
      description: 'Porcelain white and slate surfaces with refined blue accents and crisp high-contrast typography.',
      previewBg: '#f8fafc',
      previewFg: '#0f172a',
      previewAccent: '#2563eb',
      previewBorder: '#cbd5e1',
    },
    {
      id: 'pencil-paper',
      name: 'Pencil Paper Theme',
      badge: 'Draftsman Sketch',
      description: 'Architectural draft graph paper, 2B graphite pencil typography, hand-drafted borders and sketch aesthetic.',
      previewBg: '#f6efe1',
      previewFg: '#201c18',
      previewAccent: '#b45309',
      previewBorder: '#8d7b68',
    },
    {
      id: 'animated-hacker',
      name: 'Animated Hacker Theme',
      badge: 'Matrix Cyberpunk',
      description: 'Glowing phosphor neon green text, animated CRT scan line sweep, cyber grid lines, and terminal vibes.',
      previewBg: '#030804',
      previewFg: '#00ff66',
      previewAccent: '#00ff66',
      previewBorder: '#00ff41',
    },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Settings Intro */}
      <div className="card">
        <h2 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
          ColorFly GUI Preferences & Themes
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--cf-desc-fg)' }}>
          Customize the appearance, theme, layout density, and visual animations of the ColorFly Studio interface.
        </p>
      </div>

      {/* 1. Theme Selection Cards */}
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
          Studio GUI Theme
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {themesList.map((t) => {
            const isSelected = guiTheme === t.id;

            return (
              <div
                key={t.id}
                className="card"
                onClick={() => onChangeGuiTheme(t.id)}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--cf-focus-border)' : 'var(--cf-border)',
                  borderWidth: isSelected ? 2 : 1,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cf-title-fg)' }}>{t.name}</span>
                      <span className="badge" style={{ fontSize: 9 }}>{t.badge}</span>
                    </div>
                    {isSelected && (
                      <span style={{ color: 'var(--cf-focus-border)', display: 'flex', alignItems: 'center' }}>
                        <CheckIcon size={16} />
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--cf-desc-fg)', lineHeight: 1.4 }}>
                    {t.description}
                  </p>
                </div>

                {/* Live Mini Preview Box */}
                <div
                  style={{
                    background: t.previewBg,
                    color: t.previewFg,
                    border: `1px solid ${t.previewBorder}`,
                    borderRadius: 6,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: t.previewAccent,
                        boxShadow: t.id === 'animated-hacker' ? '0 0 6px #00ff66' : 'none',
                      }}
                    />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>Preview Element</span>
                  </div>

                  <div
                    style={{
                      background: t.previewAccent,
                      color: t.id === 'animated-hacker' ? '#000' : '#fff',
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    Button
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Layout Density & Typography */}
      <div className="card">
        <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
          Layout Density & Typography
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Density */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, color: 'var(--cf-title-fg)' }}>
              Interface Density:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['compact', 'comfortable', 'relaxed'] as GuiDensity[]).map((d) => (
                <button
                  key={d}
                  className={`btn ${density === d ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                  onClick={() => onChangeDensity(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 6 }}>
              Adjusts padding, row heights, and workspace compactness.
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, color: 'var(--cf-title-fg)' }}>
              Studio Base Font Size ({fontSize}px):
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[12, 13, 14].map((sz) => (
                <button
                  key={sz}
                  className={`btn ${fontSize === sz ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => onChangeFontSize(sz)}
                >
                  {sz === 12 ? 'Small (12px)' : sz === 13 ? 'Default (13px)' : 'Large (14px)'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 6 }}>
              Fine-tunes the base font scaling of all studio controls and tables.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Box Frame Clock Settings */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ClockIcon size={18} style={{ color: 'var(--cf-accent)' }} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
            Live Clock & Box Frame Widgets
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Status Bar Clock Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
                VS Code Status Bar Clock (Bottom)
              </div>
              <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                Show live boxed clock in the VS Code status bar with ticking seconds.
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
              <input
                type="checkbox"
                checked={clockConfig.showClock}
                onChange={(e) =>
                  sendToExtension({
                    type: 'UPDATE_CLOCK_CONFIG',
                    payload: { showClock: e.target.checked },
                  })
                }
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cf-title-fg)' }}>
                {clockConfig.showClock ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* Studio Header Clock Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
                Studio Top Header Clock
              </div>
              <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                Display the boxed clock widget in the ColorFly top navigation header bar.
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
              <input
                type="checkbox"
                checked={headerClockEnabled}
                onChange={(e) => onToggleHeaderClock?.(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cf-title-fg)' }}>
                {headerClockEnabled ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* Live Seconds Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
                Clock Seconds Precision
              </div>
              <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                Include real-time ticking seconds (:ss) in the clock display.
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
              <input
                type="checkbox"
                checked={clockConfig.clockShowSeconds}
                onChange={(e) =>
                  sendToExtension({
                    type: 'UPDATE_CLOCK_CONFIG',
                    payload: { clockShowSeconds: e.target.checked },
                  })
                }
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cf-title-fg)' }}>
                {clockConfig.clockShowSeconds ? 'Show Seconds' : 'Hours:Minutes Only'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Visual Effects & Motion */}
      <div className="card">
        <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
          Visual Animations & Effects
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>Enable Smooth UI Animations</div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              Toggles CSS transitions, live preview transitions, and the Animated Hacker CRT scan line beam.
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={(e) => onToggleAnimations(e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cf-title-fg)' }}>
              {animationsEnabled ? 'Enabled' : 'Disabled (Reduced Motion)'}
            </span>
          </label>
        </div>
      </div>

      {/* 4. Reset Settings Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>Restore Studio Defaults</div>
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
            Reset GUI theme, layout density, and animations back to original factory defaults.
          </div>
        </div>

        <button className="btn btn-outline btn-danger" onClick={onResetSettings}>
          <RefreshIcon size={12} />
          <span>Reset Studio Settings</span>
        </button>
      </div>
    </div>
  );
};
