"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex h-8 min-w-8 cursor-pointer items-center justify-center gap-(--space-2xs) rounded-lg px-(--space-sm) text-sm font-medium whitespace-nowrap text-foreground/70 transition-all outline-none hover:bg-(--state-layer-hover) hover:text-foreground active:bg-(--state-layer-pressed) active:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-[3px] aria-invalid:ring-destructive data-[state=on]:bg-(--button-secondary-fill) data-[state=on]:text-(--button-secondary-ink) data-[state=on]:hover:bg-(--control-hover-fill) data-[state=on]:hover:text-(--button-secondary-ink) has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
)

function Toggle({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants(), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
