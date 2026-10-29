/**
 * ColorFly: Activity Bar Sidebar Webview Provider
 * Renders the mini-studio sidebar with active status, profile selector,
 * quick color tweaks, and the prominent "Open Theme Studio in Editor" action.
 */

import * as vscode from 'vscode';
import { ConfigurationService } from '../services/ConfigurationService';
import { ProfileService } from '../services/ProfileService';

export class ThemeStudioSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'colorfly.sidebarView';
  private view?: vscode.WebviewView;
  private disposables: vscode.Disposable[] = [];
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly configService: ConfigurationService,
    private readonly profileService: ProfileService
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;
    this.clearDisposables();

    webviewView.onDidDispose(() => {
      this.view = undefined;
      this.clearDisposables();
      this.clearRefreshTimer();
    });

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, 'dist'),
        vscode.Uri.joinPath(this.extensionUri, 'assets'),
      ],
    };

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'OPEN_FULL_STUDIO': {
          await vscode.commands.executeCommand('colorfly.openStudio');
          break;
        }
        case 'APPLY_PRESET': {
          const profile = this.profileService.getProfile(data.presetId);
          if (profile) {
            const activeTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme') || 'Default Dark+';
            await this.configService.applyWorkbenchColors(profile.workbenchColors, activeTheme, 'user', true);
            vscode.window.showInformationMessage(`ColorFly: Preset "${profile.name}" applied.`);
            this.refresh();
          }
          break;
        }
        case 'RESET_OVERRIDES': {
          const activeTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme') || 'Default Dark+';
          const choice = await vscode.window.showWarningMessage('Reset all ColorFly workbench color customizations?', 'Reset', 'Cancel');
          if (choice === 'Reset') {
            await this.configService.resetAllColors(activeTheme, 'user');
            vscode.window.showInformationMessage('ColorFly: Customizations reset.');
            this.refresh();
          }
          break;
        }
        case 'QUICK_COLOR_CHANGE': {
          const activeTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme') || 'Default Dark+';
          await this.configService.applyWorkbenchColors({ [data.id]: data.value }, activeTheme, 'user', true);
          break;
        }
      }
    });

    // Listen for theme and configuration changes to refresh the sidebar
    this.disposables.push(
      vscode.window.onDidChangeActiveColorTheme(() => this.refresh()),
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (
          e.affectsConfiguration('workbench.colorCustomizations') ||
          e.affectsConfiguration('editor.tokenColorCustomizations') ||
          e.affectsConfiguration('editor.semanticTokenColorCustomizations') ||
          e.affectsConfiguration('colorfly')
        ) {
          this.refresh();
        }
      }),
      webviewView.onDidChangeVisibility(() => {
        if (webviewView.visible) this.refresh();
      })
    );
  }

  private clearDisposables(): void {
    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      disposable?.dispose();
    }
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  public refresh(): void {
    this.clearRefreshTimer();
    this.refreshTimer = setTimeout(() => {
      this.refreshTimer = null;
      if (this.view && this.view.visible) {
        this.view.webview.html = this.getHtmlForWebview(this.view.webview);
      }
    }, 150);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const activeTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme') || 'Default Dark+';
    const effective = this.configService.getEffectiveWorkbenchColors(activeTheme, 'user');
    const profiles = this.profileService.getProfiles();
    const customCount = Object.keys(effective).length;

    const editorBg = safeCssColor(effective['editor.background'], '#1e1e1e');
    const activityBg = safeCssColor(effective['activityBar.background'], '#333333');
    const sidebarBg = safeCssColor(effective['sideBar.background'], '#252526');
    const statusBg = safeCssColor(effective['statusBar.background'], '#007acc');

    const presetsOptions = profiles
      .map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`)
      .join('');

    const iconUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'assets', 'icon-32.png'));
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>ColorFly Sidebar</title>
  <style>
    body {
      padding: 12px;
      font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif);
      color: var(--vscode-foreground);
      font-size: var(--vscode-font-size, 13px);
      line-height: 1.4;
      box-sizing: border-box;
      margin: 0;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--vscode-panel-border, #333333);
    }
    .logo-img {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      object-fit: cover;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    }
    .title-block h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--vscode-foreground);
    }
    .title-block p {
      margin: 0;
      font-size: 11px;
      color: var(--vscode-descriptionForeground, #888888);
    }
    .btn-primary {
      width: 100%;
      background: var(--vscode-button-background, #0e639c);
      color: var(--vscode-button-foreground, #ffffff);
      border: 1px solid transparent;
      padding: 9px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.15s ease;
      margin-bottom: 16px;
    }
    .btn-primary:hover {
      background: var(--vscode-button-hoverBackground, #1177bb);
    }
    .card {
      background: var(--vscode-sideBar-background);
      border: 1px solid var(--vscode-widget-border, #3c3c3c);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 14px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
    }
    .stat-label {
      color: var(--vscode-descriptionForeground, #999);
    }
    .stat-value {
      font-weight: 500;
      color: var(--vscode-foreground);
    }
    .swatches-strip {
      display: flex;
      height: 20px;
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
      border: 1px solid var(--vscode-widget-border, #444);
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
    }
    .swatch-item {
      flex: 1;
      height: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.2);
    }
    .swatch-item:last-child {
      border-right: none;
    }
    .btn-secondary {
      width: 100%;
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #ffffff);
      border: 1px solid transparent;
      padding: 7px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
    }
    .btn-secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground, #45494e);
    }
    select {
      width: 100%;
      background: var(--vscode-dropdown-background, #3c3c3c);
      color: var(--vscode-dropdown-foreground, #f0f0f0);
      border: 1px solid var(--vscode-dropdown-border, #3c3c3c);
      padding: 6px;
      border-radius: 4px;
      margin-top: 6px;
      margin-bottom: 8px;
      outline: none;
      font-size: 12px;
    }
    .quick-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--vscode-descriptionForeground, #888);
      margin-top: 10px;
      margin-bottom: 4px;
      font-weight: 600;
    }
    .footer-help {
      font-size: 11px;
      color: var(--vscode-descriptionForeground, #888);
      margin-top: 14px;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${iconUri}" alt="ColorFly Logo" class="logo-img" />
    <div class="title-block">
      <h3>ColorFly</h3>
      <p>Theme Studio v1.0</p>
    </div>
  </div>

  <button class="btn-primary" id="openEditorBtn">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="3" x2="9" y2="21"></line>
    </svg>
    Open Theme Studio in Editor
  </button>

  <div class="card">
    <div class="stat-row">
      <span class="stat-label">Active Theme:</span>
      <span class="stat-value">${escapeHtml(activeTheme)}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Active Overrides:</span>
      <span class="stat-value">${customCount} colors</span>
    </div>

    <div class="quick-label">Active Palette Preview</div>
    <div class="swatches-strip" title="Editor, Activity Bar, Sidebar, Status Bar">
      <div class="swatch-item" style="background: ${editorBg}" title="Editor: ${editorBg}"></div>
      <div class="swatch-item" style="background: ${activityBg}" title="Activity Bar: ${activityBg}"></div>
      <div class="swatch-item" style="background: ${sidebarBg}" title="Sidebar: ${sidebarBg}"></div>
      <div class="swatch-item" style="background: ${statusBg}" title="Status Bar: ${statusBg}"></div>
    </div>
    ${customCount > 0 ? `
    <button class="btn-secondary" id="resetOverridesBtn" style="color: #f87171;">
      Reset Active Overrides
    </button>
    ` : ''}
  </div>

  <div class="card">
    <div class="quick-label">Quick Starter Preset</div>
    <select id="presetSelect">
      <option value="">Select a preset to apply...</option>
      ${presetsOptions}
    </select>
  </div>

  <div class="footer-help">
    Launch the full Theme Studio in the editor tab for live syntax highlighting, WCAG contrast analyzer, advanced color picker, and profile manager.
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    const resetBtn = document.getElementById('resetOverridesBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        vscode.postMessage({ type: 'RESET_OVERRIDES' });
      });
    }

    document.getElementById('openEditorBtn').addEventListener('click', () => {
      vscode.postMessage({ type: 'OPEN_FULL_STUDIO' });
    });

    document.getElementById('presetSelect').addEventListener('change', (e) => {
      const presetId = e.target.value;
      if (presetId) {
        vscode.postMessage({ type: 'APPLY_PRESET', presetId });
        e.target.value = '';
      }
    });
  </script>
</body>
</html>`;
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const CSS_COLOR_PATTERN = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))$/;

function safeCssColor(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  return CSS_COLOR_PATTERN.test(trimmed) ? trimmed : fallback;
}

