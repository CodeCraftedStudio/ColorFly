/**
 * ChromaForge: Typed VS Code Webview API Wrapper
 */

import { ExtensionToWebviewMessage, WebviewToExtensionMessage } from '../shared/types';

interface VsCodeApi {
  postMessage(message: WebviewToExtensionMessage): void;
  getState(): any;
  setState(state: any): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

let vscodeInstance: VsCodeApi | null = null;

export function getVsCodeApi(): VsCodeApi {
  if (!vscodeInstance) {
    if (typeof acquireVsCodeApi === 'function') {
      vscodeInstance = acquireVsCodeApi();
    } else {
      // In-browser mock for standalone testing if needed
      vscodeInstance = {
        postMessage: (msg) => console.log('[Mock VS Code PostMessage]:', msg),
        getState: () => ({}),
        setState: () => {},
      };
    }
  }
  return vscodeInstance;
}

export function sendToExtension(message: WebviewToExtensionMessage): void {
  getVsCodeApi().postMessage(message);
}

