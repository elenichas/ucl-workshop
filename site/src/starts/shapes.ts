import { clamp, lerp, smoothstep } from '@/geometry/curves'
import { polygonFactor, roundingToExponent, superellipseRadius } from '@/geometry/sections'
import type { Values } from '@/design/controls'
import type { StartModule } from './types'

/** Applies the shared cross-section controls to a round radius. */
export function sectionFactor(v: Values, t: number, theta: number): number {
  if (!(v.sides >= 3)) return 1
  const rot = ((v.sectionTwist ?? 0) * Math.PI) / 180 * t
  return polygonFactor(theta - rot, v.sides, v.star ?? 0, v.softness ?? 0)
}

// ---------------------------------------------------------------------------
export const round: StartModule = {
  id: 'round',
  name: 'Round',
  family: 'shape',
  blurb: 'The classic: base, belly and top, eased into one curve and spun around the axis.',
  controls: [
    { key: 'height', label: 'Height', unit: 'mm', min: 60, max: 400, step: 1, help: 'Total height from the table to the rim.' },
    { key: 'baseDiameter', label: 'Base diameter', unit: 'mm', min: 30, max: 250, step: 1, help: 'Width where the vase touches the table.' },
    { key: 'bellyDiameter', label: 'Belly diameter', unit: 'mm', min: 30, max: 300, step: 1, help: 'Width at the widest (or narrowest) point.' },
    { key: 'topDiameter', label: 'Top diameter', unit: 'mm', min: 20, max: 250, step: 1, help: 'Width of the opening.' },
    { key: 'bellyPosition', label: 'Belly position', unit: '%', min: 0.1, max: 0.9, step: 0.01, percent: true, help: 'How high the belly sits.' },
  ],
  defaults: { height: 180, baseDiameter: 80, bellyDiameter: 130, topDiameter: 70, bellyPosition: 0.38 },
  usesSection: true,
  representation: 'Three diameters + where the belly sits → a smooth profile curve',
  steps: ['Ease base → belly → top (smoothstep)', 'Revolve the profile'],
  results: ['Smooth, rotationally symmetric body', 'Overhang risk where the belly flares out'],
  field: (v) => ({
    height: v.height,
    radius: (t, theta) => {
      const b = clamp(v.bellyPosition, 0.1, 0.9)
      const r = t <= b
        ? lerp(v.baseDiameter / 2, v.bellyDiameter / 2, smoothstep(0, 1, t / b))
        : lerp(v.bellyDiameter / 2, v.topDiameter / 2, smoothstep(0, 1, (t - b) / (1 - b)))
      return r * sectionFactor(v, t, theta)
    },
  }),
}

// ---------------------------------------------------------------------------
/** Geometry of a sphere with a flat foot and an opening — shared with Carve. */
export function sphereGeometry(v: Values) {
  const R = v.diameter / 2
  const Rv = R * v.squash
  const rb = Math.min(v.footDiameter / 2, R * 0.97)
  const rt = Math.min(v.openingDiameter / 2, R * 0.97)
  const zb = -Rv * Math.sqrt(1 - (rb / R) ** 2)
  const zt = Rv * Math.sqrt(1 - (rt / R) ** 2)
  return { R, Rv, zb, zt, height: zt - zb }
}

export const sphere: StartModule = {
  id: 'sphere',
  name: 'Sphere',
  family: 'shape',
  blurb: 'A ball with a flat foot cut off the bottom and an opening cut off the top.',
  controls: [
    { key: 'diameter', label: 'Diameter', unit: 'mm', min: 60, max: 300, step: 1, help: 'Width of the full sphere.' },
    { key: 'squash', label: 'Squash', unit: '%', min: 0.5, max: 1.6, step: 0.01, percent: true, help: 'Below 100 % a lentil, above an egg.' },
    { key: 'footDiameter', label: 'Foot diameter', unit: 'mm', min: 20, max: 200, step: 1, help: 'Size of the flat cut at the bottom. Bigger = more stable, less round.' },
    { key: 'openingDiameter', label: 'Opening', unit: 'mm', min: 15, max: 200, step: 1, help: 'Size of the cut at the top.' },
  ],
  defaults: { diameter: 150, squash: 1, footDiameter: 80, openingDiameter: 60 },
  usesSection: false,
  representation: 'An ellipse (diameter × squash), cut by two horizontal planes',
  steps: ['Ellipse radius at each height', 'Cut a flat foot and an opening', 'Height is derived, not set'],
  results: ['Height follows from diameter, squash and cuts', 'Lower half always overhangs — strict for clay'],
  field: (v) => {
    const g = sphereGeometry(v)
    return {
      height: g.height,
      radius: (t) => {
        const z = g.zb + t * g.height
        return Math.max(1, g.R * Math.sqrt(Math.max(0, 1 - (z / g.Rv) ** 2)))
      },
    }
  },
}

// ---------------------------------------------------------------------------
export const box: StartModule = {
  id: 'box',
  name: 'Box',
  family: 'shape',
  blurb: 'A rectangular vessel: from sharp-cornered to pillow-soft, tapered, bulging or twisted.',
  controls: [
    { key: 'width', label: 'Width', unit: 'mm', min: 40, max: 250, step: 1, help: 'Size along x.' },
    { key: 'depth', label: 'Depth', unit: 'mm', min: 40, max: 250, step: 1, help: 'Size along y.' },
    { key: 'height', label: 'Height', unit: 'mm', min: 40, max: 400, step: 1, help: 'Total height.' },
    { key: 'rounding', label: 'Corner rounding', unit: '%', min: 0, max: 1, step: 0.01, percent: true, help: '0 % sharp corners · 50 % pillow · 100 % fully round.' },
    { key: 'taper', label: 'Top size', unit: '%', min: 0.4, max: 1.6, step: 0.01, percent: true, help: 'Size of the top compared with the base.' },
    { key: 'bulge', label: 'Bulge', unit: '%', min: -0.3, max: 0.4, step: 0.01, percent: true, help: 'Swells (or pinches) the middle.' },
    { key: 'twist', label: 'Twist', unit: '°', min: -180, max: 180, step: 1, help: 'Rotates the box from bottom to top.' },
  ],
  defaults: { width: 110, depth: 80, height: 170, rounding: 0.35, taper: 0.9, bulge: 0.08, twist: 0 },
  usesSection: false,
  representation: 'A rounded rectangle (superellipse) scaled along the height',
  steps: ['Superellipse cross-section', 'Scale by taper and bulge', 'Rotate by twist'],
  results: ['Flat faces and corners', 'Width ≠ depth: the build-volume check uses both', 'Corners thin the wall slightly'],
  field: (v) => {
    const n = roundingToExponent(v.rounding)
    return {
      height: v.height,
      radius: (t, theta) => {
        const s = lerp(1, v.taper, t) * (1 + v.bulge * Math.sin(Math.PI * t))
        const rot = ((v.twist * Math.PI) / 180) * t
        return s * superellipseRadius(theta - rot, v.width / 2, v.depth / 2, n)
      },
    }
  },
}

// ---------------------------------------------------------------------------
export const polygon: StartModule = {
  id: 'polygon',
  name: 'Polygon',
  family: 'shape',
  blurb: 'A prism with 3 to 12 sides — or a star — that can taper and twist.',
  controls: [
    { key: 'sides', label: 'Sides', unit: '', min: 3, max: 12, step: 1, help: 'Number of flat faces.' },
    { key: 'diameter', label: 'Diameter', unit: 'mm', min: 40, max: 250, step: 1, help: 'Across the corners.' },
    { key: 'height', label: 'Height', unit: 'mm', min: 40, max: 400, step: 1, help: 'Total height.' },
    { key: 'star', label: 'Star depth', unit: '%', min: 0, max: 0.6, step: 0.01, percent: true, help: '0 % polygon, higher = deeper star.' },
    { key: 'softness', label: 'Softness', unit: '%', min: 0, max: 1, step: 0.01, percent: true, help: 'Rounds the faces towards a circle.' },
    { key: 'taper', label: 'Top size', unit: '%', min: 0.4, max: 1.6, step: 0.01, percent: true, help: 'Size of the top compared with the base.' },
    { key: 'twist', label: 'Twist', unit: '°', min: -360, max: 360, step: 1, help: 'Rotates the polygon from bottom to top.' },
  ],
  defaults: { sides: 6, diameter: 120, height: 190, star: 0, softness: 0, taper: 0.8, twist: 90 },
  usesSection: false,
  representation: 'A polygon or star outline, scaled and rotated along the height',
  steps: ['Polygon / star cross-section', 'Scale by taper', 'Rotate by twist'],
  results: ['Faceted faces catch light', 'Twisted faces lean: overhang grows with twist', 'Star points are thin details'],
  field: (v) => ({
    height: v.height,
    radius: (t, theta) => {
      const rot = ((v.twist * Math.PI) / 180) * t
      return (v.diameter / 2) * lerp(1, v.taper, t) * polygonFactor(theta - rot, v.sides, v.star, v.softness)
    },
  }),
}

// ---------------------------------------------------------------------------
export const cone: StartModule = {
  id: 'cone',
  name: 'Cone',
  family: 'shape',
  blurb: 'Straight, flared like a tulip, or bellied like a bottle — one curve between two circles.',
  controls: [
    { key: 'baseDiameter', label: 'Base diameter', unit: 'mm', min: 30, max: 250, step: 1, help: 'Width at the bottom.' },
    { key: 'topDiameter', label: 'Top diameter', unit: 'mm', min: 20, max: 300, step: 1, help: 'Width at the top.' },
    { key: 'height', label: 'Height', unit: 'mm', min: 40, max: 400, step: 1, help: 'Total height.' },
    { key: 'curve', label: 'Curve', unit: '%', min: -1, max: 1, step: 0.01, percent: true, help: 'Negative: widens early (bottle) · 0: straight · positive: widens late (tulip).' },
  ],
  defaults: { baseDiameter: 70, topDiameter: 140, height: 170, curve: 0.5 },
  usesSection: true,
  representation: 'Two circles joined by a power curve',
  steps: ['Power curve between base and top'],
  results: ['Simplest profile: one gesture', 'A late flare is the steepest overhang'],
  field: (v) => {
    const k = Math.pow(2, v.curve * 1.6)
    return {
      height: v.height,
      radius: (t, theta) => lerp(v.baseDiameter / 2, v.topDiameter / 2, Math.pow(t, k)) * sectionFactor(v, t, theta),
    }
  },
}

