import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const pageHeaderVariants = cva("group/page-header flex w-full flex-col", {
  variants: {
    variant: {
      default: "md:flex-row md:items-end md:justify-between",
      centered:
        "items-center overflow-hidden rounded-(--page-banner-radius) bg-white px-(--page-banner-padding-inline) py-(--page-banner-padding-block) text-center ring-1 ring-(--elevation-stroke) shadow-(--elevation-raised)",
    },
    size: {
      default: "gap-(--page-header-gap)",
      hero: "gap-(--page-header-hero-gap) py-(--page-header-hero-padding-block)",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function PageHeader({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageHeaderVariants>) {
  return (
    <div
      data-slot="page-header"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      className={cn(pageHeaderVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function PageHeaderContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-content"
      className={cn(
        "flex min-w-0 flex-col gap-(--page-header-content-gap) in-data-[variant=centered]:w-full in-data-[variant=centered]:items-center in-data-[variant=centered]:text-center",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderEyebrow({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      data-slot="page-header-eyebrow"
      className={cn(
        "flex items-center gap-(--page-header-eyebrow-gap) text-sm font-medium text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h1"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "h1"

  return (
    <Comp
      data-slot="page-header-title"
      className={cn(
        "text-(length:--text-title-size) leading-(--text-title-leading) font-semibold text-balance text-foreground group-data-[size=hero]/page-header:text-(length:--text-display-size) group-data-[size=hero]/page-header:leading-(--text-display-leading)",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      data-slot="page-header-description"
      className={cn(
        "max-w-2xl text-(length:--text-lead-size) leading-(--text-lead-leading) text-pretty text-muted-foreground group-data-[size=hero]/page-header:text-(length:--text-subheading-size) group-data-[size=hero]/page-header:leading-(--text-subheading-leading)",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn(
        "flex shrink-0 flex-wrap items-center gap-(--page-header-actions-gap) in-data-[variant=centered]:w-full in-data-[variant=centered]:justify-center",
        className
      )}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderContent,
  PageHeaderEyebrow,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  pageHeaderVariants,
}
