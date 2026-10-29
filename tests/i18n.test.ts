import { describe, it, expect } from 'vitest';
import {
  GUI_LANGUAGES,
  GuiLanguage,
  getDictionary,
  resolveLanguage,
  translate,
} from '../src/webview/i18n';

const LANGUAGES: GuiLanguage[] = ['en', 'bn', 'hi'];

describe('i18n dictionaries', () => {
  it('keeps every language dictionary in key parity with English', () => {
    const enKeys = Object.keys(getDictionary('en')).sort();
    expect(enKeys.length).toBeGreaterThan(50);

    for (const lang of LANGUAGES) {
      const keys = Object.keys(getDictionary(lang)).sort();
      expect(keys, `dictionary for "${lang}" must match English keys`).toEqual(enKeys);
    }
  });

  it('has no empty translations', () => {
    for (const lang of LANGUAGES) {
      for (const [key, value] of Object.entries(getDictionary(lang))) {
        expect(value.trim().length, `${lang}.${key} must not be empty`).toBeGreaterThan(0);
      }
    }
  });

  it('translates known keys per language', () => {
    expect(translate('en', 'tab.settings')).toBe('GUI Settings');
    expect(translate('bn', 'tab.settings')).toBe('GUI সেটিংস');
    expect(translate('hi', 'tab.settings')).toBe('GUI सेटिंग्स');
  });

  it('falls back to English for unknown languages and unknown keys', () => {
    expect(translate('en', 'does.not.exist')).toBe('does.not.exist');
    expect(translate('bn', 'does.not.exist')).toBe('does.not.exist');
  });

  it('substitutes template variables', () => {
    expect(translate('en', 'header.staged', { n: 5 })).toBe('5 Staged');
    expect(translate('bn', 'header.staged', { n: 3 })).toBe('3 স্টেজড');
    expect(translate('en', 'settings.fontLabel', { n: 13 })).toBe('Studio Base Font Size (13px):');
  });

  it('resolves the auto setting through system detection', () => {
    expect(resolveLanguage('bn')).toBe('bn');
    const auto = resolveLanguage('auto');
    expect(LANGUAGES).toContain(auto);
  });

  it('exposes unique language ids with native labels', () => {
    const ids = GUI_LANGUAGES.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const language of GUI_LANGUAGES) {
      expect(language.nativeLabel.trim().length).toBeGreaterThan(0);
    }
  });
});
