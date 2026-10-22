import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Download, Expand, LayoutGrid, LoaderCircle, NotebookText, X } from 'lucide-react'
import { DECK } from '@/slides/deck'
import { SlideView, SLIDE_H, SLIDE_W } from '@/slides/SlideView'
import { stepsOf, titleOf } from '@/slides/types'
import { CHAPTERS } from './course'
import { cn } from '@/lib/utils'

export const CHANNEL = 'vessel-presenter'

/**
 * PRESENT MODE
 * → / Space / PageDown: next step or slide   ← / PageUp: back
 * F: full screen   O: overview   N: speaker notes window   Esc: close overview / leave
 */
export default function PresentPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [index, setIndex] = useState(() => Math.min(DECK.length - 1, Math.max(0, Number(params.get('s') ?? 0))))
  const [step, setStep] = useState(0)
  const [overview, setOverview] = useState(false)
  const [scale, setScale] = useState(1)
  const [exporting, setExporting] = useState<string | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const channel = useMemo(() => ('BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null), [])

  const slide = DECK[index]
  const maxStep = stepsOf(slide)

  const go = useCallback((i: number, s = 0) => {
    const ni = Math.min(DECK.length - 1, Math.max(0, i))
    setIndex(ni)
    setStep(s === -1 ? stepsOf(DECK[ni]) : s)
  }, [])
  const next = useCallback(() => (step < maxStep ? setStep(step + 1) : index < DECK.length - 1 && go(index + 1)), [step, maxStep, index, go])
  const prev = useCallback(() => (step > 0 ? setStep(step - 1) : index > 0 && go(index - 1, -1)), [step, index, go])

  // follow the URL when it changes from outside (e.g. "Present this chapter" while already presenting)
  const urlIndex = Number(params.get('s') ?? NaN)
  const written = useRef(index)
  useEffect(() => {
    if (!Number.isNaN(urlIndex) && urlIndex !== written.current) go(urlIndex)
  }, [urlIndex, go])

  // keep the URL and the notes window in sync
  useEffect(() => {
    if (written.current !== index || urlIndex !== index) {
      written.current = index
      setParams({ s: String(index) }, { replace: true })
    }
    channel?.postMessage({ type: 'state', index, step })
    document.title = `${index + 1}/${DECK.length} · ${titleOf(slide)} — Prompt to Print`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, step, channel, slide])

  useEffect(() => {
    if (!channel) return
    channel.onmessage = (e) => {
      if (e.data?.type === 'next') next()
      if (e.data?.type === 'prev') prev()
      if (e.data?.type === 'hello') channel.postMessage({ type: 'state', index, step })
    }
  }, [channel, next, prev, index, step])

  // fit the 1600 × 900 slide into the window
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(el.clientWidth / SLIDE_W, el.clientHeight / SLIDE_H)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, select')) return
      if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); next() }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev() }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(DECK.length - 1)
      else if (e.key.toLowerCase() === 'f') toggleFullscreen()
      else if (e.key.toLowerCase() === 'o') setOverview((o) => !o)
      else if (e.key.toLowerCase() === 'n') openNotes()
      else if (e.key === 'Escape') overview ? setOverview(false) : document.fullscreenElement ? null : navigate(`/course/${slide.chapter ?? ''}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, overview, navigate, slide.chapter])

  async function exportPptx() {
    setExporting('Preparing…')
    try {
      const { exportDeck } = await import('@/slides/exportPptx')
      await exportDeck(DECK, (msg) => setExporting(msg))
    } finally {
      setExporting(null)
    }
  }

  const chapterInfo = CHAPTERS.find((c) => c.slug === slide.chapter)

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-ink/95 text-paper dark:bg-black">
      {/* progress */}
      <div className="h-1 w-full bg-white/10" aria-hidden>
        <div className="h-full bg-clay transition-[width] duration-300" style={{ width: `${((index + 1) / DECK.length) * 100}%` }} />
      </div>

      <div ref={stage} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden" aria-live="polite">
        <div key={index} className="slide-enter shadow-2xl" style={{ width: SLIDE_W * scale, height: SLIDE_H * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <SlideView slide={slide} step={step} />
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center gap-2 px-4 py-2 text-[13px] text-paper/80">
        <Link to={`/course/${slide.chapter ?? ''}`} className="flex items-center gap-1 rounded-sm px-2 py-1 hover:bg-white/10" title="Leave (Esc)"><X className="size-4" aria-hidden /> Exit</Link>
        <span className="hidden truncate sm:block">{chapterInfo ? `${chapterInfo.number} · ${chapterInfo.title}` : ''}</span>
        <span className="ml-auto font-mono tabular-nums">{index + 1} / {DECK.length}{maxStep > 0 && <span className="text-paper/50"> · {step + 1}/{maxStep + 1}</span>}</span>
        <BarButton label="Previous (←)" onClick={prev}><ChevronLeft /></BarButton>
        <BarButton label="Next (→)" onClick={next}><ChevronRight /></BarButton>
        <BarButton label="Overview (O)" onClick={() => setOverview(true)}><LayoutGrid /></BarButton>
        <BarButton label="Speaker notes (N)" onClick={openNotes}><NotebookText /></BarButton>
        <BarButton label="Full screen (F)" onClick={toggleFullscreen}><Expand /></BarButton>
        <button type="button" onClick={exportPptx} disabled={!!exporting} className="ml-2 flex items-center gap-2 rounded-sm border border-white/30 px-3 py-1.5 hover:bg-white/10 disabled:opacity-60">
          {exporting ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : <Download className="size-4" aria-hidden />}
          {exporting ?? 'PowerPoint'}
        </button>
      </div>

      {overview && (
        <div role="dialog" aria-modal="true" aria-label="All slides" className="absolute inset-0 z-50 overflow-y-auto bg-paper p-6 text-ink md:p-10">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-5xl">All slides</h2>
            <button type="button" onClick={() => setOverview(false)} className="rounded-sm border border-line p-2 hover:border-ink" aria-label="Close overview" autoFocus><X className="size-5" /></button>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {CHAPTERS.map((c) => (
              <section key={c.slug}>
                <h3 className="border-b border-ink pb-2 text-sm font-medium"><span className="font-mono text-clay">{c.number}</span> {c.title}</h3>
                <ol className="mt-2">
                  {DECK.map((s, i) => ({ s, i })).filter(({ s }) => s.chapter === c.slug).map(({ s, i }) => (
                    <li key={i}>
                      <button type="button" onClick={() => { go(i); setOverview(false) }}
                        className={cn('flex w-full gap-3 py-1 text-left text-sm hover:text-clay', i === index && 'text-clay')}>
                        <span className="w-8 shrink-0 font-mono text-xs text-ink-muted">{i + 1}</span>
                        <span className="truncate">{titleOf(s)}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BarButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="rounded-sm p-1.5 hover:bg-white/10 [&_svg]:size-5">
      {children}
    </button>
  )
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.()
  else document.documentElement.requestFullscreen?.().catch(() => {})
}

function openNotes() {
  window.open(`${location.pathname}#/notes`, 'vessel-notes', 'width=760,height=640')
}
