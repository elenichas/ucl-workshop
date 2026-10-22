import { useEffect, useRef } from 'react'
import { displacement } from '@/geometry/patterns'
import { surfaceFor } from '@/design/design'

const W = 72, H = 48

/** A tiny greyscale picture of a pattern, drawn from the same function the geometry uses. */
export function PatternThumb({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(W, H)
    const surface = surfaceFor(id, { depth: 1 })
    const refR = 40, height = 60
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const theta = (x / W) * Math.PI * 0.9
        const d = id === 'none' ? 0.15 : displacement(surface, 1 - y / H, theta, height, refR)
        const g = 70 + d * 170
        const i = (y * W + x) * 4
        img.data[i] = g; img.data[i + 1] = g * 0.95; img.data[i + 2] = g * 0.88; img.data[i + 3] = 255
      }
    ctx.putImageData(img, 0, 0)
  }, [id])
  return <canvas ref={ref} width={W} height={H} aria-hidden className="h-12 w-full rounded-sm" />
}
