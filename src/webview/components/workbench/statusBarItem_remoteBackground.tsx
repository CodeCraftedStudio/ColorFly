/**
 * ColorFly: Status Bar Remote Indicator Background Component
 * Feature: statusBarItem.remoteBackground
 * Single color setting component - isolated for easy bug fixes.
 */

import React from 'react';
import { ColorDefinition, WorkbenchCategory } from '../../../shared/types';
import { WorkbenchColorRow } from './WorkbenchColorRow';
import { CATEGORY_FEATURE_MAP } from './workbenchColorTypes';
import { GuiLanguage } from '../../i18n';

export interface WorkbenchColorStatusBarItemRemoteBackgroundProps {
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
  id: 'statusBarItem.remoteBackground',
  name: "Status Bar Remote Indicator Background",
  description: "Status Bar item background color for remote host indicator (e.g. WSL, SSH).",
  category: 'statusBar' as WorkbenchCategory,
  defaultValue: "#16825d",
};

export const WorkbenchColorStatusBarItemRemoteBackground: React.FC<WorkbenchColorStatusBarItemRemoteBackgroundProps> = ({
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
  const category: WorkbenchCategory = 'statusBar' as WorkbenchCategory;
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
