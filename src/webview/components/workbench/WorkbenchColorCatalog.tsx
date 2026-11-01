/**
 * ColorFly: Workbench Colors Component Catalog
 * Main orchestrator: search, filters, category navigation, bulk actions.
 * Each of the 162 color settings has its own dedicated component file
 * (in src/webview/components/workbench/*.tsx) registered in colorComponentRegistry.ts.
 * Per-feature row rendering is delegated to WorkbenchColorRow.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  OFFICIAL_WORKBENCH_COLORS,
  WORKBENCH_CATEGORIES,
} from '../../../shared/officialWorkbenchColors';
import { WorkbenchCategory } from '../../../shared/types';
import { adjustLightness, invertColor } from '../../../shared/colorUtils';
import { ColorInput } from '../common/ColorInput';
import { sendToExtension } from '../../vscodeApi';
import { SearchIcon, CloseIcon } from '../common/Icons';
import { ConfirmDialog } from '../common/Dialog';
import { useLanguage } from '../../i18n';
import { useToast } from '../common/Toast';
import { WorkbenchColorRow } from './WorkbenchColorRow';
import { COLOR_COMPONENTS, type ColorComponentMap } from './colorComponentRegistry';
import { CATEGORY_FEATURE_MAP } from './workbenchColorTypes';

interface WorkbenchColorCatalogProps {
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  initialCategory?: WorkbenchCategory | 'all';
}

export const WorkbenchColorCatalog: React.FC<WorkbenchColorCatalogProps> = ({
  effectiveColors = {},
  stagedColors = {},
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WorkbenchCategory | 'all'>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customized' | 'unmodified'>('all');
  const [resetCategoryTarget, setResetCategoryTarget] = useState<WorkbenchCategory | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [activeColors, setActiveColors] = useState<Record<string, boolean>>({});
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const { t, lang } = useLanguage();
  const { success } = useToast();

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const color of OFFICIAL_WORKBENCH_COLORS) {
      counts[color.category] = (counts[color.category] || 0) + 1;
    }
    return counts;
  }, []);

  const mergedColors = useMemo(() => ({
    ...(effectiveColors || {}),
    ...(stagedColors || {}),
  }), [effectiveColors, stagedColors]);

  const filteredColors = useMemo(() => {
    return OFFICIAL_WORKBENCH_COLORS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      const isCustomized = mergedColors[item.id] !== undefined;
      if (filterType === 'customized' && !isCustomized) return false;
      if (filterType === 'unmodified' && isCustomized) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const catMeta = CATEGORY_FEATURE_MAP[item.category];
        const matchesCategory = catMeta ? (catMeta.label.toLowerCase().includes(query) || catMeta.location.toLowerCase().includes(query)) : false;
        return matchesName || matchesId || matchesDesc || matchesCategory;
      }
      return true;
    });
  }, [selectedCategory, filterType, searchQuery, mergedColors]);

  /* Individual color handlers */
  const handleColorChange = (id: string, value: string) => {
    sendToExtension({
      type: 'STAGE_COLOR_CHANGE',
      payload: { id, value },
    });
  };

  const handleResetProperty = (id: string) => {
    sendToExtension({
      type: 'RESET_COLOR',
      payload: { id },
    });
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setActiveColors((prev) => ({ ...prev, [id]: active }));
    if (active) {
      const cur = mergedColors[id];
      if (cur) {
        sendToExtension({
          type: 'STAGE_COLOR_CHANGE',
          payload: { id, value: cur },
        });
      }
    } else {
      sendToExtension({
        type: 'RESET_COLOR',
        payload: { id },
      });
    }
  };

  /* Bulk selection */
  const handleSelectThis = (id: string) => {
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = filteredColors.map((c) => c.id);
    if (bulkSelected.size === allIds.length) {
      setBulkSelected(new Set());
    } else {
      setBulkSelected(new Set(allIds));
    }
  };

  const handleSelectNone = () => {
    setBulkSelected(new Set());
  };

  const handleBulkReset = () => {
    for (const id of bulkSelected) {
      sendToExtension({ type: 'RESET_COLOR', payload: { id } });
    }
    setBulkSelected(new Set());
    success?.('Bulk reset completed');
  };

  const handleBulkActivate = () => {
    for (const id of bulkSelected) {
      setActiveColors((prev) => ({ ...prev, [id]: true }));
      const cur = mergedColors[id];
      if (cur) {
        sendToExtension({ type: 'STAGE_COLOR_CHANGE', payload: { id, value: cur } });
      }
    }
    setBulkSelected(new Set());
    success?.('Bulk activate completed');
  };

  const handleBulkDeactivate = () => {
    for (const id of bulkSelected) {
      setActiveColors((prev) => ({ ...prev, [id]: false }));
      sendToExtension({ type: 'RESET_COLOR', payload: { id } });
    }
    setBulkSelected(new Set());
    success?.('Bulk deactivate completed');
  };

  const handleResetCategory = (category: WorkbenchCategory) => {
    setResetCategoryTarget(category);
  };

  const handleBulkAdjustLightness = (category: WorkbenchCategory, delta: number) => {
    const categoryColors = OFFICIAL_WORKBENCH_COLORS.filter((c) => c.category === category);
    const batch: Record<string, string> = {};
    categoryColors.forEach((colorDef) => {
      const cur = mergedColors[colorDef.id] || colorDef.defaultValue || '#1e1e1e';
      batch[colorDef.id] = adjustLightness(cur, delta);
    });
    sendToExtension({ type: 'STAGE_COLOR_BATCH', payload: { colors: batch } });
  };

  const handleBulkInvert = (category: WorkbenchCategory) => {
    const categoryColors = OFFICIAL_WORKBENCH_COLORS.filter((c) => c.category === category);
    const batch: Record<string, string> = {};
    categoryColors.forEach((colorDef) => {
      const cur = mergedColors[colorDef.id] || colorDef.defaultValue || '#1e1e1e';
      batch[colorDef.id] = invertColor(cur);
    });
    sendToExtension({ type: 'STAGE_COLOR_BATCH', payload: { colors: batch } });
  };

  const handleCopyCategoryJson = (category: WorkbenchCategory) => {
    const categoryColors = OFFICIAL_WORKBENCH_COLORS.filter((c) => c.category === category);
    const result: Record<string, string> = {};
    categoryColors.forEach((c) => {
      result[c.id] = mergedColors[c.id] || c.defaultValue || '#1e1e1e';
    });
    navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
    setCopyStatus(t('wcat.copyStatus', { n: categoryColors.length }));
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const activeCategoryMeta = selectedCategory !== 'all' ? CATEGORY_FEATURE_MAP[selectedCategory] : null;

  // Group filtered colors by category for per-category rendering
  const colorsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredColors> = {};
    for (const color of filteredColors) {
      if (!grouped[color.category]) grouped[color.category] = [];
      grouped[color.category].push(color);
    }
    return grouped;
  }, [filteredColors]);

  // Props shared with every color component
  const colorProps = {
    mergedColors,
    stagedColors,
    activeColors,
    bulkSelected,
    onSelectThis: handleSelectThis,
    onSelectAll: handleSelectAll,
    onSelectNone: handleSelectNone,
    onColorChange: handleColorChange,
    onReset: handleResetProperty,
    onToggleActive: handleToggleActive,
    t,
    lang,
    success,
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: 18, borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 8 }}
              placeholder={t('wcat.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={{ position: 'absolute', left: 12, top: 11, color: 'var(--cf-desc-fg)', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={16} />
            </span>
            {searchQuery && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 8, top: 7, padding: '3px 8px', borderRadius: 4 }}
                title="Clear search"
              >
                <CloseIcon size={12} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--cf-desc-fg)', fontWeight: 600 }}>{t('wcat.filterLabel')}</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              style={{
                background: 'var(--cf-input-bg)',
                color: 'var(--cf-input-fg)',
                border: '1px solid var(--cf-border)',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <option value="all">{t('wcat.filterAll', { n: OFFICIAL_WORKBENCH_COLORS.length })}</option>
              <option value="customized">{t('wcat.filterCustomized')}</option>
              <option value="unmodified">{t('wcat.filterUnmodified')}</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--cf-border)' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('all')}
            style={{ borderRadius: 6, fontWeight: 600 }}
          >
            {t('wcat.allCategories', { n: OFFICIAL_WORKBENCH_COLORS.length })}
          </button>
          {WORKBENCH_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ borderRadius: 6, fontWeight: isSelected ? 700 : 500 }}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>
          {selectedCategory !== 'all'
            ? t('wcat.showingIn', {
                n: filteredColors.length,
                cat: WORKBENCH_CATEGORIES.find((c) => c.id === selectedCategory)?.label || '',
              })
            : t('wcat.showing', { n: filteredColors.length })}
          {copyStatus && (
            <span style={{ color: '#16a34a', marginLeft: 10, fontWeight: 600 }}>✓ {copyStatus}</span>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
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
              Select All
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
              Select None
            </button>
          </div>
        </div>
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
            {bulkSelected.size} {t('wcat.selectedCount')}
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleBulkActivate}
            style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--cf-accent)', color: 'var(--cf-accent)' }}
          >
            {t('wcat.bulkActivate')}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleBulkDeactivate}
            style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--cf-border)', color: 'var(--cf-title-fg)' }}
          >
            {t('wcat.bulkDeactivate')}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleBulkReset}
            style={{ padding: '4px 10px', fontSize: 11, color: '#ef4444', borderColor: '#ef4444' }}
          >
            {t('wcat.bulkReset')}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setBulkSelected(new Set())}
            style={{ padding: '4px 10px', fontSize: 11, marginLeft: 'auto' }}
          >
            {t('wcat.clearSelection')}
          </button>
        </div>
      )}

      {/* Detailed Color Items List - each color uses its own dedicated component */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
        {filteredColors.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--cf-desc-fg)' }}>
            {t('wcat.noResults')}
          </div>
        ) : selectedCategory !== 'all' ? (
          // Single category view: render each color with its dedicated component
          colorsByCategory[selectedCategory]?.map((colorDef) => {
            const ColorComponent = COLOR_COMPONENTS[colorDef.id] || WorkbenchColorRow;
            return (
              <ColorComponent
                key={colorDef.id}
                {...colorProps}
                catMeta={CATEGORY_FEATURE_MAP[colorDef.category]}
              />
            );
          })
        ) : (
          // "All" view: render each color with its dedicated component
          filteredColors.map((colorDef) => {
            const ColorComponent = COLOR_COMPONENTS[colorDef.id] || WorkbenchColorRow;
            return (
              <ColorComponent
                key={colorDef.id}
                {...colorProps}
                catMeta={CATEGORY_FEATURE_MAP[colorDef.category]}
              />
            );
          })
        )}
      </div>

      {resetCategoryTarget && (
        <ConfirmDialog
          title={t('wcat.resetTitle')}
          message={t('wcat.resetMessage', {
            cat: WORKBENCH_CATEGORIES.find((c) => c.id === resetCategoryTarget)?.label || resetCategoryTarget,
          })}
          confirmLabel={t('wcat.resetConfirm')}
          danger
          onConfirm={() => {
            sendToExtension({
              type: 'RESET_CATEGORY',
              payload: { category: resetCategoryTarget },
            });
            setResetCategoryTarget(null);
          }}
          onCancel={() => setResetCategoryTarget(null)}
        />
      )}
    </div>
  );
};
