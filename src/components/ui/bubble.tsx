import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-(--bubble-gap)", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-(--bubble-max-width) min-w-0 flex-col gap-(--space-2xs) group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-(--button-primary-fill) *:data-[slot=bubble-content]:text-(--button-primary-ink) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--button-primary-fill)/90",
        secondary:
          "*:data-[slot=bubble-content]:bg-(--button-secondary-fill) *:data-[slot=bubble-content]:text-(--button-secondary-ink) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--button-selected-secondary-fill)/20",
        muted:
          "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--state-layer-hover)",
        tinted:
          "*:data-[slot=bubble-content]:bg-(--surface-container-high) *:data-[slot=bubble-content]:text-foreground *:data-[slot=bubble-content]:border-(--elevation-stroke) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--surface-container-highest)",
        outline:
          "*:data-[slot=bubble-content]:border-(--elevation-stroke) *:data-[slot=bubble-content]:bg-(--surface-lowest) *:data-[slot=bubble-content]:text-foreground *:data-[slot=bubble-content]:shadow-(--elevation-flat) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--state-layer-hover)",
        ghost:
          "w-full *:data-[slot=bubble-content]:w-full border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--state-layer-hover) [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 *:data-[slot=bubble-content]:border-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="bubble-content"
      className={cn(
        "w-fit max-w-full min-w-0 overflow-hidden rounded-(--bubble-radius) border border-transparent px-(--bubble-padding-inline) py-(--bubble-padding-block) text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-(--bubble-reaction-gap) rounded-full border border-(--elevation-stroke) bg-(--surface-lowest) p-(--space-hairline) text-sm shadow-(--elevation-raised) has-[button]:p-(--space-hairline)",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

function BubbleReaction({
  className,
  active = false,
  type = "button",
  children,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      data-slot="bubble-reaction"
      data-active={active}
      type={type}
      aria-pressed={active}
      className={cn(
        "inline-flex h-(--bubble-reaction-height) items-center justify-center gap-(--space-2xs) rounded-full px-(--bubble-reaction-padding-inline) text-xs font-medium cursor-pointer transition-all duration-(--speed-swift) ease-(--ease-glide) active:scale-[0.96] select-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-(--button-secondary-fill) text-(--button-secondary-ink) ring-1 ring-(--button-secondary-ink)/20 shadow-xs"
          : "bg-(--surface-container-high) text-(--surface-muted-ink) hover:bg-(--state-layer-hover) hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export {
  BubbleGroup,
  Bubble,
  BubbleContent,
  BubbleReaction,
  BubbleReactions,
  bubbleReactionsVariants,
  bubbleVariants,
}
