import { describe, it, expect, beforeEach } from 'vitest';
import {
  SystemLogService,
  SYSTEM_LOG_MAX_ENTRIES,
  formatErrorDetail,
  formatErrorMessage,
} from '../src/services/SystemLogService';
import { SystemLogEntry } from '../src/shared/types';

describe('SystemLogService', () => {
  let service: SystemLogService;

  beforeEach(() => {
    service = new SystemLogService();
  });

  it('records entries with level, source, message, and ISO timestamp', () => {
    const entry = service.error('extension-host', 'Operation failed', 'Error: stack');

    expect(entry.level).toBe('error');
    expect(entry.source).toBe('extension-host');
    expect(entry.message).toBe('Operation failed');
    expect(entry.detail).toBe('Error: stack');
    expect(Number.isNaN(Date.parse(entry.timestamp))).toBe(false);
    expect(service.getEntries()).toEqual([entry]);
  });

  it('supports warn and info levels', () => {
    service.warn('command', 'warned');
    service.info('extension', 'noted');

    expect(service.getEntries().map((e) => e.level)).toEqual(['warn', 'info']);
  });

  it('notifies subscribers until disposed', () => {
    const seen: SystemLogEntry[] = [];
    const subscription = service.onDidLog((entry) => seen.push(entry));

    service.info('source', 'first');
    service.error('source', 'second');
    expect(seen).toHaveLength(2);

    subscription.dispose();
    service.error('source', 'third');
    expect(seen).toHaveLength(2);
    expect(service.getEntries()).toHaveLength(3);
  });

  it('caps the buffer at SYSTEM_LOG_MAX_ENTRIES dropping oldest entries', () => {
    const total = SYSTEM_LOG_MAX_ENTRIES + 25;
    for (let i = 0; i < total; i++) {
      service.info('source', `message ${i}`);
    }

    const entries = service.getEntries();
    expect(entries).toHaveLength(SYSTEM_LOG_MAX_ENTRIES);
    expect(entries[0].message).toBe('message 25');
    expect(entries[entries.length - 1].message).toBe(`message ${total - 1}`);
  });

  it('clears all buffered entries', () => {
    service.error('source', 'one');
    service.clear();

    expect(service.getEntries()).toHaveLength(0);
  });

  it('formats error messages and details from mixed input', () => {
    const err = new Error('kaboom');

    expect(formatErrorMessage(err)).toBe('kaboom');
    expect(formatErrorMessage('plain string')).toBe('plain string');
    expect(formatErrorMessage(null)).toBe('Unknown error');
    expect(formatErrorDetail(err)).toContain('kaboom');
    expect(formatErrorDetail('trace')).toBe('trace');
    expect(formatErrorDetail(undefined)).toBeUndefined();
    expect(formatErrorDetail({ code: 500 })).toContain('500');
  });
});
