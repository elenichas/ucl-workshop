import { SECTION_DEFAULTS, type Values } from './controls'
import type { ProfilePoint } from '@/geometry/curves'
import { DEFAULT_SURFACE, getPattern, type Relief, type Surface } from '@/geometry/patterns'
import { STARTS } from '@/starts'
import type { StartId } from '@/starts/types'

/**
 * THE DESIGN — everything a person has chosen, in one object.
 * This is the "inputs" column of the system map.
 */
export interface Design {
  name: string
  /** Which starting point is active */
  start: StartId
  /** Values for every starting point, so switching back keeps your settings */
  starts: Record<StartId, Values>
  /** Control points of the "Draw a profile" start (t = height share, r = radius in mm) */
  profilePoints: ProfilePoint[]
  /** Freehand sketch: 64 radius samples 0–1, bottom → top */
  sketch: number[]
  /** Image start: outline samples, colours found in the image, a preview */
  imageStart: { samples: number[]; palette: string[]; preview: string } | null
  /** Image used by the "Image relief" pattern */
  relief: (Relief & { preview: string }) | null
  surface: Surface
  wall: { wallThickness: number; baseThickness: number }
  finish: Finish
  printerId: string
  materialId: string
}

export type FinishType = 'matte' | 'satin' | 'gloss' | 'speckle'

export interface Finish {
  mode: 'solid' | 'gradient'
  colorA: string
  colorB: string
  type: FinishType
}

const startDefaults = () =>
  Object.fromEntries(
    STARTS.map((s) => [s.id, { ...(s.usesSection ? SECTION_DEFAULTS : {}), ...s.defaults }]),
  ) as Record<StartId, Values>

/** A gentle amphora-like curve for the drawing editor to start from. */
export const DEFAULT_POINTS: ProfilePoint[] = [
  { t: 0, r: 38 },
  { t: 0.3, r: 64 },
  { t: 0.68, r: 34 },
  { t: 0.86, r: 30 },
  { t: 1, r: 44 },
]

/** A bottle-ish sketch, so the sketch start isn't empty. */
export const DEFAULT_SKETCH: number[] = Array.from({ length: 64 }, (_, i) => {
  const t = i / 63
  return 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.25)) * (t < 0.8 ? 1 : 0.6) + (t > 0.85 ? (t - 0.85) * 1.2 : 0)
}).map((x) => Math.min(1, x))

export function newDesign(): Design {
  return {
    name: 'Amphora',
    start: 'round',
    starts: startDefaults(),
    profilePoints: DEFAULT_POINTS,
    sketch: DEFAULT_SKETCH,
    imageStart: null,
    relief: null,
    surface: DEFAULT_SURFACE,
    wall: { wallThickness: 2, baseThickness: 2.4 },
    finish: { mode: 'solid', colorA: '#E6DFD0', colorB: '#A6482A', type: 'satin' },
    printerId: 'fdm-desktop',
    materialId: 'pla',
  }
}

/** Change one start's values without touching the rest. */
export const withStartValues = (d: Design, id: StartId, patch: Values): Design => ({
  ...d,
  starts: { ...d.starts, [id]: { ...d.starts[id], ...patch } },
})

export const surfaceFor = (pattern: string, keep: Values = {}): Surface => ({
  pattern,
  values: { depth: keep.depth ?? 3, twist: keep.twist ?? 0, bandStart: keep.bandStart ?? 0, bandEnd: keep.bandEnd ?? 1, ...getPattern(pattern).defaults },
})

// ---------------------------------------------------------------------------
// PRESETS — named starting points, each a complete design.
type PresetPatch = Partial<Omit<Design, 'starts'>> & { startValues?: Values; surfaceValues?: Values }

function preset(name: string, start: StartId, patch: PresetPatch): Design {
  const d = newDesign()
  const { startValues, surfaceValues, ...rest } = patch
  const base: Design = { ...d, ...rest, name, start }
  const withValues = startValues ? withStartValues(base, start, startValues) : base
  return surfaceValues ? { ...withValues, surface: { ...withValues.surface, values: { ...withValues.surface.values, ...surfaceValues } } } : withValues
}

export const PRESETS: { id: string; design: Design }[] = [
  { id: 'amphora', design: newDesign() },
  {
    id: 'column',
    design: preset('Fluted column', 'round', {
      startValues: { height: 210, baseDiameter: 90, bellyDiameter: 92, topDiameter: 90, bellyPosition: 0.5 },
      surface: surfaceFor('ribs', { depth: 2.5 }), surfaceValues: { count: 32 },
    }),
  },
  {
    id: 'moon',
    design: preset('Moon jar', 'sphere', {
      startValues: { diameter: 170, squash: 0.95, footDiameter: 130, openingDiameter: 80 },
      surface: surfaceFor('noise', { depth: 1.6 }),
      finish: { mode: 'solid', colorA: '#F2F0EB', colorB: '#5D7FA8', type: 'gloss' },
      materialId: 'petg', wall: { wallThickness: 2.4, baseThickness: 3 },
    }),
  },
  {
    id: 'pillow',
    design: preset('Pillow box', 'box', {
      startValues: { width: 120, depth: 70, height: 150, rounding: 0.55, taper: 1.1, bulge: 0.15, twist: 0 },
      surface: surfaceFor('knit', { depth: 1.8 }),
      finish: { mode: 'solid', colorA: '#8C9A7E', colorB: '#E6DFD0', type: 'matte' },
    }),
  },
  {
    id: 'hex',
    design: preset('Twisted hex', 'polygon', {
      startValues: { sides: 6, diameter: 110, height: 200, star: 0, softness: 0.05, taper: 0.75, twist: 120 },
      surface: surfaceFor('none'),
      finish: { mode: 'gradient', colorA: '#2D4F8E', colorB: '#E6DFD0', type: 'satin' },
    }),
  },
  {
    id: 'tulip',
    design: preset('Tulip', 'cone', {
      startValues: { baseDiameter: 60, topDiameter: 130, height: 190, curve: 0.6 },
      surface: surfaceFor('ribs', { depth: 5, twist: 90 }), surfaceValues: { count: 6 },
      finish: { mode: 'solid', colorA: '#B5532F', colorB: '#E6DFD0', type: 'satin' },
    }),
  },
  {
    id: 'honey',
    design: preset('Honeycomb', 'round', {
      startValues: { height: 170, baseDiameter: 90, bellyDiameter: 115, topDiameter: 80, bellyPosition: 0.45 },
      surface: surfaceFor('honeycomb', { depth: 1.2 }),
      finish: { mode: 'solid', colorA: '#C98A2B', colorB: '#E6DFD0', type: 'gloss' },
      materialId: 'petg',
    }),
  },
  {
    id: 'clay-pot',
    design: preset('Clay pot', 'round', {
      startValues: { height: 150, baseDiameter: 110, bellyDiameter: 130, topDiameter: 100, bellyPosition: 0.45 },
      surface: surfaceFor('ribs', { depth: 4, twist: 30 }), surfaceValues: { count: 10 },
      wall: { wallThickness: 4, baseThickness: 5 },
      finish: { mode: 'solid', colorA: '#A0583A', colorB: '#E6DFD0', type: 'speckle' },
      printerId: 'clay', materialId: 'stoneware',
    }),
  },
  {
    id: 'lantern',
    design: preset('Lantern', 'carve', {
      startValues: { base: 2, size: 120, height: 180, operation: 0, cutter: 2, cutterSize: 30, cutterX: 0, cutterY: 0.6, cutterTilt: 90, cutterSpin: 45, cutterCount: 4 },
      surface: surfaceFor('none'),
      finish: { mode: 'solid', colorA: '#E6DFD0', colorB: '#A6482A', type: 'matte' },
    }),
  },
]

export const getPreset = (id: string) => PRESETS.find((p) => p.id === id)?.design ?? newDesign()
