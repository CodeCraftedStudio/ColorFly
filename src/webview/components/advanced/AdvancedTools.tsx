/**
 * ChromaForge: Advanced Tools Studio
 * Raw JSON editor with live validation, custom arbitrary property injector, and extension scaffold exporter.
 */

import React, { useState, useEffect } from 'react';
import { sendToExtension } from '../../vscodeApi';
import { isValidColor, normalizeColor } from '../../../shared/colorUtils';
import { PlusIcon, ExportIcon, CopyIcon, CheckIcon } from '../common/Icons';

interface AdvancedToolsProps {
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  activeThemeName: string;
  onOpenExportModal: () => void;
}

export const AdvancedTools: React.FC<AdvancedToolsProps> = ({
  effectiveColors = {},
  stagedColors = {},
  activeThemeName = 'Default Dark+',
  onOpenExportModal,
}) => {
  const merged = { ...(effectiveColors || {}), ...(stagedColors || {}) };
  const [jsonText, setJsonText] = useState(() => JSON.stringify(merged, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonDirty, setJsonDirty] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('#007acc');
  const [injectError, setInjectError] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (jsonDirty) return;
    setJsonText(JSON.stringify(merged, null, 2));
  }, [effectiveColors, stagedColors, jsonDirty]);

  const handleCopyJson = () => {
    navigator.clipboard?.writeText(jsonText);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1400);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonText(val);
    setJsonDirty(true);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON syntax');
    }
  };

  const handleResetJson = () => {
    setJsonText(JSON.stringify(merged, null, 2));
    setJsonDirty(false);
    setJsonError(null);
  };

  const handleApplyRawJson = () => {
    if (jsonError) return;
    try {
      const parsed = JSON.parse(jsonText);
      sendToExtension({
        type: 'RAW_CONFIG_APPLY',
        payload: { json: JSON.stringify(parsed), themeScoped: true },
      });
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonDirty(false);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const handleInjectCustomKey = () => {
    if (!customKey.trim()) return;
    if (!isValidColor(customValue)) {
      setInjectError('Please enter a valid color value (hex, rgba, or hsl).');
      return;
    }
    setInjectError(null);
    const normalized = normalizeColor(customValue) || customValue;
    sendToExtension({
      type: 'STAGE_COLOR_CHANGE',
      payload: { id: customKey.trim(), value: normalized },
    });
    setCustomKey('');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Custom Property Injector */}
      <div className="card">
        <h3 style={{ margin: '0 0 6px 0', fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Custom Property Injector</h3>
        <p style={{ margin: '0 0 14px 0', fontSize: 12, color: 'var(--cf-desc-fg)' }}>
          Target experimental, extension-contributed, or unlisted VS Code color IDs directly.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--cf-desc-fg)', display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Color Property ID (e.g. extension.customBadge.background)
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
              placeholder="editor.wordHighlightStrongBackground"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'var(--cf-desc-fg)', display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Color Value (HEX / RGBA / HSL)
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleInjectCustomKey}>
            <PlusIcon size={12} />
            <span>Inject Property</span>
          </button>
        </div>

        {injectError && (
          <div
            style={{
              marginTop: 10,
              padding: '8px 12px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #ef4444',
              borderRadius: 4,
              color: '#dc2626',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {injectError}
          </div>
        )}
      </div>

      {/* 2. Raw JSON Config Editor */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Raw Configuration View (workbench.colorCustomizations)</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--cf-desc-fg)' }}>
              Target scope: [{activeThemeName}]. Live validation active.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleCopyJson}
              title="Copy JSON to clipboard"
            >
              {copiedJson ? <CheckIcon size={12} style={{ color: '#16a34a' }} /> : <CopyIcon size={12} />}
              <span>{copiedJson ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleFormatJson}
              title="Format JSON"
            >
              Format
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleResetJson}
              title="Discard local edits and reload live configuration"
            >
              Reset
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={!!jsonError}
              onClick={handleApplyRawJson}
            >
              Apply JSON to VS Code
            </button>
          </div>
        </div>

        {jsonError && (
          <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', borderRadius: 4, color: '#dc2626', fontSize: 12, marginBottom: 10, fontWeight: 500 }}>
            JSON Syntax Error: {jsonError}
          </div>
        )}

        <textarea
          style={{
            width: '100%',
            height: 280,
            background: 'var(--cf-input-bg)',
            color: 'var(--cf-input-fg)',
            border: `1px solid ${jsonError ? '#ef4444' : 'var(--cf-border)'}`,
            borderRadius: 6,
            padding: 12,
            fontFamily: 'var(--cf-font-mono)',
            fontSize: 12,
            lineHeight: 1.5,
            outline: 'none',
          }}
          value={jsonText}
          onChange={handleJsonChange}
        />
      </div>

      {/* 3. Theme Extension Scaffold Generator */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Generate Standalone VS Code Theme Extension</h3>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--cf-desc-fg)' }}>
            Scaffold a complete installable extension folder with package.json, themes directory, and packaging instructions.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={onOpenExportModal}>
          <ExportIcon size={14} />
          <span>Scaffold Extension...</span>
        </button>
      </div>
    </div>
  );
};
