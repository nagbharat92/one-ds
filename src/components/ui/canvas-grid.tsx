import * as React from "react"

import { cn } from "@/lib/utils"
import { CursorFollower, type CursorFollowerVariant, type CursorPosition } from "@/components/ui/cursor-follower"

function CanvasGrid({
  active = false,
  followerVariant = "surface",
  followerContent,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  active?: boolean
  followerVariant?: CursorFollowerVariant
  followerContent?: (position: CursorPosition) => React.ReactNode
}) {
  const layerRef = React.useRef<HTMLDivElement>(null)
  const gridRef = React.useRef<HTMLCanvasElement>(null)
  const cursorRef = React.useRef<HTMLCanvasElement>(null)
  const metricsRef = React.useRef<HTMLSpanElement>(null)
  const [originOffset, setOriginOffset] = React.useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = React.useState<CursorPosition | null>(null)

  React.useEffect(() => {
    const layer = layerRef.current
    const grid = gridRef.current
    const cursor = cursorRef.current
    const metrics = metricsRef.current
    const host = layer?.parentElement
    if (!layer || !grid || !cursor || !metrics || !host) return
    const gridContext = grid.getContext("2d")
    const cursorContext = cursor.getContext("2d")
    if (!gridContext || !cursorContext) return

    let width = 0
    let height = 0
    let ruler = 0
    let marker = 0
    let stroke = 0
    let accent = ""
    let guideColor = ""
    let originX = 0
    let originY = 0
    let step = 0
    let pointer: { clientX: number; clientY: number } | null = null

    const drawCursor = () => {
      cursorContext.clearRect(0, 0, width, height)
      layer.dataset.tracking = "false"
      if (!pointer || !active || step <= 0) {
        setCursorPosition(null)
        return
      }
      const bounds = layer.getBoundingClientRect()
      const pointerX = (pointer.clientX - bounds.left) * width / bounds.width
      const pointerY = (pointer.clientY - bounds.top) * height / bounds.height
      if (!bounds.width || !bounds.height || pointerX < ruler || pointerY < ruler || pointerX > width || pointerY > height) {
        setCursorPosition(null)
        return
      }
      const snap = (value: number, origin: number, extent: number) => {
        const first = Math.ceil((ruler - origin) / step)
        const last = Math.floor((extent - origin) / step)
        return origin + Math.max(first, Math.min(Math.round((value - origin) / step), last)) * step
      }
      const horizontal = snap(pointerX, originX, width)
      const vertical = snap(pointerY, originY, height)
      setCursorPosition(previous => {
        const next = { x: horizontal - ruler, y: vertical - ruler }
        return previous?.x === next.x && previous?.y === next.y ? previous : next
      })
      const callout = document.elementFromPoint(pointer.clientX, pointer.clientY)?.closest('[data-callout-id], button[data-slot="annotation-band"]')
      const overCallout = !!callout && host.contains(callout)
      layer.dataset.tracking = overCallout ? "false" : "true"
      cursorContext.strokeStyle = guideColor
      cursorContext.lineWidth = stroke
      cursorContext.beginPath()
      cursorContext.moveTo(horizontal, 0)
      cursorContext.lineTo(horizontal, height)
      cursorContext.moveTo(0, vertical)
      cursorContext.lineTo(width, vertical)
      cursorContext.stroke()
      cursorContext.strokeStyle = accent
      cursorContext.fillStyle = accent
      cursorContext.lineWidth = stroke
      cursorContext.beginPath()
      if (!overCallout) {
        cursorContext.moveTo(horizontal - marker, vertical)
        cursorContext.lineTo(horizontal + marker, vertical)
        cursorContext.moveTo(horizontal, vertical - marker)
        cursorContext.lineTo(horizontal, vertical + marker)
      }
      cursorContext.moveTo(horizontal, 0)
      cursorContext.lineTo(horizontal, ruler)
      cursorContext.moveTo(0, vertical)
      cursorContext.lineTo(ruler, vertical)
      cursorContext.stroke()
    }

    const draw = () => {
      const style = getComputedStyle(layer)
      const scale = getComputedStyle(metrics)
      width = parseFloat(style.width)
      height = parseFloat(style.height)
      step = parseFloat(scale.width)
      ruler = parseFloat(scale.height)
      const majorEvery = Number(scale.getPropertyValue("--canvas-measure-major-every"))
      const labelStep = parseFloat(scale.paddingLeft)
      const tick = parseFloat(scale.paddingTop)
      marker = parseFloat(scale.paddingRight)
      stroke = parseFloat(scale.borderTopWidth)
      accent = style.color
      guideColor = scale.backgroundColor
      if (![width, height, step, ruler, majorEvery, labelStep].every(value => Number.isFinite(value) && value > 0)) return
      const bounds = layer.getBoundingClientRect()
      const specimen = host.querySelector("[data-canvas-origin]") ?? host.querySelector('[data-slot="canvas-content"]')
      const specimenBounds = specimen?.getBoundingClientRect()
      originX = specimenBounds && bounds.width ? (specimenBounds.left - bounds.left) * width / bounds.width : ruler
      originY = specimenBounds && bounds.height ? (specimenBounds.top - bounds.top) * height / bounds.height : ruler
      setOriginOffset(previous => {
        const next = { x: originX - ruler, y: originY - ruler }
        return Math.abs(previous.x - next.x) < 0.01 && Math.abs(previous.y - next.y) < 0.01 ? previous : next
      })
      const pixelRatio = window.devicePixelRatio || 1
      for (const [surface, context] of [[grid, gridContext], [cursor, cursorContext]] as const) {
        surface.width = Math.round(width * pixelRatio)
        surface.height = Math.round(height * pixelRatio)
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      }
      gridContext.lineWidth = stroke
      const line = (startX: number, startY: number, endX: number, endY: number) => {
        gridContext.beginPath()
        gridContext.moveTo(startX, startY)
        gridContext.lineTo(endX, endY)
        gridContext.stroke()
      }
      for (let index = Math.ceil((ruler - originX) / step); originX + index * step <= width; index++) {
        const position = originX + index * step
        gridContext.strokeStyle = index % majorEvery === 0 ? style.borderTopColor : style.outlineColor
        line(position, ruler, position, height)
      }
      for (let index = Math.ceil((ruler - originY) / step); originY + index * step <= height; index++) {
        const position = originY + index * step
        gridContext.strokeStyle = index % majorEvery === 0 ? style.borderTopColor : style.outlineColor
        line(ruler, position, width, position)
      }
      gridContext.fillStyle = style.backgroundColor
      gridContext.fillRect(0, 0, width, ruler)
      gridContext.fillRect(0, 0, ruler, height)
      gridContext.strokeStyle = style.borderTopColor
      line(ruler, 0, ruler, height)
      line(0, ruler, width, ruler)
      for (let index = Math.ceil((ruler - originX) / step); originX + index * step <= width; index++) {
        const position = originX + index * step
        const length = index % majorEvery === 0 ? tick : tick / 2
        line(position, ruler - length, position, ruler)
      }
      for (let index = Math.ceil((ruler - originY) / step); originY + index * step <= height; index++) {
        const position = originY + index * step
        const length = index % majorEvery === 0 ? tick : tick / 2
        line(ruler - length, position, ruler, position)
      }
      gridContext.fillStyle = scale.color
      gridContext.font = scale.font
      gridContext.textAlign = "center"
      gridContext.textBaseline = "middle"
      gridContext.fillText("px", ruler / 2, ruler / 2)
      for (let value = Math.ceil((ruler - originX) / labelStep) * labelStep; originX + value < width; value += labelStep) {
        const position = originX + value
        const halfLabel = gridContext.measureText(String(value)).width / 2
        if (position - halfLabel > ruler && position + halfLabel < width) gridContext.fillText(String(value), position, (ruler - tick) / 2)
      }
      for (let value = Math.ceil((ruler - originY) / labelStep) * labelStep; originY + value < height; value += labelStep) {
        const position = originY + value
        const halfLabel = gridContext.measureText(String(value)).width / 2
        if (position - halfLabel > ruler && position + halfLabel < height) {
          gridContext.save()
          gridContext.translate((ruler - tick) / 2, position)
          gridContext.rotate(-Math.PI / 2)
          gridContext.fillText(String(value), 0, 0)
          gridContext.restore()
        }
      }
      drawCursor()
    }
    const move = (event: PointerEvent) => {
      pointer = event.pointerType === "touch" ? null : { clientX: event.clientX, clientY: event.clientY }
      drawCursor()
    }
    const leave = () => {
      pointer = null
      drawCursor()
    }
    const resize = new ResizeObserver(draw)
    resize.observe(layer)
    resize.observe(metrics)
    const specimen = host.querySelector("[data-canvas-origin]") ?? host.querySelector('[data-slot="canvas-content"]')
    if (specimen) resize.observe(specimen)
    const theme = new MutationObserver(draw)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    theme.observe(host, { attributes: true, attributeFilter: ["class", "style"] })
    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)
    window.addEventListener("scroll", drawCursor, true)
    window.addEventListener("resize", draw)
    window.addEventListener("blur", leave)
    draw()
    return () => {
      resize.disconnect()
      theme.disconnect()
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
      window.removeEventListener("scroll", drawCursor, true)
      window.removeEventListener("resize", draw)
      window.removeEventListener("blur", leave)
      delete layer.dataset.tracking
    }
  }, [active])

  return (
    <>
    <div ref={layerRef} data-slot="canvas-grid" data-active={active} aria-hidden="true" className={cn("canvas-measure", className)} {...props}>
      <canvas ref={gridRef} className="canvas-measure__grid" />
      <span ref={metricsRef} className="canvas-measure__metrics" />
    </div>
    <canvas ref={cursorRef} data-active={active} aria-hidden="true" className="canvas-measure__cursor" />
    <CursorFollower active={active} position={cursorPosition} variant={followerVariant} className="canvas-grid-follower">
      {({ x, y }) => followerContent ? followerContent({ x: x - originOffset.x, y: y - originOffset.y }) : (
        <span className="flex items-center gap-(--space-sm) font-mono tabular-nums">
          <span>x {Math.round(x - originOffset.x)}</span>
          <span>y {Math.round(y - originOffset.y)}</span>
        </span>
      )}
    </CursorFollower>
    </>
  )
}

export { CanvasGrid }