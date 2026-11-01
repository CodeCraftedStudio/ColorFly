/**
 * ColorFly: Starter Preset - Soft Lavender
 * Muted twilight purple, velvety orchid, and soft pastel contrasts
 */

import { ThemeProfile } from '../types';

export const PRESET_SOFT_LAVENDER: ThemeProfile = {
  id: 'preset-soft-lavender',
  version: 1,
  name: 'Soft Lavender',
  description: 'Muted twilight purple, velvety orchid, and soft pastel contrasts',
  author: 'ColorFly Studio',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isFavorite: false,
  isBuiltIn: true,
  workbenchColors: {
    'editor.background': '#191724',
    'editor.foreground': '#e0def4',
    'activityBar.background': '#14121d',
    'activityBar.foreground': '#c4a7e7',
    'activityBarBadge.background': '#eb6f92',
    'activityBarBadge.foreground': '#ffffff',
    'sideBar.background': '#1f1d2e',
    'sideBar.foreground': '#908caa',
    'sideBarTitle.foreground': '#e0def4',
    'tab.activeBackground': '#191724',
    'tab.activeForeground': '#f6c177',
    'tab.activeBorder': '#eb6f92',
    'tab.inactiveBackground': '#26233a',
    'tab.inactiveForeground': '#6e6a86',
    'statusBar.background': '#14121d',
    'statusBar.foreground': '#c4a7e7',
    'panel.background': '#191724',
    'terminal.background': '#14121d',
    'terminal.foreground': '#e0def4',
    'button.background': '#9ccfd8',
    'button.foreground': '#191724',
    'button.hoverBackground': '#ebbcba',
    'list.activeSelectionBackground': '#393552',
    'list.activeSelectionForeground': '#e0def4',
  },
  tokenColors: {
    comments: '#6e6a86',
    strings: '#f6c177',
    numbers: '#ebbcba',
    keywords: '#eb6f92',
    functions: '#9ccfd8',
    variables: '#e0def4',
    types: '#c4a7e7',
  },
};
