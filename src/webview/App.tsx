/**
 * ChromaForge: Main React Webview Application
 * Coordinates studio state, active themes, GUI settings, and RPC communication with Extension Host.
 */

import React, { useState, useEffect } from 'react';
import { ExtensionStatePayload, ExtensionToWebviewMessage } from '../shared/types';
import { sendToExtension } from './vscodeApi';
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
import { GuiSettings, GuiDensity } from './components/settings/GuiSettings';
import { ExportModal } from './components/common/ExportModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CheckIcon, CloseIcon } from './components/common/Icons';

const STORAGE_THEME_KEY = 'colorfly_gui_theme';
const STORAGE_DENSITY_KEY = 'colorfly_gui_density';
const STORAGE_ANIM_KEY = 'colorfly_gui_animations';
const STORAGE_FONT_KEY = 'colorfly_gui_fontsize';
const STORAGE_HEADER_CLOCK_KEY = 'colorfly_header_clock';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [state, setState] = useState<ExtensionStatePayload>({
    activeThemeId: 'Default Dark+',
    activeThemeName: 'Default Dark+',
    activeThemeType: 'dark',
    scope: 'user',
    hasWorkspaceOpen: false,
    effectiveColors: {},
    stagedColors: {},
    stagedTokenColors: {},
    stagedSemanticTokens: {},
    savedProfiles: [],
    hasUnappliedDrafts: false,
    canRestoreSnapshot: false,
  });

  // GUI Preferences
  const [guiTheme, setGuiTheme] = useState<GuiTheme>(() => {
    return (localStorage.getItem(STORAGE_THEME_KEY) as GuiTheme) || 'vscode-native';
  });

  const [density, setDensity] = useState<GuiDensity>(() => {
    return (localStorage.getItem(STORAGE_DENSITY_KEY) as GuiDensity) || 'comfortable';
  });

  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    const val = localStorage.getItem(STORAGE_ANIM_KEY);
    return val !== null ? val === 'true' : true;
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    const val = localStorage.getItem(STORAGE_FONT_KEY);
    return val ? parseInt(val, 10) : 13;
  });

  const [headerClockEnabled, setHeaderClockEnabled] = useState<boolean>(() => {
    const val = localStorage.getItem(STORAGE_HEADER_CLOCK_KEY);
    return val !== null ? val === 'true' : true;
  });

  const handleToggleHeaderClock = (enabled: boolean) => {
    setHeaderClockEnabled(enabled);
    localStorage.setItem(STORAGE_HEADER_CLOCK_KEY, String(enabled));
  };

  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
    setToastMessage({ text: 'Studio settings restored to factory defaults.', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
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
          setToastMessage({ text: message.payload.message, type: 'success' });
          setTimeout(() => setToastMessage(null), 3000);
          break;
        }
        case 'OPERATION_ERROR': {
          setToastMessage({ text: message.payload.message, type: 'error' });
          setTimeout(() => setToastMessage(null), 4000);
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const activeProfile = state.savedProfiles.find((p) => p.id === state.activeProfileId);
  const draftCount = Object.keys(state.stagedColors).length + Object.keys(state.stagedTokenColors).length;

  return (
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
              onOpenExportModal={() => setShowExportModal(true)}
            />
          )}

          {activeTab === 'workbench' && (
            <WorkbenchColorCatalog
              effectiveColors={state.effectiveColors}
              stagedColors={state.stagedColors}
            />
          )}

          {activeTab === 'picker' && <AdvancedColorStudio />}

          {activeTab === 'syntax' && (
            <SyntaxHighlightingEditor
              stagedTokenColors={state.stagedTokenColors as Record<string, string>}
              stagedSemanticTokens={state.stagedSemanticTokens}
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
            />
          )}
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
  );
};
