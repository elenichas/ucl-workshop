import type { VaseParams } from '@/geometry/types'

/**
 * Every control in the UI is described here once: label, unit, range, help text.
 * The UI is generated from this list — to add a parameter, add it here
 * (and use it in geometry/profile.ts).
 */
export interface ParamDef {
  key: keyof VaseParams
  label: string
  unit: string
  min: number
  max: number
  step: number
  group: 'shape' | 'surface' | 'print'
  help: string
  /** Show the value multiplied (e.g. 0.5 → 50 %) */
  display?: (v: number) => string
}

export const PARAMS: ParamDef[] = [
  { key: 'height', label: 'Height', unit: 'mm', min: 60, max: 400, step: 1, group: 'shape', help: 'Total height from the table to the rim.' },
  { key: 'baseDiameter', label: 'Base diameter', unit: 'mm', min: 40, max: 250, step: 1, group: 'shape', help: 'Width where the vase touches the table. Wider = more stable.' },
  { key: 'bellyDiameter', label: 'Belly diameter', unit: 'mm', min: 40, max: 300, step: 1, group: 'shape', help: 'Width at the widest (or narrowest) point.' },
  { key: 'topDiameter', label: 'Top diameter', unit: 'mm', min: 30, max: 250, step: 1, group: 'shape', help: 'Width of the opening.' },
  { key: 'bellyPosition', label: 'Belly position', unit: '%', min: 0.1, max: 0.9, step: 0.01, group: 'shape', help: 'How high the belly sits, as a share of the height.', display: (v) => Math.round(v * 100).toString() },
  { key: 'ribCount', label: 'Ribs', unit: '', min: 0, max: 48, step: 1, group: 'surface', help: 'Vertical ridges around the vase. 0 = smooth.' },
  { key: 'ribDepth', label: 'Rib depth', unit: 'mm', min: 0, max: 15, step: 0.1, group: 'surface', help: 'How far each ridge sticks out.' },
  { key: 'twist', label: 'Twist', unit: '°', min: -360, max: 360, step: 1, group: 'surface', help: 'How much the ribs rotate from bottom to top.' },
  { key: 'waveCount', label: 'Ripples', unit: '', min: 0, max: 12, step: 1, group: 'surface', help: 'Horizontal bands from bottom to top.' },
  { key: 'waveDepth', label: 'Ripple depth', unit: 'mm', min: 0, max: 10, step: 0.1, group: 'surface', help: 'How far each band sticks out.' },
  { key: 'wallThickness', label: 'Wall thickness', unit: 'mm', min: 0.8, max: 8, step: 0.1, group: 'print', help: 'Thickness of the side wall. Clay needs much more than plastic.' },
  { key: 'baseThickness', label: 'Floor thickness', unit: 'mm', min: 1, max: 10, step: 0.1, group: 'print', help: 'Thickness of the bottom.' },
]

export const DEFAULT_PARAMS: VaseParams = {
  height: 180,
  baseDiameter: 80,
  bellyDiameter: 130,
  topDiameter: 70,
  bellyPosition: 0.38,
  ribCount: 18,
  ribDepth: 3,
  twist: 60,
  waveCount: 0,
  waveDepth: 0,
  wallThickness: 2,
  baseThickness: 2.4,
}

/** Starting points with a name. Good for people who don't know where to begin. */
export const PRESETS: { id: string; name: string; params: VaseParams }[] = [
  { id: 'amphora', name: 'Amphora', params: DEFAULT_PARAMS },
  {
    id: 'column', name: 'Fluted column',
    params: { ...DEFAULT_PARAMS, height: 240, baseDiameter: 90, bellyDiameter: 92, topDiameter: 90, bellyPosition: 0.5, ribCount: 32, ribDepth: 2.5, twist: 0, waveCount: 0, waveDepth: 0 },
  },
  {
    id: 'tulip', name: 'Tulip',
    params: { ...DEFAULT_PARAMS, height: 200, baseDiameter: 60, bellyDiameter: 110, topDiameter: 130, bellyPosition: 0.7, ribCount: 6, ribDepth: 8, twist: 120, waveCount: 0, waveDepth: 0 },
  },
  {
    id: 'stack', name: 'Stacked bowls',
    params: { ...DEFAULT_PARAMS, height: 160, baseDiameter: 90, bellyDiameter: 110, topDiameter: 100, bellyPosition: 0.5, ribCount: 0, ribDepth: 0, twist: 0, waveCount: 5, waveDepth: 6 },
  },
  {
    id: 'clay-pot', name: 'Clay pot',
    params: { ...DEFAULT_PARAMS, height: 150, baseDiameter: 110, bellyDiameter: 130, topDiameter: 100, bellyPosition: 0.45, ribCount: 10, ribDepth: 4, twist: 30, waveCount: 0, waveDepth: 0, wallThickness: 4, baseThickness: 5 },
  },
]
