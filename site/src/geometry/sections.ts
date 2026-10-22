// Cross-sections: the shape of a horizontal slice through the vase.
// Each returns a radius factor for an angle theta (1 = the nominal radius).

const TAU = Math.PI * 2

/**
 * A regular polygon (sides ≥ 3), optionally a star (star 0–0.8 pulls every other
 * corner inwards), with softness 0–1 blending towards a circle.
 * Returns the distance from the centre to the outline along angle theta,
 * for a shape whose corners touch radius 1.
 */
export function polygonFactor(theta: number, sides: number, star = 0, softness = 0): number {
  if (sides < 3) return 1
  const n = Math.round(sides)
  // A star has 2n corners alternating between radius 1 and 1 - star.
  const corners = star > 0 ? 2 * n : n
  const seg = TAU / corners
  let a = theta % TAU
  if (a < 0) a += TAU
  const k = Math.floor(a / seg)
  const r0 = star > 0 && k % 2 === 1 ? 1 - star : 1
  const r1 = star > 0 && (k + 1) % 2 === 1 ? 1 - star : 1
  // Intersect the ray at angle a with the straight segment between the two corners.
  const a0 = k * seg, a1 = (k + 1) * seg
  const x0 = r0 * Math.cos(a0), y0 = r0 * Math.sin(a0)
  const x1 = r1 * Math.cos(a1), y1 = r1 * Math.sin(a1)
  const dx = Math.cos(a), dy = Math.sin(a)
  const ex = x1 - x0, ey = y1 - y0
  const denom = dx * ey - dy * ex
  const r = Math.abs(denom) < 1e-9 ? r0 : (x0 * ey - y0 * ex) / denom
  return r * (1 - softness) + softness * (star > 0 ? 1 - star / 2 : Math.cos(Math.PI / n) * 0.5 + 0.5)
}

/**
 * A superellipse ("squircle"): exponent 2 is an ellipse, large exponents approach
 * a rectangle with sharp corners. a and b are the half-width and half-depth.
 * Returns the actual radius in mm at angle theta.
 */
export function superellipseRadius(theta: number, a: number, b: number, exponent: number): number {
  const c = Math.abs(Math.cos(theta)) / a
  const s = Math.abs(Math.sin(theta)) / b
  return Math.pow(Math.pow(c, exponent) + Math.pow(s, exponent), -1 / exponent)
}

/** corner rounding 0 (sharp) … 1 (fully round) → superellipse exponent */
export const roundingToExponent = (rounding: number) => 2 + Math.pow(1 - rounding, 2) * 30
