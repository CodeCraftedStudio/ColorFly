/**
 * ColorFly: Starter Preset - Midnight
 * Deep obsidian surface with electric violet and celestial indigo accents
 */

import { ThemeProfile } from '../types';

export const PRESET_MIDNIGHT: ThemeProfile = {
  id: 'preset-midnight',
  version: 1,
  name: 'Midnight',
  description: 'Deep obsidian surface with electric violet and celestial indigo accents',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: true,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#0f0f14',
    'editor.foreground': '#e2e2ec',
    'activityBar.background': '#0b0b0e',
    'activityBar.foreground': '#a78bfa',
    'activityBarBadge.background': '#7c3aed',
    'activityBarBadge.foreground': '#ffffff',
    'sideBar.background': '#13131a',
    'sideBar.foreground': '#9ca3af',
    'sideBarTitle.foreground': '#c4b5fd',
    'tab.activeBackground': '#0f0f14',
    'tab.activeForeground': '#f5f3ff',
    'tab.activeBorder': '#8b5cf6',
    'tab.inactiveBackground': '#181824',
    'tab.inactiveForeground': '#6b7280',
    'statusBar.background': '#0b0b0e',
    'statusBar.foreground': '#a78bfa',
    'statusBarItem.remoteBackground': '#6d28d9',
    'panel.background': '#0f0f14',
    'terminal.background': '#0b0b0e',
    'terminal.foreground': '#e2e2ec',
    'terminal.ansiMagenta': '#c084fc',
    'terminal.ansiCyan': '#67e8f9',
    'button.background': '#7c3aed',
    'button.foreground': '#ffffff',
    'button.hoverBackground': '#6d28d9',
    'list.activeSelectionBackground': '#2e1065',
    'list.activeSelectionForeground': '#ede9fe',
  },
  tokenColors: {
    comments: '#6366f1',
    strings: '#a5b4fc',
    numbers: '#f472b6',
    keywords: '#c084fc',
    functions: '#818cf8',
    variables: '#e0e7ff',
    types: '#38bdf8',
  },
};
