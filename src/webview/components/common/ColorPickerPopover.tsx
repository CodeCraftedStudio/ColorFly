/**
 * ColorFly: Advanced Visual Color Picker Popover
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  hexToHsla,
  hslaToHex,
  hslaToRgba,
  rgbaToHex,
  isValidHex,
  normalizeColor,
} from '../../../shared/colorUtils';
import { HSLA } from '../../../shared/types';
import { CloseIcon } from './Icons';

interface ColorPickerPopoverProps {
  initialColor: string;
  onChange: (newHex: string) => void;
  onClose: () => void;
  anchorRect?: DOMRect;
}

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  initialColor,
  onChange,
  onClose,
  anchorRect,
}) => {
  const norm = normalizeColor(initialColor) || '#007acc';
  const [hsla, setHsla] = useState<HSLA>(() => hexToHsla(norm) || { h: 200, s: 80, l: 50, a: 1 });
  const [hexInput, setHexInput] = useState<string>(norm);

  const currentHex = hslaToHex(hsla);
  const currentRgba = hslaToRgba(hsla);

  const didMountRef = useRef(false);

  useEffect(() => {
    setHexInput(currentHex);
    if (didMountRef.current) {
      onChange(currentHex);
    } else {
      didMountRef.current = true;
    }
  }, [currentHex]);

  // Popover dimensions (kept in sync with the rendered content below).
  const POPOVER_WIDTH = 276;
  const POPOVER_HEIGHT = 470;

  // Compute a viewport-clamped position so the picker never opens outside
  // the layout/viewport. When there isn't enough room below the anchor, the
  // popover flips to open above it.
  const popoverPosition = React.useMemo(() => {
    if (!anchorRect) {
      return { position: 'fixed' as const, top: 8, left: 8, zIndex: 9999 };
    }
    const rect = anchorRect;
    const placeBelowTop = rect.bottom + 8;
    const spaceBelow = window.innerHeight - placeBelowTop;
    const spaceAbove = rect.top - 8;

    let top = placeBelowTop;
    if (spaceBelow < POPOVER_HEIGHT && spaceAbove >= spaceBelow) {
      // Not enough room below; flip above the anchor.
      top = rect.top - POPOVER_HEIGHT - 8;
    }

    // Clamp vertically inside the viewport.
    top = Math.max(8, Math.min(top, window.innerHeight - POPOVER_HEIGHT - 8));

    // Clamp horizontally inside the viewport, preferring the anchor's left edge.
    let left = Math.max(8, Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - 8));
    if (left < 8) left = 8;

    return { position: 'fixed' as const, top, left, zIndex: 9999 };
  }, [anchorRect]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHsla((prev) => ({ ...prev, h: parseInt(e.target.value, 10) }));
  };

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHsla((prev) => ({ ...prev, s: parseInt(e.target.value, 10) }));
  };

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHsla((prev) => ({ ...prev, l: parseInt(e.target.value, 10) }));
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHsla((prev) => ({ ...prev, a: Math.round(parseFloat(e.target.value) * 100) / 100 }));
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      const parsed = hexToHsla(val);
      if (parsed) {
        setHsla(parsed);
      }
    }
  };

  const quickSwatches = [
    '#ffffff', '#000000', '#1e1e1e', '#252526', '#007acc',
    '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'
  ];

  return (
    <div
      className="color-picker-popover"
      onClick={(e) => e.stopPropagation()}
      style={popoverPosition}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--cf-title-fg)' }}>Color Picker</span>
        <button
          className="btn btn-outline btn-sm"
          onClick={onClose}
          style={{ padding: '3px 6px', fontSize: 10 }}
          title="Close color picker"
        >
          <CloseIcon size={12} />
        </button>
      </div>

      {/* Swatch & Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 6,
            background: currentHex,
            border: '1px solid var(--cf-border)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          }}
          title={currentHex}
        />
        <div style={{ flex: 1 }}>
          <input
            type="text"
            className="color-text-input"
            style={{ width: '100%', fontSize: 13 }}
            value={hexInput}
            onChange={handleHexInputChange}
          />
          <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
            RGB({currentRgba.r}, {currentRgba.g}, {currentRgba.b})
          </div>
        </div>
      </div>

      {/* Hue Slider */}
      <div className="slider-group">
        <label>
          <span>Hue</span>
          <span>{hsla.h}Â°</span>
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={hsla.h}
          onChange={handleHueChange}
          className="range-slider"
          style={{
            background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
          }}
        />
      </div>

      {/* Saturation Slider */}
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
          onChange={handleSaturationChange}
          className="range-slider"
        />
      </div>

      {/* Lightness Slider */}
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
          onChange={handleLightnessChange}
          className="range-slider"
        />
      </div>

      {/* Alpha Slider */}
      <div className="slider-group">
        <label>
          <span>Opacity</span>
          <span>{Math.round(hsla.a * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={hsla.a}
          onChange={handleAlphaChange}
          className="range-slider"
        />
      </div>

      {/* Quick Swatches */}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
        <div style={{ fontSize: 10, color: 'var(--cf-desc-fg)', marginBottom: 6, fontWeight: 500 }}>
          Quick Swatches
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {quickSwatches.map((color) => (
            <div
              key={color}
              onClick={() => {
                const parsed = hexToHsla(color);
                if (parsed) setHsla(parsed);
              }}
              style={{
                width: 18,
                height: 18,
                borderRadius: 3,
                background: color,
                cursor: 'pointer',
                border: '1px solid var(--cf-border)',
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

