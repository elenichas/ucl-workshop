import { describe, expect, it } from 'vitest'
import { buildVase, isWatertight } from './buildVase'
import { profileRadius } from './profile'
import { DEFAULT_PARAMS, PRESETS } from '@/config/parameters'
import { DRAFT } from './types'

// Tests are questions we ask the code automatically, every time it changes.
// If someone (or an agent) breaks the algorithm, these turn red.

describe('profile', () => {
  it('starts at the base radius and ends at the top radius', () => {
    expect(profileRadius(DEFAULT_PARAMS, 0)).toBeCloseTo(DEFAULT_PARAMS.baseDiameter / 2)
    expect(profileRadius(DEFAULT_PARAMS, 1)).toBeCloseTo(DEFAULT_PARAMS.topDiameter / 2)
  })
  it('reaches the belly radius at the belly position', () => {
    expect(profileRadius(DEFAULT_PARAMS, DEFAULT_PARAMS.bellyPosition)).toBeCloseTo(DEFAULT_PARAMS.bellyDiameter / 2)
  })
})

describe('buildVase', () => {
  it('produces a closed (watertight) mesh for every preset', () => {
    for (const preset of PRESETS) {
      const mesh = buildVase(preset.params, DRAFT)
      expect(isWatertight(mesh.indices), preset.name).toBe(true)
    }
  })

  it('is exactly as tall as asked', () => {
    const mesh = buildVase(DEFAULT_PARAMS, DRAFT)
    let maxY = -Infinity, minY = Infinity
    for (let i = 1; i < mesh.positions.length; i += 3) {
      maxY = Math.max(maxY, mesh.positions[i])
      minY = Math.min(minY, mesh.positions[i])
    }
    expect(minY).toBeCloseTo(0)
    expect(maxY).toBeCloseTo(DEFAULT_PARAMS.height)
  })

  it('has a positive volume close to a hand calculation for a plain cylinder', () => {
    // A plain cylinder: outer r = 50, wall 2, floor 2, height 100.
    const p = { ...DEFAULT_PARAMS, height: 100, baseDiameter: 100, bellyDiameter: 100, topDiameter: 100, ribCount: 0, ribDepth: 0, waveCount: 0, waveDepth: 0, wallThickness: 2, baseThickness: 2 }
    const mesh = buildVase(p, { radial: 256, vertical: 16 })
    const expected = Math.PI * 50 ** 2 * 100 - Math.PI * 48 ** 2 * 98
    expect(Math.abs(mesh.stats.volume - expected) / expected).toBeLessThan(0.01)
  })

  it('reports no overhang for a straight cylinder and some for a flaring bowl', () => {
    const cyl = { ...DEFAULT_PARAMS, baseDiameter: 100, bellyDiameter: 100, topDiameter: 100, ribCount: 0, waveCount: 0 }
    expect(buildVase(cyl, DRAFT).stats.maxOverhangDeg).toBeLessThan(0.01)
    const bowl = { ...cyl, height: 80, baseDiameter: 60, bellyDiameter: 200, topDiameter: 200, bellyPosition: 0.9 }
    expect(buildVase(bowl, DRAFT).stats.maxOverhangDeg).toBeGreaterThan(45)
  })

  it('uses more triangles at higher resolution', () => {
    const low = buildVase(DEFAULT_PARAMS, { radial: 32, vertical: 16 })
    const high = buildVase(DEFAULT_PARAMS, { radial: 64, vertical: 32 })
    expect(high.stats.triangles).toBeGreaterThan(low.stats.triangles * 3)
  })
})
