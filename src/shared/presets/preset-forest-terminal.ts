/**
 * ColorFly: Starter Preset - Forest Terminal
 * Deep woodland moss and evergreen darks with phosphor green clarity
 */

import { ThemeProfile } from '../types';

export const PRESET_FOREST_TERMINAL: ThemeProfile = {
  id: 'preset-forest-terminal',
  version: 1,
  name: 'Forest Terminal',
  description: 'Deep woodland moss and evergreen darks with phosphor green clarity',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: false,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#0c1610',
    'editor.foreground': '#dcfce7',
    'activityBar.background': '#080f0b',
    'activityBar.foreground': '#4ade80',
    'activityBarBadge.background': '#16a34a',
    'activityBarBadge.foreground': '#ffffff',
    'sideBar.background': '#102017',
    'sideBar.foreground': '#86efac',
    'sideBarTitle.foreground': '#bbf7d0',
    'tab.activeBackground': '#0c1610',
    'tab.activeForeground': '#f0fdf4',
    'tab.activeBorder': '#22c55e',
    'tab.inactiveBackground': '#142a1e',
    'tab.inactiveForeground': '#4b5563',
    'statusBar.background': '#080f0b',
    'statusBar.foreground': '#4ade80',
    'statusBarItem.remoteBackground': '#15803d',
    'panel.background': '#0c1610',
    'terminal.background': '#080f0b',
    'terminal.foreground': '#86efac',
    'terminal.ansiGreen': '#22c55e',
    'terminal.ansiBrightGreen': '#4ade80',
    'button.background': '#16a34a',
    'button.foreground': '#ffffff',
    'button.hoverBackground': '#15803d',
    'list.activeSelectionBackground': '#14532d',
    'list.activeSelectionForeground': '#dcfce7',
  },
  tokenColors: {
    comments: '#4b7255',
    strings: '#86efac',
    numbers: '#facc15',
    keywords: '#4ade80',
    functions: '#22c55e',
    variables: '#dcfce7',
    types: '#a3e635',
  },
};
