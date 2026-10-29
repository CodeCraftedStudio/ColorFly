/**
 * ColorFly: Extension Activation & Lifecycle
 */

import * as vscode from 'vscode';
import { VSCodeConfigAccessor } from './services/VSCodeConfigAccessor';
import { ConfigurationService } from './services/ConfigurationService';
import { VSCodeProfileStorage } from './services/VSCodeProfileStorage';
import { ProfileService } from './services/ProfileService';
import { RecoveryService } from './services/RecoveryService';
import { ThemeStudioSidebarProvider } from './views/ThemeStudioSidebarProvider';
import { ClockStatusBarWidget } from './services/ClockStatusBarWidget';
import { SystemLogService } from './services/SystemLogService';
import { registerCommands } from './commands';

export function activate(context: vscode.ExtensionContext): void {
  // 0. Initialize System Log Capture
  const systemLogService = new SystemLogService();
  systemLogService.info('extension-host', 'ColorFly extension activated');

  // 1. Initialize Core Services
  const configAccessor = new VSCodeConfigAccessor();
  const configService = new ConfigurationService(configAccessor);

  const profileStorage = new VSCodeProfileStorage(context.globalState);
  const profileService = new ProfileService(profileStorage);

  const recoveryService = new RecoveryService();

  // 2. Initialize Status Bar Live Boxed Clock
  const clockWidget = new ClockStatusBarWidget();
  context.subscriptions.push(clockWidget);

  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.toggleClock', async () => {
      const isEnabled = await clockWidget.toggle();
      vscode.window.showInformationMessage(
        `ColorFly Clock: ${isEnabled ? 'Enabled' : 'Disabled'}`
      );
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('colorfly')) {
        clockWidget.update();
      }
    })
  );

  // Capture pristine snapshot of initial configuration before any ColorFly operation
  const activeTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme') || 'Default Dark+';
  const initialSnapshot = configService.createSnapshot('Initial activation state', 'user', activeTheme);
  recoveryService.setInitialSnapshot(initialSnapshot);

  // 2. Register Activity Bar Sidebar View
  const sidebarProvider = new ThemeStudioSidebarProvider(
    context.extensionUri,
    configService,
    profileService
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ThemeStudioSidebarProvider.viewType,
      sidebarProvider,
      {
        webviewOptions: { retainContextWhenHidden: true },
      }
    )
  );

  // 3. Register All Extension Commands
  registerCommands(context, configService, profileService, recoveryService, systemLogService);
}

export function deactivate(): void {
  // Clean up any remaining resources if needed
}


