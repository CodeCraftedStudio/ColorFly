/**
 * ChromaForge: Overview Dashboard Component
 * Clean, high-contrast, fully theme-adaptive metrics and starter presets.
 */

import React from 'react';
import { ColorScope, ThemeProfile } from '../../../shared/types';
import { sendToExtension } from '../../vscodeApi';
import { TabId } from '../common/TabsNav';
import { PaletteIcon, EyeIcon, StarIcon, SlidersIcon } from '../common/Icons';

interface OverviewDashboardProps {
  activeThemeName: string;
  activeProfile?: ThemeProfile;
  scope: ColorScope;
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  savedProfiles: ThemeProfile[];
  onNavigateTab: (tab: TabId) => void;
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
}) => {
  const mergedColors = { ...(effectiveColors || {}), ...(stagedColors || {}) };
  const customizedCount = Object.keys(effectiveColors || {}).length;
  const draftCount = Object.keys(stagedColors || {}).length;

  // Extract core palette colors
  const editorBg = mergedColors['editor.background'] || '#1e1e1e';
  const editorFg = mergedColors['editor.foreground'] || '#d4d4d4';
  const activityBg = mergedColors['activityBar.background'] || '#333333';
  const activityFg = mergedColors['activityBar.foreground'] || '#ffffff';
  const sidebarBg = mergedColors['sideBar.background'] || '#252526';
  const statusBg = mergedColors['statusBar.background'] || '#007acc';
  const buttonBg = mergedColors['button.background'] || '#0e639c';
  const terminalBg = mergedColors['terminal.background'] || '#1e1e1e';

  const paletteStrip = [
    { label: 'Editor Background', value: editorBg },
    { label: 'Editor Foreground', value: editorFg },
    { label: 'Activity Bar', value: activityBg },
    { label: 'Activity Icon', value: activityFg },
    { label: 'Sidebar Background', value: sidebarBg },
    { label: 'Status Bar', value: statusBg },
    { label: 'Primary Button', value: buttonBg },
    { label: 'Terminal Surface', value: terminalBg },
  ];

  const handleApplyPreset = (presetId: string, applyImmediately: boolean = false) => {
    sendToExtension({
      type: 'LOAD_PROFILE',
      payload: { profileId: presetId, applyImmediately },
    });
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Welcome Banner with high-contrast text and theme-accent boundary */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--cf-accent)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
            ColorFly Studio Dashboard
          </h2>
          <p style={{ margin: 0, color: 'var(--cf-desc-fg)', fontSize: 13, lineHeight: 1.5 }}>
            Fine-tuned appearance control for Visual Studio Code. Edit components individually, preview live, and apply without editing raw JSON.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => onNavigateTab('workbench')}>
            <PaletteIcon size={14} />
            <span>Customize Workbench</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigateTab('preview')}>
            <EyeIcon size={14} />
            <span>Open Live Preview</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
            Active Color Theme
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: 'var(--cf-title-fg)' }}>
            {activeThemeName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
            Base environment theme
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
            Active Profile
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: 'var(--cf-focus-border)' }}>
            {activeProfile?.name || 'Default Session'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
            {activeProfile?.isBuiltIn ? 'Built-in starter preset' : 'Custom studio profile'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
            Applied Overrides
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: '#16a34a' }}>
            {customizedCount} {customizedCount === 1 ? 'color' : 'colors'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
            Scope: {scope === 'user' ? 'User (Global)' : 'Workspace'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
            Unsaved Draft Changes
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: draftCount > 0 ? '#d97706' : 'var(--cf-title-fg)' }}>
            {draftCount} staged
          </div>
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
            {draftCount > 0 ? 'Ready to apply or discard' : 'In sync with VS Code'}
          </div>
        </div>
      </div>

      {/* Palette Overview */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Active Palette Matrix</h3>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigateTab('picker')}>
            <SlidersIcon size={12} />
            <span>Open Color Harmonies</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
          {paletteStrip.map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--cf-input-bg)',
                border: '1px solid var(--cf-border)',
                borderRadius: 6,
                padding: 10,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  height: 32,
                  borderRadius: 4,
                  background: item.value,
                  marginBottom: 6,
                  border: '1px solid var(--cf-border)',
                  boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
                title={`${item.label}: ${item.value}`}
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--cf-title-fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)', fontFamily: 'var(--cf-font-mono)', marginTop: 2 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Theme Presets */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Curated Theme Presets</h3>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigateTab('profiles')}>
            <span>View All Profiles</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
          {(savedProfiles || []).slice(0, 4).map((preset) => (
            <div
              key={preset.id}
              style={{
                background: 'var(--cf-input-bg)',
                border: '1px solid var(--cf-border)',
                borderRadius: 6,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--cf-title-fg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{preset.name}</span>
                  {preset.isFavorite && <StarIcon size={12} style={{ color: '#eab308' }} />}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 4, lineHeight: 1.3 }}>
                  {preset.description}
                </div>
              </div>

              {/* Mini swatches preview */}
              <div style={{ display: 'flex', height: 16, borderRadius: 3, overflow: 'hidden', border: '1px solid var(--cf-border)' }}>
                {Object.values(preset.workbenchColors || {}).slice(0, 5).map((c, i) => (
                  <div key={i} style={{ flex: 1, background: c }} />
                ))}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleApplyPreset(preset.id, false)}
                  style={{ flex: 1 }}
                  title="Load into workspace as drafts"
                >
                  Load Draft
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleApplyPreset(preset.id, true)}
                  style={{ flex: 1 }}
                  title="Directly apply to VS Code interface"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
