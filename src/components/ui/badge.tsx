import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { withIconLabels } from "@/components/ui/icon-label"
import { cn } from "@/lib/utils"

const badgeBaseClass =
  "inline-flex h-(--badge-height) w-fit min-w-(--badge-height) shrink-0 items-center justify-center gap-(--badge-gap) rounded-(--badge-radius) px-(--badge-padding-inline) text-(length:--badge-font-size) leading-(--badge-line-height) font-medium whitespace-nowrap select-none [&_svg:not([class*='size-'])]:size-(--badge-graphic-size)"

const badgeVariants = cva(
  `${badgeBaseClass} group/badge overflow-hidden border border-transparent transition-all focus-visible:ring-[3px] focus-visible:ring-ring aria-invalid:ring-[3px] aria-invalid:ring-destructive [&>[data-slot=favicon]]:pointer-events-none [&>[data-slot=favicon]]:size-(--badge-graphic-size)! [&>[data-slot=spinner]]:size-(--badge-graphic-size)!`,
  {
    variants: {
      variant: {
        default: "bg-(--tertiary-fill) text-(--tertiary-ink) [a]:hover:opacity-90",
        tertiary: "bg-(--tertiary-fill) text-(--tertiary-ink) [a]:hover:opacity-90",
        primary: "bg-(--button-primary-fill) text-(--button-primary-ink) [a]:hover:opacity-90",
        secondary: "bg-(--button-secondary-fill) text-(--button-secondary-ink) [a]:hover:opacity-90",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  children,
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  const content = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
    ? React.cloneElement(children, undefined, withIconLabels(children.props.children))
    : withIconLabels(children)

  return (
    <Comp
      data-slot="badge"
      data-icon-label-host
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Badge, badgeVariants, badgeBaseClass }
