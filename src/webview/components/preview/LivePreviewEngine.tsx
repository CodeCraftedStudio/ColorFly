/**
 * ChromaForge: Live Visual Preview Engine
 * Multi-scene interactive simulation with realistic syntax rendering and vector icons.
 */

import React, { useState } from 'react';
import {
  FolderIcon,
  SearchIcon,
  GitBranchIcon,
  SettingsIcon,
  FileIcon,
  CodeIcon,
  WrenchIcon,
  TerminalIcon,
} from '../common/Icons';

interface LivePreviewEngineProps {
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  stagedTokenColors: Record<string, string>;
}

export const LivePreviewEngine: React.FC<LivePreviewEngineProps> = ({
  effectiveColors = {},
  stagedColors = {},
  stagedTokenColors = {},
}) => {
  const [activeScene, setActiveScene] = useState<'editor' | 'terminal' | 'diff'>('editor');
  const [editorLanguage, setEditorLanguage] = useState<'typescript' | 'python' | 'json' | 'html'>('typescript');

  // Colors applied in the preview
  const colors = { ...(effectiveColors || {}), ...(stagedColors || {}) };
  const tokens = stagedTokenColors || {};

  // Theme variables for the preview container
  const editorBg = colors['editor.background'] || '#1e1e1e';
  const editorFg = colors['editor.foreground'] || '#d4d4d4';
  const lineNumColor = colors['editorLineNumber.foreground'] || '#858585';
  const activeLineNum = colors['editorLineNumber.activeForeground'] || '#c6c6c6';
  const lineHighlight = colors['editor.lineHighlightBackground'] || 'rgba(255, 255, 255, 0.04)';

  const activityBg = colors['activityBar.background'] || '#333333';
  const activityFg = colors['activityBar.foreground'] || '#ffffff';
  const activityBadgeBg = colors['activityBarBadge.background'] || '#007acc';
  const activityBadgeFg = colors['activityBarBadge.foreground'] || '#ffffff';

  const sidebarBg = colors['sideBar.background'] || '#252526';
  const sidebarFg = colors['sideBar.foreground'] || '#cccccc';
  const sidebarTitleFg = colors['sideBarTitle.foreground'] || '#bbbbbb';

  const titleBarBg = colors['titleBar.activeBackground'] || '#3c3c3c';
  const titleBarFg = colors['titleBar.activeForeground'] || '#cccccc';

  const tabActiveBg = colors['tab.activeBackground'] || '#1e1e1e';
  const tabActiveFg = colors['tab.activeForeground'] || '#ffffff';
  const tabActiveBorder = colors['tab.activeBorder'] || '#007acc';
  const tabInactiveBg = colors['tab.inactiveBackground'] || '#2d2d2d';
  const tabInactiveFg = colors['tab.inactiveForeground'] || '#888888';

  const statusBg = colors['statusBar.background'] || '#007acc';
  const statusFg = colors['statusBar.foreground'] || '#ffffff';

  const termBg = colors['terminal.background'] || '#1e1e1e';
  const termFg = colors['terminal.foreground'] || '#cccccc';
  const termGreen = colors['terminal.ansiGreen'] || '#0dbc79';
  const termCyan = colors['terminal.ansiCyan'] || '#11a8cd';
  const termYellow = colors['terminal.ansiYellow'] || '#e5e510';
  const termMagenta = colors['terminal.ansiMagenta'] || '#bc3fbc';

  // Syntax tokens
  const kwColor = tokens.keywords || '#569cd6';
  const fnColor = tokens.functions || '#dcdcaa';
  const strColor = tokens.strings || '#ce9178';
  const numColor = tokens.numbers || '#b5cea8';
  const commentColor = tokens.comments || '#6a9955';
  const typeColor = tokens.types || '#4ec9b0';
  const varColor = tokens.variables || '#9cdcfe';

  const renderSceneContent = () => {
    switch (activeScene) {
      case 'editor':
        return (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Line Numbers */}
            <div
              style={{
                width: 48,
                padding: '12px 10px 12px 0',
                textAlign: 'right',
                color: lineNumColor,
                fontFamily: 'var(--cf-font-mono)',
                fontSize: 12,
                lineHeight: '20px',
                userSelect: 'none',
              }}
            >
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div style={{ color: activeLineNum, fontWeight: 'bold' }}>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
              <div>9</div>
              <div>10</div>
            </div>

            {/* Code Body */}
            <div
              style={{
                flex: 1,
                padding: '12px 16px',
                fontFamily: 'var(--cf-font-mono)',
                fontSize: 12,
                lineHeight: '20px',
                position: 'relative',
              }}
            >
              {/* Active line highlight */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 72,
                  height: 20,
                  background: lineHighlight,
                  pointerEvents: 'none',
                }}
              />

              {/* Code Content based on selected language */}
              {editorLanguage === 'typescript' && (
                <>
                  <div>
                    <span style={{ color: kwColor }}>import</span> <span style={{ color: varColor }}>React</span>, {'{'} <span style={{ color: fnColor }}>useState</span>, <span style={{ color: fnColor }}>useEffect</span> {'}'} <span style={{ color: kwColor }}>from</span> <span style={{ color: strColor }}>'react'</span>;
                  </div>
                  <div style={{ color: commentColor }}>
                    // ColorFly: Real-time VS Code theme synthesis engine
                  </div>
                  <div>
                    <span style={{ color: kwColor }}>export interface</span> <span style={{ color: typeColor }}>ThemeMetrics</span> {'{'}
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: varColor }}>activeTheme</span>: <span style={{ color: typeColor }}>string</span>;
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: varColor }}>contrastRatio</span>: <span style={{ color: typeColor }}>number</span>;
                  </div>
                  <div>{'}'}</div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ color: kwColor }}>export function</span> <span style={{ color: fnColor }}>renderThemeStudio</span>(): <span style={{ color: typeColor }}>JSX.Element</span> {'{'}
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: kwColor }}>const</span> [<span style={{ color: varColor }}>palette</span>, <span style={{ color: fnColor }}>setPalette</span>] = <span style={{ color: fnColor }}>useState</span>&lt;<span style={{ color: typeColor }}>string</span>[]&gt;([<span style={{ color: strColor }}>'#007acc'</span>, <span style={{ color: strColor }}>'#7c3aed'</span>]);
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: kwColor }}>return</span> &lt;<span style={{ color: typeColor }}>div</span> <span style={{ color: varColor }}>className</span>=<span style={{ color: strColor }}>"chroma-canvas"</span>&gt;{'Ready'}&lt;/<span style={{ color: typeColor }}>div</span>&gt;;
                  </div>
                  <div>{'}'}</div>
                </>
              )}

              {editorLanguage === 'python' && (
                <>
                  <div>
                    <span style={{ color: kwColor }}>import</span> <span style={{ color: varColor }}>os</span>, <span style={{ color: varColor }}>sys</span>
                  </div>
                  <div>
                    <span style={{ color: kwColor }}>from</span> <span style={{ color: varColor }}>typing</span> <span style={{ color: kwColor }}>import</span> <span style={{ color: typeColor }}>List</span>, <span style={{ color: typeColor }}>Dict</span>
                  </div>
                  <div style={{ color: commentColor }}>
                    # ColorFly Data Pipeline Architecture
                  </div>
                  <div>
                    <span style={{ color: kwColor }}>class</span> <span style={{ color: typeColor }}>ThemeSynthesizer</span>:
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: kwColor }}>def</span> <span style={{ color: fnColor }}>__init__</span>(<span style={{ color: varColor }}>self</span>, <span style={{ color: varColor }}>theme_name</span>: <span style={{ color: typeColor }}>str</span>, <span style={{ color: varColor }}>max_shades</span>: <span style={{ color: typeColor }}>int</span> = <span style={{ color: numColor }}>10</span>):
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: varColor }}>self</span>.<span style={{ color: varColor }}>theme</span> = <span style={{ color: varColor }}>theme_name</span>
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: varColor }}>self</span>.<span style={{ color: varColor }}>active</span> = <span style={{ color: kwColor }}>True</span>
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: kwColor }}>def</span> <span style={{ color: fnColor }}>generate_palette</span>(<span style={{ color: varColor }}>self</span>) -&gt; <span style={{ color: typeColor }}>List</span>[<span style={{ color: typeColor }}>str</span>]:
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: kwColor }}>return</span> [<span style={{ color: strColor }}>f"color_{'{'}i{'}'}"</span> <span style={{ color: kwColor }}>for</span> <span style={{ color: varColor }}>i</span> <span style={{ color: kwColor }}>in</span> <span style={{ color: fnColor }}>range</span>(<span style={{ color: numColor }}>5</span>)]
                  </div>
                </>
              )}

              {editorLanguage === 'json' && (
                <>
                  <div>{'{'}</div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: strColor }}>"name"</span>: <span style={{ color: strColor }}>"ColorFly Custom Studio"</span>,
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: strColor }}>"version"</span>: <span style={{ color: strColor }}>"1.0.0"</span>,
                  </div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: strColor }}>"workbench.colorCustomizations"</span>: {'{'}
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: strColor }}>"editor.background"</span>: <span style={{ color: strColor }}>"{editorBg}"</span>,
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: strColor }}>"statusBar.background"</span>: <span style={{ color: strColor }}>"{statusBg}"</span>
                  </div>
                  <div>&nbsp;&nbsp;{'}'},</div>
                  <div>
                    &nbsp;&nbsp;<span style={{ color: strColor }}>"editor.tabSize"</span>: <span style={{ color: numColor }}>2</span>
                  </div>
                  <div>{'}'}</div>
                </>
              )}

              {editorLanguage === 'html' && (
                <>
                  <div style={{ color: commentColor }}>&lt;!-- ColorFly Application Canvas --&gt;</div>
                  <div>
                    &lt;<span style={{ color: kwColor }}>!DOCTYPE</span> <span style={{ color: typeColor }}>html</span>&gt;
                  </div>
                  <div>
                    &lt;<span style={{ color: kwColor }}>html</span> <span style={{ color: fnColor }}>lang</span>=<span style={{ color: strColor }}>"en"</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&lt;<span style={{ color: kwColor }}>head</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: kwColor }}>title</span>&gt;ColorFly Studio&lt;/<span style={{ color: kwColor }}>title</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&lt;/<span style={{ color: kwColor }}>head</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&lt;<span style={{ color: kwColor }}>body</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: kwColor }}>main</span> <span style={{ color: fnColor }}>id</span>=<span style={{ color: strColor }}>"root"</span>&gt;Studio Active&lt;/<span style={{ color: kwColor }}>main</span>&gt;
                  </div>
                  <div>
                    &nbsp;&nbsp;&lt;/<span style={{ color: kwColor }}>body</span>&gt;
                  </div>
                  <div>&lt;/<span style={{ color: kwColor }}>html</span>&gt;</div>
                </>
              )}
            </div>

            {/* Minimap representation */}
            <div
              style={{
                width: 60,
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '12px 6px',
                opacity: 0.6,
              }}
            >
              <div style={{ height: 3, width: '70%', background: kwColor, marginBottom: 2, borderRadius: 1 }} />
              <div style={{ height: 3, width: '90%', background: commentColor, marginBottom: 2, borderRadius: 1 }} />
              <div style={{ height: 3, width: '60%', background: typeColor, marginBottom: 2, borderRadius: 1 }} />
              <div style={{ height: 3, width: '40%', background: varColor, marginBottom: 2, borderRadius: 1 }} />
              <div style={{ height: 3, width: '50%', background: varColor, marginBottom: 2, borderRadius: 1 }} />
              <div style={{ height: 3, width: '20%', background: editorFg, marginBottom: 2, borderRadius: 1 }} />
              <div style={{ height: 3, width: '80%', background: fnColor, marginBottom: 2, borderRadius: 1 }} />
            </div>
          </div>
        );

      case 'terminal':
        return (
          <div
            style={{
              flex: 1,
              background: termBg,
              color: termFg,
              padding: 16,
              fontFamily: 'var(--cf-font-mono)',
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            <div>
              <span style={{ color: termCyan }}>➜</span> <span style={{ color: termGreen }}>workspace/colorfly</span> <span style={{ color: termMagenta }}>git:(main)</span> <span style={{ color: termYellow }}>npm test</span>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              &gt; colorfly@1.0.0 test<br />
              &gt; vitest run
            </div>
            <div style={{ marginTop: 8, color: termGreen }}>
              ✓ tests/colorUtils.test.ts (20 tests passed)
            </div>
            <div style={{ color: termGreen }}>
              ✓ tests/configurationService.test.ts (5 tests passed)
            </div>
            <div style={{ color: termGreen }}>
              ✓ tests/workbenchCatalog.test.ts (6 tests passed)
            </div>
            <div style={{ marginTop: 8, color: termFg }}>
              Test Files: <span style={{ color: termGreen, fontWeight: 'bold' }}>6 passed</span> (6)<br />
              Tests: <span style={{ color: termGreen, fontWeight: 'bold' }}>42 passed</span> (42)<br />
              Duration: 1.15s
            </div>
            <div style={{ marginTop: 12 }}>
              <span style={{ color: termCyan }}>➜</span> <span style={{ color: termGreen }}>workspace/colorfly</span> <span style={{ color: termMagenta }}>git:(main)</span> <span style={{ display: 'inline-block', width: 8, height: 14, background: termFg, verticalAlign: 'middle' }} />
            </div>
          </div>
        );

      case 'diff':
        return (
          <div style={{ flex: 1, display: 'flex', fontFamily: 'var(--cf-font-mono)', fontSize: 12, lineHeight: '22px' }}>
            <div style={{ flex: 1, background: colors['diffEditor.removedTextBackground'] || 'rgba(255, 0, 0, 0.1)', padding: 16, borderRight: '1px solid var(--cf-border)' }}>
              <div style={{ opacity: 0.6, marginBottom: 8 }}>- Original Line (Before Customization)</div>
              <div style={{ color: '#f87171' }}>- const defaultTheme = "Standard Dark";</div>
              <div style={{ color: '#f87171' }}>- const contrastRatio = 3.2; // FAILS WCAG AA</div>
            </div>

            <div style={{ flex: 1, background: colors['diffEditor.insertedTextBackground'] || 'rgba(0, 255, 0, 0.1)', padding: 16 }}>
              <div style={{ opacity: 0.6, marginBottom: 8 }}>+ Staged Line (ColorFly Synthesis)</div>
              <div style={{ color: '#4ade80' }}>+ const activeProfile = "ColorFly Studio Midnight";</div>
              <div style={{ color: '#4ade80' }}>+ const contrastRatio = 7.4; // PASSES WCAG AAA</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Scene Switcher & Language Selector */}
      <div className="card" style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeScene === 'editor' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveScene('editor')}
          >
            <CodeIcon size={13} />
            <span>Code Editor Scene</span>
          </button>
          <button
            className={`btn btn-sm ${activeScene === 'terminal' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveScene('terminal')}
          >
            <TerminalIcon size={13} />
            <span>Terminal View</span>
          </button>
          <button
            className={`btn btn-sm ${activeScene === 'diff' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveScene('diff')}
          >
            <GitBranchIcon size={13} />
            <span>Git Diff View</span>
          </button>
        </div>

        {activeScene === 'editor' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--cf-desc-fg)', fontWeight: 600 }}>Language:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['typescript', 'python', 'json', 'html'] as const).map((lang) => (
                <button
                  key={lang}
                  className={`btn btn-sm ${editorLanguage === lang ? 'btn-secondary' : 'btn-outline'}`}
                  style={{ textTransform: 'capitalize', padding: '3px 8px', fontSize: 11 }}
                  onClick={() => setEditorLanguage(lang)}
                >
                  {lang === 'typescript' ? 'TypeScript' : lang === 'python' ? 'Python' : lang === 'json' ? 'JSON' : 'HTML'}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeScene !== 'editor' && (
          <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)' }}>
            Approximation of workbench components driven by your staged color selections
          </div>
        )}
      </div>

      {/* Main Simulated VS Code Window Frame */}
      <div
        style={{
          border: '1px solid var(--cf-border)',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          height: 480,
        }}
      >
        {/* Title Bar */}
        <div
          style={{
            background: titleBarBg,
            color: titleBarFg,
            padding: '6px 12px',
            fontSize: 11,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>
          <span style={{ fontWeight: 600 }}>ColorFly Live Simulator — App.tsx</span>
          <span style={{ opacity: 0.6 }}>VS Code 1.85+</span>
        </div>

        {/* Workbench Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Activity Bar */}
          <div
            style={{
              width: 48,
              background: activityBg,
              color: activityFg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 0',
              gap: 16,
              borderRight: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ position: 'relative', cursor: 'pointer' }} title="Explorer">
              <FolderIcon size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  background: activityBadgeBg,
                  color: activityBadgeFg,
                  fontSize: 9,
                  fontWeight: 'bold',
                  borderRadius: 6,
                  padding: '1px 3px',
                }}
              >
                2
              </span>
            </div>
            <div style={{ opacity: 0.6, cursor: 'pointer' }} title="Search">
              <SearchIcon size={18} />
            </div>
            <div style={{ opacity: 0.6, cursor: 'pointer' }} title="Source Control">
              <GitBranchIcon size={18} />
            </div>
            <div style={{ opacity: 0.6, cursor: 'pointer' }} title="Run & Debug">
              <WrenchIcon size={18} />
            </div>
            <div style={{ marginTop: 'auto', opacity: 0.8, cursor: 'pointer' }} title="Settings">
              <SettingsIcon size={18} />
            </div>
          </div>

          {/* Primary Sidebar */}
          <div
            style={{
              width: 180,
              background: sidebarBg,
              color: sidebarFg,
              borderRight: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              fontSize: 11,
            }}
          >
            <div style={{ padding: '8px 12px', color: sidebarTitleFg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Explorer: Workspace
            </div>
            <div style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <span style={{ fontSize: 9 }}>▼</span> <span>src</span>
            </div>
            <div style={{ padding: '4px 24px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <FileIcon size={12} /> <span>extension.ts</span>
            </div>
            <div
              style={{
                padding: '4px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: colors['list.activeSelectionBackground'] || '#094771',
                color: colors['list.activeSelectionForeground'] || '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FileIcon size={12} /> <span>App.tsx</span>
            </div>
            <div style={{ padding: '4px 24px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <FileIcon size={12} /> <span>colorUtils.ts</span>
            </div>
            <div style={{ padding: '4px 24px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <FileIcon size={12} /> <span>package.json</span>
            </div>
          </div>

          {/* Editor Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: editorBg, color: editorFg }}>
            {/* Tabs Bar */}
            <div
              style={{
                display: 'flex',
                background: colors['editorGroupHeader.tabsBackground'] || '#252526',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  padding: '6px 14px',
                  background: tabActiveBg,
                  color: tabActiveFg,
                  borderBottom: `2px solid ${tabActiveBorder}`,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 600,
                }}
              >
                <CodeIcon size={13} />
                <span>
                  {editorLanguage === 'typescript' ? 'App.tsx' : editorLanguage === 'python' ? 'pipeline.py' : editorLanguage === 'json' ? 'settings.json' : 'index.html'}
                </span>
              </div>
              <div
                style={{
                  padding: '6px 14px',
                  background: tabInactiveBg,
                  color: tabInactiveFg,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <FileIcon size={13} /> <span>colorUtils.ts</span>
              </div>
            </div>

            {/* Active Scene Content */}
            {renderSceneContent()}
          </div>
        </div>

        {/* Status Bar */}
        <div
          style={{
            background: statusBg,
            color: statusFg,
            padding: '4px 12px',
            fontSize: 11,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            <span>main*</span>
            <span>0 error, 0 warning</span>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <span>Ln 4, Col 12</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>TypeScript React</span>
          </div>
        </div>
      </div>
    </div>
  );
};
