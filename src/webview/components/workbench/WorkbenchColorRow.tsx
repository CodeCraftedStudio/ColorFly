/**
 * ColorFly: Workbench Color Row Component
 * Single color row for one workbench feature. Each feature has its own
 * Active/Deactivate toggle + ColorInput, making per-feature bug fixes easy.
 */

import React, { useState } from 'react';
import { ColorDefinition } from '../../../shared/types';
import { CategoryFeatureMeta } from './workbenchColorTypes';
import { ColorInput } from '../common/ColorInput';
import { analyzeContrast } from '../../../shared/colorUtils';
import { MoreIcon } from '../common/Icons';
import { GuiLanguage } from '../../i18n';

export interface WorkbenchColorRowProps {
  colorDef: ColorDefinition;
  currentColor: string;
  isCustomized: boolean;
  isStaged: boolean;
  isActive: boolean;
  isBulkSelected: boolean;
  catMeta: CategoryFeatureMeta | undefined;
  onSelectThis: (id: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onColorChange: (id: string, val: string) => void;
  onReset: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  t: (key: string, opts?: Record<string, string | number>) => string;
  lang: GuiLanguage;
}

/** Contrast ratio badge for a color row (fg vs editor background) */
const getContrastBadge = (bgColor: string) => {
  const fg = '#ffffff';
  const analysis = analyzeContrast(fg, bgColor);
  if (!analysis) return null;
  return {
    ratio: analysis.ratio.toFixed(2),
    level: analysis.status,
    passed: analysis.aaNormal,
  };
};

export const WorkbenchColorRow: React.FC<WorkbenchColorRowProps> = ({
  colorDef,
  currentColor,
  isCustomized,
  isStaged,
  isActive,
  isBulkSelected,
  catMeta,
  onSelectThis,
  onSelectAll,
  onSelectNone,
  onColorChange,
  onReset,
  onToggleActive,
  t,
  lang,
}) => {
  const contrast = getContrastBadge(currentColor);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuSelectThis = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onSelectThis(colorDef.id);
  };

  const handleMenuSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onSelectAll();
  };

  const handleMenuSelectNone = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onSelectNone();
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelectThis(colorDef.id);
  };

  return (
    <div
      className="color-row"
      style={{
        padding: '12px 18px',
        borderBottom: '1px solid var(--cf-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: isBulkSelected ? 'rgba(99, 102, 241, 0.1)' : 'inherit',
      }}
    >
      <input
        type="checkbox"
        checked={isBulkSelected}
        onChange={handleCheckboxChange}
        style={{ width: 16, height: 16, marginRight: 6 }}
      />
      <div className="color-info" style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--cf-title-fg)' }}>
            {colorDef.name}
          </span>

          {/* Feature Location Pill */}
          {catMeta && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'var(--cf-input-bg)',
                border: '1px solid var(--cf-border)',
                color: 'var(--cf-desc-fg)',
              }}
            >
              {catMeta.icon}
            </span>
          )}

          {!isActive && isCustomized && (
            <span className="badge badge-info" style={{ fontSize: 9 }}>
              {t('wcat.inactiveBadge')}
            </span>
          )}
          {isStaged && <span className="badge badge-warning" style={{ fontSize: 9 }}>{t('wcat.draftBadge')}</span>}
          {isCustomized && !isStaged && isActive && (
            <span className="badge badge-success" style={{ fontSize: 9 }}>{t('wcat.activeOverrideBadge')}</span>
          )}
          {currentColor && currentColor !== colorDef.defaultValue && contrast && (
            <span className="badge badge-info" style={{ fontSize: 8, marginLeft: 6 }}>
              {contrast.ratio}:1 {contrast.level.toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ fontFamily: 'var(--cf-font-mono)', fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
          {colorDef.id}
        </div>

        {/* Impact detail */}
        <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 3, lineHeight: 1.4 }}>
          {colorDef.description}
        </div>
      </div>

      <div className="color-controls" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Prominent Active / Deactivate toggle for every feature */}
        <button
          className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onToggleActive(colorDef.id, !isActive)}
          title={isActive ? 'Deactivate this color override' : 'Activate this color override'}
          style={{
            padding: '6px 12px',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 6,
            borderColor: isActive ? 'var(--cf-accent)' : 'var(--cf-border)',
            color: isActive ? 'var(--cf-accent)' : 'var(--cf-title-fg)',
            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            minWidth: 70,
            textAlign: 'center',
          }}
        >
          {isActive ? 'Active' : 'Deactivate'}
        </button>
        <ColorInput
          colorId={colorDef.id}
          value={currentColor}
          defaultValue={colorDef.defaultValue}
          isCustomized={isCustomized}
          isActive={isActive}
          onChange={(val) => onColorChange(colorDef.id, val)}
          onReset={() => onReset(colorDef.id)}
          onToggleActive={(active) => onToggleActive(colorDef.id, active)}
        />

        {/* 3-dot overflow menu with Select options */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleMenuToggle}
            title="More options"
            style={{
              padding: '4px 8px',
              fontSize: 14,
              lineHeight: 1,
              border: '1px solid var(--cf-border)',
              borderRadius: 4,
              background: 'transparent',
              color: 'var(--cf-title-fg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoreIcon size={14} />
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: 6,
                minWidth: 140,
                background: 'var(--cf-input-bg)',
                border: '1px solid var(--cf-border)',
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                padding: '6px 0',
              }}
            >
              <div
                onClick={handleMenuSelectThis}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  color: 'var(--cf-title-fg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {isBulkSelected ? 'Deselect this' : 'Select this'}
              </div>
              <div style={{ height: 1, background: 'var(--cf-border)', margin: '4px 0' }} />
              <div
                onClick={handleMenuSelectAll}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  color: 'var(--cf-title-fg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Select All
              </div>
              <div
                onClick={handleMenuSelectNone}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  color: 'var(--cf-title-fg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Deselect All
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
