import { STARTS } from '@/starts'
import type { StartId } from '@/starts/types'
import { cn } from '@/lib/utils'

/**
 * THE SYSTEM MAP
 * Start from → controls → how the form is described → its own steps → shared pipeline → results.
 * Everything here is read from the starting-point modules (src/starts), so the map
 * always matches what the app really does. The active start is highlighted.
 */
export const PIPELINE: { label: string; carveOnly?: boolean; fieldOnly?: boolean }[] = [
  { label: 'Sample a grid of points: rings × angles' },
  { label: 'Push each point out by the surface pattern' },
  { label: 'Offset inwards by the wall thickness' },
  { label: 'Stitch neighbours into triangles' },
  { label: 'Close: rim, floor, bottom → watertight' },
  { label: 'Boolean cut with the cutter (CSG)', carveOnly: true },
  { label: 'Measure from the profile', fieldOnly: true },
  { label: 'Measure from the mesh (normals, extents)', carveOnly: true },
  { label: 'Run the print checks against printer + material' },
]

export const SHARED_INPUTS = ['Surface pattern', 'Wall & floor', 'Colour & finish', 'Printer & material']
export const SHARED_OUTPUTS = ['Live 3D view', 'Print report + estimates', 'STL, OBJ and 3DM files']

export function SystemMap({ active, onSelect, compact = false, className }: {
  active: StartId | null
  onSelect?: (id: StartId) => void
  compact?: boolean
  className?: string
}) {
  const isCarve = active === 'carve'
  const dim = (id: StartId) => active !== null && active !== id
  const text = compact ? 'text-[11px]' : 'text-xs'

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className={cn('grid min-w-[1080px] gap-x-3', text)} style={{ gridTemplateColumns: '9rem 1.3fr 1.3fr 1.3fr 2.2rem 1.4fr 2.2rem 1.3fr' }}>
        {/* header */}
        {['Start from', 'Controls it exposes', 'How the form is described', 'Its own steps', '', 'Shared pipeline', '', 'What changes in the results'].map((h, i) => (
          <div key={i} className="section-label border-b border-ink pb-2 !text-[10px]">{h}</div>
        ))}

        {STARTS.map((s, i) => {
          const controls = s.controls.map((c) => c.label).concat(s.usesSection ? ['+ cross-section'] : [])
          const rowCls = cn('border-b border-line py-2 transition-opacity duration-300', dim(s.id) && 'opacity-30')
          return (
            <div key={s.id} className="contents">
              <button
                type="button"
                disabled={!onSelect}
                onClick={() => onSelect?.(s.id)}
                aria-pressed={active === s.id}
                className={cn(rowCls, 'text-left font-medium enabled:hover:text-accent', active === s.id && 'text-accent')}
                style={{ gridRow: i + 2 }}
              >
                <span className="font-mono text-[10px] text-ink-muted">{String(i + 1).padStart(2, '0')}</span> {s.name}
              </button>
              <div className={cn(rowCls, 'leading-snug text-ink-muted')} style={{ gridRow: i + 2 }}>{controls.join(', ')}</div>
              <div className={cn(rowCls, 'leading-snug')} style={{ gridRow: i + 2 }}>{s.representation}</div>
              <ol className={cn(rowCls, 'leading-snug text-ink-muted')} style={{ gridRow: i + 2 }}>
                {s.steps.map((st) => <li key={st}>{st}</li>)}
              </ol>
              <Connector active={active === s.id} faded={dim(s.id)} row={i + 2} col={5} />
              <ul className={cn(rowCls, 'leading-snug')} style={{ gridRow: i + 2, gridColumn: 8 }}>
                {s.results.map((r) => <li key={r}>{r}</li>)}
              </ul>
              <Connector active={active === s.id} faded={dim(s.id)} row={i + 2} col={7} />
            </div>
          )
        })}

        {/* shared pipeline spans all rows */}
        <div className="my-2 flex flex-col border border-ink bg-paper-raised p-3" style={{ gridColumn: 6, gridRow: `2 / span ${STARTS.length}` }}>
          <p className="section-label !text-[10px]">Shared inputs</p>
          <ul className="mt-1 flex flex-wrap gap-1">
            {SHARED_INPUTS.map((x) => <li key={x} className="border border-line px-1.5 py-0.5">{x}</li>)}
          </ul>
          <p className="section-label mt-3 !text-[10px]">Steps</p>
          <ol className="mt-1 grid gap-1.5">
            {PIPELINE.map((p, i) => {
              const off = (p.carveOnly && active !== null && !isCarve) || (p.fieldOnly && isCarve)
              return (
                <li key={p.label} className={cn('flex gap-2 leading-snug transition-opacity duration-300', off && 'opacity-25')}>
                  <span className="font-mono text-accent">{i + 1}</span>
                  <span>{p.label}{p.carveOnly && <em className="text-ink-muted"> (carve only)</em>}</span>
                </li>
              )
            })}
          </ol>
          <p className="section-label mt-auto pt-3 !text-[10px]">Outputs</p>
          <ul className="mt-1 grid gap-1">
            {SHARED_OUTPUTS.map((x) => <li key={x} className="font-medium">{x}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Connector({ active, faded, row, col }: { active: boolean; faded: boolean; row: number; col: number }) {
  return (
    <div aria-hidden className={cn('relative transition-opacity duration-300', faded && 'opacity-30')} style={{ gridRow: row, gridColumn: col }}>
      <span className={cn('absolute inset-x-0 top-1/2 h-px', active ? 'flow-line bg-filament' : 'bg-line')} />
      <span className={cn('absolute right-0 top-1/2 -translate-y-1/2 font-mono leading-none', active ? 'text-accent' : 'text-line')}>›</span>
    </div>
  )
}
