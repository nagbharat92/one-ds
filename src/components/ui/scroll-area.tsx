import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useScrollerRef, type ScrollerAxis } from "@/hooks/use-scroller"

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  axis?: ScrollerAxis
  fade?: "both" | "start" | "end" | "none"
  fadeSize?: "sm" | "default" | "lg"
}

function ScrollArea({
  className,
  children,
  axis = "y",
  fade = "both",
  fadeSize = "sm",
  ...props
}: ScrollAreaProps) {
  const setViewportRef = useScrollerRef<HTMLDivElement>({ axis })

  const fadeClass = React.useMemo(() => {
    if (fade === "none") return ""
    const sizeClass =
      fadeSize === "sm" ? "scroll-fade-6" : fadeSize === "lg" ? "scroll-fade-16" : ""
    if (axis === "x") {
      const dirClass =
        fade === "start" ? "scroll-fade-s" : fade === "end" ? "scroll-fade-e" : "scroll-fade-x"
      return cn(dirClass, sizeClass)
    }
    const dirClass =
      fade === "start" ? "scroll-fade-t" : fade === "end" ? "scroll-fade-b" : "scroll-fade-y"
    return cn(dirClass, sizeClass)
  }, [axis, fade, fadeSize])

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        "relative overflow-hidden rounded-(--scroll-area-radius)",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={setViewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
          fadeClass
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation={axis === "x" ? "horizontal" : "vertical"} />
      <ScrollAreaPrimitive.Corner className="bg-transparent" />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/scrollbar flex touch-none rounded-full p-(--scroll-area-track-padding) transition-[padding,background-color] duration-(--scroll-area-speed) ease-(--scroll-area-ease) select-none hover:bg-(--scroll-area-track-hover) hover:p-(--scroll-area-track-active-padding)",
        "data-horizontal:h-(--scroll-area-track-size) data-horizontal:w-full data-horizontal:flex-col data-horizontal:items-center data-horizontal:px-(--space-xs)",
        "data-vertical:h-full data-vertical:w-(--scroll-area-track-size) data-vertical:justify-center data-vertical:py-(--space-xs)",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full bg-(--scroll-area-thumb-rest) transition-all duration-(--scroll-area-speed) ease-(--scroll-area-ease)",
          "hover:bg-(--scroll-area-thumb-hover) group-hover/scrollbar:bg-(--scroll-area-thumb-hover)",
          "active:bg-(--scroll-area-thumb-active) group-active/scrollbar:bg-(--scroll-area-thumb-active)"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
export type { ScrollAreaProps }
