import type { VaseMesh } from '@/geometry/types'

/**
 * FILE EXPORTS
 * ------------
 * Our viewer uses "y is up" (three.js). Rhino, slicers and most CAD tools use "z is up".
 * So before writing a file we rotate: (x, y, z)  →  (x, -z, y).
 * Units stay millimetres — every format below is written in mm.
 */
function zUp(pos: Float32Array): Float32Array {
  const out = new Float32Array(pos.length)
  for (let i = 0; i < pos.length; i += 3) {
    out[i] = pos[i]
    out[i + 1] = -pos[i + 2]
    out[i + 2] = pos[i + 1]
  }
  return out
}

/**
 * STL (binary) — the format every slicer understands. It is just a list of triangles:
 * 80-byte header, triangle count, then for each triangle a normal + 3 corners.
 */
export function toSTL(mesh: VaseMesh): Blob {
  const p = zUp(mesh.positions)
  const idx = mesh.indices
  const triCount = idx.length / 3
  const buffer = new ArrayBuffer(84 + triCount * 50)
  const view = new DataView(buffer)
  const header = 'Vessel vase - units: mm'
  for (let i = 0; i < header.length; i++) view.setUint8(i, header.charCodeAt(i))
  view.setUint32(80, triCount, true)
  let o = 84
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3
    // normal = (b - a) × (c - a), normalised
    const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2]
    const vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2]
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
    const len = Math.hypot(nx, ny, nz) || 1
    nx /= len; ny /= len; nz /= len
    for (const v of [nx, ny, nz]) { view.setFloat32(o, v, true); o += 4 }
    for (const i of [a, b, c]) {
      view.setFloat32(o, p[i], true)
      view.setFloat32(o + 4, p[i + 1], true)
      view.setFloat32(o + 8, p[i + 2], true)
      o += 12
    }
    view.setUint16(o, 0, true)
    o += 2
  }
  return new Blob([buffer], { type: 'model/stl' })
}

/** OBJ — a readable text format: "v x y z" lines for points, "f a b c" lines for triangles. */
export function toOBJ(mesh: VaseMesh): Blob {
  const p = zUp(mesh.positions)
  const lines: string[] = ['# Vessel vase', '# units: mm, z up', 'o vase']
  for (let i = 0; i < p.length; i += 3) lines.push(`v ${p[i].toFixed(4)} ${p[i + 1].toFixed(4)} ${p[i + 2].toFixed(4)}`)
  const idx = mesh.indices
  for (let t = 0; t < idx.length; t += 3) lines.push(`f ${idx[t] + 1} ${idx[t + 1] + 1} ${idx[t + 2] + 1}`)
  return new Blob([lines.join('\n')], { type: 'text/plain' })
}

// rhino3dm methods we use that are missing from its type definitions
interface RhinoMeshLists {
  vertices(): { add(x: number, y: number, z: number): number }
  faces(): { addTriFace(a: number, b: number, c: number): number }
}

/**
 * 3DM — Rhino's own format, written with rhino3dm (Rhino's geometry library compiled
 * to WebAssembly so it runs in the browser). Loaded only when someone clicks the button,
 * because it is several megabytes.
 */
export async function to3DM(mesh: VaseMesh, name: string): Promise<Blob> {
  const [{ default: rhino3dm }, { default: wasmUrl }] = await Promise.all([
    import('rhino3dm'),
    import('rhino3dm/rhino3dm.wasm?url'),
  ])
  const rhino = await rhino3dm({ locateFile: () => wasmUrl })
  const m = new rhino.Mesh()
  const lists = m as unknown as RhinoMeshLists
  const p = zUp(mesh.positions)
  const verts = lists.vertices()
  for (let i = 0; i < p.length; i += 3) verts.add(p[i], p[i + 1], p[i + 2])
  const faces = lists.faces()
  const idx = mesh.indices
  for (let t = 0; t < idx.length; t += 3) faces.addTriFace(idx[t], idx[t + 1], idx[t + 2])
  m.normals().computeNormals()
  m.compact()

  const doc = new rhino.File3dm()
  doc.settings().modelUnitSystem = rhino.UnitSystem.Millimeters
  const attrs = new rhino.ObjectAttributes()
  attrs.name = name
  doc.objects().addMesh(m, attrs)
  const bytes = doc.toByteArray()
  ;(doc as unknown as { delete(): void }).delete() // free WebAssembly memory
  return new Blob([bytes as BlobPart], { type: 'application/octet-stream' })
}

/** Ask the browser to save a file. */
export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
