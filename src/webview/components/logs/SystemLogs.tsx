/**
 * ColorFly: System Logs & Error Console Tab
 * Surfaces captured extension-host, console, window, and render errors with copy tools for debugging.
 */

import React, { useMemo, useState } from 'react';
import { SystemLogEntry, SystemLogLevel } from '../../../shared/types';
import {
  useSystemLogs,
  clearLogs,
  countLogs,
  formatLogEntry,
  formatLogReport,
  copyText,
} from '../../logStore';
import {
  TerminalIcon,
  CopyIcon,
  TrashIcon,
  SearchIcon,
  CheckIcon,
} from '../common/Icons';

type LevelFilter = 'all' | SystemLogLevel;

interface LevelStyle {
  color: string;
  badge: string;
  label: string;
}

const LEVEL_STYLES: Record<SystemLogLevel, LevelStyle> = {
  error: { color: '#ef4444', badge: '#dc2626', label: 'ERROR' },
  warn: { color: '#d97706', badge: '#d97706', label: 'WARN' },
  info: { color: '#3b82f6', badge: '#2563eb', label: 'INFO' },
};

const FILTERS: Array<{ id: LevelFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'error', label: 'Errors' },
  { id: 'warn', label: 'Warnings' },
  { id: 'info', label: 'Info' },
];

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

function formatTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return isoTimestamp;
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(
    date.getMilliseconds(),
    3
  )}`;
}

const StatBox: React.FC<{ value: number; label: string; color: string }> = ({
  value,
  label,
  color,
}) => (
  <div
    style={{
      minWidth: 66,
      padding: '6px 10px',
      background: 'var(--cf-input-bg)',
      border: '1px solid var(--cf-border)',
      borderRadius: 6,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1.2 }}>{value}</div>
    <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)', marginTop: 2 }}>{label}</div>
  </div>
);

export const SystemLogs: React.FC = () => {
  const logs = useSystemLogs();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reportCopied, setReportCopied] = useState(false);

  const counts = useMemo(() => countLogs(logs), [logs]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = logs.filter((entry) => {
      if (levelFilter !== 'all' && entry.level !== levelFilter) return false;
      if (!needle) return true;
      const haystack = `${entry.message}\n${entry.detail || ''}\n${entry.source}`.toLowerCase();
      return haystack.includes(needle);
    });
    return list.slice().reverse();
  }, [logs, query, levelFilter]);

  const handleCopyEntry = async (entry: SystemLogEntry) => {
    const ok = await copyText(formatLogEntry(entry));
    if (ok) {
      setCopiedId(entry.id);
      window.setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleCopyReport = async () => {
    const ok = await copyText(formatLogReport(filtered));
    if (ok) {
      setReportCopied(true);
      window.setTimeout(() => setReportCopied(false), 2000);
    }
  };

  const handleClear = () => {
    clearLogs();
    setCopiedId(null);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        className="card"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
      >
        <div style={{ minWidth: 260, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TerminalIcon size={18} style={{ color: counts.error > 0 ? '#ef4444' : '#3b82f6' }} />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
              System Logs & Error Console
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: 13, color: 'var(--cf-desc-fg)' }}>
            Every runtime error captured from the extension host, studio UI, and console in one place.
            Copy any entry — or the full report — and paste it straight into your debugging workflow.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <StatBox value={counts.error} label="Errors" color="#ef4444" />
          <StatBox value={counts.warn} label="Warnings" color="#d97706" />
          <StatBox value={counts.info} label="Info" color="#3b82f6" />
          <StatBox value={counts.total} label="Total" color="var(--cf-title-fg)" />
        </div>
      </div>

      <div
        className="card"
        style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', padding: 12 }}
      >
        <div className="search-bar-wrap" style={{ flex: 1, minWidth: 220, margin: 0 }}>
          <SearchIcon
            size={14}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--cf-desc-fg)', pointerEvents: 'none' }}
          />
          <input
            className="search-input"
            style={{ paddingLeft: 32 }}
            placeholder="Search messages, stack traces, sources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            className={`btn btn-sm ${levelFilter === filter.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setLevelFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button className="btn btn-primary btn-sm" onClick={handleCopyReport} disabled={filtered.length === 0}>
          {reportCopied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          <span>{reportCopied ? 'Report Copied' : `Copy Report (${filtered.length})`}</span>
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={handleClear}
          disabled={logs.length === 0}
          title="Clear all captured logs"
        >
          <TrashIcon size={12} />
          <span>Clear</span>
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--cf-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--cf-title-fg)',
          }}
        >
          <span>Captured Entries</span>
          <span style={{ fontWeight: 500, fontSize: 11, color: 'var(--cf-desc-fg)' }}>
            showing {filtered.length} of {counts.total} · newest first
          </span>
        </div>

        <div style={{ maxHeight: '58vh', overflowY: 'auto' }}>
          {logs.length === 0 && (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <TerminalIcon size={32} style={{ color: 'var(--cf-desc-fg)', opacity: 0.5 }} />
              <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
                No system logs captured yet
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--cf-desc-fg)', maxWidth: 480, margin: '6px auto 0' }}>
                Runtime errors from the extension host, React render failures, console errors, and unhandled
                promise rejections will show up here automatically as they happen.
              </div>
            </div>
          )}

          {logs.length > 0 && filtered.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center', fontSize: 13, color: 'var(--cf-desc-fg)' }}>
              No entries match your current search or level filter.
            </div>
          )}

          {filtered.map((entry) => {
            const style = LEVEL_STYLES[entry.level] || LEVEL_STYLES.info;
            return (
              <div
                key={entry.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  borderLeft: `3px solid ${style.color}`,
                  background: entry.level === 'error' ? 'rgba(239, 68, 68, 0.05)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--cf-font-mono)',
                      fontSize: 11,
                      color: 'var(--cf-desc-fg)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatTime(entry.timestamp)}
                  </span>
                  <span className="badge" style={{ background: style.badge, color: '#ffffff' }}>
                    {style.label}
                  </span>
                  <span className="badge">{entry.source}</span>
                  <span
                    style={{
                      flex: 1,
                      minWidth: 180,
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--cf-fg)',
                      wordBreak: 'break-word',
                    }}
                  >
                    {entry.message}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleCopyEntry(entry)}
                    title="Copy this log entry"
                  >
                    {copiedId === entry.id ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                    <span>{copiedId === entry.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {entry.detail && (
                  <pre
                    style={{
                      margin: '8px 0 0 0',
                      padding: 10,
                      background: 'var(--cf-input-bg)',
                      border: '1px solid var(--cf-border)',
                      borderRadius: 6,
                      fontFamily: 'var(--cf-font-mono)',
                      fontSize: 11,
                      lineHeight: 1.5,
                      color: 'var(--cf-input-fg)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: 220,
                      overflowY: 'auto',
                    }}
                  >
                    {entry.detail}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', textAlign: 'center' }}>
        Extension-host logs persist across studio reloads (last 400 entries). UI and console logs are kept
        for this session (max 500 entries).
      </div>
    </div>
  );
};
