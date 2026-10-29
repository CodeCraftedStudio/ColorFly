/**
 * ChromaForge: Profile Management Service
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
    const stored = this.storage.get<ThemeProfile[]>(STORAGE_KEY, []);
    this.profiles.clear();

    // Load built-in starter presets first
    for (const preset of STARTER_PRESETS) {
      this.profiles.set(preset.id, { ...preset });
    }

    // Merge or override with user's stored profiles
    if (Array.isArray(stored)) {
      for (const p of stored) {
        if (p && p.id && p.name) {
          this.profiles.set(p.id, p);
        }
      }
    }
  }

  private async persist(): Promise<void> {
    const list = Array.from(this.profiles.values());
    await this.storage.update(STORAGE_KEY, list);
  }

  public getProfiles(): ThemeProfile[] {
    return Array.from(this.profiles.values());
  }

  public getProfile(id: string): ThemeProfile | undefined {
    return this.profiles.get(id);
  }

  public async saveProfile(profile: ThemeProfile): Promise<ThemeProfile> {
    const updated: ThemeProfile = {
      ...profile,
      version: 1,
      updatedAt: new Date().toISOString(),
    };

    if (!updated.createdAt) {
      updated.createdAt = updated.updatedAt;
    }

    // Built-in presets cannot be overwritten directly, mark as custom or create duplicate
    if (updated.isBuiltIn) {
      updated.id = `profile-${Date.now()}`;
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
        const imported: ThemeProfile = {
          id: `profile-imported-${Date.now()}`,
          version: 1,
          name: parsed.name || 'Imported VS Code Theme',
          description: 'Imported from VS Code color theme JSON',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workbenchColors: parsed.colors || {},
          tokenColors: {
            textMateRules: Array.isArray(parsed.tokenColors) ? parsed.tokenColors : [],
          },
        };
        await this.saveProfile(imported);
        return { success: true, profile: imported };
      }

      // Handle native ChromaForge Theme Profile format
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
        id: `profile-imported-${Date.now()}`,
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

