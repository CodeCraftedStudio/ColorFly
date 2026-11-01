/**
 * ColorFly: Import VS Code Color Theme Modal
 * Allows users to paste a standard VS Code color-theme JSON and import it into ColorFly.
 */

import React, { useState } from 'react';
import { ThemeProfile } from '../../../shared/types';
import { isValidColor } from '../../../shared/colorUtils';
import { sendToExtension } from '../../vscodeApi';
import { CloseIcon, ImportIcon } from './Icons';
import { useLanguage } from '../../i18n';

interface ImportModalProps {
  onClose: () => void;
  onImportComplete?: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  onClose,
  onImportComplete,
}) => {
  const { t } = useLanguage();
  const [jsonText, setJsonText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    if (!jsonText.trim()) {
      setError('Please paste JSON content first.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);

      if (!parsed || typeof parsed !== 'object') {
        setError(t('import.importError'));
        return;
      }

      // Handle standard VS Code color-theme JSON format
      const workbenchColors: Record<string, string> = {};
      const colors = parsed.colors || parsed.workbenchColors || {};

      if (typeof colors === 'object' && colors !== null) {
        for (const [key, val] of Object.entries(colors)) {
          if (typeof val === 'string' && isValidColor(val)) {
            workbenchColors[key] = val;
          }
        }
      }

      if (Object.keys(workbenchColors).length === 0) {
        setError(t('import.noValidTheme'));
        return;
      }

      const importedProfile: ThemeProfile = {
        id: `profile-imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        version: 1,
        name: typeof parsed.name === 'string' && parsed.name.trim()
          ? parsed.name
          : 'Imported VS Code Theme',
        description: 'Imported from VS Code color theme JSON',
        author: 'ColorFly Studio',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isBuiltIn: false,
        workbenchColors,
        tokenColors: Array.isArray(parsed.tokenColors)
          ? { textMateRules: parsed.tokenColors.filter((rule: any) => rule && typeof rule === 'object') }
          : {},
      };

      setIsImporting(true);

      sendToExtension({
        type: 'IMPORT_PROFILE',
        payload: { rawJson: JSON.stringify(importedProfile) },
      });

      setError(null);
      setJsonText('');
      onImportComplete?.();
      setIsImporting(false);
      onClose();
    } catch {
      setError(t('import.importError'));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cf-import-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="cf-import-modal-title" style={{ margin: 0, fontSize: 14, color: 'var(--cf-title-fg)' }}>
            {t('import.title')}
          </h3>
          <button className="btn btn-outline btn-sm" onClick={onClose} aria-label="Close import dialog">
            <CloseIcon size={12} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--cf-title-fg)' }}>
              {t('import.importFromJson')}
            </label>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginBottom: 8 }}>
              {t('import.importDesc')}
            </div>
            <textarea
              style={{
                width: '100%',
                height: 200,
                background: 'var(--cf-input-bg)',
                color: 'var(--cf-input-fg)',
                border: '1px solid var(--cf-border)',
                borderRadius: 4,
                padding: 10,
                fontFamily: 'var(--cf-font-mono)',
                fontSize: 12,
                resize: 'vertical',
              }}
              placeholder='{ "name": "My Theme", "colors": { "editor.background": "#1e1e1e", "editor.foreground": "#d4d4d4" } }'
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: 11, padding: '6px 8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 4, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={isImporting || !jsonText.trim()}
          >
            {isImporting ? 'Importing...' : <><ImportIcon size={13} style={{ marginRight: 6 }} /> {t('import.importButton')}</>}
          </button>
        </div>
      </div>
    </div>
  );
};
