import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const fabVariants = cva(
  [
    "fab shrink-0 border-transparent transition-[background-color,translate] duration-(--fab-speed) ease-(--fab-ease)",
    // A FAB floats over content, so it must stay OPAQUE in every state. The
    // state layer is therefore mixed INTO the fill rather than laid over it,
    // and it mixes toward the icon colour, which is what M3 specifies.
    "bg-(--fab-fill) text-(--fab-ink) hover:text-(--fab-ink) active:text-(--fab-ink)",
    "hover:bg-(--fab-hover)",
    "active:bg-(--fab-pressed)",
    "aria-expanded:bg-(--fab-focus) aria-expanded:text-(--fab-ink) motion-reduce:transition-none motion-reduce:active:translate-none",
  ],
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        tertiary: "",
        surface: "",
      },
      size: {
        md: "rounded-(--fab-radius-md) [&_svg:not([class*='size-'])]:size-(--fab-icon-size-md)",
        lg: "rounded-(--fab-radius-lg) [&_svg:not([class*='size-'])]:size-(--fab-icon-size-lg)",
      },
      extended: {
        true: "w-auto gap-(--fab-extended-gap) px-(--fab-extended-padding-inline) text-sm font-medium",
        false: "",
      },
      placement: {
        none: "",
        "bottom-end":
          "absolute bottom-(--fab-inset) inset-e-(--fab-inset) z-20 lg:bottom-(--fab-inset-expanded) lg:inset-e-(--fab-inset-expanded)",
        "bottom-start":
          "absolute bottom-(--fab-inset) inset-s-(--fab-inset) z-20 lg:bottom-(--fab-inset-expanded) lg:inset-s-(--fab-inset-expanded)",
        "bottom-center":
          "absolute bottom-(--fab-inset) left-1/2 z-20 -translate-x-1/2 lg:bottom-(--fab-inset-expanded)",
        "top-start":
          "absolute top-(--fab-inset) inset-s-(--fab-inset) z-20 lg:top-(--fab-inset-expanded) lg:inset-s-(--fab-inset-expanded)",
        "top-end":
          "absolute top-(--fab-inset) inset-e-(--fab-inset) z-20 lg:top-(--fab-inset-expanded) lg:inset-e-(--fab-inset-expanded)",
      },
    },
    compoundVariants: [
      { extended: false, size: "md", class: "size-(--fab-size-md)" },
      { extended: false, size: "lg", class: "size-(--fab-size-lg)" },
      { extended: true, size: "md", class: "h-(--fab-size-md)" },
      {
        extended: true,
        size: "lg",
        class: "h-(--fab-size-lg) px-(--fab-radius-lg) text-base",
      },
    ],
    defaultVariants: {
      variant: "tertiary",
      size: "md",
      extended: false,
      placement: "none",
    },
  }
)

function Fab({
  className,
  variant = "tertiary",
  size,
  extended,
  placement,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "selected"> &
  VariantProps<typeof fabVariants>) {
  return (
    <Button
      data-slot="fab"
      data-variant={variant === "surface" ? "tertiary" : variant}
      data-extended={extended ? "true" : undefined}
      // Composes Button for the focus ring, asChild and the aria-label tooltip
      // M3 asks for; ghost/icon are neutral bases that fabVariants overrides.
      variant="ghost"
      size="icon"
      className={cn(
        fabVariants({ variant, size, extended, placement }),
        className
      )}
      {...props}
    />
  )
}

export { Fab, fabVariants }
