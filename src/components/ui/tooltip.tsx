"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const TooltipPointerDismissContext = React.createContext<{
  current: boolean
} | null>(null)

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  )
  const dismissedByPointerRef = React.useRef(false)
  const open = openProp ?? uncontrolledOpen
  const isControlled = openProp !== undefined

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && dismissedByPointerRef.current) return
    if (!isControlled) setUncontrolledOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  return (
    <TooltipPointerDismissContext.Provider value={dismissedByPointerRef}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </TooltipPointerDismissContext.Provider>
  )
}

function TooltipTrigger({
  onFocus,
  onPointerDown,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const dismissedByPointerRef = React.useContext(TooltipPointerDismissContext)

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onFocus={(event) => {
        onFocus?.(event)
        if (!event.currentTarget.matches(":focus-visible")) {
          event.preventDefault()
        }
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (dismissedByPointerRef) dismissedByPointerRef.current = true
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        if (dismissedByPointerRef) dismissedByPointerRef.current = false
      }}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      {/* No exit animation: a closing tooltip stays mounted and keeps tracking a
          trigger that may have just moved, which reads as a flash at the new spot. */}
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 inline-flex w-fit max-w-xs origin-top items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow data-slot="tooltip-arrow" className="z-50 size-2.5 rotate-45 rounded-xs bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
