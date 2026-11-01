/**
 * ColorFly: Starter Preset - Deep Ocean
 * Abyssal teal and ocean blue with radiant cyan highlights
 */

import { ThemeProfile } from '../types';

export const PRESET_DEEP_OCEAN: ThemeProfile = {
  id: 'preset-deep-ocean',
  version: 1,
  name: 'Deep Ocean',
  description: 'Abyssal teal and ocean blue with radiant cyan highlights',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: true,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#0a1520',
    'editor.foreground': '#d6f0f5',
    'activityBar.background': '#060d14',
    'activityBar.foreground': '#22d3ee',
    'activityBarBadge.background': '#0891b2',
    'activityBarBadge.foreground': '#ffffff',
    'sideBar.background': '#0d1d2b',
    'sideBar.foreground': '#94a3b8',
    'sideBarTitle.foreground': '#67e8f9',
    'tab.activeBackground': '#0a1520',
    'tab.activeForeground': '#ecfeff',
    'tab.activeBorder': '#06b6d4',
    'tab.inactiveBackground': '#112538',
    'tab.inactiveForeground': '#64748b',
    'statusBar.background': '#060d14',
    'statusBar.foreground': '#22d3ee',
    'statusBarItem.remoteBackground': '#0e7490',
    'panel.background': '#0a1520',
    'terminal.background': '#071018',
    'terminal.foreground': '#d6f0f5',
    'terminal.ansiCyan': '#06b6d4',
    'terminal.ansiBlue': '#38bdf8',
    'button.background': '#0891b2',
    'button.foreground': '#ffffff',
    'button.hoverBackground': '#0e7490',
    'list.activeSelectionBackground': '#155e75',
    'list.activeSelectionForeground': '#cffafe',
  },
  tokenColors: {
    comments: '#475569',
    strings: '#67e8f9',
    numbers: '#2dd4bf',
    keywords: '#38bdf8',
    functions: '#06b6d4',
    variables: '#e0f2fe',
    types: '#5eead4',
  },
};
