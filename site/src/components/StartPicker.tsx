import { FAMILIES, STARTS } from '@/starts'
import type { StartId } from '@/starts/types'
import { PRESETS, type Design } from '@/design/design'
import { cn } from '@/lib/utils'

/** Small line drawings of each starting point (24 × 32 box). */
const ICONS: Record<StartId, string> = {
  round: 'M9 30 C4 22 3 15 7 10 C8 8 9 6 9 3 M15 30 C20 22 21 15 17 10 C16 8 15 6 15 3 M9 30 H15',
  sphere: 'M9 30 C1 26 1 8 9 4 M15 30 C23 26 23 8 15 4 M9 30 H15 M9 4 H15',
  box: 'M4 30 V4 H20 V30 Z M4 4 L8 2 H23 L20 4 M23 2 V28 L20 30',
  polygon: 'M5 30 L3 4 M19 30 L21 4 M12 30 V4 M3 4 L12 2 L21 4 M5 30 H19',
  cone: 'M8 30 C9 20 5 10 2 3 M16 30 C15 20 19 10 22 3 M8 30 H16',
  draw: 'M12 30 V3 M12 30 C20 26 22 18 16 12 C14 9 18 6 19 3',
  sketch: 'M12 30 V3 M12 30 C19 27 21 22 19 17 C17 13 20 10 17 7 C16 5 18 4 18 3',
  image: 'M3 5 H21 V29 H3 Z M3 23 L9 16 L13 20 L16 17 L21 22 M16 10 A2 2 0 1 0 16.01 10',
  carve: 'M9 30 C1 26 1 8 9 4 M15 30 C23 26 23 8 15 4 M9 30 H15 M9 4 H15 M9 14 L12 11 L15 14 L12 17 Z',
}

export function StartIcon({ id, className }: { id: StartId; className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={cn('h-10 w-8', className)} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[id]} />
    </svg>
  )
}

export function StartPicker({ design, onStart, onPreset }: { design: Design; onStart: (id: StartId) => void; onPreset: (d: Design) => void }) {
  return (
    <div className="grid gap-6 py-4">
      {FAMILIES.filter((f) => f.id === 'shape').concat([{ id: 'draw', name: 'Or start another way', blurb: 'Draw, sketch, borrow from an image, or carve.' }]).map((f) => {
        const starts = f.id === 'shape' ? STARTS.filter((s) => s.family === 'shape') : STARTS.filter((s) => s.family !== 'shape')
        const single = f.id !== 'shape'
        return (
          <section key={f.id} aria-labelledby={`fam-${f.id}`}>
            <h3 id={`fam-${f.id}`} className="text-sm font-medium">{f.name}</h3>
            <p className="text-xs text-ink-muted">{f.blurb}</p>
            <div className={cn('mt-2 grid gap-2', !single ? 'grid-cols-3 sm:grid-cols-5 lg:grid-cols-3' : 'grid-cols-1')}>
              {starts.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={design.start === s.id}
                  onClick={() => onStart(s.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-sm border border-line p-2 text-left text-sm text-ink-muted hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-clay',
                    !single && 'flex-col justify-center gap-1 text-center',
                    design.start === s.id && 'border-ink bg-paper-raised text-ink',
                  )}
                >
                  <StartIcon id={s.id} className={design.start === s.id ? 'text-clay' : ''} />
                  <span>
                    <span className="block font-medium">{s.name}</span>
                    {single && <span className="block text-xs text-ink-muted">{s.blurb}</span>}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )
      })}
      <section aria-labelledby="fam-presets">
        <h3 id="fam-presets" className="text-sm font-medium">A preset</h3>
        <p className="text-xs text-ink-muted">Named designs that use the starting points above. Pick one, then change anything.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={design.name === p.design.name}
              onClick={() => onPreset(p.design)}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-sm border border-line pl-1.5 pr-3 text-sm text-ink-muted hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-clay',
                design.name === p.design.name && 'border-ink bg-paper-raised text-ink',
              )}
            >
              <StartIcon id={p.design.start} className="h-6 w-5" />
              {p.design.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
