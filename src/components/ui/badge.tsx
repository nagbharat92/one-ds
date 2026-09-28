import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { withIconLabels } from "@/components/ui/icon-label"
import { cn } from "@/lib/utils"

const badgeBaseClass =
  "inline-flex h-(--badge-height) w-fit min-w-(--badge-height) shrink-0 items-center justify-center gap-(--badge-gap) rounded-(--badge-radius) px-(--badge-padding-inline) text-(length:--badge-font-size) leading-(--badge-line-height) font-medium whitespace-nowrap select-none [&_svg:not([class*='size-'])]:size-(--badge-graphic-size)"

const badgeVariants = cva(
  `${badgeBaseClass} group/badge overflow-hidden border border-transparent focus-visible:ring-[3px] focus-visible:ring-ring aria-invalid:ring-[3px] aria-invalid:ring-destructive [&>[data-slot=favicon]]:pointer-events-none [&>[data-slot=favicon]]:size-(--badge-graphic-size)! [&>[data-slot=spinner]]:size-(--badge-graphic-size)!`,
  {
    variants: {
      variant: {
        default: "bg-(--tertiary-fill) text-(--tertiary-ink)",
        tertiary: "bg-(--tertiary-fill) text-(--tertiary-ink)",
        primary: "bg-(--button-primary-fill) text-(--button-primary-ink)",
        secondary: "bg-(--button-secondary-fill) text-(--button-secondary-ink)",
        destructive:
          "bg-destructive/10 text-(--button-destructive-ink) focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
        white:
          "bg-(--badge-white-fill) text-(--badge-white-ink) ring-1 ring-(--elevation-stroke) shadow-(--elevation-flat)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

// Same tertiary/primary/secondary/destructive tokens Button uses, computed once
// on .button-motion; only badges that are actually clickable (asChild or
// onClick) opt into the class, so a plain status label never fakes affordance.
const badgeInteractiveVariants: Record<BadgeVariant, string> = {
  default: "hover:bg-(--button-tertiary-hover) active:bg-(--button-tertiary-pressed)",
  tertiary: "hover:bg-(--button-tertiary-hover) active:bg-(--button-tertiary-pressed)",
  primary:
    "hover:bg-(--button-primary-hover) hover:text-(--button-primary-state-ink) active:bg-(--button-primary-pressed) active:text-(--button-primary-state-ink)",
  secondary: "hover:bg-(--button-secondary-hover) active:bg-(--button-secondary-pressed)",
  destructive: "hover:bg-(--button-destructive-hover) active:bg-(--button-destructive-pressed)",
  white: "hover:bg-(--badge-white-hover) active:bg-(--badge-white-pressed)",
}

function Badge({
  children,
  className,
  variant = "default",
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  const resolvedVariant = variant ?? "default"
  const interactive = asChild || Boolean(onClick)
  const content = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
    ? React.cloneElement(children, undefined, withIconLabels(children.props.children))
    : withIconLabels(children)

  return (
    <Comp
      data-slot="badge"
      data-icon-label-host
      data-variant={variant}
      onClick={onClick}
      className={cn(
        badgeVariants({ variant }),
        interactive && [
          "button-motion cursor-pointer",
          badgeInteractiveVariants[resolvedVariant],
        ],
        className
      )}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Badge, badgeVariants, badgeBaseClass }
