import * as React from "react"

import { cn } from "@/lib/utils"

type CursorPosition = { x: number; y: number }
type CursorFollowerVariant = "surface" | "accent"

function CursorFollower({
  active = true,
  variant = "surface",
  position: controlledPosition,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  active?: boolean
  variant?: CursorFollowerVariant
  position?: CursorPosition | null
  children: React.ReactNode | ((position: CursorPosition) => React.ReactNode)
}) {
  const layerRef = React.useRef<HTMLDivElement>(null)
  const bubbleRef = React.useRef<HTMLDivElement>(null)
  const metricsRef = React.useRef<HTMLSpanElement>(null)
  const [trackedPosition, setPosition] = React.useState<CursorPosition | null>(null)
  const position = controlledPosition === undefined ? trackedPosition : controlledPosition

  React.useEffect(() => {
    if (controlledPosition !== undefined) return
    const layer = layerRef.current
    const host = layer?.parentElement
    const metrics = metricsRef.current
    if (!layer || !host || !metrics) return
    let pointer: { clientX: number; clientY: number } | null = null
    const update = () => {
      if (!pointer || !active) {
        setPosition(null)
        return
      }
      const rect = layer.getBoundingClientRect()
      const style = getComputedStyle(layer)
      const origin = getComputedStyle(metrics)
      const width = parseFloat(style.width)
      const height = parseFloat(style.height)
      const originX = parseFloat(origin.paddingLeft)
      const originY = parseFloat(origin.paddingTop)
      const x = (pointer.clientX - rect.left) * width / rect.width - originX
      const y = (pointer.clientY - rect.top) * height / rect.height - originY
      const inside = rect.width > 0 && rect.height > 0 && x >= 0 && y >= 0 && x <= width - originX && y <= height - originY
      setPosition(inside ? { x, y } : null)
    }
    const move = (event: PointerEvent) => {
      pointer = event.pointerType === "touch" ? null : { clientX: event.clientX, clientY: event.clientY }
      update()
    }
    const leave = () => {
      pointer = null
      update()
    }
    const observer = new ResizeObserver(update)
    observer.observe(layer)
    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)
    window.addEventListener("scroll", update, true)
    window.addEventListener("blur", leave)
    return () => {
      observer.disconnect()
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("blur", leave)
    }
  }, [active, controlledPosition])

  React.useLayoutEffect(() => {
    const layer = layerRef.current
    const bubble = bubbleRef.current
    const metrics = metricsRef.current
    if (!layer || !bubble || !metrics || !position) return
    const place = () => {
      const style = getComputedStyle(layer)
      const tokens = getComputedStyle(metrics)
      const width = parseFloat(style.width)
      const height = parseFloat(style.height)
      const originX = parseFloat(tokens.paddingLeft)
      const originY = parseFloat(tokens.paddingTop)
      const offset = parseFloat(tokens.width)
      const inset = parseFloat(tokens.height)
      const horizontal = position.x + originX
      const vertical = position.y + originY
      const bubbleStyle = getComputedStyle(bubble)
      const bubbleWidth = parseFloat(bubbleStyle.width)
      const bubbleHeight = parseFloat(bubbleStyle.height)
      const left = horizontal + offset + bubbleWidth <= width - inset
        ? horizontal + offset : horizontal - offset - bubbleWidth
      const top = vertical + offset + bubbleHeight <= height - inset
        ? vertical + offset : vertical - offset - bubbleHeight
      bubble.style.setProperty("--cursor-follower-x", `${Math.max(originX + inset, Math.min(left, width - inset - bubbleWidth))}px`)
      bubble.style.setProperty("--cursor-follower-y", `${Math.max(originY + inset, Math.min(top, height - inset - bubbleHeight))}px`)
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(bubble)
    observer.observe(layer)
    return () => observer.disconnect()
  }, [position, variant])

  return (
    <div ref={layerRef} data-slot="cursor-follower" data-variant={variant} data-visible={active && position !== null} aria-hidden="true" className={cn("cursor-follower", className)} {...props}>
      <div ref={bubbleRef} className="cursor-follower__bubble">
        {typeof children === "function" ? children(position ?? { x: 0, y: 0 }) : children}
      </div>
      <span ref={metricsRef} className="cursor-follower__metrics" />
    </div>
  )
}

export { CursorFollower }
export type { CursorPosition, CursorFollowerVariant }