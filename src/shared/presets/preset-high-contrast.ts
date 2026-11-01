/**
 * ColorFly: Starter Preset - High Contrast
 * Pure 0-luminance obsidian with vivid neon outlines and maximal WCAG ratio
 */

import { ThemeProfile } from '../types';

export const PRESET_HIGH_CONTRAST: ThemeProfile = {
  id: 'preset-high-contrast',
  version: 1,
  name: 'High Contrast',
  description: 'Pure 0-luminance obsidian with vivid neon outlines and maximal WCAG ratio',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: false,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#000000',
    'editor.foreground': '#ffffff',
    'activityBar.background': '#000000',
    'activityBar.foreground': '#00ffff',
    'activityBarBadge.background': '#ffff00',
    'activityBarBadge.foreground': '#000000',
    'sideBar.background': '#000000',
    'sideBar.foreground': '#ffffff',
    'sideBarTitle.foreground': '#00ffff',
    'tab.activeBackground': '#000000',
    'tab.activeForeground': '#ffffff',
    'tab.activeBorder': '#00ffff',
    'tab.inactiveBackground': '#121212',
    'tab.inactiveForeground': '#a0a0a0',
    'statusBar.background': '#000000',
    'statusBar.foreground': '#00ffff',
    'panel.background': '#000000',
    'terminal.background': '#000000',
    'terminal.foreground': '#ffffff',
    'button.background': '#ffff00',
    'button.foreground': '#000000',
    'button.hoverBackground': '#ffea00',
    'list.activeSelectionBackground': '#003366',
    'list.activeSelectionForeground': '#ffffff',
    'focusBorder': '#00ffff',
  },
  tokenColors: {
    comments: '#76e098',
    strings: '#ffff00',
    numbers: '#ff80df',
    keywords: '#00ffff',
    functions: '#80d4ff',
    variables: '#ffffff',
    types: '#5cf2bd',
  },
};
