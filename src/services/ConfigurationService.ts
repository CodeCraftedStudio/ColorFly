/**
 * ColorFly: Configuration Management Service
 * Safely reads, merges, scopes, and applies VS Code theme color customizations
 * to workbench.colorCustomizations, editor.tokenColorCustomizations, and semantic tokens.
 */

import { ColorScope, ConfigSnapshot, TextMateTokenRule } from '../shared/types';

export interface IConfigAccessor {
  get<T>(section: string, defaultValue?: T): T;
  update(section: string, value: any, target: ColorScope): Promise<void>;
  inspect<T>(section: string): {
    key: string;
    defaultValue?: T;
    globalValue?: T;
    workspaceValue?: T;
  } | undefined;
}

export class ConfigurationService {
  private configAccessor: IConfigAccessor;

  constructor(configAccessor: IConfigAccessor) {
    this.configAccessor = configAccessor;
  }

  /**
   * Reads raw color customizations for the specified scope.
   */
  public getColorCustomizations(scope: ColorScope): Record<string, any> {
    const inspected = this.configAccessor.inspect<Record<string, any>>('workbench.colorCustomizations');
    if (!inspected) return {};
    const val = scope === 'workspace' ? inspected.workspaceValue : inspected.globalValue;
    return val ? JSON.parse(JSON.stringify(val)) : {};
  }

  /**
   * Reads raw token color customizations for the specified scope.
   */
  public getTokenColorCustomizations(scope: ColorScope): Record<string, any> {
    const inspected = this.configAccessor.inspect<Record<string, any>>('editor.tokenColorCustomizations');
    if (!inspected) return {};
    const val = scope === 'workspace' ? inspected.workspaceValue : inspected.globalValue;
    return val ? JSON.parse(JSON.stringify(val)) : {};
  }

  /**
   * Reads raw semantic token color customizations for the specified scope.
   */
  public getSemanticTokenColorCustomizations(scope: ColorScope): Record<string, any> {
    const inspected = this.configAccessor.inspect<Record<string, any>>('editor.semanticTokenColorCustomizations');
    if (!inspected) return {};
    const val = scope === 'workspace' ? inspected.workspaceValue : inspected.globalValue;
    return val ? JSON.parse(JSON.stringify(val)) : {};
  }

  /**
   * Captures a complete snapshot of current configuration for safe recovery.
   */
  public createSnapshot(reason: string, scope: ColorScope, baseTheme: string): ConfigSnapshot {
    return {
      id: `snapshot-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reason,
      scope,
      baseTheme,
      colorCustomizations: this.getColorCustomizations(scope),
      tokenColorCustomizations: this.getTokenColorCustomizations(scope),
      semanticTokenColorCustomizations: this.getSemanticTokenColorCustomizations(scope),
    };
  }

  /**
   * Resolves effective workbench colors for the active theme, merging global overrides
   * with theme-scoped bracket entries (e.g. `"[Default Dark+]"`).
   */
  public getEffectiveWorkbenchColors(themeName: string, scope: ColorScope): Record<string, string> {
    const raw = this.getColorCustomizations(scope);
    const result: Record<string, string> = {};

    // 1. Base level global customizations
    for (const [key, val] of Object.entries(raw)) {
      if (!key.startsWith('[') && typeof val === 'string') {
        result[key] = val;
      }
    }

    // 2. Theme-specific scoped customizations (takes precedence for this theme)
    const themeKey = `[${themeName}]`;
    if (raw[themeKey] && typeof raw[themeKey] === 'object') {
      for (const [key, val] of Object.entries(raw[themeKey])) {
        if (typeof val === 'string') {
          result[key] = val;
        }
      }
    }

    return result;
  }

  /**
   * Merges and applies workbench colors.
   * If `themeScoped` is true, changes are saved inside `[Theme Name]: { ... }`.
   * Preserves all unrelated existing keys and other bracketed themes!
   */
  public async applyWorkbenchColors(
    newColors: Record<string, string>,
    themeName: string,
    scope: ColorScope,
    themeScoped: boolean = true
  ): Promise<void> {
    const current = this.getColorCustomizations(scope);
    const updated = { ...current };

    if (themeScoped) {
      const themeKey = `[${themeName}]`;
      const currentThemeObj = typeof updated[themeKey] === 'object' && updated[themeKey] !== null
        ? { ...updated[themeKey] }
        : {};

      for (const [key, val] of Object.entries(newColors)) {
        if (val) {
          currentThemeObj[key] = val;
        } else {
          delete currentThemeObj[key];
        }
      }

      if (Object.keys(currentThemeObj).length > 0) {
        updated[themeKey] = currentThemeObj;
      } else {
        delete updated[themeKey];
      }
    } else {
      // Global workbench colors across all themes
      for (const [key, val] of Object.entries(newColors)) {
        if (val) {
          updated[key] = val;
        } else {
          delete updated[key];
        }
      }
    }

    await this.configAccessor.update('workbench.colorCustomizations', updated, scope);
  }

  /**
   * Merges and applies token color customizations (standard categories & TextMate rules).
   */
  public async applyTokenColors(
    categories: Record<string, string>,
    textMateRules: TextMateTokenRule[] | undefined,
    themeName: string,
    scope: ColorScope,
    themeScoped: boolean = true
  ): Promise<void> {
    const current = this.getTokenColorCustomizations(scope);
    const updated = { ...current };

    const targetObj = themeScoped
      ? (typeof updated[`[${themeName}]`] === 'object' ? { ...updated[`[${themeName}]`] } : {})
      : updated;

    // Apply standard categories (comments, strings, keywords, numbers, etc.)
    for (const [key, val] of Object.entries(categories)) {
      if (val) {
        targetObj[key] = val;
      } else {
        delete targetObj[key];
      }
    }

    // Apply TextMate rules
    if (textMateRules !== undefined) {
      if (textMateRules.length > 0) {
        targetObj.textMateRules = textMateRules;
      } else {
        delete targetObj.textMateRules;
      }
    }

    if (themeScoped) {
      const themeKey = `[${themeName}]`;
      if (Object.keys(targetObj).length > 0) {
        updated[themeKey] = targetObj;
      } else {
        delete updated[themeKey];
      }
    }

    await this.configAccessor.update('editor.tokenColorCustomizations', updated, scope);
  }

  /**
   * Applies semantic token color customizations.
   */
  public async applySemanticTokens(
    tokens: Record<string, any>,
    themeName: string,
    scope: ColorScope,
    themeScoped: boolean = true
  ): Promise<void> {
    const current = this.getSemanticTokenColorCustomizations(scope);
    const updated = { ...current };

    const targetObj = themeScoped
      ? (typeof updated[`[${themeName}]`] === 'object' ? { ...updated[`[${themeName}]`] } : {})
      : updated;

    for (const [key, val] of Object.entries(tokens)) {
      if (val !== undefined && val !== null) {
        targetObj[key] = val;
      } else {
        delete targetObj[key];
      }
    }

    if (themeScoped) {
      const themeKey = `[${themeName}]`;
      if (Object.keys(targetObj).length > 0) {
        updated[themeKey] = targetObj;
      } else {
        delete updated[themeKey];
      }
    }

    await this.configAccessor.update('editor.semanticTokenColorCustomizations', updated, scope);
  }

  /**
   * Resets a specific workbench color property.
   */
  public async resetProperty(colorId: string, themeName: string, scope: ColorScope): Promise<void> {
    const current = this.getColorCustomizations(scope);
    const updated = { ...current };

    // Delete from global level
    delete updated[colorId];

    // Delete from active theme scoped block
    const themeKey = `[${themeName}]`;
    if (updated[themeKey] && typeof updated[themeKey] === 'object') {
      const themeObj = { ...updated[themeKey] };
      delete themeObj[colorId];
      if (Object.keys(themeObj).length > 0) {
        updated[themeKey] = themeObj;
      } else {
        delete updated[themeKey];
      }
    }

    await this.configAccessor.update('workbench.colorCustomizations', updated, scope);
  }

  /**
   * Resets all customized workbench colors for a given theme scope.
   */
  public async resetAllColors(themeName: string, scope: ColorScope): Promise<void> {
    const current = this.getColorCustomizations(scope);
    const updated = { ...current };

    const themeKey = `[${themeName}]`;
    delete updated[themeKey];

    await this.configAccessor.update('workbench.colorCustomizations', updated, scope);
  }

  /**
   * Restores a captured pre-customization snapshot completely and safely.
   */
  public async restoreSnapshot(snapshot: ConfigSnapshot): Promise<void> {
    await this.configAccessor.update(
      'workbench.colorCustomizations',
      snapshot.colorCustomizations,
      snapshot.scope
    );
    await this.configAccessor.update(
      'editor.tokenColorCustomizations',
      snapshot.tokenColorCustomizations,
      snapshot.scope
    );
    await this.configAccessor.update(
      'editor.semanticTokenColorCustomizations',
      snapshot.semanticTokenColorCustomizations,
      snapshot.scope
    );
  }
}


