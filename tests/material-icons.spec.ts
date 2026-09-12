import { expect, test } from "@playwright/test"

test("sidebar icons stay outlined and equal sized while section sorting uses sort", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/icon")
  await page.evaluate(() => document.fonts.load('24px "OneDS Material Symbols"'))
  const floating = page.locator('[data-slot="sidebar-trigger"][data-placement="floating"]')
  const close = page.getByRole("button", { name: "Close sidebar", exact: true })
  if (await floating.getAttribute("data-visible") === "true") await floating.click()
  await expect(close).toBeVisible()
  const inlineIcon = close.locator(".material-glyph")
  await expect(inlineIcon).toHaveAttribute("data-material-symbol", "dock_to_right")
  await expect(inlineIcon).toHaveCSS("width", "20px")
  await expect(inlineIcon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
  // The sort toggle cycles build order -> alphabetical -> sections, each button
  // showing the icon of the next mode it switches to.
  const buildOrder = page.getByRole("button", { name: "Sort by build order", exact: true })
  const alphabetical = page.getByRole("button", { name: "Sort alphabetically", exact: true })
  const sections = page.getByRole("button", { name: "Group by section", exact: true })
  // Default is build order, so the button offers to sort alphabetically.
  await expect(alphabetical.locator(".material-glyph")).toHaveAttribute("data-material-symbol", "sort_by_alpha")
  await alphabetical.click()
  await expect(sections.locator(".material-glyph")).toHaveAttribute("data-material-symbol", "sort")
  await sections.click()
  await expect(buildOrder.locator(".material-glyph")).toHaveAttribute("data-material-symbol", "stacks")
  await buildOrder.click()
  await close.click()
  await expect(floating).toHaveAttribute("data-visible", "true")
  const floatingIcon = floating.locator(".material-glyph")
  await expect(floatingIcon).toHaveCSS("width", "20px")
  await expect(floatingIcon).toHaveCSS("height", "20px")
  await expect(floatingIcon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
  await floatingIcon.evaluate(element => element.setAttribute("data-filled", "true"))
  await expect(floatingIcon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
  await floating.evaluate(element => element.setAttribute("data-selected", "true"))
  await floatingIcon.evaluate(element => element.setAttribute("data-filled", "false"))
  await expect(floatingIcon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
  await floatingIcon.evaluate(element => element.removeAttribute("data-filled"))
  await expect(floatingIcon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
  await floating.evaluate(element => element.removeAttribute("data-selected"))
  await floating.click()
  await expect(close).toBeVisible()
  await expect(close.locator(".material-glyph text")).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
})

test("Material button icons interpolate real fill pixels and respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/button")
  await page.evaluate(() => document.fonts.load('24px "OneDS Material Symbols"'))
  const button = page.locator('#button-selected button').filter({ has: page.locator('[data-slot="button-selection-icon"]') }).first()
  const icon = button.locator('[data-slot="button-selection-icon"]')
  const glyph = icon.locator("text")
  await expect(button).toBeVisible()
  if (await button.getAttribute("data-selected") === "true") await button.click()
  await expect(glyph).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
  await icon.evaluate(element => {
    (element as SVGElement).style.backgroundColor = "white"
    ;(element as SVGElement).style.color = "black"
  })
  const bounds = await icon.boundingBox()
  const outlined = await icon.screenshot()
  await button.click()
  await expect(button).toHaveAttribute("aria-pressed", "true")
  await expect(glyph).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
  const filled = await icon.screenshot()
  expect(filled.equals(outlined)).toBe(false)
  const after = await icon.boundingBox()
  expect(after!.width).toBe(bounds!.width)
  expect(after!.height).toBe(bounds!.height)
  const interpolation = await glyph.evaluate(element => {
    const root = element.closest<SVGElement>("svg")!
    root.style.setProperty("--icon-fill", "0")
    getComputedStyle(element).fontVariationSettings
    for (const animation of element.getAnimations()) animation.finish()
    getComputedStyle(element).fontVariationSettings
    root.style.setProperty("--icon-fill", "1")
    getComputedStyle(element).fontVariationSettings
    const animation = element.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === "font-variation-settings")!
    if (!animation) throw new Error("Missing native font-axis transition")
    animation.pause()
    const duration = Number(animation.effect!.getTiming().duration)
    animation.currentTime = duration / 2
    const middle = getComputedStyle(element).fontVariationSettings
    return { duration, middle }
  })
  expect(interpolation.duration).toBeGreaterThan(0)
  const fill = Number(interpolation.middle.match(/"FILL" ([\d.]+)/)![1])
  expect(fill).toBeGreaterThan(0)
  expect(fill).toBeLessThan(1)
  const intermediate = await icon.screenshot()
  expect(intermediate.equals(outlined)).toBe(false)
  expect(intermediate.equals(filled)).toBe(false)
  await glyph.evaluate(element => {
    element.getAnimations().forEach(animation => animation.finish())
    element.closest<SVGElement>("svg")!.style.removeProperty("--icon-fill")
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(glyph).toHaveCSS("transition-property", "none")
  await button.press("Space")
  await expect(button).toHaveAttribute("aria-pressed", "false")
  await expect(glyph).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
  await button.press("Enter")
  await expect(button).toHaveAttribute("aria-pressed", "true")
  await expect(glyph).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
  await expect(icon).toHaveAttribute("aria-hidden", "true")
})