/**
 * ColorFly: Concrete VS Code Configuration Accessor
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

    // Empty objects and nullish values mean "no customization": remove the
    // key instead of writing `{}` into settings.json.
    let normalized = value;
    if (value === undefined || value === null) {
      normalized = undefined;
    } else if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
      normalized = undefined;
    }

    await config.update(section, normalized, vscodeTarget);
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


