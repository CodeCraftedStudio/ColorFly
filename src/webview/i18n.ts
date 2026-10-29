/**
 * ColorFly: Lightweight Webview i18n
 * Language dictionaries for the studio chrome (tabs, header, settings).
 * Structure: add a new GuiLanguage id + native label, then add its dictionary.
 */

import React, { createContext, useContext } from 'react';

export type GuiLanguage = 'en' | 'bn' | 'hi';
export type GuiLanguageSetting = GuiLanguage | 'auto';

/** Per-language text bundle for data-driven catalogs (feature zones, categories). */
export type Localized = Record<GuiLanguage, string>;

export const STORAGE_LANG_KEY = 'colorfly_gui_language';

export const GUI_LANGUAGES: Array<{ id: GuiLanguage; nativeLabel: string }> = [
  { id: 'en', nativeLabel: 'English' },
  { id: 'bn', nativeLabel: 'বাংলা' },
  { id: 'hi', nativeLabel: 'हिन्दी' },
];

const en = {
  // Navigation tabs
  'tab.overview': 'Overview',
  'tab.workbench': 'Workbench Colors',
  'tab.picker': 'Color Studio & Harmonies',
  'tab.syntax': 'Syntax Highlighting',
  'tab.preview': 'Live Preview Engine',
  'tab.profiles': 'Profiles & Presets',
  'tab.accessibility': 'Accessibility & WCAG',
  'tab.advanced': 'Advanced & Raw JSON',
  'tab.clock': 'Clock & Frame',
  'tab.settings': 'GUI Settings',
  'tab.logs': 'System Logs',
  'tab.icons': 'Icons',

  // Icon library
  'icons.heading': 'Icon Library',
  'icons.subheading': 'All icons from the bundled icon pack, sorted by file name.',
  'icons.colName': 'Icon Name',
  'icons.colGroup': 'Group',
  'icons.colAction': 'Action',
  'icons.select': 'Select',
  'icons.selected': 'Selected',
  'icons.applyTitle': 'Apply Icon Theme',
  'icons.applyDesc': 'Set "{icon}" as the workbench icon theme in VS Code.',
  'icons.applyButton': 'Apply',

  // Header bar
  'header.theme': 'Theme:',
  'header.scopeUser': 'User',
  'header.scopeWorkspace': 'Workspace',
  'header.scopeTitle': 'Target scope: User settings or Workspace settings',
  'header.scopeWorkspaceDisabled': 'Open a workspace in VS Code to enable workspace scope',
  'header.scopeWorkspaceHint': 'Workspace level settings',
  'header.staged': '{n} Staged',
  'header.discard': 'Discard',
  'header.discardTitle': 'Discard draft changes',
  'header.synced': 'Synced',
  'header.themeScoped': 'Theme-scoped',
  'header.themeScopedTitle':
    'When checked, customizations apply only to the active theme rather than all themes globally',
  'header.clockTitle': 'Live Clock — Click to open Clock & Frame Studio',
  'header.restore': 'Restore',
  'header.restoreTitle': 'Restore configuration from before ColorFly customizations',
  'header.switchDark': 'Switch to Dark Theme',
  'header.switchLight': 'Switch to Light Theme',
  'header.toggleTheme': 'Toggle Theme',
  'header.openSettings': 'Open Studio GUI Settings',
  'header.settings': 'Settings',
  'header.export': 'Export',
  'header.exportTitle': 'Export theme or profile',
  'header.apply': 'Apply to VS Code',
  'header.applyDisabled': 'No staged changes to apply',
  'header.applyTitle': 'Apply changes immediately to VS Code (Ctrl+S / Cmd+S)',
  'header.discardDialogTitle': 'Discard Draft Changes',
  'header.discardDialogMessage': 'Discard all unapplied draft changes? This cannot be undone.',
  'header.discardDialogConfirm': 'Discard Changes',
  'header.restoreDialogTitle': 'Restore Previous Configuration',
  'header.restoreDialogMessage':
    'Restore configuration to the state before ColorFly customizations were applied?',
  'header.restoreDialogConfirm': 'Restore',

  // GUI settings
  'settings.introTitle': 'ColorFly GUI Preferences & Themes',
  'settings.introDesc':
    'Customize the appearance, theme, layout density, and visual animations of the ColorFly Studio interface.',
  'settings.languageTitle': 'Interface Language',
  'settings.languageSubtitle': 'Studio Language',
  'settings.languageDesc':
    'Language used for navigation tabs, headers, settings, and dialogs inside ColorFly Studio.',
  'settings.languageNote':
    'Extension notifications from VS Code keep following your VS Code display language.',
  'settings.languageAuto': 'Auto (System)',
  'settings.themeTitle': 'Studio GUI Theme',
  'settings.densityTitle': 'Layout Density & Typography',
  'settings.densityLabel': 'Interface Density:',
  'settings.densityCompact': 'Compact',
  'settings.densityComfortable': 'Comfortable',
  'settings.densityRelaxed': 'Relaxed',
  'settings.densityHint': 'Adjusts padding, row heights, and workspace compactness.',
  'settings.fontLabel': 'Studio Base Font Size ({n}px):',
  'settings.fontSmall': 'Small (12px)',
  'settings.fontDefault': 'Default (13px)',
  'settings.fontLarge': 'Large (14px)',
  'settings.fontHint': 'Fine-tunes the base font scaling of all studio controls and tables.',
  'settings.clockTitle': 'Live Clock & Box Frame Widgets',
  'settings.statusClock': 'VS Code Status Bar Clock (Bottom)',
  'settings.statusClockDesc': 'Show live boxed clock in the VS Code status bar with ticking seconds.',
  'settings.headerClock': 'Studio Top Header Clock',
  'settings.headerClockDesc':
    'Display the boxed clock widget in the ColorFly top navigation header bar.',
  'settings.secondsTitle': 'Clock Seconds Precision',
  'settings.secondsDesc': 'Include real-time ticking seconds (:ss) in the clock display.',
  'settings.on': 'On',
  'settings.off': 'Off',
  'settings.showSeconds': 'Show Seconds',
  'settings.hoursMinutesOnly': 'Hours:Minutes Only',
  'settings.animationsTitle': 'Visual Animations & Effects',
  'settings.animationsLabel': 'Enable Smooth UI Animations',
  'settings.animationsDesc':
    'Toggles CSS transitions, live preview transitions, and the Animated Hacker CRT scan line beam.',
  'settings.animationsEnabled': 'Enabled',
  'settings.animationsDisabled': 'Disabled (Reduced Motion)',
  'settings.resetTitle': 'Restore Studio Defaults',
  'settings.resetDesc':
    'Reset GUI theme, layout density, and animations back to original factory defaults.',
  'settings.resetButton': 'Reset Studio Settings',
  'settings.previewElement': 'Preview Element',
  'settings.previewButton': 'Button',

  // Theme cards
  'theme.vscode.name': 'VS Code Native',
  'theme.vscode.badge': 'Auto',
  'theme.vscode.desc':
    'Dynamically adapts to your current VS Code active theme and workbench CSS variables.',
  'theme.dark.name': 'Studio Obsidian Dark',
  'theme.dark.badge': 'Modern Dark',
  'theme.dark.desc':
    'Sleek, deep obsidian glass aesthetic with electric violet accents and high legibility.',
  'theme.light.name': 'Studio Clean Light',
  'theme.light.badge': 'Crisp Light',
  'theme.light.desc':
    'Porcelain white and slate surfaces with refined blue accents and crisp high-contrast typography.',
  'theme.pencil.name': 'Pencil Paper Theme',
  'theme.pencil.badge': 'Draftsman Sketch',
  'theme.pencil.desc':
    'Architectural draft graph paper, 2B graphite pencil typography, hand-drafted borders and sketch aesthetic.',
  'theme.hacker.name': 'Animated Hacker Theme',
  'theme.hacker.badge': 'Matrix Cyberpunk',
  'theme.hacker.desc':
    'Glowing phosphor neon green text, animated CRT scan line sweep, cyber grid lines, and terminal vibes.',

  // Overview dashboard
  'overview.heroDesc':
    'Customize every Visual Studio Code interface element (Editor, Sidebar, Activity Bar, Terminal) perfectly. Use the interactive map below to directly understand which setting changes which VS Code feature.',
  'overview.scopeLabel': 'Scope:',
  'overview.scopeUser': 'User (Global)',
  'overview.scopeWorkspace': 'Workspace',
  'overview.customizeWorkbench': 'Customize Workbench',
  'overview.livePreview': 'Live Preview Engine',
  'overview.activeTheme': 'Active Color Theme',
  'overview.activeThemeDesc': 'Base environment theme applied in VS Code',
  'overview.baseEnvironment': 'Base Environment',
  'overview.themeScoped': 'Theme-Scoped',
  'overview.activeProfile': 'Active Profile',
  'overview.defaultSession': 'Default Session',
  'overview.builtInPreset': 'Built-in starter preset',
  'overview.customProfile': 'Custom user profile',
  'overview.presetBadge': 'Preset',
  'overview.userSavedBadge': 'User Saved',
  'overview.switchProfile': 'Switch Profile →',
  'overview.appliedOverrides': 'Applied Overrides',
  'overview.colorsCustomized': 'colors customized',
  'overview.scopeUserFull': 'User (Global Settings)',
  'overview.draftStatus': 'Draft & Sync Status',
  'overview.stagedChanges': '{n} Staged Changes',
  'overview.synchronized': 'Synchronized',
  'overview.changesPending': 'Changes pending in draft',
  'overview.inSync': 'In sync with VS Code settings',
  'overview.readyToApply': 'Ready to Apply',
  'overview.cleanState': 'Clean state',
  'overview.paletteTitle': 'Active Core Palette Matrix',
  'overview.paletteDesc':
    'The core colors of the current theme, their contrast scores, and which component they affect.',
  'overview.openColorStudio': 'Open Color Studio & Harmonies',
  'overview.copied': 'Copied!',
  'overview.copyHex': 'Copy HEX',
  'overview.presetsTitle': 'Curated Theme Presets & Profiles',
  'overview.presetsDesc':
    'Studio presets to load or apply with one click (with live mini mockups).',
  'overview.viewAllProfiles': 'View All Profiles ({n})',
  'overview.loadDraft': 'Load Draft',
  'overview.applyNow': 'Apply Now',
  'overview.pal.editorBg.label': 'Editor Background',
  'overview.pal.editorBg.pill': 'Code Canvas',
  'overview.pal.editorBg.desc': 'Main coding workspace background',
  'overview.pal.editorFg.label': 'Editor Foreground',
  'overview.pal.editorFg.pill': 'Code Syntax',
  'overview.pal.editorFg.desc': 'Default text and punctuation in code',
  'overview.pal.activityBg.label': 'Activity Bar',
  'overview.pal.activityBg.pill': 'Navigation',
  'overview.pal.activityBg.desc': 'Leftmost tool switcher column',
  'overview.pal.activityIcon.label': 'Activity Icon',
  'overview.pal.activityIcon.pill': 'Icons',
  'overview.pal.activityIcon.desc': 'Active tool indicator icon color',
  'overview.pal.sidebarBg.label': 'Sidebar Background',
  'overview.pal.sidebarBg.pill': 'File Explorer',
  'overview.pal.sidebarBg.desc': 'Files, outline & search container',
  'overview.pal.statusBg.label': 'Status Bar',
  'overview.pal.statusBg.pill': 'Bottom Bar',
  'overview.pal.statusBg.desc': 'Bottom info & git branch bar',
  'overview.pal.buttonBg.label': 'Primary Button',
  'overview.pal.buttonBg.pill': 'UI Buttons',
  'overview.pal.buttonBg.desc': 'Dialogs & primary CTA actions',
  'overview.pal.terminalBg.label': 'Terminal Surface',
  'overview.pal.terminalBg.pill': 'Console',
  'overview.pal.terminalBg.desc': 'Embedded CLI terminal background',

  // Interactive feature map
  'fmap.badge': 'Interactive Feature Blueprint',
  'fmap.subtitle': 'Visual map: which settings change where',
  'fmap.title': 'VS Code Interface Visual Architecture',
  'fmap.hint':
    'Click or hover any section below to see which setting changes which part of VS Code.',
  'fmap.editColors': 'Edit {zone} Colors →',
  'fmap.featureZone': 'Feature Zone: {zone}',
  'fmap.categoryTag': 'Cat: {cat}',
  'fmap.whatChanges': 'What Changes:',
  'fmap.keySettings': 'Key Settings for this Feature:',
  'fmap.openCustomize': 'Open & Customize {zone} Settings',

  // Workbench color catalog
  'wcat.searchPlaceholder':
    'Search by setting name, ID, or feature (e.g., editor, sidebar, left bar, tabs, cursor)...',
  'wcat.filterLabel': 'Filter:',
  'wcat.filterAll': 'All Settings ({n})',
  'wcat.filterCustomized': 'Customized Only',
  'wcat.filterUnmodified': 'Unmodified Only',
  'wcat.allCategories': 'All Categories ({n})',
  'wcat.whatChanges': 'What Changes:',
  'wcat.lighten': 'Lighten +10%',
  'wcat.darken': 'Darken -10%',
  'wcat.invert': 'Invert',
  'wcat.copyJson': 'Copy JSON',
  'wcat.reset': 'Reset',
  'wcat.showing': 'Showing {n} color settings',
  'wcat.showingIn': 'Showing {n} color settings in {cat}',
  'wcat.copyStatus': 'Copied JSON for {n} properties to clipboard.',
  'wcat.noResults': 'No color properties found matching your filter criteria.',
  'wcat.draftBadge': 'Draft (Staged)',
  'wcat.activeOverrideBadge': 'Active Override',
  'wcat.inactiveBadge': 'Inactive',
  'wcat.resetTitle': 'Reset Category Colors',
  'wcat.resetMessage':
    'Reset all customizations in "{cat}"? Applied colors in this category will be reverted to theme defaults and drafts removed.',
  'wcat.resetConfirm': 'Reset Category',

  // Toasts
  'toast.settingsReset': 'Studio settings restored to factory defaults.',
} as const;

export type TranslationKey = keyof typeof en;

const bn: Record<TranslationKey, string> = {
  'tab.overview': 'ওভারভিউ',
  'tab.workbench': 'ওয়ার্কবেঞ্চ কালার',
  'tab.picker': 'কালার স্টুডিও ও হারমনি',
  'tab.syntax': 'সিনট্যাক্স হাইলাইটিং',
  'tab.preview': 'লাইভ প্রিভিউ ইঞ্জিন',
  'tab.profiles': 'প্রোফাইল ও প্রিসেট',
  'tab.accessibility': 'অ্যাক্সেসিবিলিটি ও WCAG',
  'tab.advanced': 'অ্যাডভান্সড ও Raw JSON',
  'tab.clock': 'ঘড়ি ও ফ্রেম',
  'tab.settings': 'GUI সেটিংস',
  'tab.logs': 'সিস্টেম লগ',
  'tab.icons': 'আইকন',

  'icons.heading': 'আইকন লাইব্রেরি',
  'icons.subheading': 'বান্ডিল আইকন প্যাকের সব আইকন, ফাইল নাম অনুযায়ী সাজানো।',
  'icons.colName': 'আইকনের নাম',
  'icons.colGroup': 'গ্রুপ',
  'icons.colAction': 'কর্ম',
  'icons.select': 'বাছাই করুন',
  'icons.selected': 'নির্বাচিত',
  'icons.applyTitle': 'আইকন থিম প্রয়োগ করুন',
  'icons.applyDesc': '"{icon}" কে ওয়ার্কবেঞ্চ আইকন থিম হিসেবে সেট করুন।',
  'icons.applyButton': 'প্রয়োগ করুন',

  'header.theme': 'থিম:',
  'header.scopeUser': 'ইউজার',
  'header.scopeWorkspace': 'ওয়ার্কস্পেস',
  'header.scopeTitle': 'টার্গেট স্কোপ: ইউজার সেটিংস বা ওয়ার্কস্পেস সেটিংস',
  'header.scopeWorkspaceDisabled': 'ওয়ার্কস্পেস স্কোপ চালু করতে VS Code-এ একটি ওয়ার্কস্পেস খুলুন',
  'header.scopeWorkspaceHint': 'ওয়ার্কস্পেস লেভেল সেটিংস',
  'header.staged': '{n} স্টেজড',
  'header.discard': 'বাতিল',
  'header.discardTitle': 'ড্রাফট পরিবর্তন বাতিল করুন',
  'header.synced': 'সিঙ্ক হয়েছে',
  'header.themeScoped': 'থিম-স্কোপড',
  'header.themeScopedTitle': 'চেক করলে কাস্টমাইজেশন শুধু সক্রিয় থিমে প্রয়োগ হবে, সব থিমে নয়',
  'header.clockTitle': 'লাইভ ঘড়ি — ক্লিক করে Clock & Frame স্টুডিও খুলুন',
  'header.restore': 'রিস্টোর',
  'header.restoreTitle': 'ColorFly কাস্টমাইজেশনের আগের কনফিগারেশন রিস্টোর করুন',
  'header.switchDark': 'ডার্ক থিমে যান',
  'header.switchLight': 'লাইট থিমে যান',
  'header.toggleTheme': 'থিম টগল করুন',
  'header.openSettings': 'স্টুডিও GUI সেটিংস খুলুন',
  'header.settings': 'সেটিংস',
  'header.export': 'এক্সপোর্ট',
  'header.exportTitle': 'থিম বা প্রোফাইল এক্সপোর্ট করুন',
  'header.apply': 'VS Code-এ প্রয়োগ করুন',
  'header.applyDisabled': 'প্রয়োগের মতো কোনো স্টেজড পরিবর্তন নেই',
  'header.applyTitle': 'পরিবর্তন সরাসরি VS Code-এ প্রয়োগ করুন (Ctrl+S / Cmd+S)',
  'header.discardDialogTitle': 'ড্রাফট পরিবর্তন বাতিল',
  'header.discardDialogMessage': 'সব অপ্রয়োগিত ড্রাফট পরিবর্তন বাতিল করবেন? এটি ফিরিয়ে আনা যাবে না।',
  'header.discardDialogConfirm': 'পরিবর্তন বাতিল',
  'header.restoreDialogTitle': 'আগের কনফিগারেশন রিস্টোর',
  'header.restoreDialogMessage': 'ColorFly কাস্টমাইজেশন প্রয়োগের আগের অবস্থায় কনফিগারেশন রিস্টোর করবেন?',
  'header.restoreDialogConfirm': 'রিস্টোর',

  'settings.introTitle': 'ColorFly প্রিফারেন্স ও থিম',
  'settings.introDesc':
    'ColorFly স্টুডিও ইন্টারফেসের চেহারা, থিম, লেআউট ডেনসিটি ও অ্যানিমেশন কাস্টমাইজ করুন।',
  'settings.languageTitle': 'ইন্টারফেস ভাষা',
  'settings.languageSubtitle': 'স্টুডিও ভাষা',
  'settings.languageDesc':
    'ColorFly স্টুডিওর নেভিগেশন ট্যাব, হেডার, সেটিংস ও ডায়ালগে ব্যবহৃত ভাষা।',
  'settings.languageNote': 'VS Code-এর এক্সটেনশন নোটিফিকেশন আপনার VS Code ডিসপ্লে ভাষা অনুসরণ করবে।',
  'settings.languageAuto': 'অটো (সিস্টেম)',
  'settings.themeTitle': 'স্টুডিও GUI থিম',
  'settings.densityTitle': 'লেআউট ডেনসিটি ও টাইপোগ্রাফি',
  'settings.densityLabel': 'ইন্টারফেস ডেনসিটি:',
  'settings.densityCompact': 'কমপ্যাক্ট',
  'settings.densityComfortable': 'আরামদায়ক',
  'settings.densityRelaxed': 'রিলাক্সড',
  'settings.densityHint': 'প্যাডিং, রো উচ্চতা ও ওয়ার্কস্পেস কমপ্যাক্টনেস সামঞ্জস্য করে।',
  'settings.fontLabel': 'স্টুডিও বেস ফন্ট সাইজ ({n}px):',
  'settings.fontSmall': 'ছোট (12px)',
  'settings.fontDefault': 'ডিফল্ট (13px)',
  'settings.fontLarge': 'বড় (14px)',
  'settings.fontHint': 'সব স্টুডিও কন্ট্রোল ও টেবিলের ফন্ট স্কেলিং সূক্ষ্মভাবে নিয়ন্ত্রণ করে।',
  'settings.clockTitle': 'লাইভ ঘড়ি ও বক্স ফ্রেম উইজেট',
  'settings.statusClock': 'VS Code স্ট্যাটাস বার ঘড়ি (নিচে)',
  'settings.statusClockDesc': 'সেকেন্ড টিক সহ VS Code স্ট্যাটাস বারে লাইভ বক্স ঘড়ি দেখান।',
  'settings.headerClock': 'স্টুডিও টপ হেডার ঘড়ি',
  'settings.headerClockDesc': 'ColorFly টপ নেভিগেশন হেডারে বক্স ঘড়ি উইজেট দেখান।',
  'settings.secondsTitle': 'ঘড়ির সেকেন্ড নির্ভুলতা',
  'settings.secondsDesc': 'ঘড়ির প্রদর্শনে লাইভ সেকেন্ড (:ss) অন্তর্ভুক্ত করুন।',
  'settings.on': 'চালু',
  'settings.off': 'বন্ধ',
  'settings.showSeconds': 'সেকেন্ড দেখান',
  'settings.hoursMinutesOnly': 'শুধু ঘণ্টা:মিনিট',
  'settings.animationsTitle': 'ভিজ্যুয়াল অ্যানিমেশন ও ইফেক্ট',
  'settings.animationsLabel': 'মসৃণ UI অ্যানিমেশন চালু করুন',
  'settings.animationsDesc':
    'CSS ট্রানজিশন, লাইভ প্রিভিউ ট্রানজিশন ও Animated Hacker CRT স্ক্যানলাইন টগল করে।',
  'settings.animationsEnabled': 'চালু',
  'settings.animationsDisabled': 'বন্ধ (Reduced Motion)',
  'settings.resetTitle': 'স্টুডিও ডিফল্ট ফিরিয়ে আনুন',
  'settings.resetDesc': 'GUI থিম, লেআউট ডেনসিটি ও অ্যানিমেশন ফ্যাক্টরি ডিফল্টে রিসেট করুন।',
  'settings.resetButton': 'স্টুডিও সেটিংস রিসেট',
  'settings.previewElement': 'প্রিভিউ এলিমেন্ট',
  'settings.previewButton': 'বাটন',

  'theme.vscode.name': 'VS Code নেটিভ',
  'theme.vscode.badge': 'অটো',
  'theme.vscode.desc': 'আপনার সক্রিয় VS Code থিম ও workbench CSS ভ্যারিয়েবলে স্বয়ংক্রিয়ভাবে খাপ খায়।',
  'theme.dark.name': 'স্টুডিও অবসিডিয়ান ডার্ক',
  'theme.dark.badge': 'মডার্ন ডার্ক',
  'theme.dark.desc': 'ইলেকট্রিক ভায়োলেট অ্যাকসেন্টসহ গভীর অবসিডিয়ান গ্লাস এস্থেটিক, উন্নত পাঠযোগ্যতা।',
  'theme.light.name': 'স্টুডিও ক্লিন লাইট',
  'theme.light.badge': 'ক্রিস্প লাইট',
  'theme.light.desc': 'পরিষ্কার সাদা ও স্লেট সারফেস, নীল অ্যাকসেন্ট ও হাই-কনট্রাস্ট টাইপোগ্রাফি।',
  'theme.pencil.name': 'পেন্সিল পেপার থিম',
  'theme.pencil.badge': 'ড্রাফটসম্যান স্কেচ',
  'theme.pencil.desc':
    'স্থাপত্য ড্রাফট গ্রাফ পেপার, 2B গ্রাফাইট পেন্সিল টাইপোগ্রাফি ও হাতে আঁকা স্কেচ এস্থেটিক।',
  'theme.hacker.name': 'অ্যানিমেটেড হ্যাকার থিম',
  'theme.hacker.badge': 'ম্যাট্রিক্স সাইবারপাংক',
  'theme.hacker.desc':
    'উজ্জ্বল ফসফর নিয়ন সবুজ টেক্সট, অ্যানিমেটেড CRT স্ক্যানলাইন, সাইবার গ্রিড ও টার্মিনাল ভাইব।',

  // Overview dashboard
  'overview.heroDesc':
    'Visual Studio Code-এর প্রতিটি ইন্টারফেস এলিমেন্ট (Editor, Sidebar, Activity Bar, Terminal) নিখুঁতভাবে কাস্টমাইজ করুন। নিচের ইন্টারঅ্যাক্টিভ ম্যাপ দেখে সরাসরি বুঝুন কোন সেটিংসটি VS Code-এর কোন ফিচার পরিবর্তন করে।',
  'overview.scopeLabel': 'স্কোপ:',
  'overview.scopeUser': 'ইউজার (গ্লোবাল)',
  'overview.scopeWorkspace': 'ওয়ার্কস্পেস',
  'overview.customizeWorkbench': 'ওয়ার্কবেঞ্চ কাস্টমাইজ করুন',
  'overview.livePreview': 'লাইভ প্রিভিউ ইঞ্জিন',
  'overview.activeTheme': 'সক্রিয় কালার থিম',
  'overview.activeThemeDesc': 'VS Code-এ প্রয়োগ করা বেস এনভায়রনমেন্ট থিম',
  'overview.baseEnvironment': 'বেস এনভায়রনমেন্ট',
  'overview.themeScoped': 'থিম-স্কোপড',
  'overview.activeProfile': 'সক্রিয় প্রোফাইল',
  'overview.defaultSession': 'ডিফল্ট সেশন',
  'overview.builtInPreset': 'বিল্ট-ইন স্টার্টার প্রেসেট',
  'overview.customProfile': 'কাস্টম ইউজার প্রোফাইল',
  'overview.presetBadge': 'প্রেসেট',
  'overview.userSavedBadge': 'ইউজার সেভড',
  'overview.switchProfile': 'প্রোফাইল সুইচ করুন →',
  'overview.appliedOverrides': 'প্রয়োগিত ওভাররাইড',
  'overview.colorsCustomized': 'কালার কাস্টমাইজড',
  'overview.scopeUserFull': 'ইউজার (গ্লোবাল সেটিংস)',
  'overview.draftStatus': 'ড্রাফট ও সিঙ্ক স্ট্যাটাস',
  'overview.stagedChanges': '{n} স্টেজড পরিবর্তন',
  'overview.synchronized': 'সিঙ্ক হয়েছে',
  'overview.changesPending': 'ড্রাফটে পরিবর্তন বাকি আছে',
  'overview.inSync': 'VS Code সেটিংসের সাথে সিঙ্কে',
  'overview.readyToApply': 'প্রয়োগের জন্য প্রস্তুত',
  'overview.cleanState': 'পরিষ্কার অবস্থা',
  'overview.paletteTitle': 'সক্রিয় কোর প্যালেট ম্যাট্রিক্স',
  'overview.paletteDesc':
    'বর্তমান থিমের মূল কালারসমূহ, কনট্রাস্ট স্কোর এবং কোন কম্পোনেন্ট প্রভাবিত হচ্ছে তার তালিকা।',
  'overview.openColorStudio': 'কালার স্টুডিও ও হারমনি খুলুন',
  'overview.copied': 'কপি হয়েছে!',
  'overview.copyHex': 'HEX কপি করুন',
  'overview.presetsTitle': 'কিউরেটেড থিম প্রেসেট ও প্রোফাইল',
  'overview.presetsDesc':
    'এক ক্লিকে লোড বা অ্যাপ্লাই করার জন্য স্টুডিও প্রেসেটসমূহ (লাইভ মিনি-মকআপ সহ)।',
  'overview.viewAllProfiles': 'সব প্রোফাইল দেখুন ({n})',
  'overview.loadDraft': 'ড্রাফট লোড',
  'overview.applyNow': 'এখনই প্রয়োগ',
  'overview.pal.editorBg.label': 'এডিটর ব্যাকগ্রাউন্ড',
  'overview.pal.editorBg.pill': 'কোড ক্যানভাস',
  'overview.pal.editorBg.desc': 'প্রধান কোডিং ওয়ার্কস্পেস ব্যাকগ্রাউন্ড',
  'overview.pal.editorFg.label': 'এডিটর ফোরগ্রাউন্ড',
  'overview.pal.editorFg.pill': 'কোড সিনট্যাক্স',
  'overview.pal.editorFg.desc': 'কোডের ডিফল্ট টেক্সট ও পাংচুয়েশন',
  'overview.pal.activityBg.label': 'অ্যাক্টিভিটি বার',
  'overview.pal.activityBg.pill': 'নেভিগেশন',
  'overview.pal.activityBg.desc': 'সবচেয়ে বামের টুল সুইচার কলাম',
  'overview.pal.activityIcon.label': 'অ্যাক্টিভিটি আইকন',
  'overview.pal.activityIcon.pill': 'আইকন',
  'overview.pal.activityIcon.desc': 'সক্রিয় টুল ইনডিকেটর আইকনের রং',
  'overview.pal.sidebarBg.label': 'সাইডবার ব্যাকগ্রাউন্ড',
  'overview.pal.sidebarBg.pill': 'ফাইল এক্সপ্লোরার',
  'overview.pal.sidebarBg.desc': 'ফাইল, আউটলাইন ও সার্চ কনটেইনার',
  'overview.pal.statusBg.label': 'স্ট্যাটাস বার',
  'overview.pal.statusBg.pill': 'বটম বার',
  'overview.pal.statusBg.desc': 'নিচের ইনফো ও গিট ব্রাঞ্চ বার',
  'overview.pal.buttonBg.label': 'প্রাইমারি বাটন',
  'overview.pal.buttonBg.pill': 'UI বাটন',
  'overview.pal.buttonBg.desc': 'ডায়ালগ ও প্রাইমারি CTA অ্যাকশন',
  'overview.pal.terminalBg.label': 'টার্মিনাল সারফেস',
  'overview.pal.terminalBg.pill': 'কনসোল',
  'overview.pal.terminalBg.desc': 'এমবেডেড CLI টার্মিনাল ব্যাকগ্রাউন্ড',

  // Interactive feature map
  'fmap.badge': 'ইন্টারঅ্যাক্টিভ ফিচার ব্লুপ্রিন্ট',
  'fmap.subtitle': 'ভিজ্যুয়াল ম্যাপ: কোন সেটিংস কোথায় পরিবর্তন আনে',
  'fmap.title': 'VS Code ইন্টারফেস ভিজ্যুয়াল আর্কিটেকচার',
  'fmap.hint':
    'নিচের যে কোনো অংশে ক্লিক বা হোভার করে দেখুন কোন সেটিংসটি VS Code-এর কোন অংশকে পরিবর্তন করে।',
  'fmap.editColors': '{zone} কালার এডিট করুন →',
  'fmap.featureZone': 'ফিচার জোন: {zone}',
  'fmap.categoryTag': 'ক্যাট: {cat}',
  'fmap.whatChanges': 'কী পরিবর্তন হবে:',
  'fmap.keySettings': 'এই ফিচারের মূল সেটিংস:',
  'fmap.openCustomize': '{zone} সেটিংস খুলুন ও কাস্টমাইজ করুন',

  // Workbench color catalog
  'wcat.searchPlaceholder':
    'সেটিংসের নাম, ID বা ফিচার দিয়ে খুঁজুন (যেমন: editor, sidebar, left bar, tabs, cursor)...',
  'wcat.filterLabel': 'ফিল্টার:',
  'wcat.filterAll': 'সব সেটিংস ({n})',
  'wcat.filterCustomized': 'শুধু কাস্টমাইজড',
  'wcat.filterUnmodified': 'শুধু অপরিবর্তিত',
  'wcat.allCategories': 'সব ক্যাটাগরি ({n})',
  'wcat.whatChanges': 'কী পরিবর্তন করে:',
  'wcat.lighten': 'হালকা করুন +10%',
  'wcat.darken': 'গাঢ় করুন -10%',
  'wcat.invert': 'উল্টান',
  'wcat.copyJson': 'JSON কপি',
  'wcat.reset': 'রিসেট',
  'wcat.showing': '{n} টি কালার সেটিংস দেখানো হচ্ছে',
  'wcat.showingIn': '{cat}-এ {n} টি কালার সেটিংস দেখানো হচ্ছে',
  'wcat.copyStatus': '{n} টি প্রপার্টির JSON ক্লিপবোর্ডে কপি হয়েছে।',
  'wcat.noResults': 'আপনার ফিল্টার অনুযায়ী কোনো কালার সেটিংস পাওয়া যায়নি।',
  'wcat.draftBadge': 'ড্রাফট (স্টেজড)',
  'wcat.activeOverrideBadge': 'সক্রিয় ওভাররাইড',
  'wcat.inactiveBadge': 'নিষ্ক্রিয়',
  'wcat.resetTitle': 'ক্যাটাগরি কালার রিসেট',
  'wcat.resetMessage':
    '"{cat}"-এর সব কাস্টমাইজেশন রিসেট করবেন? এই ক্যাটাগরির প্রয়োগিত কালার থিম ডিফল্টে ফিরে যাবে এবং ড্রাফট মুছে যাবে।',
  'wcat.resetConfirm': 'ক্যাটাগরি রিসেট',

  'toast.settingsReset': 'স্টুডিও সেটিংস ফ্যাক্টরি ডিফল্টে ফিরিয়ে আনা হয়েছে।',
};

const hi: Record<TranslationKey, string> = {
  'tab.overview': 'ओवरव्यू',
  'tab.workbench': 'वर्कबेंच रंग',
  'tab.picker': 'कलर स्टूडियो और हार्मनी',
  'tab.syntax': 'सिंटैक्स हाइलाइटिंग',
  'tab.preview': 'लाइव प्रीव्यू इंजन',
  'tab.profiles': 'प्रोफ़ाइल और प्रीसेट',
  'tab.accessibility': 'एक्सेसिबिलिटी और WCAG',
  'tab.advanced': 'एडवांस्ड और Raw JSON',
  'tab.clock': 'घड़ी और फ़्रेम',
  'tab.settings': 'GUI सेटिंग्स',
  'tab.logs': 'सिस्टम लॉग',
  'tab.icons': 'आइकन',

  'icons.heading': 'आइकन लाइब्रेरी',
  'icons.subheading': 'बंडल आइकन पैक के सभी आइकन, फ़ाइल नाम से क्रमबद्ध।',
  'icons.colName': 'आइकन नाम',
  'icons.colGroup': 'समूह',
  'icons.colAction': 'क्रिया',
  'icons.select': 'चुनें',
  'icons.selected': 'चयनित',
  'icons.applyTitle': 'आइकन थीम लागू करें',
  'icons.applyDesc': '"{icon}" को वर्कबेंच आइकन थीम के रूप में सेट करें।',
  'icons.applyButton': 'लागू करें',

  'header.theme': 'थीम:',
  'header.scopeUser': 'यूज़र',
  'header.scopeWorkspace': 'वर्कस्पेस',
  'header.scopeTitle': 'लक्ष्य स्कोप: यूज़र सेटिंग्स या वर्कस्पेस सेटिंग्स',
  'header.scopeWorkspaceDisabled': 'वर्कस्पेस स्कोप सक्षम करने के लिए VS Code में वर्कस्पेस खोलें',
  'header.scopeWorkspaceHint': 'वर्कस्पेस-स्तर की सेटिंग्स',
  'header.staged': '{n} स्टेज्ड',
  'header.discard': 'रद्द करें',
  'header.discardTitle': 'ड्राफ़्ट परिवर्तन रद्द करें',
  'header.synced': 'सिंक हुआ',
  'header.themeScoped': 'थीम-स्कोप्ड',
  'header.themeScopedTitle':
    'चेक होने पर कस्टमाइज़ेशन केवल सक्रिय थीम पर लागू होंगे, सभी थीम पर नहीं',
  'header.clockTitle': 'लाइव घड़ी — Clock & Frame स्टूडियो खोलने के लिए क्लिक करें',
  'header.restore': 'रीस्टोर करें',
  'header.restoreTitle': 'ColorFly कस्टमाइज़ेशन से पहले की कॉन्फ़िगरेशन रीस्टोर करें',
  'header.switchDark': 'डार्क थीम पर जाएँ',
  'header.switchLight': 'लाइट थीम पर जाएँ',
  'header.toggleTheme': 'थीम टॉगल करें',
  'header.openSettings': 'स्टूडिओ GUI सेटिंग्स खोलें',
  'header.settings': 'सेटिंग्स',
  'header.export': 'एक्सपोर्ट',
  'header.exportTitle': 'थीम या प्रोफ़ाइल एक्सपोर्ट करें',
  'header.apply': 'VS Code पर लागू करें',
  'header.applyDisabled': 'लागू करने के लिए कोई स्टेज्ड परिवर्तन नहीं',
  'header.applyTitle': 'परिवर्तन तुरंत VS Code पर लागू करें (Ctrl+S / Cmd+S)',
  'header.discardDialogTitle': 'ड्राफ़्ट परिवर्तन रद्द करें',
  'header.discardDialogMessage': 'सभी अप्रयुक्त ड्राफ़्ट परिवर्तन रद्द करें? इसे पूर्ववत नहीं किया जा सकता।',
  'header.discardDialogConfirm': 'परिवर्तन रद्द करें',
  'header.restoreDialogTitle': 'पिछली कॉन्फ़िगरेशन रीस्टोर करें',
  'header.restoreDialogMessage':
    'ColorFly कस्टमाइज़ेशन लागू होने से पहले की अवस्था में कॉन्फ़िगरेशन रीस्टोर करें?',
  'header.restoreDialogConfirm': 'रीस्टोर करें',

  'settings.introTitle': 'ColorFly प्राथमिकताएँ और थीम',
  'settings.introDesc':
    'ColorFly स्टूडियो इंटरफ़ेस की उपस्थिति, थीम, लेआउट घनत्व और एनिमेशन को अनुकूलित करें।',
  'settings.languageTitle': 'इंटरफ़ेस भाषा',
  'settings.languageSubtitle': 'स्टूडिओ भाषा',
  'settings.languageDesc':
    'ColorFly स्टूडियो के नेविगेशन टैब, हेडर, सेटिंग्स और डायलॉग में उपयोग की जाने वाली भाषा।',
  'settings.languageNote':
    'VS Code की एक्सटेंशन सूचनाएँ आपकी VS Code डिस्प्ले भाषा का पालन करती रहेंगी।',
  'settings.languageAuto': 'स्वतः (सिस्टम)',
  'settings.themeTitle': 'स्टूडिओ GUI थीम',
  'settings.densityTitle': 'लेआउट घनत्व और टाइपोग्राफ़ी',
  'settings.densityLabel': 'इंटरफ़ेस घनत्व:',
  'settings.densityCompact': 'कॉम्पैक्ट',
  'settings.densityComfortable': 'सुविधाजनक',
  'settings.densityRelaxed': 'शिथिल',
  'settings.densityHint': 'पैडिंग, पंक्ति की ऊँचाई और वर्कस्पेस की घनत्व को समायोजित करता है।',
  'settings.fontLabel': 'स्टूडिओ बेस फ़ॉन्ट आकार ({n}px):',
  'settings.fontSmall': 'छोटा (12px)',
  'settings.fontDefault': 'डिफ़ॉल्ट (13px)',
  'settings.fontLarge': 'बड़ा (14px)',
  'settings.fontHint': 'सभी स्टूडियो नियंत्रणों और तालिकाओं के फ़ॉन्ट स्केलिंग को बारीकी से नियंत्रित करता है।',
  'settings.clockTitle': 'लाइव घड़ी और बॉक्स फ़्रेम विजेट',
  'settings.statusClock': 'VS Code स्टेटस बार घड़ी (नीचे)',
  'settings.statusClockDesc': 'सेकंड टिक के साथ VS Code स्टेटस बार में लाइव बॉक्स घड़ी दिखाएँ।',
  'settings.headerClock': 'स्टूडिओ शीर्ष हेडर घड़ी',
  'settings.headerClockDesc': 'ColorFly शीर्ष नेविगेशन हेडर में बॉक्स घड़ी विजेट दिखाएँ।',
  'settings.secondsTitle': 'घड़ी की सेकंड सटीकता',
  'settings.secondsDesc': 'घड़ी प्रदर्शन में रीयल-टाइम सेकंड (:ss) शामिल करें।',
  'settings.on': 'चालू',
  'settings.off': 'बंद',
  'settings.showSeconds': 'सेकंड दिखाएँ',
  'settings.hoursMinutesOnly': 'केवल घंटा:मिनट',
  'settings.animationsTitle': 'दृश्य एनिमेशन और प्रभाव',
  'settings.animationsLabel': 'स्मूथ UI एनिमेशन सक्षम करें',
  'settings.animationsDesc':
    'CSS ट्रांज़िशन, लाइव प्रीव्यू ट्रांज़िशन और Animated Hacker CRT स्कैनलाइन को टॉगल करता है।',
  'settings.animationsEnabled': 'चालू',
  'settings.animationsDisabled': 'बंद (Reduced Motion)',
  'settings.resetTitle': 'स्टूडिओ डिफ़ॉल्ट बहाल करें',
  'settings.resetDesc':
    'GUI थीम, लेआउट घनत्व और एनिमेशन को फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करें।',
  'settings.resetButton': 'स्टूडिओ सेटिंग्स रीसेट करें',
  'settings.previewElement': 'प्रीव्यू एलिमेंट',
  'settings.previewButton': 'बटन',

  'theme.vscode.name': 'VS Code नेटिव',
  'theme.vscode.badge': 'स्वतः',
  'theme.vscode.desc':
    'आपकी सक्रिय VS Code थीम और workbench CSS वेरिएबल के अनुसार स्वयः अनुकूलित होता है।',
  'theme.dark.name': 'स्टूडिओ ऑब्सिडियन डार्क',
  'theme.dark.badge': 'आधुनिक डार्क',
  'theme.dark.desc':
    'इलेक्ट्रिक वायलेट एक्सेंट के साथ गहरा ऑब्सिडियन ग्लास रूप, बेहतर पठनीयता।',
  'theme.light.name': 'स्टूडिओ क्लीन लाइट',
  'theme.light.badge': 'तेज़ लाइट',
  'theme.light.desc':
    'स्वच्छ सफ़ेद और स्लेट सतह, नीले एक्सेंट और उच्च कंट्रास्ट टाइपोग्राफ़ी।',
  'theme.pencil.name': 'पेंसिल पेपर थीम',
  'theme.pencil.badge': 'ड्राफ्ट्समैन स्केच',
  'theme.pencil.desc':
    'वास्तुकला ड्राफ्ट ग्राफ़ पेपर, 2B ग्रेफ़ाइट पेंसिल टाइपोग्राफ़ी और हाथ से बना स्केच रूप।',
  'theme.hacker.name': 'एनिमेटेड हैकर थीम',
  'theme.hacker.badge': 'मैट्रिक्स साइबरपंक',
  'theme.hacker.desc':
    'चमकदार फॉस्फर नियोन हरा टेक्स्ट, एनिमेटेड CRT स्कैनलाइन, साइबर ग्रिड और टर्मिनल अनुभव।',

  // Overview dashboard
  'overview.heroDesc':
    'Visual Studio Code के प्रत्येक इंटरफ़ेस एलिमेंट (एडिटर, साइडबार, एक्टिविटी बार, टर्मिनल) को बेहतरीन तरीके से अनुकूलित करें। नीचे दिए इंटरैक्टिव मैप से सीधे समझें कि कौन-सी सेटिंग VS Code के किस फ़ीचर को बदलती है।',
  'overview.scopeLabel': 'स्कोप:',
  'overview.scopeUser': 'यूज़र (ग्लोबल)',
  'overview.scopeWorkspace': 'वर्कस्पेस',
  'overview.customizeWorkbench': 'वर्कबेंच अनुकूलित करें',
  'overview.livePreview': 'लाइव प्रीव्यू इंजन',
  'overview.activeTheme': 'सक्रिय कलर थीम',
  'overview.activeThemeDesc': 'VS Code में लागू बेस एनवायरनमेंट थीम',
  'overview.baseEnvironment': 'बेस एनवायरनमेंट',
  'overview.themeScoped': 'थीम-स्कोप्ड',
  'overview.activeProfile': 'सक्रिय प्रोफ़ाइल',
  'overview.defaultSession': 'डिफ़ॉल्ट सत्र',
  'overview.builtInPreset': 'बिल्ट-इन स्टार्टर प्रीसेट',
  'overview.customProfile': 'कस्टम यूज़र प्रोफ़ाइल',
  'overview.presetBadge': 'प्रीसेट',
  'overview.userSavedBadge': 'यूज़र सेव्ड',
  'overview.switchProfile': 'प्रोफ़ाइल बदलें →',
  'overview.appliedOverrides': 'लागू ओवरराइड',
  'overview.colorsCustomized': 'कलर अनुकूलित',
  'overview.scopeUserFull': 'यूज़र (ग्लोबल सेटिंग्स)',
  'overview.draftStatus': 'ड्राफ्ट और सिंक स्थिति',
  'overview.stagedChanges': '{n} स्टेज्ड बदलाव',
  'overview.synchronized': 'सिंक हो गया',
  'overview.changesPending': 'ड्राफ्ट में बदलाव लंबित',
  'overview.inSync': 'VS Code सेटिंग्स के साथ सिंक में',
  'overview.readyToApply': 'लागू करने के लिए तैयार',
  'overview.cleanState': 'साफ़ स्थिति',
  'overview.paletteTitle': 'सक्रिय कोर पैलेट मैट्रिक्स',
  'overview.paletteDesc':
    'वर्तमान थीम के मुख्य रंग, उनके कंट्रास्ट स्कोर और कौन-सा कंपोनेंट प्रभावित हो रहा है, उसकी सूची।',
  'overview.openColorStudio': 'कलर स्टूडियो और हार्मनी खोलें',
  'overview.copied': 'कॉपी हो गया!',
  'overview.copyHex': 'HEX कॉपी करें',
  'overview.presetsTitle': 'क्यूरेटेड थीम प्रीसेट और प्रोफ़ाइल',
  'overview.presetsDesc':
    'एक क्लिक में लोड या लागू करने के लिए स्टूडियो प्रीसेट (लाइव मिनी मॉकअप के साथ)।',
  'overview.viewAllProfiles': 'सभी प्रोफ़ाइल देखें ({n})',
  'overview.loadDraft': 'ड्राफ्ट लोड करें',
  'overview.applyNow': 'अभी लागू करें',
  'overview.pal.editorBg.label': 'एडिटर पृष्ठभूमि',
  'overview.pal.editorBg.pill': 'कोड कैनवास',
  'overview.pal.editorBg.desc': 'मुख्य कोडिंग वर्कस्पेस पृष्ठभूमि',
  'overview.pal.editorFg.label': 'एडिटर अग्रभूमि',
  'overview.pal.editorFg.pill': 'कोड सिंटैक्स',
  'overview.pal.editorFg.desc': 'कोड में डिफ़ॉल्ट टेक्स्ट और विराम चिह्न',
  'overview.pal.activityBg.label': 'एक्टिविटी बार',
  'overview.pal.activityBg.pill': 'नेविगेशन',
  'overview.pal.activityBg.desc': 'सबसे बाएँ टूलस्विचर कॉलम',
  'overview.pal.activityIcon.label': 'एक्टिविटी आइकन',
  'overview.pal.activityIcon.pill': 'आइकन',
  'overview.pal.activityIcon.desc': 'सक्रिय टूल सूचक आइकन रंग',
  'overview.pal.sidebarBg.label': 'साइडबार पृष्ठभूमि',
  'overview.pal.sidebarBg.pill': 'फ़ाइल एक्सप्लोरर',
  'overview.pal.sidebarBg.desc': 'फ़ाइल, आउटलाइन और खोज कंटेनर',
  'overview.pal.statusBg.label': 'स्टेटस बार',
  'overview.pal.statusBg.pill': 'बॉटम बार',
  'overview.pal.statusBg.desc': 'नीचे की जानकारी और गिट ब्रांच बार',
  'overview.pal.buttonBg.label': 'प्राइमरी बटन',
  'overview.pal.buttonBg.pill': 'UI बटन',
  'overview.pal.buttonBg.desc': 'डायलॉग और प्राइमरी CTA एक्शन',
  'overview.pal.terminalBg.label': 'टर्मिनल सतह',
  'overview.pal.terminalBg.pill': 'कंसोल',
  'overview.pal.terminalBg.desc': 'एम्बेडेड CLI टर्मिनल पृष्ठभूमि',

  // Interactive feature map
  'fmap.badge': 'इंटरैक्टिव फ़ीचर ब्लूप्रिंट',
  'fmap.subtitle': 'विज़ुअल मैप: कौन-सी सेटिंग कहाँ बदलाव लाती है',
  'fmap.title': 'VS Code इंटरफ़ेस विज़ुअल आर्किटेक्चर',
  'fmap.hint':
    'नीचे किसी भी हिस्से पर क्लिक या होवर करके देखें कि कौन-सी सेटिंग VS Code के किस हिस्से को बदलती है।',
  'fmap.editColors': '{zone} रंग संपादित करें →',
  'fmap.featureZone': 'फ़ीचर ज़ोन: {zone}',
  'fmap.categoryTag': 'श्रेणी: {cat}',
  'fmap.whatChanges': 'क्या बदलेगा:',
  'fmap.keySettings': 'इस फ़ीचर की मुख्य सेटिंग्स:',
  'fmap.openCustomize': '{zone} सेटिंग्स खोलें और अनुकूलित करें',

  // Workbench color catalog
  'wcat.searchPlaceholder':
    'सेटिंग नाम, ID या फ़ीचर से खोजें (जैसे: editor, sidebar, left bar, tabs, cursor)...',
  'wcat.filterLabel': 'फ़िल्टर:',
  'wcat.filterAll': 'सभी सेटिंग्स ({n})',
  'wcat.filterCustomized': 'केवल अनुकूलित',
  'wcat.filterUnmodified': 'केवल अपरिवर्तित',
  'wcat.allCategories': 'सभी श्रेणियाँ ({n})',
  'wcat.whatChanges': 'क्या बदलता है:',
  'wcat.lighten': 'हल्का करें +10%',
  'wcat.darken': 'गहरा करें -10%',
  'wcat.invert': 'उलटें',
  'wcat.copyJson': 'JSON कॉपी करें',
  'wcat.reset': 'रीसेट करें',
  'wcat.showing': '{n} कलर सेटिंग्स दिखाई जा रही हैं',
  'wcat.showingIn': '{cat} में {n} कलर सेटिंग्स दिखाई जा रही हैं',
  'wcat.copyStatus': '{n} प्रॉपर्टीज़ का JSON क्लिपबोर्ड पर कॉपी हो गया।',
  'wcat.noResults': 'आपके फ़िल्टर से मेल खाती कोई कलर सेटिंग नहीं मिली।',
  'wcat.draftBadge': 'ड्राफ्ट (स्टेज्ड)',
  'wcat.activeOverrideBadge': 'सक्रिय ओवरराइड',
  'wcat.inactiveBadge': 'निष्क्रिय',
  'wcat.resetTitle': 'श्रेणी के रंग रीसेट करें',
  'wcat.resetMessage':
    '"{cat}" के सभी अनुकूलन रीसेट करें? इस श्रेणी में लागू रंग थीम डिफ़ॉल्ट पर लौट जाएँगे और ड्राफ्ट हटा दिए जाएँगे।',
  'wcat.resetConfirm': 'श्रेणी रीसेट करें',

  'toast.settingsReset': 'स्टूडिओ सेटिंग्स फ़ैक्टरी डिफ़ॉल्ट पर बहाल कर दी गईं।',
};

const DICTIONARIES: Record<GuiLanguage, Record<string, string>> = { en, bn, hi };

export function getDictionary(lang: GuiLanguage): Record<string, string> {
  return DICTIONARIES[lang];
}

export function translate(
  lang: GuiLanguage,
  key: string,
  vars?: Record<string, string | number>
): string {
  const table = DICTIONARIES[lang] || DICTIONARIES.en;
  let text = table[key] ?? DICTIONARIES.en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}

export function detectLanguage(): GuiLanguage {
  const candidates: string[] =
    typeof navigator !== 'undefined'
      ? [navigator.language || '', ...(navigator.languages || [])]
      : [];
  for (const candidate of candidates) {
    const lower = candidate.toLowerCase();
    if (lower.startsWith('bn')) return 'bn';
    if (lower.startsWith('hi')) return 'hi';
  }
  return 'en';
}

export function resolveLanguage(setting: GuiLanguageSetting): GuiLanguage {
  return setting === 'auto' ? detectLanguage() : setting;
}

export interface LanguageContextValue {
  lang: GuiLanguage;
  setting: GuiLanguageSetting;
  setSetting: (setting: GuiLanguageSetting) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const defaultLanguageContext: LanguageContextValue = {
  lang: 'en',
  setting: 'en',
  setSetting: () => undefined,
  t: (key, vars) => translate('en', key, vars),
};

export const LanguageContext = createContext<LanguageContextValue>(defaultLanguageContext);

export const useLanguage = (): LanguageContextValue => useContext(LanguageContext);
