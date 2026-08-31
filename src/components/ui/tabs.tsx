"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center p-(--tabs-padding) text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent p-0",
      },
      shape: {
        // Concentric: the track's radius is the pill's plus the padding around it.
        default: "rounded-lg",
        pill: "rounded-full",
      },
    },
    compoundVariants: [{ variant: "line", class: "rounded-none" }],
    defaultVariants: {
      variant: "default",
      shape: "default",
    },
  }
)

const tabsIndicatorVariants = cva(
  "pointer-events-none absolute top-0 left-0 h-(--tabs-indicator-h) w-(--tabs-indicator-w) translate-x-(--tabs-indicator-x) translate-y-(--tabs-indicator-y) rounded-md opacity-0 transition-none group-data-ready/tabs-list:opacity-100 group-data-ready/tabs-list:transition-[translate,width,height] group-data-ready/tabs-list:duration-(--tabs-travel-duration) group-data-ready/tabs-list:ease-(--tabs-ease)",
  {
    variants: {
      variant: {
        default:
          "bg-control shadow-sm dark:border dark:border-input dark:bg-input/30",
        line: "after:absolute after:rounded-full after:bg-foreground group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-(--tabs-indicator-thickness) group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:inset-e-0 group-data-vertical/tabs:after:w-(--tabs-indicator-thickness)",
      },
      shape: {
        default: "",
        pill: "rounded-full",
      },
    },
    compoundVariants: [{ variant: "line", class: "rounded-none" }],
    defaultVariants: {
      variant: "default",
      shape: "default",
    },
  }
)

function TabsIndicator({
  variant,
  shape,
}: VariantProps<typeof tabsIndicatorVariants>) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const pivot = React.useRef(-1)

  React.useLayoutEffect(() => {
    const indicator = ref.current
    const list = indicator?.parentElement
    if (!indicator || !list) return

    const measure = () => {
      const triggers = Array.from(
        list.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')
      )
      const next = triggers.findIndex((t) => t.dataset.state === "active")
      const active = triggers[next]
      if (!active) {
        list.removeAttribute("data-ready")
        pivot.current = -1
        return
      }

      // Travel time counts the pivots crossed, so every jump moves at one speed.
      const distance = pivot.current < 0 ? 1 : Math.abs(next - pivot.current)
      pivot.current = next

      const style = indicator.style
      style.setProperty("--tabs-pivot-distance", String(Math.max(distance, 1)))
      style.setProperty("--tabs-indicator-x", `${active.offsetLeft}px`)
      style.setProperty("--tabs-indicator-y", `${active.offsetTop}px`)
      style.setProperty("--tabs-indicator-w", `${active.offsetWidth}px`)
      style.setProperty("--tabs-indicator-h", `${active.offsetHeight}px`)

      // Reveal only once placed, or the pill would fly in from the corner.
      if (!list.hasAttribute("data-ready")) {
        requestAnimationFrame(() => list.setAttribute("data-ready", ""))
      }
    }

    measure()

    const resize = new ResizeObserver(measure)
    resize.observe(list)
    const mutation = new MutationObserver(measure)
    mutation.observe(list, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-state", "disabled"],
    })

    return () => {
      resize.disconnect()
      mutation.disconnect()
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      data-slot="tabs-indicator"
      className={cn(tabsIndicatorVariants({ variant, shape }))}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  shape = "default",
  iconOnly = false,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants> & { iconOnly?: boolean }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-shape={shape}
      data-icon-only={iconOnly || undefined}
      className={cn(tabsListVariants({ variant, shape }), className)}
      {...props}
    >
      <TabsIndicator variant={variant} shape={shape} />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-2 rounded-md border border-transparent px-3 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground active:bg-foreground/5 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:text-foreground dark:data-active:text-foreground",
        // A column track is content-height, so the row states its own. flex-none
        // is required: in a column, flex-1 would zero the basis and eat h-8.
        "[[data-slot=tabs][data-orientation=vertical]_&]:h-8 [[data-slot=tabs][data-orientation=vertical]_&]:flex-none [[data-slot=tabs][data-orientation=vertical]_&]:justify-start",
        "group-data-[shape=pill]/tabs-list:rounded-full",
        // Square icon tabs: the width matches the track height less its padding.
        "[[data-slot=tabs-list][data-icon-only]_&]:w-8 [[data-slot=tabs-list][data-icon-only]_&]:flex-none [[data-slot=tabs-list][data-icon-only]_&]:px-0",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsIndicatorVariants,
}
