/**
 * ChromaForge: Official VS Code Workbench Color Catalog
 * Fully compliant with the official VS Code Theme Color Reference.
 * Comprehensive categorization, clear human names, and contextual descriptions.
 */

import { ColorDefinition, WorkbenchCategory } from './types';

export interface CategoryMetadata {
  id: WorkbenchCategory;
  label: string;
  description: string;
  icon: string;
}

export const WORKBENCH_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'activityBar',
    label: 'Activity Bar',
    description: 'Navigation bar on the far side of the workbench for switching views',
    icon: 'activity',
  },
  {
    id: 'sideBar',
    label: 'Primary Sidebar',
    description: 'Collapsible container for Explorer, Search, Source Control, and custom views',
    icon: 'sidebar',
  },
  {
    id: 'editor',
    label: 'Editor',
    description: 'Code editor background, line numbers, selection, cursor, guides, and brackets',
    icon: 'code',
  },
  {
    id: 'tabsAndTitle',
    label: 'Tabs & Title Bar',
    description: 'Window title bar, editor group tabs, active/inactive headers, and borders',
    icon: 'folder',
  },
  {
    id: 'statusBar',
    label: 'Status Bar',
    description: 'Bottom bar showing branch, language, errors, notifications, and remote status',
    icon: 'sliders',
  },
  {
    id: 'panel',
    label: 'Panel',
    description: 'Bottom/side area for Output, Problems, Debug Console, and Terminals',
    icon: 'terminal',
  },
  {
    id: 'terminal',
    label: 'Integrated Terminal',
    description: 'Built-in shell background, foreground, ANSI color spectrum, and cursor',
    icon: 'terminal',
  },
  {
    id: 'buttonsAndInputs',
    label: 'Buttons & Inputs',
    description: 'Interactive buttons, text inputs, dropdowns, checkboxes, and validation',
    icon: 'check-square',
  },
  {
    id: 'listsAndTrees',
    label: 'Lists, Trees & Menus',
    description: 'Selection states, tree items, hover effects, Quick Pick, and Suggest widgets',
    icon: 'list',
  },
  {
    id: 'searchAndDebug',
    label: 'Search, Git & Debug',
    description: 'Find match highlights, SCM file states, breakpoints, and debug toolbar',
    icon: 'search',
  },
  {
    id: 'notifications',
    label: 'Notifications & Popups',
    description: 'Toast alerts, notification center, hovers, and context menus',
    icon: 'bell',
  },
  {
    id: 'other',
    label: 'Other Components',
    description: 'Badges, scrollbars, progress indicators, breadcrumbs, and welcome screens',
    icon: 'layers',
  },
];

export const OFFICIAL_WORKBENCH_COLORS: ColorDefinition[] = [
  // ==========================================
  // 1. Activity Bar
  // ==========================================
  {
    id: 'activityBar.background',
    name: 'Activity Bar Background',
    description: 'Activity bar background color on the far left/right side.',
    category: 'activityBar',
    defaultValue: '#333333',
  },
  {
    id: 'activityBar.foreground',
    name: 'Activity Bar Active Icon Color',
    description: 'Activity bar foreground color for active icons.',
    category: 'activityBar',
    defaultValue: '#ffffff',
  },
  {
    id: 'activityBar.inactiveForeground',
    name: 'Activity Bar Inactive Icon Color',
    description: 'Activity bar foreground color for inactive items.',
    category: 'activityBar',
    defaultValue: '#ffffff66',
  },
  {
    id: 'activityBar.border',
    name: 'Activity Bar Border',
    description: 'Activity bar border color with the side bar.',
    category: 'activityBar',
    defaultValue: '#00000000',
  },
  {
    id: 'activityBar.activeBorder',
    name: 'Activity Bar Active Item Border',
    description: 'Activity bar border color for the active item indicator.',
    category: 'activityBar',
    defaultValue: '#ffffff',
  },
  {
    id: 'activityBar.activeBackground',
    name: 'Activity Bar Active Item Background',
    description: 'Activity bar background color for the active item.',
    category: 'activityBar',
    defaultValue: '#00000000',
  },
  {
    id: 'activityBar.activeFocusBorder',
    name: 'Activity Bar Focus Border',
    description: 'Activity bar focus border color for the active item.',
    category: 'activityBar',
  },
  {
    id: 'activityBarBadge.background',
    name: 'Activity Bar Badge Background',
    description: 'Activity notification badge background color.',
    category: 'activityBar',
    defaultValue: '#007acc',
  },
  {
    id: 'activityBarBadge.foreground',
    name: 'Activity Bar Badge Foreground',
    description: 'Activity notification badge foreground color.',
    category: 'activityBar',
    defaultValue: '#ffffff',
  },
  {
    id: 'activityBarTop.background',
    name: 'Top Activity Bar Background',
    description: 'Background color when Activity Bar is positioned at the top.',
    category: 'activityBar',
  },
  {
    id: 'activityBarTop.foreground',
    name: 'Top Activity Bar Foreground',
    description: 'Foreground color for active items when Activity Bar is positioned at the top.',
    category: 'activityBar',
  },
  {
    id: 'activityBarTop.activeBorder',
    name: 'Top Activity Bar Active Border',
    description: 'Active indicator border when Activity Bar is positioned at the top.',
    category: 'activityBar',
  },

  // ==========================================
  // 2. Primary Sidebar
  // ==========================================
  {
    id: 'sideBar.background',
    name: 'Sidebar Background',
    description: 'Side Bar background color.',
    category: 'sideBar',
    defaultValue: '#252526',
  },
  {
    id: 'sideBar.foreground',
    name: 'Sidebar Foreground',
    description: 'Side Bar foreground color. The side bar is the container for views like Explorer and Search.',
    category: 'sideBar',
    defaultValue: '#cccccc',
  },
  {
    id: 'sideBar.border',
    name: 'Sidebar Border',
    description: 'Side Bar border color on the side separating the editor.',
    category: 'sideBar',
    defaultValue: '#00000000',
  },
  {
    id: 'sideBar.dropBackground',
    name: 'Sidebar Drop Target Background',
    description: 'Drag and drop feedback color for the side bar sections.',
    category: 'sideBar',
    defaultValue: '#53595d80',
  },
  {
    id: 'sideBarTitle.foreground',
    name: 'Sidebar Title Foreground',
    description: 'Side Bar title foreground color.',
    category: 'sideBar',
    defaultValue: '#bbbbbb',
  },
  {
    id: 'sideBarSectionHeader.background',
    name: 'Sidebar Section Header Background',
    description: 'Side Bar section header background color.',
    category: 'sideBar',
    defaultValue: '#00000000',
  },
  {
    id: 'sideBarSectionHeader.foreground',
    name: 'Sidebar Section Header Foreground',
    description: 'Side Bar section header foreground color.',
    category: 'sideBar',
    defaultValue: '#cccccc',
  },
  {
    id: 'sideBarSectionHeader.border',
    name: 'Sidebar Section Header Border',
    description: 'Side Bar section header border color.',
    category: 'sideBar',
    defaultValue: '#cccccc33',
  },

  // ==========================================
  // 3. Editor
  // ==========================================
  {
    id: 'editor.background',
    name: 'Editor Background',
    description: 'Main editor background color.',
    category: 'editor',
    defaultValue: '#1e1e1e',
  },
  {
    id: 'editor.foreground',
    name: 'Editor Foreground (Default Text)',
    description: 'Main editor default foreground color.',
    category: 'editor',
    defaultValue: '#d4d4d4',
  },
  {
    id: 'editorLineNumber.foreground',
    name: 'Line Numbers Color',
    description: 'Color of editor line numbers.',
    category: 'editor',
    defaultValue: '#858585',
  },
  {
    id: 'editorLineNumber.activeForeground',
    name: 'Active Line Number Color',
    description: 'Color of the active editor line number.',
    category: 'editor',
    defaultValue: '#c6c6c6',
  },
  {
    id: 'editor.lineHighlightBackground',
    name: 'Current Line Highlight Background',
    description: 'Background color for the highlight of line at the cursor position.',
    category: 'editor',
    defaultValue: '#ffffff0a',
  },
  {
    id: 'editor.lineHighlightBorder',
    name: 'Current Line Highlight Border',
    description: 'Border color for the highlight of line at the cursor position.',
    category: 'editor',
  },
  {
    id: 'editorCursor.foreground',
    name: 'Editor Cursor Color',
    description: 'Color of the editor cursor.',
    category: 'editor',
    defaultValue: '#aeafad',
  },
  {
    id: 'editor.selectionBackground',
    name: 'Selection Background',
    description: 'Color of the editor selection.',
    category: 'editor',
    defaultValue: '#264f78',
  },
  {
    id: 'editor.selectionForeground',
    name: 'Selection Foreground',
    description: 'Color of the selected text.',
    category: 'editor',
  },
  {
    id: 'editor.inactiveSelectionBackground',
    name: 'Inactive Selection Background',
    description: 'Color of the selection in an inactive editor.',
    category: 'editor',
    defaultValue: '#3a3d41',
  },
  {
    id: 'editor.selectionHighlightBackground',
    name: 'Selection Highlight Background',
    description: 'Color for regions with the same content as the selection.',
    category: 'editor',
    defaultValue: '#add6ff26',
  },
  {
    id: 'editorWhitespace.foreground',
    name: 'Whitespace Characters Color',
    description: 'Color of whitespace characters in the editor.',
    category: 'editor',
    defaultValue: '#e3e4e229',
  },
  {
    id: 'editorIndentGuide.background1',
    name: 'Indent Guide Color',
    description: 'Color of the editor indentation guides.',
    category: 'editor',
    defaultValue: '#404040',
  },
  {
    id: 'editorIndentGuide.activeBackground1',
    name: 'Active Indent Guide Color',
    description: 'Color of the active editor indentation guide.',
    category: 'editor',
    defaultValue: '#707070',
  },
  {
    id: 'editorRuler.foreground',
    name: 'Editor Ruler Color',
    description: 'Color of the editor column rulers.',
    category: 'editor',
    defaultValue: '#5a5a5a',
  },
  {
    id: 'editor.findMatchBackground',
    name: 'Current Find Match Highlight',
    description: 'Color of the current search match.',
    category: 'editor',
    defaultValue: '#515c6a',
  },
  {
    id: 'editor.findMatchHighlightBackground',
    name: 'Other Find Matches Highlight',
    description: 'Color of the other search matches.',
    category: 'editor',
    defaultValue: '#ea5c0055',
  },
  {
    id: 'editorBracketMatch.background',
    name: 'Matching Bracket Background',
    description: 'Background color behind matching brackets.',
    category: 'editor',
    defaultValue: '#0064001a',
  },
  {
    id: 'editorBracketMatch.border',
    name: 'Matching Bracket Border',
    description: 'Color of matching brackets boxes.',
    category: 'editor',
    defaultValue: '#888888',
  },
  {
    id: 'editorBracketHighlight.foreground1',
    name: 'Bracket Pair Color 1',
    description: 'Foreground color of bracket pair level 1.',
    category: 'editor',
    defaultValue: '#ffd700',
  },
  {
    id: 'editorBracketHighlight.foreground2',
    name: 'Bracket Pair Color 2',
    description: 'Foreground color of bracket pair level 2.',
    category: 'editor',
    defaultValue: '#da70d6',
  },
  {
    id: 'editorBracketHighlight.foreground3',
    name: 'Bracket Pair Color 3',
    description: 'Foreground color of bracket pair level 3.',
    category: 'editor',
    defaultValue: '#179fff',
  },
  {
    id: 'editorGutter.background',
    name: 'Editor Gutter Background',
    description: 'Background color of the editor gutter (includes line numbers and glyph margin).',
    category: 'editor',
    defaultValue: '#1e1e1e',
  },
  {
    id: 'editorGutter.modifiedBackground',
    name: 'Gutter Modified Indicator',
    description: 'Editor gutter decoration color for modified lines.',
    category: 'editor',
    defaultValue: '#1b81a8',
  },
  {
    id: 'editorGutter.addedBackground',
    name: 'Gutter Added Indicator',
    description: 'Editor gutter decoration color for added lines.',
    category: 'editor',
    defaultValue: '#487e02',
  },
  {
    id: 'editorGutter.deletedBackground',
    name: 'Gutter Deleted Indicator',
    description: 'Editor gutter decoration color for deleted lines.',
    category: 'editor',
    defaultValue: '#f14c4c',
  },
  {
    id: 'editorGutter.foldingControlForeground',
    name: 'Folding Control Color',
    description: 'Color of the folding control in the editor gutter.',
    category: 'editor',
    defaultValue: '#c5c5c5',
  },
  {
    id: 'editorError.foreground',
    name: 'Error Squiggle Color',
    description: 'Foreground color of error squiggles in the editor.',
    category: 'editor',
    defaultValue: '#f14c4c',
  },
  {
    id: 'editorWarning.foreground',
    name: 'Warning Squiggle Color',
    description: 'Foreground color of warning squiggles in the editor.',
    category: 'editor',
    defaultValue: '#cca700',
  },
  {
    id: 'editorInfo.foreground',
    name: 'Info Squiggle Color',
    description: 'Foreground color of info squiggles in the editor.',
    category: 'editor',
    defaultValue: '#3794ff',
  },
  {
    id: 'editorInlayHint.background',
    name: 'Inlay Hint Background',
    description: 'Background color of inline parameter hints.',
    category: 'editor',
    defaultValue: '#ffffff1a',
  },
  {
    id: 'editorInlayHint.foreground',
    name: 'Inlay Hint Foreground',
    description: 'Foreground color of inline parameter hints.',
    category: 'editor',
    defaultValue: '#969696',
  },
  {
    id: 'diffEditor.insertedTextBackground',
    name: 'Diff Inserted Text Background',
    description: 'Background color for text that was inserted in diff editor.',
    category: 'editor',
    defaultValue: '#9bb95533',
  },
  {
    id: 'diffEditor.removedTextBackground',
    name: 'Diff Removed Text Background',
    description: 'Background color for text that was removed in diff editor.',
    category: 'editor',
    defaultValue: '#ff000033',
  },

  // ==========================================
  // 4. Tabs and Title Bar
  // ==========================================
  {
    id: 'titleBar.activeBackground',
    name: 'Title Bar Active Background',
    description: 'Title bar background when the window is active.',
    category: 'tabsAndTitle',
    defaultValue: '#3c3c3c',
  },
  {
    id: 'titleBar.activeForeground',
    name: 'Title Bar Active Foreground',
    description: 'Title bar foreground when the window is active.',
    category: 'tabsAndTitle',
    defaultValue: '#cccccc',
  },
  {
    id: 'titleBar.inactiveBackground',
    name: 'Title Bar Inactive Background',
    description: 'Title bar background when the window is inactive.',
    category: 'tabsAndTitle',
    defaultValue: '#3c3c3c99',
  },
  {
    id: 'titleBar.inactiveForeground',
    name: 'Title Bar Inactive Foreground',
    description: 'Title bar foreground when the window is inactive.',
    category: 'tabsAndTitle',
    defaultValue: '#cccccc99',
  },
  {
    id: 'titleBar.border',
    name: 'Title Bar Border',
    description: 'Title bar border color.',
    category: 'tabsAndTitle',
    defaultValue: '#00000000',
  },
  {
    id: 'tab.activeBackground',
    name: 'Active Tab Background',
    description: 'Active tab background color in an active group.',
    category: 'tabsAndTitle',
    defaultValue: '#1e1e1e',
  },
  {
    id: 'tab.activeForeground',
    name: 'Active Tab Foreground',
    description: 'Active tab foreground color in an active group.',
    category: 'tabsAndTitle',
    defaultValue: '#ffffff',
  },
  {
    id: 'tab.activeBorder',
    name: 'Active Tab Bottom Border',
    description: 'Bottom border for the active tab.',
    category: 'tabsAndTitle',
    defaultValue: '#007acc',
  },
  {
    id: 'tab.activeBorderTop',
    name: 'Active Tab Top Border',
    description: 'Top border for the active tab.',
    category: 'tabsAndTitle',
  },
  {
    id: 'tab.inactiveBackground',
    name: 'Inactive Tab Background',
    description: 'Inactive tab background color.',
    category: 'tabsAndTitle',
    defaultValue: '#2d2d2d',
  },
  {
    id: 'tab.inactiveForeground',
    name: 'Inactive Tab Foreground',
    description: 'Inactive tab foreground color.',
    category: 'tabsAndTitle',
    defaultValue: '#ffffff80',
  },
  {
    id: 'tab.hoverBackground',
    name: 'Tab Hover Background',
    description: 'Tab background color when hovering.',
    category: 'tabsAndTitle',
    defaultValue: '#2d2d2db0',
  },
  {
    id: 'tab.border',
    name: 'Tab Separator Border',
    description: 'Border to separate tabs from each other.',
    category: 'tabsAndTitle',
    defaultValue: '#252526',
  },
  {
    id: 'tab.activeModifiedBorder',
    name: 'Active Tab Modified Border',
    description: 'Border on the top of modified (dirty) active tabs.',
    category: 'tabsAndTitle',
    defaultValue: '#3399cc',
  },
  {
    id: 'tab.inactiveModifiedBorder',
    name: 'Inactive Tab Modified Border',
    description: 'Border on the top of modified (dirty) inactive tabs.',
    category: 'tabsAndTitle',
    defaultValue: '#3399cc80',
  },
  {
    id: 'editorGroupHeader.tabsBackground',
    name: 'Tabs Container Background',
    description: 'Background color of the editor group tabs container.',
    category: 'tabsAndTitle',
    defaultValue: '#252526',
  },
  {
    id: 'editorGroup.border',
    name: 'Editor Group Border',
    description: 'Color to separate multiple editor groups from each other.',
    category: 'tabsAndTitle',
    defaultValue: '#444444',
  },

  // ==========================================
  // 5. Status Bar
  // ==========================================
  {
    id: 'statusBar.background',
    name: 'Status Bar Background',
    description: 'Standard Status Bar background color.',
    category: 'statusBar',
    defaultValue: '#007acc',
  },
  {
    id: 'statusBar.foreground',
    name: 'Status Bar Foreground',
    description: 'Status Bar foreground color.',
    category: 'statusBar',
    defaultValue: '#ffffff',
  },
  {
    id: 'statusBar.border',
    name: 'Status Bar Border',
    description: 'Status Bar border color separating the status bar and editor.',
    category: 'statusBar',
    defaultValue: '#00000000',
  },
  {
    id: 'statusBar.debuggingBackground',
    name: 'Status Bar Debugging Background',
    description: 'Status Bar background color when a program is being debugged.',
    category: 'statusBar',
    defaultValue: '#cc6633',
  },
  {
    id: 'statusBar.debuggingForeground',
    name: 'Status Bar Debugging Foreground',
    description: 'Status Bar foreground color when a program is being debugged.',
    category: 'statusBar',
    defaultValue: '#ffffff',
  },
  {
    id: 'statusBar.noFolderBackground',
    name: 'Status Bar No Folder Background',
    description: 'Status Bar background color when no folder or workspace is open.',
    category: 'statusBar',
    defaultValue: '#68217a',
  },
  {
    id: 'statusBar.noFolderForeground',
    name: 'Status Bar No Folder Foreground',
    description: 'Status Bar foreground color when no folder is open.',
    category: 'statusBar',
    defaultValue: '#ffffff',
  },
  {
    id: 'statusBarItem.hoverBackground',
    name: 'Status Bar Item Hover Background',
    description: 'Status Bar item background color when clicking or hovering.',
    category: 'statusBar',
    defaultValue: '#ffffff1f',
  },
  {
    id: 'statusBarItem.remoteBackground',
    name: 'Status Bar Remote Indicator Background',
    description: 'Status Bar item background color for remote host indicator (e.g. WSL, SSH).',
    category: 'statusBar',
    defaultValue: '#16825d',
  },
  {
    id: 'statusBarItem.remoteForeground',
    name: 'Status Bar Remote Indicator Foreground',
    description: 'Status Bar item foreground color for remote host indicator.',
    category: 'statusBar',
    defaultValue: '#ffffff',
  },
  {
    id: 'statusBarItem.errorBackground',
    name: 'Status Bar Error Item Background',
    description: 'Status Bar error item background color.',
    category: 'statusBar',
    defaultValue: '#c72e0f',
  },
  {
    id: 'statusBarItem.warningBackground',
    name: 'Status Bar Warning Item Background',
    description: 'Status Bar warning item background color.',
    category: 'statusBar',
    defaultValue: '#7a6400',
  },

  // ==========================================
  // 6. Panel
  // ==========================================
  {
    id: 'panel.background',
    name: 'Panel Background',
    description: 'Panel background color (Terminal, Output, Problems).',
    category: 'panel',
    defaultValue: '#1e1e1e',
  },
  {
    id: 'panel.border',
    name: 'Panel Border',
    description: 'Panel border color separating the panel and editor.',
    category: 'panel',
    defaultValue: '#80808059',
  },
  {
    id: 'panelTitle.activeForeground',
    name: 'Panel Active Title Foreground',
    description: 'Title color for the active panel tab.',
    category: 'panel',
    defaultValue: '#e7e7e7',
  },
  {
    id: 'panelTitle.activeBorder',
    name: 'Panel Active Title Border',
    description: 'Border color for the active panel title.',
    category: 'panel',
    defaultValue: '#e7e7e7',
  },
  {
    id: 'panelTitle.inactiveForeground',
    name: 'Panel Inactive Title Foreground',
    description: 'Title color for the inactive panel tabs.',
    category: 'panel',
    defaultValue: '#e7e7e799',
  },

  // ==========================================
  // 7. Integrated Terminal
  // ==========================================
  {
    id: 'terminal.background',
    name: 'Terminal Background',
    description: 'Background color of the integrated terminal viewport.',
    category: 'terminal',
    defaultValue: '#1e1e1e',
  },
  {
    id: 'terminal.foreground',
    name: 'Terminal Foreground (Default Text)',
    description: 'Default foreground color in the integrated terminal.',
    category: 'terminal',
    defaultValue: '#cccccc',
  },
  {
    id: 'terminalCursor.foreground',
    name: 'Terminal Cursor Color',
    description: 'The selection background color of the terminal cursor.',
    category: 'terminal',
    defaultValue: '#aeafad',
  },
  {
    id: 'terminal.selectionBackground',
    name: 'Terminal Selection Background',
    description: 'The selection background color of the terminal.',
    category: 'terminal',
    defaultValue: '#264f78',
  },
  {
    id: 'terminal.ansiBlack',
    name: 'ANSI Black',
    description: 'Standard Black ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#000000',
  },
  {
    id: 'terminal.ansiRed',
    name: 'ANSI Red',
    description: 'Standard Red ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#cd3131',
  },
  {
    id: 'terminal.ansiGreen',
    name: 'ANSI Green',
    description: 'Standard Green ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#0dbc79',
  },
  {
    id: 'terminal.ansiYellow',
    name: 'ANSI Yellow',
    description: 'Standard Yellow ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#e5e510',
  },
  {
    id: 'terminal.ansiBlue',
    name: 'ANSI Blue',
    description: 'Standard Blue ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#2472c8',
  },
  {
    id: 'terminal.ansiMagenta',
    name: 'ANSI Magenta',
    description: 'Standard Magenta ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#bc3fbc',
  },
  {
    id: 'terminal.ansiCyan',
    name: 'ANSI Cyan',
    description: 'Standard Cyan ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#11a8cd',
  },
  {
    id: 'terminal.ansiWhite',
    name: 'ANSI White',
    description: 'Standard White ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#e5e5e5',
  },
  {
    id: 'terminal.ansiBrightBlack',
    name: 'ANSI Bright Black (Gray)',
    description: 'Bright Black ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#666666',
  },
  {
    id: 'terminal.ansiBrightRed',
    name: 'ANSI Bright Red',
    description: 'Bright Red ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#f14c4c',
  },
  {
    id: 'terminal.ansiBrightGreen',
    name: 'ANSI Bright Green',
    description: 'Bright Green ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#23d18b',
  },
  {
    id: 'terminal.ansiBrightYellow',
    name: 'ANSI Bright Yellow',
    description: 'Bright Yellow ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#f5f543',
  },
  {
    id: 'terminal.ansiBrightBlue',
    name: 'ANSI Bright Blue',
    description: 'Bright Blue ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#3b8eea',
  },
  {
    id: 'terminal.ansiBrightMagenta',
    name: 'ANSI Bright Magenta',
    description: 'Bright Magenta ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#d670d6',
  },
  {
    id: 'terminal.ansiBrightCyan',
    name: 'ANSI Bright Cyan',
    description: 'Bright Cyan ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#29b8db',
  },
  {
    id: 'terminal.ansiBrightWhite',
    name: 'ANSI Bright White',
    description: 'Bright White ANSI color in terminal.',
    category: 'terminal',
    defaultValue: '#e5e5e5',
  },

  // ==========================================
  // 8. Buttons and Inputs
  // ==========================================
  {
    id: 'button.background',
    name: 'Primary Button Background',
    description: 'Button background color.',
    category: 'buttonsAndInputs',
    defaultValue: '#0e639c',
  },
  {
    id: 'button.foreground',
    name: 'Primary Button Foreground',
    description: 'Button foreground color.',
    category: 'buttonsAndInputs',
    defaultValue: '#ffffff',
  },
  {
    id: 'button.hoverBackground',
    name: 'Button Hover Background',
    description: 'Button background color when hovering.',
    category: 'buttonsAndInputs',
    defaultValue: '#1177bb',
  },
  {
    id: 'button.secondaryBackground',
    name: 'Secondary Button Background',
    description: 'Secondary button background color.',
    category: 'buttonsAndInputs',
    defaultValue: '#3a3d41',
  },
  {
    id: 'button.secondaryForeground',
    name: 'Secondary Button Foreground',
    description: 'Secondary button foreground color.',
    category: 'buttonsAndInputs',
    defaultValue: '#ffffff',
  },
  {
    id: 'button.secondaryHoverBackground',
    name: 'Secondary Button Hover Background',
    description: 'Secondary button background color when hovering.',
    category: 'buttonsAndInputs',
    defaultValue: '#45494e',
  },
  {
    id: 'input.background',
    name: 'Input Field Background',
    description: 'Input box background color.',
    category: 'buttonsAndInputs',
    defaultValue: '#3c3c3c',
  },
  {
    id: 'input.foreground',
    name: 'Input Field Foreground',
    description: 'Input box foreground color.',
    category: 'buttonsAndInputs',
    defaultValue: '#cccccc',
  },
  {
    id: 'input.border',
    name: 'Input Field Border',
    description: 'Input box border color.',
    category: 'buttonsAndInputs',
    defaultValue: '#00000000',
  },
  {
    id: 'input.placeholderForeground',
    name: 'Input Placeholder Foreground',
    description: 'Input box placeholder foreground color.',
    category: 'buttonsAndInputs',
    defaultValue: '#cccccc80',
  },
  {
    id: 'focusBorder',
    name: 'Focus Ring Border',
    description: 'Overall border color for focused elements.',
    category: 'buttonsAndInputs',
    defaultValue: '#007fd4',
  },
  {
    id: 'dropdown.background',
    name: 'Dropdown Background',
    description: 'Dropdown background color.',
    category: 'buttonsAndInputs',
    defaultValue: '#3c3c3c',
  },
  {
    id: 'dropdown.foreground',
    name: 'Dropdown Foreground',
    description: 'Dropdown foreground color.',
    category: 'buttonsAndInputs',
    defaultValue: '#f0f0f0',
  },
  {
    id: 'dropdown.border',
    name: 'Dropdown Border',
    description: 'Dropdown border color.',
    category: 'buttonsAndInputs',
    defaultValue: '#3c3c3c',
  },
  {
    id: 'checkbox.background',
    name: 'Checkbox Background',
    description: 'Checkbox widget background color.',
    category: 'buttonsAndInputs',
    defaultValue: '#3c3c3c',
  },
  {
    id: 'checkbox.foreground',
    name: 'Checkbox Foreground',
    description: 'Checkbox widget foreground color.',
    category: 'buttonsAndInputs',
    defaultValue: '#f0f0f0',
  },
  {
    id: 'checkbox.border',
    name: 'Checkbox Border',
    description: 'Checkbox widget border color.',
    category: 'buttonsAndInputs',
    defaultValue: '#3c3c3c',
  },

  // ==========================================
  // 9. Lists, Trees, and Quick Pick
  // ==========================================
  {
    id: 'list.activeSelectionBackground',
    name: 'List Active Selection Background',
    description: 'List/Tree background color for the selected item when the list is active.',
    category: 'listsAndTrees',
    defaultValue: '#094771',
  },
  {
    id: 'list.activeSelectionForeground',
    name: 'List Active Selection Foreground',
    description: 'List/Tree foreground color for the selected item when the list is active.',
    category: 'listsAndTrees',
    defaultValue: '#ffffff',
  },
  {
    id: 'list.inactiveSelectionBackground',
    name: 'List Inactive Selection Background',
    description: 'List/Tree background color for the selected item when the list is inactive.',
    category: 'listsAndTrees',
    defaultValue: '#37373d',
  },
  {
    id: 'list.hoverBackground',
    name: 'List Hover Background',
    description: 'List/Tree background when hovering over items using the mouse.',
    category: 'listsAndTrees',
    defaultValue: '#2a2d2e',
  },
  {
    id: 'list.focusBackground',
    name: 'List Focus Background',
    description: 'List/Tree background color for the focused item when the list is active.',
    category: 'listsAndTrees',
    defaultValue: '#062f4a',
  },
  {
    id: 'list.highlightForeground',
    name: 'List Match Highlight Color',
    description: 'List/Tree foreground color of the match highlights when searching.',
    category: 'listsAndTrees',
    defaultValue: '#2aaaff',
  },
  {
    id: 'quickInput.background',
    name: 'Quick Pick Background',
    description: 'Quick Input (Command Palette / File Finder) background color.',
    category: 'listsAndTrees',
    defaultValue: '#252526',
  },
  {
    id: 'quickInput.foreground',
    name: 'Quick Pick Foreground',
    description: 'Quick Input foreground color.',
    category: 'listsAndTrees',
    defaultValue: '#cccccc',
  },
  {
    id: 'editorSuggestWidget.background',
    name: 'Autocomplete Widget Background',
    description: 'Background color of the suggestion (intellisense) widget.',
    category: 'listsAndTrees',
    defaultValue: '#252526',
  },
  {
    id: 'editorSuggestWidget.border',
    name: 'Autocomplete Widget Border',
    description: 'Border color of the suggestion widget.',
    category: 'listsAndTrees',
    defaultValue: '#454545',
  },
  {
    id: 'editorSuggestWidget.selectedBackground',
    name: 'Autocomplete Selected Item Background',
    description: 'Color of the selected item in the suggestion widget.',
    category: 'listsAndTrees',
    defaultValue: '#04395e',
  },
  {
    id: 'editorHoverWidget.background',
    name: 'Editor Hover Widget Background',
    description: 'Background color of the editor hover popup.',
    category: 'listsAndTrees',
    defaultValue: '#252526',
  },
  {
    id: 'editorHoverWidget.border',
    name: 'Editor Hover Widget Border',
    description: 'Border color of the editor hover popup.',
    category: 'listsAndTrees',
    defaultValue: '#454545',
  },

  // ==========================================
  // 10. Search, Source Control, and Debug
  // ==========================================
  {
    id: 'searchEditor.findMatchBackground',
    name: 'Search Result Highlight Background',
    description: 'Color of find editor matches highlights.',
    category: 'searchAndDebug',
    defaultValue: '#ea5c0038',
  },
  {
    id: 'gitDecoration.addedResourceForeground',
    name: 'Git Added File Foreground',
    description: 'Color for added Git resources.',
    category: 'searchAndDebug',
    defaultValue: '#81b88b',
  },
  {
    id: 'gitDecoration.modifiedResourceForeground',
    name: 'Git Modified File Foreground',
    description: 'Color for modified Git resources.',
    category: 'searchAndDebug',
    defaultValue: '#e2c08d',
  },
  {
    id: 'gitDecoration.deletedResourceForeground',
    name: 'Git Deleted File Foreground',
    description: 'Color for deleted Git resources.',
    category: 'searchAndDebug',
    defaultValue: '#c74e39',
  },
  {
    id: 'gitDecoration.untrackedResourceForeground',
    name: 'Git Untracked File Foreground',
    description: 'Color for untracked Git resources.',
    category: 'searchAndDebug',
    defaultValue: '#73c991',
  },
  {
    id: 'gitDecoration.ignoredResourceForeground',
    name: 'Git Ignored File Foreground',
    description: 'Color for ignored Git resources.',
    category: 'searchAndDebug',
    defaultValue: '#8c8c8c',
  },
  {
    id: 'debugToolBar.background',
    name: 'Debug Floating Toolbar Background',
    description: 'Debug toolbar background color.',
    category: 'searchAndDebug',
    defaultValue: '#333333',
  },
  {
    id: 'debugIcon.breakpointForeground',
    name: 'Debug Breakpoint Color',
    description: 'Icon color for breakpoints.',
    category: 'searchAndDebug',
    defaultValue: '#e51400',
  },

  // ==========================================
  // 11. Notifications and Popups
  // ==========================================
  {
    id: 'notifications.background',
    name: 'Notification Toast Background',
    description: 'Notification toast background color.',
    category: 'notifications',
    defaultValue: '#252526',
  },
  {
    id: 'notifications.foreground',
    name: 'Notification Toast Foreground',
    description: 'Notification toast foreground color.',
    category: 'notifications',
    defaultValue: '#cccccc',
  },
  {
    id: 'notifications.border',
    name: 'Notification Toast Border',
    description: 'Notification toast border color separating from other notifications.',
    category: 'notifications',
    defaultValue: '#2b2b2c',
  },
  {
    id: 'notificationToast.border',
    name: 'Notification Toast Outer Border',
    description: 'Notification toast outer border color.',
    category: 'notifications',
    defaultValue: '#454545',
  },
  {
    id: 'menu.background',
    name: 'Context Menu Background',
    description: 'Background color of menu items and context menus.',
    category: 'notifications',
    defaultValue: '#303031',
  },
  {
    id: 'menu.foreground',
    name: 'Context Menu Foreground',
    description: 'Foreground color of menu items.',
    category: 'notifications',
    defaultValue: '#cccccc',
  },
  {
    id: 'menu.selectionBackground',
    name: 'Context Menu Item Hover Background',
    description: 'Background color of the selected menu item in menus.',
    category: 'notifications',
    defaultValue: '#094771',
  },
  {
    id: 'menu.separatorBackground',
    name: 'Context Menu Separator Color',
    description: 'Color of a separator menu item in menus.',
    category: 'notifications',
    defaultValue: '#606060',
  },

  // ==========================================
  // 12. Other Workbench Components
  // ==========================================
  {
    id: 'badge.background',
    name: 'Badge Background',
    description: 'Badge background color for search badges and file counts.',
    category: 'other',
    defaultValue: '#4d4d4d',
  },
  {
    id: 'badge.foreground',
    name: 'Badge Foreground',
    description: 'Badge foreground color for search badges and file counts.',
    category: 'other',
    defaultValue: '#ffffff',
  },
  {
    id: 'scrollbarSlider.background',
    name: 'Scrollbar Slider Background',
    description: 'Scrollbar slider background color.',
    category: 'other',
    defaultValue: '#79797966',
  },
  {
    id: 'scrollbarSlider.hoverBackground',
    name: 'Scrollbar Slider Hover Background',
    description: 'Scrollbar slider background color when hovering.',
    category: 'other',
    defaultValue: '#646464b3',
  },
  {
    id: 'scrollbarSlider.activeBackground',
    name: 'Scrollbar Slider Active Background',
    description: 'Scrollbar slider background color when clicked on.',
    category: 'other',
    defaultValue: '#bfbfbf66',
  },
  {
    id: 'progressBar.background',
    name: 'Progress Bar Indicator',
    description: 'Background color of the progress bar shown for long running operations.',
    category: 'other',
    defaultValue: '#0e70c0',
  },
  {
    id: 'breadcrumb.foreground',
    name: 'Breadcrumb Text Color',
    description: 'Color of breadcrumb items.',
    category: 'other',
    defaultValue: '#cccccca6',
  },
  {
    id: 'breadcrumb.background',
    name: 'Breadcrumb Bar Background',
    description: 'Background color of breadcrumb items.',
    category: 'other',
    defaultValue: '#1e1e1e',
  },
];

/**
 * Fast lookup map from color ID to ColorDefinition.
 */
export const COLOR_DEFINITION_MAP = new Map<string, ColorDefinition>(
  OFFICIAL_WORKBENCH_COLORS.map((def) => [def.id, def])
);

/**
 * Returns all ColorDefinitions for a specific category.
 */
export function getColorsByCategory(category: WorkbenchCategory): ColorDefinition[] {
  return OFFICIAL_WORKBENCH_COLORS.filter((def) => def.category === category);
}

