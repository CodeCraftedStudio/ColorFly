/**
 * ColorFly: Extension Host System Log Service
 * Ring buffer of runtime errors and diagnostics forwarded to the Theme Studio webview.
 */

import { SystemLogEntry, SystemLogLevel } from '../shared/types';

export const SYSTEM_LOG_MAX_ENTRIES = 400;

export function formatErrorDetail(err: unknown): string | undefined {
  if (err === undefined || err === null) return undefined;
  if (err instanceof Error) return err.stack || err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return String(err);
  }
}

export function formatErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err === undefined || err === null) return 'Unknown error';
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export class SystemLogService {
  private entries: SystemLogEntry[] = [];
  private listeners = new Set<(entry: SystemLogEntry) => void>();
  private seq = 0;

  public log(level: SystemLogLevel, source: string, message: string, detail?: string): SystemLogEntry {
    const entry: SystemLogEntry = {
      id: `ext-${Date.now().toString(36)}-${(++this.seq).toString(36)}`,
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      detail,
    };

    this.entries = [...this.entries, entry];
    if (this.entries.length > SYSTEM_LOG_MAX_ENTRIES) {
      this.entries = this.entries.slice(this.entries.length - SYSTEM_LOG_MAX_ENTRIES);
    }

    this.listeners.forEach((listener) => listener(entry));
    return entry;
  }

  public error(source: string, message: string, detail?: string): SystemLogEntry {
    return this.log('error', source, message, detail);
  }

  public warn(source: string, message: string, detail?: string): SystemLogEntry {
    return this.log('warn', source, message, detail);
  }

  public info(source: string, message: string, detail?: string): SystemLogEntry {
    return this.log('info', source, message, detail);
  }

  public getEntries(): SystemLogEntry[] {
    return this.entries;
  }

  public clear(): void {
    this.entries = [];
  }

  public onDidLog(listener: (entry: SystemLogEntry) => void): { dispose(): void } {
    this.listeners.add(listener);
    return {
      dispose: () => {
        this.listeners.delete(listener);
      },
    };
  }
}
