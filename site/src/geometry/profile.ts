import type { VaseParams } from './types'

/** Smoothstep: 0→1 with zero slope at both ends, so the curve never has a kink. */
const smooth = (s: number) => s * s * (3 - 2 * s)

/**
 * The silhouette of the vase before any decoration.
 * t goes from 0 (bottom) to 1 (top). Returns the outer radius in mm.
 *
 * Think of it as the curve you would draw in Rhino and then Revolve:
 * base radius → belly radius → top radius, eased so it reads as one gesture.
 */
export function profileRadius(p: VaseParams, t: number): number {
  const rb = p.baseDiameter / 2
  const rm = p.bellyDiameter / 2
  const rt = p.topDiameter / 2
  const b = Math.min(0.9, Math.max(0.1, p.bellyPosition))
  if (t <= b) return rb + (rm - rb) * smooth(t / b)
  return rm + (rt - rm) * smooth((t - b) / (1 - b))
}

/**
 * The decorated outer radius at height-fraction t and angle theta (radians).
 * Ribs: a cosine wave around the circumference, rotated by `twist` as we go up.
 * Waves: a sine wave along the height.
 * Both only push outward, so the profile above stays the "inner" silhouette.
 */
export function outerRadius(p: VaseParams, t: number, theta: number): number {
  let r = profileRadius(p, t)
  if (p.ribCount > 0 && p.ribDepth > 0) {
    const twistRad = (p.twist * Math.PI) / 180
    const phase = p.ribCount * (theta + twistRad * t)
    r += p.ribDepth * 0.5 * (1 + Math.cos(phase))
  }
  if (p.waveCount > 0 && p.waveDepth > 0) {
    r += p.waveDepth * 0.5 * (1 - Math.cos(2 * Math.PI * p.waveCount * t))
  }
  return r
}

/**
 * The inner radius. We simply move inwards by the wall thickness.
 * (A true "offset" would measure perpendicular to the surface — good enough for a vase,
 * and the printability check measures what we really produced.)
 */
export function innerRadius(p: VaseParams, t: number, theta: number): number {
  return Math.max(0.5, outerRadius(p, t, theta) - p.wallThickness)
}
