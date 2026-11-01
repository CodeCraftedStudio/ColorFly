/**
 * ColorFly: Generate per-color component files
 * Reads OFFICIAL_WORKBENCH_COLORS and creates one TSX file per color setting.
 */

import { OFFICIAL_WORKBENCH_COLORS } from '../src/shared/officialWorkbenchColors';
import { WorkbenchCategory } from '../src/shared/types';
import fs from 'fs';
import path from 'path';

const WORKBENCH_DIR = path.resolve(__dirname, '../src/webview/components/workbench');

function kebabToPascal(str: string): string {
  return str
    .split(/[.-]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function sanitizeFileName(id: string): string {
  // Replace dots and other special chars with underscore for valid file names
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

function generateColorComponentFile(colorDef: {
  id: string;
  name: string;
  description: string;
  category: WorkbenchCategory;
  defaultValue?: string;
}): string {
  const fileNameBase = sanitizeFileName(colorDef.id);
  const componentName = `WorkbenchColor${kebabToPascal(colorDef.id)}`;

  return `/**
 * ColorFly: ${colorDef.name} Component
 * Feature: ${colorDef.id}
 * Single color setting component - isolated for easy bug fixes.
 */

import React from 'react';
import { ColorDefinition, WorkbenchCategory } from '../../../shared/types';
import { WorkbenchColorRow } from './WorkbenchColorRow';
import { CATEGORY_FEATURE_MAP } from './workbenchColorTypes';
import { GuiLanguage } from '../../i18n';

export interface ${componentName}Props {
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
  id: '${colorDef.id}',
  name: ${JSON.stringify(colorDef.name)},
  description: ${JSON.stringify(colorDef.description)},
  category: '${colorDef.category}' as WorkbenchCategory,
  ${colorDef.defaultValue ? `defaultValue: ${JSON.stringify(colorDef.defaultValue)},` : ''}
};

export const ${componentName}: React.FC<${componentName}Props> = ({
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
  const category: WorkbenchCategory = '${colorDef.category}' as WorkbenchCategory;
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
`;
}

function main() {
  if (!fs.existsSync(WORKBENCH_DIR)) {
    fs.mkdirSync(WORKBENCH_DIR, { recursive: true });
  }

  let created = 0;
  for (const colorDef of OFFICIAL_WORKBENCH_COLORS) {
    const fileName = sanitizeFileName(colorDef.id) + '.tsx';
    const filePath = path.join(WORKBENCH_DIR, fileName);
    const content = generateColorComponentFile(colorDef);
    fs.writeFileSync(filePath, content);
    created++;
  }

  console.log(`Generated ${created} per-color component files in ${WORKBENCH_DIR}`);
}

main();
