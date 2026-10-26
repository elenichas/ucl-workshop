import { Link } from 'react-router-dom'
import { Presentation } from 'lucide-react'
import { CHAPTERS, PARTS } from './course'

export default function CoursePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-20">
      <h1 className="font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">Prompt to Print</h1>
      <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-muted">
        Building a parametric vase configurator with Claude Code. Nineteen short chapters on how AI agents and websites work,
        how to start systematically, and how to build — and judge — a 3D tool step by step.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to="/present" className="flex items-center gap-2 rounded-sm bg-filament px-5 py-3 font-medium text-on-filament hover:bg-ink hover:text-paper">
          <Presentation className="size-4" aria-hidden /> Present the course
        </Link>
        <p className="text-sm text-ink-muted">The slides have live 3D and step-by-step reveals. Press N for speaker notes, or download a PowerPoint from inside the presentation.</p>
      </div>

      <div className="mt-14 grid gap-12">
        {PARTS.map((part) => (
          <section key={part} aria-labelledby={part}>
            <h2 id={part} className="flex items-baseline gap-3 border-b border-ink pb-3 text-lg font-semibold">
              <span className="font-mono text-ink-muted">{part.split(' · ')[0]}</span>
              {part.split(' · ')[1] ?? part}
            </h2>
            <ol>
              {CHAPTERS.filter((c) => c.part === part).map((c) => (
                <li key={c.slug} className="border-b border-line">
                  <Link to={`/course/${c.slug}`} className="group grid grid-cols-[3rem_1fr] gap-x-4 py-5 md:grid-cols-[4rem_minmax(0,20rem)_1fr] md:gap-x-8">
                    <span className="font-mono text-base text-ink-muted">{c.number}</span>
                    <span className="text-2xl font-semibold leading-tight group-hover:underline group-hover:decoration-filament group-hover:decoration-[3px] group-hover:underline-offset-4">
                      {c.title}
                    </span>
                    <span className="col-start-2 mt-2 text-sm leading-relaxed text-ink-muted md:col-start-3 md:mt-1">{c.summary}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
