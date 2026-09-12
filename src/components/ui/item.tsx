import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-(--space-md) has-data-[size=sm]:gap-(--space-sm) has-data-[size=xs]:gap-(--space-xs)",
        className
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-(--space-xs)", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item relative flex w-full flex-wrap items-center rounded-lg border bg-clip-padding text-sm transition-colors duration-(--speed-swift) outline-none has-data-[hosted=true]:hover:bg-(--state-layer-hover) focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [a]:transition-colors [a]:hover:bg-(--state-layer-hover) [button]:transition-colors [button]:hover:bg-(--state-layer-hover) [button]:active:bg-(--state-layer-pressed)",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-(--item-muted-background)",
      },
      size: {
        default: "gap-(--space-sm) px-(--space-sm) py-(--space-sm)",
        sm: "gap-(--space-sm) px-(--space-sm) py-(--space-sm)",
        xs: "gap-(--space-xs) px-(--space-sm) py-(--space-xs) in-data-[slot=dropdown-menu-content]:p-(--space-none)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-(--space-xs) group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-(--space-2xs) group-data-[size=xs]/item:gap-(--space-none) [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const parts = React.Children.toArray(children)
  const text = parts.filter(
    (part) => typeof part === "string" || typeof part === "number"
  )
  const accessories = parts.filter(
    (part) => typeof part !== "string" && typeof part !== "number"
  )

  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-full min-w-0 items-center gap-(--space-xs) overflow-hidden text-sm leading-snug font-medium underline-offset-4",
        className
      )}
      {...props}
    >
      {text.length > 0 ? (
        <span
          data-slot="item-title-text"
          className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {text}
        </span>
      ) : null}
      {accessories}
    </div>
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({
  className,
  hosted = false,
  ...props
}: React.ComponentProps<"div"> & { hosted?: boolean }) {
  return (
    <div
      data-slot="item-actions"
      data-hosted={hosted}
      className={cn(
        "flex items-center gap-(--space-xs)",
        hosted && "item-actions--hosted",
        className
      )}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-(--space-xs)",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-(--space-xs)",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
