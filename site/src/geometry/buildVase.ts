import { displacement, type Relief, type Surface } from './patterns'
import type { Field, Resolution, VaseMesh } from './types'
import { FULL } from './types'

/**
 * THE SHARED PIPELINE — field + surface + walls in, closed printable mesh out.
 *
 * 1. Sample the outer surface on a grid: `vertical` rings × `radial` points.
 *    At each point: radius from the field (the starting point) + pattern displacement.
 * 2. Sample the inner surface: the same, moved inwards by the wall thickness.
 * 3. Stitch neighbouring points into triangles (two per grid square).
 * 4. Close the shape: a rim at the top, a floor inside, a bottom outside.
 * 5. Measure the result for the printability checks.
 *
 * The result is "watertight": every edge is shared by exactly two triangles,
 * which is what slicers need to know what is inside and what is outside.
 * Coordinates: y is up (three.js convention), units are millimetres.
 */
export interface BuildOptions {
  surface: Surface
  wallThickness: number
  baseThickness: number
  relief?: Relief
}

export function buildFromField(field: Field, opts: BuildOptions, res: Resolution = FULL): VaseMesh {
  const R = Math.max(8, Math.floor(res.radial))
  const V = Math.max(4, Math.floor(res.vertical))
  const H = Math.max(10, field.height)
  const wall = Math.max(0.2, opts.wallThickness)
  const floorY = Math.min(opts.baseThickness, H * 0.5)

  // Average radius, used to size patterns so they repeat evenly around.
  let refR = 0
  for (let k = 0; k < 16; k++) refR += field.radius((k + 0.5) / 16, (k * 2.399) % (2 * Math.PI))
  refR /= 16

  const outerAt = (t: number, theta: number) =>
    Math.max(1, field.radius(t, theta)) + displacement(opts.surface, t, theta, H, refR, opts.relief)

  const pos: number[] = []
  const idx: number[] = []
  const push = (x: number, y: number, z: number) => {
    pos.push(x, y, z)
    return pos.length / 3 - 1
  }

  let maxR = 0, maxX = 0, maxZ = 0
  let footMin = Infinity
  let maxOverhang = 0, maxOverhangAt = 0
  let minWall = Infinity

  // --- 1. outer surface --------------------------------------------------------
  const outer: number[][] = []
  const outerR: number[][] = []
  for (let i = 0; i <= V; i++) {
    const t = i / V
    const ring: number[] = [], ringR: number[] = []
    for (let j = 0; j < R; j++) {
      const theta = (j / R) * Math.PI * 2
      const r = outerAt(t, theta)
      const x = r * Math.cos(theta), z = r * Math.sin(theta)
      ringR.push(r)
      ring.push(push(x, t * H, z))
      maxR = Math.max(maxR, r)
      maxX = Math.max(maxX, Math.abs(x))
      maxZ = Math.max(maxZ, Math.abs(z))
      if (i === 0) footMin = Math.min(footMin, r)
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
        if (deg > maxOverhang) { maxOverhang = deg; maxOverhangAt = (i / V) * H }
      }
    }
  }

  // --- 2. inner surface --------------------------------------------------------
  const inner: number[][] = []
  for (let i = 0; i <= V; i++) {
    const y = floorY + (i / V) * (H - floorY)
    const t = y / H
    const ring: number[] = []
    for (let j = 0; j < R; j++) {
      const theta = (j / R) * Math.PI * 2
      const ro = outerAt(t, theta)
      const ri = Math.max(0.5, ro - wall)
      minWall = Math.min(minWall, ro - ri)
      ring.push(push(ri * Math.cos(theta), y, ri * Math.sin(theta)))
    }
    inner.push(ring)
  }

  // --- 3. stitch grids into triangles -------------------------------------------
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

  // --- 4. close the shape -------------------------------------------------------
  for (let j = 0; j < R; j++) {
    const k = (j + 1) % R
    quad(outer[V][j], outer[V][k], inner[V][j], inner[V][k], true) // rim
  }
  const bottomCentre = push(0, 0, 0)
  for (let j = 0; j < R; j++) idx.push(bottomCentre, outer[0][j], outer[0][(j + 1) % R]) // outside bottom
  const floorCentre = push(0, floorY, 0)
  for (let j = 0; j < R; j++) idx.push(floorCentre, inner[0][(j + 1) % R], inner[0][j]) // inside floor

  const positions = new Float32Array(pos)
  const indices = new Uint32Array(idx)
  return {
    positions,
    indices,
    stats: {
      height: H,
      width: maxX * 2,
      depth: maxZ * 2,
      maxDiameter: maxR * 2,
      footprint: footMin * 2,
      maxOverhangDeg: maxOverhang,
      maxOverhangAt,
      minWall,
      volume: meshVolume(positions, indices),
      triangles: indices.length / 3,
      watertight: true, // true by construction — verified in the tests
    },
  }
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
 * once in each direction.
 */
export function isWatertight(idx: Uint32Array): boolean {
  const edges = new Map<number, number>()
  const key = (a: number, b: number) => a * 4294967296 + b
  for (let n = 0; n < idx.length; n += 3) {
    for (let e = 0; e < 3; e++) {
      const a = idx[n + e], b = idx[n + ((e + 1) % 3)]
      const k = key(a, b)
      edges.set(k, (edges.get(k) ?? 0) + 1)
    }
  }
  for (const [k, count] of edges) {
    if (count !== 1) return false
    const a = Math.floor(k / 4294967296), b = k % 4294967296
    if (edges.get(key(b, a)) !== 1) return false
  }
  return true
}
