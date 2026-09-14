import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" })
})

test("Table headers use 56px rows and Secondary pill sort triggers", async ({
  page,
}) => {
  await page.goto("/#/table")
  const baseHeads = page.locator('[data-slot="table-head"]')
  expect(await baseHeads.count()).toBeGreaterThan(0)
  expect(
    await baseHeads.evaluateAll((heads) => [
      ...new Set(heads.map((head) => getComputedStyle(head).height)),
    ])
  ).toEqual(["56px"])

  await page.goto("/#/data-table")
  const heads = page.locator('[data-slot="table-head"]')
  expect(await heads.count()).toBeGreaterThan(0)
  expect(
    await heads.evaluateAll((elements) => [
      ...new Set(elements.map((head) => getComputedStyle(head).height)),
    ])
  ).toEqual(["56px"])

  const rows = page.locator('[data-slot="table-row"]')
  const rowGeometry = await rows.evaluateAll((elements) =>
    elements.map((row) => {
      const bounds = row.getBoundingClientRect()
      const firstStyle = getComputedStyle(row.firstElementChild!)
      const lastStyle = getComputedStyle(row.lastElementChild!)
      return {
        height: bounds.height,
        radii: [
          firstStyle.borderStartStartRadius,
          firstStyle.borderEndStartRadius,
          lastStyle.borderStartEndRadius,
          lastStyle.borderEndEndRadius,
        ].map(Number.parseFloat),
      }
    })
  )
  for (const row of rowGeometry) {
    expect(row.radii.every((radius) => radius >= row.height / 2)).toBe(true)
  }

  const opticalEdges = await rows.evaluateAll((elements) => {
    const directEdgeText = (cell: Element | null) =>
      cell?.querySelector<HTMLElement>(":scope > .edge-text") ?? null
    const leading = elements
      .map((row) => directEdgeText(row.firstElementChild))
      .filter((element): element is HTMLElement => Boolean(element))
    const trailing = elements
      .map((row) => directEdgeText(row.lastElementChild))
      .filter((element): element is HTMLElement => Boolean(element))
    const interior = elements.flatMap((row) =>
      [...row.children]
        .slice(1, -1)
        .map(directEdgeText)
        .filter((element): element is HTMLElement => Boolean(element))
    )
    const controlEdges = elements
      .flatMap((row) => [row.firstElementChild, row.lastElementChild])
      .filter((cell) => cell?.querySelector('button, input, [role="checkbox"]'))
    const padding = (edgeText: HTMLElement[]) => [
      ...new Set(
        edgeText.map((element) => {
          const style = getComputedStyle(element)
          return `${style.paddingInlineStart}/${style.paddingInlineEnd}`
        })
      ),
    ]

    return {
      optedInRows: elements.filter((row) =>
        row.hasAttribute("data-optical-edges")
      ).length,
      leadingCount: leading.length,
      leadingPadding: padding(leading),
      trailingCount: trailing.length,
      trailingPadding: padding(trailing),
      interiorPadding: padding(interior),
      controlEdgesWrapped: controlEdges.filter((cell) => directEdgeText(cell))
        .length,
    }
  })
  expect(opticalEdges.optedInRows).toBe(await rows.count())
  expect(opticalEdges.leadingCount).toBeGreaterThan(0)
  expect(opticalEdges.leadingPadding).toEqual(["16px/0px"])
  expect(opticalEdges.trailingCount).toBeGreaterThan(0)
  expect(opticalEdges.trailingPadding).toEqual(["0px/16px"])
  expect(opticalEdges.interiorPadding).toEqual(["0px/0px"])
  expect(opticalEdges.controlEdgesWrapped).toBe(0)

  const bodyEdgePadding = await page
    .locator('[data-slot="table-body"] > [data-slot="table-row"]')
    .evaluateAll((bodyRows) => ({
      leading: [
        ...new Set(
          bodyRows.map(
            (row) => getComputedStyle(row.firstElementChild!).paddingInlineStart
          )
        ),
      ],
      trailing: [
        ...new Set(
          bodyRows.map(
            (row) => getComputedStyle(row.lastElementChild!).paddingInlineEnd
          )
        ),
      ],
    }))
  expect(bodyEdgePadding.leading).toEqual(["24px"])
  expect(bodyEdgePadding.trailing).toEqual(["24px"])

  const hoverRow = page
    .locator('[data-slot="table-body"] > [data-slot="table-row"]')
    .first()
  const hoverCell = hoverRow.locator('[data-slot="table-cell"]').first()
  const restFill = await hoverCell.evaluate(
    (cell) => getComputedStyle(cell).backgroundColor
  )
  await hoverRow.hover()
  await expect(hoverCell).not.toHaveCSS("background-color", restFill)

  const sorting = page.locator("#data-table-sorting")
  const plainHead = sorting.locator('[data-slot="table-head"]').first()
  const plainInset = await plainHead.evaluate(
    (head) => getComputedStyle(head).paddingInlineStart
  )
  const sortButtons = page.locator("[data-table-sort-button]")
  await expect(sortButtons).toHaveCount(6)
  const geometry = await sortButtons.evaluateAll((buttons) =>
    buttons.map((button) => {
      const style = getComputedStyle(button)
      const head = button.closest<HTMLElement>('[data-slot="table-head"]')!
      const headStyle = getComputedStyle(head)
      const icon = button.querySelector<HTMLElement>(".oneds-icon")!
      const cells = [...head.parentElement!.children]
      return {
        atEnd: cells.at(-1) === head,
        atStart: cells[0] === head,
        gap: style.columnGap,
        headHeight: head.offsetHeight,
        headPadding: [headStyle.paddingInlineStart, headStyle.paddingInlineEnd],
        height: (button as HTMLElement).offsetHeight,
        icon: [getComputedStyle(icon).width, getComputedStyle(icon).height],
        padding: [style.paddingInlineStart, style.paddingInlineEnd],
        radius: style.borderRadius,
        size: button.getAttribute("data-size"),
        variant: button.getAttribute("data-variant"),
      }
    })
  )

  for (const button of geometry) {
    expect(button.headHeight).toBe(56)
    expect(button.height).toBe(40)
    expect((button.headHeight - button.height) / 2).toBe(8)
    expect(button.radius).toBe("20px")
    expect(button.variant).toBe("secondary")
    expect(button.size).toBe("default")
    expect(button.headPadding).toEqual([
      button.atStart ? "24px" : "0px",
      button.atEnd ? "24px" : "0px",
    ])
    expect(button.padding).toEqual([plainInset, plainInset])
    expect(button.gap).toBe("8px")
    expect(button.icon).toEqual(["20px", "20px"])
  }

  const statusSort = sorting
    .getByRole("button", { name: /^Status/ })
    .first()
  const icon = statusSort.locator(".oneds-icon")
  const initialSymbol = await icon.getAttribute("data-material-symbol")
  await statusSort.click()
  await expect(icon).not.toHaveAttribute("data-material-symbol", initialSymbol!)

  const visibility = page.locator("#data-table-visibility")
  const visibilityPreview = visibility.locator('[data-slot="canvas"]').first()
  const visibilityButton = visibilityPreview.getByRole("button", {
    name: "Columns",
    exact: true,
  })
  const measureVisibility = () =>
    visibilityPreview.evaluate((preview) => {
      const column = preview.querySelector<HTMLElement>(".w-full.space-y-4")!
      const table = preview.querySelector<HTMLElement>(
        '[data-slot="table-container"]'
      )!
      const button = preview.querySelector<HTMLElement>(
        '[data-slot="dropdown-menu-trigger"]'
      )!
      const icon = button.querySelector<HTMLElement>(".oneds-icon")!
      const columnBounds = column.getBoundingClientRect()
      const buttonBounds = button.getBoundingClientRect()
      const buttonStyle = getComputedStyle(button)
      return {
        button: buttonBounds.width,
        endGap: columnBounds.right - buttonBounds.right,
        gap: buttonStyle.columnGap,
        icon: getComputedStyle(icon).width,
        radius: buttonStyle.borderRadius,
        startGap: buttonBounds.left - columnBounds.left,
        table: table.getBoundingClientRect().width,
        variant: button.getAttribute("data-variant"),
      }
    })
  const visibleColumns = await measureVisibility()
  expect(visibleColumns.button).toBe(160)
  expect(visibleColumns.radius).toBe("20px")
  expect(visibleColumns.variant).toBe("secondary")
  expect(visibleColumns.gap).toBe("8px")
  expect(visibleColumns.icon).toBe("20px")
  expect(Math.abs(visibleColumns.startGap - visibleColumns.endGap)).toBeLessThan(1)

  await visibilityButton.click()
  await page
    .locator('[data-slot="dropdown-menu-content"][data-state="open"]')
    .getByRole("menuitemcheckbox", { name: "Invoice", exact: true })
    .click()
  await expect(
    visibilityPreview.getByRole("columnheader", { name: "Invoice", exact: true })
  ).toHaveCount(0)
  const hiddenColumn = await measureVisibility()
  expect(hiddenColumn.table).toBe(visibleColumns.table)
  expect(hiddenColumn.button).toBe(visibleColumns.button)
  expect(hiddenColumn.startGap).toBe(visibleColumns.startGap)
  expect(hiddenColumn.endGap).toBe(visibleColumns.endGap)

  const columnToggle = page.locator("#data-table-column-toggle")
  const columnTogglePreview = columnToggle.locator('[data-slot="canvas"]').first()
  const measureColumnToggle = () =>
    columnTogglePreview.evaluate((preview) => {
      const column = preview.querySelector<HTMLElement>(".w-full.space-y-4")!
      const controls = column.firstElementChild as HTMLElement
      const table = preview.querySelector<HTMLElement>(
        '[data-slot="table-container"]'
      )!
      const buttons = [...controls.querySelectorAll<HTMLElement>("button")]
      const columnBounds = column.getBoundingClientRect()
      const firstButton = buttons[0].getBoundingClientRect()
      const lastButton = buttons.at(-1)!.getBoundingClientRect()
      return {
        centerDelta: Math.abs(
          (firstButton.left + lastButton.right) / 2 -
            (columnBounds.left + columnBounds.right) / 2
        ),
        table: table.getBoundingClientRect().width,
      }
    })
  const allToggleColumns = await measureColumnToggle()
  expect(allToggleColumns.centerDelta).toBeLessThan(1)
  await columnTogglePreview
    .getByRole("button", { name: "email", exact: true })
    .click()
  await expect(
    columnTogglePreview.getByRole("columnheader", { name: "Email", exact: true })
  ).toHaveCount(0)
  const hiddenToggleColumn = await measureColumnToggle()
  expect(hiddenToggleColumn.table).toBe(allToggleColumns.table)
  expect(hiddenToggleColumn.centerDelta).toBe(allToggleColumns.centerDelta)

  const filtering = page.locator("#data-table-filtering")
  const filteringPreview = filtering.locator('[data-slot="canvas"]').first()
  const search = filteringPreview.locator('[data-slot="search-input"]')
  const filteredTable = filteringPreview.locator('[data-slot="table-container"]')
  await expect(search.getByRole("searchbox")).toHaveAttribute(
    "aria-label",
    "Filter payments"
  )
  const measureFiltering = () =>
    filteringPreview.evaluate((preview) => {
      const searchElement = preview.querySelector<HTMLElement>(
        '[data-slot="search-input"]'
      )!
      const tableElement = preview.querySelector<HTMLElement>(
        '[data-slot="table-container"]'
      )!
      const searchBounds = searchElement.getBoundingClientRect()
      const tableBounds = tableElement.getBoundingClientRect()
      return {
        endGap: tableBounds.right - searchBounds.right,
        maxWidth: Number.parseFloat(getComputedStyle(searchElement).maxWidth),
        search: searchBounds.width,
        startGap: searchBounds.left - tableBounds.left,
        table: tableBounds.width,
      }
    })
  const populatedWidths = await measureFiltering()
  expect(populatedWidths.maxWidth).toBe(720)
  expect(populatedWidths.search).toBe(
    Math.min(populatedWidths.table, populatedWidths.maxWidth)
  )
  expect(
    Math.abs(populatedWidths.startGap - populatedWidths.endGap)
  ).toBeLessThan(1)

  await search.getByRole("searchbox").fill("no-match-value")
  await expect(
    filteringPreview.getByText("No results.", { exact: true })
  ).toBeVisible()
  const emptyWidths = await measureFiltering()
  expect(emptyWidths).toEqual(populatedWidths)
  await expect(filteredTable).toBeVisible()
})