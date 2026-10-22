import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { buildDesign } from '@/geometry/buildDesign'
import { getPreset, type Design } from '@/design/design'
import { VaseViewer } from '@/viewer/VaseViewer'
import { finishLook } from '@/components/FinishPanel'
import { usePrefersDark } from '@/state/usePrefersDark'
import { Reveal } from './visuals/common'
import { VISUALS } from './visuals'
import type { Slide } from './types'

export const SLIDE_W = 1600
export const SLIDE_H = 900

/**
 * Draws one slide on a fixed 1600 × 900 canvas (the presenter scales it to fit the screen).
 * `step` is how many clicks into the slide we are; `exporting` hides live-only bits.
 */
export interface SlideContext {
  part: { number: number; title: string } | null
  chapter: string
}

export function SlideView({ slide, step, exporting = false, context }: { slide: Slide; step: number; exporting?: boolean; context?: SlideContext }) {
  const showLabel = context && slide.kind !== 'title' && slide.kind !== 'part'
  return (
    <div className="slide relative flex flex-col overflow-hidden bg-paper text-ink" style={{ width: SLIDE_W, height: SLIDE_H }}>
      {showLabel && (
        <div className="slide-label absolute inset-x-24 top-9 z-10 flex items-center justify-between gap-6">
          <p className="section-label !text-[16px]">
            {context.part && <span className="text-clay">Part {context.part.number} · {context.part.title}</span>}
            {context.part && <span className="mx-3 text-line">/</span>}
            {context.chapter}
          </p>
          {context.part && <PartTicks current={context.part.number} />}
        </div>
      )}
      <SlideBody slide={slide} step={step} exporting={exporting} />
    </div>
  )
}

/** Five small marks: where we are in the five parts. */
function PartTicks({ current, dark = false }: { current: number; dark?: boolean }) {
  return (
    <span className="flex gap-1.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className="h-1.5 w-8" style={{ background: n === current ? (dark ? '#D2714B' : 'var(--color-clay)') : n < current ? (dark ? '#8a8378' : 'var(--color-ink-muted)') : (dark ? '#3A352E' : 'var(--color-line)') }} />
      ))}
    </span>
  )
}

function Title({ children, className }: { children: string; className?: string }) {
  return <h2 className={cn('font-display text-[72px] leading-[1.02] tracking-tight [text-wrap:balance]', className)}>{children}</h2>
}

function SlideBody({ slide, step, exporting }: { slide: Slide; step: number; exporting: boolean }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="grid h-full grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-between p-24">
            <p className="section-label !text-[20px]">{slide.meta}</p>
            <div>
              <h1 className="font-display text-[170px] leading-[0.88] tracking-tight">{slide.title}</h1>
              <p className="mt-10 max-w-[24ch] text-[38px] leading-snug text-ink-muted">{slide.subtitle}</p>
            </div>
            <p className="font-mono text-[20px] text-ink-muted">→ press the right arrow</p>
          </div>
          <LiveVase presetDesigns={[{ label: '' }]} step={0} exporting={exporting} />
        </div>
      )
    case 'part':
      // A dark divider, the same in light and dark mode, so a change of subject is unmistakable.
      return (
        <div className="grid h-full grid-cols-[1.25fr_1fr] gap-16 p-24" style={{ background: '#1C1A17', color: '#F3EFE7' }}>
          <div className="flex flex-col justify-between">
            <PartTicks current={slide.number} dark />
            <div>
              <p className="font-mono text-[40px]" style={{ color: '#D2714B' }}>Part {slide.number}</p>
              <h2 className="mt-4 font-display text-[150px] leading-[0.9] tracking-tight [text-wrap:balance]">{slide.title}</h2>
              <p className="mt-10 max-w-[26ch] font-display text-[44px] italic leading-tight" style={{ color: '#A79F92' }}>{slide.question}</p>
            </div>
          </div>
          <ol className="grid content-end gap-0 border-t" style={{ borderColor: '#3A352E' }}>
            {slide.chapters.map((c) => (
              <li key={c.number} className="flex items-baseline gap-6 border-b py-4" style={{ borderColor: '#3A352E' }}>
                <span className="font-mono text-[24px]" style={{ color: '#D2714B' }}>{c.number}</span>
                <span className="text-[30px] leading-snug">{c.title}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    case 'chapter':
      return (
        <div className="flex h-full flex-col justify-between p-24">
          <p className="section-label !text-[20px]">{slide.part}</p>
          <div>
            <p className="font-mono text-[44px] text-clay">{slide.number}</p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[140px] leading-[0.92] tracking-tight [text-wrap:balance]">{slide.title}</h2>
          </div>
          <p className="max-w-[60ch] text-[30px] leading-snug text-ink-muted">{slide.summary}</p>
        </div>
      )
    case 'statement':
      return (
        <div className="flex h-full flex-col justify-center p-28">
          <p className="max-w-[22ch] font-display text-[104px] leading-[1.0] tracking-tight [text-wrap:balance]">{slide.text}</p>
          {slide.sub && <p className="mt-12 max-w-[50ch] text-[32px] leading-snug text-ink-muted">{slide.sub}</p>}
        </div>
      )
    case 'bullets':
      return (
        <div className="flex h-full flex-col p-24">
          <Title>{slide.title}</Title>
          <ul className="mt-14 grid gap-7">
            {slide.points.map((p, i) => (
              <Reveal key={p} step={slide.reveal ? step : 99} at={i}>
                <li className="grid grid-cols-[3.5rem_1fr] items-baseline text-[40px] leading-snug">
                  <span className="font-mono text-[26px] text-clay">{String(i + 1).padStart(2, '0')}</span>
                  <span>{p}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          {slide.aside && <p className="mt-auto font-mono text-[22px] text-ink-muted">{slide.aside}</p>}
        </div>
      )
    case 'visual': {
      const Visual = VISUALS[slide.visual]
      return (
        <div className="flex h-full flex-col px-24 pb-16 pt-20">
          <Title>{slide.title}</Title>
          <div className="visual-area relative mt-10 min-h-0 flex-1" data-visual={slide.visual}>
            <Visual step={step} />
          </div>
          {slide.caption && <p className="mt-6 text-[24px] text-ink-muted">{slide.caption}</p>}
        </div>
      )
    }
    case 'compare':
      return (
        <div className="flex h-full flex-col p-24">
          <Title>{slide.title}</Title>
          <div className="mt-14 grid flex-1 grid-cols-2 gap-16">
            {[slide.left, slide.right].map((col, i) => (
              <Reveal key={col.label} step={slide.reveal ? step : 99} at={i}>
                <p className={cn('section-label !text-[22px]', i === 1 && '!text-clay')}>{col.label}</p>
                <ul className="mt-6 grid gap-4">{col.points.map((p) => <li key={p} className="border-b border-line pb-3 text-[34px] leading-snug">{p}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      )
    case 'table':
      return (
        <div className="flex h-full flex-col p-24">
          <Title>{slide.title}</Title>
          <table className="mt-12 w-full border-collapse text-left">
            <thead>
              <tr>{slide.head.map((h) => <th key={h} className="section-label border-b-2 border-ink pb-3 pr-8 !text-[18px]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {slide.rows.map((r, i) => (
                <tr key={i} className="reveal-row border-b border-line" data-on={!slide.reveal || step >= i}>
                  {r.map((c, j) => <td key={j} className={cn('py-4 pr-8 align-top text-[28px] leading-snug', j === 0 && 'font-medium', j > 0 && 'text-ink-muted')}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'code':
      return (
        <div className="flex h-full flex-col p-24">
          <Title>{slide.title}</Title>
          <pre className={cn('mt-12 whitespace-pre-wrap border p-10 font-mono text-[28px] leading-[1.55]', slide.lang === 'prompt' ? 'border-clay bg-paper-raised' : 'border-line bg-paper-raised')}>
            {slide.lang === 'prompt' && <span className="mb-4 block font-sans text-[18px] uppercase tracking-[0.14em] text-clay">Prompt</span>}
            {slide.code}
          </pre>
          {slide.caption && <p className="mt-8 text-[28px] text-ink-muted">{slide.caption}</p>}
        </div>
      )
    case 'vase':
      return (
        <div className="grid h-full grid-cols-[0.9fr_1.3fr]">
          <div className="flex flex-col p-24 pr-10">
            <Title>{slide.title}</Title>
            {slide.caption && <p className="mt-8 text-[28px] leading-snug text-ink-muted">{slide.caption}</p>}
            <ol className="mt-auto grid gap-2">
              {slide.designs.map((d, i) => (
                <li key={d.label} className={cn('flex items-center gap-4 text-[28px] transition-colors', i === step ? 'text-clay' : 'text-ink-muted')}>
                  <span className={cn('size-3 rounded-full', i === step ? 'bg-clay' : 'bg-line')} /> {d.label}
                </li>
              ))}
            </ol>
          </div>
          <LiveVase presetDesigns={slide.designs} step={step} exporting={exporting} />
        </div>
      )
    case 'images':
      return (
        <div className="flex h-full flex-col p-24">
          <Title>{slide.title}</Title>
          <div className="mt-10 grid flex-1 grid-cols-2 gap-10">
            {slide.images.map((im) => (
              <figure key={im.src} className="flex min-h-0 flex-col">
                <img src={`${import.meta.env.BASE_URL}${im.src}`} alt={im.label} className="min-h-0 flex-1 border border-line object-cover object-left-top" />
                <figcaption className="mt-3 font-mono text-[22px] text-ink-muted">{im.label}</figcaption>
              </figure>
            ))}
          </div>
          {slide.caption && <p className="mt-6 text-[24px] text-ink-muted">{slide.caption}</p>}
        </div>
      )
  }
}

/** A real 3D vase on the slide — built by the same code as the configurator. */
function LiveVase({ presetDesigns, step, exporting }: { presetDesigns: { label: string; design?: Design }[]; step: number; exporting: boolean }) {
  const dark = usePrefersDark()
  const design = presetDesigns[Math.min(step, presetDesigns.length - 1)]?.design ?? TITLE_DESIGN
  const mesh = useMemo(() => buildDesign(design, 'full', design.start === 'carve' ? { radial: 140, vertical: 100 } : { radial: 200, vertical: 140 }), [design])
  return (
    <div className="h-full border-l border-line" data-export="vase">
      <VaseViewer mesh={mesh} height={mesh.stats.height} look={{ ...finishLook(design.finish), metalness: 0 }} stage={dark && !exporting ? '#26221E' : '#EAE5DB'} description={`3D view: ${design.name}`} />
    </div>
  )
}

const TITLE_DESIGN = getPreset('tulip')
