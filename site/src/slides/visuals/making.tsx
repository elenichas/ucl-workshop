import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { STARTS } from '@/starts'
import type { StartId } from '@/starts/types'
import { StartIcon } from '@/components/StartPicker'
import { PIPELINE, SHARED_OUTPUTS } from '@/components/SystemMap'
import { newDesign } from '@/design/design'
import { buildDesign } from '@/geometry/buildDesign'
import { runChecks, overall, type Verdict } from '@/checks/printability'
import { getPrinter } from '@/config/printers'
import { getMaterial } from '@/config/materials'
import { Arrow, G, Reveal } from './common'

type V = { step: number }

// ---------------------------------------------------------------------------
export function PlanLoop({ step }: V) {
  const items = [['Idea', ''], ['Conversation', 'interview · map · moodboard'], ['PLAN.md', 'you read, edit, cross out'], ['Approve', '“step 1 only”'], ['Build one step', ''], ['Check', 'look · test'], ['Note it', 'what changed · update the plan']]
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid grid-cols-7 items-stretch gap-3">
        {items.map(([t, s], i) => (
          <Reveal key={t} step={step} at={Math.min(i, 4)} className="h-full">
            <div className={cn('relative flex h-full min-h-[230px] flex-col justify-center border p-5', i === 2 ? 'border-clay bg-paper-raised' : 'border-ink/70')}>
              <p className={cn('text-[27px] font-medium leading-tight', i === 2 && 'font-mono text-clay')}>{t}</p>
              {s && <p className="mt-3 text-[22px] leading-snug text-ink-muted">{s}</p>}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal step={step} at={5}>
        <svg viewBox="0 0 1500 90" className="mt-2 w-full">
          <path d="M1390 5 V55 H660 V10" className="fill-none stroke-clay" strokeWidth="3" strokeDasharray="10 8" />
          <path d="M650 20 L660 5 L670 20" className="fill-none stroke-clay" strokeWidth="3" />
          <text x="1025" y="88" textAnchor="middle" fontSize="30" className="fill-ink-muted">next step — small, checked, noted</text>
        </svg>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
const FIVE = [
  ['Interview me', 'Claude asks, one question at a time', 'unsure where to begin'],
  ['Digital product', 'users · features · must / should / could', 'structured thinkers'],
  ['Experience first', 'mood · references · typography', 'design-led'],
  ['Constraints first', 'printers · materials · limits', 'makers'],
  ['Write it yourself', 'then ask Claude to critique it', 'full control'],
]
export function FiveStarts({ step }: V) {
  return (
    <div className="grid h-full grid-cols-5 items-stretch gap-4">
      {FIVE.map(([t, s, w], i) => (
        <Reveal key={t} step={step} at={i} className="h-full">
          <div className="flex h-full flex-col border border-ink/70 p-6">
            <p className="font-mono text-[22px] text-clay">{i + 1}</p>
            <p className="mt-3 font-display text-[40px] leading-[1.02]">{t}</p>
            <p className="mt-4 text-[21px] leading-snug">{s}</p>
            <p className="mt-auto pt-6 text-[18px] text-ink-muted">suits: {w}</p>
          </div>
        </Reveal>
      ))}
      <p className="col-span-5 mt-2 text-center text-[24px]">Every route ends in a <span className="font-mono text-clay">PLAN.md</span> you approve — with the stack written in it.</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function WaysToStart({ step }: V) {
  return (
    <div className="grid h-full grid-cols-3 content-center gap-x-8 gap-y-5">
      {STARTS.map((s, i) => (
        <Reveal key={s.id} step={step} at={i < 5 ? 0 : i - 4}>
          <div className="flex gap-4 border-b border-line pb-4">
            <StartIcon id={s.id} className="h-16 w-12 shrink-0 text-clay" />
            <div>
              <p className="text-[26px] font-medium leading-tight">{s.name}</p>
              <p className="mt-1 text-[17px] leading-snug text-ink-muted">{s.controls.map((c) => c.label).slice(0, 5).join(' · ')}{s.controls.length > 5 ? ' …' : ''}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
const MAP_ORDER: (StartId | null)[] = [null, 'round', 'sphere', 'box', 'draw', 'carve']
const activeAt = (step: number) => MAP_ORDER[Math.min(step, MAP_ORDER.length - 1)]

/** System map, part 1: every start → the controls it exposes → how it describes the form. */
export function SystemMapVisual({ step }: V) {
  const active = activeAt(step)
  return (
    <div className="grid h-full grid-cols-[16rem_1fr_1fr] content-start gap-x-8 text-[21px] leading-snug">
      {['Start from', 'Controls it exposes', 'How the form is described'].map((h) => (
        <p key={h} className="section-label border-b-2 border-ink pb-2 !text-[16px]">{h}</p>
      ))}
      {STARTS.map((s) => {
        const on = active === null || active === s.id
        const cls = cn('border-b border-line py-[7px] transition-opacity duration-300', !on && 'opacity-25')
        return (
          <div key={s.id} className="contents">
            <p className={cn(cls, 'flex items-center gap-3 font-medium', active === s.id && 'text-clay')}><StartIcon id={s.id} className="h-8 w-6 shrink-0" />{s.name}</p>
            <p className={cn(cls, 'text-ink-muted')}>{s.controls.map((c) => c.label).join(' · ')}{s.usesSection ? ' · + cross-section' : ''}</p>
            <p className={cls}>{s.representation}</p>
          </div>
        )
      })}
    </div>
  )
}

/** System map, part 2: one start's own steps → the shared pipeline → what changes in the results. */
export function SystemMapFlow({ step }: V) {
  const active = activeAt(step + 1) ?? 'round'
  const s = STARTS.find((x) => x.id === active)!
  const isCarve = active === 'carve'
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap gap-2">
        {STARTS.map((x) => (
          <span key={x.id} className={cn('flex items-center gap-2 border px-3 py-1.5 text-[20px] transition-colors', x.id === active ? 'border-clay text-clay' : 'border-line text-ink-muted')}>
            <StartIcon id={x.id} className="h-6 w-5" />{x.name}
          </span>
        ))}
      </div>
      <div className="mt-8 grid flex-1 grid-cols-[1fr_auto_1.25fr_auto_1fr] items-stretch gap-5">
        <div className="border border-clay bg-paper-raised p-6">
          <p className="section-label !text-[16px]">{s.name} · its own steps</p>
          <ol className="mt-4 grid gap-3">{s.steps.map((x) => <li key={x} className="text-[25px] leading-snug">→ {x}</li>)}</ol>
        </div>
        <Arrow className="self-center" />
        <div className="border-2 border-ink p-6">
          <p className="section-label !text-[16px]">Shared pipeline</p>
          <ol className="mt-4 grid gap-2">
            {PIPELINE.map((p, i) => {
              const off = (p.carveOnly && !isCarve) || (p.fieldOnly && isCarve)
              return <li key={p.label} className={cn('flex gap-3 text-[22px] leading-snug transition-opacity duration-300', off && 'opacity-20')}><span className="font-mono text-clay">{i + 1}</span>{p.label}</li>
            })}
          </ol>
        </div>
        <Arrow className="self-center" />
        <div className="border border-ink/70 p-6">
          <p className="section-label !text-[16px]">What changes in the results</p>
          <ul className="mt-4 grid gap-3">{s.results.map((x) => <li key={x} className="text-[25px] leading-snug">{x}</li>)}</ul>
          <p className="section-label mt-8 !text-[16px]">Always</p>
          <p className="mt-2 text-[22px] text-ink-muted">{SHARED_OUTPUTS.join(' · ')}</p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function IPO({ step }: V) {
  const cols = [
    ['Inputs', ['How to start + its controls', 'Surface pattern', 'Wall & floor', 'Colour & finish', 'Printer & material']],
    ['Process', ['Start → a field or a carve', 'Shared pipeline: sample, pattern, wall, stitch, close', 'Measure the mesh', 'Print rules']],
    ['Outputs', ['Live 3D view', 'Print report + estimates', 'STL · OBJ · 3DM']],
  ] as const
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr_auto_1fr] content-center items-center gap-6">
      {cols.map(([t, items], i) => (
        <div key={t} className="contents">
          <Reveal step={step} at={i}>
            <div className={cn('h-[500px] border p-8', i === 1 ? 'border-clay bg-paper-raised' : 'border-ink/70')}>
              <p className="font-display text-[76px] leading-none">{t}</p>
              <ul className="mt-6 grid gap-3">{items.map((x) => <li key={x} className="text-[29px] leading-snug">{x}</li>)}</ul>
            </div>
          </Reveal>
          {i < 2 && <Reveal step={step} at={i + 1}><Arrow className="text-[48px]" /></Reveal>}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
/** Profile → revolve → decorate → wall → close, as five small drawings. */
export function Algorithm({ step }: V) {
  const profile = 'M60 230 C40 190 30 140 60 100 C70 85 66 60 62 40'
  const panels = [
    { t: '1 Profile', s: 'a curve: radius at each height', d: <><line x1="50" y1="20" x2="50" y2="240" className="stroke-ink-muted" strokeDasharray="4 4" /><path d={profile.replace(/(\d+) (\d+)/g, (_m, x, y) => `${Number(x) + 0} ${y}`)} transform="translate(-10 0)" className="fill-none stroke-clay" strokeWidth="4" /></> },
    { t: '2 Revolve', s: 'spin it around the axis', d: <>{[0.2, 0.45, 0.7, 1].map((k) => <ellipse key={k} cx="90" cy={230 - k * 190} rx={k === 0.45 ? 55 : 35 + k * 8} ry="9" className="fill-none stroke-ink-muted" />)}<path d="M55 230 C30 190 25 140 50 100 C58 85 55 60 52 40 M125 230 C150 190 155 140 130 100 C122 85 125 60 128 40" className="fill-none stroke-clay" strokeWidth="4" /></> },
    { t: '3 Decorate', s: 'ribs, twist, patterns push out', d: <><path d="M55 230 C30 190 25 140 50 100 C58 85 55 60 52 40 M125 230 C150 190 155 140 130 100 C122 85 125 60 128 40" className="fill-none stroke-ink-muted" strokeWidth="2" />{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${70 + k * 10} 230 C${50 + k * 14} 170 ${60 + k * 12} 110 ${75 + k * 9} 40`} className="fill-none stroke-clay" strokeWidth="2.5" />)}</> },
    { t: '4 Wall', s: 'move inwards by the thickness', d: <><path d="M55 230 C30 190 25 140 50 100 C58 85 55 60 52 40" className="fill-none stroke-clay" strokeWidth="4" /><path d="M65 222 C42 190 37 140 61 100 C68 85 65 60 62 40" className="fill-none stroke-ink" strokeWidth="2" strokeDasharray="6 4" /><text x="78" y="170" fontSize="16" className="fill-ink-muted">2 mm</text></> },
    { t: '5 Close', s: 'rim · floor · bottom → watertight', d: <><path d="M55 230 C30 190 25 140 50 100 C58 85 55 60 52 40 H62 C65 60 68 85 61 100 C37 140 42 190 65 222 H115 C138 190 143 140 119 100 C112 85 115 60 118 40 H128 C125 60 122 85 130 100 C155 140 150 190 125 230 Z" className="fill-clay/25 stroke-clay" strokeWidth="3" /></> },
  ]
  return (
    <div className="grid h-full grid-cols-5 items-center gap-5">
      {panels.map((p, i) => (
        <Reveal key={p.t} step={step} at={i}>
          <div className={cn('border p-4', step === i ? 'border-clay' : 'border-line')}>
            <svg viewBox="0 0 180 250" className="w-full">{p.d}</svg>
            <p className="mt-3 text-[32px] font-medium">{p.t}</p>
            <p className="text-[23px] leading-snug text-ink-muted">{p.s}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
export function Winding({ step }: V) {
  // A vase wall in section: the same outline twice, with arrows showing which way its surfaces face.
  const wall = 'M70 40 C40 110 30 190 60 260 L60 300 L180 300 L180 260 C210 190 200 110 170 40'
  const arrows = (out: boolean) =>
    [[52, 90, -1], [38, 170, -1], [62, 250, -1], [188, 90, 1], [202, 170, 1], [178, 250, 1], [120, 300, 0]].map(([x, y, dx], i) => {
      const dir = out ? 1 : -1
      const [x2, y2] = dx === 0 ? [x, y + 34 * dir] : [x + dx * 34 * dir, y]
      return <line key={i} x1={x} y1={y} x2={x2} y2={y2} className={out ? 'stroke-ok' : 'stroke-fail'} strokeWidth="4" markerEnd={out ? 'url(#wo)' : 'url(#wi)'} />
    })
  const panel = (out: boolean, label: string, sub: string) => (
    <div>
      <svg viewBox="-10 0 260 350" className="mx-auto h-[330px]">
        <path d={wall} className="fill-paper-raised stroke-ink" strokeWidth="3" />
        {arrows(out)}
      </svg>
      <p className={cn('mt-2 text-center text-[28px] font-medium', out ? 'text-ok' : 'text-fail')}>{label}</p>
      <p className="text-center text-[22px] text-ink-muted">{sub}</p>
    </div>
  )
  return (
    <div className="grid h-full grid-cols-[1.1fr_1fr] items-center gap-14">
      <svg width="0" height="0" className="absolute"><defs>
        <marker id="wo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" className="fill-ok" /></marker>
        <marker id="wi" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" className="fill-fail" /></marker>
      </defs></svg>
      <div className="grid grid-cols-2 gap-6">
        {panel(true, 'Correct', 'surfaces face outwards')}
        <Reveal step={step} at={1}>{panel(false, 'Our first version', 'inside-out')}</Reveal>
      </div>
      <div className="grid gap-6">
        <p className="text-[30px] leading-snug">A 3D model is a skin of tiny triangles, and each one has an <span className="text-clay">outside</span> and an <span className="text-clay">inside</span>.</p>
        <Reveal step={step} at={1}><p className="text-[27px] leading-snug">In our first version the walls were flipped. <strong>On screen it looked perfect.</strong> The printer software saw a broken file.</p></Reveal>
        <Reveal step={step} at={2}><p className="border-l-2 border-clay pl-5 text-[26px] leading-snug">You can’t see this by eye — so ask the agent for checks: <span className="font-mono text-[23px] text-clay">“Is every vase a closed shape? Do its surfaces face outwards?”</span> They caught it in half a second.</p></Reveal>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function CSG({ step }: V) {
  const labels = ['A · the vase (a solid)', 'B · the cutter', 'A − B · subtract', 'A ∩ B · keep the overlap']
  return (
    <div className="grid h-full grid-cols-4 items-center gap-8">
      {labels.map((l, i) => (
        <Reveal key={l} step={step} at={i}>
          <svg viewBox="0 0 200 200" className="w-full">
            <defs>
              <clipPath id={`cb${i}`}><circle cx="125" cy="100" r="45" /></clipPath>
              <mask id={`ma${i}`}><rect width="200" height="200" fill="white" /><circle cx="125" cy="100" r="45" fill="black" /></mask>
            </defs>
            {i === 0 && <rect x="40" y="30" width="110" height="140" className="fill-clay/70" />}
            {i === 1 && <><rect x="40" y="30" width="110" height="140" className="fill-none stroke-ink-muted" strokeDasharray="5 4" /><circle cx="125" cy="100" r="45" className="fill-ink/60" /></>}
            {i === 2 && <rect x="40" y="30" width="110" height="140" className="fill-clay/70" mask={`url(#ma${i})`} />}
            {i === 3 && <rect x="40" y="30" width="110" height="140" className="fill-clay/70" clipPath={`url(#cb${i})`} />}
            {i >= 2 && <circle cx="125" cy="100" r="45" className="fill-none stroke-ink-muted" strokeDasharray="5 4" />}
          </svg>
          <p className="mt-3 text-center text-[30px]">{l}</p>
        </Reveal>
      ))}
      <Reveal step={step} at={3} className="col-span-4"><p className="text-center text-[24px] text-ink-muted">Like BooleanDifference / BooleanIntersection in Rhino — here done on triangles, in the browser.</p></Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function MeshResolution({ step }: V) {
  const counts = [6, 12, 48]
  const n = counts[Math.min(step, 2)]
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const r = 150 + 18 * Math.cos(6 * a)
    return `${300 + Math.cos(a) * r},${220 + Math.sin(a) * r}`
  }).join(' ')
  const smooth = Array.from({ length: 241 }, (_, i) => {
    const a = (i / 240) * Math.PI * 2
    const r = 150 + 18 * Math.cos(6 * a)
    return `${300 + Math.cos(a) * r},${220 + Math.sin(a) * r}`
  }).join(' ')
  return (
    <div className="grid h-full grid-cols-[1fr_1fr] items-center gap-16">
      <svg viewBox="0 0 600 440" className="w-full">
        <polyline points={smooth} className="fill-none stroke-line" strokeWidth="2" strokeDasharray="6 5" />
        <polyline points={pts} className="fill-clay/10 stroke-clay" strokeWidth="3" />
        {pts.split(' ').map((p, i) => { const [x, y] = p.split(',').map(Number); return <circle key={i} cx={x} cy={y} r={n > 24 ? 2.5 : 6} className="fill-ink" /> })}
      </svg>
      <div className="grid gap-5">
        <p className="font-mono text-[64px] text-clay">{n} <span className="text-[30px] text-ink-muted">segments</span></p>
        <p className="text-[34px] leading-snug">Rhino stores the smooth curve (NURBS). The web only draws <strong>triangles</strong> — smoothness is a resolution choice.</p>
        <p className="text-[28px] text-ink-muted">More triangles = smoother and slower. We draft while you drag, refine when you stop.</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
const WORD: Record<Verdict, string> = { pass: '✓', warn: '!', fail: '✗' }
const TONE: Record<Verdict, string> = { pass: 'text-ok', warn: 'text-warn', fail: 'text-fail' }
/** The same vase checked against two printer + material pairs — computed live. */
export function PrintCompare({ step }: V) {
  const design = useMemo(() => newDesign(), [])
  const mesh = useMemo(() => buildDesign(design, 'draft'), [design])
  const pairs = [['fdm-desktop', 'pla', 'Desktop printer · PLA'], ['clay', 'stoneware', 'Clay printer · stoneware']] as const
  return (
    <div className="grid h-full grid-cols-2 gap-14">
      {pairs.map(([p, m, label], i) => {
        const results = runChecks({ design, mesh, printer: getPrinter(p), material: getMaterial(m) })
        const v = overall(results)
        return (
          <Reveal key={p} step={step} at={i}>
            <p className="text-[30px] font-medium">{label}</p>
            <p className={cn('mt-1 text-[24px] font-medium', TONE[v])}>{v === 'pass' ? 'Ready to print' : v === 'warn' ? 'Check the warnings' : 'Will not print as designed'}</p>
            <ul className="mt-5 grid gap-3">
              {results.slice(1, 6).map((r) => (
                <li key={r.id} className="grid grid-cols-[2rem_1fr] gap-2 border-b border-line pb-2">
                  <span className={cn('font-mono text-[26px] leading-none', TONE[r.verdict])}>{WORD[r.verdict]}</span>
                  <span><span className="text-[22px] font-medium">{r.title}</span><br /><span className="text-[18px] leading-snug text-ink-muted">{r.detail}</span></span>
                </li>
              ))}
            </ul>
          </Reveal>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
export function Overhang({ step }: V) {
  const lean = (deg: number, x: number, label: string, tone: string, at: number) => {
    const a = (deg * Math.PI) / 180
    return (
      <G step={step} at={at}>
        <line x1={x} y1="360" x2={x + Math.tan(a) * 260} y2="100" className={tone} strokeWidth="10" strokeLinecap="round" />
        <line x1={x} y1="360" x2={x} y2="100" className="stroke-line" strokeDasharray="6 6" strokeWidth="2" />
        <text x={x + 10} y="400" fontSize="28" className="fill-ink">{label}</text>
      </G>
    )
  }
  return (
    <div className="grid h-full grid-cols-[1.2fr_1fr] items-center gap-12">
      <svg viewBox="0 0 800 430" className="w-full">
        <line x1="20" y1="360" x2="780" y2="360" className="stroke-ink" strokeWidth="3" />
        {lean(0, 80, '0° vertical', 'stroke-ok', 0)}
        {lean(25, 260, '25° clay', 'stroke-warn', 1)}
        {lean(45, 470, '45° PLA', 'stroke-clay', 2)}
      </svg>
      <div className="grid gap-6 text-[32px] leading-snug">
        <p>Each layer sits on the one below. Lean too far and it sags.</p>
        <Reveal step={step} at={1}><p>Soft clay gives up early: <span className="font-mono">~20–25°</span>.</p></Reveal>
        <Reveal step={step} at={2}><p>Plastic cools fast: <span className="font-mono">~45°</span>. A sphere’s lower half is the classic trap.</p></Reveal>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function AxisSwap({ step }: V) {
  const axes = (up: 'y' | 'z', x: number) => (
    <g transform={`translate(${x} 300)`}>
      <line x1="0" y1="0" x2="160" y2="0" className="stroke-fail" strokeWidth="5" /><text x="170" y="10" fontSize="30" className="fill-fail">x</text>
      <line x1="0" y1="0" x2="0" y2="-170" className="stroke-ok" strokeWidth="5" /><text x="-12" y="-182" fontSize="30" className="fill-ok">{up}</text>
      <line x1="0" y1="0" x2="-90" y2="70" className="stroke-[#3b6db3]" strokeWidth="5" /><text x="-120" y="98" fontSize="30" className="fill-[#3b6db3]">{up === 'y' ? 'z' : 'y'}</text>
    </g>
  )
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-10">
      <div><svg viewBox="0 0 400 380" className="w-full">{axes('y', 150)}</svg><p className="text-center text-[26px]">three.js · the web · <strong>Y is up</strong></p></div>
      <Reveal step={step} at={1}><p className="text-center font-mono text-[26px] text-clay">(x, y, z)<br />→<br />(x, −z, y)</p></Reveal>
      <Reveal step={step} at={1}><svg viewBox="0 0 400 380" className="w-full">{axes('z', 150)}</svg><p className="text-center text-[26px]">Rhino · slicers · <strong>Z is up</strong></p></Reveal>
      <Reveal step={step} at={2} className="col-span-3"><p className="text-center text-[24px] text-ink-muted">Forget this and your vase arrives lying on its side. There is a test for it.</p></Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function FabPath({ step }: V) {
  const stages = [
    ['Vessel', 'the configurator', 'You design the vase. Until you download it, it’s just numbers in the browser.'],
    ['STL file', 'the shape', 'The vase’s surface as thousands of tiny triangles, in millimetres. Only the shape — no colour, no layers. Every printer software can open it.'],
    ['Slicer', 'PrusaSlicer, Cura, Bambu Studio…', 'Cuts the shape into thin horizontal layers and plans the nozzle’s path for each one. Here you pick layer height, speed, supports. It saves G-code.'],
    ['Printer', 'the object', 'Reads the G-code line by line — “move here, push out this much material” — and builds the vase layer by layer.'],
  ] as const
  return (
    <div className="grid h-full content-center gap-8">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-4">
        {stages.map(([t, s, d], i) => (
          <div key={t} className="contents">
            {i > 0 && <Reveal step={step} at={i - 1} className="self-center"><Arrow /></Reveal>}
            <Reveal step={step} at={Math.max(0, i - 1)} className="h-full">
              <div className={cn('h-full border p-6', i === 0 ? 'border-clay bg-paper-raised' : 'border-ink/70')}>
                <p className="text-[34px] font-medium">{t}</p>
                <p className="font-mono text-[19px] text-clay">{s}</p>
                <p className="mt-4 text-[22px] leading-snug text-ink-muted">{d}</p>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
      <Reveal step={step} at={3}>
        <p className="text-[25px] leading-snug text-ink-muted"><span className="font-medium text-ink">Want to keep editing?</span> Download a <span className="font-mono">.3dm</span> for Rhino, add a stand or a logo, then export an STL again. <span className="font-medium text-ink">Clay:</span> dry slowly, fire — and expect about 12 % shrinkage.</p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function WhoDoesWhat({ step }: V) {
  const items: [string, 'you' | 'agent'][] = [['Think', 'you'], ['Plan', 'you'], ['Build one step', 'agent'], ['Check', 'you'], ['Keep track', 'you'], ['Learn · update the plan', 'you']]
  return (
    <div className="grid h-full grid-cols-6 items-center gap-4">
      {items.map(([t, who], i) => (
        <Reveal key={t} step={step} at={i === 2 ? 1 : 0}>
          <div className={cn('flex h-80 flex-col justify-between border p-6', who === 'agent' ? 'border-clay bg-paper-raised' : 'border-ink/70')}>
            <p className="text-[36px] font-medium leading-tight">{t}</p>
            <p className={cn('font-mono text-[24px]', who === 'agent' ? 'text-clay' : 'text-ink-muted')}>{who === 'agent' ? 'the agent' : 'you'}</p>
          </div>
        </Reveal>
      ))}
      <Reveal step={step} at={2} className="col-span-6"><p className="mt-8 text-center text-[34px]">The agent was fast at one box. <span className="text-clay">Every other box was ours.</span></p></Reveal>
    </div>
  )
}
