import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Radix gives us keyboard support (arrows, Page Up/Down, Home/End) and screen-reader roles for free.
export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root className={cn('relative flex h-6 w-full touch-none select-none items-center', className)} {...props}>
      <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden bg-line">
        <SliderPrimitive.Range className="absolute h-full bg-clay" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={props['aria-label']}
        className="block size-4 rounded-full border-2 border-ink bg-paper-raised transition-transform duration-100 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
      />
    </SliderPrimitive.Root>
  )
}
