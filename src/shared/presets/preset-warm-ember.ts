/**
 * ColorFly: Starter Preset - Warm Ember
 * Charcoal hearth with glowing ember orange, terracotta, and warm brass
 */

import { ThemeProfile } from '../types';

export const PRESET_WARM_EMBER: ThemeProfile = {
  id: 'preset-warm-ember',
  version: 1,
  name: 'Warm Ember',
  description: 'Charcoal hearth with glowing ember orange, terracotta, and warm brass',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: false,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#161210',
    'editor.foreground': '#fed7aa',
    'activityBar.background': '#0f0c0b',
    'activityBar.foreground': '#fb923c',
    'activityBarBadge.background': '#ea580c',
    'activityBarBadge.foreground': '#ffffff',
    'sideBar.background': '#1f1916',
    'sideBar.foreground': '#fdba74',
    'sideBarTitle.foreground': '#ffedd5',
    'tab.activeBackground': '#161210',
    'tab.activeForeground': '#fff7ed',
    'tab.activeBorder': '#f97316',
    'tab.inactiveBackground': '#261f1c',
    'tab.inactiveForeground': '#78716c',
    'statusBar.background': '#0f0c0b',
    'statusBar.foreground': '#fb923c',
    'statusBarItem.remoteBackground': '#c2410c',
    'panel.background': '#161210',
    'terminal.background': '#0f0c0b',
    'terminal.foreground': '#fed7aa',
    'terminal.ansiYellow': '#f59e0b',
    'terminal.ansiRed': '#ef4444',
    'button.background': '#ea580c',
    'button.foreground': '#ffffff',
    'button.hoverBackground': '#c2410c',
    'list.activeSelectionBackground': '#7c2d12',
    'list.activeSelectionForeground': '#ffedd5',
  },
  tokenColors: {
    comments: '#7c5f55',
    strings: '#fde047',
    numbers: '#fb923c',
    keywords: '#f97316',
    functions: '#f59e0b',
    variables: '#ffedd5',
    types: '#fdba74',
  },
};
