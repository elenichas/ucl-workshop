import { useEffect, useMemo, useRef, useState } from 'react'
import { buildVase } from '@/geometry/buildVase'
import { DRAFT, FULL, type VaseParams } from '@/geometry/types'

/**
 * Turns parameters into a mesh — fast while you drag, detailed when you stop.
 *
 * While a slider moves we rebuild with DRAFT resolution (few triangles, instant).
 * 250 ms after the last change we rebuild once more at FULL resolution.
 * This is the "debounce" trick from chapter 08: don't do expensive work
 * on every tiny movement, do it once the person pauses.
 */
export function useVase(params: VaseParams) {
  const [settled, setSettled] = useState(params)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSettled(params), 250)
    return () => window.clearTimeout(timer.current)
  }, [params])

  const isSettled = settled === params
  const mesh = useMemo(() => buildVase(params, isSettled ? FULL : DRAFT), [params, isSettled])
  return { mesh, isDraft: !isSettled }
}
