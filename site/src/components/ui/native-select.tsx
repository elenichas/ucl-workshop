import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// A styled native <select>: on phones it opens the system picker, and it is accessible by default.
export function NativeSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-10 w-full appearance-none rounded-sm border border-line bg-paper-raised pl-3 pr-9 text-sm text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-clay',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
    </div>
  )
}
