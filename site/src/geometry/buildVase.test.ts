import { describe, expect, it } from 'vitest'
import { buildFromField, isWatertight } from './buildVase'
import { buildDesign } from './buildDesign'
import { newDesign, PRESETS, surfaceFor, withStartValues } from '@/design/design'
import { PATTERNS } from './patterns'
import { STARTS } from '@/starts'
import { DRAFT } from './types'

// Tests are questions we ask the code automatically, every time it changes.
// If someone (or an agent) breaks the algorithm, these turn red.

const small = { radial: 48, vertical: 24 }

describe('the shared pipeline', () => {
  it('a plain cylinder has the volume a hand calculation gives', () => {
    const field = { height: 100, radius: () => 50 }
    const mesh = buildFromField(field, { surface: surfaceFor('none'), wallThickness: 2, baseThickness: 2 }, { radial: 256, vertical: 16 })
    const expected = Math.PI * 50 ** 2 * 100 - Math.PI * 48 ** 2 * 98
    expect(Math.abs(mesh.stats.volume - expected) / expected).toBeLessThan(0.01)
  })

  it('reports no overhang for a straight cylinder and some for a flaring bowl', () => {
    const opts = { surface: surfaceFor('none'), wallThickness: 2, baseThickness: 2 }
    expect(buildFromField({ height: 100, radius: () => 50 }, opts, DRAFT).stats.maxOverhangDeg).toBeLessThan(0.01)
    expect(buildFromField({ height: 60, radius: (t) => 30 + 70 * t }, opts, DRAFT).stats.maxOverhangDeg).toBeGreaterThan(45)
  })

  it('uses more triangles at higher resolution', () => {
    const d = newDesign()
    expect(buildDesign(d, 'full', { radial: 64, vertical: 32 }).stats.triangles).toBeGreaterThan(buildDesign(d, 'full', { radial: 32, vertical: 16 }).stats.triangles * 3)
  })
})

describe('every starting point', () => {
  for (const start of STARTS.filter((s) => s.id !== 'carve')) {
    it(`${start.name}: closed mesh standing on the table`, () => {
      const mesh = buildDesign({ ...newDesign(), start: start.id }, 'full', small)
      expect(isWatertight(mesh.indices)).toBe(true)
      let minY = Infinity
      for (let i = 1; i < mesh.positions.length; i += 3) minY = Math.min(minY, mesh.positions[i])
      expect(minY).toBeCloseTo(0)
      expect(mesh.stats.volume).toBeGreaterThan(1000)
    })
  }

  it('box: width and depth come out as asked (no pattern)', () => {
    let d = withStartValues({ ...newDesign(), start: 'box', surface: surfaceFor('none') }, 'box', { width: 120, depth: 60, taper: 1, bulge: 0, twist: 0, rounding: 0 })
    d = { ...d }
    const s = buildDesign(d, 'full', { radial: 256, vertical: 16 }).stats
    expect(s.width).toBeCloseTo(120, 0)
    expect(s.depth).toBeCloseTo(60, 0)
  })

  it('sphere: the height is derived from diameter, squash and the two cuts', () => {
    const d = withStartValues({ ...newDesign(), start: 'sphere', surface: surfaceFor('none') }, 'sphere', { diameter: 100, squash: 1, footDiameter: 60, openingDiameter: 60 })
    // a 100 mm ball cut where it is 60 mm wide: 2 × sqrt(50² − 30²) = 80 mm
    expect(buildDesign(d, 'full', small).stats.height).toBeCloseTo(80, 1)
  })
})

describe('every pattern', () => {
  for (const p of PATTERNS) {
    it(`${p.name}: stays closed and never pushes further than its depth`, () => {
      const d = { ...newDesign(), surface: { ...surfaceFor(p.id), values: { ...surfaceFor(p.id).values, depth: 3 } } }
      const plain = buildDesign({ ...d, surface: surfaceFor('none') }, 'full', small)
      const mesh = buildDesign(d, 'full', small)
      expect(isWatertight(mesh.indices)).toBe(true)
      expect(mesh.stats.maxDiameter).toBeLessThanOrEqual(plain.stats.maxDiameter + 2 * 3 + 0.01)
    })
  }
})

describe('presets', () => {
  it('every preset builds', () => {
    for (const p of PRESETS) expect(buildDesign(p.design, 'draft').stats.volume, p.design.name).toBeGreaterThan(1000)
  })
})
