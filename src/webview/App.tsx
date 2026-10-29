/**
 * ColorFly: Main React Webview Application
 * Coordinates studio state, active themes, GUI settings, and RPC communication with Extension Host.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExtensionStatePayload, ExtensionToWebviewMessage, WorkbenchCategory } from '../shared/types';
import { sendToExtension } from './vscodeApi';
import {
  GuiLanguage,
  GuiLanguageSetting,
  STORAGE_LANG_KEY,
  LanguageContext,
  resolveLanguage,
  translate,
} from './i18n';
import { HeaderBar, GuiTheme } from './components/common/HeaderBar';
import { TabsNav, TabId } from './components/common/TabsNav';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { WorkbenchColorCatalog } from './components/workbench/WorkbenchColorCatalog';
import { AdvancedColorStudio } from './components/picker/AdvancedColorStudio';
import { SyntaxHighlightingEditor } from './components/syntax/SyntaxHighlightingEditor';
import { LivePreviewEngine } from './components/preview/LivePreviewEngine';
import { ProfileManager } from './components/profiles/ProfileManager';
import { AccessibilityAndDiagnostics } from './components/accessibility/AccessibilityAndDiagnostics';
import { AdvancedTools } from './components/advanced/AdvancedTools';
import { ClockStudio } from './components/clock/ClockStudio';
import { IconLibrary } from './components/icons/IconLibrary';
import { GuiSettings, GuiDensity } from './components/settings/GuiSettings';
import { ExportModal } from './components/common/ExportModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SystemLogs } from './components/logs/SystemLogs';
import { CheckIcon, CloseIcon } from './components/common/Icons';
import { addLog, mergeLogs, stringifyLogValue, useSystemLogs } from './logStore';

const STORAGE_THEME_KEY = 'colorfly_gui_theme';
const STORAGE_DENSITY_KEY = 'colorfly_gui_density';
const STORAGE_ANIM_KEY = 'colorfly_gui_animations';
const STORAGE_FONT_KEY = 'colorfly_gui_fontsize';
const STORAGE_HEADER_CLOCK_KEY = 'colorfly_header_clock';

const GUI_THEMES: GuiTheme[] = ['vscode-native', 'dark', 'light', 'pencil-paper', 'animated-hacker'];
const GUI_DENSITIES: GuiDensity[] = ['compact', 'comfortable', 'relaxed'];

function readStoredTheme(): GuiTheme {
  const raw = localStorage.getItem(STORAGE_THEME_KEY);
  return GUI_THEMES.includes(raw as GuiTheme) ? (raw as GuiTheme) : 'vscode-native';
}

function readStoredDensity(): GuiDensity {
  const raw = localStorage.getItem(STORAGE_DENSITY_KEY);
  return GUI_DENSITIES.includes(raw as GuiDensity) ? (raw as GuiDensity) : 'comfortable';
}

function readStoredBoolean(key: string, fallback: boolean): boolean {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw === 'true';
}

function readStoredFontSize(): number {
  const parsed = parseInt(localStorage.getItem(STORAGE_FONT_KEY) || '', 10);
  if (Number.isNaN(parsed)) return 13;
  return Math.min(18, Math.max(11, parsed));
}

const GUI_LANGUAGE_SETTINGS: GuiLanguageSetting[] = ['auto', 'en', 'bn', 'hi'];

function readStoredLanguage(): GuiLanguageSetting {
  const raw = localStorage.getItem(STORAGE_LANG_KEY);
  return GUI_LANGUAGE_SETTINGS.includes(raw as GuiLanguageSetting)
    ? (raw as GuiLanguageSetting)
    : 'auto';
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [workbenchCategory, setWorkbenchCategory] = useState<WorkbenchCategory | 'all'>('all');
  const systemLogs = useSystemLogs();
  const errorCount = systemLogs.reduce((total, entry) => (entry.level === 'error' ? total + 1 : total), 0);
  const [state, setState] = useState<ExtensionStatePayload>({
    activeThemeId: 'Default Dark+',
    activeThemeName: 'Default Dark+',
    activeThemeType: 'dark',
    scope: 'user',
    hasWorkspaceOpen: false,
    effectiveColors: {},
    stagedColors: {},
    stagedTokenColors: {},
    stagedTextMateRules: [],
    stagedSemanticTokens: {},
    savedProfiles: [],
    hasUnappliedDrafts: false,
    canRestoreSnapshot: false,
  });

  // GUI Preferences
  const [guiTheme, setGuiTheme] = useState<GuiTheme>(readStoredTheme);
  const [density, setDensity] = useState<GuiDensity>(readStoredDensity);
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() =>
    readStoredBoolean(STORAGE_ANIM_KEY, true)
  );
  const [fontSize, setFontSize] = useState<number>(readStoredFontSize);
  const [headerClockEnabled, setHeaderClockEnabled] = useState<boolean>(() =>
    readStoredBoolean(STORAGE_HEADER_CLOCK_KEY, true)
  );
  const [languageSetting, setLanguageSetting] = useState<GuiLanguageSetting>(readStoredLanguage);

  const lang: GuiLanguage = resolveLanguage(languageSetting);
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );

  const handleLanguageChange = (setting: GuiLanguageSetting) => {
    setLanguageSetting(setting);
    localStorage.setItem(STORAGE_LANG_KEY, setting);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleToggleHeaderClock = (enabled: boolean) => {
    setHeaderClockEnabled(enabled);
    localStorage.setItem(STORAGE_HEADER_CLOCK_KEY, String(enabled));
  };

  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);

  const showToast = (text: string, type: 'success' | 'error', durationMs: number) => {
    setToastMessage({ text, type });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = undefined;
    }, durationMs);
  };

  // Persistence handlers
  const handleThemeChange = (theme: GuiTheme) => {
    setGuiTheme(theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  };

  const handleDensityChange = (d: GuiDensity) => {
    setDensity(d);
    localStorage.setItem(STORAGE_DENSITY_KEY, d);
  };

  const handleToggleAnimations = (enabled: boolean) => {
    setAnimationsEnabled(enabled);
    localStorage.setItem(STORAGE_ANIM_KEY, String(enabled));
  };

  const handleFontSizeChange = (sz: number) => {
    setFontSize(sz);
    localStorage.setItem(STORAGE_FONT_KEY, String(sz));
  };

  const handleResetSettings = () => {
    handleThemeChange('vscode-native');
    handleDensityChange('comfortable');
    handleToggleAnimations(true);
    handleFontSizeChange(13);
    handleToggleHeaderClock(true);
    handleLanguageChange('auto');
    showToast(t('toast.settingsReset'), 'success', 3000);
  };

  useEffect(() => {
    // Notify extension host that webview is ready
    sendToExtension({ type: 'READY' });

    const handleMessage = (event: MessageEvent) => {
      const message: ExtensionToWebviewMessage = event.data;
      if (!message || !message.type) return;

      switch (message.type) {
        case 'STATE_UPDATE': {
          setState(message.payload);
          break;
        }
        case 'OPERATION_SUCCESS': {
          showToast(message.payload.message, 'success', 3000);
          addLog({ level: 'info', source: 'extension-host', message: message.payload.message, detail: message.payload.details });
          break;
        }
        case 'OPERATION_ERROR': {
          showToast(message.payload.message, 'error', 4000);
          break;
        }
        case 'SYSTEM_LOG': {
          mergeLogs([message.payload]);
          break;
        }
        case 'SYSTEM_LOGS_SYNC': {
          mergeLogs(message.payload.entries);
          break;
        }
      }
    };

    const handleRuntimeError = (event: ErrorEvent) => {
      addLog({
        level: 'error',
        source: 'window',
        message: event.message || 'Unknown runtime error',
        detail: event.filename
          ? `${event.filename}:${event.lineno}:${event.colno}${event.error?.stack ? `\n${event.error.stack}` : ''}`
          : stringifyLogValue(event.error),
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addLog({
        level: 'error',
        source: 'window',
        message: 'Unhandled promise rejection',
        detail: stringifyLogValue(event.reason),
      });
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('error', handleRuntimeError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('error', handleRuntimeError);
      window.removeEventListener('unhandledrejection', handleRejection);
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const activeProfile = state.savedProfiles.find((p) => p.id === state.activeProfileId);
  const draftCount =
    Object.keys(state.stagedColors).length +
    Object.keys(state.stagedTokenColors).length +
    (state.stagedTextMateRules?.length || 0) +
    Object.keys(state.stagedSemanticTokens || {}).length;

  return (
    <LanguageContext.Provider value={{ lang, setting: languageSetting, setSetting: handleLanguageChange, t }}>
    <div
      className="app-container"
      data-gui-theme={guiTheme}
      data-gui-density={density}
      data-gui-animations={animationsEnabled ? 'true' : 'false'}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 14,
            right: 20,
            zIndex: 99999,
            padding: '8px 16px',
            borderRadius: 6,
            background: toastMessage.type === 'success' ? '#16a34a' : '#dc2626',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            fontWeight: 500,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {toastMessage.type === 'success' ? <CheckIcon size={14} /> : <CloseIcon size={14} />}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Bar with Quick GUI Theme Switcher */}
      <HeaderBar
        activeThemeName={state.activeThemeName}
        activeProfileName={activeProfile?.name}
        scope={state.scope}
        hasWorkspaceOpen={state.hasWorkspaceOpen}
        draftCount={draftCount}
        canRestoreSnapshot={state.canRestoreSnapshot}
        guiTheme={guiTheme}
        onChangeGuiTheme={handleThemeChange}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenClockStudio={() => setActiveTab('clock')}
        clockConfig={state.clockConfig}
        headerClockEnabled={headerClockEnabled}
      />

      {/* Navigation Tabs */}
      <TabsNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        draftCount={draftCount}
        errorCount={errorCount}
      />

      {/* Main Studio Viewport with Error Boundary */}
      <main className="main-content">
        <ErrorBoundary onResetTab={() => setActiveTab('overview')}>
          {activeTab === 'overview' && (
            <OverviewDashboard
              activeThemeName={state.activeThemeName}
              activeProfile={activeProfile}
              scope={state.scope}
              effectiveColors={state.effectiveColors}
              stagedColors={state.stagedColors}
              savedProfiles={state.savedProfiles}
              onNavigateTab={setActiveTab}
              onNavigateToCategory={(cat) => {
                setWorkbenchCategory(cat);
                setActiveTab('workbench');
              }}
              onOpenExportModal={() => setShowExportModal(true)}
            />
          )}

          {activeTab === 'workbench' && (
            <WorkbenchColorCatalog
              effectiveColors={state.effectiveColors}
              stagedColors={state.stagedColors}
              initialCategory={workbenchCategory}
            />
          )}

          {activeTab === 'picker' && <AdvancedColorStudio />}

          {activeTab === 'syntax' && (
            <SyntaxHighlightingEditor
              stagedTokenColors={state.stagedTokenColors as Record<string, string>}
              stagedSemanticTokens={state.stagedSemanticTokens}
              stagedTextMateRules={state.stagedTextMateRules}
            />
          )}

          {activeTab === 'preview' && (
            <LivePreviewEngine
              effectiveColors={state.effectiveColors}
              stagedColors={state.stagedColors}
              stagedTokenColors={state.stagedTokenColors as Record<string, string>}
            />
          )}

          {activeTab === 'profiles' && (
            <ProfileManager
              profiles={state.savedProfiles}
              activeProfileId={state.activeProfileId}
              stagedColors={state.stagedColors}
              stagedTokenColors={state.stagedTokenColors as Record<string, string>}
            />
          )}

          {activeTab === 'accessibility' && (
            <AccessibilityAndDiagnostics
              effectiveColors={state.effectiveColors}
              stagedColors={state.stagedColors}
            />
          )}

          {activeTab === 'advanced' && (
            <AdvancedTools
              effectiveColors={state.effectiveColors}
              stagedColors={state.stagedColors}
              activeThemeName={state.activeThemeName}
              onOpenExportModal={() => setShowExportModal(true)}
            />
          )}

          {activeTab === 'icons' && <IconLibrary />}

          {activeTab === 'clock' && (
            <ClockStudio
              clockConfig={state.clockConfig}
              headerClockEnabled={headerClockEnabled}
              onToggleHeaderClock={handleToggleHeaderClock}
            />
          )}

          {activeTab === 'settings' && (
            <GuiSettings
              guiTheme={guiTheme}
              onChangeGuiTheme={handleThemeChange}
              density={density}
              onChangeDensity={handleDensityChange}
              animationsEnabled={animationsEnabled}
              onToggleAnimations={handleToggleAnimations}
              fontSize={fontSize}
              onChangeFontSize={handleFontSizeChange}
              onResetSettings={handleResetSettings}
              clockConfig={state.clockConfig}
              headerClockEnabled={headerClockEnabled}
              onToggleHeaderClock={handleToggleHeaderClock}
              languageSetting={languageSetting}
              onChangeLanguage={handleLanguageChange}
            />
          )}

          {activeTab === 'logs' && <SystemLogs />}
        </ErrorBoundary>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          profiles={state.savedProfiles}
          activeProfileId={state.activeProfileId}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
    </LanguageContext.Provider>
  );
};

