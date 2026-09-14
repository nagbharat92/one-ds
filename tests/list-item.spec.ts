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

  const selected = page.locator('#list-item-states [data-slot="item"][data-compact]').first()
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

  const states = page.locator("#list-item-states")
  const panes = states.locator('[data-slot="canvas-split-pane"]')
  await expect(panes).toHaveCount(2)
  await expect(states.locator('[data-slot="item-group"]')).toHaveCount(2)
  await expect(states.locator('[data-slot="item"]')).toHaveCount(10)
  const paneSurfaces = await panes.evaluateAll(elements => elements.map(element => {
    const pane = element as HTMLElement
    const item = pane.querySelector('[data-slot="item"]')!
    const surface = pane.dataset.surface
    const itemStyle = getComputedStyle(item)
    const paneStyle = getComputedStyle(pane)
    return {
      surface,
      host: itemStyle.getPropertyValue("--item-host-surface").trim(),
      expected: paneStyle.getPropertyValue(`--canvas-split-${surface}-background`).trim(),
      hover: itemStyle.getPropertyValue("--item-default-hover-surface").trim(),
    }
  }))
  expect(paneSurfaces.map(({ surface, host, expected }) => ({ surface, matches: host === expected }))).toEqual([
    { surface: "card", matches: true },
    { surface: "sidebar", matches: true },
  ])
  expect(paneSurfaces[0].host).not.toBe(paneSurfaces[1].host)
  expect(paneSurfaces[0].hover).not.toBe(paneSurfaces[1].hover)

  const compactItems = states.locator('[data-slot="item"][data-compact]')
  await expect(compactItems).toHaveCount(2)
  for (const item of await compactItems.all()) {
    expect(await item.evaluate(element => {
      const resolve = (property: "backgroundColor" | "color", token: string) => {
        const probe = document.createElement("span")
        probe.style[property] = `var(${token})`
        element.append(probe)
        const value = getComputedStyle(probe)[property]
        probe.remove()
        return value
      }
      const style = getComputedStyle(element)
      return {
        fillMatches: style.backgroundColor === resolve("backgroundColor", "--button-secondary-fill"),
        inkMatches: style.color === resolve("color", "--button-secondary-ink"),
      }
    })).toEqual({ fillMatches: true, inkMatches: true })
  }
  const compact = compactItems.first()
  const primary = compact.locator(':scope > [data-slot="item-primary-action"]')
  const trigger = compact.locator(':scope > .item-actions--hosted [data-slot="dropdown-menu-trigger"]')
  for (const item of await compactItems.all()) {
    await expect(item.locator(':scope > [data-slot="item-primary-action"]')).toHaveAttribute("aria-pressed", "true")
  }
  await states.locator('button[data-slot="item"]').filter({ hasText: "Engineering" }).first().click()
  for (const item of await compactItems.all()) {
    await expect(item.locator(':scope > [data-slot="item-primary-action"]')).toHaveAttribute("aria-pressed", "false")
  }
  await primary.click()
  for (const item of await compactItems.all()) {
    await expect(item.locator(':scope > [data-slot="item-primary-action"]')).toHaveAttribute("aria-pressed", "true")
  }
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(primary).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("menuitem", { name: "Rename", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")

  if (testInfo.project.name === "desktop") {
    const expected = await compact.evaluate(element => {
      const paint = (color: string) => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        context.fillStyle = color
        context.fillRect(0, 0, 1, 1)
        return Array.from(context.getImageData(0, 0, 1, 1).data)
      }
      const resolve = (token: string) => {
        const probe = document.createElement("span")
        probe.style.backgroundColor = `var(${token})`
        element.append(probe)
        const color = paint(getComputedStyle(probe).backgroundColor)
        probe.remove()
        return color
      }
      return {
        rest: resolve("--item-muted-surface"),
        hover: resolve("--item-muted-hover-surface"),
        pressed: resolve("--item-muted-pressed-surface"),
      }
    })
    const readColor = () => compact.evaluate(element => {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!
      context.fillStyle = getComputedStyle(element).backgroundColor
      context.fillRect(0, 0, 1, 1)
      return Array.from(context.getImageData(0, 0, 1, 1).data)
    })
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await page.mouse.move(0, 0)
    await expect.poll(readColor).toEqual(expected.rest)
    const rest = await readColor()
    await primary.hover()
    await expect.poll(readColor).toEqual(expected.hover)
    const hover = await readColor()
    const bounds = await primary.boundingBox()
    expect(bounds).not.toBeNull()
    await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
    await page.mouse.down()
    await expect.poll(readColor).toEqual(expected.pressed)
    const pressed = await readColor()
    await page.mouse.up()
    expect(hover).not.toEqual(rest)
    expect(hover).toEqual(expected.hover)
    expect(pressed).toEqual(expected.pressed)
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

test("Sidebar navigation uses the compact Item contract without shifting its rail icons", async ({ page }, testInfo) => {
  await page.goto("/#/calendar")
  if (testInfo.project.use.isMobile) {
    await page.getByRole("button", { name: "Open sidebar", exact: true }).click()
  }

  const siteNavigation = page.locator('[data-theme-scope="showcase-navigation"]')
  const siteRow = siteNavigation.locator('[data-slot="item"]').first()
  await expect(siteRow).toHaveCSS("height", "40px")
  await expect(siteRow).toHaveCSS("padding", "6px")
  await expect(siteRow).toHaveCSS("border-radius", "20px")
  await expect(siteRow.locator(':scope > [data-slot="item-content"] [data-slot="item-title-text"]')).toHaveCount(1)
  expect(await siteRow.evaluate(row => {
    const rowRect = row.getBoundingClientRect()
    const textRect = row.querySelector('[data-slot="item-title-text"]')!.getBoundingClientRect()
    return textRect.left - rowRect.left
  })).toBe(16)
  const siteStates = await siteRow.evaluate(row => {
    const paint = (color: string) => {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      return Array.from(context.getImageData(0, 0, 1, 1).data)
    }
    const style = getComputedStyle(row)
    const sidebarStyle = getComputedStyle(row.closest('[data-slot="sidebar"]')!)
    return {
      host: paint(style.getPropertyValue("--item-host-surface")),
      sidebar: paint(sidebarStyle.getPropertyValue("--sidebar")),
      hover: paint(style.getPropertyValue("--item-default-hover-surface")),
      pressed: paint(style.getPropertyValue("--item-default-pressed-surface")),
    }
  })
  expect(siteStates.host).toEqual(siteStates.sidebar)
  expect(siteStates.hover).not.toEqual(siteStates.host)
  expect(siteStates.pressed).not.toEqual(siteStates.hover)

  if (testInfo.project.use.isMobile) return

  await page.goto("/#/sidebar")
  const preview = page.locator("#sidebar-collapse-states")
  const sidebar = preview.locator('[data-slot="sidebar"]').first()
  const group = sidebar.locator('[data-slot="sidebar-group"]').first()
  const row = group.locator('[data-slot="sidebar-menu-button"]').first()
  const icon = row.locator(":scope > svg")
  const label = row.locator(':scope > [data-slot="icon-label"]')

  await expect(row).toHaveCSS("height", "40px")
  await expect(row).toHaveCSS("padding-top", "6px")
  await expect(row).toHaveCSS("padding-bottom", "6px")
  await expect(row).toHaveCSS("padding-left", "12px")
  await expect(row).toHaveCSS("padding-right", "12px")
  await expect(row).toHaveCSS("border-radius", "20px")
  await expect(group).toHaveCSS("padding-left", "16px")
  const activeIcon = row.locator(".material-glyph text")
  await expect(activeIcon).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
  expect(await sidebar.evaluate((root) => {
    const rowIcon = root.querySelector('[data-slot="sidebar-menu-button"] > svg')!
    const rootRect = root.getBoundingClientRect()
    const iconRect = rowIcon.getBoundingClientRect()
    return iconRect.left + iconRect.width / 2 - rootRect.left
  })).toBeCloseTo(36, 1)

  const idleRow = group.locator('[data-slot="sidebar-menu-button"]').nth(1)
  const expectedStates = await idleRow.evaluate(element => {
    const resolve = (token: string) => {
      const probe = document.createElement("span")
      probe.style.backgroundColor = `var(${token})`
      element.append(probe)
      const color = getComputedStyle(probe).backgroundColor
      probe.remove()
      return color
    }
    return {
      hover: resolve("--item-default-hover-surface"),
      pressed: resolve("--item-default-pressed-surface"),
    }
  })
  const rest = await idleRow.evaluate(element => getComputedStyle(element).backgroundColor)
  await expect(idleRow.locator(".material-glyph text")).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
  await idleRow.hover()
  const hover = await idleRow.evaluate(element => getComputedStyle(element).backgroundColor)
  const bounds = await idleRow.boundingBox()
  expect(bounds).not.toBeNull()
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await page.mouse.down()
  const pressed = await idleRow.evaluate(element => getComputedStyle(element).backgroundColor)
  await page.mouse.up()
  expect(hover).not.toBe(rest)
  expect(hover).toBe(expectedStates.hover)
  expect(pressed).toBe(expectedStates.pressed)
  await expect(idleRow.locator(".material-glyph text")).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)

  await preview.getByRole("button", { name: "bar", exact: true }).evaluate(button => button.click())
  await expect(sidebar).toHaveAttribute("data-collapse", "bar")
  await expect(row).toHaveCSS("width", "40px")
  await expect(row).toHaveCSS("height", "40px")
  await expect(row).toHaveCSS("padding", "12px")
  await expect(row).toHaveCSS("border-radius", "20px")
  await expect(group).toHaveCSS("padding-left", "4px")
  await expect(label).toHaveCSS("opacity", "0")
  expect(await sidebar.evaluate((root) => {
    const rowIcon = root.querySelector('[data-slot="sidebar-menu-button"] > svg')!
    const rootRect = root.getBoundingClientRect()
    const iconRect = rowIcon.getBoundingClientRect()
    return iconRect.left + iconRect.width / 2 - rootRect.left
  })).toBeCloseTo(24, 1)

  // Verify the header brand mark and trigger button are centered on the 24px rail with zero clipping
  const headerMetrics = await sidebar.evaluate((root) => {
    const rootRect = root.getBoundingClientRect()
    const brandMark = root.querySelector('[data-slot="sidebar-brand-mark"]')!
    const trigger = root.querySelector('[data-slot="sidebar-trigger"]')!
    const bmRect = brandMark.getBoundingClientRect()
    const trRect = trigger.getBoundingClientRect()
    return {
      markCenterX: bmRect.left + bmRect.width / 2 - rootRect.left,
      triggerCenterX: trRect.left + trRect.width / 2 - rootRect.left,
      triggerLeft: trRect.left - rootRect.left,
      triggerRight: rootRect.right - trRect.right,
      triggerWidth: trRect.width,
    }
  })
  expect(headerMetrics.markCenterX).toBeCloseTo(24, 1)
  expect(headerMetrics.triggerCenterX).toBeCloseTo(24, 1)
  expect(headerMetrics.triggerLeft).toBeGreaterThanOrEqual(3)
  expect(headerMetrics.triggerRight).toBeGreaterThanOrEqual(3)
  expect(headerMetrics.triggerWidth).toBe(40)

  const placementSection = page.locator("#sidebar-placement")
  await placementSection.getByRole("button", { name: "floating", exact: true }).evaluate(button => button.click())
  const floatingPanel = placementSection.locator('[data-slot="sidebar-inner"]')
  await expect(floatingPanel).toHaveCSS("border-radius", "28px")

  // Inset collapsed panel must have full 48px rail width without squishing or clipping
  await placementSection.getByRole("button", { name: "inset", exact: true }).evaluate(button => button.click())
  const insetTrigger = placementSection.locator('[data-slot="sidebar-trigger"]').first()
  await insetTrigger.evaluate(button => button.click())
  const insetPanel = placementSection.locator('[data-slot="sidebar-inner"]')
  await expect(insetPanel).toHaveCSS("width", "48px")
})
