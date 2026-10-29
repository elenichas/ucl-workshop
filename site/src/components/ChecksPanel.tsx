import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react'
import type { CheckResult, Verdict } from '@/checks/printability'
import { cn } from '@/lib/utils'

const ICON: Record<Verdict, typeof CircleCheck> = { pass: CircleCheck, warn: CircleAlert, fail: CircleX }
const COLOR: Record<Verdict, string> = { pass: 'text-ok', warn: 'text-warn', fail: 'text-fail' }
const WORD: Record<Verdict, string> = { pass: 'Ready to print', warn: 'Printable — check the warnings', fail: 'Will not print as designed' }

/** Wide screens with a mouse: the suggestions float beside the panel, over the 3D view. Otherwise they open in place. */
function useFloating() {
  const query = '(min-width: 1024px) and (hover: hover)'
  const [floating, setFloating] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(query).matches)
  useEffect(() => {
    const m = window.matchMedia?.(query)
    if (!m) return
    const on = () => setFloating(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return floating
}

/**
 * The printability report. Colour is never the only signal: every verdict has an icon and words.
 * A warning or a failure has "How to fix": hover it (or focus it with the keyboard) to see
 * suggestions, click to keep them open.
 */
export function ChecksPanel({ results, verdict }: { results: CheckResult[]; verdict: Verdict }) {
  const Icon = ICON[verdict]
  const floating = useFloating()
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const open = pinned ?? hovered
  const openResult = results.find((r) => r.id === open && r.fixes?.length)

  // Close when the check is fixed (it disappears from the warnings) or with Escape.
  useEffect(() => {
    if (pinned && !results.some((r) => r.id === pinned && r.fixes?.length)) setPinned(null)
  }, [results, pinned])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPinned(null); setHovered(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section aria-labelledby="checks-title">
      <h2 id="checks-title" className="section-label">Print check</h2>
      <p className={cn('mt-3 flex items-center gap-2 font-medium', COLOR[verdict])} role="status" aria-live="polite">
        <Icon className="size-5" aria-hidden />
        {WORD[verdict]}
      </p>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {results.map((r) => (
          <CheckRow
            key={r.id}
            result={r}
            open={openResult?.id === r.id}
            floating={!!floating}
            pinned={pinned === r.id}
            onHover={(on) => setHovered((h) => (on ? r.id : h === r.id ? null : h))}
            onTogglePin={() => setPinned((p) => (p === r.id ? null : r.id))}
          />
        ))}
      </ul>
    </section>
  )
}

function CheckRow({ result: r, open, floating, pinned, onHover, onTogglePin }: {
  result: CheckResult
  open: boolean
  floating: boolean
  pinned: boolean
  onHover: (on: boolean) => void
  onTogglePin: () => void
}) {
  const I = ICON[r.verdict]
  const id = useId()
  const rowRef = useRef<HTMLLIElement>(null)
  const hasFixes = !!r.fixes?.length

  return (
    <li
      ref={rowRef}
      className="py-2.5"
      onPointerEnter={hasFixes && floating ? () => onHover(true) : undefined}
      onPointerLeave={hasFixes && floating ? () => onHover(false) : undefined}
    >
      <div className="flex gap-3">
        <I className={cn('mt-0.5 size-4 shrink-0', COLOR[r.verdict])} aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {r.title}
            <span className="sr-only"> — {r.verdict}</span>
          </p>
          <p className="text-xs leading-snug text-ink-muted">{r.detail}</p>
          {hasFixes && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              onClick={onTogglePin}
              onFocus={floating ? () => onHover(true) : undefined}
              onBlur={floating ? () => onHover(false) : undefined}
              className={cn(
                'mt-1.5 rounded-sm text-xs font-medium underline decoration-1 underline-offset-2 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                open ? 'text-accent' : 'text-ink',
              )}
            >
              {pinned ? 'Hide suggestions' : 'How to fix'}
            </button>
          )}
        </div>
      </div>
      {hasFixes && open && (floating
        ? <FloatingFixes id={id} anchor={rowRef} result={r} />
        : <FixList id={id} result={r} className="ml-7 mt-2 border-l-2 border-filament pl-3" />)}
    </li>
  )
}

function FixList({ id, result, className }: { id: string; result: CheckResult; className?: string }) {
  return (
    <div id={id} className={className}>
      <p className="text-xs font-semibold">How to fix: {result.title.toLowerCase()}</p>
      <ul className="mt-1.5 grid gap-1.5 text-xs leading-snug">
        {result.fixes!.map((f) => (
          <li key={f} className="flex gap-2">
            <span aria-hidden className="mt-[0.45em] size-1 shrink-0 rounded-full bg-current" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A card pinned to the left edge of the side panel, level with its check, over the 3D view. */
function FloatingFixes({ id, anchor, result }: { id: string; anchor: React.RefObject<HTMLLIElement | null>; result: CheckResult }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)
  const place = useCallback(() => {
    const row = anchor.current
    const panel = row?.closest('aside')
    if (!row || !panel) return
    const r = row.getBoundingClientRect()
    const p = panel.getBoundingClientRect()
    setPos({ top: Math.max(8, Math.min(r.top, window.innerHeight - 260)), right: window.innerWidth - p.left + 12 })
  }, [anchor])
  useLayoutEffect(() => {
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => { window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place) }
  }, [place])
  if (!pos) return null
  return (
    <div
      className="fixed z-40 w-80 rounded-sm border border-line bg-paper-raised p-3"
      style={{ top: pos.top, right: pos.right }}
    >
      <FixList id={id} result={result} />
    </div>
  )
}
