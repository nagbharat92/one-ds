import { expect, test, type Locator, type Page } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" })
})

async function inspectMenu(
  page: Page,
  trigger: Locator,
  expected: { implicitGroups: number; explicitGroups: number; items: number }
) {
  await trigger.press("Enter")
  const content = page.locator(
    '[data-slot="dropdown-menu-content"][data-state="open"]'
  )
  await expect(content).toBeVisible()
  await expect(content).toHaveAttribute("data-grouped", "true")

  const anatomy = await content.evaluate((element) => {
    const implicitGroups = [
      ...element.querySelectorAll<HTMLElement>('[data-slot="menu-group"]'),
    ]
    const explicitGroups = [
      ...element.querySelectorAll<HTMLElement>(
        '[data-slot="dropdown-menu-group"]'
      ),
    ]
    const surfaces = [...implicitGroups, ...explicitGroups]
    const items = [
      ...element.querySelectorAll<HTMLElement>(
        '[data-slot="dropdown-menu-item"]'
      ),
    ]

    return {
      contentBackground: getComputedStyle(element).backgroundColor,
      implicitGroups: implicitGroups.length,
      explicitGroups: explicitGroups.length,
      items: items.length,
      itemMinHeights: items.map((item) => getComputedStyle(item).minHeight),
      surfaces: surfaces.map((surface) => {
        const style = getComputedStyle(surface)
        const bounds = surface.getBoundingClientRect()
        return {
          background: style.backgroundColor,
          radius: style.borderRadius,
          shadow: style.boxShadow,
          containsItems: items
            .filter((item) => surface.contains(item))
            .every((item) => {
              const itemBounds = item.getBoundingClientRect()
              return (
                itemBounds.top >= bounds.top &&
                itemBounds.right <= bounds.right &&
                itemBounds.bottom <= bounds.bottom &&
                itemBounds.left >= bounds.left
              )
            }),
        }
      }),
    }
  })

  expect(anatomy.contentBackground).toBe("rgba(0, 0, 0, 0)")
  expect(anatomy.implicitGroups).toBe(expected.implicitGroups)
  expect(anatomy.explicitGroups).toBe(expected.explicitGroups)
  expect(anatomy.items).toBe(expected.items)
  expect(anatomy.itemMinHeights).toEqual(
    Array.from({ length: expected.items }, () => "40px")
  )
  for (const surface of anatomy.surfaces) {
    expect(surface.background).not.toBe("rgba(0, 0, 0, 0)")
    expect(surface.radius).toBe("24px")
    expect(surface.shadow).not.toBe("none")
    expect(surface.containsItems).toBe(true)
  }
}

test("command menus own expressive chunks by default", async ({ page }) => {
  await page.goto("/#/data-table")
  await inspectMenu(
    page,
    page
      .locator("#data-table-row-actions")
      .locator('[data-slot="dropdown-menu-trigger"]')
      .first(),
    { implicitGroups: 1, explicitGroups: 0, items: 4 }
  )
  await expect(
    page.locator(
      '[data-slot="dropdown-menu-label"] + [data-slot="dropdown-menu-separator"]'
    )
  ).toHaveCSS("display", "none")
  const constrainedContent = page.locator(
    '[data-slot="dropdown-menu-content"][data-state="open"]'
  )
  await constrainedContent.evaluate((element) => {
    const item = element.querySelector<HTMLElement>(
      '[data-slot="dropdown-menu-item"]'
    )!
    const rowHeight = Number.parseFloat(getComputedStyle(item).minHeight)
    ;(element as HTMLElement).style.maxHeight = `${rowHeight * 2}px`
    getComputedStyle(element).maxHeight
    ;[element, ...element.querySelectorAll("*")].forEach((node) => {
      node.getAnimations().forEach((animation) => {
        if (animation instanceof CSSTransition) animation.finish()
      })
    })
  })
  const scrollState = await constrainedContent
    .locator('[data-slot="menu-group"]')
    .evaluate((group) => {
      group.scrollTop = group.scrollHeight
      return {
        clientHeight: group.clientHeight,
        overflowY: getComputedStyle(group).overflowY,
        scrollHeight: group.scrollHeight,
        scrollTop: group.scrollTop,
      }
    })
  expect(scrollState.overflowY).toBe("auto")
  expect(scrollState.clientHeight).toBeLessThan(scrollState.scrollHeight)
  expect(scrollState.scrollTop).toBeGreaterThan(0)

  await page.goto("/#/avatar")
  await inspectMenu(
    page,
    page
      .locator("#avatar-dropdown")
      .locator('[data-slot="dropdown-menu-trigger"]'),
    { implicitGroups: 1, explicitGroups: 0, items: 3 }
  )
  expect(
    await page
      .locator(
        '[data-slot="dropdown-menu-content"][data-state="open"] [data-slot="dropdown-menu-separator"]'
      )
      .evaluateAll((separators) =>
        separators.map((separator) => getComputedStyle(separator).display)
      )
  ).toEqual(["none", "block"])

  await page.goto("/#/dropdown-menu")
  await inspectMenu(
    page,
    page.getByRole("button", { name: "Open menu", exact: true }).first(),
    { implicitGroups: 0, explicitGroups: 2, items: 3 }
  )
})

test("Select viewport inherits the menu cap and owns scrolling", async ({
  page,
}) => {
  await page.goto("/#/select")
  await page
    .locator("#select-scrollable")
    .getByRole("combobox")
    .press("Enter")

  const content = page.locator('[data-slot="select-content"][data-state="open"]')
  await expect(content).toBeVisible()
  const dimensions = await content.evaluate((element) => {
    const viewport = element.querySelector<HTMLElement>(".select-viewport")!
    return {
      contentMaxHeight: getComputedStyle(element).maxHeight,
      viewportMaxHeight: getComputedStyle(viewport).maxHeight,
      overflowY: getComputedStyle(viewport).overflowY,
      clientHeight: viewport.clientHeight,
      scrollHeight: viewport.scrollHeight,
    }
  })

  expect(dimensions.viewportMaxHeight).toBe(dimensions.contentMaxHeight)
  expect(dimensions.overflowY).toBe("auto")
  expect(dimensions.clientHeight).toBeLessThan(dimensions.scrollHeight)
})

async function expectForcedColorsEdge(surface: Locator) {
  await expect(surface).toBeVisible()
  const colors = await surface.evaluate((node) => {
    const style = getComputedStyle(node)
    return {
      edge: style.outlineColor,
      style: style.outlineStyle,
      width: style.outlineWidth,
      fill: style.backgroundColor,
    }
  })
  expect(colors.style).toBe("solid")
  expect(colors.width).toBe("1px")
  expect(colors.edge).not.toBe(colors.fill)
}

test("grouped menu chunks retain an edge in forced colors", async ({ page }, testInfo) => {
  test.skip(
    Boolean(testInfo.project.use.isMobile),
    "Right-click surface is checked with a desktop pointer"
  )
  const checkChunk = async (contentSelector: string, groupSelector: string) => {
    const content = page.locator(`${contentSelector}[data-state="open"]`).first()
    await expect(content).toBeVisible()
    expect(
      await content.evaluate((node) => getComputedStyle(node).backgroundColor)
    ).toMatch(/,\s*0\)$/)
    await expectForcedColorsEdge(content.locator(groupSelector).first())
  }

  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ forcedColors: "active", colorScheme })
    await page.goto("/#/dropdown-menu")
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .first()
      .press("Enter")
    await checkChunk(
      '[data-slot="dropdown-menu-content"]',
      '[data-slot="dropdown-menu-group"]'
    )

    await page.goto("/#/avatar")
    await page
      .locator("#avatar-dropdown [data-slot='dropdown-menu-trigger']")
      .press("Enter")
    await checkChunk('[data-slot="dropdown-menu-content"]', '[data-slot="menu-group"]')

    await page.goto("/#/context-menu")
    await page
      .locator('[data-slot="context-menu-trigger"]')
      .first()
      .click({ button: "right" })
    await checkChunk(
      '[data-slot="context-menu-content"]',
      '[data-slot="context-menu-group"]'
    )

    await page.goto("/#/menubar")
    await page.locator('[data-slot="menubar-trigger"]').first().click()
    await checkChunk(
      '[data-slot="menubar-content"]',
      '[data-slot="menubar-group"]'
    )
  }
})

test("grouped submenus keep a forced-colors edge", async ({ page }, testInfo) => {
  test.skip(
    Boolean(testInfo.project.use.isMobile),
    "Hover-open submenus are checked with a desktop pointer"
  )
  await page.emulateMedia({ forcedColors: "active" })

  await page.goto("/#/dropdown-menu")
  await page
    .getByRole("button", { name: "Open menu", exact: true })
    .first()
    .press("Enter")
  await page.getByRole("menuitem", { name: "More tools" }).hover()
  await expectForcedColorsEdge(
    page.locator('[data-slot="dropdown-menu-sub-content"][data-state="open"]')
  )

  await page.goto("/#/context-menu")
  await page
    .locator('[data-slot="context-menu-trigger"]')
    .filter({ hasText: "Right click — submenu" })
    .first()
    .click({ button: "right" })
  await page.getByRole("menuitem", { name: "More tools" }).hover()
  await expectForcedColorsEdge(
    page.locator('[data-slot="context-menu-sub-content"][data-state="open"]')
  )

  await page.goto("/#/menubar")
  await page
    .locator('[data-slot="menubar-trigger"]')
    .filter({ hasText: /^File$/ })
    .nth(1)
    .click()
  await page.getByRole("menuitem", { name: "Share" }).hover()
  await expectForcedColorsEdge(
    page.locator('[data-slot="menubar-sub-content"][data-state="open"]')
  )
})