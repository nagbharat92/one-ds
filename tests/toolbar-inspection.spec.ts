import { expect, test, type Locator } from "@playwright/test"

test("grid background stays below ordinary content without trapping the cursor", async ({ page }) => {
  await page.goto("/#/checkbox")
  const section = page.locator("#checkbox-group")
  const canvas = section.locator('[data-slot="canvas"]')
  const grid = canvas.locator('[data-slot="canvas-grid"]')
  const cursor = canvas.locator(":scope > .canvas-measure__cursor")
  const toggle = section.getByRole("checkbox", { name: "Grid", exact: true })
  await toggle.click()
  await expect(canvas).toHaveCSS("isolation", "isolate")
  await expect(grid).toHaveCSS("z-index", "-1")
  await expect(cursor).toHaveCount(1)
  await expect(cursor).toHaveCSS("pointer-events", "none")
  await expect(cursor).toBeVisible()
  const text = canvas.locator('[data-slot="checkbox-group-text"]').first()
  await expect(text).toBeVisible()
  await text.click()
  await expect(canvas.getByRole("checkbox", { name: "Email", exact: true }).first()).not.toBeChecked()
  await toggle.click()
  await expect(grid).toBeHidden()
  await expect(cursor).toBeHidden()
  await expect(text).toBeVisible()
})

for (const control of [
  { route: "checkbox", slot: "checkbox-group", role: "checkbox" as const, label: "SMS" },
  { route: "radio-group", slot: "radio-group", role: "radio" as const, label: "Compact" },
  { route: "switch", slot: "switch-group", role: "switch" as const, label: "Bluetooth" },
]) {
  test(`${control.route} labeled options share padded text spacing`, async ({ page }) => {
    await page.goto(`/#/${control.route}`)
    const section = page.locator(`#${control.route}-group [data-slot="canvas"]`)
    const horizontal = section.locator(`[data-slot="${control.slot}"][data-orientation="horizontal"]`)
    const vertical = section.locator(`[data-slot="${control.slot}"][data-orientation="vertical"]`)
    await expect(horizontal).toBeVisible()
    await expect(horizontal).toHaveCSS("column-gap", "0px")
    for (const group of [horizontal, vertical]) {
      const texts = group.locator(`[data-slot="${control.slot}-text"]`)
      await expect(texts).toHaveCount(3)
      for (const text of await texts.all()) await expect(text).toHaveCSS("padding-right", "12px")
      await expect(group.locator("label").first()).toHaveCSS("gap", "8px")
    }
    await horizontal.locator(`[data-slot="${control.slot}-text"]`).filter({ hasText: control.label }).click()
    await expect(horizontal.getByRole(control.role, { name: control.label, exact: true })).toBeChecked()
    await expect(vertical.getByRole(control.role, { name: control.label, exact: true })).not.toBeChecked()
    const defaultTexts = page.locator(`#${control.route}-default [data-slot="canvas"] [data-slot="${control.slot}-text"]`)
    expect(await defaultTexts.count()).toBeGreaterThan(0)
    for (const text of await defaultTexts.all()) await expect(text).toHaveCSS("padding-right", "12px")
    const disabled = page.locator(`#${control.route}-disabled [data-slot="canvas"]`).getByRole(control.role)
    for (const item of await disabled.all()) await expect(item).toBeDisabled()
    if (control.role === "radio") {
      await expect(horizontal.getByRole("radio", { checked: true })).toHaveCount(1)
      await vertical.getByRole("radio", { name: "Default", exact: true }).focus()
      await vertical.getByRole("radio", { name: "Default", exact: true }).press("Space")
      await expect(vertical.getByRole("radio", { name: "Default", exact: true })).toBeChecked()
    } else {
      const selected = horizontal.getByRole(control.role, { name: control.label, exact: true })
      await selected.press("Space")
      await expect(selected).not.toBeChecked()
    }
  })
}

async function expectSharedDisplayOptions(section: Locator) {
  const group = section.locator('[data-slot="checkbox-group"]')
  await expect(group).toHaveCount(1)
  await expect(group).toHaveAttribute("data-orientation", "horizontal")
  await expect(group).toHaveCSS("column-gap", "0px")
  const texts = group.locator('[data-slot="checkbox-group-text"]')
  await expect(texts).toHaveCount(2)
  await expect(texts.nth(0)).toHaveCSS("padding-right", "12px")
  await expect(texts.nth(1)).toHaveCSS("padding-right", "12px")
  await expect(group.locator('[data-slot="checkbox-group-item"]').first()).toHaveCSS("gap", "8px")
}

const examples = [
  { id: "toolbar-default", target: "toolbar", region: "Toolbar padding top" },
  { id: "toolbar-variants", target: "toolbar-default", region: "default toolbar padding top" },
  { id: "toolbar-text-formatting", target: "toolbar", region: "Toolbar padding top" },
  { id: "toolbar-vertical", target: "toolbar", region: "Toolbar padding top" },
  { id: "toolbar-with-title", target: "toolbar", region: "Toolbar padding top" },
]

for (const example of examples) {
  test(`${example.id} shares inspection, reset, and complete code`, async ({ page }) => {
    await page.goto("/#/toolbar")
    const section = page.locator(`#${example.id}`)
    const canvas = section.locator('[data-slot="canvas"]')
    const annotations = section.getByRole("checkbox", { name: "Annotations", exact: true })
    const grid = section.getByRole("checkbox", { name: "Grid", exact: true })
    const region = section.getByRole("button", { name: example.region, exact: true, includeHidden: true })
    await expect(region).toBeHidden()
    await expect(canvas).toHaveCount(1)
    await expectSharedDisplayOptions(section)
    await expect(annotations).not.toBeChecked()
    await expect(grid).not.toBeChecked()
    await expect(section.locator('[data-callout-id]')).toHaveCount(0)
    await expect(section.locator('.sr-only[role="status"]')).toHaveCount(0)
    await grid.click()
    await annotations.click()
    await expect(region).toBeVisible()
    await expect(section.getByLabel("Measurement legend")).toBeVisible()

    await region.click()
    await expect(region).toHaveAttribute("aria-pressed", "true")
    const callout = section.locator('[data-callout-id]')
    await expect(callout).toHaveCount(1)
    await expect(callout.locator('[data-slot="annotation-dimensions"]')).toContainText("px")
    await expect.poll(() => section.evaluate(section => {
      const callout = section.querySelector('[data-callout-id]')!.getBoundingClientRect()
      const canvas = section.querySelector('[data-slot="canvas"]')!.getBoundingClientRect()
      return callout.left >= canvas.left && callout.right <= canvas.right && callout.top >= canvas.top && callout.bottom <= canvas.bottom
    })).toBe(true)

    await region.press("Escape")
    await expect(callout).toHaveCount(0)
    await region.focus()
    await region.press("Enter")
    await expect(region).toBeFocused()
    await expect(callout).toHaveCount(1)
    await annotations.click()
    await expect(callout).toHaveCount(0)
    await expect(region).toBeDisabled()
    await expect(section.locator('[data-slot="canvas-footer"]')).toHaveText("Annotations hidden")
    await grid.click()
    await section.getByRole("button", { name: "Reset example", exact: true }).click()
    await expect(grid).not.toBeChecked()
    await expect(annotations).not.toBeChecked()
    await expect(callout).toHaveCount(0)
    await grid.click()
    await annotations.click()

    const source = section.locator(`[data-measure="${example.target}"]`)
    const originalPadding = await source.evaluate(element => parseFloat(getComputedStyle(element).paddingTop))
    await source.evaluate(element => (element as HTMLElement).style.setProperty("--tb-pad", "calc(var(--spacing) * 4)"))
    const changedPadding = await source.evaluate(element => parseFloat(getComputedStyle(element).paddingTop))
    expect(changedPadding).not.toBe(originalPadding)
    await expect.poll(() => region.evaluate(element => element.getBoundingClientRect().height)).toBe(changedPadding)
    await region.click()
    await expect(callout.locator('[data-slot="annotation-dimensions"]')).toContainText(`${changedPadding} px`)
    await section.getByRole("button", { name: "Reset example", exact: true }).click()
    await expect.poll(() => region.evaluate(element => element.getBoundingClientRect().height)).toBe(originalPadding)

    const specimen = section.locator('[data-annotate="toolbar-specimen"]')
    const control = specimen.locator("button").first()
    await control.click()
    await expect(control).toBeFocused()
    await expect(callout).toHaveCount(0)
    await section.getByRole("tab", { name: "Code", exact: true }).click()
    const code = section.locator("code")
    await expect(code).toContainText("function ToolbarPreview")
    await expect(code).toContainText("AnnotationMeasurements")
    await expect(code).toContainText("export const Demo")
    await expect(code).not.toContainText("generatedExampleCode")
    await section.getByRole("tab", { name: "Preview", exact: true }).click()
    await expect(region).toBeHidden()
  })
}

test("preview controls and specimen share the toolbar title token", async ({ page }) => {
  await page.goto("/#/toolbar")
  const titles = page.locator('[data-slot="toolbar-title"]')
  await expect(titles).toHaveCount(6)
  const padding = () => titles.evaluateAll(elements => elements.map(element => getComputedStyle(element).paddingLeft))
  await expect.poll(padding).toEqual(Array(6).fill("8px"))
  await page.evaluate(() => document.documentElement.style.setProperty("--toolbar-title-padding-start", "calc(var(--spacing) * 4)"))
  await expect.poll(padding).toEqual(Array(6).fill("16px"))
  await page.evaluate(() => document.documentElement.style.removeProperty("--toolbar-title-padding-start"))
  await expect.poll(padding).toEqual(Array(6).fill("8px"))
})

test("special preview pages explicitly opt into the requested defaults", async ({ page }) => {
  for (const route of ["annotation", "canvas", "canvas-grid", "cursor-follower", "concentric"]) {
    await page.goto(`/#/${route}`)
    const sections = page.locator('section[id]')
    const count = await sections.count()
    expect(count).toBeGreaterThan(0)
    for (let index = 0; index < count; index++) {
      const section = sections.nth(index)
      const grid = section.getByRole("checkbox", { name: /^(Show grid|Grid)$/ })
      const annotations = section.getByRole("checkbox", { name: /^(Show annotations|Annotations)$/ })
      await expectSharedDisplayOptions(section)
      await expect(grid).toBeChecked()
      if (route === "canvas" || route === "canvas-grid") await expect(annotations).not.toBeChecked()
      else await expect(annotations).toBeChecked()
      await expect(section.locator('[data-slot="canvas-grid"]')).toHaveAttribute("data-active", "true")
      await grid.click()
      await expect(section.locator('[data-slot="canvas-grid"]')).toHaveAttribute("data-active", "false")
      await annotations.click()
      await section.getByRole("button", { name: /^Reset( example)?$/, exact: true }).click()
      await expect(grid).toBeChecked()
      if (route === "canvas" || route === "canvas-grid") await expect(annotations).not.toBeChecked()
      else await expect(annotations).toBeChecked()
    }
  }
  await page.goto("/#/button")
  await expect(page.locator('[data-slot="canvas"]').first()).toHaveAttribute("data-background", "plain")
})

for (const route of ["checkbox", "button", "input", "dialog", "table", "scroll-area", "resizable", "sidebar", "page", "carousel"]) {
  test(`${route} uses shared headers and grid-only previews`, async ({ page }) => {
    await page.goto(`/#/${route}`)
    const sections = page.locator('section.showcase-example')
    await expect(sections.first()).toBeVisible()
    const count = await sections.count()
    for (let index = 0; index < count; index++) {
      const section = sections.nth(index)
      await expect(section.getByRole("button", { name: "Reset example", exact: true })).toHaveCount(1)
      const controls = section.locator('[data-slot="checkbox-group"]').filter({ has: page.getByRole("checkbox", { name: "Grid", exact: true }) }).first()
      await expect(controls.getByRole("checkbox")).toHaveCount(1)
      await expect(controls.getByRole("checkbox", { name: "Grid", exact: true })).not.toBeChecked()
      await expect(section.locator('[data-slot="annotation-measured-regions"]')).toHaveCount(0)
    }
    const first = sections.first()
    const grid = first.getByRole("checkbox", { name: "Grid", exact: true })
    await grid.click()
    await expect(first.locator('[data-slot="canvas-grid"]').first()).toHaveAttribute("data-active", "true")
    await first.getByRole("button", { name: "Reset example", exact: true }).click()
    await expect(grid).not.toBeChecked()
    await first.getByRole("tab", { name: "Code", exact: true }).click()
    await expect(first.locator("code")).toBeVisible()
    await first.getByRole("tab", { name: "Preview", exact: true }).click()
    await expect(grid).toBeVisible()
  })
}

test("authored annotations and measurements are separate capabilities", async ({ page }) => {
  await page.goto("/#/annotation")
  const anatomy = page.locator('#annotation-default')
  await anatomy.locator('[data-callout-id="3"] button').click()
  await expect(anatomy.locator('[data-selected-bounds="3"]')).toHaveCount(1)
  await expect(anatomy.locator('[data-slot="annotation-dimensions"]')).toHaveCount(0)
  const dimensions = page.locator('#annotation-dimensions')
  await dimensions.getByRole("button", { name: "Card padding top", exact: true }).click()
  await expect(dimensions.locator('[data-callout-id] [data-slot="annotation-dimensions"]')).toContainText("px")
})