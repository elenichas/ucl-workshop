import { useState } from 'react'
import { STARTS } from '@/starts'
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

type Mode = 'shape' | 'other' | 'preset'

const MODES: { id: Mode; title: string; sub: string }[] = [
  { id: 'shape', title: 'A basic shape', sub: 'Pick a solid, then adjust it' },
  { id: 'other', title: 'Another way', sub: 'Draw, sketch, image or carve' },
  { id: 'preset', title: 'A ready-made design', sub: 'Start from an example' },
]

/**
 * Step 1. Three ways in, chosen first (a basic shape, another way, or a ready-made design);
 * only the options of the chosen way are shown underneath.
 */
export function StartPicker({ design, onStart, onPreset }: { design: Design; onStart: (id: StartId) => void; onPreset: (d: Design) => void }) {
  const current = STARTS.find((s) => s.id === design.start)
  const [mode, setMode] = useState<Mode>(current?.family === 'shape' ? 'shape' : 'other')
  const shapes = STARTS.filter((s) => s.family === 'shape')
  const others = STARTS.filter((s) => s.family !== 'shape')

  return (
    <div className="grid gap-5 py-4">
      <fieldset>
        <legend className="text-sm font-medium">How do you want to begin?</legend>
        <div role="radiogroup" aria-label="How do you want to begin?" className="mt-2 grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'flex h-full flex-col rounded-sm border border-line p-2.5 text-left hover:border-ink focus-visible:outline-2 focus-visible:outline-accent',
                mode === m.id && 'border-ink bg-paper-raised',
              )}
            >
              <span className={cn('text-sm font-medium leading-tight', mode === m.id ? 'text-ink' : 'text-ink-muted')}>{m.title}</span>
              <span className="mt-1 text-[11px] leading-snug text-ink-muted">{m.sub}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <section aria-label={MODES.find((m) => m.id === mode)!.title} className="border-t border-line pt-4">
        {mode === 'shape' && (
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((s) => (
              <button key={s.id} type="button" aria-pressed={design.start === s.id} onClick={() => onStart(s.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-sm border border-line p-2 text-center text-sm text-ink-muted hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-accent',
                  design.start === s.id && 'border-ink bg-paper-raised text-ink',
                )}>
                <StartIcon id={s.id} className={design.start === s.id ? 'text-accent' : ''} />
                <span className="font-medium">{s.name}</span>
              </button>
            ))}
          </div>
        )}

        {mode === 'other' && (
          <div className="grid gap-2">
            {others.map((s) => (
              <button key={s.id} type="button" aria-pressed={design.start === s.id} onClick={() => onStart(s.id)}
                className={cn(
                  'grid grid-cols-[2rem_1fr] items-center gap-3 rounded-sm border border-line p-2.5 text-left text-sm text-ink-muted hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-accent',
                  design.start === s.id && 'border-ink bg-paper-raised text-ink',
                )}>
                <StartIcon id={s.id} className={design.start === s.id ? 'text-accent' : ''} />
                <span>
                  <span className="block font-medium text-ink">{s.name}</span>
                  <span className="block text-xs leading-snug text-ink-muted">{s.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {mode === 'preset' && (
          <>
            <p className="mb-3 text-xs leading-snug text-ink-muted">Complete designs made with the ways to start. Pick one, then change anything.</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => {
                const start = STARTS.find((s) => s.id === p.design.start)
                const on = design.name === p.design.name
                return (
                  <button key={p.id} type="button" aria-pressed={on} onClick={() => onPreset(p.design)}
                    className={cn(
                      'grid grid-cols-[1.5rem_1fr] items-center gap-2 rounded-sm border border-line p-2 text-left hover:border-ink focus-visible:outline-2 focus-visible:outline-accent',
                      on && 'border-ink bg-paper-raised',
                    )}>
                    <StartIcon id={p.design.start} className={cn('h-8 w-6', on ? 'text-accent' : 'text-ink-muted')} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.design.name}</span>
                      <span className="block text-[11px] text-ink-muted">{start?.name}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
