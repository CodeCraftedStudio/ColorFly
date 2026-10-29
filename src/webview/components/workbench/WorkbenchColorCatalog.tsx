/**
 * ColorFly: Workbench Colors Component Catalog
 * Ultra-detailed, categorical browsing with feature impact explanations,
 * location tags, global search, and bulk operations.
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
import { SearchIcon, CloseIcon, CopyIcon, SparklesIcon, RefreshIcon, SlidersIcon } from '../common/Icons';
import { ConfirmDialog } from '../common/Dialog';

interface WorkbenchColorCatalogProps {
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  initialCategory?: WorkbenchCategory | 'all';
}

const CATEGORY_FEATURE_MAP: Record<string, { label: string; location: string; impactBangla: string; icon: string }> = {
  activityBar: {
    label: 'Navigation Activity Bar',
    location: 'Left Vertical Column',
    impactBangla: 'একেবারে বাম পাশের খাড়া আইকন বার, যা দিয়ে ফাইল এক্সপ্লোরার, সার্চ ও গিট খোলা হয়।',
    icon: '📍 Left Icon Bar',
  },
  sideBar: {
    label: 'Primary Sidebar',
    location: 'Left Collapsible Container',
    impactBangla: 'বাম পাশের মেইন প্যানেল যাতে ফাইল লিস্ট (Explorer), সার্চ রেজাল্ট ও গিট চেঞ্জেস থাকে।',
    icon: '📍 Primary Sidebar',
  },
  editor: {
    label: 'Code Editor Canvas',
    location: 'Main Workspace',
    impactBangla: 'প্রধান কোড লেখার ক্যানভাস, কার্সর, লাইন নম্বর, এবং কোড হাইলাইটস।',
    icon: '📍 Editor Canvas',
  },
  tabsAndTitle: {
    label: 'Tabs & Title Bar',
    location: 'Top Window & Headers',
    impactBangla: 'উইন্ডোর সবচেয়ে উপরের হেডার বার এবং ওপেন থাকা ফাইলের ট্যাবসমূহ।',
    icon: '📍 Window Header & Tabs',
  },
  statusBar: {
    label: 'Status Bar',
    location: 'Bottom Horizontal Strip',
    impactBangla: 'একেবারে নিচের রঙিন বার যাতে গিট ব্রাঞ্চ নাম, এরর কাউন্ট, ও স্ট্যাটাস থাকে।',
    icon: '📍 Bottom Status Line',
  },
  panel: {
    label: 'Panel Surface',
    location: 'Bottom / Side Container',
    impactBangla: 'আউটপুট, প্রবলেমস এবং টার্মিনাল ধারণকারী নিচের বড় প্যানেলটি।',
    icon: '📍 Bottom Panel',
  },
  terminal: {
    label: 'Integrated Terminal',
    location: 'Console Surface & Colors',
    impactBangla: 'ইন্টিগ্রেটেড টার্মিনাল কনসোল যেখানে npm, git কমান্ড ইত্যাদি রান করা হয়।',
    icon: '📍 Embedded CLI Shell',
  },
  buttonsAndInputs: {
    label: 'Buttons & Inputs',
    location: 'UI Controls',
    impactBangla: 'ফর্মের বাটন, টেক্সট ইনপুট বক্স, ড্রপডাউন এবং চেককন্ট্রোল।',
    icon: '📍 UI Controls & Forms',
  },
  listsAndTrees: {
    label: 'Lists, Trees & Menus',
    location: 'Tree Items & Popups',
    impactBangla: 'ফাইল ট্রির রো, মেনু এবং কমান্ড প্যালেটের লিস্ট আইটেম।',
    icon: '📍 Lists & Context Menus',
  },
  searchAndDebug: {
    label: 'Search, Git & Debug',
    location: 'Tool Highlights',
    impactBangla: 'সার্চ ম্যাচ হাইলাইটস, গিট চেঞ্জ মার্কার এবং ডিবাগ টুলবার।',
    icon: '📍 Search & Debugging',
  },
  notifications: {
    label: 'Notifications & Popups',
    location: 'Alert Toasts',
    impactBangla: 'নোটিফিকেশন পপআপ এবং টোস্ট অ্যালার্ট ম্যাসেজ।',
    icon: '📍 Popups & Notifications',
  },
  other: {
    label: 'Other Components',
    location: 'System Elements',
    impactBangla: 'স্ক্রলবার, ব্রেডক্রাম্বস এবং প্রগ্রেস বার।',
    icon: '📍 System Elements',
  },
};

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
        const catMeta = CATEGORY_FEATURE_MAP[item.category];
        const matchesCategory = catMeta ? (catMeta.label.toLowerCase().includes(query) || catMeta.location.toLowerCase().includes(query)) : false;
        return matchesName || matchesId || matchesDesc || matchesCategory;
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
    setCopyStatus(`Copied JSON for ${categoryColors.length} properties to clipboard.`);
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const activeCategoryMeta = selectedCategory !== 'all' ? CATEGORY_FEATURE_MAP[selectedCategory] : null;

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: 18, borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 8 }}
              placeholder="Search by setting name, ID, or feature (e.g., editor, sidebar, left bar, tabs, cursor)..."
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
            <span style={{ fontSize: 12, color: 'var(--cf-desc-fg)', fontWeight: 600 }}>Filter:</span>
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
              <option value="all">All Settings ({OFFICIAL_WORKBENCH_COLORS.length})</option>
              <option value="customized">Customized Only</option>
              <option value="unmodified">Unmodified Only</option>
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
            All Categories ({OFFICIAL_WORKBENCH_COLORS.length})
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

      {/* Feature Guide Banner (Shown when a specific category is selected) */}
      {activeCategoryMeta && (
        <div
          className="card"
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cf-accent)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {activeCategoryMeta.icon}
              </span>
              <span style={{ fontSize: 12, color: 'var(--cf-title-fg)', fontWeight: 600 }}>
                {activeCategoryMeta.label} ({activeCategoryMeta.location})
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
              💡 <strong>কী পরিবর্তন করে:</strong> {activeCategoryMeta.impactBangla}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
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
        </div>
      )}

      {/* Results Header Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>
          Showing <strong style={{ color: 'var(--cf-title-fg)' }}>{filteredColors.length}</strong> color settings
          {selectedCategory !== 'all' && <span> in <strong style={{ color: 'var(--cf-title-fg)' }}>{WORKBENCH_CATEGORIES.find((c) => c.id === selectedCategory)?.label}</strong></span>}
          {copyStatus && (
            <span style={{ color: '#16a34a', marginLeft: 10, fontWeight: 600 }}>✓ {copyStatus}</span>
          )}
        </div>
      </div>

      {/* Detailed Color Items List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
        {filteredColors.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--cf-desc-fg)' }}>
            No color properties found matching your filter criteria.
          </div>
        ) : (
          filteredColors.map((colorDef) => {
            const currentColor = mergedColors[colorDef.id] || colorDef.defaultValue || '#1e1e1e';
            const isCustomized = mergedColors[colorDef.id] !== undefined;
            const isStaged = stagedColors[colorDef.id] !== undefined;
            const catMeta = CATEGORY_FEATURE_MAP[colorDef.category];

            return (
              <div
                key={colorDef.id}
                className="color-row"
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--cf-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
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

                    {isStaged && <span className="badge badge-warning" style={{ fontSize: 9 }}>Draft (Staged)</span>}
                    {isCustomized && !isStaged && <span className="badge badge-success" style={{ fontSize: 9 }}>Active Override</span>}
                  </div>

                  <div style={{ fontFamily: 'var(--cf-font-mono)', fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                    {colorDef.id}
                  </div>

                  {/* Impact detail */}
                  <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 3, lineHeight: 1.4 }}>
                    {colorDef.description}
                  </div>
                </div>

                <div className="color-controls" style={{ flexShrink: 0 }}>
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

      {resetCategoryTarget && (
        <ConfirmDialog
          title="Reset Category Colors"
          message={`Reset all customizations in "${WORKBENCH_CATEGORIES.find((c) => c.id === resetCategoryTarget)?.label || resetCategoryTarget}"? Applied colors in this category will be reverted to theme defaults and drafts removed.`}
          confirmLabel="Reset Category"
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
