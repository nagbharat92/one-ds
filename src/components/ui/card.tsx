import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  variant?: "default" | "code"
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex flex-col text-sm text-card-foreground",
        variant === "default" &&
          "gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) ring-1 ring-(--elevation-stroke) has-data-[slot=card-footer]:pb-0 has-data-[slot=card-media]:pt-0 has-[>img:first-child]:pt-0 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        variant === "code" &&
          "h-full gap-0 overflow-hidden rounded-xl border bg-card bg-clip-padding",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-(--card-header-gap) rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] has-[>[data-slot=card-header-aside]]:flex has-[>[data-slot=card-header-aside]]:flex-wrap has-[>[data-slot=card-header-aside]]:gap-(--card-header-aside-gap) [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardHeaderContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header-content"
      className={cn(
        "grid min-w-0 grow shrink basis-(--card-header-content-min) gap-(--card-header-gap)",
        className
      )}
      {...props}
    />
  )
}

function CardEyebrow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-eyebrow"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-(--card-header-eyebrow-gap) text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardHeaderAside({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header-aside"
      className={cn(
        "grid flex-none justify-items-end gap-(--card-header-aside-content-gap) text-right",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="card-title"
      className={cn(
        "self-center font-heading text-xl leading-7 font-semibold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="card-description"
      className={cn(
        "col-span-full text-pretty text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-start-1 self-center justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardMedia({
  className,
  ratio = "landscape",
  ...props
}: React.ComponentProps<typeof AspectRatio>) {
  return (
    <AspectRatio
      data-slot="card-media"
      ratio={ratio}
      className={cn(
        "overflow-hidden [&>img]:size-full [&>img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-(--card-footer-gap) rounded-b-xl border-t bg-(--card-footer-fill) bg-clip-padding p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardHeaderContent,
  CardHeaderAside,
  CardFooter,
  CardTitle,
  CardEyebrow,
  CardAction,
  CardDescription,
  CardContent,
  CardMedia,
}
