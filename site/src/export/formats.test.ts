import { describe, expect, it } from 'vitest'
import { buildVase } from '@/geometry/buildVase'
import { DRAFT } from '@/geometry/types'
import { DEFAULT_PARAMS } from '@/config/parameters'
import { toOBJ, toSTL } from './formats'

describe('exports', () => {
  const mesh = buildVase(DEFAULT_PARAMS, DRAFT)

  it('STL has the right size: 84 bytes + 50 per triangle', async () => {
    const blob = toSTL(mesh)
    expect(blob.size).toBe(84 + mesh.stats.triangles * 50)
  })

  it('STL is z-up: the vase stands from z = 0 to z = height', async () => {
    const view = new DataView(await toSTL(mesh).arrayBuffer())
    let minZ = Infinity, maxZ = -Infinity
    const n = view.getUint32(80, true)
    for (let t = 0; t < n; t++) {
      for (let v = 0; v < 3; v++) {
        const z = view.getFloat32(84 + t * 50 + 12 + v * 12 + 8, true)
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z)
      }
    }
    expect(minZ).toBeCloseTo(0, 3)
    expect(maxZ).toBeCloseTo(DEFAULT_PARAMS.height, 3)
  })

  it('OBJ lists every vertex and face', async () => {
    const text = await toOBJ(mesh).text()
    expect(text.split('\n').filter((l) => l.startsWith('v ')).length).toBe(mesh.positions.length / 3)
    expect(text.split('\n').filter((l) => l.startsWith('f ')).length).toBe(mesh.stats.triangles)
  })
})
