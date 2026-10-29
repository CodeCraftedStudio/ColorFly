/**
 * ColorFly: Header Bar Component
 * Clean, structured 3-zone layout: Brand & Scope | Live Status & Clock | Primary Actions.
 */

import React, { useState, useEffect } from 'react';
import { ColorScope } from '../../../shared/types';
import { sendToExtension } from '../../vscodeApi';
import { useLanguage } from '../../i18n';
import { SunIcon, MoonIcon, SettingsIcon, CheckIcon, RefreshIcon, ExportIcon, ClockIcon } from './Icons';
import { ConfirmDialog } from './Dialog';

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
  const { t } = useLanguage();
  const [themeScoped, setThemeScoped] = useState(true);
  const [pendingAction, setPendingAction] = useState<'discard' | 'restore' | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [frameStyle, setFrameStyle] = useState<'brackets' | 'cyber' | 'solid' | 'minimal'>(() => {
    return (localStorage.getItem('colorfly_clock_frame_style') as any) || 'brackets';
  });

  const clockEnabled = headerClockEnabled && clockConfig.showClock;
  const clockTicksMs = clockConfig.clockShowSeconds ? 1000 : 60000;

  useEffect(() => {
    const onStyleChange = () => {
      setFrameStyle((localStorage.getItem('colorfly_clock_frame_style') as any) || 'brackets');
    };
    window.addEventListener('colorfly_clock_style_change', onStyleChange);

    if (!clockEnabled) {
      return () => window.removeEventListener('colorfly_clock_style_change', onStyleChange);
    }

    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, clockTicksMs);

    return () => {
      clearInterval(timer);
      window.removeEventListener('colorfly_clock_style_change', onStyleChange);
    };
  }, [clockEnabled, clockTicksMs]);

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

  let boxedClockText = timeString;
  if (frameStyle === 'brackets') {
    boxedClockText = `[ ${timeString} ]`;
  } else if (frameStyle === 'cyber') {
    boxedClockText = `// ${timeString} //`;
  } else if (frameStyle === 'solid') {
    boxedClockText = `| ${timeString} |`;
  }

  const isLight = guiTheme === 'light';

  const toggleTheme = () => {
    if (isLight) {
      onChangeGuiTheme('dark');
    } else {
      onChangeGuiTheme('light');
    }
  };

  const handleApply = () => {
    sendToExtension({
      type: 'APPLY_CHANGES',
      payload: { themeScoped },
    });
  };

  const handleDiscard = () => {
    setPendingAction('discard');
  };

  const handleRestore = () => {
    setPendingAction('restore');
  };

  const handleConfirmPendingAction = () => {
    if (pendingAction === 'discard') {
      sendToExtension({ type: 'DISCARD_DRAFTS' });
    } else if (pendingAction === 'restore') {
      sendToExtension({ type: 'RESTORE_PRE_CUSTOMIZATION_SNAPSHOT' });
    }
    setPendingAction(null);
  };

  const handleScopeChange = (newScope: ColorScope) => {
    sendToExtension({
      type: 'SET_SCOPE',
      payload: { scope: newScope },
    });
  };

  return (
    <header
      className="header-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        background: 'var(--cf-sidebar-bg)',
        borderBottom: '1px solid var(--cf-border)',
        gap: 16,
        flexShrink: 0,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* 1. Left Cluster: Brand, Active Theme & Scope Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="brand-logo"
            title="ColorFly Theme Studio"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPlSURBVFhH7ZddT1pZFIb9OybTHzE3Xmh/wLSITBOFdtpeiVUQkHGsqHzYTk3aRBLpCL2w3iAiBxPG1AI3JqZGJDGD8aPeQQEhfiXK26zV4cSze85pTZp40ychnrP22nu/e++11j62NBqNXwG4b+rX0mg0vLhBWv5XcmP8FKAroNFoYHl5Gdvb27KtWCwhGl2A1+uF0+GAzTbAf73eCUSjUZSKJdmX+lF/GkcLXQGr797BYLiLvj4rno6MIBAI4P59C0+eTErI5TZRKPyHXC6HpCSxCGonv5GRv7ifwWBA+v17cWgZXQGjo6PIZrP8PDc3h1BoBicnJ6KbAmoPhUJ4+3aO3zOZDMbGPKKbjK6AoaEhbG5uiuZrsbGxAbdbcwp9AbQDyWRSNF+LRCIBj2dUNMtoCiiXy+jp6cb+/r7YdC329vbQ092NcrkiNjGaAnw+L8LhWX6mc63Vaizq+PgYR0dHKJVK/CP72dkZ+xWLRbZ9+lRGvVaX42V29h/4/X7F+E1UBdBEFosZ5+fn/J7fyqOjvR0OxyBu3+6AyWRCn9XKUd7W1oaVlRXOjD8ePIDVakV/fz86OtqRz+e5Pwmk7KhUvt4FVQGxWAw+n09hGx4eht1uh91m41VSblfKZTx//gzz8/MYHLTj8vKSfaVEAv1Pnij6047G43GFjVAVQM5UQK5C23vr1i9YW1tT2EkIre7w8JDfabX37v2Ojx8PFH6SJKkeg6oAqmxbW1uiGcFgEB7Pl5yuVqu8E+FwGOPj4/JxTU1N4dWrl0JPcDq7XC7RrC7ANjCAnZ0d0YyLiwu4XE786XbDbO7hSnnnzm949PAh5/r6+jrbm2KuUigU+AhFVAU4NHagyZs3ET6KyckAIpEIT0hHQUGZSqVEd4Z2wOl0iGZ1ARwDGgWIJopEwshmMnj8+JEceJQJvb29oruMJCXg9ysDm1AVEF9chM+r/6FEk62urvIz7QAF3u7urugmMzExjqWlJdGsLqBaqcBiseD09FRskqH0o8uJoKB78eJv0UWGxjGbzRy4IqoCCDrf169DolmGqhyl37+pFBctvVtyZmYGzyYnRTOjKYDUGo2dODhQ5vNV6J5vbW1FOp0Wm2ToLunsNKiuntAUQFCgdRmNXPu1iMcXRZNMcxHZbEZsktEVQMRiCzCZulTrgh7k39VlxMJCVGxS8E0BBG0xDRYMTqNer4vNCmq1Oqanp9k/ndb+FGvyXQKIo2oVgYCfA27M4+FU3fjwgT886asnvhjnMm0xm9lP79iu8t0CmtCVSrcaFRWqbDabDU6nk29PslerX1+5elxbwI/mp4Ab/+/4M/xq2PPMln4fAAAAAElFTkSuQmCC"
              alt="ColorFly"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--cf-title-fg)', letterSpacing: '-0.01em' }}>
                ColorFly
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--cf-accent)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                PRO
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{t('header.theme')}</span>
              <strong style={{ color: 'var(--cf-title-fg)', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeThemeName}
              </strong>
            </div>
          </div>
        </div>

        {/* Scope Segmented Pill */}
        <div className="scope-pill" title={t('header.scopeTitle')}>
          <button
            className={`scope-btn ${scope === 'user' ? 'active' : ''}`}
            onClick={() => handleScopeChange('user')}
            style={{ fontWeight: 600 }}
          >
            {t('header.scopeUser')}
          </button>
          <button
            className={`scope-btn ${scope === 'workspace' ? 'active' : ''}`}
            onClick={() => handleScopeChange('workspace')}
            disabled={!hasWorkspaceOpen}
            title={
              !hasWorkspaceOpen ? t('header.scopeWorkspaceDisabled') : t('header.scopeWorkspaceHint')
            }
            style={{ fontWeight: 600 }}
          >
            {t('header.scopeWorkspace')}
          </button>
        </div>
      </div>

      {/* 2. Center Cluster: Live Status & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Status indicator */}
        {draftCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              className="badge badge-warning"
              style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}
            >
              ● {t('header.staged', { n: draftCount })}
            </span>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleDiscard}
              title={t('header.discardTitle')}
              style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11 }}
            >
              {t('header.discard')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px #16a34a' }} />
            <span>{t('header.synced')}</span>
          </div>
        )}

        {/* Theme Scoped Checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: 'var(--cf-desc-fg)',
            cursor: 'pointer',
            padding: '3px 8px',
            borderRadius: 6,
            background: 'var(--cf-input-bg)',
            border: '1px solid var(--cf-border)',
          }}
          title={t('header.themeScopedTitle')}
        >
          <input
            type="checkbox"
            checked={themeScoped}
            onChange={(e) => setThemeScoped(e.target.checked)}
            style={{ margin: 0, cursor: 'pointer' }}
          />
          <span>{t('header.themeScoped')}</span>
        </label>

        {/* Live Clock Frame */}
        {headerClockEnabled && (
          <div
            className={`header-clock-frame frame-${frameStyle}`}
            onClick={onOpenClockStudio}
            title={t('header.clockTitle')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              fontFamily: 'Consolas, "Fira Code", monospace',
              fontSize: 12,
              fontWeight: 600,
              cursor: onOpenClockStudio ? 'pointer' : 'default',
              userSelect: 'none',
              borderRadius: 6,
            }}
          >
            <ClockIcon size={12} style={{ color: 'var(--cf-accent)' }} />
            <span>{boxedClockText}</span>
          </div>
        )}
      </div>

      {/* 3. Right Cluster: Restore, Toggles & Primary Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {canRestoreSnapshot && (
          <button
            className="btn btn-outline btn-sm"
            onClick={handleRestore}
            title={t('header.restoreTitle')}
            style={{ borderRadius: 6 }}
          >
            <RefreshIcon size={12} />
            <span>{t('header.restore')}</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          title={isLight ? t('header.switchDark') : t('header.switchLight')}
          aria-label={t('header.toggleTheme')}
          style={{ width: 32, height: 32, borderRadius: 6 }}
        >
          {isLight ? <MoonIcon size={15} /> : <SunIcon size={15} />}
        </button>

        {/* Settings Icon */}
        <button
          className="header-icon-btn"
          onClick={onOpenSettings}
          title={t('header.openSettings')}
          aria-label={t('header.settings')}
          style={{ width: 32, height: 32, borderRadius: 6 }}
        >
          <SettingsIcon size={15} />
        </button>

        {/* Export Button */}
        <button
          className="btn btn-secondary"
          onClick={onOpenExportModal}
          title={t('header.exportTitle')}
          style={{ padding: '6px 12px', borderRadius: 6, fontWeight: 600 }}
        >
          <ExportIcon size={13} />
          <span>{t('header.export')}</span>
        </button>

        {/* Primary CTA Apply Button */}
        <button
          className="btn btn-primary"
          onClick={handleApply}
          disabled={draftCount === 0}
          title={draftCount === 0 ? t('header.applyDisabled') : t('header.applyTitle')}
          style={{
            padding: '7px 16px',
            borderRadius: 6,
            fontWeight: 700,
            boxShadow: draftCount > 0 ? '0 0 14px rgba(99, 102, 241, 0.45)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <CheckIcon size={14} />
          <span>{t('header.apply')}</span>
        </button>
      </div>

      {pendingAction && (
        <ConfirmDialog
          title={
            pendingAction === 'discard'
              ? t('header.discardDialogTitle')
              : t('header.restoreDialogTitle')
          }
          message={
            pendingAction === 'discard'
              ? t('header.discardDialogMessage')
              : t('header.restoreDialogMessage')
          }
          confirmLabel={
            pendingAction === 'discard'
              ? t('header.discardDialogConfirm')
              : t('header.restoreDialogConfirm')
          }
          danger={pendingAction === 'discard'}
          onConfirm={handleConfirmPendingAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </header>
  );
};
