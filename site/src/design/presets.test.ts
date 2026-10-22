import { describe, expect, it } from 'vitest'
import { PRESETS } from './design'
import { buildDesign } from '@/geometry/buildDesign'
import { overall, runChecks } from '@/checks/printability'
import { getMaterial } from '@/config/materials'
import { getPrinter } from '@/config/printers'

describe('presets are good examples', () => {
  for (const p of PRESETS) {
    it(`${p.design.name} does not fail the print check on its own printer`, () => {
      const d = p.design
      const results = runChecks({ design: d, mesh: buildDesign(d, 'full'), printer: getPrinter(d.printerId), material: getMaterial(d.materialId) })
      expect(overall(results), results.filter((r) => r.verdict !== 'pass').map((r) => `${r.id}: ${r.detail}`).join('\n')).not.toBe('fail')
    })
  }
})
