import { describe, it, expect, beforeEach } from 'vitest';
import { ConfigurationService, IConfigAccessor } from '../src/services/ConfigurationService';
import { ColorScope } from '../src/shared/types';

class MockConfigAccessor implements IConfigAccessor {
  private store: Record<string, { global?: any; workspace?: any }> = {};

  get<T>(section: string, defaultValue?: T): T {
    const inspected = this.inspect<T>(section);
    return inspected?.globalValue ?? defaultValue as T;
  }

  async update(section: string, value: any, target: ColorScope): Promise<void> {
    if (!this.store[section]) {
      this.store[section] = {};
    }
    if (target === 'workspace') {
      this.store[section].workspace = value;
    } else {
      this.store[section].global = value;
    }
  }

  inspect<T>(section: string) {
    const entry = this.store[section];
    return {
      key: section,
      globalValue: entry?.global as T | undefined,
      workspaceValue: entry?.workspace as T | undefined,
    };
  }

  // Helper for test setup
  setInitial(section: string, globalVal?: any, workspaceVal?: any) {
    this.store[section] = {
      global: globalVal,
      workspace: workspaceVal,
    };
  }
}

describe('ConfigurationService', () => {
  let accessor: MockConfigAccessor;
  let service: ConfigurationService;

  beforeEach(() => {
    accessor = new MockConfigAccessor();
    service = new ConfigurationService(accessor);
  });

  it('reads empty customizations when none are configured', () => {
    const colors = service.getColorCustomizations('user');
    expect(colors).toEqual({});
  });

  it('preserves existing unrelated customizations when applying new colors', async () => {
    accessor.setInitial('workbench.colorCustomizations', {
      'unrelated.color': '#111111',
      '[Other Theme]': { 'editor.background': '#222222' },
    });

    await service.applyWorkbenchColors(
      { 'editor.background': '#0f0f14' },
      'Default Dark+',
      'user',
      true
    );

    const saved = service.getColorCustomizations('user');
    expect(saved['unrelated.color']).toBe('#111111');
    expect(saved['[Other Theme]']).toEqual({ 'editor.background': '#222222' });
    expect(saved['[Default Dark+]']).toEqual({ 'editor.background': '#0f0f14' });
  });

  it('correctly resolves effective colors with theme-bracket priority', () => {
    accessor.setInitial('workbench.colorCustomizations', {
      'editor.background': '#000000',
      'sideBar.background': '#111111',
      '[Default Dark+]': {
        'editor.background': '#222222', // overrides global #000000 for this theme
      },
    });

    const effective = service.getEffectiveWorkbenchColors('Default Dark+', 'user');
    expect(effective['editor.background']).toBe('#222222');
    expect(effective['sideBar.background']).toBe('#111111');
  });

  it('resets a specific property without wiping unrelated settings', async () => {
    accessor.setInitial('workbench.colorCustomizations', {
      'keep.this.color': '#abcdef',
      '[Default Dark+]': {
        'editor.background': '#222222',
        'editor.foreground': '#ffffff',
      },
    });

    await service.resetProperty('editor.background', 'Default Dark+', 'user');

    const result = service.getColorCustomizations('user');
    expect(result['keep.this.color']).toBe('#abcdef');
    expect(result['[Default Dark+]']['editor.foreground']).toBe('#ffffff');
    expect(result['[Default Dark+]']['editor.background']).toBeUndefined();
  });

  it('creates and restores a full snapshot safely', async () => {
    accessor.setInitial('workbench.colorCustomizations', { 'editor.background': '#111111' });
    accessor.setInitial('editor.tokenColorCustomizations', { comments: '#222222' });

    const snapshot = service.createSnapshot('test reason', 'user', 'Default Dark+');

    // Modify configuration
    await service.applyWorkbenchColors({ 'editor.background': '#999999' }, 'Default Dark+', 'user', false);
    expect(service.getColorCustomizations('user')['editor.background']).toBe('#999999');

    // Restore snapshot
    await service.restoreSnapshot(snapshot);
    expect(service.getColorCustomizations('user')['editor.background']).toBe('#111111');
    expect(service.getTokenColorCustomizations('user')['comments']).toBe('#222222');
  });
});

