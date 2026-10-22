import { clamp, smoothstep } from './curves'
import { fbm, voronoiEdge } from './noise'
import type { ControlDef, Values } from '@/design/controls'

/**
 * SURFACE PATTERNS
 * ----------------
 * A pattern pushes the wall outwards by 0…depth mm at every point.
 * Because it changes the geometry (not just the colour), it prints.
 *
 * Each pattern gets: u = position around the vase (0–1), v = height in mm,
 * t = height fraction (0–1), and the vase's reference circumference, so that
 * patterns repeat a whole number of times around and never show a seam.
 */
export interface PatternContext {
  u: number
  v: number
  t: number
  theta: number
  /** circumference of an average slice, in mm */
  circumference: number
  /** average radius in mm */
  refRadius: number
  values: Values
  relief?: Relief
}

export interface Relief {
  width: number
  height: number
  /** 0–1 brightness, row 0 = top of the image */
  data: Float32Array
}

export interface PatternDef {
  id: string
  name: string
  blurb: string
  /** pattern-specific controls (depth, band and twist are shared) */
  controls: ControlDef[]
  defaults: Values
  /** smallest feature size in mm, for the printability check */
  featureSize: (values: Values, circumference: number) => number
  fn: (c: PatternContext) => number
}

const fract = (x: number) => x - Math.floor(x)
const repeats = (circ: number, size: number) => Math.max(1, Math.round(circ / Math.max(1, size)))

export const SHARED_PATTERN_CONTROLS: ControlDef[] = [
  { key: 'depth', label: 'Depth', unit: 'mm', min: 0, max: 12, step: 0.1, help: 'How far the pattern stands out from the wall.' },
  { key: 'twist', label: 'Twist', unit: '°', min: -360, max: 360, step: 1, help: 'Rotates the pattern as it rises.' },
  { key: 'bandStart', label: 'Band from', unit: '%', min: 0, max: 1, step: 0.01, percent: true, help: 'Where the pattern starts, as a share of the height.' },
  { key: 'bandEnd', label: 'Band to', unit: '%', min: 0, max: 1, step: 0.01, percent: true, help: 'Where the pattern ends.' },
]

const sizeControl = (label = 'Size', help = 'Size of one repeat of the pattern.'): ControlDef => ({
  key: 'size', label, unit: 'mm', min: 4, max: 60, step: 0.5, help,
})

export const PATTERNS: PatternDef[] = [
  {
    id: 'none', name: 'Smooth', blurb: 'No pattern.', controls: [], defaults: {},
    featureSize: () => Infinity, fn: () => 0,
  },
  {
    id: 'ribs', name: 'Ribs', blurb: 'Vertical ridges, optionally spiralling.',
    controls: [{ key: 'count', label: 'Ribs', unit: '', min: 2, max: 64, step: 1, help: 'Number of ridges around the vase.' }],
    defaults: { count: 18 },
    featureSize: (v, c) => c / Math.max(1, v.count) / 2,
    fn: ({ u, values }) => 0.5 * (1 + Math.cos(2 * Math.PI * Math.round(values.count) * u)),
  },
  {
    id: 'ripples', name: 'Ripples', blurb: 'Horizontal bands, like a stack of rings.',
    controls: [{ key: 'count', label: 'Ripples', unit: '', min: 1, max: 30, step: 1, help: 'Number of bands from bottom to top.' }],
    defaults: { count: 6 },
    featureSize: () => 3,
    fn: ({ t, values }) => 0.5 * (1 - Math.cos(2 * Math.PI * Math.round(values.count) * t)),
  },
  {
    id: 'knurl', name: 'Diamond knurl', blurb: 'Small pyramids, like a tool grip.',
    controls: [sizeControl()], defaults: { size: 12 },
    featureSize: (v) => v.size / 2,
    fn: ({ u, v, circumference, values }) => {
      const n = repeats(circumference, values.size)
      const a = u * n + v / values.size, b = u * n - v / values.size
      return clamp(1 - (Math.abs(fract(a) - 0.5) + Math.abs(fract(b) - 0.5)), 0, 1)
    },
  },
  {
    id: 'honeycomb', name: 'Honeycomb', blurb: 'Hexagonal cells with raised walls.',
    controls: [sizeControl('Cell size')], defaults: { size: 14 },
    featureSize: (v) => v.size * 0.12,
    fn: ({ u, v, circumference, values }) => {
      const s = values.size
      const cols = repeats(circumference, s * Math.sqrt(3))
      // coordinates in "hex units" (circumradius 1)
      const x = u * cols * Math.sqrt(3)
      const y = v / s
      // nearest centre on two offset rectangular lattices
      const gx = Math.sqrt(3), gy = 3
      const ax = x - gx * Math.round(x / gx), ay = y - gy * Math.round(y / gy)
      const bx = x - gx * (Math.round(x / gx - 0.5) + 0.5), by = y - gy * (Math.round(y / gy - 0.5) + 0.5)
      const [dx, dy] = ax * ax + ay * ay < bx * bx + by * by ? [ax, ay] : [bx, by]
      // hexagon "radius" of the point inside its cell (0 centre … 1 edge)
      const q = Math.max((Math.abs(dx) * 2) / Math.sqrt(3), Math.abs(dx) / Math.sqrt(3) + Math.abs(dy))
      return smoothstep(0.6, 0.95, q)
    },
  },
  {
    id: 'scales', name: 'Scales', blurb: 'Overlapping rounded scales, like a fish or a pine cone.',
    controls: [sizeControl('Scale size')], defaults: { size: 16 },
    featureSize: (v) => v.size / 3,
    fn: ({ u, v, circumference, values }) => {
      const n = repeats(circumference, values.size)
      const row = Math.floor(v / (values.size * 0.6))
      const cy = fract(v / (values.size * 0.6))
      const cx = fract(u * n + (row % 2) * 0.5)
      const d = Math.hypot((cx - 0.5) * 1.2, cy * 1.0)
      return clamp(1 - d, 0, 1) ** 0.7
    },
  },
  {
    id: 'bricks', name: 'Bricks', blurb: 'Stretcher bond — grooves where the mortar would be.',
    controls: [sizeControl('Course height')], defaults: { size: 10 },
    featureSize: (v) => v.size * 0.15,
    fn: ({ u, v, circumference, values }) => {
      const s = values.size
      const n = repeats(circumference, s * 2.2)
      const row = Math.floor(v / s)
      const fy = fract(v / s)
      const fx = fract(u * n + (row % 2) * 0.5)
      const m = 0.1
      const mortar = Math.max(1 - smoothstep(0, m, fy) + smoothstep(1 - m, 1, fy), 1 - smoothstep(0, m * 0.5, fx) + smoothstep(1 - m * 0.5, 1, fx))
      return clamp(1 - mortar, 0, 1)
    },
  },
  {
    id: 'knit', name: 'Knit', blurb: 'Rows of V-shaped stitches, like a jumper.',
    controls: [sizeControl('Stitch size')], defaults: { size: 8 },
    featureSize: (v) => v.size / 3,
    fn: ({ u, v, circumference, values }) => {
      const n = repeats(circumference, values.size)
      const a = fract(u * n)
      const b = v / (values.size * 0.8)
      const lean = Math.abs(a - 0.5) * 1.6
      const stitch = 0.5 * (1 + Math.cos(2 * Math.PI * (b + lean)))
      const column = smoothstep(0, 0.12, a) * (1 - smoothstep(0.88, 1, a))
      return stitch * column
    },
  },
  {
    id: 'noise', name: 'Organic', blurb: 'Soft, irregular bumps, like hand-built clay.',
    controls: [sizeControl('Scale', 'Size of the bumps.'), { key: 'seed', label: 'Variation', unit: '', min: 0, max: 50, step: 1, help: 'A different random pattern.' }],
    defaults: { size: 30, seed: 7 },
    featureSize: (v) => v.size / 2,
    fn: ({ theta, v, refRadius, values }) => {
      const s = values.size
      return fbm((Math.cos(theta) * refRadius) / s + values.seed * 13.1, v / s, (Math.sin(theta) * refRadius) / s)
    },
  },
  {
    id: 'voronoi', name: 'Cells', blurb: 'Irregular cells with raised borders — leaves, cracked glaze, bone.',
    controls: [sizeControl('Cell size'), { key: 'seed', label: 'Variation', unit: '', min: 0, max: 50, step: 1, help: 'A different random pattern.' }],
    defaults: { size: 18, seed: 3 },
    featureSize: (v) => v.size * 0.12,
    fn: ({ theta, v, refRadius, values }) => {
      const s = values.size
      const e = voronoiEdge((Math.cos(theta) * refRadius) / s + values.seed * 7.7, v / s, (Math.sin(theta) * refRadius) / s)
      return 1 - smoothstep(0.0, 0.18, e)
    },
  },
  {
    id: 'image', name: 'Image relief', blurb: 'An uploaded image pressed into the wall — light areas stand out.',
    controls: [{ key: 'repeat', label: 'Repeats around', unit: '', min: 1, max: 8, step: 1, help: 'How many times the image wraps around the vase.' }],
    defaults: { repeat: 2 },
    featureSize: () => 2,
    fn: ({ u, t, values, relief }) => {
      if (!relief) return 0
      const x = fract(u * Math.round(values.repeat)) * (relief.width - 1)
      const y = (1 - t) * (relief.height - 1)
      const xi = Math.floor(x), yi = Math.floor(y)
      const xj = Math.min(relief.width - 1, xi + 1), yj = Math.min(relief.height - 1, yi + 1)
      const fx = x - xi, fy = y - yi
      const g = (xx: number, yy: number) => relief.data[yy * relief.width + xx]
      const top = g(xi, yi) * (1 - fx) + g(xj, yi) * fx
      const bot = g(xi, yj) * (1 - fx) + g(xj, yj) * fx
      return top * (1 - fy) + bot * fy
    },
  },
]

export const getPattern = (id: string) => PATTERNS.find((p) => p.id === id) ?? PATTERNS[0]

export interface Surface {
  pattern: string
  /** shared (depth, twist, band) + pattern-specific values */
  values: Values
}

export const DEFAULT_SURFACE: Surface = {
  pattern: 'ribs',
  values: { depth: 3, twist: 60, bandStart: 0, bandEnd: 1, ...PATTERNS[1].defaults },
}

/** The outward push in mm at one point of the wall. */
export function displacement(surface: Surface, t: number, theta: number, height: number, refRadius: number, relief?: Relief): number {
  const def = getPattern(surface.pattern)
  const v = surface.values
  if (def.id === 'none' || !(v.depth > 0)) return 0
  const b0 = Math.min(v.bandStart ?? 0, v.bandEnd ?? 1), b1 = Math.max(v.bandStart ?? 0, v.bandEnd ?? 1)
  if (b1 - b0 < 0.005) return 0
  const feather = 0.03
  const band = (b0 <= 0 ? 1 : smoothstep(b0, b0 + feather, t)) * (b1 >= 1 ? 1 : 1 - smoothstep(b1 - feather, b1, t))
  if (band <= 0) return 0
  const twistTurns = ((v.twist ?? 0) / 360) * t
  let u = theta / (2 * Math.PI) + twistTurns
  u -= Math.floor(u)
  const circumference = 2 * Math.PI * refRadius
  const value = def.fn({ u, v: t * height, t, theta: theta + twistTurns * 2 * Math.PI, circumference, refRadius, values: v, relief })
  return v.depth * band * clamp(value, 0, 1)
}
