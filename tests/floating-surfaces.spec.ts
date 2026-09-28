import { expect, test, type Locator } from "@playwright/test"

async function expectSystemEdge(surface: Locator) {
  await expect(surface).toBeVisible()
  const styles = await surface.evaluate((element) => {
    const style = getComputedStyle(element)
    const systemColors = document.createElement("span")
    systemColors.style.color = "CanvasText"
    systemColors.style.backgroundColor = "Canvas"
    document.body.append(systemColors)
    const canvasText = getComputedStyle(systemColors).color
    const canvas = getComputedStyle(systemColors).backgroundColor
    systemColors.remove()
    return {
      fill: style.backgroundColor,
      edge: style.outlineColor,
      edgeStyle: style.outlineStyle,
      edgeWidth: style.outlineWidth,
      canvas,
      canvasText,
    }
  })
  expect(styles.edgeStyle).toBe("solid")
  expect(styles.edgeWidth).toBe("1px")
  expect(styles.edge).toBe(styles.canvasText)
  // WebKit emulates the media query without recoloring authored surface fills.
  if (styles.fill === styles.canvas) {
    expect(styles.edge).not.toBe(styles.fill)
  }
}

async function expectSystemBorder(surface: Locator) {
  await expect(surface).toBeVisible()
  const colors = await surface.evaluate((element) => {
    const probe = document.createElement("span")
    probe.style.color = "CanvasText"
    document.body.append(probe)
    const ink = getComputedStyle(probe).color
    probe.remove()
    const style = getComputedStyle(element)
    return {
      ink,
      edge: style.borderTopColor,
      width: style.borderTopWidth,
      style: style.borderTopStyle,
    }
  })
  expect(colors.style).toBe("solid")
  expect(colors.width).toBe("1px")
  expect(colors.edge).toBe(colors.ink)
}

async function expectHighlightFocus(control: Locator) {
  await expect(control).toBeFocused()
  const colors = await control.evaluate((element) => {
    const probe = document.createElement("span")
    probe.style.color = "Highlight"
    document.body.append(probe)
    const highlight = getComputedStyle(probe).color
    probe.style.color = "CanvasText"
    const canvasText = getComputedStyle(probe).color
    probe.remove()
    const style = getComputedStyle(element)
    return {
      highlight,
      outline: style.outlineColor,
      width: style.outlineWidth,
      style: style.outlineStyle,
      focusVisible: element.matches(":focus-visible"),
      paletteApplied: getComputedStyle(document.body).color === canvasText,
    }
  })
  expect(colors.focusVisible).toBe(true)
  expect(colors.style).toBe("solid")
  expect(Number.parseFloat(colors.width)).toBeGreaterThanOrEqual(2)
  if (colors.paletteApplied) {
    expect(colors.outline).toBe(colors.highlight)
  } else {
    expect(colors.outline).not.toBe("rgba(0, 0, 0, 0)")
  }
}

async function expectCoachmarkArrowMatchesSurface(surface: Locator) {
  const colors = await surface.evaluate((element) => {
    const arrow = element.querySelector('[data-slot="coachmark-arrow"]')
    const fill = arrow?.querySelector("path:first-child")
    const edge = arrow?.querySelector("path:last-child")
    if (!fill || !edge) throw new Error("Coachmark arrow is missing")
    const systemColors = document.createElement("span")
    systemColors.style.backgroundColor = "Canvas"
    document.body.append(systemColors)
    const canvas = getComputedStyle(systemColors).backgroundColor
    systemColors.remove()
    return {
      arrow: getComputedStyle(fill).fill,
      tip: getComputedStyle(edge).stroke,
      surface: getComputedStyle(element).backgroundColor,
      outline: getComputedStyle(element).outlineColor,
      canvas,
    }
  })
  expect(colors.arrow).toBe(colors.canvas)
  if (colors.surface === colors.canvas) {
    expect(colors.arrow).toBe(colors.surface)
  }
  expect(colors.tip).toBe(colors.outline)
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`NavigationMenu popups keep forced-colors edges, focus, and viewport fit in ${colorScheme} mode`, async ({ page, isMobile }) => {
    if (isMobile) await page.setViewportSize({ width: 320, height: 844 })
    await page.emulateMedia({
      forcedColors: "active",
      reducedMotion: "reduce",
      colorScheme,
    })
    await page.goto("/#/navigation-menu")

    const viewportMenu = page.locator(
      '[data-slot="navigation-menu"][data-viewport="true"]'
    ).last()
    const viewportTrigger = viewportMenu.getByRole("button", { name: "Explore" })
    await viewportTrigger.press("Enter")
    const viewport = viewportMenu.locator(
      '[data-slot="navigation-menu-viewport"][data-state="open"]'
    )
    await expectSystemEdge(viewport)
    await expect(viewport.getByRole("link", { name: "Buttons" })).toBeVisible()
    const viewportBounds = await viewport.boundingBox()
    const indicator = viewportMenu.locator('[data-slot="navigation-menu-indicator"]')
    await expect(indicator).toBeVisible()
    const indicatorColors = await indicator.evaluate((element) => {
      const probe = document.createElement("span")
      probe.style.color = "CanvasText"
      document.body.append(probe)
      const ink = getComputedStyle(probe).color
      probe.remove()
      return {
        ink,
        arrow: getComputedStyle(element.firstElementChild!).backgroundColor,
      }
    })
    expect(indicatorColors.arrow).toBe(indicatorColors.ink)
    await expectHighlightFocus(viewportTrigger)
    await viewportTrigger.press("ArrowDown")
    await expectHighlightFocus(viewport.getByRole("link", { name: "Buttons" }))

    const directMenu = page.locator(
      '[data-slot="navigation-menu"][data-viewport="false"]'
    )
    const directTrigger = directMenu.getByRole("button", { name: "Browse" })
    await directTrigger.press("Enter")
    const directContent = directMenu.locator(
      '[data-slot="navigation-menu-content"][data-state="open"]'
    )
    await expectSystemEdge(directContent)
    await expect(directContent.getByRole("link", { name: "Inputs" })).toBeVisible()
    const directBounds = await directContent.boundingBox()
    await expectHighlightFocus(directTrigger)
    await directTrigger.press("ArrowDown")
    await expectHighlightFocus(directContent.getByRole("link", { name: "Inputs" }))

    for (const bounds of [viewportBounds, directBounds]) {
      expect(bounds).not.toBeNull()
      expect(bounds!.x).toBeGreaterThanOrEqual(0)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    }
  })
}

test("floating Toolbar keeps its boundary in forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" })
  await page.goto("/#/toolbar")
  await expectSystemBorder(
    page.locator('#toolbar-floating-island [data-slot="toolbar"][data-elevation="floating"]').first()
  )
})

test("Chart tooltip keeps its boundary in forced colors", async ({ page, isMobile }) => {
  test.skip(isMobile, "The chart tooltip requires a hover pointer")
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" })
  await page.goto("/#/chart")
  await page.locator(".recharts-bar-rectangle").first().hover()
  await expectSystemBorder(
    page.locator(".recharts-tooltip-wrapper > div").first()
  )
})

test("floating Message actions remain visible by touch and keep their edge", async ({ page, isMobile }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" })
  await page.goto("/#/message")
  const actions = page.locator(
    '[data-slot="message-actions"][data-variant="floating"]'
  )
  const message = page.locator('[data-slot="message"]').filter({ has: actions })
  if (isMobile) {
    await expect(actions).toHaveCSS("opacity", "1")
    const bubble = await message.locator('[data-slot="bubble"]').boundingBox()
    const actionBounds = await actions.boundingBox()
    expect(bubble).not.toBeNull()
    expect(actionBounds).not.toBeNull()
    expect(actionBounds!.y).toBeGreaterThanOrEqual(bubble!.y + bubble!.height)
  } else {
    await message.hover()
    await expect(actions).toHaveCSS("opacity", "1")
  }
  await expectSystemBorder(actions)
  await actions.getByRole("button", { name: "Copy message" }).focus()
  await expect(actions).toHaveCSS("opacity", "1")
  await actions.getByRole("button", { name: "Copy message" }).press("Enter")
  await expect(actions.getByRole("button", { name: "Copied" })).toBeVisible()
})

test("floating Message actions sit below the bubble on touch without forced colors", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Touch layout is checked in a mobile context")
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto("/#/message")
  const actions = page.locator(
    '[data-slot="message-actions"][data-variant="floating"]'
  )
  const message = page.locator('[data-slot="message"]').filter({ has: actions })
  const media = await page.evaluate(() => ({
    hoverNone: matchMedia("(hover: none)").matches,
    pointerCoarse: matchMedia("(pointer: coarse)").matches,
    touchPoints: navigator.maxTouchPoints,
  }))
  expect(media.hoverNone || media.pointerCoarse, JSON.stringify(media)).toBe(true)
  await expect(actions).toHaveCSS("opacity", "1")
  await expect(actions).toHaveCSS("position", "static")
  const bubble = await message.locator('[data-slot="bubble"]').boundingBox()
  const actionBounds = await actions.boundingBox()
  expect(bubble).not.toBeNull()
  expect(actionBounds).not.toBeNull()
  expect(actionBounds!.y).toBeGreaterThanOrEqual(bubble!.y + bubble!.height)
  expect(actionBounds!.x + actionBounds!.width).toBeLessThanOrEqual(320)
})

test("Coachmark beacon remains visible and focused in forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" })
  await page.goto("/#/coachmark")
  const beacon = page.locator('[data-slot="coachmark-beacon"]')
  await expect(beacon).toBeVisible()
  const colors = await beacon.evaluate((element) => {
    const probe = document.createElement("span")
    probe.style.color = "CanvasText"
    probe.style.backgroundColor = "Canvas"
    document.body.append(probe)
    const ink = getComputedStyle(probe).color
    const canvas = getComputedStyle(probe).backgroundColor
    probe.remove()
    return {
      ink,
      canvas,
      fill: getComputedStyle(element.querySelector("span.relative")!).backgroundColor,
    }
  })
  expect(colors.fill).toBe(colors.ink)
  expect(colors.fill).not.toBe(colors.canvas)
  await beacon.press("Tab")
  await beacon.focus()
  await expect(beacon).toHaveCSS("outline-width", "2px")
})

for (const colorScheme of ["light", "dark"] as const) {
  test(`Combobox popup has a forced-colors edge in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({
      forcedColors: "active",
      reducedMotion: "reduce",
      colorScheme,
    })
    await page.goto("/#/combobox")
    await page.getByPlaceholder("Search framework...").first().click()
    await expectSystemEdge(page.locator('[data-slot="combobox-content"][data-open]'))
  })

  test(`Hover Card has a forced-colors edge in ${colorScheme} mode`, async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover Card requires a hover pointer")
    await page.emulateMedia({
      forcedColors: "active",
      reducedMotion: "reduce",
      colorScheme,
    })
    await page.goto("/#/hover-card")
    await page.locator('[data-slot="hover-card-trigger"]').first().hover()
    await expectSystemEdge(
      page.locator('[data-slot="hover-card-content"][data-state="open"]')
    )
  })

  test(`Coachmark tones have a forced-colors edge in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({
      forcedColors: "active",
      reducedMotion: "reduce",
      colorScheme,
    })
    await page.goto("/#/coachmark")
    const inverted = page.locator(
      '[data-slot="coachmark-content"][data-state="open"][data-tone="inverted"]'
    )
    await expectSystemEdge(inverted.first())
    await expectCoachmarkArrowMatchesSurface(inverted.first())
    await page.getByRole("button", { name: "Not now" }).click()
    await page
      .locator('[data-slot="coachmark-trigger"]')
      .filter({ hasText: /^Default$/i })
      .click()
    const defaultTone = page.locator(
      '[data-slot="coachmark-content"][data-state="open"][data-tone="default"]'
    )
    await expectSystemEdge(defaultTone)
    await expectCoachmarkArrowMatchesSurface(defaultTone)
  })
}

test("Coachmark arrow retains its ordinary tone styling", async ({ page }) => {
  await page.goto("/#/coachmark")
  const inverted = page.locator(
    '[data-slot="coachmark-content"][data-state="open"][data-tone="inverted"]'
  ).first()
  await expect(inverted).toBeVisible()
  await expect(inverted.locator('[data-slot="coachmark-arrow"] path:last-child'))
    .toHaveCSS("stroke", "none")
  await page.getByRole("button", { name: "Not now" }).click()
  await page
    .locator('[data-slot="coachmark-trigger"]')
    .filter({ hasText: /^Default$/i })
    .click()
  const defaultTone = page.locator(
    '[data-slot="coachmark-content"][data-state="open"][data-tone="default"]'
  )
  await expect(defaultTone).toBeVisible()
  await expect(defaultTone.locator('[data-slot="coachmark-arrow"] path:last-child'))
    .not.toHaveCSS("stroke", "none")
})
