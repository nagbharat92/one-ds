"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DragHandle } from "@/components/ui/drag-handle"

// Web-first default: side drawer rather than vaul's bottom sheet.
function Drawer({
  direction = "right",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root data-slot="drawer" direction={direction} {...props} />
  )
}

// Must be rendered inside another Drawer: it scales the parent back as it opens.
function DrawerNested({
  direction = "right",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.NestedRoot>) {
  return (
    <DrawerPrimitive.NestedRoot
      data-slot="drawer-nested"
      direction={direction}
      {...props}
    />
  )
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  showCloseButton = true,
  grabber = "auto",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showCloseButton?: boolean
  /** Dragging is a touch idiom, so `auto` hides the grabber on fine pointers. */
  grabber?: "auto" | "always" | "never"
}) {
  // A media query, not a JS check, so switching input device re-evaluates live.
  const grabberGate = grabber === "auto" ? "pointer-fine:hidden!" : ""

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        data-close-button={showCloseButton}
        className={cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t",
          // Side drawers float inset from the viewport edges, so they round on
          // every corner and hide vaul's edge-bleed pseudo element.
          "data-[vaul-drawer-direction=left]:inset-y-(--drawer-inset) data-[vaul-drawer-direction=left]:left-(--drawer-inset) data-[vaul-drawer-direction=left]:w-(--drawer-width) data-[vaul-drawer-direction=left]:rounded-xl data-[vaul-drawer-direction=left]:border data-[vaul-drawer-direction=left]:[--initial-transform:calc(100%+var(--drawer-inset))] data-[vaul-drawer-direction=left]:after:hidden data-[vaul-drawer-direction=left]:sm:max-w-sm",
          "data-[vaul-drawer-direction=right]:inset-y-(--drawer-inset) data-[vaul-drawer-direction=right]:right-(--drawer-inset) data-[vaul-drawer-direction=right]:w-(--drawer-width) data-[vaul-drawer-direction=right]:rounded-xl data-[vaul-drawer-direction=right]:border data-[vaul-drawer-direction=right]:[--initial-transform:calc(100%+var(--drawer-inset))] data-[vaul-drawer-direction=right]:after:hidden data-[vaul-drawer-direction=right]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        <DragHandle
          aria-hidden="true"
          className={cn(
            "mx-auto mt-4 hidden group-data-[vaul-drawer-direction=bottom]/drawer-content:block group-data-[vaul-drawer-direction=top]/drawer-content:order-last group-data-[vaul-drawer-direction=top]/drawer-content:mt-0 group-data-[vaul-drawer-direction=top]/drawer-content:mb-4 group-data-[vaul-drawer-direction=top]/drawer-content:block",
            grabber === "never" && "hidden!",
            grabberGate
          )}
        />
        <DragHandle
          aria-hidden="true"
          orientation="vertical"
          className={cn(
            "absolute top-1/2 hidden -translate-y-1/2 group-data-[vaul-drawer-direction=left]/drawer-content:right-4 group-data-[vaul-drawer-direction=left]/drawer-content:block group-data-[vaul-drawer-direction=right]/drawer-content:left-4 group-data-[vaul-drawer-direction=right]/drawer-content:block",
            grabber === "never" && "hidden!",
            grabberGate
          )}
        />
        {children}
        {showCloseButton && (
          <DrawerPrimitive.Close data-slot="drawer-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-4 right-4"
              size="icon"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerPrimitive.Close>
        )}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-2 p-4 group-data-[close-button=true]/drawer-content:pe-(--drawer-close-clearance)",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "font-heading text-xl leading-(--button-height-default) font-semibold text-balance text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerNested,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
