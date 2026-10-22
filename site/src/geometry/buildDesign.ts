import type { Design } from '@/design/design'
import { getStart } from '@/starts'
import { buildFromField } from './buildVase'
import { buildCarve } from './carve'
import type { Resolution, VaseMesh } from './types'
import { DRAFT, FULL } from './types'

/** Carving is expensive, so it uses fewer triangles. */
const CARVE_RES = { draft: { radial: 72, vertical: 48 }, full: { radial: 180, vertical: 120 } }

/**
 * Design in → mesh out. This is the whole "process" column of the system map:
 * the starting point turns its values into a field (or a carve), then the
 * shared pipeline adds the pattern and the walls, closes the shape and measures it.
 */
export function buildDesign(design: Design, quality: 'draft' | 'full' = 'full', res?: Resolution): VaseMesh {
  const start = getStart(design.start)
  const values = design.starts[design.start]
  const opts = {
    surface: design.surface,
    wallThickness: design.wall.wallThickness,
    baseThickness: design.wall.baseThickness,
    relief: design.relief ?? undefined,
  }
  if (start.id === 'carve') {
    return buildCarve(values, opts, res ?? CARVE_RES[quality])
  }
  const field = start.field!(values, design)
  return buildFromField(field, opts, res ?? (quality === 'draft' ? DRAFT : FULL))
}
