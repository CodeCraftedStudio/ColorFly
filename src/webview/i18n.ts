/**
 * ColorFly: Lightweight Webview i18n
 * Language dictionaries for the studio chrome (tabs, header, settings).
 * Structure: add a new GuiLanguage id + native label, then add its dictionary.
 */

import React, { createContext, useContext } from 'react';

export type GuiLanguage = 'en' | 'bn' | 'hi';
export type GuiLanguageSetting = GuiLanguage | 'auto';

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
