/**
 * ColorFly: Theme Scaffold Writer
 * Safely writes a generated theme-extension scaffold into a workspace folder
 * using workspace.fs (remote-friendly) with an overwrite confirmation prompt.
 */

import * as vscode from 'vscode';

export interface ThemeScaffoldPayload {
  extensionName: string;
  files: Record<string, string>;
}

export const SCAFFOLD_CANCELLED = 'Scaffold export cancelled.';

export async function writeThemeScaffold(
  scaffold: ThemeScaffoldPayload,
  workspaceUri: vscode.Uri
): Promise<vscode.Uri> {
  const targetDir = vscode.Uri.joinPath(workspaceUri, scaffold.extensionName);
  const exists = await vscode.workspace.fs
    .stat(targetDir)
    .then(
      () => true,
      () => false
    );

  if (exists) {
    const choice = await vscode.window.showWarningMessage(
      `Folder "./${scaffold.extensionName}" already exists. Its files will be overwritten.`,
      { modal: true },
      'Overwrite',
      'Cancel'
    );
    if (choice !== 'Overwrite') {
      throw new Error(SCAFFOLD_CANCELLED);
    }
  }

  for (const [relPath, content] of Object.entries(scaffold.files)) {
    const segments = relPath.split('/').filter((segment) => segment.length > 0);
    const fileUri = vscode.Uri.joinPath(targetDir, ...segments);
    const parentUri = vscode.Uri.joinPath(fileUri, '..');
    await vscode.workspace.fs.createDirectory(parentUri);
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
  }

  return targetDir;
}
