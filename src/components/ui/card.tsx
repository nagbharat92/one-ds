import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { elevationVariants } from "@/components/ui/elevation"
import { resolveHang, type HangOffset } from "@/lib/hang"

function Card({
  className,
  size = "default",
  variant = "default",
  hang = false,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm" | "expressive"
  variant?: "default" | "code"
  hang?: HangOffset
}) {
  const { dataHang, hangStyle, isHanging } = resolveHang(hang)

  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      data-hang={dataHang}
      data-elevation="flat"
      style={{ ...hangStyle, ...style }}
      className={cn(
        "group/card flex flex-col text-sm text-card-foreground",
        elevationVariants({ level: "flat" }),
        variant === "default" &&
          "gap-(--card-region-gap) overflow-hidden rounded-(--card-radius) bg-card py-(--card-spacing) ring-1 ring-(--card-stroke) has-data-[slot=card-footer]:pb-0 has-data-[slot=card-media]:pt-0 has-[>img:first-child]:pt-0 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-(--card-radius) *:[img:last-child]:rounded-b-(--card-radius)",
        variant === "code" &&
          "h-full gap-(--space-none) overflow-hidden rounded-(--card-radius) bg-card bg-clip-padding",
        isHanging && "card--hang",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  divider = false,
  ...props
}: React.ComponentProps<"div"> & { divider?: boolean }) {
  return (
    <div
      data-slot="card-header"
      data-divider={divider ? "" : undefined}
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-(--card-header-gap) px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] has-[>[data-slot=card-header-aside]]:flex has-[>[data-slot=card-header-aside]]:flex-wrap has-[>[data-slot=card-header-aside]]:gap-(--card-header-aside-gap)",
        divider && "border-b pb-(--card-spacing)",
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

function CardAction({
  className,
  responsive = false,
  ...props
}: React.ComponentProps<"div"> & { responsive?: boolean }) {
  return (
    <div
      data-slot="card-action"
      data-responsive={responsive ? "" : undefined}
      className={cn(
        "col-start-2 row-start-1 self-center justify-self-end",
        responsive &&
          "max-sm:col-start-1 max-sm:row-start-2 max-sm:justify-self-start",
        className
      )}
      {...props}
    />
  )
}

function CardContent({
  className,
  edgeToEdge = false,
  grouped = false,
  ...props
}: React.ComponentProps<"div"> & {
  edgeToEdge?: boolean
  grouped?: boolean
}) {
  return (
    <div
      data-slot="card-content"
      data-edge-to-edge={edgeToEdge ? "" : undefined}
      data-grouped={grouped ? "" : undefined}
      className={cn(
        edgeToEdge
          ? "-my-(--card-region-gap) px-(--space-none)"
          : "px-(--card-spacing)",
        grouped && "grid grid-cols-[minmax(0,1fr)] gap-(--card-content-group-gap)",
        className
      )}
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

function CardFooter({
  className,
  layout = "row",
  divider = false,
  ...props
}: React.ComponentProps<"div"> & {
  layout?: "row" | "column" | "responsive"
  divider?: boolean
}) {
  return (
    <div
      data-slot="card-footer"
      data-layout={layout}
      data-divider={divider ? "" : undefined}
      className={cn(
        "flex items-center gap-(--card-footer-gap) bg-card bg-clip-padding px-(--card-spacing) pb-(--card-spacing)",
        divider
          ? "border-t border-(--card-stroke) pt-(--card-spacing)"
          : "pt-(--space-xs)",
        layout === "column" && "flex-col items-stretch",
        layout === "responsive" &&
          "flex-col items-stretch sm:flex-row sm:items-center sm:justify-end",
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
