/**
 * ColorFly: Badge Background Component
 * Feature: badge.background
 * Single color setting component - isolated for easy bug fixes.
 */

import React from 'react';
import { ColorDefinition, WorkbenchCategory } from '../../../shared/types';
import { WorkbenchColorRow } from './WorkbenchColorRow';
import { CATEGORY_FEATURE_MAP } from './workbenchColorTypes';
import { GuiLanguage } from '../../i18n';

export interface WorkbenchColorBadgeBackgroundProps {
  mergedColors: Record<string, string>;
  stagedColors: Record<string, string>;
  activeColors: Record<string, boolean>;
  bulkSelected: Set<string>;
  onColorChange: (id: string, val: string) => void;
  onReset: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onSelectThis: (id: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  t: (key: string, opts?: Record<string, string | number>) => string;
  lang: GuiLanguage;
}

const COLOR_DEF: ColorDefinition = {
  id: 'badge.background',
  name: "Badge Background",
  description: "Badge background color for search badges and file counts.",
  category: 'other' as WorkbenchCategory,
  defaultValue: "#4d4d4d",
};

export const WorkbenchColorBadgeBackground: React.FC<WorkbenchColorBadgeBackgroundProps> = ({
  mergedColors,
  stagedColors,
  activeColors,
  bulkSelected,
  onColorChange,
  onReset,
  onToggleActive,
  onSelectThis,
  onSelectAll,
  onSelectNone,
  t,
  lang,
}) => {
  const category: WorkbenchCategory = 'other' as WorkbenchCategory;
  const colorDefs: ColorDefinition[] = [COLOR_DEF];
  const catMeta = CATEGORY_FEATURE_MAP[category];

  const currentColor = mergedColors[COLOR_DEF.id] || COLOR_DEF.defaultValue || '#1e1e1e';
  const isCustomized = mergedColors[COLOR_DEF.id] !== undefined;
  const isStaged = stagedColors[COLOR_DEF.id] !== undefined;
  const isActive = activeColors[COLOR_DEF.id] !== false;
  const isBulkSelected = bulkSelected.has(COLOR_DEF.id);

  return (
    <WorkbenchColorRow
      key={COLOR_DEF.id}
      colorDef={COLOR_DEF}
      currentColor={currentColor}
      isCustomized={isCustomized}
      isStaged={isStaged}
      isActive={isActive}
      isBulkSelected={isBulkSelected}
      catMeta={catMeta}
      onSelectThis={onSelectThis}
      onSelectAll={onSelectAll}
      onSelectNone={onSelectNone}
      onColorChange={onColorChange}
      onReset={onReset}
      onToggleActive={onToggleActive}
      t={t}
      lang={lang}
    />
  );
};
