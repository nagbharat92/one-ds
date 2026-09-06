import assert from "node:assert/strict"
import test from "node:test"
import { measureBoxRegions, measureLinearGaps } from "../src/lib/annotation-measurements.ts"

const zero = { top: 0, right: 0, bottom: 0, left: 0 }
const box = { left: 20, top: 30, right: 220, bottom: 130 }

test("box regions use actual asymmetric border and padding widths without overlap", () => {
  const regions = measureBoxRegions({ box, border: { ...zero, top: 0.8, left: 2 }, padding: { top: 12, right: 16, bottom: 8, left: 24 }, margin: zero })
  assert.deepEqual(regions.find(region => region.kind === "padding" && region.side === "top").rect, { left: 22, right: 220, top: 30.8, bottom: 42.8 })
  assert.deepEqual(regions.find(region => region.kind === "padding" && region.side === "left").rect, { left: 22, right: 46, top: 42.8, bottom: 122 })
  assert.equal(regions.length, 6)
})

test("zero regions disappear and positive margins sit outside the border box", () => {
  assert.deepEqual(measureBoxRegions({ box, border: zero, padding: zero, margin: zero }), [])
  const regions = measureBoxRegions({ box, border: zero, padding: zero, margin: { ...zero, top: 16, left: -8 } })
  assert.deepEqual(regions, [{ kind: "margin", side: "top", rect: { left: 20, right: 220, top: 14, bottom: 30 } }])
})

test("resizing and changed styles produce fresh geometry without mutating inputs", () => {
  const original = structuredClone(box)
  const measure = (size) => measureBoxRegions({ box: { ...box, right: size }, border: zero, padding: { ...zero, top: 20 }, margin: zero })
  assert.equal(measure(320)[0].rect.right, 320)
  assert.equal(measure(180)[0].rect.right, 180)
  assert.deepEqual(box, original)
})

test("horizontal and reversed child order give the same measured gap", () => {
  const children = [{ left: 0, top: 0, right: 60, bottom: 32 }, { left: 68, top: 0, right: 120, bottom: 32 }]
  const options = { axis: "horizontal", gap: 8, tolerance: 0.01 }
  const expected = [{ left: 60, right: 68, top: 0, bottom: 32 }]
  assert.deepEqual(measureLinearGaps({ ...options, children }), expected)
  assert.deepEqual(measureLinearGaps({ ...options, children: [...children].reverse() }), expected)
})

test("vertical gap respects the children's shared cross-axis span", () => {
  assert.deepEqual(measureLinearGaps({ children: [{ left: 0, right: 100, top: 0, bottom: 28 }, { left: 24, right: 76, top: 36, bottom: 56 }], axis: "vertical", gap: 8, tolerance: 0.01 }), [{ left: 24, right: 76, top: 28, bottom: 36 }])
})

test("distributed spacing, overlapping children, and wrapped rows are not reported as CSS gaps", () => {
  for (const next of [{ left: 40, top: 0, right: 60, bottom: 20 }, { left: 10, top: 0, right: 30, bottom: 20 }, { left: 28, top: 40, right: 48, bottom: 60 }]) {
    assert.equal(measureLinearGaps({ children: [{ left: 0, top: 0, right: 20, bottom: 20 }, next], axis: "horizontal", gap: 8, tolerance: 0.01 }), null)
  }
})