import { isWatertight, meshVolume } from './buildVase'
import type { VaseStats } from './types'

/**
 * Measures ANY closed mesh, without knowing how it was made.
 * Used for carved vases, where we can't read the answers off a profile curve.
 *
 * Overhang here comes from the direction each triangle faces (its normal):
 * a triangle facing straight down is a 90° overhang, a vertical wall is 0°.
 */
export function analyzeMesh(positions: Float32Array, indices: Uint32Array, wall: number | null): VaseStats {
  let minY = Infinity, maxY = -Infinity, maxX = 0, maxZ = 0, maxR = 0
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i], y = positions[i + 1], z = positions[i + 2]
    minY = Math.min(minY, y); maxY = Math.max(maxY, y)
    maxX = Math.max(maxX, Math.abs(x)); maxZ = Math.max(maxZ, Math.abs(z))
    maxR = Math.max(maxR, Math.hypot(x, z))
  }
  // footprint: the smallest extent of the points touching the table
  let fx = 0, fz = 0
  for (let i = 0; i < positions.length; i += 3) {
    if (positions[i + 1] - minY < 0.6) {
      fx = Math.max(fx, Math.abs(positions[i]))
      fz = Math.max(fz, Math.abs(positions[i + 2]))
    }
  }

  // overhang from normals: area-weighted, ignore the bottom face and tiny slivers
  const samples: { deg: number; area: number; y: number }[] = []
  let totalArea = 0
  for (let n = 0; n < indices.length; n += 3) {
    const a = indices[n] * 3, b = indices[n + 1] * 3, c = indices[n + 2] * 3
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2]
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2]
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
    const len = Math.hypot(nx, ny, nz)
    if (len < 1e-9) continue
    const area = len / 2
    totalArea += area
    const cy = (positions[a + 1] + positions[b + 1] + positions[c + 1]) / 3
    if (cy - minY < 1) continue
    const down = -ny / len
    if (down > 0.02) samples.push({ deg: (Math.asin(Math.min(1, down)) * 180) / Math.PI, area, y: cy - minY })
  }
  samples.sort((p, q) => q.deg - p.deg)
  // the steepest overhang that covers at least 0.2 % of the surface (ignores slivers)
  let acc = 0, maxDeg = 0, at = 0
  for (const s of samples) {
    acc += s.area
    if (acc > totalArea * 0.002) { maxDeg = s.deg; at = s.y; break }
  }

  return {
    height: maxY - minY,
    width: maxX * 2,
    depth: maxZ * 2,
    maxDiameter: maxR * 2,
    footprint: Math.min(fx, fz) * 2,
    maxOverhangDeg: maxDeg,
    maxOverhangAt: at,
    minWall: wall,
    volume: meshVolume(positions, indices),
    triangles: indices.length / 3,
    watertight: isWatertight(indices),
  }
}
