/**
 * ChromaForge: Live Status Bar Clock Widget
 * Renders a clean boxed-frame clock with live seconds in the VS Code status bar.
 * Configurable via extension settings and the Theme Studio GUI.
 */

import * as vscode from 'vscode';

export class ClockStatusBarWidget implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;
  private timer: NodeJS.Timeout | null = null;
  private isDisposed: boolean = false;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      1000
    );
    this.statusBarItem.command = 'colorfly.openStudio';
    this.statusBarItem.tooltip = 'ColorFly Live Clock — Click to open Theme Studio';

    this.update();
    this.startTimer();
  }

  public startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.update();
    }, 1000);
  }

  public stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public update(): void {
    if (this.isDisposed) return;

    const config = vscode.workspace.getConfiguration('colorfly');
    const enabled = config.get<boolean>('showClock', true);

    if (!enabled) {
      this.statusBarItem.hide();
      return;
    }

    const format = config.get<'24h' | '12h'>('clockFormat', '24h');
    const showSeconds = config.get<boolean>('clockShowSeconds', true);

    const now = new Date();
    let timeStr = '';

    if (format === '12h') {
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      const hrsStr = hours.toString().padStart(2, '0');
      const minsStr = now.getMinutes().toString().padStart(2, '0');

      if (showSeconds) {
        const secsStr = now.getSeconds().toString().padStart(2, '0');
        timeStr = `${hrsStr}:${minsStr}:${secsStr} ${ampm}`;
      } else {
        timeStr = `${hrsStr}:${minsStr} ${ampm}`;
      }
    } else {
      const hrsStr = now.getHours().toString().padStart(2, '0');
      const minsStr = now.getMinutes().toString().padStart(2, '0');

      if (showSeconds) {
        const secsStr = now.getSeconds().toString().padStart(2, '0');
        timeStr = `${hrsStr}:${minsStr}:${secsStr}`;
      } else {
        timeStr = `${hrsStr}:${minsStr}`;
      }
    }

    // Boxed frame presentation
    this.statusBarItem.text = `$(clock) [ ${timeStr} ]`;
    this.statusBarItem.show();
  }

  public async toggle(): Promise<boolean> {
    const config = vscode.workspace.getConfiguration('colorfly');
    const current = config.get<boolean>('showClock', true);
    await config.update('showClock', !current, vscode.ConfigurationTarget.Global);
    this.update();
    return !current;
  }

  public dispose(): void {
    this.isDisposed = true;
    this.stopTimer();
    this.statusBarItem.dispose();
  }
}

