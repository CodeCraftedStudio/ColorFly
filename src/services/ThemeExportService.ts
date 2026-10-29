/**
 * ColorFly: Theme Export Service
 * Generates standalone VS Code theme JSON files and scaffolds full installable theme extensions.
 */

import { ThemeProfile } from '../shared/types';
import { COMMON_TOKEN_CATEGORIES } from '../shared/tokenColorCatalog';

export interface GeneratedExtensionScaffold {
  extensionName: string;
  files: Record<string, string>;
}

export class ThemeExportService {
  /**
   * Converts a ThemeProfile into standard VS Code color-theme JSON format.
   */
  public static toVSCodeThemeJson(profile: ThemeProfile, uiTheme: 'vs-dark' | 'vs' = 'vs-dark'): string {
    const tokenColors: any[] = [];

    // Map common token category overrides
    if (profile.tokenColors) {
      for (const cat of COMMON_TOKEN_CATEGORIES) {
        const customColor = (profile.tokenColors as any)[cat.key];
        if (customColor) {
          tokenColors.push({
            name: cat.label,
            scope: cat.standardScopes,
            settings: {
              foreground: customColor,
            },
          });
        }
      }

      // Append custom TextMate rules
      if (Array.isArray(profile.tokenColors.textMateRules)) {
        for (const rule of profile.tokenColors.textMateRules) {
          tokenColors.push(rule);
        }
      }
    }

    const themeObj = {
      $schema: 'vscode://schemas/color-theme',
      name: profile.name,
      type: uiTheme === 'vs' ? 'light' : 'dark',
      colors: profile.workbenchColors,
      tokenColors,
      semanticHighlighting: true,
      semanticTokenColors: profile.semanticTokenColors || {},
    };

    return JSON.stringify(themeObj, null, 2);
  }

  /**
   * Scaffolds an entire installable VS Code theme extension package.
   */
  public static scaffoldThemeExtension(
    profile: ThemeProfile,
    publisher: string = 'custom-themes'
  ): GeneratedExtensionScaffold {
    const slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const extensionName = `theme-${slug || 'custom'}`;
    const themeFileName = `${slug || 'custom'}-color-theme.json`;
    const isLight = profile.name.toLowerCase().includes('light');
    const uiTheme = isLight ? 'vs' : 'vs-dark';

    const themeJson = this.toVSCodeThemeJson(profile, uiTheme);

    const packageJson = JSON.stringify(
      {
        name: extensionName,
        displayName: `${profile.name} Color Theme`,
        description: profile.description || `Custom theme generated with ColorFly Theme Studio for Visual Studio Code.`,
        version: '1.0.0',
        publisher,
        engines: {
          vscode: '^1.85.0',
        },
        categories: ['Themes'],
        contributes: {
          themes: [
            {
              label: profile.name,
              uiTheme,
              path: `./themes/${themeFileName}`,
            },
          ],
        },
      },
      null,
      2
    );

    const readme = `# ${profile.name} Color Theme

${profile.description || 'A beautiful, custom theme generated using ColorFly â€” VS Code Theme Studio.'}

## Installation

1. Install via VSIX:
   \`\`\`bash
   code --install-extension ${extensionName}-1.0.0.vsix
   \`\`\`
2. Open **Command Palette** (\`Ctrl+Shift+P\` or \`Cmd+Shift+P\`)
3. Select **Preferences: Color Theme**
4. Choose **${profile.name}**

## Packaging Instructions

To package this theme extension into a \`.vsix\` file:
\`\`\`bash
npm install -g @vscode/vsce
vsce package
\`\`\`

---
*Created with [ColorFly](https://marketplace.visualstudio.com/)*
`;

    const vscodeignore = `.vscode/**
.git/**
.gitignore
node_modules/**
`;

    const changelog = `# Changelog

## 1.0.0
- Initial release of ${profile.name} theme.
`;

    const license = `MIT License

Copyright (c) ${new Date().getFullYear()} ${profile.author || publisher}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

    return {
      extensionName,
      files: {
        'package.json': packageJson,
        'README.md': readme,
        '.vscodeignore': vscodeignore,
        'CHANGELOG.md': changelog,
        'LICENSE': license,
        [`themes/${themeFileName}`]: themeJson,
      },
    };
  }
}


