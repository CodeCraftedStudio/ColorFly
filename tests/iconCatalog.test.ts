import { describe, it, expect } from 'vitest';
import { ICON_CATALOG, ICON_GROUP } from '../src/shared/iconCatalog';

const byFileName = (a: { fileName: string; path: string }, b: { fileName: string; path: string }) => {
  const byName = a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase(), 'en');
  return byName !== 0 ? byName : a.path.localeCompare(b.path, 'en');
};

describe('icon catalog (vscode-iconn)', () => {
  it('collects all icons with unique paths', () => {
    expect(ICON_CATALOG.length).toBeGreaterThanOrEqual(308);
    const paths = ICON_CATALOG.map((entry) => entry.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('is sorted by file name', () => {
    const sorted = [...ICON_CATALOG].sort(byFileName);
    expect(ICON_CATALOG.map((entry) => entry.path)).toEqual(sorted.map((entry) => entry.path));
  });

  it('assigns every icon to the single group', () => {
    expect(ICON_GROUP).toBe('VS Code Icons');
    for (const entry of ICON_CATALOG) {
      expect(entry.group).toBe(ICON_GROUP);
      expect(entry.fileName.length).toBeGreaterThan(0);
    }
  });

  it('has fileName matching the path basename', () => {
    for (const entry of ICON_CATALOG) {
      const segments = entry.path.split('/');
      expect(entry.fileName).toBe(segments[segments.length - 1]);
    }
  });

  it('includes both root file icons and folder icons', () => {
    expect(ICON_CATALOG.some((entry) => !entry.path.includes('/'))).toBe(true);
    expect(ICON_CATALOG.some((entry) => entry.path.startsWith('folders/'))).toBe(true);
  });
});
