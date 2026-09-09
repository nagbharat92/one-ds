import { expect, test } from "@playwright/test"

test("connected ButtonGroups keep soft gaps and selected shapes without shifting neighbors", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
  for (const mode of ["light", "dark"] as const) {
    await page.goto("about:blank")
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    await page.goto("/#/button-group")
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    for (const size of ["default", "expressive"]) {
      await page.mouse.move(0, 0)
      const group = page.getByRole("radiogroup", { name: `Serving size ${size}`, exact: true })
      const buttons = group.getByRole("radio")
      const radius = size === "default" ? "20px" : "28px"
      const geometry = () => buttons.evaluateAll(elements => elements.map(element => {
        const button = element as HTMLElement
        return [button.offsetLeft, button.offsetWidth, button.offsetHeight]
      }))
      await expect(buttons.first()).toHaveCSS("border-radius", radius)
      await expect(buttons.nth(1)).toHaveCSS("border-radius", "8px")
      await expect(buttons.last()).toHaveCSS("border-top-right-radius", radius)
      await expect(buttons.last()).toHaveCSS("border-top-left-radius", "8px")
      const before = await geometry()
      expect(before[1][0] - before[0][0] - before[0][1]).toBe(4)
      const selectedFill = await buttons.first().evaluate(element => getComputedStyle(element).backgroundColor)
      const restFill = await buttons.nth(1).evaluate(element => getComputedStyle(element).backgroundColor)
      expect(selectedFill).not.toBe(restFill)
      await buttons.first().focus()
      await buttons.first().press("ArrowRight")
      await expect(buttons.nth(1)).toBeFocused()
      await buttons.nth(1).press("Space")
      await expect(buttons.nth(1)).toHaveAttribute("aria-checked", "true")
      await expect(buttons.nth(1)).toHaveCSS("border-radius", radius)
      await expect(buttons.nth(1)).toHaveCSS("background-color", selectedFill)
      await expect(buttons.first()).toHaveCSS("border-top-right-radius", "8px")
      expect(await geometry()).toEqual(before)
      await buttons.nth(1).click()
      await expect(buttons.nth(1)).toHaveAttribute("aria-checked", "true")
      await expect(buttons.nth(1).locator(".button-group-choice__check")).toHaveCSS("opacity", "1")
      expect(await group.evaluate(element => element.clientWidth <= element.parentElement!.clientWidth)).toBe(true)
      await buttons.nth(1).blur()
      for (const button of await buttons.all()) {
        await expect(button).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)")
        await expect(button).toHaveCSS("height", size === "default" ? "40px" : "56px")
      }
      const alignment = page.getByRole("radiogroup", { name: `Alignment ${size}`, exact: true })
      const right = alignment.getByRole("radio", { name: "Align right", exact: true })
      await right.click()
      await expect(right).toHaveAttribute("aria-checked", "true")
      await expect(right).toHaveCSS("border-radius", radius)
      await expect(right.locator("svg")).toHaveCount(1)
      await expect(right).toHaveCSS("width", size === "default" ? "40px" : "56px")
    }
  }
  const disabledGroup = page.getByRole("radiogroup", { name: "Serving size", exact: true })
  const disabled = disabledGroup.getByRole("radio", { name: "20 oz", exact: true })
  await expect(disabled).toBeDisabled()
  await disabled.evaluate(element => (element as HTMLButtonElement).click())
  await expect(disabledGroup.getByRole("radio", { name: "8 oz", exact: true })).toHaveAttribute("aria-checked", "true")
  const toggles = page.getByRole("group", { name: "Quick settings", exact: true })
  await toggles.getByRole("button", { name: "Bluetooth", exact: true }).click()
  await expect(toggles.getByRole("button", { name: "Bluetooth", exact: true })).toHaveAttribute("aria-pressed", "true")
  await expect(toggles.getByRole("button", { name: "Wi-Fi", exact: true })).toHaveAttribute("aria-pressed", "true")
  const vertical = page.locator('#button-group-orientation [data-orientation="vertical"] button')
  await expect(vertical.first()).toHaveCSS("border-top-left-radius", "20px")
  await expect(vertical.first()).toHaveCSS("border-bottom-left-radius", "8px")
  await expect(vertical.last()).toHaveCSS("border-bottom-left-radius", "20px")
  const split = page.locator("#button-group-split")
  await split.getByRole("button", { name: "More save options", exact: true }).click()
  await expect(page.getByRole("menuitem", { name: "Save as draft", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")
  const select = page.locator("#button-group-select")
  await expect(select.getByRole("button", { name: "Sort by", exact: true })).toHaveCSS("border-top-left-radius", "20px")
  await select.getByRole("combobox").click()
  await page.getByRole("option", { name: "Date", exact: true }).click()
  await expect(select.getByRole("combobox")).toHaveText("Date")
})

test("graphic labels share one gap and GitHub favicons adapt without recoloring other brands", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/icon-label")
  const pairs = page.locator('#icon-label-default [data-slot="canvas"] [data-slot="cluster"]')
  await expect(pairs).toHaveCount(5)
  for (const pair of await pairs.all()) await expect(pair).toHaveCSS("column-gap", "8px")
  await page.evaluate(() => document.documentElement.style.setProperty("--graphic-label-gap", "12px"))
  for (const pair of await pairs.all()) await expect(pair).toHaveCSS("column-gap", "12px")
  await page.evaluate(() => document.documentElement.style.removeProperty("--graphic-label-gap"))
  await page.goto("/#/button")
  const github = page.locator('#button-favicon [data-size="default"] img[src$="/github.com.ico"]').first()
  const colored = page.locator('#button-favicon [data-size="default"] img[src$="/figma.com.ico"]').first()
  const button = github.locator("..")
  for (const dark of [false, true]) {
    await page.evaluate(dark => document.documentElement.classList.toggle("dark", dark), dark)
    await expect(github).toHaveCSS("filter", dark ? "brightness(0) invert(1)" : "brightness(0)")
    await expect(colored).toHaveCSS("filter", "none")
    await button.evaluate(element => element.setAttribute("data-variant", "primary"))
    await expect(github).toHaveCSS("filter", dark ? "brightness(0)" : "brightness(0) invert(1)")
    await button.evaluate(element => element.setAttribute("data-variant", "secondary"))
  }
  await page.goto("/#/expression-lab")
  const lab = page.locator('.expression-lab[data-expression="expressive"]')
  const pairsInLab = lab.locator('[data-icon-label-host]:has(> svg):has(> [data-slot="icon-label"])')
  await expect(pairsInLab.first()).toBeAttached()
  for (const pair of await pairsInLab.all()) await expect(pair).toHaveCSS("column-gap", "8px")
})

test("optical Button labels mirror outer padding while keeping the icon gap at eight pixels", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/button")
  const section = page.locator("#button-optical-spacing")
  for (const [size, height] of [["default", 40], ["expressive", 56]] as const) {
    for (const kind of ["leading", "trailing", "favicon-leading", "favicon-trailing", "spinner-leading", "spinner-trailing", "wrapped", "link"]) {
      const button = section.locator(`[data-optical-case="${kind}"][data-size="${size}"]`)
      const label = button.locator(':scope > [data-slot="icon-label"]')
      await expect(label).toHaveCount(1)
      const trailing = ["trailing", "favicon-trailing", "spinner-trailing", "link"].includes(kind)
      await expect(label).toHaveCSS("padding-right", trailing ? "0px" : "4px")
      await expect(label).toHaveCSS("padding-left", trailing ? "4px" : "0px")
      await expect(button).toHaveCSS("column-gap", "8px")
      const gap = await button.evaluate(element => {
        const icon = element.querySelector(':scope > svg, :scope > [data-slot="favicon"], :scope > [data-slot="spinner"]')!
        const label = element.querySelector(':scope > [data-slot="icon-label"]')!
        const range = document.createRange()
        range.selectNodeContents(label)
        const textBox = range.getBoundingClientRect()
        const iconBox = icon.getBoundingClientRect()
        const iconWidth = parseFloat(getComputedStyle(icon).width)
        const iconCenter = (iconBox.left + iconBox.right) / 2
        return iconCenter < textBox.left ? textBox.left - (iconCenter + iconWidth / 2) : iconCenter - iconWidth / 2 - textBox.right
      })
      expect(gap).toBeCloseTo(8)
      if (kind.startsWith("spinner")) {
        await expect(button.locator('[data-slot="spinner"]')).toHaveCSS("width", size === "default" ? "20px" : "24px")
        await expect(button).toBeDisabled()
        await expect(button).toHaveAttribute("aria-busy", "true")
      }
      await expect(button).toHaveCSS("height", `${height}px`)
      const before = await button.evaluate(element => element.getBoundingClientRect().width)
      await page.evaluate(() => document.documentElement.style.setProperty("--icon-label-optical-padding", "0px"))
      const after = await button.evaluate(element => element.getBoundingClientRect().width)
      expect(before - after).toBeCloseTo(4)
      await page.evaluate(() => document.documentElement.style.removeProperty("--icon-label-optical-padding"))
    }
    await expect(section.locator(`[data-optical-case="text"][data-size="${size}"] [data-slot="icon-label"]`)).toHaveCSS("padding-right", "0px")
    const icon = section.locator(`[data-optical-case="icon"][data-size="${size === "expressive" ? "icon-expressive" : "icon"}"]`)
    await expect(icon).toHaveCSS("width", `${height}px`)
    await expect(icon).toHaveCSS("height", `${height}px`)
  }
})

test("loading Button labels gain and release optical correction with the shared Spinner", async ({ page }) => {
  await page.goto("/#/button")
  for (const size of ["default", "expressive"]) {
    const save = page.locator(`#button-loading [data-slot="button"][data-size="${size}"]`).filter({ hasText: /Click to save|Saving/ })
    const label = save.locator('[data-slot="icon-label"]')
    await expect(label).toHaveCSS("padding-inline-end", "0px")
    await save.click()
    await expect(save).toBeDisabled()
    await expect(save.locator('[data-slot="spinner"]')).toHaveCount(1)
    await expect(label).toHaveCSS("padding-inline-end", "4px")
    await expect(label).toHaveCSS("padding-inline-start", "0px")
    await expect(save).toHaveCSS("column-gap", "8px")
    await expect(save).toBeEnabled()
    await expect(save.locator('[data-slot="spinner"]')).toHaveCount(0)
    await expect(label).toHaveCSS("padding-inline-end", "0px")
  }
})

test("supporting actions use ghost for isolated icons and tertiary for mixed tools", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/button")
  for (const [id, variant] of [["button-icon-tools", "ghost"], ["button-mixed-tools", "tertiary"]] as const) {
    const section = page.locator(`#${id}`)
    const actions = section.getByRole("group", { name: "Note actions", exact: true })
    const buttons = actions.getByRole("button")
    await expect(buttons).toHaveCount(2)
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute("data-variant", variant)
      await expect(button).toHaveCSS("height", "40px")
      await expect(button).toHaveCSS("width", "40px")
    }
    const add = actions.getByRole("button", { name: "Add note", exact: true })
    const remove = actions.getByRole("button", { name: "Remove latest note", exact: true })
    await add.press("Enter")
    await expect(section.getByRole("list", { name: "Notes", exact: true })).toContainText("Note 1")
    if (variant === "tertiary") {
      const search = section.getByRole("searchbox", { name: "Search notes" })
      await expect(search).toHaveCSS("border-top-style", "solid")
      expect(await search.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThanOrEqual(160)
      await section.getByRole("combobox", { name: "Sort notes" }).click()
      await page.getByRole("option", { name: "Name", exact: true }).click()
      await expect(section.getByRole("list", { name: "Notes", exact: true }).locator("li")).toHaveText(["Design review", "Note 1", "Release notes"])
      await search.fill("Note 1")
      await expect(section.getByRole("status")).toHaveText("1 note")
      await search.fill("")
    }
    for (let count = 0; count < 3; count++) await remove.click()
    await expect(remove).toBeDisabled()
    await expect(section.getByRole("status")).toHaveText("0 notes")
    await section.getByRole("button", { name: "Reset example", exact: true }).click()
    await expect(section.getByRole("status")).toHaveText("2 notes")
    expect(await actions.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    const canvas = section.locator('[data-slot="canvas"]')
    expect(await canvas.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
  }
  for (const dark of [false, true]) {
    await page.evaluate(dark => document.documentElement.classList.toggle("dark", dark), dark)
    await page.mouse.move(0, 0)
    const ghost = page.locator('#button-icon-tools [data-variant="ghost"]').first()
    const tertiary = page.locator('#button-mixed-tools [data-variant="tertiary"]').first()
    await expect(ghost).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
    await expect(tertiary).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  }
  await expect(page.locator('[data-content-kind="component"] [data-slot="button"][data-variant="outline"]')).toHaveCount(0)
})

test("showcase surfaces use roomy default canvases and preserve large applications", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/concentric")
  const reference = await page.locator('[data-showcase-surface="default"]').evaluate(element => ({
    width: element.getBoundingClientRect().width,
    maxWidth: getComputedStyle(element).maxWidth,
  }))
  for (const route of ["button", "input", "avatar", "button-group"]) {
    await page.goto(`/#/${route}`)
    const content = page.locator('[data-showcase-surface="default"]')
    await expect(content).toHaveCSS("max-width", reference.maxWidth)
    expect(await content.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(reference.width)
    const canvases = content.locator('.showcase-stage[data-slot="canvas"]')
    await expect(canvases.first()).toHaveAttribute("data-layout", "viewport")
    const undersized = await canvases.evaluateAll(elements => elements.filter(element =>
      parseFloat(getComputedStyle(element).minBlockSize) < parseFloat(getComputedStyle(elements[0]).minBlockSize)
    ).map(element => element.getAttribute("data-layout")))
    expect(undersized).toEqual([])
    expect(await content.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
  }
  await page.goto("/#/button")
  const sizes = page.locator("#button-sizes")
  await sizes.getByRole("checkbox", { name: /^(Show grid|Grid)$/ }).click()
  await expect(sizes.locator('[data-slot="canvas-grid"]')).toHaveAttribute("data-active", "true")
  await sizes.getByRole("button", { name: "Reset example", exact: true }).click()
  await expect(sizes.locator('[data-slot="canvas-grid"]')).toHaveAttribute("data-active", "false")
  await sizes.getByRole("tab", { name: "Code", exact: true }).click()
  await expect(sizes.locator("code")).toContainText('size="expressive"')
  await page.goto("/#/block-ai-chat")
  const application = page.locator('[data-showcase-surface="application"]')
  await expect(application).toHaveCSS("max-width", "none")
  await expect(application.locator('.showcase-stage[data-slot="canvas"]').first()).toHaveAttribute("data-layout", "application")
  expect(await application.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
})

test("button scale fits inline action hosts and dialog close geometry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const route of ["input-group", "combobox"]) {
    await page.goto(`/#/${route}`)
    const groups = page.locator('[data-slot="canvas"] [data-slot="input-group"]').filter({ has: page.locator("button") })
    await expect(groups.first()).toBeVisible()
    const spills = await groups.evaluateAll(elements => elements.flatMap(group => {
      const host = group.getBoundingClientRect()
      return [...group.querySelectorAll("button")].filter(button => {
        const rect = button.getBoundingClientRect()
        return rect.top < host.top - 1 || rect.bottom > host.bottom + 1
      }).map(button => button.getAttribute("data-slot"))
    }))
    expect(spills).toEqual([])
  }
  await page.goto("/#/dialog")
  await page.locator("#dialog-default").getByRole("button", { name: "Edit profile", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "Edit profile" })
  const close = dialog.locator(':scope > [data-slot="dialog-close"]')
  await expect(close).toHaveCSS("height", "40px")
  await expect(close).toHaveCSS("width", "40px")
  const alignment = await dialog.evaluate(element => {
    const title = element.querySelector('[data-slot="dialog-title"]')!
    const close = element.querySelector(':scope > [data-slot="dialog-close"]')!
    const titleBox = title.getBoundingClientRect()
    const closeBox = close.getBoundingClientRect()
    return { center: titleBox.top + parseFloat(getComputedStyle(title).lineHeight) / 2 - (closeBox.top + closeBox.height / 2), gap: closeBox.left - titleBox.right }
  })
  expect(Math.abs(alignment.center)).toBeLessThanOrEqual(1)
  expect(alignment.gap).toBeGreaterThanOrEqual(7)
  await close.click()
  await expect(dialog).toBeHidden()
})

test("design rules Button canvases use only two paired sizes", async ({ page }) => {
  await page.goto("/#/button")
  const sizes = [
    ["default", "icon", 40, 20],
    ["expressive", "icon-expressive", 56, 24],
  ] as const
  const canvas = page.locator('#button-sizes [data-slot="canvas"]')
  await expect(canvas.locator('[data-slot="button"][data-size]')).toHaveCount(2)
  for (const [size, icon, height, glyph] of sizes) {
    const labelButton = canvas.locator(`[data-slot="button"][data-size="${size}"]`)
    await expect(labelButton).toHaveCSS("height", `${height}px`)
    const iconButtons = page.locator(`#button-icon-only [data-slot="canvas"] [data-size="${icon}"]`)
    await expect(iconButtons).toHaveCount(5)
    for (const variant of ["primary", "secondary", "tertiary", "ghost", "destructive", "link"]) {
      const iconButton = iconButtons.filter({ has: page.locator("svg") }).and(page.locator(`[data-variant="${variant}"]`))
      await expect(iconButton).toHaveCSS("height", `${height}px`)
      await expect(iconButton).toHaveCSS("width", `${height}px`)
      await expect(iconButton.locator("svg")).toHaveCSS("width", `${glyph}px`)
    }
    const favicon = page.locator(`#button-favicon-sizes [data-size="${size}"] img`)
    await expect(favicon).toHaveCSS("width", `${glyph}px`)
    const all = page.locator(`#button-default [data-slot="canvas"] [data-size="${size}"]`)
    await expect(all).toHaveCount(5)
    for (const button of await all.all()) await expect(button).toHaveCSS("height", `${height}px`)
  }
  for (const section of ["default", "sizes", "icon-only", "with-icon", "favicon", "favicon-sizes", "rounded", "loading", "as-child"]) {
    const root = page.locator(`#button-${section}`)
    await expect(root.locator('[data-size="sm"], [data-size="xs"], [data-size="icon-sm"], [data-size="icon-xs"], [data-size="lg"], [data-size="icon-lg"]')).toHaveCount(0)
    const overflow = await root.evaluate(element => {
      const canvas = element.querySelector('[data-slot="canvas"]')!
      const bounds = canvas.getBoundingClientRect()
      return [...canvas.querySelectorAll<HTMLElement>('[data-slot="button"]')].filter(button => {
        const rect = button.getBoundingClientRect()
        return rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || button.scrollWidth > button.clientWidth + 1
      }).map(button => button.textContent)
    })
    expect(overflow, `${section} canvas overflow`).toEqual([])
  }
  const save = page.locator('#button-loading [data-size="expressive"]').filter({ hasText: "Click to save" })
  await save.click()
  const busy = page.locator('#button-loading [data-size="expressive"]').filter({ hasText: "Saving..." })
  await expect(busy).toBeDisabled()
  await expect(busy).toHaveAttribute("aria-busy", "true")
  await expect(busy).toHaveCSS("height", "56px")
  await expect(save).toBeEnabled()
  await page.evaluate(() => document.documentElement.classList.add("dark"))
  await expect(canvas.locator('[data-size="expressive"]')).toHaveCSS("height", "56px")
})

test("design rules reference separates approvals, filters, measures, and downloads", async ({ page, request }) => {
  await page.goto("/#/rules")
  await expect(page.getByRole("heading", { name: "Design Rules", exact: true })).toBeVisible()
  await expect(page.locator("[data-rule-id]")).toHaveCount(13)
  await expect(page.locator('[data-rule-status="candidate"]')).toHaveCount(2)
  await expect(page.locator('[data-measure-size="icon-expressive"]')).toHaveCSS("height", "56px")
  await expect(page.getByLabel("Expressive measured label and icon heights")).toHaveText("56px / 56px")
  await expect(page.getByLabel("Default measured label and icon heights")).toHaveText("40px / 40px")
  await expect(page.locator('[data-rules-button-scale] [data-slot="button"]')).toHaveCount(4)
  const search = page.getByRole("searchbox", { name: "Search design rules" })
  await search.fill("--button-height-expressive")
  await expect(page.locator("[data-rule-id]")).toHaveCount(1)
  await expect(page.locator("[data-rule-id]")).toHaveAttribute("data-rule-id", "controls.button-scale")
  await search.fill("")
  await page.getByRole("combobox", { name: "Rule approval" }).selectOption("candidate")
  await expect(page.locator("[data-rule-id]")).toHaveCount(2)
  await expect(page.getByRole("heading", { name: "Under Exploration", exact: true })).toBeVisible()
  await search.fill("no-matching-rule")
  await expect(page.getByRole("heading", { name: "No matching rules" })).toBeVisible()
  await page.getByRole("button", { name: "Clear filters" }).click()
  await expect(page.locator("[data-rule-id]")).toHaveCount(13)
  await page.getByRole("navigation", { name: "Rule contents" }).getByRole("button", { name: "Controls", exact: true }).click()
  await expect(page.locator("#rules-approved-controls")).toBeFocused()
  await expect(page).toHaveURL(/#\/rules$/)
  const download = await request.get("/design-rules.md")
  expect(download.ok()).toBeTruthy()
  expect(await download.text()).toContain("controls.button-scale")
  const overflow = await page.locator('[data-content-kind="reference"]').evaluate(element => element.scrollWidth - element.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})

test("design rules uses shared typography, accordion, and sticky contents", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/rules")
  const firstRule = page.locator("[data-rule-id]").first()
  await expect(firstRule).toHaveAttribute("data-rule-id", "composition.shared-anatomy")
  await expect(firstRule).toHaveAttribute("data-rule-status", "approved")
  await expect(page.locator('[data-content-kind="reference"] details')).toHaveCount(0)
  const trigger = firstRule.locator('[data-slot="accordion-trigger"]')
  await trigger.press("Enter")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  const content = firstRule.locator('[data-slot="accordion-content"]')
  await expect(content).toBeVisible()
  await expect(content).toContainText("Explicitly approved as the most important rule")
  expect(await content.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
  await trigger.press("Space")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(content).toBeHidden()

  const paragraph = firstRule.locator('[data-slot="section-content"] > [data-slot="stack"] > p[data-slot="text"]').first()
  const initialFont = await paragraph.evaluate(element => getComputedStyle(element).fontSize)
  await page.evaluate(() => document.documentElement.style.setProperty("--text-body-size", "18px"))
  await expect(paragraph).toHaveCSS("font-size", "18px")
  await page.evaluate(() => document.documentElement.style.removeProperty("--text-body-size"))
  await expect(paragraph).toHaveCSS("font-size", initialFont)

  const navigation = page.getByRole("navigation", { name: "Rule contents" })
  await expect(navigation).toHaveAttribute("data-slot", "table-of-contents")
  if (testInfo.project.name === "desktop") {
    await expect(navigation).toHaveCSS("position", "sticky")
    await navigation.evaluate(element => {
      const scroll = element.closest('[data-slot="page-scroll"]')!
      scroll.scrollTop += element.getBoundingClientRect().top - scroll.getBoundingClientRect().top + 400
    })
    const pinnedTop = await navigation.evaluate(element => element.getBoundingClientRect().top)
    await navigation.evaluate(element => { element.closest('[data-slot="page-scroll"]')!.scrollTop += 300 })
    await expect.poll(() => navigation.evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(pinnedTop)
    const viewportTop = await navigation.evaluate(element => element.closest('[data-slot="page-scroll"]')!.getBoundingClientRect().top)
    expect(pinnedTop).toBeGreaterThanOrEqual(viewportTop)
  } else {
    await expect(navigation).toHaveCSS("position", "static")
    expect(await navigation.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
  }
})