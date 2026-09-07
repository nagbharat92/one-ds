import assert from "node:assert/strict"
import test from "node:test"
import { sliderSnapPoints, snapSliderValue } from "../src/lib/slider-snapping.ts"

test("snap points are sorted, unique, finite, and in range", () => {
  assert.deepEqual(sliderSnapPoints([75, 25, 25, -5, 110, NaN], 0, 100, "magnetic"), [25, 75])
  assert.deepEqual(sliderSnapPoints([75, 25], 0, 100, "discrete"), [0, 25, 75, 100])
})

test("magnetic snapping attracts nearby pointer values but leaves keyboard steps free", () => {
  assert.equal(snapSliderValue(48, 40, [25, 50, 75], "magnetic", 3, false), 50)
  assert.equal(snapSliderValue(44, 40, [25, 50, 75], "magnetic", 3, false), 44)
  assert.equal(snapSliderValue(51, 50, [25, 50, 75], "magnetic", 3, true), 51)
})

test("discrete pointer values use the nearest stop and arrows advance to adjacent stops", () => {
  const points = [0, 20, 50, 85, 100]
  assert.equal(snapSliderValue(67, 20, points, "discrete", 0, false), 50)
  assert.equal(snapSliderValue(21, 20, points, "discrete", 0, true), 50)
  assert.equal(snapSliderValue(49, 50, points, "discrete", 0, true), 20)
  assert.equal(snapSliderValue(100, 100, points, "discrete", 0, true), 100)
})