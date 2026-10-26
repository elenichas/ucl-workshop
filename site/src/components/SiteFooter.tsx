import { ArrowUpRight, Mail } from 'lucide-react'

const EMAIL = 'eleni.chasioti.19@ucl.ac.uk'
const LINKEDIN = 'https://www.linkedin.com/in/eleni-chasioti-948486194'
const REPO = 'https://github.com/elenichas/ucl-workshop'

/** The same footer on every page (not in the presentation or the notes window). */
export function SiteFooter() {
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent('Prompt to Print workshop')}`
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-display text-xl leading-tight">Eleni Chasioti</p>
          <p className="text-ink-muted">Workshop instructor, Prompt to Print</p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li>
            <a href={mailto} className="flex items-center gap-2 underline decoration-line underline-offset-4 hover:decoration-accent">
              <Mail className="size-4 text-ink-muted" aria-hidden />
              {EMAIL}
            </a>
          </li>
          <li>
            <a href={REPO} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-accent">
              Course on GitHub <ArrowUpRight className="size-4 text-ink-muted" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-accent">
              LinkedIn <ArrowUpRight className="size-4 text-ink-muted" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
