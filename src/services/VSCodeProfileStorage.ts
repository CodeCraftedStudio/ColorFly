/**
 * ColorFly: Concrete VS Code Memento Profile Storage
 */

import * as vscode from 'vscode';
import { IProfileStorage } from './ProfileService';

export class VSCodeProfileStorage implements IProfileStorage {
  private memento: vscode.Memento;

  constructor(memento: vscode.Memento) {
    this.memento = memento;
  }

  public get<T>(key: string, defaultValue?: T): T {
    return this.memento.get<T>(key, defaultValue as T);
  }

  public async update(key: string, value: any): Promise<void> {
    await this.memento.update(key, value);
  }
}


