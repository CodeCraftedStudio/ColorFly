/**
 * ColorFly: Full Editor-Area Webview Panel
 * Provides single-instance management, secure CSP HTML generation,
 * and robust RPC message handling.
 */

import * as vscode from 'vscode';
import {
  ColorScope,
  ExtensionStatePayload,
  ExtensionToWebviewMessage,
  ThemeProfile,
  WebviewToExtensionMessage,
} from '../shared/types';
import { isValidColor } from '../shared/colorUtils';
import { ConfigurationService } from '../services/ConfigurationService';
import { ProfileService } from '../services/ProfileService';
import { RecoveryService } from '../services/RecoveryService';
import { ThemeExportService } from '../services/ThemeExportService';
import {
  SystemLogService,
  formatErrorDetail,
  formatErrorMessage,
} from '../services/SystemLogService';
import { OFFICIAL_WORKBENCH_COLORS } from '../shared/officialWorkbenchColors';
import { writeThemeScaffold } from '../services/ThemeScaffoldWriter';

export class ThemeStudioEditorPanel {
  public static currentPanel: ThemeStudioEditorPanel | undefined;
  public static readonly viewType = 'colorfly.themeStudio';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  private currentScope: ColorScope = 'user';
  private stagedColors: Record<string, string> = {};
  private stagedTokenColors: Record<string, string> = {};
  private stagedTextMateRules: any[] = [];
  private stagedSemanticTokens: Record<string, any> = {};
  private activeProfileId?: string;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    private configService: ConfigurationService,
    private profileService: ProfileService,
    private recoveryService: RecoveryService,
    private readonly systemLogService: SystemLogService
  ) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    // Set webview initial HTML content
    this.updateWebviewContent();

    // Forward every captured system log entry to the open webview
    this.disposables.push(
      this.systemLogService.onDidLog((entry) => {
        this.sendMessage({ type: 'SYSTEM_LOG', payload: entry });
      })
    );

    // Handle messages sent from the webview
    this.panel.webview.onDidReceiveMessage(
      (message: WebviewToExtensionMessage) => this.handleMessage(message),
      null,
      this.disposables
    );

    // Listen for panel disposal
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Listen for VS Code theme changes
    vscode.window.onDidChangeActiveColorTheme(
      () => {
        this.broadcastState();
      },
      null,
      this.disposables
    );

    // Listen for VS Code configuration changes externally made
    vscode.workspace.onDidChangeConfiguration(
      (e) => {
        if (
          e.affectsConfiguration('workbench.colorCustomizations') ||
          e.affectsConfiguration('editor.tokenColorCustomizations') ||
          e.affectsConfiguration('editor.semanticTokenColorCustomizations') ||
          e.affectsConfiguration('colorfly')
        ) {
          this.broadcastState();
        }
      },
      null,
      this.disposables
    );
  }

  public static createOrShow(
    extensionUri: vscode.Uri,
    configService: ConfigurationService,
    privateProfileService: ProfileService,
    recoveryService: RecoveryService,
    systemLogService: SystemLogService
  ): ThemeStudioEditorPanel {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If panel already exists, reveal it in its current column
    if (ThemeStudioEditorPanel.currentPanel) {
      ThemeStudioEditorPanel.currentPanel.panel.reveal(column);
      ThemeStudioEditorPanel.currentPanel.broadcastState();
      return ThemeStudioEditorPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      ThemeStudioEditorPanel.viewType,
      'ColorFly â€” Theme Studio',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'dist'),
          vscode.Uri.joinPath(extensionUri, 'assets'),
        ],
      }
    );

    // Set panel icon
    panel.iconPath = {
      light: vscode.Uri.joinPath(extensionUri, 'assets', 'icons', 'colorfly-activitybar.svg'),
      dark: vscode.Uri.joinPath(extensionUri, 'assets', 'icons', 'colorfly-activitybar.svg'),
    };

    ThemeStudioEditorPanel.currentPanel = new ThemeStudioEditorPanel(
      panel,
      extensionUri,
      configService,
      privateProfileService,
      recoveryService,
      systemLogService
    );

    return ThemeStudioEditorPanel.currentPanel;
  }

  private async handleMessage(message: WebviewToExtensionMessage): Promise<void> {
    try {
      switch (message.type) {
        case 'READY': {
          this.sendMessage({
            type: 'SYSTEM_LOGS_SYNC',
            payload: { entries: this.systemLogService.getEntries() },
          });
          this.broadcastState();
          break;
        }

        case 'SET_SCOPE': {
          this.currentScope = message.payload.scope;
          this.broadcastState();
          break;
        }

        case 'STAGE_COLOR_CHANGE': {
          const { id, value } = message.payload;
          const prevVal = this.stagedColors[id];
          this.stagedColors[id] = value;
          this.recoveryService.recordChange({
            type: 'color',
            key: id,
            previousValue: prevVal,
            newValue: value,
          });
          this.broadcastState();
          break;
        }

        case 'STAGE_COLOR_BATCH': {
          const batchEntries = Object.entries(message.payload.colors || {});
          for (const [id, value] of batchEntries) {
            const prevVal = this.stagedColors[id];
            this.stagedColors[id] = value;
            this.recoveryService.recordChange({
              type: 'color',
              key: id,
              previousValue: prevVal,
              newValue: value,
            });
          }
          this.broadcastState();
          break;
        }

        case 'RESET_COLOR': {
          const { id } = message.payload;
          delete this.stagedColors[id];
          const activeTheme = this.getActiveThemeName();
          await this.configService.resetProperty(id, activeTheme, this.currentScope);
          this.broadcastState();
          break;
        }

        case 'RESET_CATEGORY': {
          const { category } = message.payload;
          const activeTheme = this.getActiveThemeName();
          const categoryIds = OFFICIAL_WORKBENCH_COLORS.filter(
            (color) => color.category === category
          ).map((color) => color.id);
          const idSet = new Set(categoryIds);

          for (const key of Object.keys(this.stagedColors)) {
            if (idSet.has(key)) delete this.stagedColors[key];
          }

          const effective = this.configService.getEffectiveWorkbenchColors(activeTheme, this.currentScope);
          const dirtyIds = categoryIds.filter((id) => effective[id] !== undefined);
          for (const id of dirtyIds) {
            await this.configService.resetProperty(id, activeTheme, this.currentScope);
          }

          this.systemLogService.info(
            'extension-host',
            `Reset category "${category}" (${dirtyIds.length} applied colors reverted, drafts cleared)`
          );
          this.broadcastState();
          break;
        }

        case 'STAGE_TOKEN_COLOR': {
          const { key, value } = message.payload;
          if (!value) {
            delete this.stagedTokenColors[key];
          } else {
            this.stagedTokenColors[key] = value;
          }
          this.broadcastState();
          break;
        }

        case 'UPDATE_TEXTMATE_RULES': {
          this.stagedTextMateRules = message.payload.rules;
          this.broadcastState();
          break;
        }

        case 'UPDATE_SEMANTIC_TOKENS': {
          const cleanedTokens: Record<string, any> = {};
          for (const [tokenKey, tokenValue] of Object.entries(message.payload.tokens || {})) {
            if (tokenValue === '' || tokenValue === null || tokenValue === undefined) continue;
            cleanedTokens[tokenKey] = tokenValue;
          }
          this.stagedSemanticTokens = cleanedTokens;
          this.broadcastState();
          break;
        }

        case 'APPLY_CUSTOMIZATIONS': {
          await this.applyStagedCustomizations(message.payload.themeScoped);
          break;
        }

        case 'RESTORE_PRE_CUSTOMIZATION_SNAPSHOT': {
          const snapshot = this.recoveryService.getInitialSnapshot();
          if (!snapshot) {
            vscode.window.showWarningMessage('No pre-customization snapshot is available to restore.');
            return;
          }

          await this.configService.restoreSnapshot(snapshot);
          this.stagedColors = {};
          this.stagedTokenColors = {};
          this.stagedTextMateRules = [];
          this.stagedSemanticTokens = {};

          this.sendMessage({
            type: 'OPERATION_SUCCESS',
            payload: { message: 'Pre-customization configuration restored successfully.' },
          });
          vscode.window.showInformationMessage('ColorFly: Restored original configuration.');
          this.broadcastState();
          break;
        }

        case 'DISCARD_DRAFTS': {
          this.stagedColors = {};
          this.stagedTokenColors = {};
          this.stagedTextMateRules = [];
          this.stagedSemanticTokens = {};
          this.broadcastState();
          break;
        }

        case 'SAVE_PROFILE': {
          const saved = await this.profileService.saveProfile(message.payload.profile);
          this.activeProfileId = saved.id;
          this.sendMessage({
            type: 'OPERATION_SUCCESS',
            payload: { message: `Profile "${saved.name}" saved successfully!` },
          });
          this.broadcastState();
          break;
        }

        case 'LOAD_PROFILE': {
          const profile = this.profileService.getProfile(message.payload.profileId);
          if (!profile) {
            this.systemLogService.warn('extension-host', `Profile ${message.payload.profileId} not found.`);
            vscode.window.showErrorMessage(`Profile ${message.payload.profileId} not found.`);
            return;
          }

          this.activeProfileId = profile.id;
          this.stagedColors = { ...profile.workbenchColors };
          this.stagedTokenColors = {};
          this.stagedTextMateRules = [];
          this.stagedSemanticTokens = {};
          if (profile.tokenColors) {
            const { textMateRules, ...catColors } = profile.tokenColors;
            this.stagedTokenColors = { ...(catColors as Record<string, string>) };
            if (textMateRules) {
              this.stagedTextMateRules = [...textMateRules];
            }
          }
          if (profile.semanticTokenColors) {
            this.stagedSemanticTokens = { ...profile.semanticTokenColors };
          }

          if (message.payload.applyImmediately) {
            const activeTheme = this.getActiveThemeName();
            const snapshot = this.configService.createSnapshot('Before Profile Load', this.currentScope, activeTheme);
            this.recoveryService.setInitialSnapshot(snapshot);

            await this.configService.applyWorkbenchColors(this.stagedColors, activeTheme, this.currentScope, true);
            if (Object.keys(this.stagedTokenColors).length > 0 || this.stagedTextMateRules.length > 0) {
              await this.configService.applyTokenColors(this.stagedTokenColors, this.stagedTextMateRules, activeTheme, this.currentScope, true);
            }
            if (Object.keys(this.stagedSemanticTokens).length > 0) {
              await this.configService.applySemanticTokens(this.stagedSemanticTokens, activeTheme, this.currentScope, true);
            }
            this.stagedColors = {};
            this.stagedTokenColors = {};
            this.stagedTextMateRules = [];
            this.stagedSemanticTokens = {};
          }

          this.broadcastState();
          break;
        }

        case 'DUPLICATE_PROFILE': {
          const dup = await this.profileService.duplicateProfile(
            message.payload.profileId,
            message.payload.newName
          );
          this.activeProfileId = dup.id;
          this.broadcastState();
          break;
        }

        case 'DELETE_PROFILE': {
          await this.profileService.deleteProfile(message.payload.profileId);
          if (this.activeProfileId === message.payload.profileId) {
            this.activeProfileId = undefined;
          }
          this.broadcastState();
          break;
        }

        case 'IMPORT_PROFILE': {
          const res = await this.profileService.importProfile(message.payload.rawJson);
          if (res.success && res.profile) {
            this.activeProfileId = res.profile.id;
            this.sendMessage({
              type: 'OPERATION_SUCCESS',
              payload: { message: `Imported profile "${res.profile.name}" successfully!` },
            });
          } else {
            this.systemLogService.error('extension-host', 'Failed to import profile', res.error);
            this.sendMessage({
              type: 'OPERATION_ERROR',
              payload: { message: 'Failed to import profile', error: res.error },
            });
          }
          this.broadcastState();
          break;
        }

        case 'EXPORT_PROFILE': {
          const profile = this.profileService.getProfile(message.payload.profileId);
          if (!profile) {
            this.systemLogService.warn('extension-host', `Export skipped: profile ${message.payload.profileId} not found.`);
            return;
          }

          if (
            message.payload.format === 'colorfly-profile' ||
            message.payload.format === 'ColorFly-profile'
          ) {
            const json = this.profileService.exportProfileJson(profile.id);
            if (json) {
              const doc = await vscode.workspace.openTextDocument({
                content: json,
                language: 'json',
              });
              await vscode.window.showTextDocument(doc);
            } else {
              this.systemLogService.warn('extension-host', `Profile ${profile.id} could not be serialized for export.`);
              vscode.window.showErrorMessage('ColorFly: Failed to serialize profile for export.');
            }
          } else if (message.payload.format === 'theme-json') {
            const themeJson = ThemeExportService.toVSCodeThemeJson(profile);
            const doc = await vscode.workspace.openTextDocument({
              content: themeJson,
              language: 'json',
            });
            await vscode.window.showTextDocument(doc);
          } else if (message.payload.format === 'extension-scaffold') {
            const scaffold = ThemeExportService.scaffoldThemeExtension(profile);
            const ws = vscode.workspace.workspaceFolders?.[0];
            if (ws) {
              try {
                const targetDir = await writeThemeScaffold(scaffold, ws.uri);
                vscode.window.showInformationMessage(
                  `ColorFly: Theme extension scaffold created in ./${scaffold.extensionName}`
                );
                this.systemLogService.info('extension-host', `Scaffold written to ${targetDir.fsPath}`);
              } catch (err: any) {
                if (err?.message === 'Scaffold export cancelled.') {
                  vscode.window.showInformationMessage('ColorFly: Scaffold export cancelled.');
                } else {
                  throw err;
                }
              }
            } else {
              const doc = await vscode.workspace.openTextDocument({
                content: scaffold.files['package.json'],
                language: 'json',
              });
              await vscode.window.showTextDocument(doc);
              vscode.window.showInformationMessage(
                `Theme Extension scaffold generated for ${scaffold.extensionName}. Open a workspace folder to save all files automatically.`
              );
            }
          }
          break;
        }

        case 'RAW_CONFIG_APPLY': {
          try {
            const parsed = JSON.parse(message.payload.json);
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
              throw new Error('Raw configuration must be a JSON object mapping color IDs to color values.');
            }
            const nonColorKeys = Object.entries(parsed)
              .filter(([, value]) => typeof value !== 'string' || !isValidColor(String(value)))
              .map(([key]) => key);
            if (nonColorKeys.length > 0) {
              this.systemLogService.warn(
                'extension-host',
                `Raw configuration contains ${nonColorKeys.length} non-standard value(s)`,
                nonColorKeys.slice(0, 20).join(', ')
              );
            }

            const activeTheme = this.getActiveThemeName();
            const snapshot = this.configService.createSnapshot(
              'Before Raw Configuration Apply',
              this.currentScope,
              activeTheme
            );
            this.recoveryService.setInitialSnapshot(snapshot);

            await this.configService.applyWorkbenchColors(
              parsed,
              activeTheme,
              this.currentScope,
              message.payload.themeScoped
            );
            this.broadcastState();
            vscode.window.showInformationMessage('ColorFly: Raw configuration applied.');
          } catch (err: any) {
            const errMsg = `Invalid configuration: ${err?.message || err}`;
            this.systemLogService.error('extension-host', errMsg, formatErrorDetail(err));
            vscode.window.showErrorMessage(errMsg);
            this.sendMessage({
              type: 'OPERATION_ERROR',
              payload: { message: errMsg },
            });
          }
          break;
        }

        case 'UPDATE_CLOCK_CONFIG': {
          const config = vscode.workspace.getConfiguration('colorfly');
          const resolveTarget = (key: string): vscode.ConfigurationTarget => {
            const inspection = config.inspect(key);
            return inspection?.workspaceValue !== undefined
              ? vscode.ConfigurationTarget.Workspace
              : vscode.ConfigurationTarget.Global;
          };
          if (message.payload.showClock !== undefined) {
            await config.update('showClock', message.payload.showClock, resolveTarget('showClock'));
          }
          if (message.payload.clockFormat !== undefined) {
            await config.update('clockFormat', message.payload.clockFormat, resolveTarget('clockFormat'));
          }
          if (message.payload.clockShowSeconds !== undefined) {
            await config.update(
              'clockShowSeconds',
              message.payload.clockShowSeconds,
              resolveTarget('clockShowSeconds')
            );
          }
          this.broadcastState();
          break;
        }

        case 'SET_ICON_THEME': {
          const { iconTheme } = message.payload;
          const config = vscode.workspace.getConfiguration('workbench');
          await config.update('iconTheme', iconTheme, vscode.ConfigurationTarget.Global);
          this.broadcastState();
          vscode.window.showInformationMessage(`ColorFly: Icon theme set to "${iconTheme}".`);
          break;
        }
      }
    } catch (err: any) {
      const message = formatErrorMessage(err);
      this.systemLogService.error('extension-host', message, formatErrorDetail(err));
      vscode.window.showErrorMessage(`ColorFly Error: ${message}`);
      this.sendMessage({
        type: 'OPERATION_ERROR',
        payload: { message },
      });
    }
  }

  public async applyStagedCustomizations(themeScoped: boolean): Promise<boolean> {
    const hasDrafts =
      Object.keys(this.stagedColors).length > 0 ||
      Object.keys(this.stagedTokenColors).length > 0 ||
      this.stagedTextMateRules.length > 0 ||
      Object.keys(this.stagedSemanticTokens).length > 0;

    if (!hasDrafts) {
      this.sendMessage({
        type: 'OPERATION_ERROR',
        payload: { message: 'No staged changes to apply.' },
      });
      vscode.window.showInformationMessage('ColorFly: No staged changes to apply.');
      return false;
    }

    const activeTheme = this.getActiveThemeName();
    const snapshot = this.configService.createSnapshot(
      'Before ColorFly Customization',
      this.currentScope,
      activeTheme
    );
    this.recoveryService.setInitialSnapshot(snapshot);

    if (Object.keys(this.stagedColors).length > 0) {
      await this.configService.applyWorkbenchColors(
        this.stagedColors,
        activeTheme,
        this.currentScope,
        themeScoped
      );
    }

    if (Object.keys(this.stagedTokenColors).length > 0 || this.stagedTextMateRules.length > 0) {
      await this.configService.applyTokenColors(
        this.stagedTokenColors,
        this.stagedTextMateRules,
        activeTheme,
        this.currentScope,
        themeScoped
      );
    }

    if (Object.keys(this.stagedSemanticTokens).length > 0) {
      await this.configService.applySemanticTokens(
        this.stagedSemanticTokens,
        activeTheme,
        this.currentScope,
        themeScoped
      );
    }

    this.stagedColors = {};
    this.stagedTokenColors = {};
    this.stagedTextMateRules = [];
    this.stagedSemanticTokens = {};

    this.systemLogService.info(
      'extension-host',
      `Applied staged customizations to "${activeTheme}" (${themeScoped ? 'theme-scoped' : 'global'})`
    );
    this.sendMessage({
      type: 'OPERATION_SUCCESS',
      payload: { message: 'Customizations applied to VS Code successfully!' },
    });
    vscode.window.showInformationMessage('ColorFly: Theme customizations applied successfully.');
    this.broadcastState();
    return true;
  }

  public clearStagedDrafts(): void {
    this.stagedColors = {};
    this.stagedTokenColors = {};
    this.stagedTextMateRules = [];
    this.stagedSemanticTokens = {};
    this.broadcastState();
  }

  public broadcastState(): void {
    const activeColorTheme = vscode.window.activeColorTheme;
    const themeName = this.getActiveThemeName();
    const effective = this.configService.getEffectiveWorkbenchColors(themeName, this.currentScope);
    const hasUnappliedDrafts =
      Object.keys(this.stagedColors).length > 0 ||
      Object.keys(this.stagedTokenColors).length > 0 ||
      this.stagedTextMateRules.length > 0 ||
      Object.keys(this.stagedSemanticTokens).length > 0;

    const initialSnapshot = this.recoveryService.getInitialSnapshot();

    let themeType: 'dark' | 'light' | 'hcDark' | 'hcLight' = 'dark';
    if (activeColorTheme.kind === vscode.ColorThemeKind.Light) themeType = 'light';
    else if (activeColorTheme.kind === vscode.ColorThemeKind.HighContrast) themeType = 'hcDark';
    else if (activeColorTheme.kind === vscode.ColorThemeKind.HighContrastLight) themeType = 'hcLight';

    const cfConfig = vscode.workspace.getConfiguration('colorfly');
    const clockConfig = {
      showClock: cfConfig.get<boolean>('showClock', true),
      clockFormat: cfConfig.get<'24h' | '12h'>('clockFormat', '24h'),
      clockShowSeconds: cfConfig.get<boolean>('clockShowSeconds', true),
    };

    const payload: ExtensionStatePayload = {
      activeThemeId: themeName,
      activeThemeName: themeName,
      activeThemeType: themeType,
      scope: this.currentScope,
      hasWorkspaceOpen: (vscode.workspace.workspaceFolders?.length ?? 0) > 0,
      workspaceName: vscode.workspace.name,
      effectiveColors: effective,
      stagedColors: this.stagedColors,
      stagedTokenColors: this.stagedTokenColors,
      stagedTextMateRules: this.stagedTextMateRules,
      stagedSemanticTokens: this.stagedSemanticTokens,
      savedProfiles: this.profileService.getProfiles(),
      activeProfileId: this.activeProfileId,
      hasUnappliedDrafts,
      lastSnapshotTimestamp: initialSnapshot?.timestamp,
      canRestoreSnapshot: !!initialSnapshot,
      clockConfig,
    };

    this.sendMessage({
      type: 'STATE_UPDATE',
      payload,
    });
  }

  private getActiveThemeName(): string {
    const workbenchConfig = vscode.workspace.getConfiguration('workbench');
    return workbenchConfig.get<string>('colorTheme') || 'Default Dark+';
  }

  private sendMessage(message: ExtensionToWebviewMessage): void {
    this.panel.webview.postMessage(message);
  }

  private updateWebviewContent(): void {
    const webview = this.panel.webview;
    const scriptPathOnDisk = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview.js');
    const stylePathOnDisk = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview.css');

    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
    const styleUri = webview.asWebviewUri(stylePathOnDisk);
    const distUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist'));

    const nonce = getNonce();

    this.panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ColorFly â€” Theme Studio</title>
  <link rel="stylesheet" type="text/css" href="${styleUri}">
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}">window.__CF_ASSET_BASE__ = "${distUri}/";</script>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  public dispose(): void {
    ThemeStudioEditorPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) d.dispose();
    }
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

