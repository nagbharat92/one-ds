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
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
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
        "group/resizable-handle relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-(--drag-handle-proximity-size) after:-translate-x-1/2 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-(--drag-handle-proximity-size) aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>[data-slot=drag-handle]]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <DragHandle
          aria-hidden="true"
          variant="grip"
          orientation="vertical"
          className="pointer-events-none z-10 transition-all duration-(--drag-handle-speed) ease-(--drag-handle-ease) group-hover/resizable-handle:h-(--drag-handle-active-length) group-hover/resizable-handle:w-(--drag-handle-active-thickness) group-focus-visible/resizable-handle:h-(--drag-handle-active-length) group-focus-visible/resizable-handle:w-(--drag-handle-active-thickness) group-focus-visible/resizable-handle:bg-ring group-focus-visible/resizable-handle:shadow-(--drag-handle-active-shadow) group-active/resizable-handle:h-(--drag-handle-active-length) group-active/resizable-handle:w-(--drag-handle-active-thickness) group-active/resizable-handle:bg-ring group-active/resizable-handle:shadow-(--drag-handle-active-shadow)"
        />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
