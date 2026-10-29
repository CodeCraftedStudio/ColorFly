/**
 * ChromaForge: Workbench Colors Component Catalog
 * Provides categorical browsing, global search, filtering, and dedicated color controls.
 */

import React, { useState, useMemo } from 'react';
import {
  OFFICIAL_WORKBENCH_COLORS,
  WORKBENCH_CATEGORIES,
} from '../../../shared/officialWorkbenchColors';
import { WorkbenchCategory } from '../../../shared/types';
import { adjustLightness, invertColor } from '../../../shared/colorUtils';
import { ColorInput } from '../common/ColorInput';
import { sendToExtension } from '../../vscodeApi';
import { SearchIcon, CloseIcon, CopyIcon, SparklesIcon, RefreshIcon } from '../common/Icons';

interface WorkbenchColorCatalogProps {
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
}

export const WorkbenchColorCatalog: React.FC<WorkbenchColorCatalogProps> = ({
  effectiveColors = {},
  stagedColors = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WorkbenchCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customized' | 'unmodified'>('all');

  const mergedColors = useMemo(() => ({
    ...(effectiveColors || {}),
    ...(stagedColors || {}),
  }), [effectiveColors, stagedColors]);

  const filteredColors = useMemo(() => {
    return OFFICIAL_WORKBENCH_COLORS.filter((item) => {
      // 1. Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 2. Customization filter
      const isCustomized = mergedColors[item.id] !== undefined;
      if (filterType === 'customized' && !isCustomized) return false;
      if (filterType === 'unmodified' && isCustomized) return false;

      // 3. Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        return matchesName || matchesId || matchesDesc;
      }

      return true;
    });
  }, [selectedCategory, filterType, searchQuery, mergedColors]);

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

  const handleResetCategory = (category: WorkbenchCategory) => {
    if (confirm(`Reset all customizations in "${category}"?`)) {
      sendToExtension({
        type: 'RESET_CATEGORY',
        payload: { category },
      });
    }
  };

  const handleBulkAdjustLightness = (category: WorkbenchCategory, delta: number) => {
    const categoryColors = OFFICIAL_WORKBENCH_COLORS.filter((c) => c.category === category);
    categoryColors.forEach((colorDef) => {
      const cur = mergedColors[colorDef.id] || colorDef.defaultValue || '#1e1e1e';
      const adjusted = adjustLightness(cur, delta);
      sendToExtension({
        type: 'STAGE_COLOR_CHANGE',
        payload: { id: colorDef.id, value: adjusted },
      });
    });
  };

  const handleBulkInvert = (category: WorkbenchCategory) => {
    const categoryColors = OFFICIAL_WORKBENCH_COLORS.filter((c) => c.category === category);
    categoryColors.forEach((colorDef) => {
      const cur = mergedColors[colorDef.id] || colorDef.defaultValue || '#1e1e1e';
      const inverted = invertColor(cur);
      sendToExtension({
        type: 'STAGE_COLOR_CHANGE',
        payload: { id: colorDef.id, value: inverted },
      });
    });
  };

  const handleCopyCategoryJson = (category: WorkbenchCategory) => {
    const categoryColors = OFFICIAL_WORKBENCH_COLORS.filter((c) => c.category === category);
    const result: Record<string, string> = {};
    categoryColors.forEach((c) => {
      result[c.id] = mergedColors[c.id] || c.defaultValue || '#1e1e1e';
    });
    navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
    alert(`Copied JSON for ${categoryColors.length} properties in ${category} to clipboard.`);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', paddingLeft: 34 }}
              placeholder="Search by component name (e.g. editor background) or exact ID (e.g. activityBar.background)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={{ position: 'absolute', left: 10, top: 10, color: 'var(--cf-desc-fg)', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={15} />
            </span>
            {searchQuery && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 8, top: 7, padding: '2px 6px' }}
                title="Clear search"
              >
                <CloseIcon size={12} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--cf-desc-fg)', fontWeight: 500 }}>Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              style={{
                background: 'var(--cf-input-bg)',
                color: 'var(--cf-input-fg)',
                border: '1px solid var(--cf-border)',
                padding: '6px 10px',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              <option value="all">All Properties ({OFFICIAL_WORKBENCH_COLORS.length})</option>
              <option value="customized">Customized Only</option>
              <option value="unmodified">Unmodified Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </button>
          {WORKBENCH_CATEGORIES.map((cat) => {
            const count = OFFICIAL_WORKBENCH_COLORS.filter((c) => c.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header with Bulk Operations */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>
          Showing <strong style={{ color: 'var(--cf-title-fg)' }}>{filteredColors.length}</strong> color {filteredColors.length === 1 ? 'property' : 'properties'}
          {selectedCategory !== 'all' && <span> in <strong style={{ color: 'var(--cf-title-fg)' }}>{WORKBENCH_CATEGORIES.find((c) => c.id === selectedCategory)?.label}</strong></span>}
        </div>

        {selectedCategory !== 'all' && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleBulkAdjustLightness(selectedCategory as WorkbenchCategory, 10)}
              title="Brighten all colors in this category by 10%"
            >
              Lighten +10%
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleBulkAdjustLightness(selectedCategory as WorkbenchCategory, -10)}
              title="Darken all colors in this category by 10%"
            >
              Darken -10%
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleBulkInvert(selectedCategory as WorkbenchCategory)}
              title="Invert color tones in this category"
            >
              Invert
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleCopyCategoryJson(selectedCategory as WorkbenchCategory)}
              title="Copy category colors as JSON"
            >
              <CopyIcon size={12} />
              <span>Copy JSON</span>
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleResetCategory(selectedCategory as WorkbenchCategory)}
              style={{ color: '#ef4444' }}
              title="Reset all colors in this category"
            >
              <RefreshIcon size={12} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Color Items Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredColors.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--cf-desc-fg)' }}>
            No color properties found matching your filter criteria.
          </div>
        ) : (
          filteredColors.map((colorDef) => {
            const currentColor = mergedColors[colorDef.id] || colorDef.defaultValue || '#1e1e1e';
            const isCustomized = mergedColors[colorDef.id] !== undefined;
            const isStaged = stagedColors[colorDef.id] !== undefined;

            return (
              <div key={colorDef.id} className="color-row">
                <div className="color-info">
                  <div className="color-title">
                    <span>{colorDef.name}</span>
                    {isStaged && <span className="badge badge-warning" style={{ fontSize: 9 }}>Draft</span>}
                    {isCustomized && !isStaged && <span className="badge badge-success" style={{ fontSize: 9 }}>Active</span>}
                  </div>
                  <div className="color-id">{colorDef.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                    {colorDef.description}
                  </div>
                </div>

                <div className="color-controls">
                  <ColorInput
                    colorId={colorDef.id}
                    value={currentColor}
                    defaultValue={colorDef.defaultValue}
                    isCustomized={isCustomized}
                    onChange={(val) => handleColorChange(colorDef.id, val)}
                    onReset={() => handleResetProperty(colorDef.id)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
