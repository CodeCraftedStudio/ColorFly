/**
 * ChromaForge: Concrete VS Code Configuration Accessor
 */

import * as vscode from 'vscode';
import { IConfigAccessor } from './ConfigurationService';
import { ColorScope } from '../shared/types';

export class VSCodeConfigAccessor implements IConfigAccessor {
  public get<T>(section: string, defaultValue?: T): T {
    const config = vscode.workspace.getConfiguration();
    return config.get<T>(section, defaultValue as T);
  }

  public async update(section: string, value: any, target: ColorScope): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    const vscodeTarget = target === 'workspace'
      ? vscode.ConfigurationTarget.Workspace
      : vscode.ConfigurationTarget.Global;

    await config.update(section, value, vscodeTarget);
  }

  public inspect<T>(section: string): {
    key: string;
    defaultValue?: T;
    globalValue?: T;
    workspaceValue?: T;
  } | undefined {
    const config = vscode.workspace.getConfiguration();
    const result = config.inspect<T>(section);
    if (!result) return undefined;

    return {
      key: result.key,
      defaultValue: result.defaultValue,
      globalValue: result.globalValue,
      workspaceValue: result.workspaceValue,
    };
  }
}

