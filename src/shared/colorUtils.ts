/**
 * ChromaForge: Color Science & Calculation Utilities
 * Implements precise color space conversions, WCAG 2.1 luminance/contrast algorithms,
 * color harmonies, and accessibility simulation.
 */

import { RGBA, HSLA, ContrastAnalysis } from './types';

/**
 * Validates whether a given string is a recognizable color format (HEX, RGB, RGBA, HSL, HSLA).
 */
export function isValidColor(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  return (
    isValidHex(trimmed) ||
    isValidRgbString(trimmed) ||
    isValidHslString(trimmed)
  );
}

/**
 * Validates HEX strings: #RGB, #RGBA, #RRGGBB, #RRGGBBAA (with or without #).
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return false;
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(clean);
}

/**
 * Validates rgb(...) and rgba(...) strings.
 */
export function isValidRgbString(str: string): boolean {
  const rgbRegex = /^rgba?\s*\(\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)(?:\s*[/, ]\s*(\d*(?:\.\d+)?%?))?\s*\)$/i;
  return rgbRegex.test(str.trim());
}

/**
 * Validates hsl(...) and hsla(...) strings.
 */
export function isValidHslString(str: string): boolean {
  const hslRegex = /^hsla?\s*\(\s*(\d*(?:\.\d+)?(?:deg)?)\s*[, ]\s*(\d*(?:\.\d+)?%)\s*[, ]\s*(\d*(?:\.\d+)?%)(?:\s*[/, ]\s*(\d*(?:\.\d+)?%?))?\s*\)$/i;
  return hslRegex.test(str.trim());
}

/**
 * Parses any valid color string (HEX, RGB, HSL) into an RGBA object.
 * Returns null if invalid.
 */
export function parseColorToRgba(input: string): RGBA | null {
  if (!input) return null;
  const trimmed = input.trim();

  if (isValidHex(trimmed)) {
    return hexToRgba(trimmed);
  }
  if (isValidRgbString(trimmed)) {
    return parseRgbStringToRgba(trimmed);
  }
  if (isValidHslString(trimmed)) {
    return parseHslStringToRgba(trimmed);
  }
  return null;
}

/**
 * Parses a HEX string into RGBA.
 */
export function hexToRgba(hex: string): RGBA | null {
  if (!isValidHex(hex)) return null;
  let clean = hex.startsWith('#') ? hex.slice(1) : hex;

  let r = 0, g = 0, b = 0, a = 1;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 4) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
    a = Math.round((parseInt(clean[3] + clean[3], 16) / 255) * 1000) / 1000;
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  } else if (clean.length === 8) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
    a = Math.round((parseInt(clean.substring(6, 8), 16) / 255) * 1000) / 1000;
  } else {
    return null;
  }

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
    a: Math.max(0, Math.min(1, a)),
  };
}

/**
 * Formats RGBA into HEX format: #RRGGBB or #RRGGBBAA.
 */
export function rgbaToHex(rgba: RGBA, includeAlpha: boolean = true): string {
  const r = Math.round(Math.max(0, Math.min(255, rgba.r))).toString(16).padStart(2, '0');
  const g = Math.round(Math.max(0, Math.min(255, rgba.g))).toString(16).padStart(2, '0');
  const b = Math.round(Math.max(0, Math.min(255, rgba.b))).toString(16).padStart(2, '0');

  if (includeAlpha && rgba.a < 1) {
    const a = Math.round(Math.max(0, Math.min(1, rgba.a)) * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}${a}`.toLowerCase();
  }
  return `#${r}${g}${b}`.toLowerCase();
}

/**
 * Parses RGB(A) string into RGBA.
 */
function parseRgbStringToRgba(str: string): RGBA | null {
  const match = str.match(/rgba?\s*\(\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)(?:\s*[/, ]\s*(\d*(?:\.\d+)?%?))?\s*\)/i);
  if (!match) return null;

  const parseVal = (val: string, max: number = 255): number => {
    if (val.endsWith('%')) {
      return (parseFloat(val) / 100) * max;
    }
    return parseFloat(val);
  };

  const r = Math.round(Math.max(0, Math.min(255, parseVal(match[1]))));
  const g = Math.round(Math.max(0, Math.min(255, parseVal(match[2]))));
  const b = Math.round(Math.max(0, Math.min(255, parseVal(match[3]))));

  let a = 1;
  if (match[4] !== undefined) {
    if (match[4].endsWith('%')) {
      a = parseFloat(match[4]) / 100;
    } else {
      a = parseFloat(match[4]);
    }
    a = Math.max(0, Math.min(1, a));
  }

  return { r, g, b, a };
}

/**
 * Converts RGBA to HSLA.
 */
export function rgbaToHsla(rgba: RGBA): HSLA {
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: Math.round(rgba.a * 100) / 100,
  };
}

/**
 * Converts HSLA to RGBA.
 */
export function hslaToRgba(hsla: HSLA): RGBA {
  const h = ((hsla.h % 360) + 360) % 360 / 360;
  const s = Math.max(0, Math.min(100, hsla.s)) / 100;
  const l = Math.max(0, Math.min(100, hsla.l)) / 100;
  const a = Math.max(0, Math.min(1, hsla.a));

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val, a };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return { r, g, b, a };
}

/**
 * Parses HSL(A) string into RGBA.
 */
function parseHslStringToRgba(str: string): RGBA | null {
  const match = str.match(/hsla?\s*\(\s*(\d*(?:\.\d+)?(?:deg)?)\s*[, ]\s*(\d*(?:\.\d+)?%)\s*[, ]\s*(\d*(?:\.\d+)?%)(?:\s*[/, ]\s*(\d*(?:\.\d+)?%?))?\s*\)/i);
  if (!match) return null;

  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]);
  const l = parseFloat(match[3]);

  let a = 1;
  if (match[4] !== undefined) {
    if (match[4].endsWith('%')) {
      a = parseFloat(match[4]) / 100;
    } else {
      a = parseFloat(match[4]);
    }
    a = Math.max(0, Math.min(1, a));
  }

  return hslaToRgba({ h, s, l, a });
}

/**
 * Converts HEX directly to HSLA.
 */
export function hexToHsla(hex: string): HSLA | null {
  const rgba = hexToRgba(hex);
  if (!rgba) return null;
  return rgbaToHsla(rgba);
}

/**
 * Converts HSLA directly to HEX.
 */
export function hslaToHex(hsla: HSLA, includeAlpha: boolean = true): string {
  const rgba = hslaToRgba(hsla);
  return rgbaToHex(rgba, includeAlpha);
}

/**
 * Normalizes any valid color input string to standard lowercase HEX (#rrggbb or #rrggbbaa).
 * Returns null if input is invalid.
 */
export function normalizeColor(input: string): string | null {
  const rgba = parseColorToRgba(input);
  if (!rgba) return null;
  return rgbaToHex(rgba, rgba.a < 1);
}

/**
 * WCAG 2.1 Relative Luminance calculation.
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where each channel is converted to linear RGB space.
 */
export function getRelativeLuminance(rgba: RGBA): number {
  const sRGB = [rgba.r, rgba.g, rgba.b].map((channel) => {
    const val = channel / 255;
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors (Foreground and Background).
 * Range is 1:1 to 21:1.
 */
export function getContrastRatio(fgColor: string, bgColor: string): number {
  const fgRgba = parseColorToRgba(fgColor);
  const bgRgba = parseColorToRgba(bgColor);

  if (!fgRgba || !bgRgba) return 1.0;

  // Handle alpha blending over background if foreground has transparency
  let blendedFg = fgRgba;
  if (fgRgba.a < 1) {
    blendedFg = {
      r: Math.round(fgRgba.r * fgRgba.a + bgRgba.r * (1 - fgRgba.a)),
      g: Math.round(fgRgba.g * fgRgba.a + bgRgba.g * (1 - fgRgba.a)),
      b: Math.round(fgRgba.b * fgRgba.a + bgRgba.b * (1 - fgRgba.a)),
      a: 1,
    };
  }

  const lum1 = getRelativeLuminance(blendedFg);
  const lum2 = getRelativeLuminance(bgRgba);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Evaluates WCAG compliance against AA and AAA specifications.
 */
export function analyzeContrast(fgColor: string, bgColor: string): ContrastAnalysis {
  const ratio = getContrastRatio(fgColor, bgColor);

  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  let status: 'pass' | 'warning' | 'fail' = 'pass';
  let recommendation: string | undefined;

  if (aaaNormal) {
    status = 'pass';
  } else if (aaNormal) {
    status = 'pass';
    recommendation = 'Meets WCAG AA for normal text. Consider increasing contrast to >= 7.0 for AAA.';
  } else if (aaLarge) {
    status = 'warning';
    recommendation = 'Passes only for large/bold text (>= 18pt or 14pt bold). Insufficient for regular UI text.';
  } else {
    status = 'fail';
    recommendation = `Contrast ratio is ${ratio.toFixed(2)}:1. Fails minimum WCAG requirements. Increase text brightness or darken background.`;
  }

  return { ratio, aaNormal, aaLarge, aaaNormal, aaaLarge, status, recommendation };
}

/**
 * Suggests an optimal high-contrast accessible foreground text color for a given background.
 */
export function getAccessibleForeground(bgHex: string): string {
  const rgba = parseColorToRgba(bgHex);
  if (!rgba) return '#ffffff';

  const lum = getRelativeLuminance(rgba);
  // If background is bright, dark foreground is optimal; otherwise, crisp white
  return lum > 0.4 ? '#181818' : '#f0f0f0';
}

/**
 * Color Harmony Generators
 */

export function generateComplementary(hex: string): string {
  const hsla = hexToHsla(hex);
  if (!hsla) return hex;
  return hslaToHex({ ...hsla, h: (hsla.h + 180) % 360 }, false);
}

export function generateAnalogous(hex: string): [string, string] {
  const hsla = hexToHsla(hex);
  if (!hsla) return [hex, hex];
  const h1 = (hsla.h + 30) % 360;
  const h2 = (hsla.h - 30 + 360) % 360;
  return [hslaToHex({ ...hsla, h: h1 }, false), hslaToHex({ ...hsla, h: h2 }, false)];
}

export function generateTriadic(hex: string): [string, string] {
  const hsla = hexToHsla(hex);
  if (!hsla) return [hex, hex];
  const h1 = (hsla.h + 120) % 360;
  const h2 = (hsla.h + 240) % 360;
  return [hslaToHex({ ...hsla, h: h1 }, false), hslaToHex({ ...hsla, h: h2 }, false)];
}

export function generateMonochromatic(hex: string): string[] {
  const hsla = hexToHsla(hex);
  if (!hsla) return [hex];
  return [
    hslaToHex({ ...hsla, l: Math.max(10, hsla.l - 30) }, false),
    hslaToHex({ ...hsla, l: Math.max(20, hsla.l - 15) }, false),
    hex,
    hslaToHex({ ...hsla, l: Math.min(85, hsla.l + 15) }, false),
    hslaToHex({ ...hsla, l: Math.min(95, hsla.l + 30) }, false),
  ];
}

export function generateNeutralSurfaces(hex: string): string[] {
  const hsla = hexToHsla(hex);
  if (!hsla) return ['#141416', '#1c1c1f', '#242429', '#2d2d34'];
  const baseHue = hsla.h;
  const subtleSat = Math.min(12, Math.max(4, Math.round(hsla.s * 0.15)));

  return [
    hslaToHex({ h: baseHue, s: subtleSat, l: 8, a: 1 }, false),
    hslaToHex({ h: baseHue, s: subtleSat, l: 12, a: 1 }, false),
    hslaToHex({ h: baseHue, s: subtleSat, l: 18, a: 1 }, false),
    hslaToHex({ h: baseHue, s: subtleSat, l: 24, a: 1 }, false),
    hslaToHex({ h: baseHue, s: subtleSat, l: 32, a: 1 }, false),
  ];
}

/**
 * Color Blindness Simulation Algorithms
 * Simulates how colors appear to individuals with Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.
 */
export function simulateColorBlindness(
  hex: string,
  type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
): string {
  const rgba = parseColorToRgba(hex);
  if (!rgba) return hex;

  // Linearize RGB
  let r = rgba.r / 255;
  let g = rgba.g / 255;
  let b = rgba.b / 255;

  let simR = r;
  let simG = g;
  let simB = b;

  if (type === 'protanopia') {
    simR = 0.56667 * r + 0.43333 * g;
    simG = 0.55833 * r + 0.44167 * g;
    simB = 0.24167 * g + 0.75833 * b;
  } else if (type === 'deuteranopia') {
    simR = 0.625 * r + 0.375 * g;
    simG = 0.7 * r + 0.3 * g;
    simB = 0.3 * g + 0.7 * b;
  } else if (type === 'tritanopia') {
    simR = 0.95 * r + 0.05 * g;
    simG = 0.43333 * g + 0.56667 * b;
    simB = 0.475 * g + 0.525 * b;
  } else if (type === 'achromatopsia') {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    simR = gray;
    simG = gray;
    simB = gray;
  }

  return rgbaToHex(
    {
      r: Math.round(Math.max(0, Math.min(1, simR)) * 255),
      g: Math.round(Math.max(0, Math.min(1, simG)) * 255),
      b: Math.round(Math.max(0, Math.min(1, simB)) * 255),
      a: rgba.a,
    },
    rgba.a < 1
  );
}

/**
 * Adjusts color lightness by a given percentage delta (-100 to +100).
 */
export function adjustLightness(hex: string, deltaPercent: number): string {
  const hsla = hexToHsla(hex);
  if (!hsla) return hex;
  const newL = Math.max(0, Math.min(100, Math.round(hsla.l + deltaPercent)));
  return hslaToHex({ ...hsla, l: newL });
}

/**
 * Inverts an RGB color preserving alpha channel.
 */
export function invertColor(hex: string): string {
  const rgba = parseColorToRgba(hex);
  if (!rgba) return hex;
  return rgbaToHex(
    {
      r: 255 - rgba.r,
      g: 255 - rgba.g,
      b: 255 - rgba.b,
      a: rgba.a,
    },
    rgba.a < 1
  );
}


