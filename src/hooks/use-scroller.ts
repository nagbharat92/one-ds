import * as React from "react"

export type ScrollerAxis = "x" | "y"

export type UseScrollerOptions = {
  axis?: ScrollerAxis
  /** rAF-eased wheel scrolling. */
  inertia?: boolean
  /** Allow wheel input at an edge to continue into an ancestor scroller. */
  scrollChain?: boolean
  /** Lower is lazier. */
  strength?: number
  settleDistance?: number
  lineStep?: number
  pageStep?: number
}

// One place to retune the feel of every scroll surface. The edge fades are pure
// CSS (the scroll-fade-* utilities), so this hook only owns the wheel motion.
export const scrollerMotion = {
  /** Fraction of the remaining distance covered per 60fps frame. */
  strength: 0.17,
  // Cut the exponential tail before it crawls the last pixel.
  settleDistance: 1,
  lineStep: 40,
  pageStep: 0.9,
}

// Baseline the easing is expressed against, so a 120Hz display does not ease twice as fast.
const FRAME_MS = 1000 / 60

/** Wheel/trackpad sets a target scroll position; a rAF loop eases toward it. */
export function useScroller(
  ref: React.RefObject<HTMLElement | null>,
  {
    axis = "y",
    inertia = true,
    scrollChain = true,
    strength = scrollerMotion.strength,
    settleDistance = scrollerMotion.settleDistance,
    lineStep = scrollerMotion.lineStep,
    pageStep = scrollerMotion.pageStep,
  }: UseScrollerOptions = {}
) {
  React.useEffect(() => {
    const el = ref.current
    if (!el || !inertia) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const horizontal = axis === "x"
    const position = () => (horizontal ? el.scrollLeft : el.scrollTop)
    const setPosition = (value: number) => {
      if (horizontal) el.scrollLeft = value
      else el.scrollTop = value
    }
    const maxScroll = () =>
      horizontal
        ? el.scrollWidth - el.clientWidth
        : el.scrollHeight - el.clientHeight
    const clamp = (value: number) => Math.max(0, Math.min(value, maxScroll()))

    let target = position()
    let frame = 0
    let running = false
    let lastTime = 0

    const tick = (now: number) => {
      const elapsed = lastTime ? Math.min(now - lastTime, 64) : FRAME_MS
      lastTime = now
      const diff = target - position()
      if (Math.abs(diff) < settleDistance) {
        setPosition(target)
        running = false
        lastTime = 0
        return
      }
      setPosition(position() + diff * (1 - (1 - strength) ** (elapsed / FRAME_MS)))
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      lastTime = 0
      frame = requestAnimationFrame(tick)
    }

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return // pinch-zoom stays native
      if (event.defaultPrevented) return // a nested scroller already claimed it
      // The element can be scrolled by other means (cmdk, keyboard, drag) between
      // wheel events, so measure rather than trust the last target.
      if (!running) target = position()
      // Only claim the axis this surface owns; the other one scrolls the page.
      const delta = horizontal
        ? Math.abs(event.deltaX) >= Math.abs(event.deltaY)
          ? event.deltaX
          : 0
        : Math.abs(event.deltaY) > Math.abs(event.deltaX)
          ? event.deltaY
          : 0
      if (!delta) return
      const viewport = horizontal ? el.clientWidth : el.clientHeight
      const unit =
        event.deltaMode === 1
          ? lineStep
          : event.deltaMode === 2
            ? viewport * pageStep
            : 1
      const next = clamp(target + delta * unit)
      if (next === target) {
        if (!scrollChain) event.preventDefault()
        return
      }
      event.preventDefault()
      target = next
      start()
    }

    // Keep the target in sync when the user scrolls another way (drag, keyboard).
    const onScroll = () => {
      if (!running) target = position()
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("scroll", onScroll)
    }
  }, [ref, axis, inertia, scrollChain, strength, settleDistance, lineStep, pageStep])
}

/**
 * useScroller for components that render the scroll container through a
 * primitive: returns a callback ref to spread, merging any forwarded ref.
 */
export function useScrollerRef<T extends HTMLElement>(
  options?: UseScrollerOptions,
  forwardedRef?: React.Ref<T>
) {
  const ref = React.useRef<T>(null)
  useScroller(ref, options)

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
