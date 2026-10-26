import { useEffect, useRef } from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'

const W = 300, H = 360

/**
 * Freehand sketch: draw the right-hand edge of the vase, from bottom to top.
 * We then cut the drawing into 64 rows and measure how far the line is
 * from the axis in each row — that becomes the profile.
 */
export function strokeToSamples(stroke: { x: number; y: number }[], rows = 64): number[] | null {
  if (stroke.length < 8) return null
  const ys = stroke.map((p) => p.y)
  const top = Math.min(...ys), bottom = Math.max(...ys)
  if (bottom - top < 40) return null
  const sums = new Array(rows).fill(0), counts = new Array(rows).fill(0)
  for (const p of stroke) {
    const row = Math.round(((bottom - p.y) / (bottom - top)) * (rows - 1))
    sums[row] += Math.abs(p.x - W / 2)
    counts[row]++
  }
  // fill rows the pen skipped by interpolating between neighbours
  const raw: (number | null)[] = sums.map((s, i) => (counts[i] ? s / counts[i] : null))
  for (let i = 0; i < rows; i++) {
    if (raw[i] !== null) continue
    let a = i - 1, b = i + 1
    while (a >= 0 && raw[a] === null) a--
    while (b < rows && raw[b] === null) b++
    const va = a >= 0 ? raw[a]! : raw[b]!, vb = b < rows ? raw[b]! : va
    raw[i] = a >= 0 && b < rows ? va + ((vb - va) * (i - a)) / (b - a) : va
  }
  const max = Math.max(...(raw as number[]))
  return (raw as number[]).map((v) => Math.max(0.05, v / max))
}

export function SketchPad({ samples, onChange }: { samples: number[]; onChange: (s: number[]) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const stroke = useRef<{ x: number; y: number }[]>([])
  const drawing = useRef(false)

  // Draw the current profile (both halves) as a guide.
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    const css = getComputedStyle(canvas.current!)
    ctx.clearRect(0, 0, W, H)
    ctx.strokeStyle = css.getPropertyValue('--color-line') || '#ccc'
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(W / 2, 10); ctx.lineTo(W / 2, H - 10); ctx.stroke()
    ctx.setLineDash([])
    ctx.lineWidth = 2
    ctx.strokeStyle = css.getPropertyValue('--color-accent') || '#7A5300'
    for (const side of [1, -1]) {
      ctx.beginPath()
      samples.forEach((s, i) => {
        const x = W / 2 + side * s * (W / 2 - 24), y = H - 24 - (i / (samples.length - 1)) * (H - 48)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      ctx.globalAlpha = side === 1 ? 1 : 0.35
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }, [samples])

  const point = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }

  return (
    <div>
      <p className="mb-2 text-xs leading-snug text-ink-muted">
        Draw the right-hand edge of your vase in one stroke, from the bottom to the top. Draw again to replace it.
      </p>
      <canvas
        ref={canvas}
        width={W}
        height={H}
        aria-label="Sketch area: draw the outline of one side of the vase"
        className="w-full touch-none border border-line bg-paper-raised"
        onPointerDown={(e) => {
          drawing.current = true
          stroke.current = [point(e)]
          ;(e.target as Element).setPointerCapture?.(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return
          const p = point(e)
          const ctx = canvas.current!.getContext('2d')!
          const last = stroke.current[stroke.current.length - 1]
          ctx.strokeStyle = getComputedStyle(canvas.current!).getPropertyValue('--color-ink') || '#000000'
          ctx.lineWidth = 2.5
          ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke()
          stroke.current.push(p)
        }}
        onPointerUp={() => {
          drawing.current = false
          const s = strokeToSamples(stroke.current)
          if (s) onChange(s)
          else onChange([...samples]) // redraw the guide
        }}
      />
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onChange(Array.from({ length: 64 }, () => 0.7))}>
          <Eraser aria-hidden /> Start over
        </Button>
      </div>
    </div>
  )
}
