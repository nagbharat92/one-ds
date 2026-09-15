import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Shape } from "@/components/ui/shape"

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
        white: "ring-1 ring-(--elevation-stroke) shadow-(--elevation-flat)",
        expressive: "relative bg-transparent hover:bg-transparent active:bg-transparent aria-expanded:bg-transparent",
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
  children,
  variant = "tertiary",
  shape = "cookie6",
  size,
  extended,
  placement,
  asChild,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "selected"> &
  Omit<VariantProps<typeof fabVariants>, "variant" | "extended" | "size"> & (
    | { variant: "expressive"; shape?: "cookie4" | "cookie6" | "cookie7"; size?: "lg"; extended?: false }
    | { variant?: Exclude<VariantProps<typeof fabVariants>["variant"], "expressive">; shape?: never; size?: VariantProps<typeof fabVariants>["size"]; extended?: boolean }
  )) {
  const expressiveContent = (icon: React.ReactNode) => (
    <>
      <Shape name={shape} aria-hidden="true" focusable="false" className="fab__shape absolute inset-0 size-full" />
      <span data-slot="fab-icon" className="relative inline-flex items-center justify-center">{icon}</span>
    </>
  )
  const content = variant !== "expressive" ? children
    : asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? React.cloneElement(children, undefined, expressiveContent(children.props.children))
      : expressiveContent(children)
  return (
    <Button
      data-slot="fab"
      data-variant={variant === "surface" ? "tertiary" : variant}
      data-shape={variant === "expressive" ? shape : undefined}
      data-extended={extended ? "true" : undefined}
      asChild={asChild}
      // Composes Button for the focus ring, asChild and the aria-label tooltip
      // M3 asks for; ghost/icon are neutral bases that fabVariants overrides.
      variant="ghost"
      size="icon"
      className={cn(
        fabVariants({ variant, size: variant === "expressive" ? "lg" : size, extended, placement }),
        className
      )}
      {...props}
    >
      {content}
    </Button>
  )
}

export { Fab, fabVariants }
export type FabVariant = NonNullable<VariantProps<typeof fabVariants>["variant"]>
export type FabSize = NonNullable<VariantProps<typeof fabVariants>["size"]>
