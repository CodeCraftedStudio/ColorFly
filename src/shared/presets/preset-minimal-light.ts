/**
 * ColorFly: Starter Preset - Minimal Light
 * Porcelain white with soft zinc surfaces and high-clarity typography
 */

import { ThemeProfile } from '../types';

export const PRESET_MINIMAL_LIGHT: ThemeProfile = {
  id: 'preset-minimal-light',
  version: 1,
  name: 'Minimal Light',
  description: 'Porcelain white with soft zinc surfaces and high-clarity typography',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: false,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#fafafa',
    'editor.foreground': '#18181b',
    'activityBar.background': '#f4f4f5',
    'activityBar.foreground': '#18181b',
    'activityBarBadge.background': '#2563eb',
    'activityBarBadge.foreground': '#ffffff',
    'sideBar.background': '#f4f4f5',
    'sideBar.foreground': '#52525b',
    'sideBarTitle.foreground': '#18181b',
    'tab.activeBackground': '#ffffff',
    'tab.activeForeground': '#18181b',
    'tab.activeBorder': '#2563eb',
    'tab.inactiveBackground': '#e4e4e7',
    'tab.inactiveForeground': '#71717a',
    'statusBar.background': '#f4f4f5',
    'statusBar.foreground': '#18181b',
    'panel.background': '#ffffff',
    'terminal.background': '#fafafa',
    'terminal.foreground': '#18181b',
    'button.background': '#2563eb',
    'button.foreground': '#ffffff',
    'button.hoverBackground': '#1d4ed8',
    'list.activeSelectionBackground': '#e0e7ff',
    'list.activeSelectionForeground': '#1e3a8a',
  },
  tokenColors: {
    comments: '#71717a',
    strings: '#047857',
    numbers: '#b45309',
    keywords: '#2563eb',
    functions: '#7c3aed',
    variables: '#18181b',
    types: '#0891b2',
  },
};
