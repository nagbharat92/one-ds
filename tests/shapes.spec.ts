import { expect, test } from "@playwright/test"

test("shape library stays symmetric and morph controls preserve stable geometry", async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/#/shapes")
  const gallery = page.getByRole("group", { name: "Shape library", exact: true })
  await expect(gallery.getByRole("button")).toHaveCount(23)
  const measurements = await gallery.locator("button").evaluateAll(elements => elements.map(element => {
    const graphic = element.querySelector("svg")!
    const path = graphic.querySelector("path")!
    const bounds = path.getBBox()
    const buttonBox = element.getBoundingClientRect()
    const graphicBox = graphic.getBoundingClientRect()
    const graphicArea = element.querySelector(".shape-gallery__graphic")!.getBoundingClientRect()
    const label = element.querySelector(".shape-gallery__label")!
    const labelBox = label.getBoundingClientRect()
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const context = canvas.getContext("2d")!
    context.scale(2, 2)
    context.fill(new Path2D(path.getAttribute("d")!))
    const pixels = context.getImageData(0, 0, 200, 200).data
    const name = graphic.getAttribute("data-shape")
    let mismatch = 0
    let filled = 0
    for (let row = 0; row < 200; row++) {
      for (let column = 0; column < 200; column++) {
        const reflectedColumn = name === "fan" ? 199 - row
          : name === "oval" || name === "pill" ? row : 199 - column
        const reflectedRow = name === "slanted" ? 199 - row
          : name === "fan" ? 199 - column
          : name === "oval" || name === "pill" ? column : row
        const occupied = pixels[(row * 200 + column) * 4 + 3] > 127
        const reflected = pixels[(reflectedRow * 200 + reflectedColumn) * 4 + 3] > 127
        if (occupied) filled++
        if (occupied !== reflected) mismatch++
      }
    }
    return {
      name, filled, mismatch,
      bounds: [bounds.x, bounds.y, bounds.x + bounds.width, bounds.y + bounds.height],
      offset: graphicBox.top - buttonBox.top,
      graphicSize: [graphicBox.width, graphicBox.height],
      padding: [graphicBox.left - graphicArea.left, graphicArea.right - graphicBox.right,
        graphicBox.top - graphicArea.top, graphicArea.bottom - graphicBox.bottom],
      divider: getComputedStyle(label).borderTopWidth,
      tileFill: getComputedStyle(element).backgroundColor,
      labelGap: labelBox.top - graphicArea.bottom,
      bottomGap: buttonBox.bottom - labelBox.bottom,
      labelFits: label.scrollHeight <= label.clientHeight + 1,
      fits: element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= element.clientHeight + 1,
    }
  }))
  for (const metric of measurements) {
    expect(metric.filled, metric.name ?? "shape").toBeGreaterThan(1000)
    expect(metric.mismatch / metric.filled, `${metric.name} symmetry`).toBeLessThan(0.02)
    expect(metric.bounds[0]).toBeGreaterThanOrEqual(0)
    expect(metric.bounds[1]).toBeGreaterThanOrEqual(0)
    expect(metric.bounds[2]).toBeLessThanOrEqual(100)
    expect(metric.bounds[3]).toBeLessThanOrEqual(100)
    expect(metric.offset).toBeCloseTo(measurements[0].offset, 0)
    expect(metric.graphicSize[0]).toBeCloseTo(metric.graphicSize[1], 0)
    for (const padding of metric.padding) expect(padding).toBeCloseTo(16, 0)
    expect(metric.divider).toBe("0px")
    expect(metric.tileFill).toBe("rgba(0, 0, 0, 0)")
    expect(metric.labelGap).toBeCloseTo(4, 0)
    expect(metric.bottomGap).toBeLessThanOrEqual(1)
    expect(metric.labelFits).toBe(true)
    expect(metric.fits, `${metric.name} label containment`).toBe(true)
  }
  expect(await gallery.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
  const preview = page.locator('[data-slot="shape-morph-preview"] svg')
  const path = preview.locator("path")
  const browser = page.locator('[data-slot="shape-browser"]')
  const list = page.getByRole("region", { name: "Scrollable shapes" })
  await expect(list).toHaveAttribute("data-slot", "scroller")
  expect(await list.evaluate(element => getComputedStyle(element).maskImage)).not.toBe("none")
  const edgeInsets = await list.evaluate(element => {
    const canvas = element.closest('[data-slot="canvas"]')!
    const canvasBox = canvas.getBoundingClientRect()
    const box = element.getBoundingClientRect()
    const style = getComputedStyle(canvas)
    return { top: box.top - canvasBox.top - parseFloat(style.borderTopWidth),
      bottom: canvasBox.bottom - box.bottom - parseFloat(style.borderBottomWidth) }
  })
  if (testInfo.project.name === "desktop") expect(edgeInsets.top).toBeCloseTo(0, 0)
  expect(edgeInsets.bottom).toBeCloseTo(0, 0)
  await expect(browser.getByRole("slider")).toHaveCount(0)
  await expect(browser.getByRole("combobox")).toHaveCount(0)
  expect(await gallery.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(3)
  expect(await list.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true)
  const previewBox = await preview.boundingBox()
  const listBox = await list.boundingBox()
  if (testInfo.project.name === "desktop") expect(previewBox!.x + previewBox!.width).toBeLessThan(listBox!.x)
  else expect(previewBox!.y + previewBox!.height).toBeLessThan(listBox!.y)
  const square = gallery.getByRole("button", { name: "Square", exact: true })
  const squarePath = await square.locator("path").getAttribute("d")
  const initial = await path.getAttribute("d")
  const duration = page.getByRole("slider", { name: "Morph duration" })
  await duration.focus()
  await duration.press("End")
  await expect(duration).toHaveAttribute("aria-valuenow", "3000")
  await expect(duration).toHaveAttribute("aria-valuetext", "3000 milliseconds")
  await square.click()
  await expect(preview).toHaveAttribute("aria-label", "Square")
  await expect(path).not.toHaveAttribute("d", initial!)
  expect(await path.getAttribute("d")).not.toBe(squarePath)
  const triangle = gallery.getByRole("button", { name: "Triangle", exact: true })
  await triangle.click()
  await expect(preview).toHaveAttribute("aria-label", "Triangle")
  await expect(path).toHaveAttribute("d", (await triangle.locator("path").getAttribute("d"))!)
  await expect(gallery.locator('[aria-pressed="true"]')).toHaveCount(1)
  await expect(triangle).toHaveAttribute("aria-pressed", "true")
  const last = gallery.getByRole("button", { name: "8-leaf clover", exact: true })
  await last.focus()
  await expect(last).toBeInViewport()
  expect(await list.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" })
  await last.press("Space")
  await expect(path).toHaveAttribute("d", (await last.locator("path").getAttribute("d"))!)
  await expect(last).toHaveAttribute("aria-pressed", "true")
  expect(await browser.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
  expect(errors).toEqual([])
  if (testInfo.project.name === "desktop") {
    await gallery.getByRole("button", { name: "Circle", exact: true }).click()
    await list.evaluate(element => { element.scrollTop = 0 })
    await page.emulateMedia({ colorScheme: "light" })
    await page.screenshot({ path: "/tmp/oneds-shape-morph.png", fullPage: true })
  }
})