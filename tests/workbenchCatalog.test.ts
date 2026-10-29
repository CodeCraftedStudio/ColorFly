import { describe, it, expect } from 'vitest';
import {
  OFFICIAL_WORKBENCH_COLORS,
  WORKBENCH_CATEGORIES,
  COLOR_DEFINITION_MAP,
  getColorsByCategory,
} from '../src/shared/officialWorkbenchColors';
import { STARTER_PRESETS } from '../src/shared/starterPresets';
import { COMMON_TOKEN_CATEGORIES } from '../src/shared/tokenColorCatalog';
import { isValidColor } from '../src/shared/colorUtils';

describe('Official Workbench Color Catalog', () => {
  it('contains at least 80+ documented core VS Code workbench color keys', () => {
    expect(OFFICIAL_WORKBENCH_COLORS.length).toBeGreaterThanOrEqual(80);
  });

  it('verifies all 12 categories are populated', () => {
    WORKBENCH_CATEGORIES.forEach((cat) => {
      const colors = getColorsByCategory(cat.id);
      expect(colors.length).toBeGreaterThan(0);
    });
  });

  it('ensures every color key has a unique ID, non-empty name, and valid description', () => {
    const ids = new Set<string>();
    OFFICIAL_WORKBENCH_COLORS.forEach((def) => {
      expect(ids.has(def.id)).toBe(false);
      ids.add(def.id);
      expect(def.name.trim().length).toBeGreaterThan(0);
      expect(def.description.trim().length).toBeGreaterThan(0);
    });
  });

  it('contains essential components like editor.background and activityBar.background', () => {
    expect(COLOR_DEFINITION_MAP.has('editor.background')).toBe(true);
    expect(COLOR_DEFINITION_MAP.has('activityBar.background')).toBe(true);
    expect(COLOR_DEFINITION_MAP.has('sideBar.background')).toBe(true);
    expect(COLOR_DEFINITION_MAP.has('statusBar.background')).toBe(true);
    expect(COLOR_DEFINITION_MAP.has('terminal.background')).toBe(true);
  });
});

describe('Starter Presets', () => {
  it('provides all 8 original theme presets with valid color configurations', () => {
    expect(STARTER_PRESETS.length).toBe(8);

    const presetNames = STARTER_PRESETS.map((p) => p.name);
    expect(presetNames).toContain('Midnight');
    expect(presetNames).toContain('Deep Ocean');
    expect(presetNames).toContain('Forest Terminal');
    expect(presetNames).toContain('Warm Ember');
    expect(presetNames).toContain('Soft Lavender');
    expect(presetNames).toContain('Monochrome');
    expect(presetNames).toContain('Minimal Light');
    expect(presetNames).toContain('High Contrast');

    STARTER_PRESETS.forEach((preset) => {
      expect(preset.workbenchColors).toBeDefined();
      expect(Object.keys(preset.workbenchColors).length).toBeGreaterThanOrEqual(15);
      Object.entries(preset.workbenchColors).forEach(([colorId, val]) => {
        expect(isValidColor(val)).toBe(true);
      });
    });
  });
});

describe('Token Color Catalog', () => {
  it('covers all major syntax token categories', () => {
    const keys = COMMON_TOKEN_CATEGORIES.map((c) => c.key);
    expect(keys).toContain('comments');
    expect(keys).toContain('strings');
    expect(keys).toContain('numbers');
    expect(keys).toContain('keywords');
    expect(keys).toContain('functions');
    expect(keys).toContain('variables');
    expect(keys).toContain('types');
  });
});

