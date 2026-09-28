import { expect, test } from "@playwright/test"

test("Navigation Rail attaches to the flat floating Navigation Pane shell", async ({ page }, testInfo) => {
  await page.goto("/#/navigation-rail")

  const rail = page.locator('[data-slot="navigation-rail"]')
  if (testInfo.project.use.isMobile) {
    await expect(rail).toHaveCount(0)
    const trigger = page.locator("#showcase-navigation-rail-floating-trigger")
    await expect(trigger).toBeVisible()
    await trigger.click()
    await expect(page.locator("#showcase-navigation-rail-panel")).toBeVisible()
    return
  }

  await expect(rail).toBeVisible()
  const shell = rail.locator("..")
  const panel = shell.locator('[data-slot="navigation-pane-panel"]')

  const geometry = await rail.evaluate((railElement) => {
    const panelElement = railElement.nextElementSibling as HTMLElement
    const railBox = railElement.getBoundingClientRect()
    const panelBox = panelElement.getBoundingClientRect()
    const railStyle = getComputedStyle(railElement)
    const panelStyle = getComputedStyle(panelElement)
    const corners = (style: CSSStyleDeclaration) => [
      style.borderTopLeftRadius,
      style.borderTopRightRadius,
      style.borderBottomRightRadius,
      style.borderBottomLeftRadius,
    ]

    return {
      railWidth: railBox.width,
      panelWidth: panelBox.width,
      seamGap: panelBox.left - railBox.right,
      railCorners: corners(railStyle),
      panelCorners: corners(panelStyle),
    }
  })

  expect(geometry).toEqual({
    railWidth: 96,
    panelWidth: 288,
    seamGap: 8,
    railCorners: ["36px", "8px", "8px", "36px"],
    panelCorners: ["8px", "36px", "36px", "8px"],
  })
  await expect(shell).toHaveCSS("box-shadow", "none")
  await expect(rail).toHaveCSS("box-shadow", /0px 0px 0px 1px/)
  await expect(panel).toHaveCSS("box-shadow", /0px 0px 0px 1px/)
  const selectedItem = rail.locator('[data-slot="navigation-rail-item"][data-selected="true"]')
  await expect(selectedItem).toHaveCount(1)
  const selectedIndicator = selectedItem.locator('[data-slot="navigation-rail-indicator"]')
  await expect(selectedIndicator).toHaveCSS("width", "56px")
  await expect(selectedIndicator).toHaveCSS("height", "32px")
  await expect(selectedIndicator).toHaveCSS("border-radius", "16px")
  const selectedColors = await selectedItem.evaluate((item) => {
    const normalize = (color: string) => {
      const context = document.createElement("canvas").getContext("2d")!
      context.fillStyle = color
      return context.fillStyle
    }
    const icon = item.querySelector<HTMLElement>('[data-slot="navigation-rail-icon"]')!
    const indicator = item.querySelector<HTMLElement>('[data-slot="navigation-rail-indicator"]')!
    const label = item.querySelector<HTMLElement>('[data-slot="navigation-rail-label"]')!
    const iconStyle = getComputedStyle(icon)
    const indicatorStyle = getComputedStyle(indicator)
    const labelStyle = getComputedStyle(label)
    return {
      indicator: normalize(indicatorStyle.backgroundColor),
      indicatorToken: normalize(indicatorStyle.getPropertyValue("--navigation-rail-selected-indicator").trim()),
      icon: normalize(iconStyle.color),
      iconToken: normalize(iconStyle.getPropertyValue("--navigation-rail-selected-icon").trim()),
      label: normalize(labelStyle.color),
      labelToken: normalize(labelStyle.getPropertyValue("--navigation-rail-selected-label").trim()),
    }
  })
  expect(selectedColors.indicator).toBe(selectedColors.indicatorToken)
  expect(selectedColors.icon).toBe(selectedColors.iconToken)
  expect(selectedColors.label).toBe(selectedColors.labelToken)

  const home = rail.getByRole("button", { name: "Home", exact: true })
  await home.click()
  await expect(home).toHaveAttribute("aria-current", "page")
  await expect(panel.locator('[data-slot="navigation-pane-group-label"]')).toHaveText("Home")
  await expect(home.locator(".oneds-icon")).toHaveCSS("--icon-fill", "1")
  const indicatorMotion = await home.locator('[data-slot="navigation-rail-indicator"]').evaluate((indicator) => {
    const style = getComputedStyle(indicator)
    const velocity = Number(style.getPropertyValue("--navigation-rail-indicator-velocity"))
    const animation = indicator.getAnimations().find(
      (candidate) => candidate.constructor.name === "Animation"
    )
    return {
      duration: Number(animation?.effect?.getTiming().duration),
      expectedDuration: indicator.clientWidth / 2 / velocity * 1000,
    }
  })
  expect(indicatorMotion.duration).toBeCloseTo(indicatorMotion.expectedDuration)

  await home.press("ArrowDown")
  await expect(rail.getByRole("button", { name: "Inbox", exact: true })).toBeFocused()
})

test("Navigation Rail and pane retain boundaries and selection in forced colors", async ({ page, isMobile }) => {
  await page.emulateMedia({ forcedColors: "active" })
  if (isMobile) await page.setViewportSize({ width: 320, height: 640 })
  await page.goto("/#/navigation-rail")
  if (isMobile) {
    await page.locator("#showcase-navigation-rail-floating-trigger").click()
    const drawer = page.locator("#showcase-navigation-rail-panel")
    await expect(drawer).toBeVisible()
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ forcedColors: "active", colorScheme })
      const colors = await drawer.evaluate((node) => {
        const style = getComputedStyle(node)
        const usesOutline = style.outlineStyle === "solid"
        return {
          edge: usesOutline ? style.outlineColor : style.borderColor,
          width: usesOutline ? style.outlineWidth : style.borderTopWidth,
          fill: style.backgroundColor,
        }
      })
      expect(colors.width).not.toBe("0px")
      expect(colors.edge).not.toBe("rgba(0, 0, 0, 0)")
      expect(colors.edge).not.toBe(colors.fill)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    return
  }

  const rail = page.locator('[data-slot="navigation-rail"]')
  const panel = rail.locator("..").locator('[data-slot="navigation-pane-panel"]')
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ forcedColors: "active", colorScheme })
    for (const surface of [rail, panel]) {
      const colors = await surface.evaluate((node) => {
        const style = getComputedStyle(node)
        const usesOutline = style.outlineStyle === "solid"
        return {
          edge: usesOutline ? style.outlineColor : style.borderColor,
          width: usesOutline ? style.outlineWidth : style.borderTopWidth,
          fill: style.backgroundColor,
        }
      })
      expect(colors.width).not.toBe("0px")
      expect(colors.edge).not.toBe("rgba(0, 0, 0, 0)")
      expect(colors.edge).not.toBe(colors.fill)
    }
    const selected = rail.locator('[data-slot="navigation-rail-item"][data-selected="true"]')
    await expect(selected).toHaveAttribute("aria-current", "page")
    const indicator = selected.locator('[data-slot="navigation-rail-indicator"]')
    const selectedFill = await indicator.evaluate((node) => getComputedStyle(node).backgroundColor)
    expect(selectedFill).not.toBe(await rail.evaluate((node) => getComputedStyle(node).backgroundColor))
    expect(await selected.locator('[data-slot="navigation-rail-icon"]').evaluate((node) => getComputedStyle(node).color))
      .not.toBe(selectedFill)
    await expect(selected.locator(".oneds-icon")).toHaveCSS("--icon-fill", "1")
  }
})