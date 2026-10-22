// Tiny 3D noise functions for the organic patterns.
// We sample them on the cylinder in 3D (x, y, z) so the pattern wraps around
// the vase without a visible seam.

function hash3(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967295
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

/** Smooth value noise in 0–1. */
export function valueNoise(x: number, y: number, z: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const xf = x - xi, yf = y - yi, zf = z - zi
  const u = fade(xf), v = fade(yf), w = fade(zf)
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz)
  const l = (a: number, b: number, t: number) => a + (b - a) * t
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  )
}

/** Layered noise ("fractal") — big shapes plus finer detail. 0–1. */
export function fbm(x: number, y: number, z: number): number {
  let sum = 0, amp = 0.5, f = 1, norm = 0
  for (let o = 0; o < 3; o++) {
    sum += amp * valueNoise(x * f, y * f, z * f)
    norm += amp
    amp *= 0.5
    f *= 2.03
  }
  return sum / norm
}

/**
 * Cellular (Voronoi) noise: returns the gap between the nearest and second-nearest
 * random point. Small values = near a cell border.
 */
export function voronoiEdge(x: number, y: number, z: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  let f1 = Infinity, f2 = Infinity
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      for (let dz = -1; dz <= 1; dz++) {
        const cx = xi + dx, cy = yi + dy, cz = zi + dz
        const px = cx + hash3(cx, cy, cz)
        const py = cy + hash3(cy, cz, cx)
        const pz = cz + hash3(cz, cx, cy)
        const d = Math.hypot(px - x, py - y, pz - z)
        if (d < f1) { f2 = f1; f1 = d } else if (d < f2) f2 = d
      }
  return f2 - f1
}
