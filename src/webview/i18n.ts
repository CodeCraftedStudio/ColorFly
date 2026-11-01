/**
 * ColorFly: Lightweight Webview i18n
 * Main entry point: imports per-language dictionaries from separate files
 * (en.ts, bn.ts, hi.ts) and provides translation context + utilities.
 *
 * Each language now lives in its own file for easy maintenance:
 *   - src/webview/en.ts   (English)
 *   - src/webview/bn.ts   (Bangla / বাংলা)
 *   - src/webview/hi.ts   (Hindi / हिन्दী)
 */

import React, { createContext, useContext } from 'react';
import { en, TranslationKey } from './en';
import { bn } from './bn';
import { hi } from './hi';

// Re-export per-language dictionaries so individual files can be imported directly
export { en, bn, hi };
export type { TranslationKey };

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

const DICTIONARIES: Record<GuiLanguage, Record<TranslationKey, string>> = { en, bn, hi };

export function getDictionary(lang: GuiLanguage): Record<TranslationKey, string> {
  return DICTIONARIES[lang];
}

export function translate(
  lang: GuiLanguage,
  key: string,
  vars?: Record<string, string | number>
): string {
  const table = DICTIONARIES[lang] || DICTIONARIES.en;
  let text = table[key as TranslationKey] ?? DICTIONARIES.en[key as TranslationKey] ?? key;
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
