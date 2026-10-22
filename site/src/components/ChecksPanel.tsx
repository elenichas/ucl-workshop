import { CircleAlert, CircleCheck, CircleX } from 'lucide-react'
import type { CheckResult, Verdict } from '@/checks/printability'
import { cn } from '@/lib/utils'

const ICON: Record<Verdict, typeof CircleCheck> = { pass: CircleCheck, warn: CircleAlert, fail: CircleX }
const COLOR: Record<Verdict, string> = { pass: 'text-ok', warn: 'text-warn', fail: 'text-fail' }
const WORD: Record<Verdict, string> = { pass: 'Ready to print', warn: 'Printable — check the warnings', fail: 'Will not print as designed' }

/** The printability report. Colour is never the only signal: every verdict has an icon and words. */
export function ChecksPanel({ results, verdict }: { results: CheckResult[]; verdict: Verdict }) {
  const Icon = ICON[verdict]
  return (
    <section aria-labelledby="checks-title">
      <h2 id="checks-title" className="section-label">Print check</h2>
      <p className={cn('mt-3 flex items-center gap-2 font-medium', COLOR[verdict])} role="status" aria-live="polite">
        <Icon className="size-5" aria-hidden />
        {WORD[verdict]}
      </p>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {results.map((r) => {
          const I = ICON[r.verdict]
          return (
            <li key={r.id} className="flex gap-3 py-2.5">
              <I className={cn('mt-0.5 size-4 shrink-0', COLOR[r.verdict])} aria-hidden />
              <div>
                <p className="text-sm font-medium">
                  {r.title}
                  <span className="sr-only"> — {r.verdict}</span>
                </p>
                <p className="text-xs leading-snug text-ink-muted">{r.detail}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
