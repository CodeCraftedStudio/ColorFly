import sys

path = r'D:\GitHub Project\ColorFly\README.md'
content = open(path, 'r', encoding='utf-8').read()

start_marker = "## Architecture\n\n```\nColorFly/"
end_marker = "```\n\n---\n\n## License"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx >= 0 and end_idx > start_idx:
    end_idx += len(end_marker)
    
    new_block = r"""## Architecture

```
ColorFly/
├── assets/
│   ├── icon.png                         # Extension icon (128x128)
│   └── icons/
│       └── ColorFly-activitybar.svg     # Monochrome Activity Bar SVG emblem
├── scripts/
│   ├── generate-per-color-components.ts # Generates 162 per-color component files
│   └── generate-registry.ts             # Auto-generates color component registry
├── src/
│   ├── extension.ts                     # Extension activation & service bootstrap
│   ├── commands/                        # Command palette & toolbar action handlers
│   ├── panels/
│   │   └── ThemeStudioEditorPanel.ts    # WebviewPanel lifecycle, CSP, state sync
│   ├── views/
│   │   └── ThemeStudioSidebarProvider.ts# Activity Bar WebviewViewProvider
│   ├── services/
│   │   ├── ConfigurationService.ts      # Safe VS Code settings reader & merger
│   │   ├── ProfileService.ts            # Versioned profile storage & presets
│   │   ├── RecoveryService.ts           # Undo/redo stack & pre-customization snapshot
│   │   └── ThemeExportService.ts        # Standalone theme JSON & extension scaffolder
│   ├── shared/
│   │   ├── colorUtils.ts                # Pure color science & WCAG algorithms
│   │   ├── officialWorkbenchColors.ts   # Official VS Code workbench color catalog (162 colors)
│   │   ├── tokenColorCatalog.ts         # TextMate token scopes & semantic categories
│   │   ├── starterPresets.ts            # 8 original theme preset configurations
│   │   └── types.ts                     # Shared RPC and model type definitions
│   ├── en.ts                            # English i18n dictionary
│   ├── bn.ts                            # Bangla i18n dictionary
│   ├── hi.ts                            # Hindi i18n dictionary
│   └── i18n.ts                          # i18n context, translation utilities
│   └── webview/                         # React 18 frontend studio
│       ├── App.tsx                      # Root application & state coordination
│       ├── index.tsx                    # React DOM mount entry
│       ├── vscodeApi.ts                 # Type-safe acquireVsCodeApi wrapper
│       ├── styles/app.css               # Responsive theme-adaptive styling
│       └── components/                  # UI components across all 8 studio workspaces
│           ├── common/                  # Shared components (ColorInput, ColorPickerPopover, etc.)
│           └── workbench/               # Workbench colors — 162 isolated per-color files
│               ├── WorkbenchColorCatalog.tsx   # Main orchestrator (search, filters, bulk actions)
│               ├── WorkbenchColorRow.tsx       # Shared row component (Active/Deactivate + ColorInput)
│               ├── workbenchColorTypes.ts      # Shared types + CATEGORY_FEATURE_MAP
│               ├── colorComponentRegistry.ts   # Maps 162 color IDs to their components
│               ├── editor_background.tsx       # Per-color component (example)
│               ├── activityBar_foreground.tsx  # Per-color component (example)
│               └── ... (162 total per-color files)
└── tests/                               # 65 automated Vitest unit tests
```"""

    content = content[:start_idx] + new_block + content[end_idx:]
    open(path, 'w', encoding='utf-8').write(content)
    print('SUCCESS: Architecture section replaced')
else:
    print(f'FAILED: start_idx={start_idx}, end_idx={end_idx}')
