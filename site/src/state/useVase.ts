import { useEffect, useMemo, useState } from 'react'
import { buildDesign } from '@/geometry/buildDesign'
import type { Design } from '@/design/design'

/** Only the parts of a design that change the shape. Colour or printer changes don't rebuild the mesh. */
function geometryKey(d: Design): string {
  return JSON.stringify({
    start: d.start,
    values: d.starts[d.start],
    points: d.start === 'draw' ? d.profilePoints : null,
    sketch: d.start === 'sketch' ? d.sketch : null,
    image: d.start === 'image' ? d.imageStart?.samples : null,
    surface: d.surface,
    relief: d.surface.pattern === 'image' ? d.relief?.preview.length : null,
    wall: d.wall,
  })
}

/**
 * Turns a design into a mesh — fast while you drag, detailed when you stop.
 *
 * While a control moves we rebuild at DRAFT resolution (few triangles, instant).
 * 300 ms after the last change we rebuild once more at FULL resolution.
 * This is the "debounce" trick from chapter 08: don't do expensive work
 * on every tiny movement, do it once the person pauses.
 */
export function useVase(design: Design) {
  const key = geometryKey(design)
  const [settledKey, setSettledKey] = useState(key)

  useEffect(() => {
    const timer = window.setTimeout(() => setSettledKey(key), design.start === 'carve' ? 450 : 300)
    return () => window.clearTimeout(timer)
  }, [key, design.start])

  const isSettled = settledKey === key
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mesh = useMemo(() => buildDesign(design, isSettled ? 'full' : 'draft'), [key, isSettled])
  return { mesh, isDraft: !isSettled }
}
