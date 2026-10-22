import { useEffect, useMemo, useState } from 'react'
import { DECK } from '@/slides/deck'
import { stepsOf, titleOf } from '@/slides/types'
import { CHANNEL } from './PresentPage'

/** The speaker-notes window. Follows the presentation and can drive it. */
export default function NotesPage() {
  const [state, setState] = useState({ index: 0, step: 0 })
  const [start] = useState(() => Date.now())
  const [now, setNow] = useState(Date.now())
  const channel = useMemo(() => ('BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null), [])

  useEffect(() => {
    if (!channel) return
    channel.onmessage = (e) => e.data?.type === 'state' && setState({ index: e.data.index, step: e.data.step })
    channel.postMessage({ type: 'hello' })
    const t = setInterval(() => setNow(Date.now()), 1000)
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) channel.postMessage({ type: 'next' })
      if (['ArrowLeft', 'PageUp'].includes(e.key)) channel.postMessage({ type: 'prev' })
    }
    window.addEventListener('keydown', onKey)
    document.title = 'Speaker notes — Prompt to Print'
    return () => { clearInterval(t); window.removeEventListener('keydown', onKey) }
  }, [channel])

  const slide = DECK[state.index]
  const nextSlide = DECK[state.index + 1]
  const mins = Math.floor((now - start) / 60000), secs = Math.floor(((now - start) / 1000) % 60)

  return (
    <div className="mx-auto grid max-w-3xl gap-6 p-6">
      <div className="flex items-baseline justify-between font-mono text-sm text-ink-muted">
        <span>{state.index + 1} / {DECK.length}{stepsOf(slide) > 0 && ` · step ${state.step + 1}/${stepsOf(slide) + 1}`}</span>
        <span className="text-2xl text-ink tabular-nums">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
      </div>
      <h1 className="font-display text-4xl leading-tight">{titleOf(slide)}</h1>
      <p className="text-xl leading-relaxed">{slide.notes ?? <span className="text-ink-muted">No notes for this slide.</span>}</p>
      <div className="border-t border-line pt-4 text-ink-muted">
        <p className="section-label">Next</p>
        <p className="mt-1 text-lg">{nextSlide ? titleOf(nextSlide) : 'End of the deck'}</p>
      </div>
      <div className="flex gap-2">
        <button className="border border-line px-4 py-2 hover:border-ink" onClick={() => channel?.postMessage({ type: 'prev' })}>← Back</button>
        <button className="bg-ink px-4 py-2 text-paper hover:bg-clay" onClick={() => channel?.postMessage({ type: 'next' })}>Next →</button>
      </div>
      <p className="text-sm text-ink-muted">Keep this window on your laptop screen and share only the presentation window. Arrow keys work here too.</p>
    </div>
  )
}
