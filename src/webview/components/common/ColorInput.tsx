/**
 * ChromaForge: Dedicated Validated Color Input Component
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
  onChange: (val: string) => void;
  onReset: () => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  colorId,
  value,
  defaultValue = '#1e1e1e',
  isCustomized = false,
  onChange,
  onReset,
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

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative' }}>
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
        <div style={{ position: 'absolute', top: 32, right: 0, zIndex: 999 }}>
          <ColorPickerPopover
            initialColor={displayColor}
            onChange={(newHex) => {
              setText(newHex);
              onChange(newHex);
            }}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
