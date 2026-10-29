import { describe, it, expect } from 'vitest';
import {
  isValidColor,
  isValidHex,
  isValidRgbString,
  isValidHslString,
  hexToRgba,
  rgbaToHex,
  rgbaToHsla,
  hslaToRgba,
  hexToHsla,
  hslaToHex,
  normalizeColor,
  getRelativeLuminance,
  getContrastRatio,
  analyzeContrast,
  getAccessibleForeground,
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateMonochromatic,
  generateNeutralSurfaces,
  simulateColorBlindness,
  adjustLightness,
  invertColor,
} from '../src/shared/colorUtils';

describe('colorUtils - Validation & Parsing', () => {
  it('validates 3, 4, 6, 8 digit HEX values with and without hash', () => {
    expect(isValidHex('#fff')).toBe(true);
    expect(isValidHex('fff')).toBe(true);
    expect(isValidHex('#ffff')).toBe(true);
    expect(isValidHex('123456')).toBe(true);
    expect(isValidHex('#12345678')).toBe(true);
    expect(isValidHex('#ggg')).toBe(false);
    expect(isValidHex('12345')).toBe(false);
    expect(isValidHex('')).toBe(false);
  });

  it('validates RGB and RGBA string syntax', () => {
    expect(isValidRgbString('rgb(255, 0, 128)')).toBe(true);
    expect(isValidRgbString('rgba(255, 0, 128, 0.5)')).toBe(true);
    expect(isValidRgbString('rgba(100%, 0%, 50%, 1)')).toBe(true);
    expect(isValidRgbString('invalid-rgb')).toBe(false);
  });

  it('validates HSL and HSLA string syntax', () => {
    expect(isValidHslString('hsl(210, 50%, 50%)')).toBe(true);
    expect(isValidHslString('hsla(180, 100%, 40%, 0.8)')).toBe(true);
    expect(isValidHslString('hsl(360deg, 20%, 30%)')).toBe(true);
    expect(isValidHslString('hsl(foo, bar)')).toBe(false);
  });

  it('validates general isValidColor utility', () => {
    expect(isValidColor('#007acc')).toBe(true);
    expect(isValidColor('rgba(0, 122, 204, 0.8)')).toBe(true);
    expect(isValidColor('hsl(200, 80%, 50%)')).toBe(true);
    expect(isValidColor('not-a-color')).toBe(false);
  });

  it('parses 3, 4, 6, 8 hex digits correctly', () => {
    expect(hexToRgba('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(hexToRgba('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    const rgbaWithAlpha = hexToRgba('#00ff0080');
    expect(rgbaWithAlpha?.r).toBe(0);
    expect(rgbaWithAlpha?.g).toBe(255);
    expect(rgbaWithAlpha?.b).toBe(0);
    expect(rgbaWithAlpha?.a).toBeCloseTo(0.5, 1);
  });
});

describe('colorUtils - Format Conversion & Normalization', () => {
  it('converts RGBA to HEX correctly', () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 1 })).toBe('#ff0000');
    expect(rgbaToHex({ r: 0, g: 128, b: 255, a: 0.5 })).toBe('#0080ff80');
  });

  it('converts between RGBA and HSLA accurately without drift', () => {
    const originalRgba = { r: 14, g: 99, b: 156, a: 1 }; // VS Code blue
    const hsla = rgbaToHsla(originalRgba);
    const convertedRgba = hslaToRgba(hsla);

    expect(Math.abs(convertedRgba.r - originalRgba.r)).toBeLessThanOrEqual(2);
    expect(Math.abs(convertedRgba.g - originalRgba.g)).toBeLessThanOrEqual(2);
    expect(Math.abs(convertedRgba.b - originalRgba.b)).toBeLessThanOrEqual(2);
  });

  it('normalizes colors into canonical lowercase hex', () => {
    expect(normalizeColor('#FFF')).toBe('#ffffff');
    expect(normalizeColor('rgb(255, 255, 255)')).toBe('#ffffff');
    expect(normalizeColor('hsl(0, 0%, 100%)')).toBe('#ffffff');
    expect(normalizeColor('invalid')).toBeNull();
  });
});

describe('colorUtils - WCAG 2.1 Luminance & Contrast', () => {
  it('calculates relative luminance per WCAG 2.1 spec', () => {
    // Pure black = 0, Pure white = 1
    expect(getRelativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBe(0);
    expect(getRelativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBe(1);
  });

  it('calculates contrast ratio between black and white as 21:1', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBe(21);
  });

  it('calculates identical colors as 1:1 contrast', () => {
    const ratio = getContrastRatio('#333333', '#333333');
    expect(ratio).toBe(1);
  });

  it('correctly evaluates WCAG AA and AAA thresholds', () => {
    const analysis = analyzeContrast('#ffffff', '#1e1e1e');
    expect(analysis.ratio).toBeGreaterThanOrEqual(7.0);
    expect(analysis.aaNormal).toBe(true);
    expect(analysis.aaaNormal).toBe(true);
    expect(analysis.status).toBe('pass');

    const lowContrast = analyzeContrast('#555555', '#333333');
    expect(lowContrast.ratio).toBeLessThan(4.5);
    expect(lowContrast.aaNormal).toBe(false);
  });

  it('suggests accessible foreground for dark and light backgrounds', () => {
    expect(getAccessibleForeground('#000000')).toBe('#f0f0f0');
    expect(getAccessibleForeground('#ffffff')).toBe('#181818');
  });
});

describe('colorUtils - Color Harmonies & Palettes', () => {
  it('generates complementary hue (180deg difference)', () => {
    // Red (#ff0000, hue 0) -> Cyan (#00ffff, hue 180)
    const comp = generateComplementary('#ff0000');
    const hsla = hexToHsla(comp);
    expect(hsla?.h).toBe(180);
  });

  it('generates analogous hues (+/- 30deg difference)', () => {
    const [a1, a2] = generateAnalogous('#ff0000');
    const h1 = hexToHsla(a1)?.h;
    const h2 = hexToHsla(a2)?.h;
    expect(h1).toBe(30);
    expect(h2).toBe(330);
  });

  it('generates triadic palette (+120deg and +240deg)', () => {
    const [t1, t2] = generateTriadic('#ff0000');
    expect(hexToHsla(t1)?.h).toBe(120);
    expect(hexToHsla(t2)?.h).toBe(240);
  });

  it('generates monochromatic shades across lightness spectrum', () => {
    const shades = generateMonochromatic('#007acc');
    expect(shades.length).toBe(5);
  });

  it('generates coordinated neutral dark surface palette', () => {
    const neutrals = generateNeutralSurfaces('#7c3aed');
    expect(neutrals.length).toBe(5);
    neutrals.forEach((hex) => {
      expect(isValidHex(hex)).toBe(true);
    });
  });
});

describe('colorUtils - Color Blindness Simulation', () => {
  it('simulates protanopia, deuteranopia, tritanopia, and achromatopsia', () => {
    const testColor = '#ff5500';
    const protan = simulateColorBlindness(testColor, 'protanopia');
    const deut = simulateColorBlindness(testColor, 'deuteranopia');
    const trit = simulateColorBlindness(testColor, 'tritanopia');
    const achroma = simulateColorBlindness(testColor, 'achromatopsia');

    expect(isValidHex(protan)).toBe(true);
    expect(isValidHex(deut)).toBe(true);
    expect(isValidHex(trit)).toBe(true);
    expect(isValidHex(achroma)).toBe(true);

    // Achromatopsia must have equal R, G, B channels (gray)
    const achromaRgb = hexToRgba(achroma);
    expect(achromaRgb?.r).toBe(achromaRgb?.g);
    expect(achromaRgb?.g).toBe(achromaRgb?.b);
  });

  it('adjusts lightness and inverts colors correctly', () => {
    const darkened = adjustLightness('#808080', -20);
    expect(isValidHex(darkened)).toBe(true);
    const inverted = invertColor('#000000');
    expect(inverted).toBe('#ffffff');
  });
});

