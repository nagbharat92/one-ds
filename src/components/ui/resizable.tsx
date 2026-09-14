"use client"

import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"
import { DragHandle } from "@/components/ui/drag-handle"

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full overflow-hidden aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  className,
  ...props
}: ResizablePrimitive.PanelProps) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={cn("min-h-0 min-w-0", className)}
      {...props}
    />
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group/resizable-handle relative z-10 flex items-center justify-center outline-none select-none hover:z-20 focus-visible:z-20 active:z-20 data-[separator=hover]:z-20 data-[separator=active]:z-20",
        "bg-transparent from-transparent via-(--resizable-handle-line-rest) to-transparent bg-linear-to-b aria-[orientation=horizontal]:bg-linear-to-r transition-all duration-(--resizable-handle-speed) ease-(--resizable-handle-ease)",
        "hover:via-(--resizable-handle-line-hover) data-[separator=hover]:via-(--resizable-handle-line-hover)",
        "active:via-(--resizable-handle-line-active) data-[separator=active]:via-(--resizable-handle-line-active)",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:via-(--resizable-handle-line-active)",
        "w-(--resizable-handle-thickness) aria-[orientation=vertical]:w-(--resizable-handle-thickness)",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-(--resizable-handle-proximity-size) after:-translate-x-1/2",
        "aria-[orientation=horizontal]:h-(--resizable-handle-thickness) aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-(--resizable-handle-proximity-size) aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2",
        "[&[aria-orientation=horizontal]>[data-slot=drag-handle]]:rotate-90",
        className
      )}
      onPointerDown={(event) => {
        props.onPointerDown?.(event)
        const target = event.currentTarget
        window.addEventListener(
          "pointerup",
          () => {
            target.blur()
          },
          { once: true }
        )
      }}
      {...props}
    >
      {withHandle && (
        <DragHandle
          aria-hidden="true"
          variant="grip"
          orientation="vertical"
          className={cn(
            "pointer-events-none z-10 transition-all duration-(--drag-handle-speed) ease-(--drag-handle-ease)",
            "bg-(--drag-handle-fill-rest)",
            "group-hover/resizable-handle:h-(--drag-handle-active-length) group-hover/resizable-handle:w-(--drag-handle-active-thickness) group-hover/resizable-handle:bg-(--drag-handle-fill-hover) group-hover/resizable-handle:shadow-(--drag-handle-active-shadow)",
            "group-data-[separator=hover]/resizable-handle:h-(--drag-handle-active-length) group-data-[separator=hover]/resizable-handle:w-(--drag-handle-active-thickness) group-data-[separator=hover]/resizable-handle:bg-(--drag-handle-fill-hover) group-data-[separator=hover]/resizable-handle:shadow-(--drag-handle-active-shadow)",
            "group-active/resizable-handle:h-(--drag-handle-active-length) group-active/resizable-handle:w-(--drag-handle-active-thickness) group-active/resizable-handle:bg-(--drag-handle-fill-pressed) group-active/resizable-handle:shadow-(--drag-handle-active-shadow)",
            "group-data-[separator=active]/resizable-handle:h-(--drag-handle-active-length) group-data-[separator=active]/resizable-handle:w-(--drag-handle-active-thickness) group-data-[separator=active]/resizable-handle:bg-(--drag-handle-fill-pressed) group-data-[separator=active]/resizable-handle:shadow-(--drag-handle-active-shadow)",
            "group-focus-visible/resizable-handle:h-(--drag-handle-active-length) group-focus-visible/resizable-handle:w-(--drag-handle-active-thickness) group-focus-visible/resizable-handle:bg-(--drag-handle-fill-pressed) group-focus-visible/resizable-handle:shadow-(--drag-handle-active-shadow)"
          )}
        />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
