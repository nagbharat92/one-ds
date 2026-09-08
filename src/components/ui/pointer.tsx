import * as React from "react"
import { createPortal } from "react-dom"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

type PointerSize = "compact" | "default" | "large"
type PointerGrowth = "subtle" | "default" | "bold"
type PointerMotion = "snap" | "sprint" | "stretch"
type PointerEasing = "expressive" | "linear" | "ease-in" | "ease-out" | "ease-in-out"
type PointerMotionSettings = { easing: PointerEasing; velocity: number }
type PointerMode = "circle" | "link" | "match" | "native"

const PointerContext = React.createContext<string | null>(null)

function PointerTarget({ mode = "match", ...props }: React.ComponentProps<typeof Slot.Root> & { mode?: PointerMode }) {
  const owner = React.useContext(PointerContext)
  return <Slot.Root data-pointer-owner={owner ?? undefined} data-pointer-mode={mode} {...props} />
}

function Pointer({ enabled = true, capture = true, size = "default", growth = "default", motion = "sprint", inMotion, outMotion, children, className, ...props }:
  React.ComponentProps<"div"> & { enabled?: boolean; capture?: boolean; size?: PointerSize; growth?: PointerGrowth; motion?: PointerMotion; inMotion?: PointerMotionSettings; outMotion?: PointerMotionSettings }) {
  const owner = React.useId()
  const overlayRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay || !enabled) return
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)")
    let position: { x: number; y: number } | null = null
    let hiddenCursor: Element | null = null
    let frame = 0
    let capturedTarget: HTMLElement | null = null
    let currentMode: PointerMode = "circle"
    let animations: Animation[] = []

    const hide = () => {
      cancelAnimationFrame(frame)
      animations.forEach(animation => animation.cancel())
      animations = []
      capturedTarget = null
      currentMode = "circle"
      overlay.dataset.visible = "false"
      hiddenCursor?.removeAttribute("data-pointer-hidden")
      hiddenCursor = null
    }
    const update = () => {
      cancelAnimationFrame(frame)
      if (!position || !media.matches) { hide(); return }
      const hit = document.elementFromPoint(position.x, position.y)
      const scope = hit?.closest("[data-pointer-owner]")
      const native = hit?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-pointer-mode="native"]')
      if (!hit || scope?.getAttribute("data-pointer-owner") !== owner || native) { hide(); return }
      const cursor = getComputedStyle(hit).cursor
      if (/resize|grab|text|crosshair|not-allowed|wait|progress/.test(cursor)) { hide(); return }
      const target = hit.closest<HTMLElement>('[data-pointer-mode="match"], [data-pointer-mode="link"]')
      const cursorHost = target ?? hit
      if (hiddenCursor !== cursorHost) {
        cursorHost.setAttribute("data-pointer-hidden", "")
        hiddenCursor?.removeAttribute("data-pointer-hidden")
        hiddenCursor = cursorHost
      }
      const disabled = target?.matches(':disabled, [aria-disabled="true"], [data-disabled]')
      const matched = capture && target && !disabled && target.dataset.pointerMode === "match"
      const mode = matched ? "match" : target && !disabled ? "link" : "circle"
      const nextTarget = matched ? target : null
      const changingTarget = nextTarget !== capturedTarget || mode !== currentMode
      const currentBounds = changingTarget ? overlay.getBoundingClientRect() : null
      const origin = currentBounds && (capturedTarget || animations.some(animation => animation.playState === "running"))
        ? { x: currentBounds.x + currentBounds.width / 2, y: currentBounds.y + currentBounds.height / 2 }
        : position
      overlay.dataset.mode = mode
      const tokens = getComputedStyle(overlay)
      const corners = ["top-left", "top-right", "bottom-right", "bottom-left"]
      const currentRadii = changingTarget ? corners.map(corner => tokens.getPropertyValue(`border-${corner}-radius`)) : []
      const diameter = parseFloat(tokens.getPropertyValue("--pointer-diameter"))
      const scale = mode === "link" ? parseFloat(tokens.getPropertyValue("--pointer-link-scale")) : 1
      let width = diameter * scale
      let height = width
      let left = position.x
      let top = position.y
      let radii = [width / 2, width / 2, width / 2, width / 2].map(value => `${value}px`)
      if (matched) {
        const rect = target.getBoundingClientRect()
        const style = getComputedStyle(target)
        width = rect.width
        height = rect.height
        left = rect.left + rect.width / 2
        top = rect.top + rect.height / 2
        const contentBox = style.boxSizing === "content-box"
        const boxWidth = parseFloat(style.width) + (contentBox ? parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth) : 0)
        const boxHeight = parseFloat(style.height) + (contentBox ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) : 0)
        const scaleX = rect.width / (boxWidth || rect.width)
        const scaleY = rect.height / (boxHeight || rect.height)
        radii = [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map(radius => {
          const [horizontal, vertical = horizontal] = radius.split(" ")
          const resolve = (value: string, extent: number, factor: number) => value.endsWith("%") ? parseFloat(value) * extent / 100 : parseFloat(value) * factor
          return `${resolve(horizontal, width, scaleX)}px ${resolve(vertical, height, scaleY)}px`
        })
      }
      const wasVisible = overlay.dataset.visible === "true"
      const returning = (capturedTarget !== null && nextTarget === null) || (currentMode === "link" && mode === "circle")
      const settings = returning ? outMotion : inMotion
      const velocity = (role: string) => settings && Number.isFinite(settings.velocity) && settings.velocity > 0
        ? settings.velocity : parseFloat(tokens.getPropertyValue(`--pointer-${role}-velocity`))
      const curve = settings && settings.easing !== "expressive"
        ? tokens.getPropertyValue(`--pointer-easing-${settings.easing}`).trim()
        : tokens.getPropertyValue(returning ? "--pointer-release-curve" : "--pointer-capture-curve").trim()
      overlay.style.setProperty("--pointer-x", `${left}px`)
      overlay.style.setProperty("--pointer-y", `${top}px`)
      overlay.style.setProperty("--pointer-width", `${width}px`)
      overlay.style.setProperty("--pointer-height", `${height}px`)
      for (const [index, corner] of corners.entries()) {
        overlay.style.setProperty(`--pointer-radius-${corner}`, radii[index])
      }
      if (changingTarget && currentBounds) {
        animations.forEach(animation => animation.cancel())
        animations = []
        const startWidth = wasVisible ? currentBounds.width : diameter
        const startHeight = wasVisible ? currentBounds.height : diameter
        const widthDistance = Math.abs(width - startWidth) / 2
        const heightDistance = Math.abs(height - startHeight) / 2
        const captureDuration = matched && settings
          ? Math.hypot(Math.abs(origin.x - left) + widthDistance, Math.abs(origin.y - top) + heightDistance) / velocity("move") * 1000
          : null
        const widthDuration = captureDuration ?? widthDistance / velocity("width") * 1000
        const heightDuration = captureDuration ?? heightDistance / velocity("height") * 1000
        const movementDuration = captureDuration ?? Math.hypot(origin.x - left, origin.y - top) / velocity(returning ? "release" : "move") * 1000
        const animate = (from: Keyframe, to: Keyframe, duration: number) => {
          if (Number.isFinite(duration) && duration > 0) animations.push(overlay.animate([from, to], { duration, easing: curve }))
        }
        animate(
          { transform: `translate(calc(-50% + ${origin.x - left}px), calc(-50% + ${origin.y - top}px))` },
          { transform: "translate(-50%, -50%)" }, movementDuration,
        )
        animate({ width: `${startWidth}px` }, { width: `${width}px` }, widthDuration)
        animate({ height: `${startHeight}px` }, { height: `${height}px` }, heightDuration)
        const startCorners: Keyframe = {}
        const endCorners: Keyframe = {}
        let radiusDistance = 0
        for (const [index, corner] of corners.entries()) {
          const start = wasVisible ? currentRadii[index] : `${diameter / 2}px`
          const property = `border-${corner}-radius`.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())
          startCorners[property] = start
          endCorners[property] = radii[index]
          const [startX, startY = startX] = start.split(" ").map(parseFloat)
          const [endX, endY = endX] = radii[index].split(" ").map(parseFloat)
          radiusDistance = Math.max(radiusDistance, Math.abs(endX - startX), Math.abs(endY - startY))
        }
        animate(startCorners, endCorners, Math.max(widthDuration, heightDuration, radiusDistance / velocity("radius") * 1000))
        capturedTarget = nextTarget
        currentMode = mode
      }
      overlay.dataset.visible = "true"
      if (matched) frame = requestAnimationFrame(update)
    }
    const move = (event: PointerEvent) => {
      position = event.pointerType === "mouse" ? { x: event.clientX, y: event.clientY } : null
      update()
    }
    const leave = () => { position = null; hide() }
    const key = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") leave() }
    document.addEventListener("pointermove", move)
    document.addEventListener("pointerdown", move)
    document.addEventListener("pointercancel", leave)
    document.documentElement.addEventListener("pointerleave", leave)
    document.addEventListener("keydown", key)
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    window.addEventListener("blur", leave)
    media.addEventListener("change", update)
    return () => {
      hide()
      document.removeEventListener("pointermove", move)
      document.removeEventListener("pointerdown", move)
      document.removeEventListener("pointercancel", leave)
      document.documentElement.removeEventListener("pointerleave", leave)
      document.removeEventListener("keydown", key)
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
      window.removeEventListener("blur", leave)
      media.removeEventListener("change", update)
    }
  }, [enabled, capture, size, growth, motion, inMotion, outMotion, owner])

  return (
    <PointerContext.Provider value={owner}>
      <div data-slot="pointer-scope" data-pointer-owner={owner} className={cn("w-full min-w-0", className)} {...props}>{children}</div>
      {typeof document !== "undefined" && createPortal(
        <div ref={overlayRef} data-slot="pointer" data-size={size} data-growth={growth} data-motion={motion} data-visible="false" aria-hidden="true" className="oneds-pointer" />,
        document.body,
      )}
    </PointerContext.Provider>
  )
}

export { Pointer, PointerTarget }
export type { PointerSize, PointerGrowth, PointerMode, PointerMotion, PointerEasing, PointerMotionSettings }