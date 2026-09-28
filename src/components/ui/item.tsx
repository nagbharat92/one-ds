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
        "group/item-group flex w-full flex-col gap-(--space-md)",
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
  "group/item relative flex w-full flex-wrap items-center gap-(--space-sm) bg-clip-padding text-sm transition-colors duration-(--speed-swift) outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        muted: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  compact = false,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean; compact?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-compact={compact ? "" : undefined}
      className={cn(itemVariants({ variant, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-(--space-xs) [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "",
        image:
          "overflow-hidden [&_img]:size-full [&_img]:object-cover",
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
        "flex min-w-0 flex-1 flex-col gap-(--space-2xs) [&+[data-slot=item-content]]:flex-none",
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
  const textKey = text.join("")

  const textRef = React.useRef<HTMLSpanElement>(null)
  const [truncated, setTruncated] = React.useState(false)

  React.useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => setTruncated(el.scrollWidth > el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [textKey])

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
          ref={textRef}
          data-slot="item-title-text"
          className={cn(
            "min-w-0 overflow-hidden whitespace-nowrap",
            // Only the trailing edge of text that actually overflows fades out;
            // text that fits keeps a hard, fully opaque edge.
            truncated &&
              "mask-[linear-gradient(to_right,black,black_calc(100%-var(--item-title-fade-size)),transparent_100%)]"
          )}
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
        "line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
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

function ItemPrimaryAction({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="item-primary-action"
      className={cn(
        "flex min-w-0 flex-1 cursor-pointer items-center text-start outline-none",
        className
      )}
      {...props}
    />
  )
}

function ItemActionSlot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-action-slot"
      className={cn(
        "flex shrink-0 items-center justify-center",
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
  ItemPrimaryAction,
  ItemActionSlot,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
