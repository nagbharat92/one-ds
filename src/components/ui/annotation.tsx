import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Annotation — a design-spec overlay for documenting a component's anatomy:
 * numbered callouts, dimension labels, and spacing bands drawn on top of a
 * relatively-positioned target. The layer is non-interactive and can be toggled
 * on and off; hidden it fades out and is removed from the accessibility tree.
 */
function AnnotationLayer({
  className,
  active = true,
  ...props
}: React.ComponentProps<"div"> & { active?: boolean }) {
  return (
    <div
      data-slot="annotation-layer"
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
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="annotation"
      className={cn("absolute flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

const annotationMarkerVariants = cva(
  "pointer-events-auto flex shrink-0 select-none items-center justify-center border border-destructive bg-background text-destructive shadow-xs",
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
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof annotationMarkerVariants>) {
  return (
    <div
      data-slot="annotation-marker"
      className={cn(annotationMarkerVariants({ variant, className }))}
      {...props}
    />
  )
}

// A small chip that carries a measurement or short caption.
function AnnotationLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="annotation-label"
      className={cn(
        "pointer-events-auto inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-destructive bg-background px-1.5 py-0.5 text-xs tabular-nums text-destructive shadow-xs",
        className
      )}
      {...props}
    />
  )
}

const annotationLineVariants = cva(
  "pointer-events-none border-dotted border-destructive",
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
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof annotationLineVariants>) {
  return (
    <div
      data-slot="annotation-line"
      className={cn(annotationLineVariants({ orientation, className }))}
      {...props}
    />
  )
}

// A dotted SVG leader that can bend (elbow) and reach outside the layer to point
// precisely at a target. Pass `d` for a measured pixel path (rounded corners
// baked in) or `points` for a quick percentage polyline in a 0–100 viewBox.
// `anchor` draws a filled dot where the leader starts, on the target's edge.
// `arc` overlays a solid stroke tracing a rounded corner, highlighting the curve
// the leader measures.
function AnnotationConnector({
  className,
  d,
  points,
  anchor,
  arc,
  ...props
}: React.ComponentProps<"svg"> & {
  d?: string
  points?: string
  anchor?: [number, number]
  arc?: string
}) {
  const percent = points != null && d == null
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: "1 5",
    vectorEffect: "non-scaling-stroke",
  } as const
  return (
    <svg
      data-slot="annotation-connector"
      viewBox={percent ? "0 0 100 100" : undefined}
      preserveAspectRatio={percent ? "none" : undefined}
      fill="none"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible text-destructive",
        className
      )}
      {...props}
    >
      {arc ? (
        <path
          d={arc}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      {d != null ? (
        <path d={d} {...stroke} />
      ) : (
        <polyline points={points} {...stroke} />
      )}
      {anchor ? <circle cx={anchor[0]} cy={anchor[1]} r={3} fill="currentColor" /> : null}
    </svg>
  )
}

// A tinted band that highlights a spacing region (padding, margin or gap). It
// rounds with the surface it documents so nested bands stay concentric.
function AnnotationBand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="annotation-band"
      className={cn(
        "pointer-events-none flex items-center justify-center rounded-md bg-destructive/10 text-xs font-medium tabular-nums text-destructive",
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
  // Matches a `data-annotate` attribute on an element inside the container.
  target: string
  // An edge (left/right/top/bottom) measures spacing; a corner
  // (top-left/…/bottom-right) traces the target's rounded corner and reads its
  // radius, with the leader anchored on the arc.
  side: CalloutSide | CalloutCorner
  content: React.ReactNode
  // Render as a labelled chip instead of a numbered dot marker.
  label?: boolean
}

type CalloutRect = {
  left: number
  top: number
  right: number
  bottom: number
}
type CalloutBox = CalloutRect & { radius: number }
type CalloutGeometry = {
  frame: { width: number; height: number }
  targets: Record<string, CalloutBox>
  bounds: CalloutRect | null
  obstacles: CalloutRect[]
}

// One tuning source for the whole callout system so every consumer stays
// consistent: change a value here and every annotated surface follows.
const CALLOUT = {
  gap: 64,
  elbow: 28,
  markerRadius: 13,
  spacing: 40,
  corner: 10,
  outlinePad: 4,
  boundsMargin: 8,
  cornerGap: 4,
  cornerEdge: 14,
  cornerStroke: 3,
}

// Half-size estimate used to keep a marker inside the preview bounds and off
// obstacles (a compact dot marker vs a wider label chip).
const CALLOUT_HALF = {
  marker: { w: 16, h: 16 },
  label: { w: 46, h: 14 },
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

// Place a marker past its frame edge, then pull it inside the bounds and nudge it
// along the edge off any obstacle it lands on.
function resolveMarkerPosition(
  side: CalloutSide,
  cross: number,
  frame: { width: number; height: number },
  half: { w: number; h: number },
  bounds: CalloutRect | null,
  obstacles: CalloutRect[]
) {
  let mx: number, my: number
  if (side === "right") {
    mx = frame.width + CALLOUT.gap
    my = cross
  } else if (side === "left") {
    mx = -CALLOUT.gap
    my = cross
  } else if (side === "top") {
    mx = cross
    my = -CALLOUT.gap
  } else {
    mx = cross
    my = frame.height + CALLOUT.gap
  }

  const clamp = () => {
    if (!bounds) return
    mx = Math.min(Math.max(mx, bounds.left + half.w), bounds.right - half.w)
    my = Math.min(Math.max(my, bounds.top + half.h), bounds.bottom - half.h)
  }
  clamp()

  const vertical = side === "left" || side === "right"
  for (let pass = 0; pass <= obstacles.length; pass++) {
    let moved = false
    for (const ob of obstacles) {
      const overlapX = Math.min(mx + half.w, ob.right) - Math.max(mx - half.w, ob.left)
      const overlapY = Math.min(my + half.h, ob.bottom) - Math.max(my - half.h, ob.top)
      if (overlapX > 0 && overlapY > 0) {
        if (vertical) {
          const c = (ob.top + ob.bottom) / 2
          my = my <= c ? ob.top - half.h - 4 : ob.bottom + half.h + 4
        } else {
          const c = (ob.left + ob.right) / 2
          mx = mx <= c ? ob.left - half.w - 4 : ob.right + half.w + 4
        }
        moved = true
      }
    }
    clamp()
    if (!moved) break
  }
  return { mx, my }
}

// Anchor each leader on its target element's edge (subdividing only when several
// share one element edge), stack the markers in a column/row centred on the
// group, keep them inside the preview and off obstacles, and return a rounded path.
function buildAnnotationCallouts(items: AnnotationCalloutItem[], geo: CalloutGeometry) {
  const { frame, targets, bounds, obstacles } = geo
  const cornerItems = items.filter((it) => CALLOUT_CORNERS.has(it.side))
  const edgeItems = items.filter(
    (it): it is AnnotationCalloutItem & { side: CalloutSide } =>
      !CALLOUT_CORNERS.has(it.side)
  )
  const anchorGroups = new Map<string, AnnotationCalloutItem["id"][]>()
  for (const it of edgeItems) {
    const key = `${it.target}:${it.side}`
    const g = anchorGroups.get(key)
    if (g) g.push(it.id)
    else anchorGroups.set(key, [it.id])
  }

  const anchored = edgeItems
    .map((it) => {
      const t = targets[it.target]
      if (!t) return null
      const group = anchorGroups.get(`${it.target}:${it.side}`)!
      const af = (group.indexOf(it.id) + 0.5) / group.length
      const vertical = it.side === "left" || it.side === "right"
      let ax: number, ay: number
      if (it.side === "right") {
        ax = t.right
        ay = t.top + (t.bottom - t.top) * af
      } else if (it.side === "left") {
        ax = t.left
        ay = t.top + (t.bottom - t.top) * af
      } else if (it.side === "top") {
        ax = t.left + (t.right - t.left) * af
        ay = t.top
      } else {
        ax = t.left + (t.right - t.left) * af
        ay = t.bottom
      }
      return { it, ax, ay, vertical }
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)

  // Markers stack in a centred column/row so a single one aligns with its
  // element (straight) and several bunch into a tidy stack (rounded elbows).
  const markerCross = new Map<AnnotationCalloutItem["id"], number>()
  const sides = new Map<CalloutSide, typeof anchored>()
  for (const a of anchored) {
    const g = sides.get(a.it.side)
    if (g) g.push(a)
    else sides.set(a.it.side, [a])
  }
  for (const [, group] of sides) {
    const crossOf = (a: (typeof anchored)[number]) => (a.vertical ? a.ay : a.ax)
    const mean = group.reduce((sum, a) => sum + crossOf(a), 0) / group.length
    const sorted = [...group].sort((x, y) => crossOf(x) - crossOf(y))
    const k = sorted.length
    sorted.forEach((a, j) =>
      markerCross.set(a.it.id, mean + (j - (k - 1) / 2) * CALLOUT.spacing)
    )
  }

  const edgeBuilt = anchored.map(({ it, ax, ay }) => {
    const half = it.label ? CALLOUT_HALF.label : CALLOUT_HALF.marker
    const { mx, my } = resolveMarkerPosition(
      it.side,
      markerCross.get(it.id)!,
      frame,
      half,
      bounds,
      obstacles
    )
    // The gutter turns ELBOW px past the frame edge but never overshoots the
    // (possibly clamped) marker, so a pulled-in leader stays a clean elbow.
    let pts: [number, number][]
    if (it.side === "right") {
      const gx = Math.min(frame.width + CALLOUT.elbow, mx - CALLOUT.markerRadius)
      pts = [[ax, ay], [gx, ay], [gx, my], [mx - CALLOUT.markerRadius, my]]
    } else if (it.side === "left") {
      const gx = Math.max(-CALLOUT.elbow, mx + CALLOUT.markerRadius)
      pts = [[ax, ay], [gx, ay], [gx, my], [mx + CALLOUT.markerRadius, my]]
    } else if (it.side === "top") {
      const gy = Math.max(-CALLOUT.elbow, my + CALLOUT.markerRadius)
      pts = [[ax, ay], [ax, gy], [mx, gy], [mx, my + CALLOUT.markerRadius]]
    } else {
      const gy = Math.min(frame.height + CALLOUT.elbow, my - CALLOUT.markerRadius)
      pts = [[ax, ay], [ax, gy], [mx, gy], [mx, my - CALLOUT.markerRadius]]
    }
    return {
      id: it.id,
      content: it.content,
      label: it.label,
      ax,
      ay,
      mx,
      my,
      d: calloutRoundedPath(calloutSimplify(pts), CALLOUT.corner),
      arc: undefined as string | undefined,
    }
  })

  return [...edgeBuilt, ...buildCornerCallouts(cornerItems, geo)]
}

// Trace a target's rounded corner as an outer stroke: a quarter-circle arc sat a
// small gap OUTSIDE the corner (concentric — outer radius = inner radius + gap),
// with short straight tails continuing along each edge. `anchor` is the arc's 45°
// midpoint where the radius leader connects.
function calloutCornerArc(t: CalloutBox, corner: CalloutCorner) {
  const r = Math.max(
    0,
    Math.min(t.radius, (t.right - t.left) / 2, (t.bottom - t.top) / 2)
  )
  if (r < 0.5) return null
  const { left, top, right, bottom } = t
  const k = Math.SQRT1_2 // cos/sin 45°
  // Push the stroke's centreline past a clear gap so the whole stroke reads OUTSIDE
  // the surface with the gap intact.
  const off = CALLOUT.cornerGap + CALLOUT.cornerStroke / 2
  const R = r + off
  const ext = CALLOUT.cornerEdge
  let arc: string
  let anchor: [number, number]
  if (corner === "top-left") {
    const cx = left + r
    const cy = top + r
    arc = `M ${left - off} ${cy + ext} L ${left - off} ${cy} A ${R} ${R} 0 0 1 ${cx} ${top - off} L ${cx + ext} ${top - off}`
    anchor = [cx - R * k, cy - R * k]
  } else if (corner === "top-right") {
    const cx = right - r
    const cy = top + r
    arc = `M ${cx - ext} ${top - off} L ${cx} ${top - off} A ${R} ${R} 0 0 1 ${right + off} ${cy} L ${right + off} ${cy + ext}`
    anchor = [cx + R * k, cy - R * k]
  } else if (corner === "bottom-right") {
    const cx = right - r
    const cy = bottom - r
    arc = `M ${right + off} ${cy - ext} L ${right + off} ${cy} A ${R} ${R} 0 0 1 ${cx} ${bottom + off} L ${cx - ext} ${bottom + off}`
    anchor = [cx + R * k, cy + R * k]
  } else {
    const cx = left + r
    const cy = bottom - r
    arc = `M ${cx + ext} ${bottom + off} L ${cx} ${bottom + off} A ${R} ${R} 0 0 1 ${left - off} ${cy} L ${left - off} ${cy - ext}`
    anchor = [cx - R * k, cy + R * k]
  }
  return { arc, anchor, r: R }
}

// Corner callouts: highlight the arc and float a radius chip out along the
// diagonal, its straight leader anchored on the arc's midpoint.
function buildCornerCallouts(
  items: (AnnotationCalloutItem & { side: string })[],
  geo: CalloutGeometry
) {
  const { targets, bounds } = geo
  return items
    .map((it) => {
      const t = targets[it.target]
      if (!t) return null
      const corner = it.side as CalloutCorner
      const geoCorner = calloutCornerArc(t, corner)
      if (!geoCorner) return null
      const { arc, anchor } = geoCorner
      const sx = corner.endsWith("left") ? -1 : 1
      const sy = corner.startsWith("top") ? -1 : 1
      const k = Math.SQRT1_2
      const half = it.label ? CALLOUT_HALF.label : CALLOUT_HALF.marker
      let mx = anchor[0] + sx * k * CALLOUT.gap
      let my = anchor[1] + sy * k * CALLOUT.gap
      if (bounds) {
        mx = Math.min(Math.max(mx, bounds.left + half.w), bounds.right - half.w)
        my = Math.min(Math.max(my, bounds.top + half.h), bounds.bottom - half.h)
      }
      // A straight leader from the arc to the chip, pulled back off the marker.
      const dx = mx - anchor[0]
      const dy = my - anchor[1]
      const len = Math.hypot(dx, dy) || 1
      const ex = mx - (dx / len) * CALLOUT.markerRadius
      const ey = my - (dy / len) * CALLOUT.markerRadius
      return {
        id: it.id,
        content: it.content,
        label: it.label,
        ax: anchor[0],
        ay: anchor[1],
        mx,
        my,
        d: `M ${anchor[0].toFixed(1)} ${anchor[1].toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        arc,
      }
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
}

/**
 * AnnotationCallouts — a measured, reusable numbered-callout overlay. Mark
 * target elements inside a relatively-positioned container with `data-annotate`,
 * then declare `items` referencing those keys. Each leader anchors on its
 * element's edge midpoint (subdividing a shared edge), stacks its number/label
 * in the margin with a rounded elbow, and on hover highlights itself, outlines
 * its element, and fades the rest to faint. Render it as a child of the container.
 */
function AnnotationCallouts({
  items,
  active = true,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "content"> & {
  items: AnnotationCalloutItem[]
  active?: boolean
}) {
  const layerRef = React.useRef<HTMLDivElement>(null)
  const [geo, setGeo] = React.useState<CalloutGeometry | null>(null)
  const [hovered, setHovered] = React.useState<AnnotationCalloutItem["id"] | null>(null)
  const [lastHovered, setLastHovered] = React.useState<
    AnnotationCalloutItem["id"] | null
  >(items[0]?.id ?? null)

  React.useLayoutEffect(() => {
    const container = layerRef.current?.parentElement
    if (!container) return

    const measure = () => {
      const base = container.getBoundingClientRect()
      const toRect = (el: Element): CalloutRect => {
        const r = el.getBoundingClientRect()
        return {
          left: r.left - base.left,
          top: r.top - base.top,
          right: r.right - base.left,
          bottom: r.bottom - base.top,
        }
      }

      const targets: Record<string, CalloutBox> = {}
      container.querySelectorAll<HTMLElement>("[data-annotate]").forEach((el) => {
        const key = el.dataset.annotate
        if (!key) return
        targets[key] = {
          ...toRect(el),
          radius: Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
        }
      })

      // Keep markers inside the clipping ancestor (the preview canvas) and off
      // any element opted out with data-annotate-avoid (a toolbar, a checkbox…).
      const clip = calloutClipAncestor(container)
      const bounds = clip
        ? (() => {
            const b = toRect(clip)
            return {
              left: b.left + CALLOUT.boundsMargin,
              top: b.top + CALLOUT.boundsMargin,
              right: b.right - CALLOUT.boundsMargin,
              bottom: b.bottom - CALLOUT.boundsMargin,
            }
          })()
        : null
      const obstacles: CalloutRect[] = []
      ;(clip ?? container)
        .querySelectorAll<HTMLElement>("[data-annotate-avoid]")
        .forEach((el) => obstacles.push(toRect(el)))

      setGeo({
        frame: { width: base.width, height: base.height },
        targets,
        bounds,
        obstacles,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    const clip = calloutClipAncestor(container)
    if (clip) observer.observe(clip)
    return () => observer.disconnect()
  }, [])

  const built = geo ? buildAnnotationCallouts(items, geo) : []
  const outlineItem = items.find((it) => it.id === lastHovered)
  const outline = geo && outlineItem ? geo.targets[outlineItem.target] : undefined

  return (
    <AnnotationLayer ref={layerRef} active={active} className={className} {...props}>
      {outline ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute border border-dotted border-destructive transition-opacity duration-(--speed-swift) ease-(--ease-settle)",
            hovered !== null ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: outline.left - CALLOUT.outlinePad,
            top: outline.top - CALLOUT.outlinePad,
            width: outline.right - outline.left + CALLOUT.outlinePad * 2,
            height: outline.bottom - outline.top + CALLOUT.outlinePad * 2,
            borderRadius: outline.radius + CALLOUT.outlinePad,
          }}
        />
      ) : null}
      {built.map((c) => {
        const dimmed = hovered !== null && hovered !== c.id
        const fade = cn(
          "transition-opacity duration-(--speed-swift) ease-(--ease-settle)",
          dimmed && "opacity-20"
        )
        const isActive = hovered === c.id
        const hover = {
          onPointerEnter: () => {
            setLastHovered(c.id)
            setHovered(c.id)
          },
          onPointerLeave: () => setHovered(null),
        }
        return (
          <React.Fragment key={c.id}>
            <AnnotationConnector d={c.d} arc={c.arc} anchor={[c.ax, c.ay]} className={fade} />
            <Annotation
              className={cn("-translate-x-1/2 -translate-y-1/2", fade)}
              style={{ left: c.mx, top: c.my }}
            >
              {c.label ? (
                <AnnotationLabel
                  {...hover}
                  className={cn(
                    "relative transition-colors duration-(--speed-swift) after:absolute after:-inset-1",
                    isActive && "border-destructive bg-destructive text-white"
                  )}
                >
                  {c.content}
                </AnnotationLabel>
              ) : (
                <AnnotationMarker
                  {...hover}
                  className={cn(
                    "relative transition-colors duration-(--speed-swift) after:absolute after:-inset-2",
                    isActive && "bg-destructive text-white"
                  )}
                >
                  {c.content}
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
export type { AnnotationCalloutItem }
