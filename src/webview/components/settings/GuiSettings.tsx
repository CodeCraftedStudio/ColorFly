/**
 * ColorFly: Dedicated GUI Settings Studio
 * Configure interface language, Studio UI Themes (including Pencil Paper & Animated Hacker),
 * layout density, font sizes, and animation preferences.
 */

import React from 'react';
import { GuiTheme } from '../common/HeaderBar';
import { CheckIcon, RefreshIcon, ClockIcon, GlobeIcon } from '../common/Icons';
import { sendToExtension } from '../../vscodeApi';
import { GuiLanguageSetting, GUI_LANGUAGES, useLanguage } from '../../i18n';

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
  languageSetting: GuiLanguageSetting;
  onChangeLanguage: (setting: GuiLanguageSetting) => void;
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
  languageSetting,
  onChangeLanguage,
}) => {
  const { t } = useLanguage();
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
      name: t('theme.vscode.name'),
      badge: t('theme.vscode.badge'),
      description: t('theme.vscode.desc'),
      previewBg: 'var(--vscode-editor-background, #1e1e1e)',
      previewFg: 'var(--vscode-editor-foreground, #d4d4d4)',
      previewAccent: '#007acc',
      previewBorder: 'var(--vscode-panel-border, #3c3c3c)',
    },
    {
      id: 'dark',
      name: t('theme.dark.name'),
      badge: t('theme.dark.badge'),
      description: t('theme.dark.desc'),
      previewBg: '#0d1117',
      previewFg: '#e6edf3',
      previewAccent: '#6366f1',
      previewBorder: '#30363d',
    },
    {
      id: 'light',
      name: t('theme.light.name'),
      badge: t('theme.light.badge'),
      description: t('theme.light.desc'),
      previewBg: '#f8fafc',
      previewFg: '#0f172a',
      previewAccent: '#2563eb',
      previewBorder: '#cbd5e1',
    },
    {
      id: 'pencil-paper',
      name: t('theme.pencil.name'),
      badge: t('theme.pencil.badge'),
      description: t('theme.pencil.desc'),
      previewBg: '#f6efe1',
      previewFg: '#201c18',
      previewAccent: '#b45309',
      previewBorder: '#8d7b68',
    },
    {
      id: 'animated-hacker',
      name: t('theme.hacker.name'),
      badge: t('theme.hacker.badge'),
      description: t('theme.hacker.desc'),
      previewBg: '#030804',
      previewFg: '#00ff66',
      previewAccent: '#00ff66',
      previewBorder: '#00ff41',
    },
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Settings Intro */}
      <div className="card">
        <h2 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
          {t('settings.introTitle')}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--cf-desc-fg)' }}>
          {t('settings.introDesc')}
        </p>
      </div>

      {/* 0. Interface Language */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <GlobeIcon size={18} style={{ color: 'var(--cf-accent)' }} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
            {t('settings.languageTitle')}
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
              {t('settings.languageSubtitle')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              {t('settings.languageDesc')}
            </div>
          </div>

          <select
            value={languageSetting}
            onChange={(e) => onChangeLanguage(e.target.value as GuiLanguageSetting)}
            aria-label={t('settings.languageTitle')}
            style={{
              minWidth: 200,
              background: 'var(--cf-input-bg)',
              color: 'var(--cf-input-fg)',
              border: '1px solid var(--cf-border)',
              padding: '8px 10px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <option value="auto">{t('settings.languageAuto')}</option>
            {GUI_LANGUAGES.map((language) => (
              <option key={language.id} value={language.id}>
                {language.nativeLabel}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 10 }}>
          {t('settings.languageNote')}
        </div>
      </div>

      {/* 1. Theme Selection Cards */}
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
          {t('settings.themeTitle')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {themesList.map((theme) => {
            const isSelected = guiTheme === theme.id;

            return (
              <div
                key={theme.id}
                className="card"
                onClick={() => onChangeGuiTheme(theme.id)}
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
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cf-title-fg)' }}>{theme.name}</span>
                      <span className="badge" style={{ fontSize: 9 }}>{theme.badge}</span>
                    </div>
                    {isSelected && (
                      <span style={{ color: 'var(--cf-focus-border)', display: 'flex', alignItems: 'center' }}>
                        <CheckIcon size={16} />
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--cf-desc-fg)', lineHeight: 1.4 }}>
                    {theme.description}
                  </p>
                </div>

                {/* Live Mini Preview Box */}
                <div
                  style={{
                    background: theme.previewBg,
                    color: theme.previewFg,
                    border: `1px solid ${theme.previewBorder}`,
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
                        background: theme.previewAccent,
                        boxShadow: theme.id === 'animated-hacker' ? '0 0 6px #00ff66' : 'none',
                      }}
                    />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{t('settings.previewElement')}</span>
                  </div>

                  <div
                    style={{
                      background: theme.previewAccent,
                      color: theme.id === 'animated-hacker' ? '#000' : '#fff',
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {t('settings.previewButton')}
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
          {t('settings.densityTitle')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Density */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, color: 'var(--cf-title-fg)' }}>
              {t('settings.densityLabel')}
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['compact', 'comfortable', 'relaxed'] as GuiDensity[]).map((d) => (
                <button
                  key={d}
                  className={`btn ${density === d ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => onChangeDensity(d)}
                >
                  {d === 'compact'
                    ? t('settings.densityCompact')
                    : d === 'comfortable'
                      ? t('settings.densityComfortable')
                      : t('settings.densityRelaxed')}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 6 }}>
              {t('settings.densityHint')}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, color: 'var(--cf-title-fg)' }}>
              {t('settings.fontLabel', { n: fontSize })}
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[12, 13, 14].map((sz) => (
                <button
                  key={sz}
                  className={`btn ${fontSize === sz ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => onChangeFontSize(sz)}
                >
                  {sz === 12
                    ? t('settings.fontSmall')
                    : sz === 13
                      ? t('settings.fontDefault')
                      : t('settings.fontLarge')}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 6 }}>
              {t('settings.fontHint')}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Box Frame Clock Settings */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ClockIcon size={18} style={{ color: 'var(--cf-accent)' }} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
            {t('settings.clockTitle')}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Status Bar Clock Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
                {t('settings.statusClock')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                {t('settings.statusClockDesc')}
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
                {clockConfig.showClock ? t('settings.on') : t('settings.off')}
              </span>
            </label>
          </div>

          {/* Studio Header Clock Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
                {t('settings.headerClock')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                {t('settings.headerClockDesc')}
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
                {headerClockEnabled ? t('settings.on') : t('settings.off')}
              </span>
            </label>
          </div>

          {/* Live Seconds Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
                {t('settings.secondsTitle')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                {t('settings.secondsDesc')}
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
                {clockConfig.clockShowSeconds ? t('settings.showSeconds') : t('settings.hoursMinutesOnly')}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Visual Effects & Motion */}
      <div className="card">
        <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
          {t('settings.animationsTitle')}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
              {t('settings.animationsLabel')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              {t('settings.animationsDesc')}
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
              {animationsEnabled ? t('settings.animationsEnabled') : t('settings.animationsDisabled')}
            </span>
          </label>
        </div>
      </div>

      {/* 4. Reset Settings Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
            {t('settings.resetTitle')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
            {t('settings.resetDesc')}
          </div>
        </div>

        <button className="btn btn-outline btn-danger" onClick={onResetSettings}>
          <RefreshIcon size={12} />
          <span>{t('settings.resetButton')}</span>
        </button>
      </div>
    </div>
  );
};

