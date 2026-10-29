/**
 * ColorFly: Icon Library Tab
 * Table of every icon collected from src/webview/icon-pack.
 * Row = icon file name, first column = group name, remaining columns are
 * reserved (empty) so additional icon types can be added later.
 * Now supports selecting an icon and applying it as the workbench icon theme.
 */

import React, { useState } from 'react';
import { ICON_CATALOG } from '../../../shared/iconCatalog';
import { useLanguage } from '../../i18n';
import { FileIcon } from '../common/Icons';
import { sendToExtension } from '../../vscodeApi';

const RESERVED_COLUMN_COUNT = 3;

function getAssetBase(): string {
  const base = (window as unknown as { __CF_ASSET_BASE__?: string }).__CF_ASSET_BASE__;
  return typeof base === 'string' ? base : '';
}

export const IconLibrary: React.FC = () => {
  const { t } = useLanguage();
  const assetBase = getAssetBase();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

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

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="icon-table">
          <thead>
            <tr>
              <th scope="col">{t('icons.colName')}</th>
              <th scope="col">{t('icons.colGroup')}</th>
              <th scope="col" style={{ width: 60 }}>{t('icons.colAction')}</th>
              {Array.from({ length: RESERVED_COLUMN_COUNT }).map((_, index) => (
                <th key={index} scope="col" aria-label={`Reserved column ${index + 2}`} />
              ))}
            </tr>
          </thead>
          <tbody>
            {ICON_CATALOG.map((entry) => {
              const isSelected = selectedIcon === entry.path;
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
                  {Array.from({ length: RESERVED_COLUMN_COUNT }).map((_, index) => (
                    <td key={index} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};
