"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { XIcon } from "@/components/ui/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverClose({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        data-close-button={showCloseButton}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "group/popover-content relative z-50 flex w-(--popover-width) origin-top flex-col gap-(--popover-gap) overflow-visible rounded-(--popover-radius) has-data-[slot=calendar]:rounded-(--calendar-surface-radius) bg-popover p-(--popover-padding) text-sm text-popover-foreground shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) outline-hidden duration-(--speed-swift) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <PopoverPrimitive.Close data-slot="popover-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-(--popover-padding) right-(--popover-padding) rounded-(--popover-inner-radius)"
              size="icon"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </PopoverPrimitive.Close>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn(
        "flex flex-col gap-(--popover-header-gap) group-data-[close-button=true]/popover-content:pe-(--popover-close-clearance)",
        className
      )}
      {...props}
    />
  )
}

function PopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-footer"
      className={cn(
        "flex items-center justify-end gap-(--space-xs) **:data-[slot=button]:rounded-(--popover-inner-radius)",
        className
      )}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-title"
      className={cn(
        "font-heading text-base font-semibold leading-snug text-foreground",
        className
      )}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-sm text-muted-foreground leading-normal", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
