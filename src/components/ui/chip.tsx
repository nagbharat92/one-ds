import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { XIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "group/chip inline-flex shrink-0 items-center justify-center font-medium select-none cursor-pointer rounded-full border border-transparent transition-all duration-(--speed-swift) ease-(--ease-glide) outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-(--button-secondary-fill) text-(--button-secondary-ink) hover:bg-(--button-selected-secondary-fill)/20",
        secondary:
          "bg-(--button-secondary-fill) text-(--button-secondary-ink) hover:bg-(--button-selected-secondary-fill)/20",
        ghost:
          "bg-transparent text-foreground hover:bg-(--state-layer-hover) active:bg-(--state-layer-pressed) data-[selected=true]:bg-(--button-secondary-fill) data-[selected=true]:text-(--button-secondary-ink)",
        outline:
          "border-(--elevation-stroke) bg-(--surface-lowest) text-foreground shadow-(--elevation-flat) hover:bg-(--state-layer-hover) data-[selected=true]:border-(--button-secondary-ink)/30 data-[selected=true]:bg-(--button-secondary-fill) data-[selected=true]:text-(--button-secondary-ink)",
        primary:
          "bg-(--button-primary-fill) text-(--button-primary-ink) hover:bg-(--button-primary-fill)/90",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
      },
      size: {
        default:
          "h-(--chip-height) gap-(--chip-gap) px-(--chip-padding-inline) text-sm [&_svg]:size-(--chip-icon-size)!",
        sm:
          "h-(--chip-height-sm) gap-(--chip-gap-sm) px-(--chip-padding-inline-sm) text-xs [&_svg]:size-(--chip-icon-size-sm)!",
        xs:
          "h-(--chip-height-xs) gap-(--space-hairline) px-(--space-xs) text-xs [&_svg]:size-(--chip-icon-size-sm)!",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
)

export interface ChipProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof chipVariants> {
  selected?: boolean
  dismissible?: boolean
  onDismiss?: (e: React.MouseEvent) => void
  iconSwapOnHover?: boolean
  asChild?: boolean
}

function Chip({
  className,
  variant = "secondary",
  size = "default",
  selected,
  dismissible = false,
  onDismiss,
  iconSwapOnHover = false,
  asChild = false,
  children,
  type = "button",
  onClick,
  ...props
}: ChipProps) {
  const Comp = asChild ? Slot.Root : "button"
  const isSelected = selected ?? props["aria-pressed"] === true

  return (
    <Comp
      data-slot="chip"
      data-variant={variant}
      data-size={size}
      data-selected={isSelected}
      data-icon-swap={iconSwapOnHover ? "true" : undefined}
      aria-pressed={selected !== undefined ? isSelected : props["aria-pressed"]}
      type={asChild ? undefined : type}
      onClick={(e) => {
        if (dismissible && onDismiss) {
          onDismiss(e)
        }
        onClick?.(e)
      }}
      className={cn(chipVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {dismissible && !iconSwapOnHover ? (
        <span
          data-slot="chip-remove"
          role="button"
          tabIndex={-1}
          aria-label="Remove"
          className="inline-flex size-(--chip-remove-size) shrink-0 items-center justify-center rounded-full hover:bg-foreground/10 active:bg-foreground/20 transition-colors"
        >
          <XIcon className="size-3!" />
        </span>
      ) : null}
    </Comp>
  )
}

function ChipGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chip-group"
      className={cn("flex flex-wrap items-center gap-(--space-xs)", className)}
      {...props}
    />
  )
}

function ChipIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chip-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex size-(--chip-icon-size) shrink-0 items-center justify-center [&_svg]:size-full!",
        className
      )}
      {...props}
    />
  )
}

function ChipLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chip-label"
      className={cn("inline-flex items-center leading-none truncate", className)}
      {...props}
    />
  )
}

export { Chip, ChipGroup, ChipIcon, ChipLabel, chipVariants }
