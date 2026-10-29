/**
 * ColorFly: Webview System Log Store
 * Unified reactive buffer for extension-host, console, and window runtime errors.
 */

import { useSyncExternalStore } from 'react';
import { SystemLogEntry, SystemLogLevel } from '../shared/types';

const MAX_ENTRIES = 500;

let entries: SystemLogEntry[] = [];
const listeners = new Set<() => void>();
let seq = 0;
let notifyScheduled = false;

function scheduleNotify(): void {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    listeners.forEach((listener) => listener());
  });
}

function commit(next: SystemLogEntry[]): void {
  const capped =
    next.length > MAX_ENTRIES ? next.slice(next.length - MAX_ENTRIES) : next;
  capped.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
  entries = capped;
  scheduleNotify();
}

export function subscribeLogs(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLogsSnapshot(): SystemLogEntry[] {
  return entries;
}

export function addLog(input: {
  level: SystemLogLevel;
  source: string;
  message: string;
  detail?: string;
  id?: string;
  timestamp?: string;
}): SystemLogEntry {
  const entry: SystemLogEntry = {
    id: input.id || `web-${Date.now().toString(36)}-${(++seq).toString(36)}`,
    timestamp: input.timestamp || new Date().toISOString(),
    level: input.level,
    source: input.source,
    message: input.message,
    detail: input.detail,
  };
  commit([...entries, entry]);
  return entry;
}

export function mergeLogs(incoming: SystemLogEntry[]): void {
  if (!incoming || incoming.length === 0) return;
  const known = new Set(entries.map((entry) => entry.id));
  const fresh = incoming.filter((entry) => entry && entry.id && !known.has(entry.id));
  if (fresh.length === 0) return;
  commit([...entries, ...fresh]);
}

export function clearLogs(): void {
  entries = [];
  scheduleNotify();
}

export function countLogs(list: SystemLogEntry[]): {
  total: number;
  error: number;
  warn: number;
  info: number;
} {
  let error = 0;
  let warn = 0;
  let info = 0;
  for (const entry of list) {
    if (entry.level === 'error') error++;
    else if (entry.level === 'warn') warn++;
    else info++;
  }
  return { total: list.length, error, warn, info };
}

export function stringifyLogValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.stack || value.message;
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function formatLogEntry(entry: SystemLogEntry): string {
  const head = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.source}] ${entry.message}`;
  return entry.detail ? `${head}\n${entry.detail}` : head;
}

export function formatLogReport(list: SystemLogEntry[]): string {
  const counts = countLogs(list);
  const header = [
    'ColorFly System Log Report',
    `Generated: ${new Date().toISOString()}`,
    `Entries: ${counts.total} (${counts.error} errors, ${counts.warn} warnings, ${counts.info} info)`,
    '============================================================',
  ].join('\n');
  const body = list.map(formatLogEntry).join('\n\n');
  return body ? `${header}\n\n${body}` : `${header}\n\n(no entries)`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy copy
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function useSystemLogs(): SystemLogEntry[] {
  return useSyncExternalStore(subscribeLogs, getLogsSnapshot, getLogsSnapshot);
}

const originalConsoleError = console.error.bind(console);
const originalConsoleWarn = console.warn.bind(console);

console.error = (...args: unknown[]) => {
  originalConsoleError(...args);
  try {
    const [first, ...rest] = args;
    addLog({
      level: 'error',
      source: 'console',
      message: stringifyLogValue(first),
      detail: rest.length > 0 ? rest.map(stringifyLogValue).join('\n') : undefined,
    });
  } catch {
    // logging must never break the console
  }
};

console.warn = (...args: unknown[]) => {
  originalConsoleWarn(...args);
  try {
    const [first, ...rest] = args;
    addLog({
      level: 'warn',
      source: 'console',
      message: stringifyLogValue(first),
      detail: rest.length > 0 ? rest.map(stringifyLogValue).join('\n') : undefined,
    });
  } catch {
    // logging must never break the console
  }
};
