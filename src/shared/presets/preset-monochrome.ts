/**
 * ColorFly: Starter Preset - Monochrome
 * Disciplined grayscale elegance with pure graphite, slate, and silver
 */

import { ThemeProfile } from '../types';

export const PRESET_MONOCHROME: ThemeProfile = {
  id: 'preset-monochrome',
  version: 1,
  name: 'Monochrome',
  description: 'Disciplined grayscale elegance with pure graphite, slate, and silver',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: false,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#121212',
    'editor.foreground': '#e5e5e5',
    'activityBar.background': '#0d0d0d',
    'activityBar.foreground': '#ffffff',
    'activityBarBadge.background': '#ffffff',
    'activityBarBadge.foreground': '#000000',
    'sideBar.background': '#181818',
    'sideBar.foreground': '#a3a3a3',
    'sideBarTitle.foreground': '#ffffff',
    'tab.activeBackground': '#121212',
    'tab.activeForeground': '#ffffff',
    'tab.activeBorder': '#ffffff',
    'tab.inactiveBackground': '#212121',
    'tab.inactiveForeground': '#737373',
    'statusBar.background': '#0d0d0d',
    'statusBar.foreground': '#d4d4d4',
    'panel.background': '#121212',
    'terminal.background': '#0d0d0d',
    'terminal.foreground': '#e5e5e5',
    'button.background': '#ffffff',
    'button.foreground': '#000000',
    'button.hoverBackground': '#e5e5e5',
    'list.activeSelectionBackground': '#333333',
    'list.activeSelectionForeground': '#ffffff',
  },
  tokenColors: {
    comments: '#666666',
    strings: '#cccccc',
    numbers: '#e0e0e0',
    keywords: '#ffffff',
    functions: '#d0d0d0',
    variables: '#eeeeee',
    types: '#ffffff',
  },
};
