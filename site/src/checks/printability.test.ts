import { describe, expect, it } from 'vitest'
import { buildDesign } from '@/geometry/buildDesign'
import { getMaterial, MATERIALS } from '@/config/materials'
import { getPrinter, PRINTERS } from '@/config/printers'
import { newDesign, withStartValues, type Design } from '@/design/design'
import { overall, runChecks } from './printability'

const check = (design: Design = newDesign(), printerId = 'fdm-desktop', materialId = 'pla') =>
  runChecks({ design, mesh: buildDesign(design, 'draft'), printer: getPrinter(printerId), material: getMaterial(materialId) })

const verdictOf = (results: ReturnType<typeof check>, id: string) => results.find((r) => r.id === id)?.verdict

describe('printability', () => {
  it('the default vase prints in PLA on a desktop printer', () => {
    expect(overall(check())).toBe('pass')
  })

  it('a vase taller than the printer fails the build-volume check', () => {
    expect(verdictOf(check(withStartValues(newDesign(), 'round', { height: 300 })), 'build-volume')).toBe('fail')
  })

  it('a 2 mm wall is fine for PLA but fails for clay', () => {
    expect(verdictOf(check(newDesign(), 'fdm-desktop', 'pla'), 'wall')).toBe('pass')
    expect(verdictOf(check(newDesign(), 'clay', 'stoneware'), 'wall')).toBe('fail')
  })

  it('a sphere with a wide foot prints in PLA but overhangs too much for clay', () => {
    // foot 120 of 150: the wall leans about 37° just above the foot
    const d = withStartValues({ ...newDesign(), start: 'sphere', wall: { wallThickness: 4, baseThickness: 5 } }, 'sphere', { diameter: 150, footDiameter: 120, openingDiameter: 60, squash: 1 })
    expect(verdictOf(check(d, 'fdm-desktop', 'pla'), 'overhang')).not.toBe('fail')
    expect(verdictOf(check(d, 'clay', 'stoneware'), 'overhang')).toBe('fail')
  })

  it('a tall vase on a tiny foot is unstable', () => {
    expect(verdictOf(check(withStartValues(newDesign(), 'round', { baseDiameter: 35, height: 210 })), 'stability')).toBe('fail')
  })

  it('a colour gradient needs a multi-colour printer', () => {
    const d = { ...newDesign(), finish: { ...newDesign().finish, mode: 'gradient' as const } }
    expect(verdictOf(check(d, 'fdm-desktop'), 'colour')).toBe('warn')
    expect(verdictOf(check(d, 'fdm-multi'), 'colour')).toBe('pass')
  })

  it('every printer lists only materials that exist', () => {
    const ids = MATERIALS.map((m) => m.id)
    for (const p of PRINTERS) for (const m of p.materials) expect(ids).toContain(m)
  })
})

describe('how to fix', () => {
  it('a passing check has no suggestions', () => {
    expect(check().every((r) => r.fixes?.length === 0)).toBe(true)
  })

  it('every warning or failure comes with at least one suggestion', () => {
    const cases = [
      check(withStartValues(newDesign(), 'round', { height: 300, baseDiameter: 35 })),
      check(newDesign(), 'clay', 'stoneware'),
      check({ ...newDesign(), finish: { ...newDesign().finish, mode: 'gradient' as const } }, 'fdm-desktop'),
    ]
    for (const r of cases.flat().filter((r) => r.verdict !== 'pass')) expect(r.fixes?.length, r.id).toBeGreaterThan(0)
  })

  it('a too-thin clay wall suggests the thickness it needs', () => {
    const wall = check(newDesign(), 'clay', 'stoneware').find((r) => r.id === 'wall')!
    expect(wall.fixes![0]).toMatch(/raise Wall thickness to at least \d+\.\d mm/)
  })

  it('a vase too tall for the printer suggests a height that fits and a bigger printer', () => {
    const fixes = check(withStartValues(newDesign(), 'round', { height: 300 })).find((r) => r.id === 'build-volume')!.fixes!.join(' ')
    expect(fixes).toMatch(/lower Height to \d+ mm or less/)
    expect(fixes).toMatch(/Large-format plastic printer/)
  })
})
