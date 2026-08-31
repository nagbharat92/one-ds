"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useScrollerRef, type UseScrollerOptions } from "@/hooks/use-scroller"

const scrollerVariants = cva("min-h-0 overscroll-contain", {
  variants: {
    axis: {
      y: "overflow-x-hidden overflow-y-auto",
      x: "overflow-x-auto overflow-y-hidden",
    },
    fade: {
      both: "",
      start: "",
      end: "",
      none: "",
    },
    // Overrides --scroll-fade-size; unset inherits the token from :root.
    fadeSize: {
      sm: "scroll-fade-6",
      default: "",
      lg: "scroll-fade-16",
    },
    scrollbar: {
      thin: "scrollbar-thin",
      none: "no-scrollbar",
      auto: "",
    },
  },
  compoundVariants: [
    { axis: "y", fade: "both", class: "scroll-fade-y" },
    { axis: "y", fade: "start", class: "scroll-fade-t" },
    { axis: "y", fade: "end", class: "scroll-fade-b" },
    { axis: "x", fade: "both", class: "scroll-fade-x" },
    { axis: "x", fade: "start", class: "scroll-fade-s" },
    { axis: "x", fade: "end", class: "scroll-fade-e" },
  ],
  defaultVariants: {
    axis: "y",
    fade: "both",
    fadeSize: "default",
    scrollbar: "thin",
  },
})

type ScrollerProps = React.ComponentProps<"div"> &
  VariantProps<typeof scrollerVariants> &
  Pick<
    UseScrollerOptions,
    "inertia" | "strength" | "settleDistance" | "lineStep" | "pageStep"
  >

function Scroller({
  className,
  axis = "y",
  fade = "both",
  fadeSize,
  scrollbar,
  inertia = true,
  strength,
  settleDistance,
  lineStep,
  pageStep,
  ref,
  ...props
}: ScrollerProps) {
  const setRef = useScrollerRef<HTMLDivElement>(
    {
      axis: axis ?? "y",
      inertia,
      strength,
      settleDistance,
      lineStep,
      pageStep,
    },
    ref
  )

  return (
    <div
      ref={setRef}
      data-slot="scroller"
      className={cn(
        scrollerVariants({ axis, fade, fadeSize, scrollbar }),
        className
      )}
      {...props}
    />
  )
}

export { Scroller, scrollerVariants }
export type { ScrollerProps }
