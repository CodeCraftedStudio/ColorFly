import { describe, it, expect, beforeEach } from 'vitest';
import { RecoveryService } from '../src/services/RecoveryService';
import { ConfigSnapshot } from '../src/shared/types';

describe('RecoveryService', () => {
  let service: RecoveryService;

  beforeEach(() => {
    service = new RecoveryService();
  });

  it('records initial snapshot and preserves it immutably', () => {
    const snapshot: ConfigSnapshot = {
      id: 'snap-1',
      timestamp: new Date().toISOString(),
      reason: 'initial',
      scope: 'user',
      baseTheme: 'Default Dark+',
      colorCustomizations: { 'editor.background': '#111111' },
      tokenColorCustomizations: {},
      semanticTokenColorCustomizations: {},
    };

    service.setInitialSnapshot(snapshot);
    expect(service.getInitialSnapshot()).toEqual(snapshot);

    // Subsequent sets should not overwrite the first pristine snapshot
    const secondSnapshot: ConfigSnapshot = { ...snapshot, id: 'snap-2' };
    service.setInitialSnapshot(secondSnapshot);
    expect(service.getInitialSnapshot()?.id).toBe('snap-1');
  });

  it('tracks undo and redo change history', () => {
    service.recordChange({
      type: 'color',
      key: 'editor.background',
      previousValue: '#000000',
      newValue: '#111111',
    });

    service.recordChange({
      type: 'color',
      key: 'editor.foreground',
      previousValue: '#888888',
      newValue: '#ffffff',
    });

    expect(service.canUndo()).toBe(true);
    expect(service.canRedo()).toBe(false);

    const undone1 = service.undo();
    expect(undone1?.key).toBe('editor.foreground');
    expect(service.canRedo()).toBe(true);

    const redone1 = service.redo();
    expect(redone1?.key).toBe('editor.foreground');
  });
});

