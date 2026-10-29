import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileService, IProfileStorage } from '../src/services/ProfileService';
import { ThemeProfile } from '../src/shared/types';

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
});

