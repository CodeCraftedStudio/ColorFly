/**
 * ChromaForge: Recovery & Snapshot Service
 * Tracks edit history, undo/redo stacks, and maintains safe pre-customization snapshots.
 */

import { ConfigSnapshot } from '../shared/types';

export interface HistoryEntry {
  type: 'color' | 'token' | 'semantic' | 'bulk';
  key: string;
  previousValue: any;
  newValue: any;
  timestamp: string;
}

export class RecoveryService {
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];
  private initialSnapshot: ConfigSnapshot | null = null;
  private maxHistorySize = 50;

  /**
   * Sets the initial pre-customization snapshot if not already recorded.
   */
  public setInitialSnapshot(snapshot: ConfigSnapshot): void {
    if (!this.initialSnapshot) {
      this.initialSnapshot = snapshot;
    }
  }

  /**
   * Returns the initial snapshot captured before changes were applied.
   */
  public getInitialSnapshot(): ConfigSnapshot | null {
    return this.initialSnapshot;
  }

  /**
   * Records a user modification for undo/redo tracking.
   */
  public recordChange(entry: Omit<HistoryEntry, 'timestamp'>): void {
    this.undoStack.push({
      ...entry,
      timestamp: new Date().toISOString(),
    });

    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }

    // Any new change clears the redo stack
    this.redoStack = [];
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public undo(): HistoryEntry | null {
    const entry = this.undoStack.pop();
    if (!entry) return null;
    this.redoStack.push(entry);
    return entry;
  }

  public redo(): HistoryEntry | null {
    const entry = this.redoStack.pop();
    if (!entry) return null;
    this.undoStack.push(entry);
    return entry;
  }

  public clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

