/**
 * ChromaForge: Header Bar Component
 * Clean, uncluttered header with a single Dark/Light toggle icon button,
 * scope selection, and action controls.
 */

import React, { useState, useEffect } from 'react';
import { ColorScope } from '../../../shared/types';
import { sendToExtension } from '../../vscodeApi';
import { SunIcon, MoonIcon, SettingsIcon, CheckIcon, RefreshIcon, ExportIcon, ClockIcon } from './Icons';

export type GuiTheme = 'vscode-native' | 'dark' | 'light' | 'pencil-paper' | 'animated-hacker';

interface HeaderBarProps {
  activeThemeName: string;
  activeProfileName?: string;
  scope: ColorScope;
  hasWorkspaceOpen: boolean;
  draftCount: number;
  canRestoreSnapshot: boolean;
  guiTheme: GuiTheme;
  onChangeGuiTheme: (theme: GuiTheme) => void;
  onOpenExportModal: () => void;
  onOpenSettings: () => void;
  onOpenClockStudio?: () => void;
  clockConfig?: {
    showClock: boolean;
    clockFormat: '24h' | '12h';
    clockShowSeconds: boolean;
  };
  headerClockEnabled?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeThemeName,
  activeProfileName,
  scope,
  hasWorkspaceOpen,
  draftCount,
  canRestoreSnapshot,
  guiTheme,
  onChangeGuiTheme,
  onOpenExportModal,
  onOpenSettings,
  onOpenClockStudio,
  clockConfig = { showClock: true, clockFormat: '24h', clockShowSeconds: true },
  headerClockEnabled = true,
}) => {
  const [themeScoped, setThemeScoped] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [frameStyle, setFrameStyle] = useState<'brackets' | 'cyber' | 'solid' | 'minimal'>(() => {
    return (localStorage.getItem('colorfly_clock_frame_style') as any) || 'brackets';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const onStyleChange = () => {
      setFrameStyle((localStorage.getItem('colorfly_clock_frame_style') as any) || 'brackets');
    };
    window.addEventListener('colorfly_clock_style_change', onStyleChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener('colorfly_clock_style_change', onStyleChange);
    };
  }, []);

  // Format time string
  let hours = currentTime.getHours();
  const is12h = clockConfig.clockFormat === '12h';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  if (is12h) {
    hours = hours % 12;
    hours = hours ? hours : 12;
  }
  const hrsStr = hours.toString().padStart(2, '0');
  const minsStr = currentTime.getMinutes().toString().padStart(2, '0');
  const secsStr = currentTime.getSeconds().toString().padStart(2, '0');
  const showSecs = clockConfig.clockShowSeconds;

  let timeString = '';
  if (is12h) {
    timeString = showSecs ? `${hrsStr}:${minsStr}:${secsStr} ${ampm}` : `${hrsStr}:${minsStr} ${ampm}`;
  } else {
    timeString = showSecs ? `${hrsStr}:${minsStr}:${secsStr}` : `${hrsStr}:${minsStr}`;
  }

  let boxedClockText = `[ ${timeString} ]`;
  if (frameStyle === 'cyber') boxedClockText = `< ${timeString} />`;
  else if (frameStyle === 'solid') boxedClockText = `| ${timeString} |`;
  else if (frameStyle === 'minimal') boxedClockText = timeString;

  const isLight = guiTheme === 'light' || guiTheme === 'pencil-paper';

  const toggleTheme = () => {
    // Toggles between modern dark and clean light
    if (isLight) {
      onChangeGuiTheme('dark');
    } else {
      onChangeGuiTheme('light');
    }
  };

  const handleApply = () => {
    sendToExtension({
      type: 'APPLY_CUSTOMIZATIONS',
      payload: { themeScoped },
    });
  };

  const handleDiscard = () => {
    if (confirm('Discard all unapplied draft changes?')) {
      sendToExtension({ type: 'DISCARD_DRAFTS' });
    }
  };

  const handleRestore = () => {
    if (confirm('Restore configuration to the state before ColorFly customizations were applied?')) {
      sendToExtension({ type: 'RESTORE_PRE_CUSTOMIZATION_SNAPSHOT' });
    }
  };

  const handleScopeChange = (newScope: ColorScope) => {
    sendToExtension({
      type: 'SET_SCOPE',
      payload: { scope: newScope },
    });
  };

  return (
    <header className="header-bar">
      <div className="brand-section">
        <div className="brand-logo" title="ColorFly Studio" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPlSURBVFhH7ZddT1pZFIb9OybTHzE3Xmh/wLSITBOFdtpeiVUQkHGsqHzYTk3aRBLpCL2w3iAiBxPG1AI3JqZGJDGD8aPeQQEhfiXK26zV4cSze85pTZp40ychnrP22nu/e++11j62NBqNXwG4b+rX0mg0vLhBWv5XcmP8FKAroNFoYHl5Gdvb27KtWCwhGl2A1+uF0+GAzTbAf73eCUSjUZSKJdmX+lF/GkcLXQGr797BYLiLvj4rno6MIBAI4P59C0+eTErI5TZRKPyHXC6HpCSxCGonv5GRv7ifwWBA+v17cWgZXQGjo6PIZrP8PDc3h1BoBicnJ6KbAmoPhUJ4+3aO3zOZDMbGPKKbjK6AoaEhbG5uiuZrsbGxAbdbcwp9AbQDyWRSNF+LRCIBj2dUNMtoCiiXy+jp6cb+/r7YdC329vbQ092NcrkiNjGaAnw+L8LhWX6mc63Vaizq+PgYR0dHKJVK/CP72dkZ+xWLRbZ9+lRGvVaX42V29h/4/X7F+E1UBdBEFosZ5+fn/J7fyqOjvR0OxyBu3+6AyWRCn9XKUd7W1oaVlRXOjD8ePIDVakV/fz86OtqRz+e5Pwmk7KhUvt4FVQGxWAw+n09hGx4eht1uh91m41VSblfKZTx//gzz8/MYHLTj8vKSfaVEAv1Pnij6047G43GFjVAVQM5UQK5C23vr1i9YW1tT2EkIre7w8JDfabX37v2Ojx8PFH6SJKkeg6oAqmxbW1uiGcFgEB7Pl5yuVqu8E+FwGOPj4/JxTU1N4dWrl0JPcDq7XC7RrC7ANjCAnZ0d0YyLiwu4XE786XbDbO7hSnnnzm949PAh5/r6+jrbm2KuUigU+AhFVAU4NHagyZs3ET6KyckAIpEIT0hHQUGZSqVEd4Z2wOl0iGZ1ARwDGgWIJopEwshmMnj8+JEceJQJvb29oruMJCXg9ysDm1AVEF9chM+r/6FEk62urvIz7QAF3u7urugmMzExjqWlJdGsLqBaqcBiseD09FRskqH0o8uJoKB78eJv0UWGxjGbzRy4IqoCCDrf169DolmGqhyl37+pFBctvVtyZmYGzyYnRTOjKYDUGo2dODhQ5vNV6J5vbW1FOp0Wm2ToLunsNKiuntAUQFCgdRmNXPu1iMcXRZNMcxHZbEZsktEVQMRiCzCZulTrgh7k39VlxMJCVGxS8E0BBG0xDRYMTqNer4vNCmq1Oqanp9k/ndb+FGvyXQKIo2oVgYCfA27M4+FU3fjwgT886asnvhjnMm0xm9lP79iu8t0CmtCVSrcaFRWqbDabDU6nk29PslerX1+5elxbwI/mp4Ab/+/4M/xq2PPMln4fAAAAAElFTkSuQmCC"
            alt="ColorFly"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="brand-meta">
          <h1>ColorFly</h1>
          <div className="brand-subtitle">
            Theme: <strong>{activeThemeName}</strong>
            {activeProfileName && <span> • Profile: <em>{activeProfileName}</em></span>}
          </div>
        </div>

        {/* Scope Pill */}
        <div className="scope-pill" title="Select editing scope">
          <button
            className={`scope-btn ${scope === 'user' ? 'active' : ''}`}
            onClick={() => handleScopeChange('user')}
          >
            User
          </button>
          <button
            className={`scope-btn ${scope === 'workspace' ? 'active' : ''}`}
            onClick={() => handleScopeChange('workspace')}
            disabled={!hasWorkspaceOpen}
            title={!hasWorkspaceOpen ? 'Open a workspace to enable workspace scope' : 'Workspace level'}
          >
            Workspace
          </button>
        </div>
      </div>

      <div className="header-actions">
        {draftCount > 0 && (
          <span className="badge badge-warning">
            {draftCount} staged
          </span>
        )}

        {/* Theme Scoped Checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: 'var(--cf-desc-fg)',
            cursor: 'pointer',
          }}
          title="When checked, customizations apply only to the active theme rather than all themes globally"
        >
          <input
            type="checkbox"
            checked={themeScoped}
            onChange={(e) => setThemeScoped(e.target.checked)}
          />
          Theme-scoped
        </label>

        {draftCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleDiscard} title="Discard draft changes">
            Discard
          </button>
        )}

        {canRestoreSnapshot && (
          <button className="btn btn-outline btn-sm" onClick={handleRestore} title="Restore before customizations">
            <RefreshIcon size={12} />
            <span>Restore</span>
          </button>
        )}

        {/* Live Boxed Frame Clock in Header */}
        {headerClockEnabled && (
          <div
            className={`header-clock-frame frame-${frameStyle}`}
            onClick={onOpenClockStudio}
            title="Live Box Frame Clock — Click to customize clock & frame"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              fontFamily: 'Consolas, "Fira Code", Monaco, monospace',
              fontSize: 12,
              fontWeight: 600,
              cursor: onOpenClockStudio ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            <ClockIcon size={13} style={{ color: 'var(--cf-accent)' }} />
            <span>{boxedClockText}</span>
          </div>
        )}

        {/* Single Clean Dark / Light Theme Toggle Icon Button */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          aria-label="Toggle Dark and Light Theme"
        >
          {isLight ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </button>

        {/* GUI Settings Icon Button */}
        <button
          className="header-icon-btn"
          onClick={onOpenSettings}
          title="Open Studio GUI Settings & Themes"
          aria-label="Open Studio Settings"
        >
          <SettingsIcon size={16} />
        </button>

        {/* Apply Button */}
        <button className="btn btn-primary" onClick={handleApply} title="Apply changes to VS Code interface">
          <CheckIcon size={14} />
          <span>Apply to VS Code</span>
        </button>

        {/* Export Button */}
        <button className="btn btn-secondary" onClick={onOpenExportModal} title="Export theme or profile">
          <ExportIcon size={14} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
