import { innerRadius, outerRadius } from './profile'
import type { Resolution, VaseMesh, VaseParams, VaseStats } from './types'
import { FULL } from './types'

/**
 * THE ALGORITHM — parameters in, closed printable mesh out.
 *
 * 1. Sample the outer surface on a grid: `vertical` rings × `radial` points.
 * 2. Sample the inner surface the same way, starting above the floor.
 * 3. Stitch neighbouring points into triangles (two per grid square).
 * 4. Close the shape: a rim at the top, a floor inside, a bottom outside.
 *
 * The result is "watertight": every edge is shared by exactly two triangles,
 * which is what slicers need to know what is inside and what is outside.
 * Coordinates: y is up (three.js convention), units are millimetres.
 */
export function buildVase(p: VaseParams, res: Resolution = FULL): VaseMesh {
  const R = Math.max(8, Math.floor(res.radial))
  const V = Math.max(4, Math.floor(res.vertical))
  const H = p.height
  const floorY = Math.min(p.baseThickness, H * 0.5)

  const pos: number[] = []
  const idx: number[] = []
  const push = (x: number, y: number, z: number) => {
    pos.push(x, y, z)
    return pos.length / 3 - 1
  }

  let maxR = 0
  let minR = Infinity
  let minWall = Infinity
  let maxOverhang = 0
  let maxOverhangAt = 0

  // --- 1. outer surface: rings from y = 0 to y = H ---------------------------
  const outer: number[][] = []
  const outerR: number[][] = []
  for (let i = 0; i <= V; i++) {
    const t = i / V
    const ring: number[] = []
    const ringR: number[] = []
    for (let j = 0; j < R; j++) {
      const theta = (j / R) * Math.PI * 2
      const r = outerRadius(p, t, theta)
      ringR.push(r)
      ring.push(push(r * Math.cos(theta), t * H, r * Math.sin(theta)))
      maxR = Math.max(maxR, r)
      if (i > 0) minR = Math.min(minR, r)
    }
    outer.push(ring)
    outerR.push(ringR)
  }

  // Overhang: how far the wall leans outwards between two rings.
  // 0° = vertical, 90° = flat ceiling. Printers struggle above ~45° (PLA) or ~25° (clay).
  const dy = H / V
  for (let i = 1; i <= V; i++) {
    for (let j = 0; j < R; j++) {
      const dr = outerR[i][j] - outerR[i - 1][j]
      if (dr > 0) {
        const deg = (Math.atan2(dr, dy) * 180) / Math.PI
        if (deg > maxOverhang) {
          maxOverhang = deg
          maxOverhangAt = (i / V) * H
        }
      }
    }
  }

  // --- 2. inner surface: rings from the floor to the top ---------------------
  const inner: number[][] = []
  for (let i = 0; i <= V; i++) {
    const y = floorY + (i / V) * (H - floorY)
    const t = y / H
    const ring: number[] = []
    for (let j = 0; j < R; j++) {
      const theta = (j / R) * Math.PI * 2
      const ri = innerRadius(p, t, theta)
      minWall = Math.min(minWall, outerRadius(p, t, theta) - ri)
      ring.push(push(ri * Math.cos(theta), y, ri * Math.sin(theta)))
    }
    inner.push(ring)
  }

  // --- 3. stitch grids into triangles ----------------------------------------
  // `flip` decides which way the triangle faces (outwards for the outer skin,
  // towards the axis for the inner skin).
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (flip) idx.push(a, c, b, b, c, d)
    else idx.push(a, b, c, b, d, c)
  }
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < R; j++) {
      const k = (j + 1) % R
      quad(outer[i][j], outer[i][k], outer[i + 1][j], outer[i + 1][k], true)
      quad(inner[i][j], inner[i][k], inner[i + 1][j], inner[i + 1][k], false)
    }
  }

  // --- 4. close the shape ----------------------------------------------------
  // rim: outer top ring → inner top ring
  for (let j = 0; j < R; j++) {
    const k = (j + 1) % R
    quad(outer[V][j], outer[V][k], inner[V][j], inner[V][k], true)
  }
  // outside bottom: a fan to a centre point at y = 0 (faces down)
  const bottomCentre = push(0, 0, 0)
  for (let j = 0; j < R; j++) {
    const k = (j + 1) % R
    idx.push(bottomCentre, outer[0][j], outer[0][k])
  }
  // inside floor: a fan to a centre point at y = floorY (faces up)
  const floorCentre = push(0, floorY, 0)
  for (let j = 0; j < R; j++) {
    const k = (j + 1) % R
    idx.push(floorCentre, inner[0][k], inner[0][j])
  }

  const positions = new Float32Array(pos)
  const indices = new Uint32Array(idx)
  const stats: VaseStats = {
    maxDiameter: maxR * 2,
    minDiameter: minR * 2,
    maxOverhangDeg: maxOverhang,
    maxOverhangAt,
    minWall,
    volume: meshVolume(positions, indices),
    triangles: indices.length / 3,
  }
  return { positions, indices, stats }
}

/**
 * Volume of a closed mesh: add up the signed volume of the tetrahedron
 * each triangle makes with the origin. Outward-facing triangles add,
 * inward-facing ones subtract — what remains is the solid material.
 */
export function meshVolume(pos: Float32Array, idx: Uint32Array): number {
  let v = 0
  for (let n = 0; n < idx.length; n += 3) {
    const a = idx[n] * 3, b = idx[n + 1] * 3, c = idx[n + 2] * 3
    const ax = pos[a], ay = pos[a + 1], az = pos[a + 2]
    const bx = pos[b], by = pos[b + 1], bz = pos[b + 2]
    const cx = pos[c], cy = pos[c + 1], cz = pos[c + 2]
    v += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6
  }
  return Math.abs(v)
}

/**
 * Is the mesh closed? Every edge must be used by exactly two triangles,
 * once in each direction. Used by the tests and the printability report.
 */
export function isWatertight(idx: Uint32Array): boolean {
  const edges = new Map<string, number>()
  for (let n = 0; n < idx.length; n += 3) {
    const tri = [idx[n], idx[n + 1], idx[n + 2]]
    for (let e = 0; e < 3; e++) {
      const a = tri[e], b = tri[(e + 1) % 3]
      const key = `${a}>${b}`
      edges.set(key, (edges.get(key) ?? 0) + 1)
    }
  }
  for (const [key, count] of edges) {
    if (count !== 1) return false
    const [a, b] = key.split('>')
    if (edges.get(`${b}>${a}`) !== 1) return false
  }
  return true
}
