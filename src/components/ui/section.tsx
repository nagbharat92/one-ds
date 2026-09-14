import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { resolveHang, type HangOffset } from "@/lib/hang"

const sectionVariants = cva(
  "flex w-full scroll-mt-(--section-scroll-margin) flex-col",
  {
    variants: {
      gap: {
        none: "gap-(--space-none)",
        xs: "gap-(--space-xs)",
        sm: "gap-(--space-sm)",
        md: "gap-(--space-md)",
        lg: "gap-(--space-lg)",
        xl: "gap-(--space-xl)",
        "2xl": "gap-(--space-2xl)",
      },
    },
    defaultVariants: {
      gap: "lg",
    },
  }
)

function Section({
  className,
  gap,
  asChild = false,
  ...props
}: React.ComponentProps<"section"> &
  VariantProps<typeof sectionVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "section"

  return (
    <Comp
      data-slot="section"
      className={cn(sectionVariants({ gap }), className)}
      {...props}
    />
  )
}

function SectionHeader({
  className,
  divider = false,
  ...props
}: React.ComponentProps<"div"> & { divider?: boolean }) {
  return (
    <div
      data-slot="section-header"
      data-divider={divider ? "" : undefined}
      className={cn(
        "flex flex-col gap-(--section-header-gap) sm:flex-row sm:items-start sm:justify-between sm:gap-(--section-header-gap-sm)",
        divider && "border-b border-(--separator-stroke) pb-(--space-md)",
        className
      )}
      {...props}
    />
  )
}

function SectionEyebrow({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      data-slot="section-eyebrow"
      className={cn(
        "flex items-center gap-(--section-eyebrow-gap) text-xs font-medium text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SectionHeading({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-heading"
      className={cn("flex min-w-0 flex-col gap-(--section-heading-gap)", className)}
      {...props}
    />
  )
}

function SectionTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "h2"

  return (
    <Comp
      data-slot="section-title"
      className={cn(
        "text-(length:--text-heading-size) leading-(--text-heading-leading) font-semibold text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SectionDescription({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      data-slot="section-description"
      className={cn(
        "max-w-2xl text-(length:--text-body-size) leading-(--text-body-leading) text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function SectionActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-actions"
      className={cn(
        "flex shrink-0 flex-wrap items-center gap-(--section-actions-gap)",
        className
      )}
      {...props}
    />
  )
}

function SectionContent({
  className,
  hang = true,
  style,
  ...props
}: React.ComponentProps<"div"> & { hang?: HangOffset }) {
  const { dataHang, hangStyle, isHanging } = resolveHang(hang)
  return (
    <div
      data-slot="section-content"
      data-hang={dataHang}
      style={{ ...hangStyle, ...style }}
      className={cn("min-w-0", isHanging && "section-content--hang", className)}
      {...props}
    />
  )
}

export {
  Section,
  SectionHeader,
  SectionEyebrow,
  SectionHeading,
  SectionTitle,
  SectionDescription,
  SectionActions,
  SectionContent,
  sectionVariants,
}
