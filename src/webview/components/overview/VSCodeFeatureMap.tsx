/**
 * ColorFly: Interactive VS Code Visual Feature Blueprint
 * Clear, interactive architectural diagram showing which settings control which features in VS Code.
 */

import React, { useState } from 'react';
import { TabId } from '../common/TabsNav';
import { WorkbenchCategory } from '../../../shared/types';
import { CodeIcon, LayersIcon, PaletteIcon, TerminalIcon, SlidersIcon } from '../common/Icons';

export interface FeatureZone {
  id: string;
  name: string;
  shortLabel: string;
  category: WorkbenchCategory;
  description: string;
  impactBangla: string;
  keys: Array<{
    id: string;
    label: string;
  }>;
}

export const FEATURE_ZONES: FeatureZone[] = [
  {
    id: 'titleBar',
    name: 'Window Title Bar',
    shortLabel: 'Title Bar',
    category: 'tabsAndTitle',
    description: 'Top header bar displaying window controls, file name, workspace title, and layout options.',
    impactBangla: 'VS Code উইন্ডোর সবচেয়ে উপরের হেডার বার, ফাইল/প্রজেক্ট নাম ও উইন্ডো কন্ট্রোল।',
    keys: [
      { id: 'titleBar.activeBackground', label: 'Title Bar Background' },
      { id: 'titleBar.activeForeground', label: 'Title Bar Text' },
      { id: 'titleBar.border', label: 'Title Bar Border' },
    ],
  },
  {
    id: 'activityBar',
    name: 'Navigation Activity Bar',
    shortLabel: 'Activity Bar',
    category: 'activityBar',
    description: 'Far-left vertical icon stripe for switching views (Explorer, Search, Source Control, Extensions).',
    impactBangla: 'একেবারে বাম পাশের খাড়া আইকন বার, যা দিয়ে ফাইল এক্সপ্লোরার, সার্চ, গিট ওপেন করা হয়।',
    keys: [
      { id: 'activityBar.background', label: 'Activity Bar Background' },
      { id: 'activityBar.foreground', label: 'Active Icon Color' },
      { id: 'activityBar.inactiveForeground', label: 'Inactive Icon Color' },
      { id: 'activityBarBadge.background', label: 'Notification Badge Background' },
    ],
  },
  {
    id: 'sideBar',
    name: 'Primary Sidebar',
    shortLabel: 'Sidebar',
    category: 'sideBar',
    description: 'Collapsible panel showing file tree, open folders, git changes, search results, and outlines.',
    impactBangla: 'বাম পাশের মেইন প্যানেল যাতে ফাইল লিস্ট (Explorer), সার্চ রেজাল্ট ও গিট চেঞ্জেস থাকে।',
    keys: [
      { id: 'sideBar.background', label: 'Sidebar Background' },
      { id: 'sideBar.foreground', label: 'Sidebar Text Color' },
      { id: 'sideBarTitle.foreground', label: 'Sidebar Section Titles' },
      { id: 'sideBarSectionHeader.background', label: 'Section Header Bar' },
    ],
  },
  {
    id: 'tabs',
    name: 'Editor Tabs & Headers',
    shortLabel: 'Editor Tabs',
    category: 'tabsAndTitle',
    description: 'Horizontal tab strips at the top of editors showing currently open files and active indicators.',
    impactBangla: 'এডিটরের উপরে খোলা থাকা ফাইলের ট্যাবসমূহ ও অ্যাক্টিভ ফাইল বর্ডার লাইন।',
    keys: [
      { id: 'tab.activeBackground', label: 'Active Tab Background' },
      { id: 'tab.activeForeground', label: 'Active Tab Text' },
      { id: 'tab.activeBorder', label: 'Active Tab Bottom Border' },
      { id: 'tab.inactiveBackground', label: 'Inactive Tab Background' },
    ],
  },
  {
    id: 'editor',
    name: 'Code Editor Canvas',
    shortLabel: 'Code Canvas',
    category: 'editor',
    description: 'The core code typing surface, line numbers, cursor, selection highlight, and indent guides.',
    impactBangla: 'প্রধান কোড লেখার ক্যানভাস, কার্সর, লাইন নম্বর, এবং কোড সিলেক্ট হাইলাইট।',
    keys: [
      { id: 'editor.background', label: 'Editor Background' },
      { id: 'editor.foreground', label: 'Default Code Text' },
      { id: 'editorCursor.foreground', label: 'Typing Cursor' },
      { id: 'editor.lineHighlightBackground', label: 'Current Line Highlight' },
      { id: 'editorLineNumber.foreground', label: 'Line Numbers' },
    ],
  },
  {
    id: 'statusBar',
    name: 'Status Bar',
    shortLabel: 'Status Bar',
    category: 'statusBar',
    description: 'Bottom horizontal bar with Git branch, error/warning counters, encoding, line:col, and live clock.',
    impactBangla: 'একেবারে নিচের নীল/রঙিন বার যাতে গিট ব্রাঞ্চ নাম, এরর কাউন্ট, ও স্ট্যাটাস ইনফো থাকে।',
    keys: [
      { id: 'statusBar.background', label: 'Status Bar Background' },
      { id: 'statusBar.foreground', label: 'Status Bar Text' },
      { id: 'statusBarItem.hoverBackground', label: 'Hover Highlight' },
    ],
  },
  {
    id: 'terminal',
    name: 'Integrated Terminal & Panel',
    shortLabel: 'Terminal Panel',
    category: 'terminal',
    description: 'Bottom/side embedded shell surface for running npm commands, bash, powershell, and debug console.',
    impactBangla: 'নিচের ইন্টিগ্রেটেড টার্মিনাল কনসোল যেখানে npm, git কমান্ড ইত্যাদি রান করা হয়।',
    keys: [
      { id: 'terminal.background', label: 'Terminal Surface Background' },
      { id: 'terminal.foreground', label: 'Terminal Output Text' },
      { id: 'terminal.ansiGreen', label: 'Success Green Text' },
      { id: 'terminal.ansiCyan', label: 'Highlight Cyan Text' },
    ],
  },
];

interface VSCodeFeatureMapProps {
  effectiveColors: Record<string, string>;
  stagedColors: Record<string, string>;
  onNavigateToCategory: (category: WorkbenchCategory) => void;
}

export const VSCodeFeatureMap: React.FC<VSCodeFeatureMapProps> = ({
  effectiveColors,
  stagedColors,
  onNavigateToCategory,
}) => {
  const mergedColors = { ...effectiveColors, ...stagedColors };
  const [activeZoneId, setActiveZoneId] = useState<string>('editor');

  const selectedZone = FEATURE_ZONES.find((z) => z.id === activeZoneId) || FEATURE_ZONES[4];

  // Colors for mockup
  const titleBg = mergedColors['titleBar.activeBackground'] || '#323233';
  const titleFg = mergedColors['titleBar.activeForeground'] || '#cccccc';
  const actBg = mergedColors['activityBar.background'] || '#333333';
  const actFg = mergedColors['activityBar.foreground'] || '#ffffff';
  const sideBg = mergedColors['sideBar.background'] || '#252526';
  const sideFg = mergedColors['sideBar.foreground'] || '#cccccc';
  const tabActiveBg = mergedColors['tab.activeBackground'] || '#1e1e1e';
  const tabActiveFg = mergedColors['tab.activeForeground'] || '#ffffff';
  const tabInactiveBg = mergedColors['tab.inactiveBackground'] || '#2d2d2d';
  const tabBorder = mergedColors['tab.activeBorder'] || '#007acc';
  const editorBg = mergedColors['editor.background'] || '#1e1e1e';
  const editorFg = mergedColors['editor.foreground'] || '#d4d4d4';
  const lineNumFg = mergedColors['editorLineNumber.foreground'] || '#858585';
  const statusBg = mergedColors['statusBar.background'] || '#007acc';
  const statusFg = mergedColors['statusBar.foreground'] || '#ffffff';
  const termBg = mergedColors['terminal.background'] || '#181818';
  const termFg = mergedColors['terminal.foreground'] || '#cccccc';

  return (
    <div
      className="card"
      style={{
        padding: 20,
        position: 'relative',
        background: 'var(--cf-card-bg)',
        border: '1px solid var(--cf-border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--cf-accent)',
                padding: '3px 8px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Interactive Feature Blueprint
            </span>
            <span style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>
              ভিজ্যুয়াল ম্যাপ: কোন সেটিংস কোথায় পরিবর্তন আনে
            </span>
          </div>
          <h3 style={{ margin: '6px 0 2px 0', fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
            VS Code Interface Visual Architecture
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--cf-desc-fg)' }}>
            নিচের যে কোনো অংশে ক্লিক বা হোভার করে দেখুন কোন সেটিংসটি VS Code-এর কোন অংশকে পরিবর্তন করে।
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNavigateToCategory(selectedZone.category)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8 }}
        >
          <SlidersIcon size={13} />
          <span>Edit {selectedZone.shortLabel} Colors →</span>
        </button>
      </div>

      {/* Main interactive split layout: Visual Blueprint (Left) & Feature Detail Card (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1.35fr) minmax(280px, 1fr)',
          gap: 18,
          alignItems: 'stretch',
        }}
      >
        {/* Left: Interactive Simulated VS Code Diagram */}
        <div
          style={{
            background: 'var(--cf-bg)',
            border: '1px solid var(--cf-border)',
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            userSelect: 'none',
          }}
        >
          {/* Zone 1: Title Bar */}
          <div
            onClick={() => setActiveZoneId('titleBar')}
            style={{
              background: titleBg,
              color: titleFg,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11,
              cursor: 'pointer',
              borderBottom: '1px solid rgba(0,0,0,0.2)',
              outline: activeZoneId === 'titleBar' ? '2px solid var(--cf-accent)' : 'none',
              outlineOffset: -2,
              transition: 'all 0.18s ease',
            }}
            title="Click to inspect Window Title Bar settings"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ fontWeight: 600, marginLeft: 6 }}>ColorFly Studio — Visual Studio Code</span>
            </div>
            <span
              style={{
                fontSize: 9,
                padding: '2px 6px',
                borderRadius: 4,
                background: activeZoneId === 'titleBar' ? 'var(--cf-accent)' : 'rgba(0,0,0,0.25)',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Title Bar
            </span>
          </div>

          {/* Middle Body: Activity Bar + Sidebar + Editor/Tabs */}
          <div style={{ display: 'flex', height: 210, overflow: 'hidden' }}>
            {/* Zone 2: Activity Bar */}
            <div
              onClick={() => setActiveZoneId('activityBar')}
              style={{
                width: 44,
                background: actBg,
                color: actFg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 10,
                gap: 12,
                cursor: 'pointer',
                borderRight: '1px solid rgba(0,0,0,0.2)',
                outline: activeZoneId === 'activityBar' ? '2px solid var(--cf-accent)' : 'none',
                outlineOffset: -2,
                transition: 'all 0.18s ease',
              }}
              title="Click to inspect Activity Bar settings"
            >
              <div style={{ opacity: 0.95 }}><LayersIcon size={16} /></div>
              <div style={{ opacity: 0.6 }}><CodeIcon size={16} /></div>
              <div style={{ opacity: 0.6 }}><TerminalIcon size={16} /></div>
              <div
                style={{
                  marginTop: 'auto',
                  marginBottom: 10,
                  fontSize: 8,
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  opacity: 0.7,
                  letterSpacing: 1,
                  fontWeight: 700,
                }}
              >
                ACTIVITY BAR
              </div>
            </div>

            {/* Zone 3: Primary Sidebar */}
            <div
              onClick={() => setActiveZoneId('sideBar')}
              style={{
                width: 130,
                background: sideBg,
                color: sideFg,
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                cursor: 'pointer',
                borderRight: '1px solid rgba(0,0,0,0.2)',
                outline: activeZoneId === 'sideBar' ? '2px solid var(--cf-accent)' : 'none',
                outlineOffset: -2,
                transition: 'all 0.18s ease',
                overflow: 'hidden',
              }}
              title="Click to inspect Primary Sidebar settings"
            >
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.8 }}>
                EXPLORER
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10, opacity: 0.85 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📁</span> <strong>src</strong>
                </div>
                <div style={{ paddingLeft: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📄</span> <span>App.tsx</span>
                </div>
                <div style={{ paddingLeft: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📄</span> <span>styles.css</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📁</span> <span>theme</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', fontSize: 9, opacity: 0.7, fontStyle: 'italic' }}>
                Primary Sidebar
              </div>
            </div>

            {/* Right: Tabs + Editor Canvas + Terminal */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Zone 4: Tabs Strip */}
              <div
                onClick={() => setActiveZoneId('tabs')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  outline: activeZoneId === 'tabs' ? '2px solid var(--cf-accent)' : 'none',
                  outlineOffset: -2,
                  transition: 'all 0.18s ease',
                }}
                title="Click to inspect Editor Tabs settings"
              >
                <div
                  style={{
                    background: tabActiveBg,
                    color: tabActiveFg,
                    padding: '6px 12px',
                    fontSize: 10,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    borderBottom: `2px solid ${tabBorder}`,
                  }}
                >
                  <span>App.tsx</span>
                  <span style={{ fontSize: 9, opacity: 0.6 }}>✕</span>
                </div>
                <div
                  style={{
                    background: tabInactiveBg,
                    color: 'var(--cf-desc-fg)',
                    padding: '6px 12px',
                    fontSize: 10,
                    opacity: 0.8,
                  }}
                >
                  <span>styles.css</span>
                </div>
                <div style={{ marginLeft: 'auto', marginRight: 8, fontSize: 9, opacity: 0.6 }}>
                  Tabs Header
                </div>
              </div>

              {/* Zone 5: Editor Canvas */}
              <div
                onClick={() => setActiveZoneId('editor')}
                style={{
                  flex: 1,
                  background: editorBg,
                  color: editorFg,
                  padding: '8px 10px',
                  fontFamily: 'Consolas, "Fira Code", monospace',
                  fontSize: 11,
                  lineHeight: '18px',
                  cursor: 'pointer',
                  outline: activeZoneId === 'editor' ? '2px solid var(--cf-accent)' : 'none',
                  outlineOffset: -2,
                  transition: 'all 0.18s ease',
                  overflow: 'hidden',
                }}
                title="Click to inspect Code Editor Canvas settings"
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ color: lineNumFg, width: 16, textAlign: 'right', userSelect: 'none', opacity: 0.7 }}>
                    1<br />2<br />3
                  </div>
                  <div>
                    <div><span style={{ color: '#569cd6' }}>import</span> React <span style={{ color: '#569cd6' }}>from</span> <span style={{ color: '#ce9178' }}>'react'</span>;</div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <span style={{ color: '#569cd6' }}>const</span> Theme = () =&gt; &#123; <span style={{ display: 'inline-block', width: 2, height: 12, background: 'var(--cf-accent)', verticalAlign: 'middle' }} />
                    </div>
                    <div>&nbsp;&nbsp;<span style={{ color: '#569cd6' }}>return</span> &lt;<span style={{ color: '#4ec9b0' }}>div</span> className=<span style={{ color: '#ce9178' }}>"code"</span> /&gt;;</div>
                  </div>
                </div>
              </div>

              {/* Zone 7: Integrated Terminal Panel (Split in bottom of editor area) */}
              <div
                onClick={() => setActiveZoneId('terminal')}
                style={{
                  height: 52,
                  background: termBg,
                  color: termFg,
                  padding: '5px 10px',
                  fontFamily: 'Consolas, monospace',
                  fontSize: 10,
                  borderTop: '1px solid rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  outline: activeZoneId === 'terminal' ? '2px solid var(--cf-accent)' : 'none',
                  outlineOffset: -2,
                  transition: 'all 0.18s ease',
                }}
                title="Click to inspect Terminal settings"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7, marginBottom: 2 }}>
                  <span>TERMINAL: bash</span>
                  <span style={{ fontSize: 9 }}>Integrated Panel</span>
                </div>
                <div style={{ color: '#0dbc79' }}>
                  $ npm run build <span style={{ color: '#e5e510' }}>✓ ready in 240ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Zone 6: Status Bar */}
          <div
            onClick={() => setActiveZoneId('statusBar')}
            style={{
              background: statusBg,
              color: statusFg,
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 10,
              cursor: 'pointer',
              outline: activeZoneId === 'statusBar' ? '2px solid var(--cf-accent)' : 'none',
              outlineOffset: -2,
              transition: 'all 0.18s ease',
            }}
            title="Click to inspect Bottom Status Bar settings"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>main*</span>
              <span>⨂ 0  ⚠ 0</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>UTF-8</span>
              <span>TypeScript React</span>
              <span
                style={{
                  fontSize: 9,
                  background: 'rgba(0,0,0,0.25)',
                  padding: '1px 5px',
                  borderRadius: 3,
                  fontWeight: 600,
                }}
              >
                Status Bar
              </span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Feature Explanation Card for Selected Zone */}
        <div
          style={{
            background: 'var(--cf-input-bg)',
            border: '1px solid var(--cf-border)',
            borderRadius: 10,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            {/* Zone Title and Category Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'var(--cf-card-bg)',
                  border: '1px solid var(--cf-border)',
                  color: 'var(--cf-title-fg)',
                }}
              >
                📍 Feature Zone: {selectedZone.shortLabel}
              </span>
              <span style={{ fontSize: 10, color: 'var(--cf-desc-fg)', fontFamily: 'var(--cf-font-mono)' }}>
                Cat: {selectedZone.category}
              </span>
            </div>

            <h4 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>
              {selectedZone.name}
            </h4>

            {/* Bangla & English explanations */}
            <div
              style={{
                fontSize: 12,
                color: 'var(--cf-desc-fg)',
                lineHeight: 1.5,
                marginBottom: 8,
              }}
            >
              {selectedZone.description}
            </div>

            <div
              style={{
                background: 'rgba(99, 102, 241, 0.08)',
                borderLeft: '3px solid var(--cf-accent)',
                padding: '6px 10px',
                borderRadius: 4,
                fontSize: 11,
                color: 'var(--cf-title-fg)',
                lineHeight: 1.4,
                marginBottom: 12,
              }}
            >
              💡 <strong>কী পরিবর্তন হবে:</strong> {selectedZone.impactBangla}
            </div>

            {/* List of Key Color Properties that control this feature */}
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--cf-title-fg)', marginBottom: 6 }}>
              Key Settings for this Feature:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selectedZone.keys.map((k) => {
                const currentColor = mergedColors[k.id] || '#888888';
                return (
                  <div
                    key={k.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--cf-card-bg)',
                      border: '1px solid var(--cf-border)',
                      borderRadius: 6,
                      padding: '5px 8px',
                      fontSize: 11,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--cf-title-fg)' }}>{k.label}</div>
                      <div style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)', color: 'var(--cf-desc-fg)' }}>{k.id}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)', color: 'var(--cf-desc-fg)' }}>{currentColor}</span>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          background: currentColor,
                          border: '1px solid var(--cf-border)',
                          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action button */}
          <button
            className="btn btn-primary"
            onClick={() => onNavigateToCategory(selectedZone.category)}
            style={{ width: '100%', padding: '9px 14px', borderRadius: 8, fontWeight: 600 }}
          >
            <SlidersIcon size={14} />
            <span>Open & Customize {selectedZone.shortLabel} Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

