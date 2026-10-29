/**
 * ColorFly: Profile Management Service
 * Provides CRUD operations, versioned schema validation, imports, and exports for Theme Profiles.
 */

import { ThemeProfile } from '../shared/types';
import { STARTER_PRESETS } from '../shared/starterPresets';
import { isValidColor } from '../shared/colorUtils';

export interface IProfileStorage {
  get<T>(key: string, defaultValue?: T): T;
  update(key: string, value: any): Promise<void>;
}

const STORAGE_KEY = 'colorfly.savedProfiles.v1';

export class ProfileService {
  private storage: IProfileStorage;
  private profiles: Map<string, ThemeProfile> = new Map();

  constructor(storage: IProfileStorage) {
    this.storage = storage;
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedRaw = this.storage.get<unknown>(STORAGE_KEY, []);
    this.profiles.clear();

    // Always start from fresh code-defined starter presets so built-in content
    // is updated by extension releases instead of being frozen at first save.
    const builtInIds = new Set(STARTER_PRESETS.map((preset) => preset.id));
    let storedFavorites: Record<string, boolean> = {};
    let storedCustom: ThemeProfile[] = [];

    if (Array.isArray(storedRaw)) {
      // Legacy shape: plain array containing both built-ins and customs
      for (const entry of storedRaw as ThemeProfile[]) {
        if (!entry || !entry.id || !entry.name) continue;
        if (entry.isBuiltIn || builtInIds.has(entry.id)) {
          if (builtInIds.has(entry.id) && entry.isFavorite) {
            storedFavorites[entry.id] = true;
          }
          continue;
        }
        storedCustom.push(entry);
      }
    } else if (storedRaw && typeof storedRaw === 'object') {
      const payload = storedRaw as { custom?: unknown; builtInFavorites?: unknown };
      if (Array.isArray(payload.custom)) {
        storedCustom = payload.custom.filter(
          (entry): entry is ThemeProfile =>
            !!entry && typeof entry === 'object' && !!(entry as ThemeProfile).id && !!(entry as ThemeProfile).name
        );
      }
      if (payload.builtInFavorites && typeof payload.builtInFavorites === 'object') {
        storedFavorites = payload.builtInFavorites as Record<string, boolean>;
      }
    }

    for (const preset of STARTER_PRESETS) {
      this.profiles.set(preset.id, { ...preset, isFavorite: !!storedFavorites[preset.id] });
    }

    for (const profile of storedCustom) {
      if (profile.isBuiltIn || builtInIds.has(profile.id)) continue;
      this.profiles.set(profile.id, profile);
    }
  }

  private async persist(): Promise<void> {
    const custom = Array.from(this.profiles.values()).filter((profile) => !profile.isBuiltIn);
    const builtInFavorites: Record<string, boolean> = {};
    for (const preset of STARTER_PRESETS) {
      const storedPreset = this.profiles.get(preset.id);
      if (storedPreset?.isFavorite) {
        builtInFavorites[preset.id] = true;
      }
    }

    try {
      await this.storage.update(STORAGE_KEY, { version: 2, custom, builtInFavorites });
    } catch (err: any) {
      console.warn('ColorFly: Failed to persist profiles:', err?.message || err);
    }
  }

  public getProfiles(): ThemeProfile[] {
    return Array.from(this.profiles.values());
  }

  public getProfile(id: string): ThemeProfile | undefined {
    return this.profiles.get(id);
  }

  public async saveProfile(profile: ThemeProfile): Promise<ThemeProfile> {
    if (!profile || typeof profile.name !== 'string' || !profile.name.trim()) {
      throw new Error('Profile must include a non-empty name.');
    }

    const updated: ThemeProfile = {
      ...profile,
      name: profile.name.trim(),
      version: 1,
      workbenchColors:
        profile.workbenchColors && typeof profile.workbenchColors === 'object'
          ? profile.workbenchColors
          : {},
      updatedAt: new Date().toISOString(),
    };

    if (!updated.createdAt) {
      updated.createdAt = updated.updatedAt;
    }

    // Built-in presets cannot be overwritten directly, mark as custom or create duplicate
    if (updated.isBuiltIn) {
      updated.id = `profile-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      updated.isBuiltIn = false;
      updated.name = `${updated.name} (Customized)`;
    }

    this.profiles.set(updated.id, updated);
    await this.persist();
    return updated;
  }

  public async duplicateProfile(id: string, newName: string): Promise<ThemeProfile> {
    const source = this.profiles.get(id);
    if (!source) {
      throw new Error(`Profile with ID "${id}" does not exist.`);
    }

    const duplicate: ThemeProfile = {
      ...JSON.parse(JSON.stringify(source)),
      id: `profile-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newName.trim() || `${source.name} (Copy)`,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.profiles.set(duplicate.id, duplicate);
    await this.persist();
    return duplicate;
  }

  public async deleteProfile(id: string): Promise<boolean> {
    const target = this.profiles.get(id);
    if (!target) return false;

    // Do not allow deleting built-in presets
    if (target.isBuiltIn) {
      throw new Error('Cannot delete built-in starter presets.');
    }

    const deleted = this.profiles.delete(id);
    if (deleted) {
      await this.persist();
    }
    return deleted;
  }

  public async toggleFavorite(id: string): Promise<ThemeProfile | undefined> {
    const p = this.profiles.get(id);
    if (!p) return undefined;

    p.isFavorite = !p.isFavorite;
    p.updatedAt = new Date().toISOString();
    this.profiles.set(id, p);
    await this.persist();
    return p;
  }

  /**
   * Imports a profile from a JSON string with safe schema and color validation.
   */
  public async importProfile(jsonStr: string): Promise<{ success: boolean; profile?: ThemeProfile; error?: string }> {
    try {
      const parsed = JSON.parse(jsonStr);

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Imported content is not a valid JSON object.' };
      }

      // Handle standard VS Code color-theme JSON format
      if (parsed['$schema']?.includes('color-theme') || (parsed.colors && typeof parsed.colors === 'object')) {
        const importedColors: Record<string, string> = {};
        for (const [key, val] of Object.entries(parsed.colors || {})) {
          if (typeof val === 'string' && isValidColor(val)) {
            importedColors[key] = val;
          }
        }
        const imported: ThemeProfile = {
          id: `profile-imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          version: 1,
          name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name : 'Imported VS Code Theme',
          description: 'Imported from VS Code color theme JSON',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workbenchColors: importedColors,
          tokenColors: {
            textMateRules: Array.isArray(parsed.tokenColors)
              ? parsed.tokenColors.filter((rule: any) => rule && typeof rule === 'object')
              : [],
          },
        };
        await this.saveProfile(imported);
        return { success: true, profile: imported };
      }

      // Handle native ColorFly Theme Profile format
      if (!parsed.name || typeof parsed.name !== 'string') {
        return { success: false, error: 'Missing required "name" field in profile.' };
      }

      const importedColors: Record<string, string> = {};
      if (parsed.workbenchColors && typeof parsed.workbenchColors === 'object') {
        for (const [key, val] of Object.entries(parsed.workbenchColors)) {
          if (typeof val === 'string' && isValidColor(val)) {
            importedColors[key] = val;
          }
        }
      }

      const imported: ThemeProfile = {
        id: `profile-imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        version: 1,
        name: parsed.name,
        description: parsed.description,
        author: parsed.author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workbenchColors: importedColors,
        tokenColors: parsed.tokenColors || {},
        semanticTokenColors: parsed.semanticTokenColors || {},
      };

      await this.saveProfile(imported);
      return { success: true, profile: imported };
    } catch (err: any) {
      return { success: false, error: `Invalid JSON format: ${err?.message || err}` };
    }
  }

  /**
   * Exports a profile as formatted JSON string.
   */
  public exportProfileJson(id: string): string | null {
    const profile = this.profiles.get(id);
    if (!profile) return null;
    return JSON.stringify(profile, null, 2);
  }
}


