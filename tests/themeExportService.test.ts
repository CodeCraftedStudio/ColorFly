import { describe, it, expect } from 'vitest';
import { ThemeExportService } from '../src/services/ThemeExportService';
import { STARTER_PRESETS } from '../src/shared/starterPresets';

describe('ThemeExportService', () => {
  const midnightPreset = STARTER_PRESETS[0];

  it('generates valid VS Code color-theme JSON conforming to schema', () => {
    const jsonStr = ThemeExportService.toVSCodeThemeJson(midnightPreset, 'vs-dark');
    expect(jsonStr).toBeDefined();

    const parsed = JSON.parse(jsonStr);
    expect(parsed.$schema).toBe('vscode://schemas/color-theme');
    expect(parsed.name).toBe('Midnight');
    expect(parsed.type).toBe('dark');
    expect(parsed.colors['editor.background']).toBe('#0f0f14');
    expect(Array.isArray(parsed.tokenColors)).toBe(true);
    expect(parsed.tokenColors.length).toBeGreaterThan(0);
  });

  it('scaffolds a full installable VS Code theme extension directory structure', () => {
    const scaffold = ThemeExportService.scaffoldThemeExtension(midnightPreset, 'studio-author');
    expect(scaffold.extensionName).toBe('theme-midnight');

    const fileKeys = Object.keys(scaffold.files);
    expect(fileKeys).toContain('package.json');
    expect(fileKeys).toContain('README.md');
    expect(fileKeys).toContain('.vscodeignore');
    expect(fileKeys).toContain('CHANGELOG.md');
    expect(fileKeys).toContain('LICENSE');
    expect(fileKeys).toContain('themes/midnight-color-theme.json');

    const pkg = JSON.parse(scaffold.files['package.json']);
    expect(pkg.name).toBe('theme-midnight');
    expect(pkg.publisher).toBe('studio-author');
    expect(pkg.contributes.themes[0].label).toBe('Midnight');
    expect(pkg.contributes.themes[0].path).toBe('./themes/midnight-color-theme.json');
  });
});

