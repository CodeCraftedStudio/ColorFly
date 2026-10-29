/**
 * ChromaForge: Advanced Color Studio & Palette Harmony Generator
 * Complete color manipulation workspace with harmony generation and accessibility simulation.
 */

import React, { useState } from 'react';
import {
  hexToHsla,
  hslaToHex,
  hslaToRgba,
  rgbaToHex,
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateMonochromatic,
  generateNeutralSurfaces,
  getAccessibleForeground,
  analyzeContrast,
  simulateColorBlindness,
  isValidHex,
} from '../../../shared/colorUtils';
import { HSLA } from '../../../shared/types';
import { OFFICIAL_WORKBENCH_COLORS } from '../../../shared/officialWorkbenchColors';
import { sendToExtension } from '../../vscodeApi';
import { CheckIcon, CopyIcon, SparklesIcon } from '../common/Icons';

export const AdvancedColorStudio: React.FC = () => {
  const [baseHex, setBaseHex] = useState('#007acc');
  const [hsla, setHsla] = useState<HSLA>(() => hexToHsla('#007acc') || { h: 207, s: 100, l: 40, a: 1 });
  const [targetComponent, setTargetComponent] = useState('editor.background');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const currentHex = hslaToHex(hsla);
  const currentRgba = hslaToRgba(hsla);

  const updateFromHex = (hex: string) => {
    if (isValidHex(hex)) {
      setBaseHex(hex);
      const parsed = hexToHsla(hex);
      if (parsed) setHsla(parsed);
    }
  };

  const handleCopy = (val: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedColor(val);
    setTimeout(() => setCopiedColor(null), 1200);
  };

  // Harmonies & Metrics
  const complementary = generateComplementary(currentHex);
  const [analogous1, analogous2] = generateAnalogous(currentHex);
  const [triadic1, triadic2] = generateTriadic(currentHex);
  const monochromatic = generateMonochromatic(currentHex);
  const neutrals = generateNeutralSurfaces(currentHex);
  const accessibleFg = getAccessibleForeground(currentHex);
  const contrastAnalysis = analyzeContrast(accessibleFg, currentHex);

  // Color Blindness Simulations
  const protan = simulateColorBlindness(currentHex, 'protanopia');
  const deut = simulateColorBlindness(currentHex, 'deuteranopia');
  const trit = simulateColorBlindness(currentHex, 'tritanopia');
  const achroma = simulateColorBlindness(currentHex, 'achromatopsia');

  const handleStageToComponent = (colorVal: string) => {
    sendToExtension({
      type: 'STAGE_COLOR_CHANGE',
      payload: { id: targetComponent, value: colorVal },
    });
  };

  const handleStageHarmonizedPalette = () => {
    const harmonyMap: Record<string, string> = {
      'editor.background': neutrals[0] || '#111418',
      'sideBar.background': neutrals[1] || '#181c22',
      'activityBar.background': neutrals[2] || '#20252d',
      'statusBar.background': currentHex,
      'statusBar.foreground': accessibleFg,
      'button.background': currentHex,
      'button.foreground': accessibleFg,
      'activityBarBadge.background': complementary,
      'activityBarBadge.foreground': getAccessibleForeground(complementary),
      'tab.activeBackground': neutrals[0] || '#111418',
      'tab.activeBorder': currentHex,
    };

    Object.entries(harmonyMap).forEach(([id, value]) => {
      sendToExtension({
        type: 'STAGE_COLOR_CHANGE',
        payload: { id, value },
      });
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Target Component Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Target Component:</span>
          <select
            value={targetComponent}
            onChange={(e) => setTargetComponent(e.target.value)}
            style={{
              background: 'var(--cf-input-bg)',
              color: 'var(--cf-input-fg)',
              border: '1px solid var(--cf-border)',
              padding: '6px 10px',
              borderRadius: 4,
              fontSize: 12,
              minWidth: 260,
            }}
          >
            {OFFICIAL_WORKBENCH_COLORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleStageToComponent(currentHex)}
        >
          Assign Current Color ({currentHex})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Main Color Science Controls */}
        <div className="card">
          <h3 style={{ margin: '0 0 14px 0', fontSize: 14, fontWeight: 600 }}>Color Studio Controls</h3>

          {/* Swatch & Input Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background: currentHex,
                border: '1px solid var(--cf-border)',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="color-text-input"
                  style={{ width: 120, fontSize: 14, fontWeight: 600 }}
                  value={currentHex}
                  onChange={(e) => updateFromHex(e.target.value)}
                />
                <button className="btn btn-outline btn-sm" onClick={() => handleCopy(currentHex)}>
                  {copiedColor === currentHex ? (
                    <>
                      <CheckIcon size={12} style={{ color: '#16a34a' }} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 4 }}>
                RGBA({currentRgba.r}, {currentRgba.g}, {currentRgba.b}, {currentRgba.a})
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="slider-group">
            <label>
              <span>Hue</span>
              <span>{hsla.h}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={hsla.h}
              onChange={(e) => setHsla((p) => ({ ...p, h: parseInt(e.target.value, 10) }))}
              className="range-slider"
              style={{
                background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
              }}
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Saturation</span>
              <span>{hsla.s}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsla.s}
              onChange={(e) => setHsla((p) => ({ ...p, s: parseInt(e.target.value, 10) }))}
              className="range-slider"
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Lightness</span>
              <span>{hsla.l}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsla.l}
              onChange={(e) => setHsla((p) => ({ ...p, l: parseInt(e.target.value, 10) }))}
              className="range-slider"
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Opacity (Alpha)</span>
              <span>{Math.round(hsla.a * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hsla.a}
              onChange={(e) => setHsla((p) => ({ ...p, a: parseFloat(e.target.value) }))}
              className="range-slider"
            />
          </div>
        </div>

        {/* Accessibility & Color-Blindness Lab */}
        <div className="card">
          <h3 style={{ margin: '0 0 14px 0', fontSize: 14, fontWeight: 600 }}>Contrast & Perception Lab</h3>

          {/* Accessible Text Demo */}
          <div
            style={{
              padding: 16,
              borderRadius: 6,
              background: currentHex,
              color: accessibleFg,
              marginBottom: 16,
              border: '1px solid var(--cf-border)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>Sample Accessible Text</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>
              Contrast Ratio: <strong>{contrastAnalysis.ratio}:1</strong> ({contrastAnalysis.status.toUpperCase()})
            </div>
            <div style={{ fontSize: 10, marginTop: 2, opacity: 0.9 }}>
              Suggested text color: {accessibleFg}
            </div>
          </div>

          {/* Color Blindness Simulation Grid */}
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--cf-title-fg)' }}>Perception Simulations:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: 'var(--cf-bg)', padding: 8, borderRadius: 4, border: '1px solid var(--cf-border)' }}>
              <div style={{ height: 20, background: protan, borderRadius: 3, marginBottom: 4 }} />
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cf-title-fg)' }}>Protanopia (Red)</div>
              <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)' }}>{protan}</div>
            </div>

            <div style={{ background: 'var(--cf-bg)', padding: 8, borderRadius: 4, border: '1px solid var(--cf-border)' }}>
              <div style={{ height: 20, background: deut, borderRadius: 3, marginBottom: 4 }} />
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cf-title-fg)' }}>Deuteranopia (Green)</div>
              <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)' }}>{deut}</div>
            </div>

            <div style={{ background: 'var(--cf-bg)', padding: 8, borderRadius: 4, border: '1px solid var(--cf-border)' }}>
              <div style={{ height: 20, background: trit, borderRadius: 3, marginBottom: 4 }} />
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cf-title-fg)' }}>Tritanopia (Blue)</div>
              <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)' }}>{trit}</div>
            </div>

            <div style={{ background: 'var(--cf-bg)', padding: 8, borderRadius: 4, border: '1px solid var(--cf-border)' }}>
              <div style={{ height: 20, background: achroma, borderRadius: 3, marginBottom: 4 }} />
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cf-title-fg)' }}>Achromatopsia (Gray)</div>
              <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)' }}>{achroma}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Palette Harmonies Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Algorithmic Color Harmonies</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleStageHarmonizedPalette}
            title="Applies editor, sidebar, activity bar, and accents derived from this color as staged draft changes"
          >
            <SparklesIcon size={12} />
            <span>Stage Whole Harmonized Palette</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {/* Complementary */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Complementary (+180°)</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 40, height: 32, borderRadius: 4, background: complementary, border: '1px solid var(--cf-border)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontFamily: 'var(--cf-font-mono)' }}>{complementary}</div>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 2, fontSize: 10, padding: '2px 6px' }}
                  onClick={() => handleStageToComponent(complementary)}
                >
                  Assign to target
                </button>
              </div>
            </div>
          </div>

          {/* Analogous */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Analogous (±30°)</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[analogous1, analogous2].map((hex, idx) => (
                <div key={idx} style={{ flex: 1 }}>
                  <div style={{ height: 32, borderRadius: 4, background: hex, border: '1px solid var(--cf-border)', marginBottom: 4 }} />
                  <div style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)' }}>{hex}</div>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: 9, padding: '2px 4px', width: '100%', marginTop: 2 }}
                    onClick={() => handleStageToComponent(hex)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Triadic */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Triadic (+120°, +240°)</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[triadic1, triadic2].map((hex, idx) => (
                <div key={idx} style={{ flex: 1 }}>
                  <div style={{ height: 32, borderRadius: 4, background: hex, border: '1px solid var(--cf-border)', marginBottom: 4 }} />
                  <div style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)' }}>{hex}</div>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: 9, padding: '2px 4px', width: '100%', marginTop: 2 }}
                    onClick={() => handleStageToComponent(hex)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monochromatic Gradient */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--cf-border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Monochromatic Scale</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {monochromatic.map((hex, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: 32, borderRadius: 4, background: hex, border: '1px solid var(--cf-border)', marginBottom: 4 }} />
                <div style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)' }}>{hex}</div>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 9, padding: '2px 4px', width: '100%', marginTop: 2 }}
                  onClick={() => handleStageToComponent(hex)}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Neutral Surfaces */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--cf-border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Harmonized Dark Surfaces (Editors & Sidebars)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {neutrals.map((hex, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: 32, borderRadius: 4, background: hex, border: '1px solid var(--cf-border)', marginBottom: 4 }} />
                <div style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)' }}>{hex}</div>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 9, padding: '2px 4px', width: '100%', marginTop: 2 }}
                  onClick={() => handleStageToComponent(hex)}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

