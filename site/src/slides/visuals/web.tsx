import { cn } from '@/lib/utils'
import { Arrow, Box, Reveal } from './common'

type V = { step: number }

// ---------------------------------------------------------------------------
export function WebRequest({ step }: V) {
  return (
    <div className="grid h-full grid-cols-[1fr_1.2fr_1fr] items-center gap-6">
      <div className="border-2 border-ink">
        <div className="flex items-center gap-2 border-b border-ink px-4 py-2">
          <span className="size-3 rounded-full bg-line" /><span className="size-3 rounded-full bg-line" /><span className="size-3 rounded-full bg-line" />
          <span className="ml-3 font-mono text-[18px] text-ink-muted">vessel…/configure</span>
        </div>
        <div className="grid h-80 place-items-center p-6 text-center">
          <Reveal step={step} at={2}>
            <p className="font-display text-[44px] leading-none">Vessel</p>
            <p className="mt-2 text-[20px] text-ink-muted">page drawn</p>
          </Reveal>
          <Reveal step={step} at={3}>
            <p className="font-mono text-[20px] text-clay">JS rebuilds the vase on your laptop</p>
          </Reveal>
        </div>
        <p className="border-t border-ink px-4 py-2 text-[22px] font-medium">Your browser</p>
      </div>
      <div className="grid gap-6">
        <div className="flex items-center gap-3"><span className="text-[28px]">“give me /configure”</span><span className="flex-1 border-t-2 border-dashed border-clay" /><Arrow /></div>
        <Reveal step={step} at={1}>
          <div className="flex items-center gap-3"><Arrow className="rotate-180" /><span className="flex-1 border-t-2 border-clay" />
            <span className="flex gap-2">
              {['HTML', 'CSS', 'JS'].map((f) => <span key={f} className="border border-clay bg-paper-raised px-3 py-1 font-mono text-[22px]">{f}</span>)}
            </span>
          </div>
        </Reveal>
      </div>
      <Box title="A server" sub="a computer somewhere that only hands over files — a “static site”" />
    </div>
  )
}

// ---------------------------------------------------------------------------
const COMMITS = [
  ['Scaffold', 'stage-01'], ['Algorithm', 'stage-02'], ['Viewer', 'stage-03'], ['Printability', 'stage-04'],
  ['Exports', 'stage-05'], ['Craft', 'stage-06'], ['Shipped', 'stage-07'], ['Ways to start', 'stage-08'],
]
export function RepoTimeline({ step }: V) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="relative mt-10">
        <div className="absolute left-0 right-0 top-[18px] h-[2px] bg-ink" />
        <div className="relative grid grid-cols-8">
          {COMMITS.map(([c, tag], i) => (
            <Reveal key={tag} step={step} at={Math.min(i, 3)}>
              <div className="flex flex-col items-center text-center">
                <span className={cn('size-9 rounded-full border-2 border-ink bg-paper', i === COMMITS.length - 1 && 'border-clay bg-clay')} />
                <span className="mt-4 text-[22px] font-medium">{c}</span>
                <span className="mt-1 font-mono text-[17px] text-clay">{tag}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal step={step} at={4}>
        <div className="mt-16 grid grid-cols-4 gap-6 text-[22px]">
          {[['Commit', 'a saved snapshot with a message'], ['Tag', 'a name on a commit: stage-03-viewer'], ['Branch', 'a parallel line to experiment on'], ['Push / pull', 'send to / get from GitHub']].map(([k, d]) => (
            <p key={k}><span className="font-medium">{k}</span> <span className="text-ink-muted">— {d}</span></p>
          ))}
        </div>
        <p className="mt-8 text-[26px]">Like numbered drawing revisions: you can always go back to rev C.</p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
const STACK = [
  ['Language', 'TypeScript', 'JavaScript with checks: a height must be a number'],
  ['UI framework', 'React', 'pages built from components that update when data changes'],
  ['Styling', 'Tailwind CSS', 'style with short class names: bg-paper text-ink'],
  ['Components', 'shadcn/ui · Radix', 'accessible sliders, tabs, buttons — copied in, restyled'],
  ['3D', 'React Three Fiber · three.js', 'draws on the graphics card (WebGL)'],
  ['Build tool', 'Vite', 'turns source into files a browser downloads'],
  ['CAD export', 'rhino3dm', 'Rhino’s own geometry library, in the browser'],
]
export function StackLayers({ step }: V) {
  return (
    <ol className="grid h-full content-center gap-2">
      {STACK.map(([layer, choice, what], i) => (
        <Reveal key={layer} step={step} at={i}>
          <li className="grid grid-cols-[13rem_20rem_1fr] items-baseline gap-6 border-b border-line py-2.5">
            <span className="section-label !text-[17px]">{layer}</span>
            <span className="text-[30px] font-medium text-clay">{choice}</span>
            <span className="text-[22px] text-ink-muted">{what}</span>
          </li>
        </Reveal>
      ))}
    </ol>
  )
}

// ---------------------------------------------------------------------------
export function FirstLoop({ step }: V) {
  const items = [['Ask', '“How should I think about a vase configurator?”'], ['Act', '“Build step 1 of the plan, then stop.”'], ['Check', 'look at it in the browser · ask what changed'], ['Note it', '“Add what we did to PROGRESS.md.”']]
  return (
    <div className="grid h-full grid-cols-4 items-center gap-6">
      {items.map(([k, d], i) => (
        <Reveal key={k} step={step} at={i}>
          <div className="relative flex h-[320px] flex-col border border-ink/70 p-8">
            <p className="font-display text-[80px] leading-none text-clay">{k}</p>
            <p className="mt-6 text-[30px] leading-snug">{d}</p>
            {i < 3 && <Arrow className="absolute -right-6 top-1/2 -translate-y-1/2" />}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
export function TypeSystem() {
  return (
    <div className="grid h-full grid-cols-3 items-center gap-10">
      <div><p className="section-label !text-[17px]">Display · big moments only</p><p className="mt-4 font-display text-[150px] leading-none">Amphora</p></div>
      <div><p className="section-label !text-[17px]">Sans · the interface</p><p className="mt-4 text-[54px] font-medium leading-tight">Belly diameter</p><p className="text-[32px] text-ink-muted">Width at the widest point.</p></div>
      <div><p className="section-label !text-[17px]">Mono · every number</p><p className="mt-4 font-mono text-[76px] tabular-nums leading-tight">130 mm<br />60°<br />159 g</p></div>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function Breakpoints({ step }: V) {
  return (
    <div className="flex h-full items-end justify-center gap-14">
      <Reveal step={step} at={0}>
        <div className="flex h-[560px] w-[280px] flex-col border-[3px] border-ink p-2">
          <div className="h-1/2 bg-line/70" /><div className="mt-2 grid flex-1 gap-1">{[1, 2, 3, 4].map((k) => <div key={k} className="bg-line/40" />)}</div>
        </div>
        <p className="mt-3 text-center text-[22px]">Phone · stacked</p>
      </Reveal>
      <Reveal step={step} at={1}>
        <div className="flex h-[520px] w-[400px] flex-col border-[3px] border-ink p-2">
          <div className="h-[55%] bg-line/70" /><div className="mt-2 grid flex-1 grid-cols-2 gap-1">{[1, 2, 3, 4].map((k) => <div key={k} className="bg-line/40" />)}</div>
        </div>
        <p className="mt-3 text-center text-[22px]">Tablet · <span className="font-mono">md:</span></p>
      </Reveal>
      <Reveal step={step} at={2}>
        <div className="flex h-[440px] w-[700px] gap-2 border-[3px] border-ink p-2">
          <div className="flex-[2] bg-line/70" /><div className="grid flex-1 gap-1">{[1, 2, 3, 4, 5].map((k) => <div key={k} className="bg-line/40" />)}</div>
        </div>
        <p className="mt-3 text-center text-[22px]">Laptop · <span className="font-mono">lg:</span> object left, controls right</p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function SlopVsDesigned({ step }: V) {
  return (
    <div className="grid h-full grid-cols-2 gap-12">
      <div className="flex flex-col">
        <div className="flex-1 overflow-hidden rounded-2xl p-8 text-center text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
          <p className="text-[18px] opacity-80">✨ AI-powered ✨</p>
          <p className="mt-3 text-[46px] font-bold leading-tight">Unlock Your Creativity With Smart Vases</p>
          <p className="mt-3 text-[20px] opacity-80">The future of design is here. Trusted by 10,000+ creators.</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {['🚀 Fast', '🎨 Creative', '🔒 Secure'].map((x) => <div key={x} className="rounded-xl bg-white/15 p-3 text-[18px] backdrop-blur">{x}</div>)}
          </div>
        </div>
        <p className="mt-3 text-[22px] text-ink-muted">Unchosen: gradient, emoji, three cards, invented claims.</p>
      </div>
      <Reveal step={step} at={1} className="flex flex-col">
        <div className="flex flex-1 border border-line bg-paper">
          <div className="flex flex-1 flex-col justify-between p-8">
            <p className="section-label !text-[14px]">A workshop demo · Prompt to Print</p>
            <p className="font-display text-[64px] leading-[0.95]">Design a vessel. Check it. Print it.</p>
            <span className="w-fit bg-ink px-5 py-2.5 text-[18px] text-paper">Open the configurator →</span>
          </div>
          <div className="w-[38%] bg-[#EAE5DB]">
            <svg viewBox="0 0 100 160" className="h-full w-full"><path d="M38 140 C25 110 22 70 30 40 C32 30 28 22 26 18 H74 C72 22 68 30 70 40 C78 70 75 110 62 140 Z" className="fill-clay" /></svg>
          </div>
        </div>
        <p className="mt-3 text-[22px] text-ink-muted">Chosen: one idea, one accent, real content, the object first.</p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function TestLevels({ step }: V) {
  const levels = [
    ['Human', 'Give it to a classmate. Don’t explain. Watch.', 'w-[34%]'],
    ['Browser tests · Playwright', 'Open the site, pick clay, see the warning, download — on desktop and phone', 'w-[64%]'],
    ['Unit tests · Vitest', 'Every start is watertight · a 2 mm wall fails in clay · the STL is z-up', 'w-full'],
  ]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      {levels.map(([t, d, w], i) => (
        <Reveal key={t} step={step} at={2 - i} className={cn(w)}>
          <div className={cn('border-2 px-8 py-7 text-center', i === 2 ? 'border-clay bg-paper-raised' : 'border-ink/70')}>
            <p className="text-[34px] font-medium">{t}</p>
            <p className="mt-1 text-[25px] text-ink-muted">{d}</p>
          </div>
        </Reveal>
      ))}
      <p className="mt-4 text-[22px] text-ink-muted">Many fast automatic checks at the bottom, a few slow human ones at the top.</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function DeployFlow({ step }: V) {
  const items = [['git push', 'to main'], ['GitHub Action', 'install · test · build'], ['GitHub Pages', 'hosts site/dist'], ['A public link', 'elenichas.github.io/ucl-workshop']]
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-4">
      {items.map(([t, s], i) => (
        <div key={t} className="contents">
          <Reveal step={step} at={i}><Box title={t} sub={s} active={step === i} className="h-64" /></Reveal>
          {i < items.length - 1 && <Reveal step={step} at={i + 1}><Arrow /></Reveal>}
        </div>
      ))}
      <Reveal step={step} at={2} className="col-span-7 mt-10">
        <p className="text-center text-[32px]">If a test fails, the Action stops — <span className="text-clay">nothing broken gets published.</span></p>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
/** The localhost joke — and what localhost actually means. */
export function Localhost({ step }: V) {
  return (
    <div className="grid h-full grid-cols-[1fr_1.1fr] items-center gap-16">
      <div className="mx-auto w-full max-w-[560px] border-2 border-ink bg-paper-raised p-6">
        <p className="section-label !text-[15px]">Group chat · design studio</p>
        <div className="mt-5 grid gap-4">
          <div className="ml-auto max-w-[85%] bg-ink px-5 py-3 text-[26px] leading-snug text-paper">
            Look at my vase configurator!!
            <span className="mt-1 block font-mono text-[22px] underline">http://localhost:5173</span>
          </div>
          <Reveal step={step} at={1}>
            <div className="max-w-[85%] border border-line bg-paper px-5 py-3 text-[26px] leading-snug">
              “This site can’t be reached.”
              <span className="mt-1 block text-[20px] text-ink-muted">— everyone else in the chat</span>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="grid gap-7">
        <Reveal step={step} at={2}>
          <p className="font-display text-[64px] leading-none">There’s no place like <span className="font-mono text-[52px] text-clay">127.0.0.1</span></p>
        </Reveal>
        <Reveal step={step} at={3}>
          <ul className="grid gap-4 text-[28px] leading-snug">
            <li><span className="font-mono text-clay">localhost</span> means <strong>this computer</strong>. The link works only on your laptop, only while the dev server runs.</li>
            <li>Perfect for designing and testing — nobody else can see it.</li>
            <li className="text-ink-muted">Next step, another day: <em>build</em> the site and put it on a host — then you get a link you can share.</li>
          </ul>
        </Reveal>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
const BUILD_STEPS = [
  ['Plan', 'PLAN.md'], ['Algorithm', 'numbers → mesh'], ['3D view', 'see it'], ['Printability', 'rules'],
  ['Exports', 'files out'], ['Craft', 'make it good'], ['More ways to start', 'shapes, sketch, image…'],
]
/** The build order, one prompt per step — and a way to keep track that needs no Git. */
export function BuildSteps({ step }: V) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="relative">
        <div className="absolute left-0 right-0 top-[18px] h-[2px] bg-ink" />
        <div className="relative grid grid-cols-7">
          {BUILD_STEPS.map(([t, s], i) => (
            <Reveal key={t} step={step} at={Math.min(i, 3)}>
              <div className="flex flex-col items-center px-2 text-center">
                <span className={cn('size-9 rounded-full border-2 border-ink bg-paper', i === step && step < 4 && 'border-clay bg-clay')} />
                <span className="mt-4 text-[26px] font-medium leading-tight">{t}</span>
                <span className="mt-1 text-[19px] text-ink-muted">{s}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal step={step} at={4}>
        <div className="mt-16 grid grid-cols-3 gap-6">
          {[
            ['One prompt per step', 'small, clear, checkable'],
            ['Check before moving on', 'look at it · ask Claude to explain what changed'],
            ['Keep a log', 'the chat itself, or ask Claude to keep a PROGRESS.md: what you asked, what changed, what you decided'],
          ].map(([t, d]) => (
            <div key={t} className="border-l-2 border-clay pl-5">
              <p className="text-[28px] font-medium">{t}</p>
              <p className="mt-1 text-[22px] leading-snug text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------------------
/** Accessibility basics: contrast, text size, no mouse. */
export function A11yBasics({ step }: V) {
  return (
    <div className="grid h-full grid-cols-[1fr_1fr] items-center gap-16">
      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-line bg-paper-raised p-5">
            <p className="text-[30px] font-medium" style={{ color: '#1C1A17' }}>Easy to read</p>
            <p className="mt-2 font-mono text-[20px] text-ok">contrast 15 : 1 ✓</p>
          </div>
          <div className="border border-line bg-paper-raised p-5">
            <p className="text-[30px] font-medium" style={{ color: '#CFC8BC' }}>Hard to read</p>
            <p className="mt-2 font-mono text-[20px] text-fail">contrast 1.5 : 1 ✗</p>
          </div>
        </div>
        <Reveal step={step} at={1}>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-line bg-paper-raised p-5">
              <p className="text-[18px] leading-snug">Body text at 16 px or more is comfortable.</p>
              <p className="mt-2 font-mono text-[20px] text-ok">16 px ✓</p>
            </div>
            <div className="border border-line bg-paper-raised p-5">
              <p className="text-[10px] leading-snug">Tiny text looks elegant on your screen and disappears on everyone else’s.</p>
              <p className="mt-2 font-mono text-[20px] text-fail">10 px ✗</p>
            </div>
          </div>
        </Reveal>
        <Reveal step={step} at={2}>
          <div className="flex items-center gap-3 border border-line bg-paper-raised p-5">
            {['Tab', 'Tab', '→', '→', 'Enter'].map((k, i) => <span key={i} className="border-2 border-ink px-3 py-1 font-mono text-[22px]">{k}</span>)}
            <span className="ml-3 text-[22px] text-ink-muted">can I use it without a mouse?</span>
          </div>
        </Reveal>
      </div>
      <div className="grid gap-5 text-[28px] leading-snug">
        <p><span className="text-clay">Contrast:</span> text must stand out from its background — the WCAG guidelines ask for at least 4.5 : 1.</p>
        <Reveal step={step} at={1}><p><span className="text-clay">Size:</span> no tiny text. Body around 16 px or more.</p></Reveal>
        <Reveal step={step} at={2}><p><span className="text-clay">Keyboard:</span> every button and slider reachable without a mouse. (Full accessibility goes further — e.g. screen readers.)</p></Reveal>
        <Reveal step={step} at={3}>
          <p className="text-ink-muted">Libraries like shadcn/ui get you most of the way. Then ask: <span className="font-mono text-[22px] text-ink">“Check my site for contrast, text size and keyboard use. List problems before fixing.”</span></p>
        </Reveal>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
/** Three ways a website gets tested. */
export function TestWays({ step }: V) {
  const ways = [
    ['You', 'Try it like a visitor — then report back in plain words:', '“I moved the height slider and nothing happens. Let’s fix it.”'],
    ['The agent, in a browser', 'It opens your site, clicks and drags, takes screenshots and looks at them.', '“Open the site, try every slider, tell me what breaks.”'],
    ['The agent, with automatic tests', 'Small checks it writes once and re-runs after every change — your choice whether you want them.', '“Every vase must be closed.” “A 2 mm wall fails in clay.”'],
  ]
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid grid-cols-3 items-stretch gap-6">
        {ways.map(([t, d, e], i) => (
          <Reveal key={t} step={step} at={i} className="h-full">
            <div className={cn('flex h-full min-h-[420px] flex-col border p-8', i === 0 ? 'border-clay bg-paper-raised' : 'border-ink/70')}>
              <p className="font-mono text-[24px] text-clay">{i + 1}{i === 2 && <span className="ml-3 text-ink-muted">· optional</span>}</p>
              <p className="mt-3 font-display text-[46px] leading-[1.05]">{t}</p>
              <p className="mt-5 text-[25px] leading-snug">{d}</p>
              <div className="min-h-6 flex-1" />
              <p className="border-l-2 border-clay pl-4 text-[23px] italic leading-snug text-ink-muted">{e}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
/** From localhost to a link anyone can open. */
export function Hosting({ step }: V) {
  const hosts = [
    ['Vercel', 'popular with React sites; a link for every change'],
    ['Netlify', 'drag in a folder, get a link'],
    ['GitHub Pages', 'free, lives next to your code on GitHub'],
    ['Cloudflare Pages', 'fast, generous free plan'],
    ['A Claude artifact', 'Claude builds it and gives you a claude.ai link — private until you share it. How this course’s demo was previewed.'],
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-12">
      <div className="flex items-center gap-5 text-[30px]">
        <span className="border-2 border-ink px-5 py-3 font-mono">localhost</span>
        <Arrow />
        <span className="border border-ink/70 px-5 py-3">build the site</span>
        <Arrow />
        <span className="border border-ink/70 px-5 py-3">put it on a host</span>
        <Arrow />
        <span className="border-2 border-clay bg-paper-raised px-5 py-3 text-clay">a link anyone can open</span>
      </div>
      <Reveal step={step} at={1}>
        <div className="grid grid-cols-5 gap-4">
          {hosts.map(([n, d], i) => (
            <div key={n} className={cn('border p-6', i === hosts.length - 1 ? 'border-clay bg-paper-raised' : 'border-ink/70')}>
              <p className="text-[30px] font-medium leading-tight">{n}</p>
              <p className="mt-2 text-[22px] leading-snug text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal step={step} at={2}>
        <p className="text-[28px]">Not today — but it’s one prompt away: <span className="font-mono text-[24px] text-clay">“Help me publish this site so I can share a link.”</span></p>
      </Reveal>
    </div>
  )
}
