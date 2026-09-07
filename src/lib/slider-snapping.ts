export type SliderSnapMode = "magnetic" | "discrete"

export function sliderSnapPoints(points: number[], min: number, max: number, mode: SliderSnapMode) {
  const candidates = mode === "discrete" ? [min, ...points, max] : points
  return [...new Set(candidates.filter(point => Number.isFinite(point) && point >= min && point <= max))].sort((left, right) => left - right)
}

export function snapSliderValue(value: number, previous: number, points: number[], mode: SliderSnapMode, threshold: number, stepping: boolean) {
  if (!points.length) return value
  if (stepping && mode === "magnetic") return value
  if (stepping && mode === "discrete") {
    if (value > previous) return points.find(point => point > previous) ?? previous
    if (value < previous) return points.findLast(point => point < previous) ?? previous
    return previous
  }
  const nearest = points.reduce((closest, point) => Math.abs(point - value) < Math.abs(closest - value) ? point : closest)
  return mode === "discrete" || Math.abs(nearest - value) <= threshold ? nearest : value
}