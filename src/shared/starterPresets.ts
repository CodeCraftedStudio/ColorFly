/**
 * ColorFly: Curated Starter Presets
 * 8 Original, production-grade theme configurations tailored for visual ergonomics.
 *
 * Each preset now lives in its own isolated file under src/shared/presets/:
 *   - preset-midnight.ts
 *   - preset-deep-ocean.ts
 *   - preset-forest-terminal.ts
 *   - preset-warm-ember.ts
 *   - preset-soft-lavender.ts
 *   - preset-monochrome.ts
 *   - preset-minimal-light.ts
 *   - preset-high-contrast.ts
 *
 * This module re-exports them as a single STARTER_PRESETS array for
 * backward compatibility with ProfileService and other consumers.
 */

import { ThemeProfile } from './types';
import { PRESET_MIDNIGHT } from './presets/preset-midnight';
import { PRESET_DEEP_OCEAN } from './presets/preset-deep-ocean';
import { PRESET_FOREST_TERMINAL } from './presets/preset-forest-terminal';
import { PRESET_WARM_EMBER } from './presets/preset-warm-ember';
import { PRESET_SOFT_LAVENDER } from './presets/preset-soft-lavender';
import { PRESET_MONOCHROME } from './presets/preset-monochrome';
import { PRESET_MINIMAL_LIGHT } from './presets/preset-minimal-light';
import { PRESET_HIGH_CONTRAST } from './presets/preset-high-contrast';

export const STARTER_PRESETS: ThemeProfile[] = [
  PRESET_MIDNIGHT,
  PRESET_DEEP_OCEAN,
  PRESET_FOREST_TERMINAL,
  PRESET_WARM_EMBER,
  PRESET_SOFT_LAVENDER,
  PRESET_MONOCHROME,
  PRESET_MINIMAL_LIGHT,
  PRESET_HIGH_CONTRAST,
];

export {
  PRESET_MIDNIGHT,
  PRESET_DEEP_OCEAN,
  PRESET_FOREST_TERMINAL,
  PRESET_WARM_EMBER,
  PRESET_SOFT_LAVENDER,
  PRESET_MONOCHROME,
  PRESET_MINIMAL_LIGHT,
  PRESET_HIGH_CONTRAST,
};
