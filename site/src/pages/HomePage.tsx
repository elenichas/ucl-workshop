import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getPreset } from '@/design/design'
import { buildDesign } from '@/geometry/buildDesign'
import { VaseViewer } from '@/viewer/VaseViewer'
import { usePrefersDark } from '@/state/usePrefersDark'
import { Button } from '@/components/ui/button'

const hero = getPreset('tulip')
const heroMesh = buildDesign(hero, 'full', { radial: 160, vertical: 120 })

const FLOW = [
  { n: '01', title: 'Inputs', body: 'Height, diameters, ribs, twist, ripples. A printer and a material with their own limits.' },
  { n: '02', title: 'Process', body: 'An algorithm turns the numbers into a closed mesh of triangles, then a set of rules checks it.' },
  { n: '03', title: 'Outputs', body: 'A live 3D view, a print report, and files for Rhino or your slicer.' },
]

export default function HomePage() {
  const dark = usePrefersDark()
  return (
    // On large screens the hero and "How it works" share one screen (minus header and footer), no scrolling.
    <div className="mx-auto flex max-w-[1600px] flex-col lg:min-h-[calc(100dvh-3.5rem-var(--footer-h,0px)-1px)]">
      <section className="grid border-b border-line lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-between gap-6 px-4 py-12 md:px-6 md:py-16 lg:border-r lg:border-line lg:py-7 [@media(min-width:1024px)_and_(max-height:800px)]:py-5">
          <div>
            <p className="section-label">A workshop demo · Prompt to Print</p>
            <h1 className="mt-4 max-w-[12ch] font-display text-6xl leading-[0.95] tracking-tight md:text-8xl lg:max-w-[19ch] lg:text-6xl xl:text-7xl [@media(min-width:1024px)_and_(max-height:800px)]:text-5xl">
              Design a vessel. Check it. Print it.
            </h1>
            <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-muted lg:text-base">
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
        <div className="relative h-[56svh] min-h-[360px] lg:h-auto lg:min-h-[320px]">
          <div className="h-full lg:absolute lg:inset-0">
          <VaseViewer
            mesh={heroMesh}
            height={heroMesh.stats.height}
            look={{ color: '#B5532F', roughness: 0.8, metalness: 0, clearcoat: 0.1 }}
            stage={dark ? '#26221E' : '#EAE5DB'}
            description="A terracotta tulip-shaped vase with six twisting ribs, shown in 3D. Drag to rotate."
          />
          </div>
        </div>
      </section>

      <section aria-labelledby="how" className="px-4 py-12 md:px-6 lg:py-4">
        <h2 id="how" className="section-label">How it works</h2>
        <ol className="mt-3 grid border-t border-line md:grid-cols-3">
          {FLOW.map((s) => (
            <li key={s.n} className="border-b border-line py-8 md:border-b-0 lg:py-3 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10">
              <span className="font-mono text-xs text-clay">{s.n}</span>
              <h3 className="mt-1 font-display text-4xl lg:text-2xl">{s.title}</h3>
              <p className="mt-1 max-w-[46ch] leading-relaxed text-ink-muted lg:text-sm">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
