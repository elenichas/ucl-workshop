import { useId, useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/theme/ThemeProvider'
import { THEME_ORDER, THEMES } from '@/theme/themes'

/**
 * Three-way switch between the site's styles. It is a single-choice segmented control
 * (a radio group): one style is always selected, arrow keys move the selection.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const labelId = useId()

  const onKeyDown = (e: KeyboardEvent) => {
    const i = THEME_ORDER.indexOf(theme.id)
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + THEME_ORDER.length) % THEME_ORDER.length
    setTheme(THEME_ORDER[next])
    refs.current[next]?.focus()
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span id={labelId} className="text-xs text-ink-muted max-md:sr-only">Style</span>
      <div role="radiogroup" aria-labelledby={labelId} onKeyDown={onKeyDown}
        className="grid flex-1 grid-cols-3 gap-0.5 rounded-sm border border-line bg-paper-raised p-0.5 md:flex-none">
        {THEME_ORDER.map((id, i) => {
          const t = THEMES[id]
          const on = theme.id === id
          return (
            <button
              key={id}
              ref={(el) => { refs.current[i] = el }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              title={t.description}
              onClick={() => setTheme(id)}
              className={cn(
                'whitespace-nowrap rounded-[calc(var(--radius-sm)-2px)] px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-accent',
                on ? 'bg-filament text-on-filament' : 'text-ink-muted hover:text-ink',
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
