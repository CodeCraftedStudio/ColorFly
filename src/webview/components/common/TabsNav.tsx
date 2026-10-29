/**
 * ChromaForge: Navigation Tabs Component
 * Clean professional tab navigation using vector SVG icons.
 */

import React from 'react';
import {
  OverviewIcon,
  PaletteIcon,
  SlidersIcon,
  CodeIcon,
  EyeIcon,
  LayersIcon,
  ShieldCheckIcon,
  WrenchIcon,
  ClockIcon,
  SettingsIcon,
} from './Icons';

export type TabId =
  | 'overview'
  | 'workbench'
  | 'picker'
  | 'syntax'
  | 'preview'
  | 'profiles'
  | 'accessibility'
  | 'advanced'
  | 'clock'
  | 'settings';

interface TabsNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  draftCount: number;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  activeTab,
  onChangeTab,
  draftCount,
}) => {
  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: <OverviewIcon size={14} /> },
    { id: 'workbench', label: 'Workbench Colors', icon: <PaletteIcon size={14} />, badge: draftCount > 0 ? draftCount : undefined },
    { id: 'picker', label: 'Color Studio & Harmonies', icon: <SlidersIcon size={14} /> },
    { id: 'syntax', label: 'Syntax Highlighting', icon: <CodeIcon size={14} /> },
    { id: 'preview', label: 'Live Preview Engine', icon: <EyeIcon size={14} /> },
    { id: 'profiles', label: 'Profiles & Presets', icon: <LayersIcon size={14} /> },
    { id: 'accessibility', label: 'Accessibility & WCAG', icon: <ShieldCheckIcon size={14} /> },
    { id: 'advanced', label: 'Advanced & Raw JSON', icon: <WrenchIcon size={14} /> },
    { id: 'clock', label: 'Clock & Frame', icon: <ClockIcon size={14} /> },
    { id: 'settings', label: 'GUI Settings', icon: <SettingsIcon size={14} /> },
  ];

  return (
    <nav className="nav-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`nav-tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChangeTab(tab.id)}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className="badge badge-warning" style={{ fontSize: 9, padding: '1px 5px' }}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};
