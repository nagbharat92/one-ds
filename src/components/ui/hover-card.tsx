"use client"

import * as React from "react"
import { HoverCard as HoverCardPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function HoverCard({
  openDelay = 100,
  closeDelay = 100,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return (
    <HoverCardPrimitive.Root
      data-slot="hover-card"
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    />
  )
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "group/hover-card-content z-50 flex w-(--hover-card-width) origin-top flex-col gap-(--hover-card-gap) overflow-hidden rounded-(--hover-card-radius) bg-popover p-(--hover-card-padding) text-sm text-popover-foreground shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) outline-hidden duration-(--speed-swift) **:data-[slot=button]:rounded-(--hover-card-inner-radius) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

function HoverCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hover-card-header"
      className={cn("flex flex-col gap-(--hover-card-header-gap)", className)}
      {...props}
    />
  )
}

function HoverCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hover-card-title"
      className={cn(
        "font-heading text-base font-semibold leading-snug text-foreground",
        className
      )}
      {...props}
    />
  )
}

function HoverCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="hover-card-description"
      className={cn("text-sm text-muted-foreground leading-normal", className)}
      {...props}
    />
  )
}

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
}
