type Point = readonly [number, number]

const pointText = ([horizontal, vertical]: Point) => `${horizontal.toFixed(4)} ${vertical.toFixed(4)}`
const between = (start: Point, end: Point, amount: number): Point => [
  start[0] + (end[0] - start[0]) * amount,
  start[1] + (end[1] - start[1]) * amount,
]

function roundedPolygon(vertices: Point[], rounding = 0.18) {
  return vertices.map((vertex, index) => {
    const previous = vertices[(index + vertices.length - 1) % vertices.length]
    const next = vertices[(index + 1) % vertices.length]
    return `${index ? "L" : "M"}${pointText(between(vertex, previous, rounding))} Q${pointText(vertex)} ${pointText(between(vertex, next, rounding))}`
  }).join(" ") + " Z"
}

function regularPolygon(sides: number, rotation = -Math.PI / 2, rounding = 0.22) {
  return roundedPolygon(Array.from({ length: sides }, (_, index): Point => {
    const angle = rotation + index * Math.PI * 2 / sides
    return [50 + 44 * Math.cos(angle), 50 + 44 * Math.sin(angle)]
  }), rounding)
}

function radialShape(lobes: number, depth: number, rotation = -Math.PI / 2) {
  const count = lobes * 16
  const points = Array.from({ length: count }, (_, index): Point => {
    const phase = index * Math.PI * 2 / count
    const radius = 44 - depth + depth * Math.cos(lobes * phase)
    return [50 + radius * Math.cos(phase + rotation), 50 + radius * Math.sin(phase + rotation)]
  })
  return points.map((point, index) => {
    const previous = points[(index + count - 1) % count]
    const next = points[(index + 1) % count]
    const following = points[(index + 2) % count]
    const first: Point = [point[0] + (next[0] - previous[0]) / 6, point[1] + (next[1] - previous[1]) / 6]
    const second: Point = [next[0] - (following[0] - point[0]) / 6, next[1] - (following[1] - point[1]) / 6]
    return `${index ? "" : `M${pointText(point)} `}C${pointText(first)} ${pointText(second)} ${pointText(next)}`
  }).join(" ") + " Z"
}

export const shapePaths = {
  circle: { label: "Circle", path: "M50 6 A44 44 0 1 1 50 94 A44 44 0 1 1 50 6 Z" },
  square: { label: "Square", path: "M26 6 H74 Q94 6 94 26 V74 Q94 94 74 94 H26 Q6 94 6 74 V26 Q6 6 26 6 Z" },
  slanted: { label: "Slanted", path: roundedPolygon([[15, 8], [96, 8], [85, 92], [4, 92]]) },
  arch: { label: "Arch", path: "M6 50 A44 44 0 0 1 94 50 V82 Q94 94 82 94 H18 Q6 94 6 82 Z" },
  semicircle: { label: "Semicircle", path: "M14 72 Q6 72 6 64 A44 44 0 0 1 94 64 Q94 72 86 72 Z" },
  oval: { label: "Oval", path: "M23.13 76.87 A23 43 45 1 1 76.87 23.13 A23 43 45 1 1 23.13 76.87 Z" },
  pill: { label: "Pill", path: "M18 38 L38 18 A31.1127 31.1127 0 0 1 82 62 L62 82 A31.1127 31.1127 0 0 1 18 38 Z" },
  triangle: { label: "Triangle", path: roundedPolygon([[50, 4], [98, 90], [2, 90]], 0.18) },
  arrow: { label: "Arrow", path: "M40 12 Q50 0 60 12 L91 64 C106 90 88 97 69 89 Q50 80 31 89 C12 97 -6 90 9 64 Z" },
  fan: { label: "Fan", path: "M18 8 A74 74 0 0 1 92 82 Q92 92 82 92 H18 Q8 92 8 82 V18 Q8 8 18 8 Z" },
  diamond: { label: "Diamond", path: roundedPolygon([[50, 3], [90, 50], [50, 97], [10, 50]], 0.18) },
  clamshell: { label: "Clamshell", path: roundedPolygon([[26, 12], [74, 12], [98, 50], [74, 88], [26, 88], [2, 50]], 0.2) },
  pentagon: { label: "Pentagon", path: regularPolygon(5) },
  gem: { label: "Gem", path: regularPolygon(6) },
  verySunny: { label: "Very sunny", path: radialShape(10, 3.8) },
  sunny: { label: "Sunny", path: radialShape(8, 5) },
  cookie4: { label: "4-sided cookie", path: radialShape(4, 5, -Math.PI / 4) },
  cookie6: { label: "6-sided cookie", path: radialShape(6, 3) },
  cookie7: { label: "7-sided cookie", path: radialShape(7, 2.8) },
  cookie9: { label: "9-sided cookie", path: radialShape(9, 2.5) },
  cookie12: { label: "12-sided cookie", path: radialShape(12, 2) },
  clover4: { label: "4-leaf clover", path: radialShape(4, 8, -Math.PI / 4) },
  clover8: { label: "8-leaf clover", path: radialShape(8, 3.8, -Math.PI / 8) },
} as const

export type ShapeName = keyof typeof shapePaths
export const shapeNames = Object.keys(shapePaths) as ShapeName[]