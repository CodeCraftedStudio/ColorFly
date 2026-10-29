/**
 * ChromaForge: Core Shared Type Definitions
 */

export type ColorScope = 'user' | 'workspace';

export interface RGBA {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

export interface HSLA {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1
}

export type WorkbenchCategory =
  | 'activityBar'
  | 'sideBar'
  | 'editor'
  | 'tabsAndTitle'
  | 'statusBar'
  | 'panel'
  | 'terminal'
  | 'buttonsAndInputs'
  | 'listsAndTrees'
  | 'searchAndDebug'
  | 'notifications'
  | 'other';

export interface ColorDefinition {
  id: string;
  name: string;
  description: string;
  category: WorkbenchCategory;
  defaultValue?: string;
  fallbackId?: string;
}

export interface TextMateTokenRule {
  name?: string;
  scope: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string; // 'italic' | 'bold' | 'underline' | 'strikethrough' | ''
  };
}

export interface SemanticTokenRule {
  selector: string;
  foreground?: string;
  fontStyle?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

export interface ThemeProfile {
  id: string;
  version: 1;
  name: string;
  description?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  isBuiltIn?: boolean;
  baseThemeId?: string;
  baseThemeName?: string;
  workbenchColors: Record<string, string>;
  tokenColors?: {
    comments?: string;
    strings?: string;
    numbers?: string;
    keywords?: string;
    functions?: string;
    variables?: string;
    types?: string;
    classes?: string;
    constants?: string;
    operators?: string;
    punctuation?: string;
    textMateRules?: TextMateTokenRule[];
  };
  semanticTokenColors?: Record<string, string | { foreground?: string; fontStyle?: string; bold?: boolean; italic?: boolean }>;
}

export interface ConfigSnapshot {
  id: string;
  timestamp: string;
  reason: string;
  scope: ColorScope;
  baseTheme: string;
  colorCustomizations: Record<string, any>;
  tokenColorCustomizations: Record<string, any>;
  semanticTokenColorCustomizations: Record<string, any>;
}

export interface ContrastAnalysis {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  status: 'pass' | 'warning' | 'fail';
  recommendation?: string;
}

export interface ThemeDiagnostics {
  invalidColors: Array<{ id: string; value: string; reason: string }>;
  unknownIds: string[];
  contrastWarnings: Array<{ id: string; name: string; ratio: number; fg: string; bg: string }>;
  unsavedDraftCount: number;
  hasExternalChanges: boolean;
}

/**
 * System Log Capture
 */

export type SystemLogLevel = 'error' | 'warn' | 'info';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: SystemLogLevel;
  source: string;
  message: string;
  detail?: string;
}

/**
 * Extension Host <-> Webview RPC Messages
 */

export type ExtensionToWebviewMessage =
  | { type: 'STATE_UPDATE'; payload: ExtensionStatePayload }
  | { type: 'OPERATION_SUCCESS'; payload: { message: string; details?: string } }
  | { type: 'OPERATION_ERROR'; payload: { message: string; error?: string } }
  | { type: 'THEME_EXPORTED'; payload: { type: 'json' | 'extension'; path?: string; content?: string } }
  | { type: 'SYSTEM_LOG'; payload: SystemLogEntry }
  | { type: 'SYSTEM_LOGS_SYNC'; payload: { entries: SystemLogEntry[] } };

export interface ExtensionStatePayload {
  activeThemeId: string;
  activeThemeName: string;
  activeThemeType: 'dark' | 'light' | 'hcDark' | 'hcLight';
  scope: ColorScope;
  hasWorkspaceOpen: boolean;
  workspaceName?: string;
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  stagedTokenColors: {
    comments?: string;
    strings?: string;
    numbers?: string;
    keywords?: string;
    functions?: string;
    variables?: string;
    types?: string;
    classes?: string;
    constants?: string;
    operators?: string;
    punctuation?: string;
    textMateRules?: TextMateTokenRule[];
  };
  stagedTextMateRules: TextMateTokenRule[];
  stagedSemanticTokens: Record<string, any>;
  savedProfiles: ThemeProfile[];
  activeProfileId?: string;
  hasUnappliedDrafts: boolean;
  lastSnapshotTimestamp?: string;
  canRestoreSnapshot: boolean;
  clockConfig?: {
    showClock: boolean;
    clockFormat: '24h' | '12h';
    clockShowSeconds: boolean;
  };
}

export type WebviewToExtensionMessage =
  | { type: 'READY' }
  | { type: 'SET_SCOPE'; payload: { scope: ColorScope } }
  | { type: 'STAGE_COLOR_CHANGE'; payload: { id: string; value: string } }
  | { type: 'STAGE_COLOR_BATCH'; payload: { colors: Record<string, string> } }
  | { type: 'RESET_COLOR'; payload: { id: string } }
  | { type: 'RESET_CATEGORY'; payload: { category: WorkbenchCategory } }
  | { type: 'STAGE_TOKEN_COLOR'; payload: { key: string; value: string } }
  | { type: 'UPDATE_TEXTMATE_RULES'; payload: { rules: TextMateTokenRule[] } }
  | { type: 'UPDATE_SEMANTIC_TOKENS'; payload: { tokens: Record<string, any> } }
  | { type: 'APPLY_CUSTOMIZATIONS'; payload: { themeScoped: boolean } }
  | { type: 'RESTORE_PRE_CUSTOMIZATION_SNAPSHOT' }
  | { type: 'DISCARD_DRAFTS' }
  | { type: 'SAVE_PROFILE'; payload: { profile: ThemeProfile } }
  | { type: 'LOAD_PROFILE'; payload: { profileId: string; applyImmediately: boolean } }
  | { type: 'DUPLICATE_PROFILE'; payload: { profileId: string; newName: string } }
  | { type: 'DELETE_PROFILE'; payload: { profileId: string } }
  | { type: 'IMPORT_PROFILE'; payload: { rawJson: string } }
  | { type: 'EXPORT_PROFILE'; payload: { profileId: string; format: 'colorfly-profile' | 'chromaforge-profile' | 'theme-json' | 'extension-scaffold' } }
  | { type: 'RAW_CONFIG_APPLY'; payload: { json: string; themeScoped: boolean } }
  | { type: 'UPDATE_CLOCK_CONFIG'; payload: { showClock?: boolean; clockFormat?: '24h' | '12h'; clockShowSeconds?: boolean } };

