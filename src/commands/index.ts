/**
 * ColorFly: Extension Commands Registration
 */

import * as vscode from 'vscode';
import { ConfigurationService } from '../services/ConfigurationService';
import { ProfileService } from '../services/ProfileService';
import { RecoveryService } from '../services/RecoveryService';
import { ThemeStudioEditorPanel } from '../panels/ThemeStudioEditorPanel';
import { ThemeExportService } from '../services/ThemeExportService';

export function registerCommands(
  context: vscode.ExtensionContext,
  configService: ConfigurationService,
  profileService: ProfileService,
  recoveryService: RecoveryService
): void {
  // 1. Open Full Theme Studio in Editor Area
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.openStudio', () => {
      ThemeStudioEditorPanel.createOrShow(
        context.extensionUri,
        configService,
        profileService,
        recoveryService
      );
    })
  );

  // 2. Focus Activity Bar Sidebar View
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.openSidebar', async () => {
      await vscode.commands.executeCommand('workbench.view.extension.colorfly-activitybar');
    })
  );

  // 3. Apply Staged Customizations
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.applyCustomizations', async () => {
      if (ThemeStudioEditorPanel.currentPanel) {
        ThemeStudioEditorPanel.currentPanel.broadcastState();
      }
      vscode.window.showInformationMessage('ColorFly: Staged customizations applied.');
    })
  );

  // 4. Restore Pre-Customization Snapshot
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.resetCustomizations', async () => {
      const initialSnapshot = recoveryService.getInitialSnapshot();
      if (!initialSnapshot) {
        vscode.window.showInformationMessage('ColorFly: No pre-customization snapshot recorded yet.');
        return;
      }

      const answer = await vscode.window.showWarningMessage(
        'Are you sure you want to restore VS Code configuration to its state before ColorFly customizations were applied?',
        { modal: true },
        'Restore Configuration'
      );

      if (answer === 'Restore Configuration') {
        await configService.restoreSnapshot(initialSnapshot);
        if (ThemeStudioEditorPanel.currentPanel) {
          ThemeStudioEditorPanel.currentPanel.broadcastState();
        }
        vscode.window.showInformationMessage('ColorFly: Original configuration restored successfully.');
      }
    })
  );

  // 5. Export Active Profile
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.exportTheme', async () => {
      const profiles = profileService.getProfiles();
      const items = profiles.map((p) => ({
        label: p.name,
        description: p.description || (p.isBuiltIn ? 'Built-in preset' : 'Custom profile'),
        profileId: p.id,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a theme profile to export',
      });

      if (!selected) return;

      const profile = profileService.getProfile(selected.profileId);
      if (!profile) return;

      const formatChoice = await vscode.window.showQuickPick(
        [
          { label: 'Standalone VS Code Color Theme (JSON)', value: 'theme-json' },
          { label: 'ColorFly Profile Backup (JSON)', value: 'colorfly-profile' },
          { label: 'Full Installable Extension Scaffold', value: 'extension-scaffold' },
        ],
        { placeHolder: 'Choose export format' }
      );

      if (!formatChoice) return;

      if (formatChoice.value === 'theme-json') {
        const themeJson = ThemeExportService.toVSCodeThemeJson(profile);
        const doc = await vscode.workspace.openTextDocument({
          content: themeJson,
          language: 'json',
        });
        await vscode.window.showTextDocument(doc);
      } else if (formatChoice.value === 'colorfly-profile') {
        const profileJson = profileService.exportProfileJson(profile.id);
        if (profileJson) {
          const doc = await vscode.workspace.openTextDocument({
            content: profileJson,
            language: 'json',
          });
          await vscode.window.showTextDocument(doc);
        }
      } else if (formatChoice.value === 'extension-scaffold') {
        const scaffold = ThemeExportService.scaffoldThemeExtension(profile);
        const doc = await vscode.workspace.openTextDocument({
          content: scaffold.files['package.json'],
          language: 'json',
        });
        await vscode.window.showTextDocument(doc);
        vscode.window.showInformationMessage(
          `Scaffolded ${scaffold.extensionName}. Check editor for package.json!`
        );
      }
    })
  );
}

