import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn('flex border-b border-line', className)} {...props} />
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        '-mb-px flex-1 border-b-2 border-transparent px-2 py-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-accent data-[state=active]:border-accent data-[state=active]:text-ink',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('pt-2 focus-visible:outline-none', className)} {...props} />
}
