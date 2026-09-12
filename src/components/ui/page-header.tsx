import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const pageHeaderVariants = cva("flex w-full flex-col gap-(--space-md)", {
  variants: {
    variant: {
      default: "md:flex-row md:items-end md:justify-between",
      centered: "items-center text-center",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function PageHeader({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageHeaderVariants>) {
  return (
    <div
      data-slot="page-header"
      data-variant={variant ?? "default"}
      className={cn(pageHeaderVariants({ variant }), className)}
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
        "flex min-w-0 flex-col gap-(--space-xs) in-data-[variant=centered]:items-center",
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
        "flex items-center gap-(--space-xs) text-sm font-medium text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0",
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
        "text-(length:--text-title-size) leading-(--text-title-leading) font-semibold text-balance text-foreground",
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
        "max-w-2xl text-(length:--text-lead-size) leading-(--text-lead-leading) text-pretty text-muted-foreground",
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
        "flex shrink-0 flex-wrap items-center gap-(--space-xs) in-data-[variant=centered]:justify-center",
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
