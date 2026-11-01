/**
 * ColorFly: Auto-generate color component registry
 * Scans generated per-color files and creates the import/export map.
 */

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
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

function main() {
  const files = fs.readdirSync(WORKBENCH_DIR).filter((f) => {
    if (!f.endsWith('.tsx')) return false;
    if (f === 'WorkbenchColorRow.tsx' || f === 'WorkbenchColorCatalog.tsx' || f === 'WorkbenchColorCategory.tsx' || f === 'colorComponentRegistry.ts') return false;
    // Only include per-color files (lowercase with underscores, not starting with uppercase)
    return f[0] === f[0].toLowerCase();
});

  const imports: string[] = [];
  const entries: string[] = [];

  for (const file of files) {
    const fileBase = file.replace('.tsx', '');
    // Read the file to find the exported component name
    const content = fs.readFileSync(path.join(WORKBENCH_DIR, file), 'utf8');
    const exportMatch = content.match(/export const (WorkbenchColor\w+): React\.FC/);
    if (!exportMatch) {
      console.warn(`No export found in ${file}`);
      continue;
    }
    const componentName = exportMatch[1];
    
    // Derive color ID from filename (reverse of sanitizeFileName)
    // filename is like activityBar_background → id is activityBar.background
    const idParts = fileBase.split('_');
    // Reconstruct: first part is category, rest joined with dots
    // Actually this is lossy. Let me just read the COLOR_DEF id from the file
    const idMatch = content.match(/id: '([^']+)'/);
    const colorId = idMatch ? idMatch[1] : fileBase.replace(/_/g, '.');

    imports.push(`import { ${componentName} } from './${fileBase}';`);
    entries.push(`  '${colorId}': ${componentName},`);
  }

  const registryContent = `/**
 * ColorFly: Per-Color Component Registry
 * Auto-generated: maps each workbench color ID to its dedicated component file.
 * Each of the ${files.length} color settings has its own isolated component.
 */

import React from 'react';
${imports.sort().join('\n')}

export interface ColorComponentMap {
  [colorId: string]: React.ComponentType<any>;
}

export const COLOR_COMPONENTS: ColorComponentMap = {
${entries.sort().join('\n')}
};

export default COLOR_COMPONENTS;
`;

  fs.writeFileSync(path.join(WORKBENCH_DIR, 'colorComponentRegistry.ts'), registryContent);
  console.log(`Generated registry with ${files.length} color components`);
}

main();
