import type { StartModule } from './types'

/**
 * CARVE — start from a solid and cut it with a second shape.
 * The base solid is built like any other vase (hollow, with walls), then a
 * "cutter" solid is subtracted from it, or only the overlap is kept.
 * That is a boolean operation (CSG), the same idea as BooleanDifference in Rhino.
 * The actual cutting happens in geometry/carve.ts.
 */
export const BASE_SHAPES = [
  { value: 0, label: 'Sphere' },
  { value: 1, label: 'Box' },
  { value: 2, label: 'Cylinder' },
]
export const CUTTERS = [
  { value: 0, label: 'Sphere' },
  { value: 1, label: 'Cylinder' },
  { value: 2, label: 'Box' },
]
export const OPERATIONS = [
  { value: 0, label: 'Subtract' },
  { value: 1, label: 'Keep overlap' },
]

export const carve: StartModule = {
  id: 'carve',
  name: 'Carve',
  family: 'carve',
  blurb: 'Start from a solid and cut it with another shape — subtract it, or keep only the overlap.',
  controls: [
    { kind: 'choice', key: 'base', label: 'Start solid', options: BASE_SHAPES, help: 'The block you carve from.' },
    { key: 'size', label: 'Solid width', unit: 'mm', min: 60, max: 250, step: 1, help: 'Width of the starting solid.' },
    { key: 'height', label: 'Solid height', unit: 'mm', min: 60, max: 300, step: 1, help: 'Height of the starting solid.' },
    { kind: 'choice', key: 'operation', label: 'Operation', options: OPERATIONS, help: 'Subtract cuts the second shape away. Keep overlap keeps only what is inside both.' },
    { kind: 'choice', key: 'cutter', label: 'Cutting shape', options: CUTTERS, help: 'The shape you cut with.' },
    { key: 'cutterSize', label: 'Cutter size', unit: 'mm', min: 10, max: 400, step: 1, help: 'Diameter (or edge length) of the cutting shape.' },
    { key: 'cutterX', label: 'Cutter sideways', unit: 'mm', min: -200, max: 200, step: 1, help: 'Moves the cutter left or right.' },
    { key: 'cutterY', label: 'Cutter height', unit: '%', min: 0, max: 1.2, step: 0.01, percent: true, help: 'Moves the cutter up or down (share of the height).' },
    { key: 'cutterTilt', label: 'Cutter tilt', unit: '°', min: 0, max: 90, step: 1, help: '0° stands upright, 90° lies across (cylinders and boxes).' },
    { key: 'cutterSpin', label: 'Cutter spin', unit: '°', min: 0, max: 90, step: 1, help: 'Turns a box cutter around its own axis — 45° makes diamond-shaped windows, which print without support.' },
    { key: 'cutterCount', label: 'Repeat around', unit: '', min: 1, max: 8, step: 1, help: 'Copies of the cutter arranged around the vase.' },
  ],
  defaults: { base: 2, size: 120, height: 180, operation: 0, cutter: 2, cutterSize: 30, cutterX: 0, cutterY: 0.6, cutterTilt: 90, cutterSpin: 45, cutterCount: 4 },
  usesSection: false,
  representation: 'Solid A (hollow vase) and solid B, combined with a boolean',
  steps: ['Build solid A as a hollow vase', 'Build cutter B (× repeats)', 'Boolean: A − B or A ∩ B (CSG)'],
  results: ['Openings, scoops and facets impossible to "revolve"', 'Measured afterwards from the mesh', 'Wall thickness near cuts can\'t be guaranteed'],
}
