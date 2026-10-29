/**
 * ColorFly: Overview Dashboard Component
 * Ultra-detailed, organized developer studio dashboard with interactive VS Code feature mapping,
 * rich metrics, WCAG contrast indicators, and live window preview cards.
 */

import React, { useState } from 'react';
import { ColorScope, ThemeProfile, WorkbenchCategory } from '../../../shared/types';
import { sendToExtension } from '../../vscodeApi';
import { TabId } from '../common/TabsNav';
import { PaletteIcon, EyeIcon, StarIcon, SlidersIcon, CheckIcon, CopyIcon, LayersIcon } from '../common/Icons';
import { VSCodeFeatureMap } from './VSCodeFeatureMap';
import { getContrastRatio } from '../../../shared/colorUtils';
import { useLanguage } from '../../i18n';

interface OverviewDashboardProps {
  activeThemeName: string;
  activeProfile?: ThemeProfile;
  scope: ColorScope;
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  savedProfiles: ThemeProfile[];
  onNavigateTab: (tab: TabId) => void;
  onNavigateToCategory?: (category: WorkbenchCategory) => void;
  onOpenExportModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  activeThemeName,
  activeProfile,
  scope,
  effectiveColors = {},
  stagedColors = {},
  savedProfiles = [],
  onNavigateTab,
  onNavigateToCategory,
}) => {
  const mergedColors = { ...(effectiveColors || {}), ...(stagedColors || {}) };
  const customizedCount = Object.keys(effectiveColors || {}).length;
  const draftCount = Object.keys(stagedColors || {}).length;
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const { t } = useLanguage();

  // Extract core palette colors
  const editorBg = mergedColors['editor.background'] || '#1e1e1e';
  const editorFg = mergedColors['editor.foreground'] || '#d4d4d4';
  const activityBg = mergedColors['activityBar.background'] || '#333333';
  const activityFg = mergedColors['activityBar.foreground'] || '#ffffff';
  const sidebarBg = mergedColors['sideBar.background'] || '#252526';
  const sidebarFg = mergedColors['sideBar.foreground'] || '#cccccc';
  const statusBg = mergedColors['statusBar.background'] || '#007acc';
  const statusFg = mergedColors['statusBar.foreground'] || '#ffffff';
  const buttonBg = mergedColors['button.background'] || '#0e639c';
  const terminalBg = mergedColors['terminal.background'] || '#1e1e1e';

  // Calculate contrast ratios
  const editorContrast = getContrastRatio(editorFg, editorBg).toFixed(1);
  const statusContrast = getContrastRatio(statusFg, statusBg).toFixed(1);
  const sidebarContrast = getContrastRatio(sidebarFg, sidebarBg).toFixed(1);

  const paletteStrip = [
    {
      label: t('overview.pal.editorBg.label'),
      featurePill: t('overview.pal.editorBg.pill'),
      value: editorBg,
      textColor: editorFg,
      contrast: `${editorContrast}:1`,
      wcag: Number(editorContrast) >= 7 ? 'AAA' : Number(editorContrast) >= 4.5 ? 'AA' : 'Fail',
      description: t('overview.pal.editorBg.desc'),
    },
    {
      label: t('overview.pal.editorFg.label'),
      featurePill: t('overview.pal.editorFg.pill'),
      value: editorFg,
      textColor: editorBg,
      contrast: `${editorContrast}:1`,
      wcag: Number(editorContrast) >= 7 ? 'AAA' : Number(editorContrast) >= 4.5 ? 'AA' : 'Fail',
      description: t('overview.pal.editorFg.desc'),
    },
    {
      label: t('overview.pal.activityBg.label'),
      featurePill: t('overview.pal.activityBg.pill'),
      value: activityBg,
      textColor: activityFg,
      contrast: `${getContrastRatio(activityFg, activityBg).toFixed(1)}:1`,
      wcag: Number(getContrastRatio(activityFg, activityBg)) >= 4.5 ? 'AA' : 'Low',
      description: t('overview.pal.activityBg.desc'),
    },
    {
      label: t('overview.pal.activityIcon.label'),
      featurePill: t('overview.pal.activityIcon.pill'),
      value: activityFg,
      textColor: activityBg,
      contrast: `${getContrastRatio(activityFg, activityBg).toFixed(1)}:1`,
      wcag: Number(getContrastRatio(activityFg, activityBg)) >= 4.5 ? 'AA' : 'Low',
      description: t('overview.pal.activityIcon.desc'),
    },
    {
      label: t('overview.pal.sidebarBg.label'),
      featurePill: t('overview.pal.sidebarBg.pill'),
      value: sidebarBg,
      textColor: sidebarFg,
      contrast: `${sidebarContrast}:1`,
      wcag: Number(sidebarContrast) >= 4.5 ? 'AA' : 'Low',
      description: t('overview.pal.sidebarBg.desc'),
    },
    {
      label: t('overview.pal.statusBg.label'),
      featurePill: t('overview.pal.statusBg.pill'),
      value: statusBg,
      textColor: statusFg,
      contrast: `${statusContrast}:1`,
      wcag: Number(statusContrast) >= 4.5 ? 'AA' : 'Low',
      description: t('overview.pal.statusBg.desc'),
    },
    {
      label: t('overview.pal.buttonBg.label'),
      featurePill: t('overview.pal.buttonBg.pill'),
      value: buttonBg,
      textColor: '#ffffff',
      contrast: `${getContrastRatio('#ffffff', buttonBg).toFixed(1)}:1`,
      wcag: Number(getContrastRatio('#ffffff', buttonBg)) >= 4.5 ? 'AA' : 'Low',
      description: t('overview.pal.buttonBg.desc'),
    },
    {
      label: t('overview.pal.terminalBg.label'),
      featurePill: t('overview.pal.terminalBg.pill'),
      value: terminalBg,
      textColor: '#cccccc',
      contrast: `${getContrastRatio('#cccccc', terminalBg).toFixed(1)}:1`,
      wcag: Number(getContrastRatio('#cccccc', terminalBg)) >= 4.5 ? 'AA' : 'Low',
      description: t('overview.pal.terminalBg.desc'),
    },
  ];

  const handleCopyColor = (val: string, label: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedHex(label);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleApplyPreset = (presetId: string, applyImmediately: boolean = false) => {
    sendToExtension({
      type: 'LOAD_PROFILE',
      payload: { profileId: presetId, applyImmediately },
    });
  };

  const handleCategoryNavigation = (cat: WorkbenchCategory) => {
    if (onNavigateToCategory) {
      onNavigateToCategory(cat);
    } else {
      onNavigateTab('workbench');
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* 1. Command Hero Section */}
      <div
        className="card"
        style={{
          position: 'relative',
          padding: '24px 28px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--cf-card-bg) 0%, rgba(99, 102, 241, 0.04) 100%)',
          border: '1px solid var(--cf-border)',
          boxShadow: 'var(--cf-card-shadow)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ maxWidth: 650 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700,
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--cf-accent)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                ● ColorFly Theme Studio 2.0
              </span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  background: 'var(--cf-input-bg)',
                  border: '1px solid var(--cf-border)',
                  color: 'var(--cf-desc-fg)',
                }}
              >
                {t('overview.scopeLabel')} <strong>{scope === 'user' ? t('overview.scopeUser') : t('overview.scopeWorkspace')}</strong>
              </span>
            </div>

            <h2 style={{ margin: '0 0 6px 0', fontSize: 22, fontWeight: 800, color: 'var(--cf-title-fg)', letterSpacing: '-0.02em' }}>
              ColorFly Appearance Engineering
            </h2>
            <p style={{ margin: 0, color: 'var(--cf-desc-fg)', fontSize: 13, lineHeight: 1.6 }}>
              {t('overview.heroDesc')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => onNavigateTab('workbench')}
              style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 600 }}
            >
              <PaletteIcon size={14} />
              <span>{t('overview.customizeWorkbench')}</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigateTab('preview')}
              style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 600 }}
            >
              <EyeIcon size={14} />
              <span>{t('overview.livePreview')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Rich 4-Card Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {/* Card 1: Active Theme */}
        <div
          className="card"
          style={{
            padding: 16,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
                {t('overview.activeTheme')}
              </span>
              <PaletteIcon size={14} style={{ opacity: 0.6 }} />
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginTop: 6,
                color: 'var(--cf-title-fg)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={activeThemeName}
            >
              {activeThemeName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              {t('overview.activeThemeDesc')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
            <span className="badge badge-info" style={{ fontSize: 10 }}>{t('overview.baseEnvironment')}</span>
            <span style={{ fontSize: 10, color: 'var(--cf-desc-fg)' }}>{t('overview.themeScoped')}</span>
          </div>
        </div>

        {/* Card 2: Active Profile */}
        <div
          className="card"
          style={{
            padding: 16,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
                {t('overview.activeProfile')}
              </span>
              <LayersIcon size={14} style={{ opacity: 0.6 }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6, color: 'var(--cf-focus-border)' }}>
              {activeProfile?.name || t('overview.defaultSession')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              {activeProfile?.isBuiltIn ? t('overview.builtInPreset') : t('overview.customProfile')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
            <span className="badge" style={{ fontSize: 10 }}>
              {activeProfile?.isBuiltIn ? t('overview.presetBadge') : t('overview.userSavedBadge')}
            </span>
            <button
              onClick={() => onNavigateTab('profiles')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cf-accent)',
                fontSize: 11,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              {t('overview.switchProfile')}
            </button>
          </div>
        </div>

        {/* Card 3: Applied Overrides */}
        <div
          className="card"
          style={{
            padding: 16,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
                {t('overview.appliedOverrides')}
              </span>
              <SlidersIcon size={14} style={{ opacity: 0.6 }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6, color: '#16a34a' }}>
              {customizedCount} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cf-desc-fg)' }}>{t('overview.colorsCustomized')}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              {t('overview.scopeLabel')} <strong>{scope === 'user' ? t('overview.scopeUserFull') : t('overview.scopeWorkspace')}</strong>
            </div>
          </div>
          {/* Visual Mini Progress Bar */}
          <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--cf-border)', marginTop: 4 }}>
            <div style={{ width: `${Math.min(100, customizedCount * 3)}%`, background: '#16a34a' }} />
          </div>
        </div>

        {/* Card 4: Draft & Sync Status */}
        <div
          className="card"
          style={{
            padding: 16,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
                {t('overview.draftStatus')}
              </span>
              <CheckIcon size={14} style={{ opacity: 0.6 }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6, color: draftCount > 0 ? '#d97706' : '#16a34a' }}>
              {draftCount > 0 ? t('overview.stagedChanges', { n: draftCount }) : t('overview.synchronized')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              {draftCount > 0 ? t('overview.changesPending') : t('overview.inSync')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: draftCount > 0 ? '#d97706' : '#16a34a',
                boxShadow: draftCount > 0 ? '0 0 6px #d97706' : '0 0 6px #16a34a',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: draftCount > 0 ? '#d97706' : '#16a34a' }}>
              {draftCount > 0 ? t('overview.readyToApply') : t('overview.cleanState')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Interactive VS Code Feature Blueprint (What Settings Change Which Features) */}
      <VSCodeFeatureMap
        effectiveColors={effectiveColors}
        stagedColors={stagedColors}
        onNavigateToCategory={handleCategoryNavigation}
      />

      {/* 4. Active Palette Matrix (Detailed with WCAG Contrast & Copy-to-Clipboard) */}
      <div className="card" style={{ padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
              {t('overview.paletteTitle')}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--cf-desc-fg)' }}>
              {t('overview.paletteDesc')}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigateTab('picker')}>
            <SlidersIcon size={12} />
            <span>{t('overview.openColorStudio')}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          {paletteStrip.map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--cf-input-bg)',
                border: '1px solid var(--cf-border)',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
                position: 'relative',
              }}
            >
              <div>
                {/* Feature Location Pill */}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    padding: '2px 5px',
                    borderRadius: 4,
                    background: 'var(--cf-card-bg)',
                    border: '1px solid var(--cf-border)',
                    color: 'var(--cf-accent)',
                    display: 'inline-block',
                    marginBottom: 8,
                  }}
                >
                  {item.featurePill}
                </span>

                {/* Color Swatch with Contrast Overlay */}
                <div
                  style={{
                    height: 38,
                    borderRadius: 6,
                    background: item.value,
                    marginBottom: 8,
                    border: '1px solid var(--cf-border)',
                    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => handleCopyColor(item.value, item.label)}
                  title={`Click to copy ${item.value}`}
                >
                  {copiedHex === item.label ? (
                    <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                      {t('overview.copied')}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 9,
                        background: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        padding: '1px 5px',
                        borderRadius: 3,
                        fontWeight: 600,
                      }}
                    >
                      {item.wcag}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--cf-title-fg)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={item.label}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--cf-desc-fg)',
                    fontFamily: 'var(--cf-font-mono)',
                    marginTop: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{item.value}</span>
                  <button
                    onClick={() => handleCopyColor(item.value, item.label)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--cf-desc-fg)' }}
                    title={t('overview.copyHex')}
                  >
                    <CopyIcon size={11} />
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)', marginTop: 6, borderTop: '1px solid var(--cf-border)', paddingTop: 5 }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Curated Theme Presets with Mini VS Code Window Previews */}
      <div className="card" style={{ padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
              {t('overview.presetsTitle')}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--cf-desc-fg)' }}>
              {t('overview.presetsDesc')}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigateTab('profiles')}>
            <span>{t('overview.viewAllProfiles', { n: savedProfiles.length })}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
          {(savedProfiles || []).slice(0, 4).map((preset) => {
            const pColors = preset.workbenchColors || {};
            const pEditorBg = pColors['editor.background'] || '#1e1e1e';
            const pEditorFg = pColors['editor.foreground'] || '#d4d4d4';
            const pActivityBg = pColors['activityBar.background'] || '#333333';
            const pSidebarBg = pColors['sideBar.background'] || '#252526';
            const pStatusBg = pColors['statusBar.background'] || '#007acc';

            return (
              <div
                key={preset.id}
                style={{
                  background: 'var(--cf-input-bg)',
                  border: '1px solid var(--cf-border)',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cf-title-fg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{preset.name}</span>
                    {preset.isFavorite && <StarIcon size={13} style={{ color: '#eab308' }} />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 4, lineHeight: 1.4, minHeight: 30 }}>
                    {preset.description}
                  </div>
                </div>

                {/* Mini Realistic VS Code Mockup Preview Thumbnail */}
                <div
                  style={{
                    height: 72,
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: '1px solid var(--cf-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    background: pEditorBg,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Title Bar dots */}
                  <div style={{ height: 10, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', paddingLeft: 6, gap: 3 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#27c93f' }} />
                  </div>

                  {/* Body: Activity + Sidebar + Code */}
                  <div style={{ flex: 1, display: 'flex' }}>
                    <div style={{ width: 14, background: pActivityBg }} />
                    <div style={{ width: 40, background: pSidebarBg, borderRight: '1px solid rgba(0,0,0,0.1)' }} />
                    <div style={{ flex: 1, background: pEditorBg, padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ height: 3, width: '40%', background: pEditorFg, opacity: 0.6, borderRadius: 1 }} />
                      <div style={{ height: 3, width: '65%', background: '#569cd6', opacity: 0.8, borderRadius: 1 }} />
                      <div style={{ height: 3, width: '50%', background: '#ce9178', opacity: 0.8, borderRadius: 1 }} />
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div style={{ height: 8, background: pStatusBg }} />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleApplyPreset(preset.id, false)}
                    style={{ flex: 1, borderRadius: 6 }}
                    title="Load into workspace as staged drafts"
                  >
                    {t('overview.loadDraft')}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApplyPreset(preset.id, true)}
                    style={{ flex: 1, borderRadius: 6 }}
                    title="Directly apply to VS Code interface"
                  >
                    {t('overview.applyNow')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
