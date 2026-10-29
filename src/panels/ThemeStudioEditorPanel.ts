/**
 * ChromaForge: Full Editor-Area Webview Panel
 * Provides single-instance management, secure CSP HTML generation,
 * and robust RPC message handling.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
  ColorScope,
  ExtensionStatePayload,
  ExtensionToWebviewMessage,
  ThemeProfile,
  WebviewToExtensionMessage,
} from '../shared/types';
import { ConfigurationService } from '../services/ConfigurationService';
import { ProfileService } from '../services/ProfileService';
import { RecoveryService } from '../services/RecoveryService';
import { ThemeExportService } from '../services/ThemeExportService';

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
    private recoveryService: RecoveryService
  ) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    // Set webview initial HTML content
    this.updateWebviewContent();

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
    recoveryService: RecoveryService
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
      'ColorFly — Theme Studio',
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
      recoveryService
    );

    return ThemeStudioEditorPanel.currentPanel;
  }

  private async handleMessage(message: WebviewToExtensionMessage): Promise<void> {
    try {
      switch (message.type) {
        case 'READY': {
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
          // Clean staged colors in that category
          const toRemove: string[] = [];
          for (const key of Object.keys(this.stagedColors)) {
            if (key.toLowerCase().startsWith(category.toLowerCase())) {
              toRemove.push(key);
            }
          }
          toRemove.forEach((k) => delete this.stagedColors[k]);
          this.broadcastState();
          break;
        }

        case 'STAGE_TOKEN_COLOR': {
          const { key, value } = message.payload;
          this.stagedTokenColors[key] = value;
          this.broadcastState();
          break;
        }

        case 'UPDATE_TEXTMATE_RULES': {
          this.stagedTextMateRules = message.payload.rules;
          this.broadcastState();
          break;
        }

        case 'UPDATE_SEMANTIC_TOKENS': {
          this.stagedSemanticTokens = message.payload.tokens;
          this.broadcastState();
          break;
        }

        case 'APPLY_CUSTOMIZATIONS': {
          const activeTheme = this.getActiveThemeName();

          // Ensure snapshot is captured prior to first write
          const snapshot = this.configService.createSnapshot(
            'Before ChromaForge Customization',
            this.currentScope,
            activeTheme
          );
          this.recoveryService.setInitialSnapshot(snapshot);

          // Apply workbench colors
          if (Object.keys(this.stagedColors).length > 0) {
            await this.configService.applyWorkbenchColors(
              this.stagedColors,
              activeTheme,
              this.currentScope,
              message.payload.themeScoped
            );
          }

          // Apply token colors
          if (
            Object.keys(this.stagedTokenColors).length > 0 ||
            this.stagedTextMateRules.length > 0
          ) {
            await this.configService.applyTokenColors(
              this.stagedTokenColors,
              this.stagedTextMateRules,
              activeTheme,
              this.currentScope,
              message.payload.themeScoped
            );
          }

          // Apply semantic tokens
          if (Object.keys(this.stagedSemanticTokens).length > 0) {
            await this.configService.applySemanticTokens(
              this.stagedSemanticTokens,
              activeTheme,
              this.currentScope,
              message.payload.themeScoped
            );
          }

          // Clear staged drafts once successfully applied
          this.stagedColors = {};
          this.stagedTokenColors = {};
          this.stagedTextMateRules = [];
          this.stagedSemanticTokens = {};

          this.sendMessage({
            type: 'OPERATION_SUCCESS',
            payload: { message: 'Customizations applied to VS Code successfully!' },
          });
          vscode.window.showInformationMessage('ColorFly: Theme customizations applied successfully.');
          this.broadcastState();
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
            vscode.window.showErrorMessage(`Profile ${message.payload.profileId} not found.`);
            return;
          }

          this.activeProfileId = profile.id;
          this.stagedColors = { ...profile.workbenchColors };
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
            this.stagedColors = {};
            this.stagedTokenColors = {};
            this.stagedTextMateRules = [];
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
          if (!profile) return;

          if (message.payload.format === 'colorfly-profile') {
            const json = this.profileService.exportProfileJson(profile.id);
            if (json) {
              const doc = await vscode.workspace.openTextDocument({
                content: json,
                language: 'json',
              });
              await vscode.window.showTextDocument(doc);
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
            // If a workspace folder is open, ask user if they want to write the folder
            const ws = vscode.workspace.workspaceFolders?.[0];
            if (ws) {
              const targetDir = path.join(ws.uri.fsPath, scaffold.extensionName);
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              for (const [relPath, content] of Object.entries(scaffold.files)) {
                const fullPath = path.join(targetDir, relPath);
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(fullPath, content, 'utf8');
              }
              vscode.window.showInformationMessage(
                `ColorFly: Theme extension scaffold created in ./${scaffold.extensionName}`
              );
            } else {
              // Open package.json in editor as sample
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
            const activeTheme = this.getActiveThemeName();
            await this.configService.applyWorkbenchColors(
              parsed,
              activeTheme,
              this.currentScope,
              message.payload.themeScoped
            );
            this.broadcastState();
            vscode.window.showInformationMessage('ColorFly: Raw configuration applied.');
          } catch (err: any) {
            vscode.window.showErrorMessage(`Invalid JSON: ${err?.message || err}`);
          }
          break;
        }

        case 'UPDATE_CLOCK_CONFIG': {
          const config = vscode.workspace.getConfiguration('colorfly');
          if (message.payload.showClock !== undefined) {
            await config.update('showClock', message.payload.showClock, vscode.ConfigurationTarget.Global);
          }
          if (message.payload.clockFormat !== undefined) {
            await config.update('clockFormat', message.payload.clockFormat, vscode.ConfigurationTarget.Global);
          }
          if (message.payload.clockShowSeconds !== undefined) {
            await config.update('clockShowSeconds', message.payload.clockShowSeconds, vscode.ConfigurationTarget.Global);
          }
          this.broadcastState();
          break;
        }
      }
    } catch (err: any) {
      vscode.window.showErrorMessage(`ColorFly Error: ${err?.message || err}`);
      this.sendMessage({
        type: 'OPERATION_ERROR',
        payload: { message: err?.message || 'Operation failed' },
      });
    }
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

    const nonce = getNonce();

    this.panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ColorFly — Theme Studio</title>
  <link rel="stylesheet" type="text/css" href="${styleUri}">
</head>
<body>
  <div id="root"></div>
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
