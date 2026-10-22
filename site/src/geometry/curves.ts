// Small curve helpers used by the starting points.

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** 0→1 with zero slope at both ends, so curves never have a kink. */
export const smoothstep = (e0: number, e1: number, x: number) => {
  const s = clamp((x - e0) / (e1 - e0), 0, 1)
  return s * s * (3 - 2 * s)
}

export interface ProfilePoint {
  /** height fraction, 0 = bottom, 1 = top */
  t: number
  /** radius in mm */
  r: number
}

/**
 * A smooth curve through control points (cubic Hermite with Catmull-Rom tangents).
 * This is what a "drawn profile" becomes — like an interpolated curve in Rhino.
 */
export function splineRadius(points: ProfilePoint[], t: number): number {
  const p = [...points].sort((a, b) => a.t - b.t)
  if (p.length === 0) return 10
  if (t <= p[0].t) return p[0].r
  if (t >= p[p.length - 1].t) return p[p.length - 1].r
  let i = 0
  while (i < p.length - 2 && t > p[i + 1].t) i++
  const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]
  const h = p2.t - p1.t || 1e-6
  const m1 = ((p2.r - p0.r) / (p2.t - p0.t || 1e-6)) * h
  const m2 = ((p3.r - p1.r) / (p3.t - p1.t || 1e-6)) * h
  const s = (t - p1.t) / h
  const s2 = s * s, s3 = s2 * s
  return (2 * s3 - 3 * s2 + 1) * p1.r + (s3 - 2 * s2 + s) * m1 + (-2 * s3 + 3 * s2) * p2.r + (s3 - s2) * m2
}

/**
 * Evenly spaced samples (bottom → top), e.g. from a sketch or an image outline.
 * Values are 0–1 (fraction of the widest point). Linear interpolation between them.
 */
export function sampledValue(samples: number[], t: number): number {
  if (samples.length === 0) return 1
  if (samples.length === 1) return samples[0]
  const x = clamp(t, 0, 1) * (samples.length - 1)
  const i = Math.min(samples.length - 2, Math.floor(x))
  return lerp(samples[i], samples[i + 1], x - i)
}

/** Moving-average smoothing. amount 0–1. */
export function smoothSamples(samples: number[], amount: number): number[] {
  const radius = Math.round(amount * 8)
  if (radius < 1) return samples
  return samples.map((_, i) => {
    let sum = 0, n = 0
    for (let k = -radius; k <= radius; k++) {
      const j = clamp(i + k, 0, samples.length - 1)
      sum += samples[j]
      n++
    }
    return sum / n
  })
}
