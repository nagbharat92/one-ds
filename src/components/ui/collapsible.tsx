"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronDownIcon } from "@/components/ui/icons"

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      asChild={asChild}
      className={cn(
        "group/collapsible-trigger",
        !asChild &&
          "flex w-full cursor-pointer items-center justify-between gap-(--button-gap) rounded-(--collapsible-radius) border border-transparent px-(--collapsible-padding-x) py-(--collapsible-padding-y) text-left text-base font-semibold outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

// Reusable chunky Material 3 style chevron affordance for a CollapsibleTrigger's
// own group; place it as the trailing child of the trigger's content.
function CollapsibleIndicator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="collapsible-trigger-indicator"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "pointer-events-none ml-auto shrink-0 text-muted-foreground transition-transform duration-(--collapsible-indicator-speed) ease-(--collapsible-indicator-ease) group-hover/collapsible-trigger:bg-(--state-layer-hover) group-hover/collapsible-trigger:text-foreground group-focus-visible/collapsible-trigger:bg-(--state-layer-focus) group-focus-visible/collapsible-trigger:text-foreground group-active/collapsible-trigger:bg-(--state-layer-pressed) group-active/collapsible-trigger:text-foreground group-data-[state=open]/collapsible-trigger:rotate-180",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="shrink-0" />
    </span>
  )
}

function CollapsibleContent({
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & {
  containerClassName?: string
}) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn("overflow-hidden", containerClassName)}
      {...props}
    >
      <div
        data-slot="collapsible-content-inner"
        className={cn("h-(--radix-collapsible-content-height)", className)}
      >
        {children}
      </div>
    </CollapsiblePrimitive.CollapsibleContent>
  )
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleIndicator,
  CollapsibleContent,
}
