import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Fades an element in when the presenter reaches step `at`. */
export function Reveal({ step, at, children, className }: { step: number; at: number; children: ReactNode; className?: string }) {
  return (
    <div className={cn('reveal', className)} data-on={step >= at}>
      {children}
    </div>
  )
}

/** Same as Reveal, for SVG groups. */
export function G({ step, at, children, className }: { step: number; at: number; children: ReactNode; className?: string }) {
  return (
    <g className={cn('reveal-svg', className)} data-on={step >= at}>
      {children}
    </g>
  )
}

/** A labelled box used in many diagrams. */
export function Box({ title, sub, active, className, children }: { title: string; sub?: string; active?: boolean; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('flex flex-col justify-center border px-6 py-6 transition-colors duration-300', active ? 'border-accent bg-paper-raised' : 'border-ink/70', className)}>
      <p className={cn('text-[34px] font-medium leading-tight', active && 'text-accent')}>{title}</p>
      {sub && <p className="mt-2 text-[24px] leading-snug text-ink-muted">{sub}</p>}
      {children}
    </div>
  )
}

export const Arrow = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn('font-mono text-[44px] leading-none text-accent', className)}>→</span>
)
