export type MeasurementRect = { left: number; top: number; right: number; bottom: number }
export type MeasurementEdges = { top: number; right: number; bottom: number; left: number }
export type BoxMeasurementKind = "padding" | "border" | "margin"
export type BoxMeasurementRegion = {
  kind: BoxMeasurementKind
  side: keyof MeasurementEdges
  rect: MeasurementRect
}

function insetRect(rect: MeasurementRect, edges: MeasurementEdges): MeasurementRect {
  return {
    left: rect.left + edges.left,
    top: rect.top + edges.top,
    right: rect.right - edges.right,
    bottom: rect.bottom - edges.bottom,
  }
}

export function measureBoxRegions({
  box,
  padding,
  border,
  margin,
}: {
  box: MeasurementRect
  padding: MeasurementEdges
  border: MeasurementEdges
  margin: MeasurementEdges
}): BoxMeasurementRegion[] {
  const paddingBox = insetRect(box, border)
  const contentBox = insetRect(paddingBox, padding)
  const positiveMargin = Object.fromEntries(
    Object.entries(margin).map(([side, value]) => [side, Math.max(0, value)])
  ) as MeasurementEdges
  const marginBox = insetRect(box, {
    top: -positiveMargin.top,
    right: -positiveMargin.right,
    bottom: -positiveMargin.bottom,
    left: -positiveMargin.left,
  })
  const bands: { kind: BoxMeasurementKind; outer: MeasurementRect; inner: MeasurementRect }[] = [
    { kind: "margin", outer: marginBox, inner: box },
    { kind: "border", outer: box, inner: paddingBox },
    { kind: "padding", outer: paddingBox, inner: contentBox },
  ]
  return bands.flatMap(({ kind, outer, inner }) => {
    const regions: BoxMeasurementRegion[] = [
      { kind, side: "top", rect: { ...outer, bottom: inner.top } },
      { kind, side: "right", rect: { left: inner.right, right: outer.right, top: inner.top, bottom: inner.bottom } },
      { kind, side: "bottom", rect: { ...outer, top: inner.bottom } },
      { kind, side: "left", rect: { left: outer.left, right: inner.left, top: inner.top, bottom: inner.bottom } },
    ]
    return regions.filter(({ rect }) => rect.right > rect.left && rect.bottom > rect.top)
  })
}

export function measureLinearGaps({
  children,
  axis,
  gap,
  tolerance,
}: {
  children: MeasurementRect[]
  axis: "horizontal" | "vertical"
  gap: number
  tolerance: number
}): MeasurementRect[] | null {
  if (children.length < 2 || gap === 0) return []
  if (!Number.isFinite(gap) || gap < 0) return null
  const horizontal = axis === "horizontal"
  const start = horizontal ? "left" : "top"
  const end = horizontal ? "right" : "bottom"
  const crossStart = horizontal ? "top" : "left"
  const crossEnd = horizontal ? "bottom" : "right"
  const sorted = [...children].sort((first, second) => first[start] - second[start])
  const regions: MeasurementRect[] = []
  for (let index = 1; index < sorted.length; index++) {
    const previous = sorted[index - 1]
    const next = sorted[index]
    const low = Math.max(previous[crossStart], next[crossStart])
    const high = Math.min(previous[crossEnd], next[crossEnd])
    if (low >= high || Math.abs(next[start] - previous[end] - gap) > tolerance) return null
    regions.push(horizontal
      ? { left: previous.right, right: next.left, top: low, bottom: high }
      : { left: low, right: high, top: previous.bottom, bottom: next.top })
  }
  return regions
}