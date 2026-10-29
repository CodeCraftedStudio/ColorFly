/**
 * ColorFly: Dedicated Validated Color Input Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { isValidColor, normalizeColor } from '../../../shared/colorUtils';
import { ColorPickerPopover } from './ColorPickerPopover';
import { CopyIcon, CheckIcon, RefreshIcon } from './Icons';

interface ColorInputProps {
  colorId: string;
  value: string;
  defaultValue?: string;
  isCustomized?: boolean;
  isActive?: boolean;
  onChange: (val: string) => void;
  onReset: () => void;
  onToggleActive?: (active: boolean) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  colorId,
  value,
  defaultValue = '#1e1e1e',
  isCustomized = false,
  isActive = true,
  onChange,
  onReset,
  onToggleActive,
}) => {
  const [text, setText] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const isValid = isValidColor(text);
  const displayColor = isValid ? (normalizeColor(text) || defaultValue) : defaultValue;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setText(newVal);
    if (isValidColor(newVal)) {
      const normalized = normalizeColor(newVal);
      if (normalized) {
        onChange(normalized);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Compute popover position using fixed positioning so it never overflows the viewport.
  // Prefers right-aligned under the swatch; flips to left-aligned when near screen edges.
  const getPopoverStyle = () => {
    if (!anchorRef.current) {
      return { position: 'fixed' as const, top: 0, left: 0, zIndex: 9999 };
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const popoverWidth = 260;
    const popoverHeight = 420;
    const top = Math.min(rect.bottom + 8, window.innerHeight - popoverHeight - 8);
    let left = rect.right - popoverWidth;
    if (left < 8) left = 8;
    if (left + popoverWidth > window.innerWidth - 8) left = window.innerWidth - popoverWidth - 8;
    if (left < 8) left = 8;
    return { position: 'fixed' as const, top: Math.max(top, 8), left: Math.max(left, 8), zIndex: 9999 };
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative' }}>
      {/* Active/Deactivate toggle for this color override */}
      {onToggleActive && (
        <button
          className="btn btn-outline btn-sm"
          onClick={() => onToggleActive(!isActive)}
          title={isActive ? 'Deactivate this color override' : 'Activate this color override'}
          style={{
            padding: '3px 6px',
            fontSize: 10,
            borderColor: isActive ? 'var(--cf-accent)' : 'var(--cf-border)',
            color: isActive ? 'var(--cf-accent)' : 'var(--cf-desc-fg)',
            fontWeight: isActive ? 600 : 500,
          }}
        >
          {isActive ? 'Active' : 'Deactive'}
        </button>
      )}

      {/* Clickable Swatch with transparency support */}
      <div
        ref={anchorRef}
        className="color-swatch-box"
        onClick={() => setIsOpen(!isOpen)}
        title="Click to open color picker"
      >
        <div style={{ width: '100%', height: '100%', background: displayColor, borderRadius: 4 }} />
      </div>

      {/* Validated Text Input */}
      <input
        type="text"
        className={`color-text-input ${!isValid ? 'invalid' : ''}`}
        value={text}
        onChange={handleTextChange}
        placeholder={defaultValue}
        title={!isValid ? 'Invalid color format' : colorId}
      />

      {/* Copy Action */}
      <button
        className="btn btn-outline btn-sm"
        onClick={copyToClipboard}
        title="Copy color value"
        style={{ padding: '4px 6px' }}
      >
        {copied ? <CheckIcon size={12} style={{ color: '#16a34a' }} /> : <CopyIcon size={12} />}
      </button>

      {/* Reset Action */}
      {isCustomized && (
        <button
          className="btn btn-outline btn-sm"
          onClick={onReset}
          title="Reset this property"
          style={{ padding: '4px 6px', color: '#ef4444' }}
        >
          <RefreshIcon size={12} />
        </button>
      )}

      {/* Color Picker Popover */}
      {isOpen && (
        <div style={getPopoverStyle()}>
          <ColorPickerPopover
            initialColor={displayColor}
            onChange={(newHex) => {
              setText(newHex);
              onChange(newHex);
            }}
            onClose={() => setIsOpen(false)}
            anchorRect={anchorRef.current?.getBoundingClientRect()}
          />
        </div>
      )}
    </div>
  );
};

