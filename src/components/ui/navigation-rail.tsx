"use client"

import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function NavigationRail({
  attached = false,
  className,
  ...props
}: React.ComponentProps<"nav"> & { attached?: boolean }) {
  return (
    <nav
      data-slot="navigation-rail"
      data-attached={attached ? "true" : undefined}
      className={cn(
        "flex h-full w-(--navigation-rail-width) shrink-0 flex-col bg-(--navigation-rail-container) text-(--navigation-rail-foreground)",
        attached
          ? "rounded-s-(--navigation-rail-radius) rounded-e-(--navigation-rail-attached-inner-radius) ring-1 ring-(--elevation-stroke) shadow-(--elevation-flat)"
          : "rounded-(--navigation-rail-radius) ring-1 ring-(--elevation-stroke) shadow-(--elevation-flat)",
        className
      )}
      {...props}
    />
  )
}

function NavigationRailList({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<"div">) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[data-slot="navigation-rail-item"]:not([disabled]):not([aria-disabled="true"])'
      )
    )
    if (items.length === 0) return

    const current = items.indexOf(document.activeElement as HTMLElement)
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : event.key === "ArrowDown"
          ? (current + 1 + items.length) % items.length
          : (current - 1 + items.length) % items.length

    event.preventDefault()
    items[next]?.focus()
  }

  return (
    <div
      role="list"
      data-slot="navigation-rail-list"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-(--navigation-rail-item-gap) pt-(--navigation-rail-top-space)",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

function NavigationRailItem({
  selected = false,
  asChild = false,
  className,
  children,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & {
  selected?: boolean
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "button"
  const itemHostRef = React.useRef<HTMLDivElement>(null)
  const mountedRef = React.useRef(false)

  React.useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }

    const indicator = itemHostRef.current?.querySelector<HTMLElement>(
      '[data-slot="navigation-rail-indicator"]'
    )
    if (!indicator) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reducedMotion.matches) return

    const tokens = getComputedStyle(indicator)
    const velocity = Number(
      tokens.getPropertyValue("--navigation-rail-indicator-velocity")
    )
    if (velocity <= 0) return
    const duration = indicator.offsetWidth / 2 / velocity * 1000
    const animation = indicator.animate(
      [
        { scale: selected ? "0 1" : "1 1" },
        { scale: selected ? "1 1" : "0 1" },
      ],
      {
        duration,
        easing: tokens.getPropertyValue("--navigation-rail-indicator-ease").trim(),
      }
    )
    return () => animation.cancel()
  }, [selected])

  return (
    <div
      ref={itemHostRef}
      role="listitem"
      data-slot="navigation-rail-list-item"
    >
      <Comp
        type={asChild ? undefined : type}
        data-slot="navigation-rail-item"
        data-selected={selected ? "true" : "false"}
        aria-current={selected ? "page" : undefined}
        className={cn(
          "group/navigation-rail-item relative flex min-h-(--navigation-rail-item-height) w-full cursor-pointer flex-col items-center justify-start text-(--navigation-rail-item-ink) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    </div>
  )
}

function NavigationRailIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="navigation-rail-icon"
      className={cn(
        "relative flex h-(--navigation-rail-indicator-height) w-(--navigation-rail-indicator-width) shrink-0 items-center justify-center rounded-(--navigation-rail-indicator-radius) transition-colors duration-(--navigation-rail-effects-speed) ease-(--navigation-rail-effects-ease) [&_svg]:size-(--navigation-rail-icon-size)",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="navigation-rail-indicator"
        className="absolute inset-0 rounded-(--navigation-rail-indicator-radius) bg-transparent transition-colors duration-(--navigation-rail-effects-speed) ease-(--navigation-rail-effects-ease)"
      />
      <span
        data-slot="navigation-rail-icon-content"
        className="relative flex size-full items-center justify-center"
      >
        {children}
      </span>
    </span>
  )
}

function NavigationRailLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="navigation-rail-label"
      className={cn(
        "mt-(--navigation-rail-icon-label-gap) max-w-full px-(--navigation-rail-label-padding-inline) text-center text-(length:--navigation-rail-label-size) leading-(--navigation-rail-label-leading) font-medium text-balance transition-colors duration-(--navigation-rail-effects-speed) ease-(--navigation-rail-effects-ease)",
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationRail,
  NavigationRailIcon,
  NavigationRailItem,
  NavigationRailLabel,
  NavigationRailList,
}