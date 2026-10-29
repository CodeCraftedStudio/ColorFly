/**
 * ChromaForge: Export Theme Dialog Modal
 */

import React, { useState, useEffect } from 'react';
import { ThemeProfile } from '../../../shared/types';
import { sendToExtension } from '../../vscodeApi';
import { CloseIcon, ExportIcon } from './Icons';

interface ExportModalProps {
  profiles: ThemeProfile[];
  activeProfileId?: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  profiles,
  activeProfileId,
  onClose,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(activeProfileId || (profiles[0]?.id ?? ''));
  const [format, setFormat] = useState<'theme-json' | 'chromaforge-profile' | 'extension-scaffold'>('theme-json');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const hasProfiles = profiles.length > 0;
  const canExport = hasProfiles && !!selectedProfileId;

  const handleExport = () => {
    if (!canExport) return;
    sendToExtension({
      type: 'EXPORT_PROFILE',
      payload: {
        profileId: selectedProfileId,
        format,
      },
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cf-export-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="cf-export-modal-title" style={{ margin: 0, fontSize: 14, color: 'var(--cf-title-fg)' }}>
            Export Theme or Profile
          </h3>
          <button className="btn btn-outline btn-sm" onClick={onClose} aria-label="Close export dialog">
            <CloseIcon size={12} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!hasProfiles && (
            <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)', padding: '8px 10px', border: '1px solid var(--cf-border)', borderRadius: 4 }}>
              No profiles available to export yet. Create or import a profile first.
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--cf-title-fg)' }}>
              Select Profile:
            </label>
            <select
              value={selectedProfileId}
              disabled={!hasProfiles}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              aria-label="Profile to export"
              style={{
                width: '100%',
                background: 'var(--cf-input-bg)',
                color: 'var(--cf-input-fg)',
                border: '1px solid var(--cf-border)',
                padding: '8px 10px',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.isBuiltIn ? '(Built-in Preset)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--cf-title-fg)' }}>
              Export Format:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: 'var(--cf-title-fg)' }}>
                <input
                  type="radio"
                  name="exportFormat"
                  value="theme-json"
                  checked={format === 'theme-json'}
                  onChange={() => setFormat('theme-json')}
                />
                <div>
                  <strong>Standalone VS Code Color Theme (JSON)</strong>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
                    Standard $schema color-theme JSON file compatible with any VS Code theme loader.
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: 'var(--cf-title-fg)' }}>
                <input
                  type="radio"
                  name="exportFormat"
                  value="chromaforge-profile"
                  checked={format === 'chromaforge-profile'}
                  onChange={() => setFormat('chromaforge-profile')}
                />
                <div>
                  <strong>ChromaForge Profile Backup (JSON)</strong>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
                    Complete portable profile including workbench colors, syntax rules, and metadata.
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: 'var(--cf-title-fg)' }}>
                <input
                  type="radio"
                  name="exportFormat"
                  value="extension-scaffold"
                  checked={format === 'extension-scaffold'}
                  onChange={() => setFormat('extension-scaffold')}
                />
                <div>
                  <strong>Full Installable Extension Scaffold</strong>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
                    Generates package.json, themes directory, and instructions ready for vsce package.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleExport} disabled={!canExport}>
            <ExportIcon size={14} />
            <span>Export Theme</span>
          </button>
        </div>
      </div>
    </div>
  );
};
