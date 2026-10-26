import { cn } from '@/lib/utils'
import { Arrow, Box, Reveal } from './common'

type V = { step: number }

// ---------------------------------------------------------------------------
export function Tokens({ step }: V) {
  const tokens = ['Design', ' a', ' param', 'etric', ' vase', ' with', ' 18', ' ribs', '.']
  return (
    <div className="flex h-full flex-col justify-center gap-12">
      <p className="font-display text-[64px] leading-none">“Design a parametric vase with 18 ribs.”</p>
      <Reveal step={step} at={1}>
        <div className="flex flex-wrap gap-2">
          {tokens.map((t, i) => (
            <span key={i} className="border border-clay bg-paper-raised px-3 py-2 font-mono text-[30px]" style={{ transitionDelay: `${i * 60}ms` }}>
              {t.replace(' ', '·')}
            </span>
          ))}
        </div>
        <p className="mt-6 text-[26px] text-ink-muted">9 tokens. The model reads and writes tokens, roughly ¾ of a word each — and you pay per token.</p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function ChatVsAgent({ step }: V) {
  return (
    <div className="grid h-full grid-cols-2 gap-16">
      <div>
        <p className="section-label !text-[18px]">Chat</p>
        <div className="mt-8 flex items-center gap-5">
          <Box title="You" /><Arrow /><Box title="Model" /><Arrow /><Box title="Answer" />
        </div>
        <p className="mt-8 text-[24px] text-ink-muted">It answers. Then it's your turn.</p>
      </div>
      <Reveal step={step} at={1}>
        <p className="section-label !text-[18px]">Agent</p>
        <svg viewBox="0 0 700 420" className="mt-4 w-full">
          <defs>
            <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" className="fill-clay" /></marker>
          </defs>
          <rect x="40" y="40" width="160" height="70" className="fill-none stroke-ink" />
          <text x="120" y="83" textAnchor="middle" className="fill-ink" fontSize="26">You</text>
          <rect x="270" y="40" width="160" height="70" className="fill-paper-raised stroke-clay" strokeWidth="2" />
          <text x="350" y="83" textAnchor="middle" className="fill-clay" fontSize="26">Model</text>
          <path d="M200 75 H265" className="stroke-clay" strokeWidth="2" markerEnd="url(#ah)" />
          <path id="loop" d="M430 75 C600 75 600 330 430 330 H270 C100 330 100 140 270 100" className="fill-none stroke-clay" strokeWidth="2" strokeDasharray="6 6" markerEnd="url(#ah)" />
          <circle r="9" className="fill-clay motion-dot"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#loop" /></animateMotion></circle>
          <rect x="235" y="300" width="230" height="60" className="fill-paper stroke-ink" />
          <text x="350" y="338" textAnchor="middle" className="fill-ink font-mono" fontSize="22">tools: read · edit · run</text>
          <text x="560" y="210" className="fill-ink-muted" fontSize="20">result goes back</text>
          <text x="560" y="235" className="fill-ink-muted" fontSize="20">into the model</text>
        </svg>
        <p className="text-[24px] text-ink-muted">A model in a loop, with tools and a goal. It decides the next step from what just happened.</p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
const LOOP = [
  { k: 'You ask', d: '“Add a twist slider to the vase.”' },
  { k: 'It thinks', d: '“First I need to see how the other sliders are made.”' },
  { k: 'It looks', d: 'Opens and reads files in your project folder' },
  { k: 'It writes', d: 'Writes new code into those files — this is where the code gets written' },
  { k: 'It checks', d: 'Runs the project’s checks to see if anything broke — and fixes it' },
  { k: 'It tells you', d: '“I added a twist slider. Here is what I changed…”' },
]
export function AgentLoop({ step }: V) {
  return (
    <div className="grid h-full grid-cols-[1fr_1.1fr] items-center gap-16">
      <svg viewBox="0 0 520 520" className="mx-auto h-full max-h-[600px] w-full">
        <circle cx="260" cy="260" r="190" className="fill-none stroke-line" strokeWidth="2" />
        <path id="ring" d="M260 70 A190 190 0 1 1 259.9 70" className="fill-none" />
        <circle r="12" className="fill-clay motion-dot"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#ring" /></animateMotion></circle>
        {['Think', 'Act', 'Look', 'Repeat'].map((w, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2
          const x = 260 + Math.cos(a) * 190, y = 260 + Math.sin(a) * 190
          return (
            <g key={w}>
              <circle cx={x} cy={y} r="56" className="fill-paper stroke-ink" strokeWidth="2" />
              <text x={x} y={y + 9} textAnchor="middle" fontSize="26" className="fill-ink">{w}</text>
            </g>
          )
        })}
        <text x="260" y="268" textAnchor="middle" fontSize="30" className="fill-clay font-display">the agent loop</text>
      </svg>
      <ol className="grid gap-3">
        {LOOP.map((l, i) => (
          <Reveal key={i} step={step} at={i}>
            <li className={cn('flex gap-5 border-l-2 py-1 pl-5', step === i ? 'border-clay' : 'border-line')}>
              <span className="w-44 shrink-0 font-mono text-[22px] text-clay">{l.k}</span>
              <span className="text-[24px] leading-snug">{l.d}</span>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

// ---------------------------------------------------------------------------
const CC_STEPS = [
  ['You', '“Add a twist slider to the vase.”'],
  ['It reads', 'your message, your project notes (CLAUDE.md) and the chat so far'],
  ['It decides', 'it needs to look at how the sliders are made'],
  ['It opens a file', 'and reads it'],
  ['It writes code', 'into your project files — you may be asked to approve'],
  ['It checks', 'runs the project’s tests → something broke → fixes it → all fine'],
  ['It answers', 'what changed, and why — ask it to explain in plain words'],
]
export function ClaudeCodeSteps({ step }: V) {
  return (
    <ol className="grid h-full content-center gap-3">
      {CC_STEPS.map(([k, d], i) => (
        <Reveal key={i} step={step} at={i}>
          <li className={cn('grid grid-cols-[3rem_14rem_1fr] items-baseline gap-4 border-b border-line pb-3', step === i && 'text-clay')}>
            <span className="font-mono text-[22px] text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-[28px] font-medium">{k}</span>
            <span className="text-[25px] leading-snug text-ink">{d}</span>
          </li>
        </Reveal>
      ))}
    </ol>
  )
}

// ---------------------------------------------------------------------------
const FILES = [
  ['CLAUDE.md', 'Project rules, read every session', 'stack · folders · “units are mm”'],
  ['PLAN.md', 'What we agreed to build', 'goal · parameters · build order'],
  ['DESIGN.md', 'How it should look', 'tokens · principles · don’ts'],
  ['Skills', 'Know-how loaded when relevant', 'printability-review · design language'],
  ['Connectors', 'Links to other tools (MCP)', 'a browser · Figma · Rhino'],
]
export function KnowledgeFiles({ step }: V) {
  return (
    <div className="grid h-full grid-cols-5 items-stretch gap-5">
      {FILES.map(([t, s, e], i) => (
        <Reveal key={t} step={step} at={i} className="h-full">
          <div className="flex h-full flex-col border border-ink/70 p-5">
            <p className="font-mono text-[28px] text-clay">{t}</p>
            <p className="mt-4 text-[24px] leading-snug">{s}</p>
            <p className="mt-auto pt-6 text-[19px] leading-snug text-ink-muted">{e}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
export function SkillLoading({ step }: V) {
  const skills = ['printability-review', 'vase-design-language', 'frontend-design', 'webapp-testing', 'skill-creator']
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1.2fr] items-center gap-10">
      <div>
        <p className="section-label !text-[18px]">Always in context — a few tokens each</p>
        <ul className="mt-5 grid gap-2">
          {skills.map((s, i) => (
            <li key={s} className={cn('border px-4 py-2 font-mono text-[22px]', step >= 1 && i === 0 ? 'border-clay text-clay' : 'border-line')}>
              {s} <span className="text-ink-muted">· “use when…”</span>
            </li>
          ))}
        </ul>
      </div>
      <Reveal step={step} at={1}><Arrow className="text-[60px]" /></Reveal>
      <Reveal step={step} at={1}>
        <p className="section-label !text-[18px]">Loaded only when your request matches</p>
        <pre className="mt-5 border border-clay bg-paper-raised p-5 font-mono text-[18px] leading-relaxed whitespace-pre-wrap">{`---
name: printability-review
description: Review a vase for printability…
---
# Printability review
1. Read the printer and material profiles
2. For each rule: verdict + numbers + limit
3. Propose the smallest change that fixes it
…`}</pre>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
const CONTEXT = [
  { label: 'System + tool descriptions', w: 10, c: 'bg-ink/80' },
  { label: 'CLAUDE.md', w: 4, c: 'bg-ink/60' },
  { label: 'Conversation so far', w: 22, c: 'bg-clay/70' },
  { label: 'Files Claude has read', w: 34, c: 'bg-clay' },
  { label: 'Command output & logs', w: 22, c: 'bg-warn' },
]
export function ContextWindow({ step }: V) {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="section-label !text-[18px]">The context window — everything the model can see right now</p>
      <div className="mt-6 flex h-28 w-full border-2 border-ink">
        {CONTEXT.map((c, i) => (
          <div key={c.label} className={cn('h-full transition-all duration-700', c.c)} style={{ width: step >= i ? `${c.w}%` : '0%' }} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-5 gap-4">
        {CONTEXT.map((c, i) => (
          <Reveal key={c.label} step={step} at={i}>
            <p className="text-[22px] leading-snug"><span className={cn('mr-2 inline-block size-4 align-middle', c.c)} />{c.label}</p>
          </Reveal>
        ))}
      </div>
      <Reveal step={step} at={5}>
        <p className="mt-10 text-[30px] leading-snug">All of it is <span className="text-clay">sent again on every turn</span>. Long chats get slower, more expensive — and start to forget.</p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function TokenCompare({ step }: V) {
  const a = [30, 70, 120, 180, 260, 350, 450, 560]
  const b = [30, 60, 40, 70, 45, 75, 50, 80]
  const max = 560
  const Bars = ({ data, tone }: { data: number[]; tone: string }) => (
    <div className="flex h-56 items-end gap-2">
      {data.map((v, i) => <div key={i} className={cn('flex-1 transition-all duration-700', tone)} style={{ height: `${(v / max) * 100}%` }} />)}
    </div>
  )
  return (
    <div className="grid h-full grid-cols-2 gap-16">
      <div>
        <p className="text-[30px] font-medium">A · “Build me a vase configurator.”</p>
        <p className="mt-2 text-[22px] text-ink-muted">Guess → build → redo → redo… in one long chat</p>
        <div className="mt-8"><Bars data={a} tone="bg-fail/80" /></div>
        <p className="mt-3 font-mono text-[20px] text-ink-muted">tokens per turn ↑</p>
      </div>
      <Reveal step={step} at={1}>
        <p className="text-[30px] font-medium">B · Interview → PLAN.md → small steps</p>
        <p className="mt-2 text-[22px] text-ink-muted">/clear between tasks, decisions live in files</p>
        <div className="mt-8"><Bars data={b} tone="bg-ok/80" /></div>
        <p className="mt-3 font-mono text-[20px] text-ink-muted">same result · a fraction of the tokens · you understand it</p>
      </Reveal>
    </div>
  )
}
