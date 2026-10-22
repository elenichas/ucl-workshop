import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PRESETS } from '@/config/parameters'
import { buildVase } from '@/geometry/buildVase'
import { DRAFT } from '@/geometry/types'
import { VaseViewer } from '@/viewer/VaseViewer'
import { usePrefersDark } from '@/state/usePrefersDark'
import { Button } from '@/components/ui/button'

const hero = PRESETS.find((p) => p.id === 'tulip')!
const heroMesh = buildVase(hero.params, { ...DRAFT, radial: 160, vertical: 120 })

const FLOW = [
  { n: '01', title: 'Inputs', body: 'Height, diameters, ribs, twist, ripples. A printer and a material with their own limits.' },
  { n: '02', title: 'Process', body: 'An algorithm turns the numbers into a closed mesh of triangles, then a set of rules checks it.' },
  { n: '03', title: 'Outputs', body: 'A live 3D view, a print report, and files for Rhino or your slicer.' },
]

export default function HomePage() {
  const dark = usePrefersDark()
  return (
    <div className="mx-auto max-w-[1600px]">
      <section className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-between gap-10 px-4 py-12 md:px-6 md:py-20 lg:border-r lg:border-line">
          <div>
            <p className="section-label">A workshop demo · Prompt to Print</p>
            <h1 className="mt-6 max-w-[12ch] font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">
              Design a vessel. Check it. Print it.
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-muted">
              Vessel is a small web app for shaping 3D-printable vases. It was built with Claude Code, step by step, as the case
              study for a workshop on how websites — and AI agents — actually work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/configure">Open the configurator <ArrowRight aria-hidden /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/course">Read the course</Link>
            </Button>
          </div>
        </div>
        <div className="h-[56svh] min-h-[360px] lg:h-[calc(100dvh-3.5rem)]">
          <VaseViewer
            mesh={heroMesh}
            height={hero.params.height}
            look={{ color: '#B5532F', roughness: 0.8, metalness: 0, clearcoat: 0.1 }}
            stage={dark ? '#26221E' : '#EAE5DB'}
            description="A terracotta tulip-shaped vase with six twisting ribs, shown in 3D. Drag to rotate."
          />
        </div>
      </section>

      <section aria-labelledby="how" className="px-4 py-16 md:px-6">
        <h2 id="how" className="section-label">How it works</h2>
        <ol className="mt-8 grid border-t border-line md:grid-cols-3">
          {FLOW.map((s, i) => (
            <li key={s.n} className="relative border-b border-line py-8 md:border-b-0 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10">
              <span className="font-mono text-xs text-clay">{s.n}</span>
              <h3 className="mt-3 font-display text-4xl">{s.title}</h3>
              <p className="mt-3 max-w-[38ch] leading-relaxed text-ink-muted">{s.body}</p>
              {i < FLOW.length - 1 && <span aria-hidden className="absolute -right-2 top-9 hidden font-mono text-clay md:block">→</span>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
