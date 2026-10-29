# ColorFly â€” VS Code Theme Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![VS Code Engine](https://img.shields.io/badge/VS%20Code-%5E1.85.0-007acc.svg)](https://code.visualstudio.com/)
[![Tests](https://img.shields.io/badge/Tests-42%20Passed-10b981.svg)](tests/)

> **ColorFly** is a professional graphical theme customization studio, boxed clock widget, and color science environment integrated directly into Visual Studio Code. Customize workbench surfaces, syntax highlighting, and terminal colors with precision, inspect contrast ratios in real time, preview changes live, and generate installable theme extensions â€” all without manual JSON editing.

---

## Key Features

### 1. Dedicated Activity Bar, Full-Page Editor Workspace & GUI Themes
- **Custom Activity Bar Icon**: Clean, monochrome SVG prism icon conforming to VS Code Activity Bar ergonomics.
- **Theme Studio Sidebar**: Mini-dashboard showing active theme status, applied override count, quick palette preview, starter preset switcher, and a prominent **"Open Theme Studio in Editor"** button.
- **Full-Page Studio with 5 GUI Theme Modes**:
  1. **ðŸ–¥ï¸ VS Code Native**: Inherits editor and workbench colors dynamically.
  2. **ðŸŒ™ Studio Obsidian Dark**: Deep obsidian glass aesthetic with electric violet accents.
  3. **â˜€ï¸ Studio Clean Light**: Modern porcelain daylight UI with crisp contrast and blue accents.
  4. **âœï¸ Pencil Paper Theme**: Architectural draft graph paper texture, pencil charcoal typography, hand-drafted sketch borders, and draftsman aesthetics.
  5. **âš¡ Animated Hacker Theme**: Glowing phosphor neon green typography, active animated CRT scanline sweep, cyber gridlines, and terminal vibes.
- **Dedicated GUI Settings Studio**: Configure GUI themes, layout density (Compact, Comfortable, Relaxed), base font size (12px, 13px, 14px), and animation effects with persistence.

### 2. Comprehensive Component Color Catalog
- **12 Dedicated Workbench Categories**:
  1. Activity Bar
  2. Primary Sidebar
  3. Editor (background, line numbers, cursor, guides, brackets, selections)
  4. Tabs and Title Bar
  5. Status Bar
  6. Panel (Terminal, Output, Problems)
  7. Integrated Terminal (ANSI 16-color spectrum)
  8. Buttons and Inputs
  9. Lists, Trees, and Menus
  10. Search, Source Control (Git decorations), and Debugging
  11. Notifications and Popups
  12. Badges, Scrollbars, and Breadcrumbs
- **Fast Global Search**: Filter by human-readable component name, exact official VS Code color ID (e.g. `editor.background`), or description.
- **Filtering Options**: Toggle between All Properties, Customized Only, or Unmodified Only.

### 3. Advanced Color Studio & Harmonies
- **Precision Color Picker**: Visual Hue, Saturation, Lightness, and Alpha/Opacity sliders.
- **Validated Input Formats**: Real-time validation and normalization for HEX (`#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`), RGB/RGBA, and HSL/HSLA.
- **Algorithmic Harmonies**: Instantly generate Complementary, Analogous, Triadic, Monochromatic, and Neutral Dark Surface palettes derived from any seed color.
- **Target Assignment**: Assign any generated harmony color to any workbench component in one click.

### 4. Syntax Highlighting Studio
- **Core Token Categories**: Custom styling for Comments, Strings, Numbers, Keywords, Functions, Variables, Types, Classes, Constants, Operators, Punctuation, and Regular Expressions.
- **TextMate Rule Builder**: Add, edit, test, and delete scoped TextMate rules (e.g. `storage.type`, `entity.name.function`) with custom colors and font styles (*italic*, **bold**, <u>underline</u>, ~~strikethrough~~).
- **Semantic Token Color Customizations**: Direct support for language-server semantic tokens (`variable.readonly`, `parameter`, `property`).

### 5. Multi-Scene Live Preview Engine
- **Simulated VS Code Environment**: Interactive preview of Code Editor with TypeScript sample code, File Explorer tree, Integrated Terminal with ANSI outputs, Git Diff viewer, and Status Bar.
- **Zero Configuration Side-Effects**: Preview updates instantly as you tweak colors without prematurely committing changes to your VS Code settings.

### 6. Safe Configuration Engine & Rollback
- **User vs. Workspace Scopes**: Switch between global User configuration (`~/.config/Code/User/settings.json`) and project-specific Workspace settings (`.vscode/settings.json`).
- **Theme-Specific Scoping**: Target only the active theme using bracketed theme scopes (`"[Default Dark+]": { ... }`) to prevent polluting other themes.
- **Non-Destructive Merging**: Preserves all unrelated user settings and third-party extensions.
- **Pre-Customization Snapshots & 1-Click Restore**: Automatic pristine state capture before applying changes, allowing safe, non-destructive restoration at any time.

### 7. Profile & Preset Management
- **8 Production Starter Presets**:
  - **Midnight**: Deep obsidian with electric violet and celestial indigo accents.
  - **Deep Ocean**: Abyssal teal and ocean blue with radiant cyan highlights.
  - **Forest Terminal**: Deep woodland moss and evergreen darks with phosphor green clarity.
  - **Warm Ember**: Charcoal hearth with glowing ember orange, terracotta, and warm brass.
  - **Soft Lavender**: Muted twilight purple, velvety orchid, and soft pastel contrasts.
  - **Monochrome**: Disciplined grayscale elegance with pure graphite and silver.
  - **Minimal Light**: Porcelain white with soft zinc surfaces and crisp typography.
  - **High Contrast**: Pure obsidian with vivid neon outlines and maximal WCAG ratio.
- **Profile Operations**: Save, duplicate, rename, favorite, delete, and compare profiles.
- **Portable JSON Imports/Exports**: Import any valid VS Code theme JSON or ColorFly profile backup.

### 8. Accessibility & WCAG 2.1 Contrast Analyzer
- **Automated Contrast Calculations**: Evaluates relative luminance for critical UI pairs (Editor Bg/Fg, Sidebar, Activity Bar, Status Bar, Buttons, Terminal).
- **WCAG Ratings**: Live Level AA (4.5:1) and Level AAA (7.0:1) pass/fail indicators.
- **Accessible Foreground Suggestions**: Recommends optimal high-contrast text colors for any background.
- **Color Blindness Perception Lab**: Real-time simulation of Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.

### 9. Theme Extension Generator
- **Scaffold Installable Extensions**: Generates full extension folder structure (`package.json`, `themes/color-theme.json`, `README.md`, `LICENSE`, `CHANGELOG.md`) ready to be packaged via `vsce package` and published to the VS Code Marketplace.

---

## Installation & Quick Start

### Installing the VSIX Package
1. Download the generated `colorfly-1.0.0.vsix` package.
2. In VS Code, open the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Click the `...` (More Actions) menu in the top-right corner.
4. Select **Install from VSIX...** and choose `colorfly-1.0.0.vsix`.
5. Alternatively, install via terminal:
   ```bash
   code --install-extension colorfly-1.0.0.vsix
   ```

### Launching in Extension Development Host
If you are developing or testing ColorFly locally:
1. Open this repository folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Press `F5` (or go to **Run and Debug** -> **Run Extension**).
4. A new **[Extension Development Host]** VS Code window will open with ColorFly loaded.
5. Click the ColorFly icon in the Activity Bar or run `ColorFly: Open Theme Studio in Editor` from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).

---

## Development & Test Commands

| Command | Description |
| :--- | :--- |
| `npm run build` | Builds both the React webview bundle (`vite`) and extension host (`tsc`). |
| `npm run build:ui` | Bundles React UI into `dist/webview.js` and `dist/webview.css`. |
| `npm run build:ext` | Compiles TypeScript extension services into `dist/`. |
| `npm run watch:ui` | Watches and rebuilds webview assets on changes. |
| `npm run watch:ext` | Watches and recompiles extension host files on changes. |
| `npm test` | Runs the Vitest automated unit test suite. |
| `npm run package` | Builds and packages the extension into an installable `.vsix` archive. |

---

## Test Verification

The project includes 41 comprehensive automated unit tests covering:
- **Color Math & Conversions**: HEX (3, 4, 6, 8-digit), RGB, RGBA, HSL, HSLA, normalization, and floating-point drift prevention.
- **WCAG 2.1 Contrast Calculations**: Relative luminance and AA/AAA compliance evaluation.
- **Color Harmonies & Simulations**: Complementary, analogous, triadic, monochromatic, neutral surfaces, and color blindness perception matrices.
- **Configuration Management**: Non-destructive merging, preservation of unrelated user settings, bracketed theme-specific scopes, and pre-customization snapshot restoration.
- **Profile Lifecycle**: Storage persistence, preset initialization, schema validation, duplicating, and JSON import/export.
- **Theme Extension Scaffolding**: Correct `package.json` contributes block and file generation.

---

## Architecture

```
ColorFly/
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ icon.png                         # Extension icon (128x128)
â”‚   â””â”€â”€ icons/
â”‚       â””â”€â”€ ColorFly-activitybar.svg  # Monochrome Activity Bar SVG emblem
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ extension.ts                     # Extension activation & service bootstrap
â”‚   â”œâ”€â”€ commands/                        # Command palette & toolbar action handlers
â”‚   â”œâ”€â”€ panels/
â”‚   â”‚   â””â”€â”€ ThemeStudioEditorPanel.ts   # WebviewPanel lifecycle, CSP, state sync
â”‚   â”œâ”€â”€ views/
â”‚   â”‚   â””â”€â”€ ThemeStudioSidebarProvider.ts# Activity Bar WebviewViewProvider
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ ConfigurationService.ts      # Safe VS Code settings reader & merger
â”‚   â”‚   â”œâ”€â”€ ProfileService.ts            # Versioned profile storage & presets
â”‚   â”‚   â”œâ”€â”€ RecoveryService.ts           # Undo/redo stack & pre-customization snapshot
â”‚   â”‚   â””â”€â”€ ThemeExportService.ts        # Standalone theme JSON & extension scaffolder
â”‚   â”œâ”€â”€ shared/
â”‚   â”‚   â”œâ”€â”€ colorUtils.ts                # Pure color science & WCAG algorithms
â”‚   â”‚   â”œâ”€â”€ officialWorkbenchColors.ts   # Official VS Code workbench color catalog
â”‚   â”‚   â”œâ”€â”€ tokenColorCatalog.ts         # TextMate token scopes & semantic categories
â”‚   â”‚   â”œâ”€â”€ starterPresets.ts            # 8 original theme preset configurations
â”‚   â”‚   â””â”€â”€ types.ts                     # Shared RPC and model type definitions
â”‚   â””â”€â”€ webview/                         # React 18 frontend studio
â”‚       â”œâ”€â”€ App.tsx                      # Root application & state coordination
â”‚       â”œâ”€â”€ index.tsx                    # React DOM mount entry
â”‚       â”œâ”€â”€ vscodeApi.ts                 # Type-safe acquireVsCodeApi wrapper
â”‚       â”œâ”€â”€ styles/app.css               # Responsive theme-adaptive styling
â”‚       â””â”€â”€ components/                  # UI components across all 8 studio workspaces
â””â”€â”€ tests/                               # 41 automated Vitest unit tests
```

---

## License

MIT License. Designed and built for the Visual Studio Code developer community.


