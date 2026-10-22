import { Link } from 'react-router-dom'
import { Presentation } from 'lucide-react'
import { CHAPTERS, PARTS } from './course'

export default function CoursePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-20">
      <p className="section-label">Eleni Chasioti</p>
      <h1 className="mt-5 font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">Prompt to Print</h1>
      <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-muted">
        Building a parametric vase configurator with Claude Code. Nineteen short chapters on how AI agents and websites work,
        how to start systematically, and how to build — and judge — a 3D tool step by step.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to="/present" className="flex items-center gap-2 bg-ink px-5 py-3 font-medium text-paper hover:bg-clay">
          <Presentation className="size-4" aria-hidden /> Present the course
        </Link>
        <p className="text-sm text-ink-muted">Slides with live 3D and step-by-step reveals · download as PowerPoint from inside the presentation · press N for speaker notes</p>
      </div>

      <div className="mt-14 grid gap-12">
        {PARTS.map((part) => (
          <section key={part} aria-labelledby={part}>
            <h2 id={part} className="section-label border-b border-line pb-3">{part}</h2>
            <ol>
              {CHAPTERS.filter((c) => c.part === part).map((c) => (
                <li key={c.slug} className="border-b border-line">
                  <Link to={`/course/${c.slug}`} className="group grid grid-cols-[3rem_1fr] gap-x-4 py-5 md:grid-cols-[4rem_minmax(0,20rem)_1fr] md:gap-x-8">
                    <span className="font-mono text-sm text-clay">{c.number}</span>
                    <span className="font-display text-3xl leading-tight group-hover:underline group-hover:decoration-clay group-hover:decoration-1 group-hover:underline-offset-4">
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
