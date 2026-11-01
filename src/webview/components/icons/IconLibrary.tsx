/**
 * ColorFly: Icon Library Tab
 * Table of every icon collected from src/webview/icon-pack.
 * Row = icon file name, first column = group name, remaining columns are
 * reserved (empty) so additional icon types can be added later.
 * Now supports selecting an icon and applying it as the workbench icon theme,
 * plus per-icon Active/Deactivate toggles.
 */

import React, { useState, useMemo } from 'react';
import { ICON_CATALOG } from '../../../shared/iconCatalog';
import { useLanguage } from '../../i18n';
import { FileIcon, SearchIcon, SlidersIcon } from '../common/Icons';
import { sendToExtension } from '../../vscodeApi';

const RESERVED_COLUMN_COUNT = 3;

function getAssetBase(): string {
  const base = (window as unknown as { __CF_ASSET_BASE__?: string }).__CF_ASSET_BASE__;
  return typeof base === 'string' ? base : '';
}

export const IconLibrary: React.FC = () => {
  const { t, lang } = useLanguage();
  const assetBase = getAssetBase();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [activeIcons, setActiveIcons] = useState<Record<string, boolean>>({});
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());

  const handleSelectIcon = (path: string) => {
    setSelectedIcon(selectedIcon === path ? null : path);
  };

  const handleApplyIcon = () => {
    if (!selectedIcon) return;
    sendToExtension({
      type: 'SET_ICON_THEME',
      payload: { iconTheme: selectedIcon },
    });
  };

  const handleToggleActive = (path: string) => {
    setActiveIcons((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleSelectThis = (path: string) => {
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const handleSelectAll = () => {
    const allPaths = ICON_CATALOG.map((e) => e.path);
    if (bulkSelected.size === allPaths.length) {
      setBulkSelected(new Set());
    } else {
      setBulkSelected(new Set(allPaths));
    }
  };

  const handleSelectNone = () => {
    setBulkSelected(new Set());
  };

  const handleActivateSelected = () => {
    setActiveIcons((prev) => {
      const next = { ...prev };
      for (const path of bulkSelected) {
        next[path] = true;
      }
      return next;
    });
    setBulkSelected(new Set());
  };

  const handleDeactivateSelected = () => {
    setActiveIcons((prev) => {
      const next = { ...prev };
      for (const path of bulkSelected) {
        next[path] = false;
      }
      return next;
    });
    setBulkSelected(new Set());
  };

  const activeCount = Object.values(activeIcons).filter(Boolean).length;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <FileIcon size={18} style={{ color: 'var(--cf-accent)' }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
            {t('icons.heading')}
          </h2>
          <span className="badge">{ICON_CATALOG.length}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--cf-desc-fg)' }}>
          {t('icons.subheading')}
        </p>
      </div>

      {/* Select All / None bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 6,
          padding: '8px 16px',
          borderBottom: '1px solid var(--cf-border)',
        }}
      >
        <button
          onClick={handleSelectAll}
          className="btn btn-outline btn-sm"
          style={{
            padding: '4px 10px',
            fontSize: 11,
            borderColor: 'var(--cf-accent)',
            color: 'var(--cf-accent)',
          }}
        >
          {t('icons.activateAll')}
        </button>
        <button
          onClick={handleSelectNone}
          className="btn btn-outline btn-sm"
          style={{
            padding: '4px 10px',
            fontSize: 11,
            borderColor: 'var(--cf-border)',
            color: 'var(--cf-title-fg)',
          }}
        >
          {t('icons.deactivateAll')}
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="icon-table">
          <thead>
            <tr>
              <th scope="col">{t('icons.colName')}</th>
              <th scope="col">{t('icons.colGroup')}</th>
              <th scope="col" style={{ width: 120 }}>{t('icons.colAction')}</th>
              <th scope="col" style={{ width: 100 }}>{t('icons.active')}</th>
              {Array.from({ length: RESERVED_COLUMN_COUNT }).map((_, index) => (
                <th key={index} scope="col" aria-label={`Reserved column ${index + 2}`} />
              ))}
            </tr>
          </thead>
          <tbody>
            {ICON_CATALOG.map((entry) => {
              const isSelected = selectedIcon === entry.path;
              const isActive = activeIcons[entry.path] !== false;
              const isBulkSelected = bulkSelected.has(entry.path);
              return (
                <tr
                  key={entry.path}
                  onClick={() => handleSelectIcon(entry.path)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'inherit',
                    borderLeft: isSelected ? '3px solid var(--cf-accent)' : 'none',
                  }}
                >
                  <td>
                    <span className="icon-table-preview">
                      <img
                        src={`${assetBase}icons/${entry.path}`}
                        alt=""
                        width={18}
                        height={18}
                        loading="lazy"
                      />
                    </span>
                    <span className="icon-table-name">{entry.fileName}</span>
                    {entry.path !== entry.fileName && (
                      <span className="icon-table-path">{entry.path}</span>
                    )}
                  </td>
                  <td>{entry.group}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectIcon(entry.path);
                      }}
                      style={{
                        padding: '2px 6px',
                        fontSize: 10,
                        borderColor: isSelected ? 'var(--cf-accent)' : 'var(--cf-border)',
                        color: isSelected ? 'var(--cf-accent)' : 'var(--cf-title-fg)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      }}
                    >
                      {isSelected ? t('icons.selected') : t('icons.select')}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(entry.path);
                      }}
                      title={isActive ? 'Deactivate this icon' : 'Activate this icon'}
                      style={{
                        padding: '4px 8px',
                        fontSize: 10,
                        fontWeight: 600,
                        borderRadius: 4,
                        borderColor: isActive ? 'var(--cf-accent)' : 'var(--cf-border)',
                        color: isActive ? 'var(--cf-accent)' : 'var(--cf-title-fg)',
                        background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        minWidth: 55,
                        textAlign: 'center',
                      }}
                    >
                      {isActive ? t('icons.active') : t('icons.deactivate')}
                    </button>
                  </td>
                  {Array.from({ length: RESERVED_COLUMN_COUNT }).map((_, index) => (
                    <td key={index} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk Action Bar */}
      {bulkSelected.size > 0 && (
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid var(--cf-accent)',
            borderRadius: 8,
            marginTop: 12,
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>
            {bulkSelected.size} selected
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleActivateSelected}
            style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--cf-accent)', color: 'var(--cf-accent)' }}
          >
            Activate All
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleDeactivateSelected}
            style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--cf-border)', color: 'var(--cf-title-fg)' }}
          >
            Deactivate All
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setBulkSelected(new Set())}
            style={{ padding: '4px 10px', fontSize: 11, marginLeft: 'auto' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Apply Bar */}
      {selectedIcon && (
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid var(--cf-accent)',
            borderRadius: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cf-title-fg)' }}>
              {t('icons.applyTitle')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              {t('icons.applyDesc', { icon: selectedIcon })}
            </div>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleApplyIcon}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              borderColor: 'var(--cf-accent)',
              color: 'var(--cf-accent)',
            }}
          >
            {t('icons.applyButton')}
          </button>
        </div>
      )}

      {/* Active Icons Summary */}
      {activeCount > 0 && (
        <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', padding: '0 16px' }}>
          {activeCount} icon{activeCount !== 1 ? 's' : ''} active
        </div>
      )}
    </div>
  );
};
