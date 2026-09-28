import * as React from "react"

import { cn } from "@/lib/utils"

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-(--message-gap)", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateAvatarAlignment = () => {
      const avatar = el.querySelector<HTMLElement>('[data-slot="message-avatar"]')
      const bubble = el.querySelector<HTMLElement>('[data-slot="bubble"]')
      if (!avatar) return

      if (!bubble) {
        avatar.style.transform = ""
        return
      }

      // Reset transform to measure natural flex bottom (which is aligned to container bottom)
      avatar.style.transform = "none"
      const elRect = el.getBoundingClientRect()
      const bubbleRect = bubble.getBoundingClientRect()
      const offset = elRect.bottom - bubbleRect.bottom

      if (Math.abs(offset) > 0.5) {
        avatar.style.transform = `translateY(-${offset}px)`
      } else {
        avatar.style.transform = ""
      }
    }

    updateAvatarAlignment()
    const observer = new ResizeObserver(updateAvatarAlignment)
    observer.observe(el)
    return () => observer.disconnect()
    // Re-measure only on mount or when alignment flips; the ResizeObserver already
    // reacts to any subsequent size change, so this must not re-run on every render.
  }, [align])

  return (
    <div
      ref={containerRef}
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-(--message-gap) text-sm data-[align=end]:flex-row-reverse",
        className
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex w-fit min-w-(--message-avatar-size) shrink-0 items-center justify-center self-end",
        className
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-(--space-xs) wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 items-center gap-(--message-header-gap) px-(--space-xs) text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-(--space-none)",
        className
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center gap-(--message-footer-gap) px-(--space-xs) text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-(--space-none) group-data-[align=end]/message:justify-end",
        className
      )}
      {...props}
    />
  )
}

function MessageActions({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "floating" }) {
  return (
    <div
      data-slot="message-actions"
      data-variant={variant}
      className={cn(
        "flex min-w-0 items-center gap-(--message-actions-gap)",
        variant === "floating" &&
          "absolute inset-e-2 bottom-2 z-10 rounded-full border border-(--elevation-stroke) bg-(--surface-lowest)/90 p-(--space-2xs) shadow-(--elevation-floating) backdrop-blur-xs opacity-0 transition-opacity duration-(--speed-swift) group-hover/message:opacity-100 group-focus-within/message:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export {
  MessageGroup,
  Message,
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
}
