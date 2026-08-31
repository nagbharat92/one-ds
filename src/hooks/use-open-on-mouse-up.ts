import * as React from "react"

function isOpen(el: HTMLElement) {
  return (
    el.getAttribute("aria-expanded") === "true" ||
    el.getAttribute("data-state") === "open"
  )
}

/**
 * Radix overlay triggers (dropdown menu, select, menubar) open on pointer-down.
 * This defers opening to pointer-up so the overlay opens on release (mouse up),
 * matching the click semantics used everywhere else in the library. Closing an
 * already-open trigger is left to Radix so re-clicks dismiss it as expected.
 */
export function useOpenOnMouseUp<T extends HTMLElement>(
  onPointerDown?: React.PointerEventHandler<T>,
  onPointerUp?: React.PointerEventHandler<T>
) {
  const bypassRef = React.useRef(false)
  const pendingOpenRef = React.useRef(false)

  return {
    onPointerDown: (event: React.PointerEvent<T>) => {
      onPointerDown?.(event)
      if (event.defaultPrevented || bypassRef.current) return
      // When already open, let Radix handle the dismiss on pointer-down.
      if (isOpen(event.currentTarget)) return
      // Otherwise block the open-on-pointer-down for a primary, unmodified press.
      if (event.button === 0 && !event.ctrlKey) {
        pendingOpenRef.current = true
        event.preventDefault()
      }
    },
    onPointerUp: (event: React.PointerEvent<T>) => {
      onPointerUp?.(event)
      if (event.button !== 0 || event.ctrlKey) return
      if (!pendingOpenRef.current) return
      pendingOpenRef.current = false
      // Replay the pointer-down on release so Radix opens the overlay now.
      const target = event.currentTarget
      bypassRef.current = true
      target.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerType: "mouse",
        })
      )
      bypassRef.current = false
    },
  }
}
