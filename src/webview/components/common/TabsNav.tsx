/**
 * ColorFly: Navigation Tabs Component
 * Clean professional tab navigation using vector SVG icons.
 */

import React from 'react';
import { useLanguage } from '../../i18n';
import {
  OverviewIcon,
  PaletteIcon,
  SlidersIcon,
  CodeIcon,
  EyeIcon,
  LayersIcon,
  ShieldCheckIcon,
  WrenchIcon,
  FileIcon,
  ClockIcon,
  SettingsIcon,
  TerminalIcon,
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
  | 'icons'
  | 'clock'
  | 'settings'
  | 'logs';

interface TabsNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  draftCount: number;
  errorCount?: number;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  activeTab,
  onChangeTab,
  draftCount,
  errorCount = 0,
}) => {
  const { t } = useLanguage();
  const tabs: Array<{
    id: TabId;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeTone?: 'warning' | 'error';
  }> = [
    { id: 'overview', label: t('tab.overview'), icon: <OverviewIcon size={14} /> },
    { id: 'workbench', label: t('tab.workbench'), icon: <PaletteIcon size={14} />, badge: draftCount > 0 ? draftCount : undefined },
    { id: 'picker', label: t('tab.picker'), icon: <SlidersIcon size={14} /> },
    { id: 'syntax', label: t('tab.syntax'), icon: <CodeIcon size={14} /> },
    { id: 'preview', label: t('tab.preview'), icon: <EyeIcon size={14} /> },
    { id: 'profiles', label: t('tab.profiles'), icon: <LayersIcon size={14} /> },
    { id: 'accessibility', label: t('tab.accessibility'), icon: <ShieldCheckIcon size={14} /> },
    { id: 'advanced', label: t('tab.advanced'), icon: <WrenchIcon size={14} /> },
    { id: 'icons', label: t('tab.icons'), icon: <FileIcon size={14} /> },
    { id: 'clock', label: t('tab.clock'), icon: <ClockIcon size={14} /> },
    { id: 'settings', label: t('tab.settings'), icon: <SettingsIcon size={14} /> },
    {
      id: 'logs',
      label: t('tab.logs'),
      icon: <TerminalIcon size={14} />,
      badge: errorCount > 0 ? errorCount : undefined,
      badgeTone: 'error',
    },
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
            <span
              className="badge"
              style={{
                fontSize: 9,
                padding: '1px 5px',
                background: tab.badgeTone === 'error' ? '#dc2626' : undefined,
                color: tab.badgeTone === 'error' ? '#ffffff' : undefined,
              }}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

