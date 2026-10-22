import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

// shadcn/ui-style button: the code lives in our project, so we restyle it to DESIGN.md.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-clay',
        outline: 'border border-line bg-transparent text-ink hover:border-ink',
        ghost: 'text-ink hover:bg-line/50',
        chip: 'border border-line text-ink-muted hover:text-ink hover:border-ink aria-pressed:border-ink aria-pressed:text-ink aria-pressed:bg-paper-raised',
      },
      size: {
        sm: 'h-8 px-3 rounded-sm',
        md: 'h-10 px-4 rounded-sm',
        lg: 'h-12 px-6 rounded-sm text-base',
        icon: 'size-9 rounded-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
