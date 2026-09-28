import { expect, test, type Locator, type Page } from "@playwright/test"

async function expectCaptured(page: Page, target: Locator) {
  const pointer = page.locator('[data-slot="pointer"]')
  await target.hover()
  await expect(pointer).toHaveAttribute("data-mode", "match")
  await expect.poll(async () => {
    const bounds = await target.boundingBox()
    const overlay = await pointer.boundingBox()
    return bounds && overlay ? Math.max(...["x", "y", "width", "height"].map(key => Math.abs(bounds[key as keyof typeof bounds] - overlay[key as keyof typeof overlay]))) : Infinity
  }).toBeLessThan(1)
  const radius = await target.evaluate(element => parseFloat(getComputedStyle(element).borderTopLeftRadius))
  await expect.poll(async () => Math.abs(await pointer.evaluate(element => parseFloat(getComputedStyle(element).borderTopLeftRadius)) - radius)).toBeLessThan(0.1)
}

test("Pointer captures real corners, follows press, and reaches portaled menu items", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Custom pointer is fine-mouse only")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/pointer")
  const scope = page.locator('[data-slot="pointer-scope"]')
  const pointer = page.locator('[data-slot="pointer"]')
  const save = scope.getByRole("button", { name: "Save version", exact: true })
  await expectCaptured(page, save)
  await expect(pointer).toHaveCSS("mix-blend-mode", "exclusion")
  await expect(pointer).toHaveCSS("pointer-events", "none")
  await page.mouse.down()
  await expect(save).toHaveCSS("scale", "0.97")
  await expect.poll(async () => Math.abs((await pointer.boundingBox())!.width - (await save.boundingBox())!.width)).toBeLessThan(1)
  await page.mouse.up()
  await expect(scope.getByRole("status")).toHaveText("1 versions saved")
  await expectCaptured(page, scope.getByRole("button", { name: "Like project", exact: true }))
  await scope.getByRole("button", { name: "Like project", exact: true }).click()
  await expect(scope.getByRole("button", { name: "Like project", exact: true })).toHaveAttribute("aria-pressed", "true")
  await scope.getByRole("button", { name: "Version history", exact: true }).hover()
  await expect(pointer).toHaveAttribute("data-mode", "link")
  await expect(pointer).toHaveCSS("width", "36px")
  await scope.getByText("A space for the next idea", { exact: true }).hover()
  await expect(pointer).toHaveAttribute("data-mode", "circle")
  await expect(pointer).toHaveCSS("width", "24px")
  await scope.getByRole("button", { name: "Project actions", exact: true }).click()
  const duplicate = page.getByRole("menuitem", { name: "Duplicate project", exact: true })
  await expectCaptured(page, duplicate)
  expect(await duplicate.evaluate(element => element.closest('[data-slot="pointer-scope"]') === null)).toBe(true)
  await duplicate.click()
  await expect(scope.getByRole("status")).toHaveText("Project duplicated")
  await scope.getByRole("button", { name: "Project actions", exact: true }).click()
  await page.getByRole("menuitemcheckbox", { name: "Pin project" }).click()
  await expect(scope.getByText("Pinned project", { exact: true })).toBeVisible()
  await scope.getByLabel("Project name", { exact: true }).hover()
  await expect(pointer).toBeHidden()
  await expect(scope.getByLabel("Project name", { exact: true })).toHaveCSS("cursor", "text")
  await save.hover()
  await page.getByRole("heading", { name: "Pointer", exact: true }).hover()
  await expect(pointer).toBeHidden()
  await page.getByRole("combobox", { name: "Pointer size" }).click()
  await page.getByRole("option", { name: "Large", exact: true }).click()
  await scope.getByText("A space for the next idea", { exact: true }).hover()
  await expect(pointer).toHaveCSS("width", "32px")
  await page.getByRole("checkbox", { name: "Shape capture", exact: true }).click()
  await save.hover()
  await expect(pointer).toHaveAttribute("data-mode", "link")
  await expect(pointer).toHaveCSS("width", "48px")
  await page.getByRole("button", { name: "Reset experiment", exact: true }).click()
  await expect(scope.getByRole("status")).toHaveText("All changes saved")
})

test("Pointer wiggles keep target-wide suppression and release without overshoot", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Custom pointer is fine-mouse only")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/pointer")
  const scope = page.locator('[data-slot="pointer-scope"]')
  const button = scope.getByRole("button", { name: "Save version", exact: true })
  const pointer = page.locator('[data-slot="pointer"]')
  await expectCaptured(page, button)
  const bounds = (await button.boundingBox())!
  for (const fraction of [0.1, 0.4, 0.8, 0.2, 0.7]) {
    await page.mouse.move(bounds.x + bounds.width * fraction, bounds.y + bounds.height / 2)
    await expect(button).toHaveAttribute("data-pointer-hidden", "")
    expect(await button.evaluate(element => [element, ...element.querySelectorAll("*")].every(child => getComputedStyle(child).cursor === "none"))).toBe(true)
    await expect(pointer).toBeVisible()
  }
  const samples = await page.evaluate(({ x, y }) => {
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, pointerType: "mouse", bubbles: true }))
    const overlay = document.querySelector<HTMLElement>('[data-slot="pointer"]')!
    const animations = overlay.getAnimations()
    animations.forEach(animation => animation.pause())
    return [0, 0.25, 0.5, 0.75, 1].map(fraction => {
      animations.forEach(animation => { animation.currentTime = Number(animation.effect!.getTiming().duration) * fraction })
      const rect = overlay.getBoundingClientRect()
      return { center: rect.x + rect.width / 2, width: rect.width, durations: animations.map(animation => animation.effect!.getTiming().duration), easing: animations.map(animation => animation.effect!.getTiming().easing) }
    })
  }, { x: bounds.x + bounds.width + 12, y: bounds.y - 12 })
  expect(samples[0].durations.every(duration => typeof duration === "number" && duration > 0)).toBe(true)
  expect(samples[0].easing).toContain("cubic-bezier(0, 1, 0.1, 1)")
  expect(samples[0].center).toBeCloseTo(bounds.x + bounds.width / 2, 0)
  expect(samples.at(-1)!.width).toBeCloseTo(24, 0)
  for (let index = 1; index < samples.length; index++) {
    expect(samples[index].center).toBeGreaterThanOrEqual(samples[index - 1].center)
    expect(samples[index].width).toBeLessThanOrEqual(samples[index - 1].width)
  }
  await expectCaptured(page, button)
})

test("Pointer capture starts at every entry edge and preserves interrupted position", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Custom pointer is fine-mouse only")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/pointer")
  const button = page.locator('[data-slot="pointer-scope"]').getByRole("button", { name: "Save version", exact: true })
  await button.scrollIntoViewIfNeeded()
  const results = await button.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const overlay = document.querySelector<HTMLElement>('[data-slot="pointer"]')!
    const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
    const move = (x: number, y: number) => document.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, pointerType: "mouse", bubbles: true }))
    const read = () => {
      const rect = overlay.getBoundingClientRect()
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width }
    }
    return [
      { x: bounds.left + 2, y: center.y }, { x: bounds.right - 2, y: center.y },
      { x: center.x, y: bounds.top + 2 }, { x: center.x, y: bounds.bottom - 2 },
    ].map(entry => {
      move(bounds.left - 16, center.y)
      overlay.getAnimations().forEach(animation => animation.finish())
      read()
      move(entry.x, entry.y)
      read()
      const animations = overlay.getAnimations()
      animations.forEach(animation => { animation.pause(); animation.currentTime = 0 })
      const start = read()
      animations.forEach(animation => { animation.currentTime = Number(animation.effect!.getTiming().duration) / 2 })
      const middle = read()
      move(bounds.left - 16, center.y)
      const interrupted = read()
      overlay.getAnimations().forEach(animation => animation.finish())
      move(entry.x, entry.y)
      read()
      overlay.getAnimations().forEach(animation => animation.finish())
      const end = read()
      return { entry, center, start, middle, interrupted, end, targetWidth: bounds.width }
    })
  })
  for (const result of results) {
    expect(result.start.x).toBeCloseTo(result.entry.x, 0)
    expect(result.start.y).toBeCloseTo(result.entry.y, 0)
    expect(result.start.width).toBeCloseTo(24, 0)
    expect(result.interrupted.x).toBeCloseTo(result.middle.x, 0)
    expect(result.interrupted.y).toBeCloseTo(result.middle.y, 0)
    expect(result.end.x).toBeCloseTo(result.center.x, 0)
    expect(result.end.y).toBeCloseTo(result.center.y, 0)
    expect(result.end.width).toBeCloseTo(result.targetWidth, 0)
  }
})

test("Pointer icon capture grows from every edge throughout its movement", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Custom pointer is fine-mouse only")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/pointer")
  await page.getByRole("button", { name: "In animation", exact: true }).click()
  await page.getByRole("dialog", { name: "In animation settings" }).getByRole("combobox").click()
  await page.getByRole("option", { name: "Linear", exact: true }).click()
  await page.keyboard.press("Escape")
  for (const name of ["Like project", "Add item", "Copy item", "Project actions"]) {
    const button = page.locator('[data-slot="pointer-scope"]').getByRole("button", { name, exact: true })
    await button.scrollIntoViewIfNeeded()
    const samples = await button.evaluate(element => {
      const bounds = element.getBoundingClientRect()
      const canvas = element.closest('[data-slot="canvas"]')!.getBoundingClientRect()
      const overlay = document.querySelector<HTMLElement>('[data-slot="pointer"]')!
      const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
      const move = (x: number, y: number) => document.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, pointerType: "mouse", bubbles: true }))
      const read = () => {
        const rect = overlay.getBoundingClientRect()
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height }
      }
      return [
        { x: bounds.left + 2, y: center.y }, { x: bounds.right - 2, y: center.y },
        { x: center.x, y: bounds.top + 2 }, { x: center.x, y: bounds.bottom - 2 },
      ].map(entry => {
        move(canvas.left + 8, center.y)
        overlay.getAnimations().forEach(animation => animation.finish())
        read()
        move(entry.x, entry.y)
        const animations = overlay.getAnimations()
        animations.forEach(animation => { animation.pause(); animation.currentTime = 0 })
        const start = read()
        const duration = Number(animations.find(animation => (animation.effect as KeyframeEffect).getKeyframes().some(keyframe => "transform" in keyframe))!.effect!.getTiming().duration)
        animations.forEach(animation => { animation.currentTime = duration / 2 })
        const middle = read()
        animations.forEach(animation => animation.finish())
        const end = read()
        return { entry, start, middle, end, duration, expectedDuration: Math.hypot(Math.abs(entry.x - center.x) + (bounds.width - 24) / 2, Math.abs(entry.y - center.y) + (bounds.height - 24) / 2) / 600 * 1000, center, width: bounds.width, height: bounds.height }
      })
    })
    for (const sample of samples) {
      expect(sample.duration).toBeCloseTo(sample.expectedDuration, 1)
      expect(sample.start.x).toBeCloseTo(sample.entry.x, 0)
      expect(sample.start.y).toBeCloseTo(sample.entry.y, 0)
      expect(sample.start.width).toBeCloseTo(24, 0)
      expect(sample.start.height).toBeCloseTo(24, 0)
      expect(sample.middle.width).toBeCloseTo((24 + sample.width) / 2, 0)
      expect(sample.middle.height).toBeCloseTo((24 + sample.height) / 2, 0)
      expect(sample.middle.x).toBeCloseTo((sample.entry.x + sample.center.x) / 2, 0)
      expect(sample.middle.y).toBeCloseTo((sample.entry.y + sample.center.y) / 2, 0)
      expect(sample.end.width).toBeCloseTo(sample.width, 0)
      expect(sample.end.height).toBeCloseTo(sample.height, 0)
    }
  }
})

test("Pointer direction menus independently control easing and velocity", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Custom pointer is fine-mouse only")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/pointer")
  const pointer = page.locator('[data-slot="pointer"]')
  const button = page.locator('[data-slot="pointer-scope"]').getByRole("button", { name: "Start review", exact: true })
  for (const direction of ["In", "Out"]) {
    await page.getByRole("button", { name: `${direction} animation`, exact: true }).click()
    const menu = page.getByRole("dialog", { name: `${direction} animation settings` })
    await menu.getByRole("combobox", { name: "Easing" }).click()
    await page.getByRole("option", { name: direction === "In" ? "Linear" : "Ease out", exact: true }).click()
    await menu.getByRole("spinbutton").fill(direction === "In" ? "400" : "800")
    await page.keyboard.press("Escape")
  }
  for (const sampleVelocity of [400, 800]) {
    await page.getByRole("button", { name: "In animation", exact: true }).click()
    const menu = page.getByRole("dialog", { name: "In animation settings" })
    await menu.getByRole("spinbutton").fill(String(sampleVelocity))
    await page.keyboard.press("Escape")
    await button.scrollIntoViewIfNeeded()
    const result = await button.evaluate((element, sampleVelocity) => {
      const bounds = element.getBoundingClientRect()
      const overlay = document.querySelector<HTMLElement>('[data-slot="pointer"]')!
      const move = (x: number, y: number) => document.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, pointerType: "mouse", bubbles: true }))
      const finish = () => overlay.getAnimations().forEach(animation => animation.finish())
      const samples = [0.125, 0.25].map(fraction => {
        move(bounds.left - 16, bounds.top + bounds.height / 2)
        finish()
        overlay.getBoundingClientRect()
        move(bounds.left + bounds.width * (0.5 - fraction), bounds.top + bounds.height / 2)
        const animations = overlay.getAnimations()
        animations.forEach(animation => { animation.pause(); animation.currentTime = 0 })
        const timing = (property: string) => {
          const animation = animations.find(animation => (animation.effect as KeyframeEffect).getKeyframes().some(keyframe => property in keyframe))
          return animation ? Number(animation.effect!.getTiming().duration) : -1
        }
        const startRadius = parseFloat(getComputedStyle(overlay).borderTopLeftRadius)
        const durations = { move: timing("transform"), width: timing("width"), height: timing("height"), radius: timing("borderTopLeftRadius") }
        const easing = animations.map(animation => animation.effect!.getTiming().easing)
        finish()
        const endRadius = parseFloat(getComputedStyle(overlay).borderTopLeftRadius)
        move(bounds.left - 16, bounds.top + bounds.height / 2)
        const outgoing = overlay.getAnimations()
        const outEasing = outgoing.map(animation => animation.effect!.getTiming().easing)
        const outWidth = outgoing.find(animation => (animation.effect as KeyframeEffect).getKeyframes().some(keyframe => "width" in keyframe))
        const outDuration = Number(outWidth!.effect!.getTiming().duration)
        finish()
        const captureDuration = Math.hypot(bounds.width * fraction + Math.abs(bounds.width - 24) / 2, Math.abs(bounds.height - 24) / 2) / sampleVelocity * 1000
        return {
          durations, easing, outEasing, outDuration, startRadius, endRadius,
          expected: {
            move: captureDuration,
            width: captureDuration,
            height: captureDuration,
            outWidth: Math.abs(bounds.width - 24) / 2 / 800 * 1000,
          },
        }
      })
      return samples
    }, sampleVelocity)
    for (const sample of result) {
      for (const role of ["move", "width", "height"] as const) expect(sample.durations[role]).toBeCloseTo(sample.expected[role], 1)
      expect(sample.durations.radius).toBeGreaterThan(0)
      expect(sample.startRadius).toBeCloseTo(12, 0)
      expect(sample.endRadius).toBeCloseTo(28, 0)
      expect(sample.easing.every(easing => easing === "linear")).toBe(true)
      expect(sample.outEasing.every(easing => easing === "cubic-bezier(0, 0, 0.58, 1)")).toBe(true)
      expect(sample.outDuration).toBeCloseTo(sample.expected.outWidth, 1)
    }
    expect(result[1].durations.move).toBeGreaterThan(result[0].durations.move)
    await button.click()
    await expect(page.locator('[data-slot="pointer-scope"]').getByRole("status")).toHaveText("Review started")
  }
  await page.getByRole("button", { name: "Reset experiment", exact: true }).click()
  await expect(pointer).toBeHidden()
  for (const direction of ["In", "Out"]) {
    await page.getByRole("button", { name: `${direction} animation`, exact: true }).click()
    const menu = page.getByRole("dialog", { name: `${direction} animation settings` })
    await expect(menu.getByRole("combobox")).toHaveText("Expressive")
    await expect(menu.getByRole("spinbutton")).toHaveValue(direction === "In" ? "600" : "850")
    await page.keyboard.press("Escape")
  }
})

test("Pointer settings menus fit and validate speed input", async ({ page }, testInfo) => {
  await page.goto("/#/pointer")
  for (const direction of ["In", "Out"]) {
    const trigger = page.getByRole("button", { name: `${direction} animation`, exact: true })
    await trigger.click()
    const menu = page.getByRole("dialog", { name: `${direction} animation settings` })
    const speed = menu.getByRole("spinbutton")
    const original = await speed.inputValue()
    await speed.fill("")
    await menu.getByText("Speed (px/s)", { exact: true }).click()
    await expect(speed).toHaveValue(original)
    await speed.fill("0")
    await menu.getByText("Speed (px/s)", { exact: true }).click()
    await expect(speed).toHaveValue(original)
    for (const easing of ["Linear", "Ease in", "Ease out", "Ease in out", "Expressive"]) {
      await menu.getByRole("combobox").click()
      await page.getByRole("option", { name: easing, exact: true }).click()
      await expect(menu.getByRole("combobox")).toHaveText(easing)
    }
    const bounds = (await menu.boundingBox())!
    expect(bounds.x).toBeGreaterThanOrEqual(0)
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    expect(await menu.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    if (direction === "In" && testInfo.project.name === "desktop") await menu.screenshot({ path: testInfo.outputPath("pointer-settings.png") })
    await page.keyboard.press("Escape")
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
  }
})

test("Pointer covers canvas gutters while the toolbar remains native", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Custom pointer is fine-mouse only")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/pointer")
  const canvas = page.locator('#pointer-default [data-slot="canvas"]')
  const pointer = page.locator('[data-slot="pointer"]')
  for (const edge of ["left", "right", "top", "bottom"] as const) {
    const point = await canvas.evaluate((element, side) => {
      const rect = element.getBoundingClientRect()
      const inset = parseFloat(getComputedStyle(element).paddingLeft) / 2
      return {
        x: side === "left" ? rect.left + inset : side === "right" ? rect.right - inset : rect.left + rect.width / 2,
        y: side === "top" ? rect.top + inset : side === "bottom" ? rect.bottom - inset : rect.top + rect.height / 2,
      }
    }, edge)
    await canvas.evaluate((element, side) => element.scrollIntoView({ block: side === "bottom" ? "end" : "start", behavior: "instant" }), edge)
    const bounds = (await canvas.boundingBox())!
    const inset = await canvas.evaluate(element => parseFloat(getComputedStyle(element).paddingLeft) / 2)
    await page.mouse.move(point.x, edge === "bottom" ? bounds.y + bounds.height - inset : edge === "top" ? bounds.y + inset : Math.max(bounds.y + inset, Math.min(bounds.y + bounds.height / 2, page.viewportSize()!.height - inset)))
    await expect(pointer).toBeVisible()
    await expect(pointer).toHaveAttribute("data-mode", "circle")
  }
  await page.getByRole("toolbar", { name: "Pointer experiment controls" }).getByRole("button", { name: "Reset experiment" }).hover()
  await expect(pointer).toBeHidden()
  await page.getByLabel("Project name", { exact: true }).hover()
  await expect(pointer).toBeHidden()
  await expect(page.getByLabel("Project name", { exact: true })).toHaveCSS("cursor", "text")
})

test("Pointer preview uses a shared toolbar and card materials", async ({ page }) => {
  await page.goto("/#/pointer")
  const toolbar = page.getByRole("toolbar", { name: "Pointer experiment controls" })
  await expect(toolbar.getByRole("combobox")).toHaveCount(2)
  await expect(toolbar.getByRole("checkbox")).toHaveCount(2)
  await expect(toolbar.getByRole("button", { name: "Reset experiment" })).toBeVisible()
  await expect(toolbar).toHaveCSS("align-items", "center")
  const groups = toolbar.locator('[data-slot="toolbar-group"]')
  await expect(groups).toHaveCount(3)
  for (const group of await groups.all()) {
    const geometry = await group.evaluate(element => {
      const label = element.querySelector('[data-slot="toolbar-title"]')!.getBoundingClientRect()
      const control = element.querySelector('[role="combobox"], button')!.getBoundingClientRect()
      return { gap: control.left - label.right, centerDelta: Math.abs(label.y + label.height / 2 - control.y - control.height / 2) }
    })
    expect(geometry.gap).toBeGreaterThanOrEqual(0)
    expect(geometry.centerDelta).toBeLessThan(1)
  }
  const canvas = page.locator('#pointer-default [data-slot="canvas"]')
  expect((await toolbar.boundingBox())!.y + (await toolbar.boundingBox())!.height).toBeLessThan((await canvas.boundingBox())!.y)
  expect(await toolbar.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
  const cards = page.locator('[data-slot="pointer-scope"] [data-slot="card"]')
  await expect(cards).toHaveCount(2)
  for (const card of await cards.all()) {
    await expect(card.locator(':scope > [data-slot="card-content"]')).toHaveCount(1)
    const material = await card.evaluate(element => {
      const style = getComputedStyle(element)
      const content = getComputedStyle(element.querySelector('[data-slot="card-content"]')!)
      const probe = document.createElement("div")
      probe.style.background = "var(--card)"
      probe.style.borderRadius = "var(--card-radius)"
      probe.style.padding = "var(--card-spacing)"
      element.append(probe)
      const expected = getComputedStyle(probe)
      const result = { fill: style.backgroundColor === expected.backgroundColor, radius: style.borderRadius === expected.borderRadius, padding: style.paddingTop === expected.paddingTop && content.paddingLeft === expected.paddingLeft, boundary: style.boxShadow !== "none" }
      probe.remove()
      return result
    })
    expect(material).toEqual({ fill: true, radius: true, padding: true, boundary: true })
  }
})

test("showcase-only pointer, annotation, and theme-preview tokens survive both themes", async ({ page }) => {
  await page.goto("/#/pointer")
  const readTokens = () => page.evaluate(() => {
    const style = getComputedStyle(document.documentElement)
    return {
      pointerSize: style.getPropertyValue("--pointer-size-default").trim(),
      previewSeed: style.getPropertyValue("--theme-preview-surface-seed").trim(),
      annotationInk: style.getPropertyValue("--annotation-bounds-color").trim(),
    }
  })
  const light = await readTokens()
  expect(light.pointerSize).toBe("24px")
  expect(light.previewSeed).toBe("#807b71")
  expect(light.annotationInk).not.toBe("")
  await page.evaluate(() => document.documentElement.classList.add("dark"))
  const dark = await readTokens()
  expect(dark.pointerSize).toBe(light.pointerSize)
  expect(dark.annotationInk).not.toBe(light.annotationInk)
})

test("Pointer preserves native input, keyboard, reduced motion and touch fallbacks", async ({ page }, testInfo) => {
  await page.goto("/#/pointer")
  const scope = page.locator('[data-slot="pointer-scope"]')
  const pointer = page.locator('[data-slot="pointer"]')
  const save = scope.getByRole("button", { name: "Save version", exact: true })
  if (testInfo.project.name === "mobile") {
    await save.tap()
    await expect(pointer).toBeHidden()
  } else {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await save.click()
    await expect(pointer).toBeHidden()
    await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "active" })
    await save.hover()
    await expect(pointer).toBeHidden()
    await page.emulateMedia({ forcedColors: "none" })
    await page.getByRole("checkbox", { name: "Custom pointer", exact: true }).click()
    await save.hover()
    await expect(pointer).toBeHidden()
  }
  await expect(scope.getByRole("status")).toHaveText("1 versions saved")
  await save.focus()
  await page.keyboard.press("Enter")
  await expect(scope.getByRole("status")).toHaveText("2 versions saved")
  await scope.getByLabel("Project name", { exact: true }).fill("Updated workspace")
  await expect(scope.getByText("Updated workspace", { exact: true })).toBeVisible()
  await expect.poll(() => scope.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
  expect(await page.locator("[data-pointer-hidden]").count()).toBe(0)
})