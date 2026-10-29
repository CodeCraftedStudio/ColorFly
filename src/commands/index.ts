/**
 * ColorFly: Extension Commands Registration
 */

import * as vscode from 'vscode';
import { ConfigurationService } from '../services/ConfigurationService';
import { ProfileService } from '../services/ProfileService';
import { RecoveryService } from '../services/RecoveryService';
import { ThemeStudioEditorPanel } from '../panels/ThemeStudioEditorPanel';
import { ThemeExportService } from '../services/ThemeExportService';
import { SystemLogService, formatErrorDetail, formatErrorMessage } from '../services/SystemLogService';
import { writeThemeScaffold } from '../services/ThemeScaffoldWriter';

export function registerCommands(
  context: vscode.ExtensionContext,
  configService: ConfigurationService,
  profileService: ProfileService,
  recoveryService: RecoveryService,
  systemLogService: SystemLogService
): void {
  // 1. Open Full Theme Studio in Editor Area
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.openStudio', () => {
      ThemeStudioEditorPanel.createOrShow(
        context.extensionUri,
        configService,
        profileService,
        recoveryService,
        systemLogService
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
      const panel = ThemeStudioEditorPanel.currentPanel;
      if (!panel) {
        systemLogService.warn('command', 'Apply requested but the Theme Studio panel is not open');
        vscode.window.showWarningMessage(
          'ColorFly: Open the Theme Studio, stage your changes, then run this command.'
        );
        return;
      }
      try {
        await panel.applyStagedCustomizations(true);
      } catch (err: any) {
        systemLogService.error('command', formatErrorMessage(err), formatErrorDetail(err));
        vscode.window.showErrorMessage(`ColorFly: Apply failed — ${err?.message || err}`);
      }
    })
  );

  // 4. Restore Pre-Customization Snapshot
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.resetCustomizations', async () => {
      const initialSnapshot = recoveryService.getInitialSnapshot();
      if (!initialSnapshot) {
        systemLogService.warn('command', 'Restore requested but no pre-customization snapshot is available');
        vscode.window.showInformationMessage('ColorFly: No pre-customization snapshot recorded yet.');
        return;
      }

      const answer = await vscode.window.showWarningMessage(
        'Are you sure you want to restore VS Code configuration to its state before ColorFly customizations were applied?',
        { modal: true },
        'Restore Configuration'
      );

      if (answer === 'Restore Configuration') {
        try {
          await configService.restoreSnapshot(initialSnapshot);
          ThemeStudioEditorPanel.currentPanel?.clearStagedDrafts();
          systemLogService.info('command', 'Configuration restored from pre-customization snapshot');
          vscode.window.showInformationMessage('ColorFly: Original configuration restored successfully.');
        } catch (err: any) {
          systemLogService.error('command', formatErrorMessage(err), formatErrorDetail(err));
          vscode.window.showErrorMessage(`ColorFly: Restore failed — ${err?.message || err}`);
        }
      }
    })
  );

  // 5. Export Active Profile
  context.subscriptions.push(
    vscode.commands.registerCommand('colorfly.exportTheme', async () => {
      try {
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
        if (!profile) {
          vscode.window.showErrorMessage('ColorFly: Selected profile no longer exists.');
          return;
        }

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
          } else {
            vscode.window.showErrorMessage('ColorFly: Failed to serialize profile for export.');
          }
        } else if (formatChoice.value === 'extension-scaffold') {
          const scaffold = ThemeExportService.scaffoldThemeExtension(profile);
          const ws = vscode.workspace.workspaceFolders?.[0];
          if (ws) {
            const targetDir = await writeThemeScaffold(scaffold, ws.uri);
            systemLogService.info('command', `Scaffold written to ${targetDir.fsPath}`);
            vscode.window.showInformationMessage(
              `ColorFly: Theme extension scaffold created in ./${scaffold.extensionName}`
            );
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
      } catch (err: any) {
        if (err?.message === 'Scaffold export cancelled.') {
          vscode.window.showInformationMessage('ColorFly: Scaffold export cancelled.');
          return;
        }
        systemLogService.error('command', formatErrorMessage(err), formatErrorDetail(err));
        vscode.window.showErrorMessage(`ColorFly: Export failed — ${err?.message || err}`);
      }
    })
  );
}

