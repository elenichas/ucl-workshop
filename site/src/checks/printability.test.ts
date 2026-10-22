import { describe, expect, it } from 'vitest'
import { buildVase } from '@/geometry/buildVase'
import { DRAFT } from '@/geometry/types'
import { DEFAULT_PARAMS } from '@/config/parameters'
import { getMaterial } from '@/config/materials'
import { getPrinter, PRINTERS } from '@/config/printers'
import { MATERIALS } from '@/config/materials'
import { overall, runChecks } from './printability'

const check = (params = DEFAULT_PARAMS, printerId = 'fdm-desktop', materialId = 'pla') =>
  runChecks({ params, mesh: buildVase(params, DRAFT), printer: getPrinter(printerId), material: getMaterial(materialId) })

const verdictOf = (results: ReturnType<typeof check>, id: string) => results.find((r) => r.id === id)?.verdict

describe('printability', () => {
  it('the default vase prints in PLA on a desktop printer', () => {
    expect(overall(check())).toBe('pass')
  })

  it('a vase taller than the printer fails the build-volume check', () => {
    expect(verdictOf(check({ ...DEFAULT_PARAMS, height: 300 }), 'build-volume')).toBe('fail')
  })

  it('a 2 mm wall is fine for PLA but fails for clay', () => {
    expect(verdictOf(check(DEFAULT_PARAMS, 'fdm-desktop', 'pla'), 'wall')).toBe('pass')
    expect(verdictOf(check(DEFAULT_PARAMS, 'clay', 'stoneware'), 'wall')).toBe('fail')
  })

  it('clay is stricter about overhangs than PLA', () => {
    const flared = { ...DEFAULT_PARAMS, ribCount: 0, baseDiameter: 70, bellyDiameter: 140, bellyPosition: 0.4 }
    expect(verdictOf(check(flared, 'fdm-desktop', 'pla'), 'overhang')).toBe('pass')
    expect(verdictOf(check({ ...flared, wallThickness: 4 }, 'clay', 'stoneware'), 'overhang')).not.toBe('pass')
  })

  it('a tall vase on a tiny foot is unstable', () => {
    expect(verdictOf(check({ ...DEFAULT_PARAMS, baseDiameter: 40, height: 210 }), 'stability')).toBe('fail')
  })

  it('every printer lists only materials that exist', () => {
    const ids = MATERIALS.map((m) => m.id)
    for (const p of PRINTERS) for (const m of p.materials) expect(ids).toContain(m)
  })
})
