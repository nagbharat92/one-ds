import assert from "node:assert/strict"
import test from "node:test"
import { placeAnnotations } from "../src/lib/annotation-layout.ts"

const defaults = {
  bounds: { left: 8, top: 8, right: 352, bottom: 280 },
  specimen: { left: 33, top: 85, right: 327, bottom: 151 },
  obstacles: [],
  gap: 8,
  distance: 64,
  minDistance: 16,
}
const item = { id: "radius", anchor: [327, 100], preferredSide: "right", width: 64, height: 22 }
const overlaps = (first, second) => first.left < second.right && first.right > second.left &&
  first.top < second.bottom && first.bottom > second.top

test("uses bottom space when the right side cannot fit the actual label", () => {
  const result = placeAnnotations({ ...defaults, items: [item] })
  assert.equal(result.placed[0].side, "bottom")
  assert.deepEqual(result.placed[0].points[0], item.anchor)
  assert.deepEqual(result.unplaced, [])
})

test("protects UI and previously placed labels in one occupancy map", () => {
  const items = Array.from({ length: 6 }, (_, index) => ({ ...item, id: index }))
  const result = placeAnnotations({ ...defaults, items })
  assert.equal(result.placed.length, items.length)
  for (const [index, placement] of result.placed.entries()) {
    assert.equal(overlaps(placement.rect, defaults.specimen), false)
    for (const other of result.placed.slice(index + 1)) assert.equal(overlaps(placement.rect, other.rect), false)
  }
})

test("avoids controls below the specimen", () => {
  const obstacle = { left: 8, top: 159, right: 352, bottom: 280 }
  const result = placeAnnotations({ ...defaults, items: [item], obstacles: [obstacle] })
  assert.equal(result.placed[0].side, "top")
  assert.equal(overlaps(result.placed[0].rect, obstacle), false)
})

test("measured long labels fit within the boundary", () => {
  const result = placeAnnotations({ ...defaults, items: [{ ...item, width: 300 }] })
  assert.equal(result.placed.length, 1)
  assert.equal(result.placed[0].rect.right - result.placed[0].rect.left, 300)
  assert.ok(result.placed[0].rect.left >= defaults.bounds.left)
  assert.ok(result.placed[0].rect.right <= defaults.bounds.right)
})

test("locked placements report insufficient space instead of overlapping", () => {
  const result = placeAnnotations({ ...defaults, items: [{ ...item, locked: true }] })
  assert.deepEqual(result.placed, [])
  assert.deepEqual(result.unplaced, [item.id])
})

test("does not invent space for an oversized label", () => {
  const result = placeAnnotations({ ...defaults, items: [{ ...item, width: 500, height: 500 }] })
  assert.deepEqual(result.unplaced, [item.id])
})

test("placement is deterministic and does not mutate its input", () => {
  const input = { ...defaults, items: [item] }
  const snapshot = structuredClone(input)
  assert.deepEqual(placeAnnotations(input), placeAnnotations(input))
  assert.deepEqual(input, snapshot)
})

test("connector terminates on the actual chip boundary", () => {
  const { placed } = placeAnnotations({ ...defaults, items: [item] })
  const placement = placed[0]
  assert.deepEqual(placement.points.at(-1), [(placement.rect.left + placement.rect.right) / 2, placement.rect.top])
})

const cornerFrame = {
  ...defaults,
  bounds: { left: 0, top: 0, right: 600, bottom: 280 },
  specimen: { left: 180, top: 80, right: 420, bottom: 200 },
}

test("automatic corners choose the roomier adjacent side without moving the anchor", () => {
  for (const [anchor, preferredSide, adjacent] of [
    [[180, 80], "top", "left"],
    [[420, 80], "top", "right"],
    [[180, 200], "bottom", "left"],
    [[420, 200], "bottom", "right"],
  ]) {
    const result = placeAnnotations({ ...cornerFrame, items: [{ ...item, width: 28, anchor,
      preferredSide, allowedSides: [adjacent], preferRoom: true }] })
    assert.equal(result.placed[0].side, adjacent)
    assert.deepEqual(result.placed[0].points[0], anchor)
  }
})

test("automatic corners choose top when the side gutter is narrower", () => {
  const result = placeAnnotations({ ...defaults,
    specimen: { left: 33, top: 140, right: 327, bottom: 220 },
    items: [{ ...item, anchor: [33, 140], preferredSide: "top", allowedSides: ["left"], preferRoom: true }],
  })
  assert.equal(result.placed[0].side, "top")
})

test("a roomy but obstructed corner side does not win", () => {
  const result = placeAnnotations({ ...cornerFrame,
    obstacles: [{ left: 0, top: 0, right: 172, bottom: 280 }],
    items: [{ ...item, width: 28, anchor: [180, 80], preferredSide: "top", allowedSides: ["left"], preferRoom: true }],
  })
  assert.equal(result.placed[0].side, "top")
})

test("authored preferences and locked corners keep their chosen side", () => {
  for (const locked of [false, true]) {
    const result = placeAnnotations({ ...cornerFrame, items: [{ ...item, width: 28,
      anchor: [180, 80], preferredSide: "top", allowedSides: ["left"], locked }],
    })
    assert.equal(result.placed[0].side, "top")
  }
})

test("outside label gaps stay between the minimum and maximum on every side", () => {
  for (const side of ["left", "right", "top", "bottom"]) {
    const result = placeAnnotations({ ...defaults,
      bounds: { left: 0, top: 0, right: 1000, bottom: 1000 },
      specimen: { left: 400, top: 400, right: 600, bottom: 600 },
      items: [{ ...item, preferredSide: side, locked: true }],
    })
    assert.equal(result.placed.length, 1)
    const rect = result.placed[0].rect
    const gap = side === "left" ? 400 - rect.right : side === "right" ? rect.left - 600 :
      side === "top" ? 400 - rect.bottom : rect.top - 600
    assert.ok(gap >= 16 && gap <= 64)
  }
})

test("shrinks the connector gap to respect 24px boundary padding", () => {
  const result = placeAnnotations({ ...defaults,
    bounds: { left: 24, top: 24, right: 376, bottom: 276 },
    specimen: { left: 80, top: 80, right: 280, bottom: 210 },
    items: [{ ...item, anchor: [180, 210], preferredSide: "bottom", locked: true }],
  })
  const rect = result.placed[0].rect
  assert.equal(rect.bottom, 276)
  assert.ok(rect.top - 210 >= 16 && rect.top - 210 < 64)
})

test("edge callout dots follow the side chosen for their label", () => {
  const anchors = { left: [200, 140], right: [240, 140], top: [220, 120], bottom: [220, 160] }
  for (const preferredSide of ["left", "right", "top", "bottom"]) {
    const result = placeAnnotations({ ...cornerFrame,
      items: [{ ...item, width: 28, anchor: anchors.top, anchors, preferredSide, locked: true }],
    })
    assert.equal(result.placed[0].side, preferredSide)
    assert.deepEqual(result.placed[0].points[0], anchors[preferredSide])
  }
})

test("automatic side fallback moves both the anchor and connector", () => {
  const anchors = { right: [327, 100], bottom: [180, 151] }
  const result = placeAnnotations({ ...defaults, items: [{ ...item, anchors }] })
  assert.equal(result.placed[0].side, "bottom")
  assert.deepEqual(result.placed[0].points[0], anchors.bottom)
})