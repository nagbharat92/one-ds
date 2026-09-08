import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { withIconLabels } from "@/components/ui/icon-label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const buttonVariants = cva(
  "button-motion group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-(--button-primary-fill) text-(--button-primary-ink) hover:bg-(--button-primary-hover) hover:text-(--button-primary-state-ink) active:bg-(--button-primary-pressed) active:text-(--button-primary-state-ink)",
        secondary:
          "bg-(--button-secondary-fill) text-(--button-secondary-ink) hover:bg-(--button-secondary-hover) active:bg-(--button-secondary-pressed) aria-expanded:bg-(--button-secondary-fill) aria-expanded:text-(--button-secondary-ink)",
        ghost:
          "hover:bg-(--state-layer-hover) hover:text-foreground active:bg-(--state-layer-pressed) active:text-foreground aria-expanded:bg-(--state-layer-focus) aria-expanded:text-foreground",
        destructive:
          "bg-(--button-destructive-fill) text-destructive hover:bg-(--button-destructive-hover) active:bg-(--button-destructive-pressed) focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        link: "button-motion-link text-(--button-link-ink) underline-offset-4 hover:underline active:text-(--button-link-ink)/70",
      },
      size: {
        default:
          "h-(--button-height-default) gap-(--button-gap) px-(--button-padding-default) [&_svg:not([class*='size-'])]:size-(--button-icon-default)",
        expressive:
          "button-motion-expressive h-(--button-height-expressive) gap-(--button-gap) rounded-(--button-round-radius) px-(--button-padding-expressive) text-(length:--expressive-body-size) leading-(--expressive-body-leading) [&_svg:not([class*='size-'])]:size-(--button-icon-expressive)",
        icon: "size-(--button-height-default) p-0 [&_svg:not([class*='size-'])]:size-(--button-icon-default)",
        "icon-expressive":
          "button-motion-expressive size-(--button-height-expressive) rounded-(--button-round-radius) p-0 [&_svg:not([class*='size-'])]:size-(--button-icon-expressive)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ICON_ONLY_SIZES = new Set(["icon", "icon-expressive"])
const ButtonAutoTooltipContext = React.createContext(true)

function ButtonTooltipSuppression({ children }: React.PropsWithChildren) {
  return (
    <ButtonAutoTooltipContext.Provider value={false}>
      {children}
    </ButtonAutoTooltipContext.Provider>
  )
}

function Button({
  className,
  children,
  variant = "default",
  size = "default",
  selected,
  asChild = false,
  tooltip,
  tooltipSide = "top",
  title,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    selected?: boolean
    asChild?: boolean
    tooltip?: React.ReactNode
    tooltipSide?: React.ComponentProps<typeof TooltipContent>["side"]
  }) {
  const Comp = asChild ? Slot.Root : "button"
    const automaticTooltip = React.useContext(ButtonAutoTooltipContext)

  // An icon-only button carries its name in aria-label; show it as a tooltip.
  const label =
    tooltip ??
      (automaticTooltip && size && ICON_ONLY_SIZES.has(size)
        ? props["aria-label"]
        : undefined)
  const hasTooltip = Boolean(label) && !props.disabled
  const content = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
    ? React.cloneElement(children, undefined, withIconLabels(children.props.children))
    : withIconLabels(children)

  const button = (
    <Comp
      data-slot="button"
      data-icon-label-host
      data-variant={variant}
      data-selected={selected}
      aria-pressed={selected}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      // Our tooltip replaces the native one, never stacks with it.
      title={hasTooltip ? undefined : title}
      {...props}
    >
      {content}
    </Comp>
  )

  if (!hasTooltip) {
    return button
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function ButtonSelectionIcon({ className, ...props }: React.ComponentProps<typeof Slot.Root>) {
  return (
    <Slot.Root
      data-slot="button-selection-icon"
      aria-hidden="true"
      className={cn("fill-none group-data-[selected=true]/button:fill-current", className)}
      {...props}
    />
  )
}

export { Button, ButtonSelectionIcon, ButtonTooltipSuppression, buttonVariants }
