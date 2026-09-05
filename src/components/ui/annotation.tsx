import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { placeAnnotations, type AnnotationSide } from "@/lib/annotation-layout"

type AnnotationKind = "bounds" | "padding" | "border" | "margin" | "gap"
type AnnotationColorProps = { kind?: AnnotationKind }

/**
 * Annotation — a design-spec overlay for documenting a component's anatomy:
 * numbered callouts, dimension labels, and spacing bands drawn on top of a
 * relatively-positioned target. The layer is pointer-transparent; callout
 * buttons provide hover and selection. Hidden layers leave the accessibility tree.
 */
function AnnotationLayer({
  className,
  active = true,
  kind,
  ...props
}: React.ComponentProps<"div"> & AnnotationColorProps & { active?: boolean }) {
  return (
    <div
      data-slot="annotation-layer"
      data-annotation-kind={kind}
      data-active={active}
      aria-hidden={!active}
      className={cn(
        "pointer-events-none absolute inset-0 z-10 transition-opacity duration-(--speed-gentle) ease-(--ease-settle) data-[active=false]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

// A single positioned annotation group. Placement comes from the consumer
// (utilities or a scoped stylesheet); the group itself only lays its parts out.
function Annotation({
  className,
  asChild = false,
  kind,
  ...props
}: React.ComponentProps<"div"> & AnnotationColorProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="annotation"
      data-annotation-kind={kind}
      className={cn("absolute flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

const annotationMarkerVariants = cva(
  "pointer-events-auto flex shrink-0 select-none items-center justify-center border border-(--annotation-color) bg-(--annotation-label-background) text-(--annotation-color) shadow-xs",
  {
    variants: {
      variant: {
        number: "size-6 rounded-full text-xs font-medium tabular-nums",
        dot: "size-3 rounded-full border-2",
      },
    },
    defaultVariants: {
      variant: "number",
    },
  }
)

function AnnotationMarker({
  className,
  variant,
  asChild = false,
  kind,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof annotationMarkerVariants> & AnnotationColorProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="annotation-marker"
      data-annotation-kind={kind}
      className={cn(annotationMarkerVariants({ variant, className }))}
      {...props}
    />
  )
}

// A small chip that carries a measurement or short caption.
function AnnotationLabel({ className, asChild = false, kind, ...props }: React.ComponentProps<"span"> & AnnotationColorProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return (
    <Comp
      data-slot="annotation-label"
      data-annotation-kind={kind}
      className={cn(
        "pointer-events-auto inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-(--annotation-color) bg-(--annotation-label-background) px-1.5 py-0.5 text-xs tabular-nums text-(--annotation-color) shadow-xs",
        className
      )}
      {...props}
    />
  )
}

const annotationLineVariants = cva(
  "pointer-events-none border-dotted border-(--annotation-color)",
  {
    variants: {
      orientation: {
        horizontal: "h-0 flex-1 self-center border-t",
        vertical: "w-0 flex-1 justify-self-center border-s",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

// A dashed leader line connecting a marker to its target.
function AnnotationLine({
  className,
  orientation,
  kind,
  ...props
}: React.ComponentProps<"div"> & AnnotationColorProps & VariantProps<typeof annotationLineVariants>) {
  return (
    <div
      data-slot="annotation-line"
      data-annotation-kind={kind}
      className={cn(annotationLineVariants({ orientation, className }))}
      {...props}
    />
  )
}

// A dotted SVG leader that can bend (elbow) and reach outside the layer to point
// precisely at a target. Pass `d` for a measured pixel path (rounded corners
// baked in) or `points` for a quick percentage polyline in a 0–100 viewBox.
// `anchor` draws a filled dot where the leader starts, on the highlighted bounds.
// `arc` overlays a solid stroke tracing a rounded corner, highlighting the curve
// the leader measures.
function AnnotationConnector({
  className,
  d,
  points,
  anchor,
  arc,
  outline,
  kind,
  ...props
}: React.ComponentProps<"svg"> & AnnotationColorProps & {
  d?: string
  points?: string
  anchor?: [number, number]
  arc?: string
  outline?: { left: number; top: number; right: number; bottom: number; radius: number }
}) {
  const percent = points != null && d == null
  const stroke = {
    stroke: "currentColor",
    strokeWidth: "var(--annotation-line-width)",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: "var(--annotation-line-dash) var(--annotation-line-gap)",
    vectorEffect: "non-scaling-stroke",
  } as const
  return (
    <svg
      data-slot="annotation-connector"
      data-annotation-kind={kind}
      viewBox={percent ? "0 0 100 100" : undefined}
      preserveAspectRatio={percent ? "none" : undefined}
      fill="none"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible text-(--annotation-color)",
        className
      )}
      {...props}
    >
      {outline ? (
        <rect
          data-slot="annotation-hover-bounds"
          x={outline.left}
          y={outline.top}
          width={outline.right - outline.left}
          height={outline.bottom - outline.top}
          rx={outline.radius}
          {...stroke}
        />
      ) : null}
      {arc ? (
        <path
          d={arc}
          stroke="currentColor"
          strokeWidth="var(--annotation-corner-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      {d != null ? (
        <path d={d} {...stroke} />
      ) : points ? (
        <polyline points={points} {...stroke} />
      ) : null}
      {anchor ? <circle cx={anchor[0]} cy={anchor[1]} r="var(--annotation-anchor-radius)" fill="currentColor" /> : null}
    </svg>
  )
}

// A tinted band that highlights a spacing region (padding, margin or gap). It
// rounds with the surface it documents so nested bands stay concentric.
function AnnotationBand({ className, kind, ...props }: React.ComponentProps<"div"> & AnnotationColorProps) {
  return (
    <div
      data-slot="annotation-band"
      data-annotation-kind={kind}
      className={cn(
        "pointer-events-none flex items-center justify-center rounded-md bg-(--annotation-fill) text-xs font-medium tabular-nums text-(--annotation-color)",
        className
      )}
      {...props}
    />
  )
}

type CalloutSide = "left" | "right" | "top" | "bottom"
type CalloutCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right"

const CALLOUT_CORNERS = new Set<string>([
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
])

type AnnotationCalloutItem = {
  id: string | number
  kind?: AnnotationKind
  // Matches a `data-annotate` attribute on an element inside the container.
  target: string
  // An edge (left/right/top/bottom) measures spacing; a corner
  // (top-left/…/bottom-right) traces the target's rounded corner and reads its
  // radius, with the leader anchored on the arc.
  side: CalloutSide | CalloutCorner
  content: React.ReactNode
  // Render as a labelled chip instead of a numbered dot marker.
  label?: boolean
  // Compatibility hint: all placements now prefer alignment to the target.
  markerAlign?: "stack" | "target"
  placement?: AnnotationSide
  allowedSides?: AnnotationSide[]
  locked?: boolean
}

type CalloutRect = {
  left: number
  top: number
  right: number
  bottom: number
}
type CalloutBox = CalloutRect & { radius: number; radii: Record<CalloutCorner, number> }
type CalloutGeometry = {
  frame: { width: number; height: number }
  targets: Record<string, CalloutBox>
  bounds: CalloutRect | null
  obstacles: CalloutRect[]
  labels: Record<string, { width: number; height: number }>
  specimen: CalloutRect
  clearance: number
  distance: number
  minDistance: number
  corner: number
  outlinePad: number
  arcGap: number
  arcStroke: number
}

// A rounded polyline: each interior vertex is cut back and joined with a
// quadratic curve, so an elbow bends softly instead of at a hard angle.
function calloutRoundedPath(points: [number, number][], radius: number) {
  if (points.length < 2) return ""
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 1; i < points.length - 1; i++) {
    const [ax, ay] = points[i - 1]
    const [bx, by] = points[i]
    const [cx, cy] = points[i + 1]
    const inLen = Math.hypot(bx - ax, by - ay)
    const outLen = Math.hypot(cx - bx, cy - by)
    const r = Math.min(radius, inLen / 2, outLen / 2)
    const sx = bx + ((ax - bx) / inLen) * r
    const sy = by + ((ay - by) / inLen) * r
    const ex = bx + ((cx - bx) / outLen) * r
    const ey = by + ((cy - by) / outLen) * r
    d += ` L ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${bx.toFixed(1)} ${by.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
  }
  const last = points[points.length - 1]
  d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`
  return d
}

// Drop zero-length and straight-through points so a run without a real bend
// stays a single straight line.
function calloutSimplify(points: [number, number][]) {
  const out: [number, number][] = []
  for (const point of points) {
    const last = out[out.length - 1]
    if (!last || Math.hypot(point[0] - last[0], point[1] - last[1]) > 0.5) out.push(point)
  }
  if (out.length < 3) return out
  const kept: [number, number][] = [out[0]]
  for (let i = 1; i < out.length - 1; i++) {
    const a = kept[kept.length - 1]
    const b = out[i]
    const c = out[i + 1]
    const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (Math.abs(cross) > 0.5) kept.push(b)
  }
  kept.push(out[out.length - 1])
  return kept
}

// The nearest ancestor that clips its overflow — the surface a marker must not
// escape (e.g. the preview canvas).
function calloutClipAncestor(el: HTMLElement) {
  let node = el.parentElement
  while (node) {
    const s = getComputedStyle(node)
    if (/(auto|scroll|hidden|clip)/.test(`${s.overflow} ${s.overflowX} ${s.overflowY}`)) {
      return node
    }
    node = node.parentElement
  }
  return null
}

function calloutCornerArc(t: CalloutBox, corner: CalloutCorner, geometry: CalloutGeometry) {
  const r = Math.max(
    0,
    Math.min(t.radii[corner], (t.right - t.left) / 2, (t.bottom - t.top) / 2)
  )
  if (r < 0.5) return null
  const { left, top, right, bottom } = t
  const k = Math.SQRT1_2 // cos/sin 45°
  // Push the stroke's centreline past a clear gap so the whole stroke reads OUTSIDE
  // the surface with the gap intact.
  const off = geometry.arcGap + geometry.arcStroke / 2
  const R = r + off
  let arc: string
  let anchor: [number, number]
  if (corner === "top-left") {
    const cx = left + r
    const cy = top + r
    arc = `M ${left - off} ${cy} A ${R} ${R} 0 0 1 ${cx} ${top - off}`
    anchor = [cx - R * k, cy - R * k]
  } else if (corner === "top-right") {
    const cx = right - r
    const cy = top + r
    arc = `M ${cx} ${top - off} A ${R} ${R} 0 0 1 ${right + off} ${cy}`
    anchor = [cx + R * k, cy - R * k]
  } else if (corner === "bottom-right") {
    const cx = right - r
    const cy = bottom - r
    arc = `M ${right + off} ${cy} A ${R} ${R} 0 0 1 ${cx} ${bottom + off}`
    anchor = [cx + R * k, cy + R * k]
  } else {
    const cx = left + r
    const cy = bottom - r
    arc = `M ${cx} ${bottom + off} A ${R} ${R} 0 0 1 ${left - off} ${cy}`
    anchor = [cx - R * k, cy + R * k]
  }
  return { arc, anchor, r: R }
}

function calloutHighlightBounds(target: CalloutBox, padding: number) {
  return {
    left: target.left - padding,
    top: target.top - padding,
    right: target.right + padding,
    bottom: target.bottom + padding,
    radius: target.radius + padding,
  }
}

function buildAnnotationCallouts(items: AnnotationCalloutItem[], geo: CalloutGeometry) {
  const anchors = items.flatMap(item => {
    const target = geo.targets[item.target]
    const size = geo.labels[String(item.id)]
    if (!size || !target) return []
    const peers = items.filter(peer => peer.target === item.target && peer.side === item.side)
    const fraction = (peers.findIndex(peer => peer.id === item.id) + 0.5) / peers.length
    const highlight = calloutHighlightBounds(target, geo.outlinePad)
    const corner = CALLOUT_CORNERS.has(item.side) ? calloutCornerArc(target, item.side as CalloutCorner, geo) : null
    const anchor: [number, number] = corner?.anchor ?? (
      item.side === "left" ? [highlight.left, highlight.top + (highlight.bottom - highlight.top) * fraction] :
      item.side === "right" ? [highlight.right, highlight.top + (highlight.bottom - highlight.top) * fraction] :
      item.side === "top" ? [highlight.left + (highlight.right - highlight.left) * fraction, highlight.top] :
      item.side === "bottom" ? [highlight.left + (highlight.right - highlight.left) * fraction, highlight.bottom] :
      [item.side.endsWith("left") ? highlight.left : highlight.right, item.side.startsWith("top") ? highlight.top : highlight.bottom]
    )
    const preferredSide = item.placement ?? (CALLOUT_CORNERS.has(item.side)
      ? item.side.startsWith("top") ? "top" : "bottom"
      : item.side as CalloutSide)
    const automaticCorner = CALLOUT_CORNERS.has(item.side) && !item.placement && !item.locked
    const adjacentSide: CalloutSide = item.side.endsWith("left") ? "left" : "right"
    const edgeAnchors: Partial<Record<AnnotationSide, [number, number]>> | undefined =
      CALLOUT_CORNERS.has(item.side) ? undefined : {
        left: [highlight.left, highlight.top + (highlight.bottom - highlight.top) * fraction],
        right: [highlight.right, highlight.top + (highlight.bottom - highlight.top) * fraction],
        top: [highlight.left + (highlight.right - highlight.left) * fraction, highlight.top],
        bottom: [highlight.left + (highlight.right - highlight.left) * fraction, highlight.bottom],
      }
    return [{ ...item, ...size, anchor, preferredSide, arc: corner?.arc,
      anchors: edgeAnchors,
      preferRoom: automaticCorner,
      allowedSides: item.allowedSides ?? (automaticCorner ? [adjacentSide] : undefined) }]
  })
  const layout = placeAnnotations({
    items: anchors,
    bounds: geo.bounds ?? { left: -geo.distance * 2, top: -geo.distance * 2,
      right: geo.frame.width + geo.distance * 2, bottom: geo.frame.height + geo.distance * 2 },
    specimen: geo.specimen,
    obstacles: geo.obstacles,
    gap: geo.clearance,
    distance: geo.distance,
    minDistance: geo.minDistance,
  })
  return {
    unplaced: layout.unplaced,
    callouts: layout.placed.map(placement => {
      const anchor = anchors.find(anchor => anchor.id === placement.id)!
      return { ...anchor, ax: placement.points[0][0], ay: placement.points[0][1], side: placement.side,
        mx: (placement.rect.left + placement.rect.right) / 2,
        my: (placement.rect.top + placement.rect.bottom) / 2,
        d: calloutRoundedPath(calloutSimplify(placement.points), geo.corner) }
    }),
  }
}

function AnnotationCallouts({
  items,
  active = true,
  onLayoutOverflow,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "content"> & AnnotationColorProps & {
  items: AnnotationCalloutItem[]
  active?: boolean
  onLayoutOverflow?: (ids: AnnotationCalloutItem["id"][]) => void
}) {
  const layerRef = React.useRef<HTMLDivElement>(null)
  const measurementRef = React.useRef<HTMLDivElement>(null)
  const [geo, setGeo] = React.useState<CalloutGeometry | null>(null)
  const [hovered, setHovered] = React.useState<AnnotationCalloutItem["id"] | null>(null)
  const [selected, setSelected] = React.useState<AnnotationCalloutItem["id"] | null>(null)
  const [previousActive, setPreviousActive] = React.useState(active)
  if (previousActive !== active) {
    setPreviousActive(active)
    setSelected(null)
    setHovered(null)
  }
  const [lastHovered, setLastHovered] = React.useState<
    AnnotationCalloutItem["id"] | null
  >(items[0]?.id ?? null)

  React.useEffect(() => {
    if (selected === null || !active) return
    const dismissOutside = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && layerRef.current?.contains(target.closest("[data-callout-id]"))) return
      setSelected(null)
    }
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setSelected(null)
      setHovered(null)
    }
    document.addEventListener("pointerdown", dismissOutside, true)
    document.addEventListener("keydown", dismissOnEscape)
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true)
      document.removeEventListener("keydown", dismissOnEscape)
    }
  }, [selected, active])

  React.useLayoutEffect(() => {
    const layer = layerRef.current
    const measurement = measurementRef.current
    const container = layer?.parentElement
    if (!container || !layer || !measurement) return

    const measure = () => {
      const base = container.getBoundingClientRect()
      const containerStyle = getComputedStyle(container)
      const scaleX = base.width / parseFloat(containerStyle.width) || 1
      const scaleY = base.height / parseFloat(containerStyle.height) || 1
      const toRect = (el: Element): CalloutRect => {
        const r = el.getBoundingClientRect()
        return {
          left: (r.left - base.left) / scaleX,
          top: (r.top - base.top) / scaleY,
          right: (r.right - base.left) / scaleX,
          bottom: (r.bottom - base.top) / scaleY,
        }
      }

      const tokenStyle = getComputedStyle(measurement)
      const clearance = parseFloat(tokenStyle.paddingTop)
      const distance = parseFloat(tokenStyle.paddingRight)
      const minDistance = parseFloat(tokenStyle.paddingLeft)
      const margin = parseFloat(tokenStyle.paddingBottom)
      const corner = parseFloat(tokenStyle.borderRadius)
      const outlinePad = parseFloat(tokenStyle.marginBottom)
      const arcGap = parseFloat(tokenStyle.marginLeft)
      const arcStroke = parseFloat(tokenStyle.marginRight)
      const targets: Record<string, CalloutBox> = {}
      const targetElements = [...container.querySelectorAll<HTMLElement>("[data-annotate]")]
      targetElements.forEach((el) => {
        const key = el.dataset.annotate
        if (!key) return
        const style = getComputedStyle(el)
        targets[key] = {
          ...toRect(el),
          radius: Number.parseFloat(style.borderTopLeftRadius) || 0,
          radii: {
            "top-left": parseFloat(style.borderTopLeftRadius) || 0,
            "top-right": parseFloat(style.borderTopRightRadius) || 0,
            "bottom-left": parseFloat(style.borderBottomLeftRadius) || 0,
            "bottom-right": parseFloat(style.borderBottomRightRadius) || 0,
          },
        }
      })

      // Keep markers inside the clipping ancestor (the preview canvas) and off
      // any element opted out with data-annotate-avoid (a toolbar, a checkbox…).
      const canvas = container.closest<HTMLElement>('[data-slot="canvas"]')
      const clip = canvas ?? calloutClipAncestor(container)
      const bounds = clip
        ? (() => {
            const b = toRect(clip)
            return {
              left: b.left + margin,
              top: b.top + margin,
              right: b.right - margin,
              bottom: b.bottom - margin,
            }
          })()
        : null
      if (bounds) {
        for (let ancestor = container.parentElement; ancestor && ancestor !== clip; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor)
          const rect = toRect(ancestor)
          if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
            bounds.left = Math.max(bounds.left, rect.left + margin)
            bounds.right = Math.min(bounds.right, rect.right - margin)
          }
          if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {
            bounds.top = Math.max(bounds.top, rect.top + margin)
            bounds.bottom = Math.min(bounds.bottom, rect.bottom - margin)
          }
        }
        const grid = canvas?.querySelector('[data-slot="canvas-grid"]')
        const metrics = grid?.querySelector('.canvas-measure__metrics')
        if (grid && metrics) {
          const ruler = parseFloat(getComputedStyle(metrics).height)
          const gridRect = toRect(grid)
          bounds.left = Math.max(bounds.left, gridRect.left + ruler + margin)
          bounds.top = Math.max(bounds.top, gridRect.top + ruler + margin)
        }
      }
      const obstacles: CalloutRect[] = []
      ;(clip ?? container)
        .querySelectorAll<HTMLElement>('[data-annotate-avoid], [data-slot="toolbar"], button, input, select, textarea, label, a[href], [role="checkbox"]')
        .forEach(el => {
          if (!layer.contains(el) && !el.contains(container)) obstacles.push(toRect(el))
        })
      const rootTargets = targetElements.filter(el => {
        const parent = el.parentElement?.closest("[data-annotate]")
        return !parent || !container.contains(parent)
      })
      const targetRects = rootTargets.map(toRect)
      const specimen = targetRects.length ? {
        left: Math.min(...targetRects.map(rect => rect.left)),
        top: Math.min(...targetRects.map(rect => rect.top)),
        right: Math.max(...targetRects.map(rect => rect.right)),
        bottom: Math.max(...targetRects.map(rect => rect.bottom)),
      } : { left: 0, top: 0, right: base.width / scaleX, bottom: base.height / scaleY }
      const labels: CalloutGeometry["labels"] = {}
      measurement.querySelectorAll<HTMLElement>("[data-measure-id]").forEach(el => {
        const rect = el.getBoundingClientRect()
        labels[el.dataset.measureId!] = { width: rect.width / scaleX, height: rect.height / scaleY }
      })

      const next = {
        frame: { width: base.width / scaleX, height: base.height / scaleY },
        targets,
        bounds,
        obstacles,
        labels, specimen, clearance, distance, minDistance, corner, outlinePad, arcGap, arcStroke,
      }
      setGeo(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    container.querySelectorAll<HTMLElement>("[data-annotate]").forEach(el => observer.observe(el))
    measurement.querySelectorAll<HTMLElement>("[data-measure-id]").forEach(el => observer.observe(el))
    const clip = container.closest<HTMLElement>('[data-slot="canvas"]') ?? calloutClipAncestor(container)
    if (clip) observer.observe(clip)
    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const mutation = new MutationObserver(records => {
      if (records.some(record => !layer.contains(record.target))) schedule()
    })
    mutation.observe(clip ?? container, { attributes: true, childList: true, characterData: true, subtree: true })
    container.addEventListener("transitionend", schedule)
    window.addEventListener("resize", schedule)
    return () => {
      observer.disconnect()
      mutation.disconnect()
      cancelAnimationFrame(frame)
      container.removeEventListener("transitionend", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [items])

  const layout = geo ? buildAnnotationCallouts(items, geo) : { callouts: [], unplaced: [] }
  const built = layout.callouts
  const overflowKey = JSON.stringify(layout.unplaced)
  React.useEffect(() => {
    onLayoutOverflow?.(JSON.parse(overflowKey))
  }, [overflowKey, onLayoutOverflow])
  const outlineItem = items.find((it) => it.id === lastHovered)
  const outline = geo && outlineItem ? geo.targets[outlineItem.target] : undefined
  const selectedItem = built.find(item => item.id === selected)
  const selectedOutline = geo && selectedItem ? geo.targets[selectedItem.target] : undefined

  return (
    <AnnotationLayer ref={layerRef} active={active} inert={!active} data-layout-status={layout.unplaced.length ? "insufficient-space" : "placed"} className={className} {...props}>
      <div ref={measurementRef} className="annotation-measurements" aria-hidden="true">
        {items.map(item => item.label ? (
          <AnnotationLabel key={item.id} data-measure-id={String(item.id)}>{item.content}</AnnotationLabel>
        ) : (
          <AnnotationMarker key={item.id} data-measure-id={String(item.id)}>{item.content}</AnnotationMarker>
        ))}
      </div>
      {active && layout.unplaced.length ? (
        <span role="status" className="sr-only">{layout.unplaced.length} annotations need more canvas space.</span>
      ) : null}
      {selectedOutline ? (
        <AnnotationConnector
          data-selected-bounds={String(selected)}
          kind={selectedItem?.kind}
          outline={calloutHighlightBounds(selectedOutline, geo?.outlinePad ?? 0)}
        />
      ) : null}
      {outline && outlineItem?.target !== selectedItem?.target ? (
        <AnnotationConnector
          kind={outlineItem?.kind}
          outline={calloutHighlightBounds(outline, geo?.outlinePad ?? 0)}
          className={cn(
            "transition-opacity duration-(--speed-swift) ease-(--ease-settle)",
            hovered !== null ? "opacity-100" : "opacity-0"
          )}
        />
      ) : null}
      {built.map((c) => {
        const isSelected = selectedItem?.id === c.id
        const isHovered = hovered === c.id
        const dimmed = (hovered !== null || selectedItem !== undefined) && !isHovered && !isSelected
        const fade = cn(
          "transition-opacity duration-(--speed-swift) ease-(--ease-settle)",
          dimmed && "opacity-20"
        )
        const hover = {
          onPointerEnter: () => {
            setLastHovered(c.id)
            setHovered(c.id)
          },
          onPointerLeave: () => setHovered(null),
          onFocus: (event: React.FocusEvent<HTMLElement>) => {
            if (!event.currentTarget.matches(":focus-visible")) return
            setLastHovered(c.id)
            setHovered(c.id)
          },
          onBlur: () => setHovered(null),
          onClick: () => setSelected(c.id),
          "aria-pressed": isSelected,
          "aria-label": typeof c.content === "number" ? `Annotation ${c.content}` : undefined,
          "data-highlighted": isSelected || isHovered,
        }
        const interactionStyle = "cursor-pointer data-[highlighted=true]:bg-(--annotation-highlight-background) data-[highlighted=true]:text-(--annotation-highlight-foreground) active:bg-(--annotation-pressed-background)! active:text-(--annotation-highlight-foreground)! focus-visible:outline-solid focus-visible:outline-(length:--annotation-line-width) focus-visible:outline-(--annotation-color) focus-visible:outline-offset-(--annotation-outline-inset)"
        return (
          <React.Fragment key={c.id}>
            <AnnotationConnector kind={c.kind} d={c.d} arc={c.arc} anchor={[c.ax, c.ay]} className={fade} />
            <Annotation
              kind={c.kind}
              data-callout-id={String(c.id)}
              data-placement={c.side}
              className={cn("-translate-x-1/2 -translate-y-1/2", fade)}
              style={{ left: c.mx, top: c.my }}
            >
              {c.label ? (
                <AnnotationLabel
                  asChild
                  {...hover}
                  className={cn(
                    "relative transition-colors duration-(--speed-swift) after:absolute after:-inset-1",
                    interactionStyle
                  )}
                >
                  <button type="button">{c.content}</button>
                </AnnotationLabel>
              ) : (
                <AnnotationMarker
                  asChild
                  {...hover}
                  className={cn(
                    "relative transition-colors duration-(--speed-swift) after:absolute after:-inset-2",
                    interactionStyle
                  )}
                >
                  <button type="button">{c.content}</button>
                </AnnotationMarker>
              )}
            </Annotation>
          </React.Fragment>
        )
      })}
    </AnnotationLayer>
  )
}

export {
  AnnotationLayer,
  Annotation,
  AnnotationMarker,
  AnnotationLabel,
  AnnotationLine,
  AnnotationConnector,
  AnnotationBand,
  AnnotationCallouts,
  annotationMarkerVariants,
}
export type { AnnotationCalloutItem, AnnotationKind }
