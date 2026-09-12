import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const sectionVariants = cva("flex w-full scroll-mt-20 flex-col", {
  variants: {
    gap: {
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    gap: "lg",
  },
})

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

function SectionHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        "flex flex-col gap-(--space-xs) sm:flex-row sm:items-start sm:justify-between sm:gap-(--space-md)",
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
      className={cn("flex min-w-0 flex-col gap-(--space-xs)", className)}
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
      className={cn("max-w-2xl text-(length:--text-body-size) leading-(--text-body-leading) text-pretty text-muted-foreground", className)}
      {...props}
    />
  )
}

function SectionActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-actions"
      className={cn("flex shrink-0 flex-wrap items-center gap-(--space-xs)", className)}
      {...props}
    />
  )
}

function SectionContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-content"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

export {
  Section,
  SectionHeader,
  SectionHeading,
  SectionTitle,
  SectionDescription,
  SectionActions,
  SectionContent,
  sectionVariants,
}
