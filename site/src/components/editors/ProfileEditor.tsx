import { useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { splineRadius, type ProfilePoint } from '@/geometry/curves'
import { Button } from '@/components/ui/button'

const MAX_R = 110 // mm shown across the editor
const W = 300, H = 360, PAD = 24

/**
 * Draw half of the silhouette by dragging points — like an interpolated curve in Rhino.
 * Click on empty space to add a point. Points are keyboard-accessible: Tab to one,
 * arrows to move it, Delete to remove it.
 */
export function ProfileEditor({ points, height, onChange }: { points: ProfilePoint[]; height: number; onChange: (p: ProfilePoint[]) => void }) {
  const svg = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const toX = (r: number) => W / 2 + (r / MAX_R) * (W / 2 - PAD)
  const toY = (t: number) => H - PAD - t * (H - 2 * PAD)
  const fromEvent = (e: React.PointerEvent) => {
    const rect = svg.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    const r = Math.min(MAX_R, Math.max(4, ((x - W / 2) / (W / 2 - PAD)) * MAX_R))
    const t = Math.min(1, Math.max(0, (H - PAD - y) / (H - 2 * PAD)))
    return { r, t }
  }
  const sorted = (p: ProfilePoint[]) => [...p].sort((a, b) => a.t - b.t)

  const update = (i: number, patch: Partial<ProfilePoint>) => {
    // Order is kept while dragging (the spline sorts by height itself),
    // so the point under your finger never swaps identity.
    onChange(points.map((p, k) => (k === i ? { ...p, ...patch } : p)))
  }
  const remove = (i: number) => {
    if (points.length <= 3) return
    onChange(sorted(points.filter((_, k) => k !== i)))
    setSelected(null)
  }

  const curve: string[] = []
  const mirror: string[] = []
  for (let k = 0; k <= 80; k++) {
    const t = k / 80
    const r = Math.max(2, splineRadius(points, t))
    curve.push(`${toX(r)},${toY(t)}`)
    mirror.push(`${W - toX(r)},${toY(t)}`)
  }

  return (
    <div>
      <p className="mb-2 text-xs leading-snug text-ink-muted">
        Drag the points to shape the right half of the vase. Click anywhere to add a point. Height: <span className="font-mono">{height} mm</span>.
      </p>
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none border border-line bg-paper-raised"
        role="group"
        aria-label="Profile editor"
        onPointerMove={(e) => drag !== null && update(drag, fromEvent(e))}
        onPointerUp={() => setDrag(null)}
        onPointerLeave={() => setDrag(null)}
        onPointerDown={(e) => {
          if ((e.target as Element).tagName === 'circle') return
          const p = fromEvent(e)
          const next = sorted([...points, p])
          onChange(next)
          setSelected(next.findIndex((q) => q === p))
        }}
      >
        {/* grid: every 10 mm and every 10 % of the height */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={toX(i * 10)} x2={toX(i * 10)} y1={PAD} y2={H - PAD} className="stroke-line" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`h${i}`} x1={PAD / 2} x2={W - PAD / 2} y1={toY(i / 10)} y2={toY(i / 10)} className="stroke-line" strokeWidth={0.5} />
        ))}
        <line x1={W / 2} x2={W / 2} y1={PAD / 2} y2={H - PAD / 2} className="stroke-ink-muted" strokeDasharray="4 4" strokeWidth={1} />
        <text x={W / 2 + 4} y={PAD - 8} className="fill-ink-muted font-mono" fontSize={9}>axis</text>
        <polyline points={mirror.join(' ')} fill="none" className="stroke-line" strokeWidth={2} />
        <polyline points={curve.join(' ')} fill="none" className="stroke-accent" strokeWidth={2} />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={toX(p.r)}
            cy={toY(p.t)}
            r={selected === i ? 8 : 6.5}
            tabIndex={0}
            role="slider"
            aria-label={`Point ${i + 1}: ${Math.round(p.t * 100)} % up, radius ${Math.round(p.r)} mm`}
            aria-valuenow={Math.round(p.r)}
            className="cursor-grab fill-paper-raised stroke-ink focus-visible:outline-none focus-visible:stroke-accent"
            strokeWidth={2}
            onPointerDown={(e) => {
              e.stopPropagation()
              ;(e.target as Element).setPointerCapture?.(e.pointerId)
              setDrag(i)
              setSelected(i)
            }}
            onFocus={() => setSelected(i)}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 10 : 1
              if (e.key === 'ArrowRight') update(i, { r: Math.min(MAX_R, p.r + step) })
              else if (e.key === 'ArrowLeft') update(i, { r: Math.max(4, p.r - step) })
              else if (e.key === 'ArrowUp') update(i, { t: Math.min(1, p.t + step / 100) })
              else if (e.key === 'ArrowDown') update(i, { t: Math.max(0, p.t - step / 100) })
              else if (e.key === 'Delete' || e.key === 'Backspace') remove(i)
              else return
              e.preventDefault()
            }}
          />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => onChange(sorted([...points, { t: 0.5, r: 50 }]))}>
          <Plus aria-hidden /> Add point
        </Button>
        <Button size="sm" variant="outline" disabled={selected === null || points.length <= 3} onClick={() => selected !== null && remove(selected)}>
          <Trash2 aria-hidden /> Delete selected
        </Button>
      </div>
    </div>
  )
}
