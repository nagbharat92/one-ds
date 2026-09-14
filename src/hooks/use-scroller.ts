import * as React from "react"

export type ScrollerAxis = "x" | "y"

// Options are retained so existing call sites keep compiling. Custom rAF wheel
// inertia was removed in favor of native scrolling; the motion-tuning fields are
// accepted but ignored. Edge fades and scrollbars are pure CSS and unaffected.
export type UseScrollerOptions = {
  axis?: ScrollerAxis
  /** Ignored: scrolling is native. */
  inertia?: boolean
  /** Ignored: scrolling is native. */
  scrollChain?: boolean
  /** Ignored: scrolling is native. */
  strength?: number
  /** Ignored: scrolling is native. */
  settleDistance?: number
  /** Ignored: scrolling is native. */
  lineStep?: number
  /** Ignored: scrolling is native. */
  pageStep?: number
}

/** No-op: scroll surfaces use the browser's native scrolling. */
export function useScroller(
  _ref: React.RefObject<HTMLElement | null>,
  _options: UseScrollerOptions = {}
) {}

/**
 * Returns a callback ref to spread on the scroll container, merging any
 * forwarded ref. Scrolling itself is native.
 */
export function useScrollerRef<T extends HTMLElement>(
  _options?: UseScrollerOptions,
  forwardedRef?: React.Ref<T>
) {
  const ref = React.useRef<T>(null)

  return React.useCallback(
    (node: T | null) => {
      ref.current = node
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef)
        (forwardedRef as React.RefObject<T | null>).current = node
    },
    [forwardedRef]
  )
}
