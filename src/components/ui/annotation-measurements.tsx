import * as React from "react"

import { AnnotationCallouts, type AnnotationCalloutItem, type AnnotationKind } from "@/components/ui/annotation"
import { AnnotationRegion } from "@/components/ui/annotation-region"
import { measureBoxRegions, measureLinearGaps, type MeasurementEdges, type MeasurementRect } from "@/lib/annotation-measurements"

type AnnotationMeasurementTarget = {
  target: string
  label: string
  kinds: readonly AnnotationKind[]
  captions?: {
    bounds?: string
    padding?: Partial<Record<keyof MeasurementEdges, string>>
    border?: Partial<Record<keyof MeasurementEdges, string>>
    margin?: Partial<Record<keyof MeasurementEdges, string>>
    gaps?: readonly string[]
  }
}
type MeasuredRegion = {
  item: AnnotationCalloutItem & { kind: AnnotationKind }
  rect: MeasurementRect
  clipPath?: string
}
type MeasurementSnapshot = { regions: MeasuredRegion[]; issues: string[] }

function AnnotationMeasurements({
  targets,
  active = false,
  onMeasurementIssues,
}: {
  targets: readonly AnnotationMeasurementTarget[]
  active?: boolean
  onMeasurementIssues?: (issues: string[]) => void
}) {
  const layerRef = React.useRef<HTMLDivElement>(null)
  const metricsRef = React.useRef<HTMLSpanElement>(null)
  const [snapshot, setSnapshot] = React.useState<MeasurementSnapshot>({ regions: [], issues: [] })
  const [selected, setSelected] = React.useState<AnnotationCalloutItem["id"] | null>(null)

  React.useLayoutEffect(() => {
    const layer = layerRef.current
    const container = layer?.parentElement
    const metrics = metricsRef.current
    if (!layer || !container || !metrics) return
    let frame = 0
    let disposed = false
    const observed = new Set<Element>()
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const resize = new ResizeObserver(schedule)
    const measure = () => {
      if (disposed) return
      const base = layer.getBoundingClientRect()
      const layerStyle = getComputedStyle(layer)
      const scaleX = base.width / parseFloat(layerStyle.width) || 1
      const scaleY = base.height / parseFloat(layerStyle.height) || 1
      const tolerance = parseFloat(getComputedStyle(metrics).width)
      const toRect = (element: Element): MeasurementRect => {
        const rect = element.getBoundingClientRect()
        return { left: (rect.left - base.left) / scaleX, top: (rect.top - base.top) / scaleY,
          right: (rect.right - base.left) / scaleX, bottom: (rect.bottom - base.top) / scaleY }
      }
      const sources = new Map([...container.querySelectorAll<HTMLElement>("[data-measure]")]
        .map(element => [element.dataset.measure, element]))
      const nextObserved = new Set<Element>([container, layer])
      const regions: MeasuredRegion[] = []
      const issues: string[] = []
      for (const specification of targets) {
        const source = sources.get(specification.target)
        if (!source) {
          issues.push(`${specification.label}: measurement target is missing.`)
          continue
        }
        nextObserved.add(source)
        if (!source.getClientRects().length) continue
        let transformed = false
        for (let ancestor: HTMLElement | null = source; ancestor && ancestor !== container; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor)
          if (style.transform !== "none" || style.rotate !== "none" || style.scale !== "none" || style.translate !== "none") transformed = true
        }
        if (transformed) {
          issues.push(`${specification.label}: individually transformed targets are not supported.`)
          continue
        }
        const style = getComputedStyle(source)
        const box = toRect(source)
        const edges = (prefix: "padding" | "border" | "margin"): MeasurementEdges => {
          const value = (side: string) => parseFloat(style.getPropertyValue(`${prefix}-${side}${prefix === "border" ? "-width" : ""}`)) || 0
          return { top: value("top"), right: value("right"), bottom: value("bottom"), left: value("left") }
        }
        const padding = edges("padding")
        const border = edges("border")
        const margin = edges("margin")
        let clippingSource: HTMLElement | null = source
        while (clippingSource && clippingSource !== container) {
          const clippingStyle = getComputedStyle(clippingSource)
          if (/(hidden|clip|auto|scroll)/.test(`${clippingStyle.overflowX} ${clippingStyle.overflowY}`)) break
          clippingSource = clippingSource.parentElement
        }
        const clipBox = clippingSource && clippingSource !== container ? toRect(clippingSource) : null
        const clipStyle = clipBox && clippingSource ? getComputedStyle(clippingSource) : null
        const append = (kind: AnnotationKind, suffix: string, rect: MeasurementRect, side: AnnotationCalloutItem["side"], caption: string, clip = false) => {
          if (rect.right <= rect.left || rect.bottom <= rect.top) return
          const id = `${specification.target}:${kind}:${suffix}`
          const clipPath = clip && clipBox && clipStyle
            ? `inset(${clipBox.top - rect.top}px ${rect.right - clipBox.right}px ${rect.bottom - clipBox.bottom}px ${clipBox.left - rect.left}px round ${clipStyle.borderTopLeftRadius} ${clipStyle.borderTopRightRadius} ${clipStyle.borderBottomRightRadius} ${clipStyle.borderBottomLeftRadius})`
            : undefined
          regions.push({ item: { id, target: `measurement:${id}`, kind, side, label: true, content: caption }, rect, clipPath })
        }
        if (specification.kinds.includes("bounds")) append("bounds", "box", box, "top", specification.captions?.bounds ?? `${specification.label} bounds`)
        if (source.getClientRects().length > 1 || style.display === "inline") {
          if (specification.kinds.some(kind => kind !== "bounds")) issues.push(`${specification.label}: box-model regions require a single block or inline-block box.`)
          continue
        }
        if (specification.kinds.includes("margin") && Object.values(margin).some(value => value < 0)) {
          issues.push(`${specification.label}: negative margins have no positive fill and are omitted.`)
        }
        for (const region of measureBoxRegions({ box, padding, border, margin })) {
          if (specification.kinds.includes(region.kind)) {
            const caption = specification.captions?.[region.kind]?.[region.side]
              ?? `${specification.label} ${region.kind} ${region.side}`
            append(region.kind, region.side, region.rect, region.side, caption, region.kind !== "margin")
          }
        }
        if (!specification.kinds.includes("gap")) continue
        if (!/^(inline-)?(flex|grid)$/.test(style.display)) {
          issues.push(`${specification.label}: gap measurement requires flex or grid layout.`)
          continue
        }
        const children = [...source.children].filter(child => {
          nextObserved.add(child)
          const childStyle = getComputedStyle(child)
          return child.getClientRects().length && !["absolute", "fixed"].includes(childStyle.position)
        })
        const boxes = children.map(toRect)
        if (boxes.length < 2) continue
        const sameRow = Math.max(...boxes.map(rect => rect.top)) < Math.min(...boxes.map(rect => rect.bottom))
        const axis = style.display.includes("flex")
          ? style.flexDirection.startsWith("row") ? "horizontal" : "vertical"
          : sameRow ? "horizontal" : "vertical"
        const rawGap = axis === "horizontal" ? style.columnGap : style.rowGap
        const gap = rawGap === "normal" ? 0 : rawGap.endsWith("px") ? parseFloat(rawGap) : NaN
        const gaps = measureLinearGaps({ children: boxes, axis, gap, tolerance })
        if (gaps === null) {
          issues.push(`${specification.label}: only single-row or single-column gaps matching the CSS gap are supported.`)
          continue
        }
        gaps.forEach((rect, index) => append("gap", String(index), rect, axis === "horizontal" ? "bottom" : "right", specification.captions?.gaps?.[index] ?? `${specification.label} gap ${index + 1}`))
      }
      for (const element of observed) {
        if (!nextObserved.has(element)) { resize.unobserve(element); observed.delete(element) }
      }
      for (const element of nextObserved) {
        if (!observed.has(element)) { resize.observe(element); observed.add(element) }
      }
      const next = { regions, issues }
      setSnapshot(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next)
    }
    const mutation = new MutationObserver(records => {
      if (records.some(record => !layer.contains(record.target) && !(record.target instanceof Element ? record.target : record.target.parentElement)?.closest('[data-slot="annotation-layer"]'))) schedule()
    })
    mutation.observe(container, { attributes: true, childList: true, characterData: true, subtree: true })
    for (let ancestor = container.parentElement; ancestor; ancestor = ancestor.parentElement) {
      mutation.observe(ancestor, { attributes: true, attributeFilter: ["class", "style"] })
    }
    container.addEventListener("transitionend", schedule)
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", schedule, true)
    document.fonts.ready.then(() => { if (!disposed) schedule() })
    measure()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      mutation.disconnect()
      container.removeEventListener("transitionend", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", schedule, true)
    }
  }, [targets])

  const issuesKey = JSON.stringify(snapshot.issues)
  const reportIssues = React.useEffectEvent((issues: string[]) => onMeasurementIssues?.(issues))
  React.useEffect(() => { reportIssues(JSON.parse(issuesKey)) }, [issuesKey])
  const items = snapshot.regions.map(region => region.item)
  const selectedId = items.some(item => item.id === selected) ? selected : null
  React.useEffect(() => { if (selectedId === null) setSelected(null) }, [selectedId])

  return <>
    <div ref={layerRef} data-slot="annotation-measured-regions" className="pointer-events-none absolute inset-0 z-(--annotation-layer)">
      <span ref={metricsRef} aria-hidden="true" className="invisible absolute w-(--annotation-measurement-tolerance)" />
      {snapshot.regions.map(({ item, rect, clipPath }) => (
        <AnnotationRegion
          key={item.id}
          target={item.target}
          kind={item.kind}
          label={String(item.content)}
          active={active}
          selected={selectedId === item.id}
          onClick={() => setSelected(item.id)}
          style={{ left: rect.left, top: rect.top, width: rect.right - rect.left, height: rect.bottom - rect.top, clipPath }}
        />
      ))}
    </div>
    <AnnotationCallouts active={active} showDimensions items={items} visibility="selected" selectedId={selectedId} onSelectionChange={setSelected} />
    {active && snapshot.issues.length > 0 && <span role="status" className="sr-only">{snapshot.issues.join(" ")}</span>}
  </>
}

export { AnnotationMeasurements }
export type { AnnotationMeasurementTarget }