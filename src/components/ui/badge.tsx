import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Shared chip geometry so Badge and Kbd read as one system: same box, radius,
// and text scale. Kbd imports this and adds only its own surface treatment.
const badgeBaseClass =
  "inline-flex h-5 w-fit min-w-5 shrink-0 items-center justify-center gap-(--space-2xs) rounded-sm px-(--space-2xs) text-xs font-medium whitespace-nowrap select-none [&_svg:not([class*='size-'])]:size-3"

const badgeVariants = cva(
  `${badgeBaseClass} group/badge overflow-hidden border border-transparent transition-all focus-visible:ring-[3px] focus-visible:ring-ring aria-invalid:ring-[3px] aria-invalid:ring-destructive [&>[data-slot=favicon]]:pointer-events-none [&>[data-slot=favicon]]:size-3!`,
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
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants, badgeBaseClass }
