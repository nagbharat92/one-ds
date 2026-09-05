export type AnnotationRect = { left: number; top: number; right: number; bottom: number }
export type AnnotationSide = "left" | "right" | "top" | "bottom"
export type AnnotationPlacementInput = {
  id: string | number
  anchor: [number, number]
  anchors?: Partial<Record<AnnotationSide, [number, number]>>
  preferredSide: AnnotationSide
  allowedSides?: AnnotationSide[]
  locked?: boolean
  preferRoom?: boolean
  width: number
  height: number
}
export type AnnotationPlacement = {
  id: string | number
  side: AnnotationSide
  rect: AnnotationRect
  points: [number, number][]
}

function overlaps(first: AnnotationRect, second: AnnotationRect, gap = 0) {
  return first.left < second.right + gap && first.right + gap > second.left &&
    first.top < second.bottom + gap && first.bottom + gap > second.top
}

export function placeAnnotations({
  items,
  bounds,
  specimen,
  obstacles,
  gap,
  distance,
  minDistance = gap,
}: {
  items: AnnotationPlacementInput[]
  bounds: AnnotationRect
  specimen: AnnotationRect
  obstacles: AnnotationRect[]
  gap: number
  distance: number
  minDistance?: number
}) {
  const placed: AnnotationPlacement[] = []
  const unplaced: (string | number)[] = []
  const sides: AnnotationSide[] = ["bottom", "top", "right", "left"]
  const blocked = [specimen, ...obstacles]

  for (const item of [...items].sort((first, second) => Number(!!second.locked) - Number(!!first.locked))) {
    const allowed = item.locked ? [item.preferredSide] :
      [...new Set([item.preferredSide, ...(item.allowedSides ?? sides)])]
    const occupied = [...blocked, ...placed.map(placement => placement.rect)]
    const candidates: { placement: AnnotationPlacement; score: number }[] = []
    for (const side of allowed) {
      const anchor = item.anchors?.[side] ?? item.anchor
      const vertical = side === "left" || side === "right"
      const crossSize = vertical ? item.height : item.width
      const mainSize = vertical ? item.width : item.height
      const crossMin = (vertical ? bounds.top : bounds.left) + crossSize / 2
      const crossMax = (vertical ? bounds.bottom : bounds.right) - crossSize / 2
      if (crossMin > crossMax) continue
      const anchorCross = anchor[vertical ? 1 : 0]
      const crossCandidates = [anchorCross, crossMin, crossMax]
      for (const obstacle of occupied) {
        crossCandidates.push(
          (vertical ? obstacle.top : obstacle.left) - gap - crossSize / 2,
          (vertical ? obstacle.bottom : obstacle.right) + gap + crossSize / 2
        )
      }
      const positive = side === "right" || side === "bottom"
      const edge = side === "right" ? specimen.right : side === "left" ? specimen.left :
        side === "bottom" ? specimen.bottom : specimen.top
      const outer = side === "right" ? bounds.right : side === "left" ? bounds.left :
        side === "bottom" ? bounds.bottom : bounds.top
      const minimumGap = Math.max(gap, minDistance)
      if (minimumGap > distance) continue
      const near = edge + (positive ? 1 : -1) * (minimumGap + mainSize / 2)
      const availableFar = outer - (positive ? 1 : -1) * mainSize / 2
      const limit = edge + (positive ? 1 : -1) * (distance + mainSize / 2)
      const far = positive ? Math.min(availableFar, limit) : Math.max(availableFar, limit)
      if (positive ? near > far : near < far) continue
      const preferred = limit
      const mainCandidates = [Math.max(Math.min(near, far), Math.min(preferred, Math.max(near, far))), near, far]
      for (const obstacle of occupied) {
        mainCandidates.push(
          (vertical ? obstacle.left : obstacle.top) - gap - mainSize / 2,
          (vertical ? obstacle.right : obstacle.bottom) + gap + mainSize / 2
        )
      }
      for (const main of mainCandidates) {
        if (main < Math.min(near, far) || main > Math.max(near, far)) continue
        for (const crossValue of crossCandidates) {
          const cross = Math.max(crossMin, Math.min(crossValue, crossMax))
          const centerX = vertical ? main : cross
          const centerY = vertical ? cross : main
          const rect = { left: centerX - item.width / 2, right: centerX + item.width / 2,
            top: centerY - item.height / 2, bottom: centerY + item.height / 2 }
          if (occupied.some(obstacle => overlaps(rect, obstacle, gap))) continue
          const end: [number, number] = side === "left" ? [rect.right, centerY] :
            side === "right" ? [rect.left, centerY] : side === "top" ? [centerX, rect.bottom] : [centerX, rect.top]
          const corridor = edge + (positive ? gap / 2 : -gap / 2)
          const points: [number, number][] = vertical
            ? [anchor, [corridor, anchor[1]], [corridor, centerY], end]
            : [anchor, [anchor[0], corridor], [centerX, corridor], end]
          let crossings = 0
          for (let index = 1; index < points.length; index++) {
            const start = points[index - 1]
            const finish = points[index]
            const segment = { left: Math.min(start[0], finish[0]), right: Math.max(start[0], finish[0]),
              top: Math.min(start[1], finish[1]), bottom: Math.max(start[1], finish[1]) }
            if ([...obstacles, ...placed.map(placement => placement.rect)].some(obstacle => overlaps(segment, obstacle, gap / 2))) crossings++
          }
          let freeStart = Math.min(near, availableFar)
          let freeEnd = Math.max(near, availableFar)
          if (item.preferRoom) {
            for (const obstacle of occupied) {
              const crossStart = vertical ? obstacle.top : obstacle.left
              const crossEnd = vertical ? obstacle.bottom : obstacle.right
              if (cross + crossSize / 2 + gap <= crossStart || cross - crossSize / 2 - gap >= crossEnd) continue
              const mainStart = vertical ? obstacle.left : obstacle.top
              const mainEnd = vertical ? obstacle.right : obstacle.bottom
              if (mainEnd <= main) freeStart = Math.max(freeStart, mainEnd + gap + mainSize / 2)
              if (mainStart >= main) freeEnd = Math.min(freeEnd, mainStart - gap - mainSize / 2)
            }
          }
          const room = Math.max(0, freeEnd - freeStart)
          const score = (item.preferRoom || side === item.preferredSide ? 0 : distance) +
            Math.abs(cross - anchorCross) + Math.abs(main - preferred) + crossings * distance * 4 -
            (item.preferRoom ? Math.min(room, distance * 2) : 0)
          candidates.push({ placement: { id: item.id, side, rect, points }, score })
        }
      }
    }
    candidates.sort((first, second) => first.score - second.score)
    if (candidates[0]) placed.push(candidates[0].placement)
    else unplaced.push(item.id)
  }
  return { placed, unplaced }
}