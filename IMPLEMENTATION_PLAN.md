# ChromaForge: Advanced VS Code Theme Studio — Implementation Plan

## 1. Project Overview & Identity
- **Product Name**: ChromaForge — VS Code Theme Studio
- **Identifier**: `chromaforge`
- **Publisher**: `chromaforge-studio`
- **Target Audience**: Developers, UI/UX designers, and theme creators demanding granular, real-time control over their VS Code color environment without manual JSON edits.
- **Core Principle**: Every exposed control performs a real, validated, tested action. No mock buttons, dummy state, or simulated behaviors.

---

## 2. Architecture & Components

### 2.1 Extension Host (`src/`)
- `extension.ts`: Activation lifecycle, subscription tracking, command registrations, configuration change listeners.
- `commands/`:
  - `chromaforge.openStudio`: Opens/reveals the full Theme Studio WebviewPanel in the editor area.
  - `chromaforge.openSidebar`: Focuses the Activity Bar view.
  - `chromaforge.applyCustomizations`: Persists staged color customizations to VS Code configuration.
  - `chromaforge.resetCustomizations`: Reverts customizations safely to pre-customization snapshots.
  - `chromaforge.exportTheme`: Exports active profile to standalone JSON / extension package.
- `views/ThemeStudioSidebarProvider.ts`: WebviewViewProvider for the Activity Bar, presenting quick status, active profile/theme indicators, scope switcher, and a prominent "Open Theme Studio in Editor" button.
- `panels/ThemeStudioEditorPanel.ts`: WebviewPanel manager for the full-page editor-area Theme Studio. Ensures single-instance management, state persistence, CSP security, and bidirectional messaging.
- `services/`:
  - `ConfigurationService.ts`: Reads, scopes (User vs. Workspace), merges, and applies `workbench.colorCustomizations`, `editor.tokenColorCustomizations`, and `editor.semanticTokenColorCustomizations`. Preserves bracketed theme scopes (`[Theme Name]`) and unrelated settings.
  - `ProfileService.ts`: CRUD for versioned profile definitions stored in VS Code Memento (`globalState` and `workspaceState`). Provides 8 curated starter presets (Midnight, Deep Ocean, Forest Terminal, Warm Ember, Soft Lavender, Monochrome, Minimal Light, High Contrast).
  - `ThemeCatalogService.ts`: Comprehensive, validated catalog of official VS Code workbench color keys (~400+ keys across 12 distinct functional categories).
  - `ThemeExportService.ts`: Exports profiles, settings patches, standalone color theme JSON files, and scaffolds installable VS Code theme extensions.
  - `RecoveryService.ts`: Automatic pre-modification snapshots, undo/redo state stacks, and non-destructive rollbacks.

### 2.2 Shared Core (`src/shared/`)
- `colorUtils.ts`: Pure TypeScript color science library:
  - Formats: HEX (3, 4, 6, 8 digit), RGB/RGBA, HSL/HSLA, direct numeric parsing.
  - Color normalization, format conversions, clamping, floating-point drift prevention.
  - WCAG 2.1 relative luminance and contrast ratio calculations (AA / AAA ratings).
  - Harmony generation: Complementary, Analogous, Monochromatic, Triadic, Neutral Surfaces, Accessible Foregrounds.
  - Color-blindness simulation (Protanopia, Deuteranopia, Tritanopia, Achromatopsia).
- `messaging.ts`: Strict, type-safe RPC protocol for webview <-> extension host messaging.
- `tokenColorCatalog.ts`: Comprehensive TextMate scopes and standard semantic token categories.
- `starterPresets.ts`: 8 original, production-ready theme presets.

### 2.3 Frontend Studio (`src/webview/`)
- React 18 + TypeScript + Vite/esbuild bundler with CSS modules/variables adapted to VS Code native CSS theme variables.
- Main Modules:
  1. **Overview Dashboard**: Active theme, editing target (User vs. Workspace), customization count, draft count, recent colors, quick palette, presets, quick actions.
  2. **Workbench Colors**: 12+ categories, global search, filtering (customized, unmodified, favorites), inline swatch, validated inputs, copy, reset, tooltip info.
  3. **Advanced Color Picker**: Saturation-value field, Hue slider, Alpha slider, Hex/RGB/HSL controls, live swatch, recent/favorite colors, palette generator.
  4. **Syntax Highlighting**: Common token styles + advanced TextMate rule editor (scope, fontStyle, color) + Semantic token customizations.
  5. **Live Preview Engine**: Multi-scene simulator (Code Editor, Explorer, Terminal, Search, Diff, Notifications) with Before/After comparison toggle.
  6. **Profiles & Presets**: Profile lifecycle management, comparisons, imports, exports, favorites.
  7. **Accessibility & Diagnostics**: Contrast checker, WCAG ratings, accessibility warnings, conflict detection, uncommitted change alerts.
  8. **Advanced Tools**: Raw JSON config editor with diff verification, custom arbitrary property injector, theme extension scaffolder.
  9. **History & Recovery**: Undo/redo, draft discard, pre-customization snapshot restoration.

---

## 3. Milestones & Verification Plan

- [x] **Milestone 0: Workspace Analysis & Tooling Setup**
  - Verify Node.js, npm, git environment.
  - Scaffold `package.json`, `tsconfig.json`, `vite.config.ts`, build scripts.
  - Configure `@vscode/vsce` packaging script.
- [ ] **Milestone 1: Core Color Science & Shared Engine**
  - Implement `colorUtils.ts` with comprehensive unit tests for HEX, RGB, HSL, alpha, WCAG contrast, and harmony.
  - Implement `tokenColorCatalog.ts` and `officialWorkbenchColors.ts`.
  - Implement `starterPresets.ts`.
- [ ] **Milestone 2: Extension Host Services & Configuration Engine**
  - Implement `ConfigurationService.ts` with safe bracketed theme scopes, user/workspace scoping, diffing.
  - Implement `ProfileService.ts` and `RecoveryService.ts` with snapshot/restore capabilities.
  - Implement `ThemeExportService.ts` with theme extension generator.
  - Unit tests for configuration merging, profile serialization, and safe rollbacks.
- [ ] **Milestone 3: Extension Lifecycle, Views & Commands**
  - Design custom Activity Bar SVG icon and Activity Bar view container.
  - Implement `ThemeStudioSidebarProvider.ts` (sidebar webview).
  - Implement `ThemeStudioEditorPanel.ts` (editor webview panel with CSP & resource security).
  - Register all commands and menu items.
- [ ] **Milestone 4: React Webview Application & Design System**
  - Build UI components adhering to VS Code design system and CSS variables.
  - Implement all 9 studio sections: Overview, Workbench, Color Picker, Syntax, Preview, Profiles, Accessibility, Advanced, History.
  - Implement multi-scene live preview engine with Before/After mode.
- [ ] **Milestone 5: End-to-End Integration & Automated Testing**
  - Run full unit test suite (color math, config merging, profile storage, exports).
  - Build webview and extension host bundles.
  - Verify TypeScript compilation with zero errors.
- [ ] **Milestone 6: Packaging & Documentation**
  - Create comprehensive `README.md` with features, setup, and usage.
  - Package `.vsix` file using `@vscode/vsce`.

