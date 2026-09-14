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
      .getByRole("button", { name: "Row actions" })
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
      .getByRole("button", { name: "User menu" }),
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