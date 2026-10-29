import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileService, IProfileStorage } from '../src/services/ProfileService';
import { ThemeProfile } from '../src/shared/types';
import { STARTER_PRESETS } from '../src/shared/starterPresets';

const STORAGE_KEY = 'colorfly.savedProfiles.v1';

class MockProfileStorage implements IProfileStorage {
  private store: Record<string, any> = {};

  get<T>(key: string, defaultValue?: T): T {
    return this.store[key] ?? defaultValue as T;
  }

  async update(key: string, value: any): Promise<void> {
    this.store[key] = value;
  }
}

describe('ProfileService', () => {
  let storage: MockProfileStorage;
  let service: ProfileService;

  beforeEach(() => {
    storage = new MockProfileStorage();
    service = new ProfileService(storage);
  });

  it('initializes with the 8 built-in presets by default', () => {
    const profiles = service.getProfiles();
    expect(profiles.length).toBe(8);
    expect(profiles.some((p) => p.name === 'Midnight')).toBe(true);
  });

  it('saves and updates a custom theme profile', async () => {
    const newProfile: ThemeProfile = {
      id: 'profile-my-theme',
      version: 1,
      name: 'Cyberpunk Neon',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workbenchColors: {
        'editor.background': '#050505',
        'editor.foreground': '#00ffcc',
      },
    };

    await service.saveProfile(newProfile);
    const retrieved = service.getProfile('profile-my-theme');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Cyberpunk Neon');
    expect(retrieved?.workbenchColors['editor.foreground']).toBe('#00ffcc');
  });

  it('duplicates an existing profile with a new name and unique ID', async () => {
    const duplicated = await service.duplicateProfile('preset-midnight', 'Midnight Variant');
    expect(duplicated.id).not.toBe('preset-midnight');
    expect(duplicated.name).toBe('Midnight Variant');
    expect(duplicated.isBuiltIn).toBe(false);
    expect(service.getProfile(duplicated.id)).toBeDefined();
  });

  it('prevents deleting built-in starter presets', async () => {
    await expect(service.deleteProfile('preset-midnight')).rejects.toThrow('Cannot delete built-in');
  });

  it('imports valid ChromaForge profile JSON successfully', async () => {
    const json = JSON.stringify({
      version: 1,
      name: 'Solarized Custom',
      workbenchColors: {
        'editor.background': '#002b36',
      },
    });

    const result = await service.importProfile(json);
    expect(result.success).toBe(true);
    expect(result.profile?.name).toBe('Solarized Custom');
    expect(result.profile?.workbenchColors['editor.background']).toBe('#002b36');
  });

  it('rejects malformed or invalid profile JSON with descriptive error', async () => {
    const result = await service.importProfile('{ not valid json }');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('exports profile as formatted JSON', () => {
    const exported = service.exportProfileJson('preset-midnight');
    expect(exported).not.toBeNull();
    const parsed = JSON.parse(exported!);
    expect(parsed.name).toBe('Midnight');
  });

  it('keeps built-in presets fresh from code and preserves only favorites on legacy storage', async () => {
    const freshPreset = STARTER_PRESETS.find((p) => p.id === 'preset-midnight')!;
    await storage.update(STORAGE_KEY, [
      { ...freshPreset, description: 'STALE OLD CONTENT', isFavorite: true },
      { id: 'profile-custom-legacy', name: 'Mine', version: 1, workbenchColors: {} },
    ]);

    const svc = new ProfileService(storage);
    const preset = svc.getProfile('preset-midnight');
    expect(preset?.description).toBe(freshPreset.description);
    expect(preset?.isFavorite).toBe(true);
    expect(svc.getProfile('profile-custom-legacy')).toBeDefined();
    expect(svc.getProfiles().length).toBe(9);
  });

  it('restores built-in favorites from the v2 storage shape', async () => {
    await storage.update(STORAGE_KEY, {
      version: 2,
      custom: [{ id: 'profile-custom-v2', name: 'V2 Custom', version: 1, workbenchColors: {} }],
      builtInFavorites: { 'preset-midnight': true },
    });

    const svc = new ProfileService(storage);
    expect(svc.getProfile('preset-midnight')?.isFavorite).toBe(true);
    expect(svc.getProfile('profile-custom-v2')).toBeDefined();
    expect(svc.getProfiles().filter((p) => p.isBuiltIn).length).toBe(STARTER_PRESETS.length);
  });

  it('persists only custom profiles plus built-in favorite flags', async () => {
    await service.saveProfile({
      id: 'profile-to-persist',
      version: 1,
      name: 'Persisted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workbenchColors: { 'editor.background': '#000000' },
    });
    await service.toggleFavorite('preset-midnight');

    const stored = await storage.get<any>(STORAGE_KEY);
    expect(Array.isArray(stored.custom)).toBe(true);
    expect(stored.custom.every((p: ThemeProfile) => !p.isBuiltIn)).toBe(true);
    expect(stored.custom.some((p: ThemeProfile) => p.id === 'profile-to-persist')).toBe(true);
    expect(stored.builtInFavorites['preset-midnight']).toBe(true);
  });

  it('rejects saving a profile without a non-empty name', async () => {
    const invalid: ThemeProfile = {
      id: 'profile-invalid',
      version: 1,
      name: '   ',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workbenchColors: {},
    };
    await expect(service.saveProfile(invalid)).rejects.toThrow('non-empty name');
  });

  it('drops invalid colors when importing a VS Code color-theme JSON', async () => {
    const json = JSON.stringify({
      name: 'Bad Colors Theme',
      colors: {
        'editor.background': '#002b36',
        'editor.foreground': 'not-a-color',
      },
    });

    const result = await service.importProfile(json);
    expect(result.success).toBe(true);
    expect(result.profile?.workbenchColors['editor.background']).toBe('#002b36');
    expect(result.profile?.workbenchColors['editor.foreground']).toBeUndefined();
  });
});

