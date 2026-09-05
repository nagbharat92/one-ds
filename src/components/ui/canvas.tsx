import * as React from "react"

import { cn } from "@/lib/utils"
import { Toolbar } from "@/components/ui/toolbar"

type CanvasLayout = "center" | "start" | "wide" | "viewport" | "application"
type CanvasBackground = "grid" | "plain"

function Canvas({
  className,
  layout = "center",
  background = "grid",
  annotationSpace = false,
  ...props
}: React.ComponentProps<"div"> & {
  layout?: CanvasLayout
  background?: CanvasBackground
  annotationSpace?: boolean
}) {
  return (
    <div
      data-slot="canvas"
      data-layout={layout}
      data-background={background}
      data-annotation-space={annotationSpace || undefined}
      className={cn(
        "canvas flex flex-col text-sm text-card-foreground has-data-[slot=accordion]:justify-start has-data-[slot=toolbar]:justify-start",
        className
      )}
      {...props}
    />
  )
}

function CanvasWorkbench({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="canvas-workbench"
      className={cn("canvas-workbench", className)}
      {...props}
    />
  )
}

function CanvasToolbar({ className, ...props }: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      data-annotate-avoid
      className={cn("canvas-toolbar", className)}
      {...props}
    />
  )
}

function CanvasContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="canvas-content"
      className={cn("canvas-content", className)}
      {...props}
    />
  )
}

function CanvasFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="canvas-footer"
      data-annotate-avoid
      className={cn("canvas-footer", className)}
      {...props}
    />
  )
}

export { Canvas, CanvasWorkbench, CanvasToolbar, CanvasContent, CanvasFooter }
export type { CanvasLayout, CanvasBackground }