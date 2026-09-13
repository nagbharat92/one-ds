import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" })
})

test("List Item full and compact geometry stays concentric", async ({ page }) => {
  await page.goto("/#/list-item")

  const standard = page.locator('#list-item-default [data-slot="item"]')
  await expect(standard).toHaveCSS("padding", "16px")
  await expect(standard).toHaveCSS("border-radius", "26px")

  const textOnly = page.locator('#list-item-text-only [data-slot="item"]').first()
  await expect(textOnly).toHaveCSS("height", "40px")
  await expect(textOnly).toHaveCSS("padding", "6px")
  await expect(textOnly).toHaveCSS("border-radius", "20px")
  expect(await textOnly.evaluate(item => {
    const rect = (element: Element) => element.getBoundingClientRect()
    const itemRect = rect(item)
    const title = rect(item.querySelector('[data-slot="item-title-text"]')!)
    const metadata = rect(item.querySelector('[data-slot="item-actions"] span')!)
    return [title.left - itemRect.left, itemRect.right - metadata.right]
  })).toEqual([16, 16])

  const leading = page.locator('#list-item-leading-icon [data-slot="item"]')
  const fullMedia = leading.first().locator(':scope > [data-slot="item-media"]')
  await expect(fullMedia).toHaveCSS("width", "40px")
  await expect(fullMedia).toHaveCSS("border-radius", "20px")
  await expect(fullMedia.locator(":scope > .oneds-icon")).toHaveCSS("width", "20px")
  const compactMedia = leading.filter({ has: page.locator('[data-slot="item-title-text"]') }).nth(3).locator(':scope > [data-slot="item-media"]')
  await expect(compactMedia).toHaveCSS("width", "28px")
  await expect(compactMedia).toHaveCSS("border-radius", "14px")
  await expect(compactMedia.locator(":scope > .oneds-icon")).toHaveCSS("width", "16px")

  const links = page.locator('#list-item-link a[data-slot="item"]')
  for (const [index, hostSize, graphicInset] of [[0, 40, 26], [1, 28, 12]] as const) {
    const link = links.nth(index)
    expect(await link.evaluate((item, expected) => {
      const rect = (element: Element) => element.getBoundingClientRect()
      const itemRect = rect(item)
      const media = rect(item.querySelector(':scope > [data-slot="item-media"]')!)
      const action = rect(item.querySelector('[data-slot="item-action-slot"]')!)
      const favicon = rect(item.querySelector('[data-slot="favicon"]')!)
      const arrow = rect(item.querySelector('[data-slot="item-action-slot"] .oneds-icon')!)
      return {
        hosts: [media.width, action.width],
        edges: [media.left - itemRect.left, itemRect.right - action.right],
        graphics: [favicon.left - itemRect.left, itemRect.right - arrow.right],
        expected,
      }
    }, { hostSize, graphicInset })).toEqual({
      hosts: [hostSize, hostSize],
      edges: [index ? 6 : 16, index ? 6 : 16],
      graphics: [graphicInset, graphicInset],
      expected: { hostSize, graphicInset },
    })
  }

  const selected = page.locator('#list-item-states [data-slot="item"][data-compact]')
  const primary = selected.locator(':scope > [data-slot="item-primary-action"]')
  const menu = selected.locator(':scope > .item-actions--hosted [data-slot="dropdown-menu-trigger"]')
  await expect(selected).toHaveCSS("height", "40px")
  await expect(primary).toHaveCSS("height", "40px")
  await expect(menu).toHaveCSS("width", "28px")
  await expect(menu).toHaveCSS("border-radius", "14px")
  await expect(selected.locator('[data-slot="badge"]')).toHaveCount(0)
  await expect(primary.locator("button")).toHaveCount(0)

  const imageItem = page.locator('#list-item-image [data-slot="item"]')
  const image = imageItem.locator(':scope > [data-slot="item-media"]')
  await expect(image).toHaveCSS("width", "44px")
  await expect(image).toHaveCSS("border-radius", "10px")
  expect(await imageItem.evaluate(item => {
    const rect = (element: Element) => element.getBoundingClientRect()
    const itemRect = rect(item)
    const media = rect(item.querySelector(':scope > [data-slot="item-media"]')!)
    return [media.top - itemRect.top, media.left - itemRect.left, itemRect.bottom - media.bottom]
  })).toEqual([16, 16, 16.25])
})

test("List Item selection, hosted actions, and consumers use the shared contract", async ({ page }, testInfo) => {
  await page.goto("/#/list-item")

  const compact = page.locator('#list-item-states [data-slot="item"][data-compact]')
  const primary = compact.locator(':scope > [data-slot="item-primary-action"]')
  const trigger = compact.locator(':scope > .item-actions--hosted [data-slot="dropdown-menu-trigger"]')
  await expect(primary).toHaveAttribute("aria-pressed", "true")
  await page.locator('#list-item-states button[data-slot="item"]').filter({ hasText: "Engineering" }).click()
  await expect(primary).toHaveAttribute("aria-pressed", "false")
  await primary.click()
  await expect(primary).toHaveAttribute("aria-pressed", "true")
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(primary).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("menuitem", { name: "Rename", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")

  if (testInfo.project.name === "desktop") {
    const rest = await compact.evaluate(element => getComputedStyle(element).backgroundColor)
    await primary.hover()
    const hover = await compact.evaluate(element => getComputedStyle(element).backgroundColor)
    const bounds = await primary.boundingBox()
    expect(bounds).not.toBeNull()
    await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
    await page.mouse.down()
    const pressed = await compact.evaluate(element => getComputedStyle(element).backgroundColor)
    await page.mouse.up()
    expect(hover).not.toBe(rest)
    expect(pressed).not.toBe(hover)
  }

  await page.goto("/#/elevation")
  const elevationItem = page.locator('[data-slot="item"]').first()
  await expect(elevationItem).toHaveCSS("height", "40px")
  await expect(elevationItem).toHaveCSS("border-radius", "20px")

  await page.goto("/#/persona")
  const personaCompact = page.locator('#persona-sizes [data-slot="item"]').first()
  await expect(personaCompact).toHaveAttribute("data-compact", "")
  await expect(personaCompact).toHaveCSS("height", "40px")

  if (testInfo.project.name === "desktop") {
    await page.goto("/#/block-ai-chat")
    const historyItem = page.locator('.ai-chat-history [data-slot="item"]').first()
    await expect(historyItem).toHaveAttribute("data-compact", "")
    await expect(historyItem).toHaveCSS("height", "40px")
    const historyPrimary = historyItem.locator(':scope > [data-slot="item-primary-action"]')
    await expect(historyPrimary).toBeAttached()
    const historyAction = historyItem.locator(':scope > .item-actions--hosted [data-slot="dropdown-menu-trigger"]')
    await expect(historyAction).toHaveCSS("width", "28px")
    await historyPrimary.click()
    await page.evaluate(() => document.documentElement.classList.add("dark"))
    const darkSurfaces = await historyItem.evaluate(item => {
      item.getAnimations().forEach(animation => animation.finish())
      const action = item.querySelector<HTMLElement>(':scope > .item-actions--hosted')!
      return {
        row: getComputedStyle(item).backgroundColor,
        action: getComputedStyle(action).backgroundColor,
        fade: getComputedStyle(action, "::before").backgroundImage,
        host: getComputedStyle(item).getPropertyValue("--item-host-surface").trim(),
        sidebar: getComputedStyle(item.closest('[data-slot="sidebar"]')!).getPropertyValue("--sidebar").trim(),
      }
    })
    expect(darkSurfaces.host).toBe(darkSurfaces.sidebar)
    expect(darkSurfaces.action).toBe(darkSurfaces.row)
    expect(darkSurfaces.fade).toContain(darkSurfaces.action)
    await historyAction.click()
    await page.getByRole("menuitem", { name: "Rename", exact: true }).click()
    const rename = historyItem.locator(':scope > [data-slot="sidebar-input"]')
    await expect(historyItem).toHaveCSS("height", "40px")
    await expect(historyItem).toHaveCSS("padding", "4px")
    await expect(rename).toHaveCSS("height", "32px")
    await expect(rename).toHaveCSS("border-radius", "16px")
  }
})
