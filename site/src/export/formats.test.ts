import { describe, expect, it } from 'vitest'
import { buildDesign } from '@/geometry/buildDesign'
import { newDesign } from '@/design/design'
import { toOBJ, toSTL } from './formats'

describe('exports', () => {
  const design = newDesign()
  const mesh = buildDesign(design, 'draft')
  const height = design.starts.round.height

  it('STL has the right size: 84 bytes + 50 per triangle', () => {
    expect(toSTL(mesh).size).toBe(84 + mesh.stats.triangles * 50)
  })

  it('STL is z-up: the vase stands from z = 0 to z = height', async () => {
    const view = new DataView(await toSTL(mesh).arrayBuffer())
    let minZ = Infinity, maxZ = -Infinity
    const n = view.getUint32(80, true)
    for (let t = 0; t < n; t++)
      for (let v = 0; v < 3; v++) {
        const z = view.getFloat32(84 + t * 50 + 12 + v * 12 + 8, true)
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z)
      }
    expect(minZ).toBeCloseTo(0, 3)
    expect(maxZ).toBeCloseTo(height, 3)
  })

  it('OBJ lists every vertex and face', async () => {
    const text = await toOBJ(mesh).text()
    expect(text.split('\n').filter((l) => l.startsWith('v ')).length).toBe(mesh.positions.length / 3)
    expect(text.split('\n').filter((l) => l.startsWith('f ')).length).toBe(mesh.stats.triangles)
  })
})
