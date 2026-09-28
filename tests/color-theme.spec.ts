import { expect, test, type Locator, type Page } from "@playwright/test"

test("client-only showcase theme does not render an executable inline script", async ({ page }) => {
  const scriptWarnings: string[] = []
  page.on("console", (message) => {
    if (message.text().includes("Encountered a script tag while rendering React component")) {
      scriptWarnings.push(message.text())
    }
  })
  await page.goto("/#/colors")
  await expect(page.locator('script[type="text/plain"]')).toHaveCount(1)
  await expect(page.getByRole("region", { name: "Expression lab workbench", exact: true })).toBeVisible()
  expect(scriptWarnings).toEqual([])
})

async function openColors(page: Page, mode: "light" | "dark") {
  await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
  await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
  await page.goto("/#/colors")
  const lab = page.getByRole("region", { name: "Expression lab workbench", exact: true })
  const preview = lab.locator("xpath=ancestor::*[@data-slot='color-theme'][1]")
  await expect(preview).toHaveAttribute("data-color-scale", "website")
  await expect(lab).toBeVisible()
  await expect(page.locator("html")).toHaveClass(new RegExp(mode))
  return { preview, lab }
}

async function expectRole(element: Locator, property: "color" | "background-color" | "border-top-color" | "fill", token: string) {
  const expected = await element.evaluate((node, { property, token }) => {
    const probe = document.createElement("span")
    probe.style.transition = "none"
    probe.style.setProperty(property, getComputedStyle(node).getPropertyValue(token))
    document.body.append(probe)
    const value = getComputedStyle(probe).getPropertyValue(property)
    probe.remove()
    return value
  }, { property, token })
  await expect(element).toHaveCSS(property, expected)
}

test("Material website roles group tokens along tonal scales", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" })
  await page.goto("/#/colors")
  const roleSpectra = page.locator('[data-slot="material-color-roles"]')
  const roleGroups = roleSpectra.locator('[data-role-group]')
  await expect(roleSpectra).toBeVisible()
  await expect(roleGroups).toHaveCount(8)
  expect(await roleGroups.evaluateAll(groups => groups.map(group => group.getAttribute("data-role-group")))).toEqual([
    "Backgrounds", "Surfaces", "Surface variants and outlines", "Surface effects",
    "Primary", "Secondary", "Tertiary", "Error",
  ])
  await expect(roleSpectra.locator('[data-role]')).toHaveCount(49)
  await expect(roleSpectra.locator('[data-slot="chip"][data-token]')).toHaveCount(49)
  await expect(roleSpectra.locator('.material-role-spectrum__marker')).toHaveCount(49)
  await expect(roleSpectra.locator('.material-tonal-scale__step')).toHaveCount(104)
  const layout = await roleSpectra.evaluate(element => {
    const toneLabelsOverlap = Array.from(element.querySelectorAll('.material-tonal-scale__row')).some(row => {
      const labels = Array.from(row.querySelectorAll('.material-tonal-scale__tone'))
        .map(label => label.getBoundingClientRect())
      return labels.some((label, index) => index < labels.length - 1 && label.right > labels[index + 1].left)
    })
    return {
      horizontalOverflow: element.scrollWidth > element.clientWidth + 1,
      toneLabelsOverlap,
    }
  })
  expect(layout).toEqual({ horizontalOverflow: false, toneLabelsOverlap: false })
  const pageScroll = page.locator('[data-slot="page-scroll"]')
  const surfaces = roleSpectra.locator('[data-role-group="Surfaces"]')
  const surfaceSticky = surfaces.locator('.material-role-spectrum__sticky')
  const scrollTarget = await surfaceSticky.evaluate(sticky => {
    const root = sticky.closest('[data-slot="page-scroll"]')
    const card = sticky.closest('[data-role-group]')
    if (!(root instanceof HTMLElement) || !(card instanceof HTMLElement)) return 0
    const rootTop = root.getBoundingClientRect().top
    const normalTop = sticky.getBoundingClientRect().top + root.scrollTop - rootTop
    const stickyInset = Number.parseFloat(getComputedStyle(sticky).insetBlockStart)
    return normalTop - stickyInset + card.clientHeight / 2
  })
  await pageScroll.evaluate((root, target) => { root.scrollTop = target }, scrollTarget)
  await expect(page.locator('.showcase-page-header__barwrap')).toHaveAttribute("data-collapsed", "true")
  await expect.poll(() => page.locator('.showcase-page-header__bar').evaluate(bar => {
    const root = bar.closest('[data-slot="page-scroll"]')
    const wrapper = bar.closest('.showcase-page-header__barwrap')
    if (!(root instanceof HTMLElement) || !(wrapper instanceof HTMLElement)) return Number.POSITIVE_INFINITY
    const expectedTop = root.getBoundingClientRect().top + Number.parseFloat(getComputedStyle(wrapper).insetBlockStart)
    return Math.abs(bar.getBoundingClientRect().top - expectedTop)
  })).toBeLessThanOrEqual(1)
  const stickyGeometry = await surfaceSticky.evaluate(sticky => {
    const root = sticky.closest('[data-slot="page-scroll"]')
    const title = sticky.querySelector('[data-slot="card-title"]')
    const description = sticky.querySelector('[data-slot="card-description"]')
    const header = sticky.querySelector('[data-slot="card-header"]')
    const scale = sticky.querySelector('.material-role-spectrum__scale')
    const bar = document.querySelector('.showcase-page-header__bar')
    if (!(root instanceof HTMLElement) || !(title instanceof HTMLElement) || !(description instanceof HTMLElement) || !(header instanceof HTMLElement) || !(scale instanceof HTMLElement) || !(bar instanceof HTMLElement)) return null
    const gapProbe = document.createElement("span")
    gapProbe.style.position = "absolute"
    gapProbe.style.insetInlineStart = "var(--material-role-sticky-gap)"
    sticky.append(gapProbe)
    const configuredGap = Number.parseFloat(getComputedStyle(gapProbe).insetInlineStart)
    gapProbe.remove()
    const stickyStyle = getComputedStyle(sticky)
    const backplate = getComputedStyle(sticky, "::before")
    return {
      stickyTop: sticky.getBoundingClientRect().top,
      expectedTop: root.getBoundingClientRect().top + Number.parseFloat(stickyStyle.insetBlockStart),
      titleTop: title.getBoundingClientRect().top,
      descriptionBottom: description.getBoundingClientRect().bottom,
      scaleTop: scale.getBoundingClientRect().top,
      topPadding: Number.parseFloat(stickyStyle.paddingBlockStart),
      contentGap: Number.parseFloat(stickyStyle.rowGap),
      headerToScale: scale.getBoundingClientRect().top - header.getBoundingClientRect().bottom,
      barTop: bar.getBoundingClientRect().top,
      barToStickyGap: sticky.getBoundingClientRect().top - bar.getBoundingClientRect().bottom,
      configuredGap,
      backplateTop: Number.parseFloat(backplate.insetBlockStart),
      backplateAbsoluteTop: sticky.getBoundingClientRect().top + Number.parseFloat(backplate.insetBlockStart),
      backplateHeight: Number.parseFloat(backplate.blockSize),
      backplateColor: backplate.backgroundColor,
      cardColor: getComputedStyle(sticky.closest('[data-slot="card"]')!).backgroundColor,
    }
  })
  expect(stickyGeometry).not.toBeNull()
  expect(Math.abs(stickyGeometry!.stickyTop - stickyGeometry!.expectedTop)).toBeLessThanOrEqual(1)
  expect(stickyGeometry!.titleTop - stickyGeometry!.stickyTop).toBe(stickyGeometry!.topPadding)
  expect(stickyGeometry!.scaleTop).toBeGreaterThan(stickyGeometry!.descriptionBottom)
  expect(stickyGeometry!.headerToScale).toBe(stickyGeometry!.contentGap)
  expect(stickyGeometry!.barToStickyGap).toBeGreaterThanOrEqual(stickyGeometry!.configuredGap)
  if (stickyGeometry!.backplateHeight > 0) {
    expect(stickyGeometry!.backplateTop + stickyGeometry!.backplateHeight).toBe(0)
    expect(stickyGeometry!.backplateAbsoluteTop).toBeLessThanOrEqual(stickyGeometry!.barTop + 1)
    expect(stickyGeometry!.backplateHeight).toBeGreaterThanOrEqual(stickyGeometry!.barToStickyGap - 1)
  } else {
    expect(stickyGeometry!.barToStickyGap).toBeLessThanOrEqual(0)
  }
  expect(stickyGeometry!.backplateColor).toBe(stickyGeometry!.cardColor)
  const variantGroup = roleSpectra.locator('[data-role-group="Surface variants and outlines"]')
  const variantSticky = variantGroup.locator('.material-role-spectrum__sticky')
  const handoffTarget = await variantSticky.evaluate(sticky => {
    const root = sticky.closest('[data-slot="page-scroll"]')
    const card = sticky.closest('[data-role-group]')
    if (!(root instanceof HTMLElement) || !(card instanceof HTMLElement)) return 0
    const rootTop = root.getBoundingClientRect().top
    const normalTop = sticky.getBoundingClientRect().top + root.scrollTop - rootTop
    const stickyInset = Number.parseFloat(getComputedStyle(sticky).insetBlockStart)
    return normalTop - stickyInset + card.clientHeight / 2
  })
  await pageScroll.evaluate((root, target) => { root.scrollTop = target }, handoffTarget)
  const handoffGeometry = await variantSticky.evaluate(sticky => {
    const root = sticky.closest('[data-slot="page-scroll"]')
    const previous = document.querySelector('[data-role-group="Surfaces"] .material-role-spectrum__sticky')
    if (!(root instanceof HTMLElement) || !(previous instanceof HTMLElement)) return null
    return {
      stickyTop: sticky.getBoundingClientRect().top,
      expectedTop: root.getBoundingClientRect().top + Number.parseFloat(getComputedStyle(sticky).insetBlockStart),
      previousBottom: previous.getBoundingClientRect().bottom,
    }
  })
  expect(handoffGeometry).not.toBeNull()
  expect(Math.abs(handoffGeometry!.stickyTop - handoffGeometry!.expectedTop)).toBeLessThanOrEqual(1)
  expect(handoffGeometry!.previousBottom).toBeLessThanOrEqual(handoffGeometry!.stickyTop)
  await roleSpectra.evaluate(element => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (token: string) => element.setAttribute("data-copied-token", token) },
    })
  })
  const backgroundToken = "--md-sys-color-background"
  const backgroundChip = roleSpectra.locator(`[data-token="${backgroundToken}"]`)
  await backgroundChip.click()
  await expect(roleSpectra).toHaveAttribute("data-copied-token", backgroundToken)
  await expect(backgroundChip).toHaveAccessibleName(`${backgroundToken} copied`)
})

for (const mode of ["light", "dark"] as const) {
  test(`Website theme uses paired Material roles in ${mode} mode`, async ({ page }, testInfo) => {
    const { preview, lab } = await openColors(page, mode)
    await expect(page.getByRole("combobox", { name: /Color scale|Material scheme|Material contrast/ })).toHaveCount(0)
    await expect(page.getByRole("checkbox", { name: "Accent buttons" })).toHaveCount(0)
    await expect(preview.locator('[data-slot="material-color-roles"] [data-role]')).toHaveCount(49)
    const surfaces = preview.locator('[data-slot="material-surface-roles"]')
    await expect(surfaces.locator('tbody tr')).toHaveCount(6)
    await expect(surfaces.getByText("Surface container lowest", { exact: true })).toBeVisible()
    for (const sample of await surfaces.locator('[data-role]').all()) {
      const role = await sample.getAttribute("data-role")
      await expectRole(sample, "background-color", `--md-sys-color-${role}`)
      await expectRole(sample, "color", await sample.textContent() === "On surface" ? "--md-sys-color-on-surface" : "--md-sys-color-on-surface-variant")
    }
    await expect(preview.locator('[data-slot="material-color-families"] tbody tr')).toHaveCount(4)
    await expect(page.getByRole("radiogroup", { name: "Theme family" }).getByRole("radio", { name: "Purple" })).toBeChecked()
    await expect(preview.getByText("On primary container", { exact: true }).first()).toBeVisible()
    await expect(lab.locator('[data-slot="navigation-pane-inset"]')).toHaveCSS("background-color", mode === "light" ? "rgb(254, 251, 255)" : "rgb(20, 19, 20)")
    const primary = lab.getByRole("button", { name: "Complete next", exact: true })
    await expectRole(primary, "background-color", "--button-primary-fill")
    await expectRole(primary, "color", "--md-sys-color-on-primary")
    await expectRole(lab.getByRole("button", { name: "Pause session", exact: true }), "background-color", "--button-primary-fill")
    await expect(primary).toHaveCSS("height", "40px")
    for (const card of await lab.locator('[data-slot="card"]').all()) {
      await expect(card).toHaveCSS("background-color", mode === "light" ? "rgb(255, 255, 255)" : "rgb(15, 14, 15)")
    }
    await expectRole(lab.locator('[data-slot="card-footer"]').first(), "background-color", "--md-sys-color-surface-container-lowest")
    const tabs = lab.getByRole("tablist", { name: "Lab horizon" })
    await expectRole(tabs, "background-color", "--md-sys-color-surface-container-low")
    await expectRole(tabs.locator('[data-slot="tabs-indicator"]'), "background-color", "--md-sys-color-secondary-container")
    await expectRole(tabs.getByRole("tab", { selected: true }), "color", "--md-sys-color-on-secondary-container")
    await tabs.getByRole("tab", { name: "This week", exact: true }).click()
    await expectRole(tabs.getByRole("tab", { selected: true }), "color", "--md-sys-color-on-secondary-container")
    await lab.getByRole("button", { name: "Quick actions", exact: true }).click()
    const menu = page.getByRole("menu")
    await expect(menu).toHaveAttribute("data-color-scale", "website")
    await expect(menu).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
    await expectRole(menu.locator('[data-slot="menu-group"]'), "background-color", "--md-sys-color-surface-container-lowest")
    await menu.press("Escape")
    await expect(menu).toBeHidden()
    expect(await preview.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
    const overflow = await lab.evaluate(element => Array.from(element.querySelectorAll('[data-slot="card"], [data-slot="site-header-shell"], [data-slot="ai-composer"]')).filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.getAttribute("data-slot")))
    expect(overflow).toEqual([])
    if (testInfo.project.use.isMobile) {
      await lab.locator('.expression-lab__header').getByRole("button", { name: "Open navigation pane", exact: true }).click()
      const drawer = page.locator('#expression-lab-panel[data-placement="drawer"]')
      await expect(drawer).toHaveAttribute("data-color-scale", "website")
      await expectRole(drawer, "background-color", "--md-sys-color-surface-container")
      await drawer.getByRole("button", { name: "Notes", exact: true }).click()
      await expect(drawer).toBeHidden()
    }
  })
}

test("Website inset navigation hover composites a foreground state layer", async ({ page }, testInfo) => {
  test.skip(Boolean(testInfo.project.use.isMobile), "Hover requires a mouse")
  const { lab } = await openColors(page, "light")
  const item = lab.getByRole("button", { name: "Experiments", exact: true })
  for (const mode of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: mode })
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    await item.hover()
    await expectRole(item, "background-color", "--navigation-pane-hover-fill")
    const pixels = await item.evaluate(element => {
      const style = getComputedStyle(element)
      const context = document.createElement("canvas").getContext("2d")!
      context.fillStyle = style.getPropertyValue("--md-sys-color-surface-container")
      context.fillRect(0, 0, 1, 1)
      const surface = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3)
      context.fillStyle = style.backgroundColor
      context.fillRect(0, 0, 1, 1)
      return { surface, hover: Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3) }
    })
    expect(pixels.hover.every((value, index) => mode === "light" ? value < pixels.surface[index] : value > pixels.surface[index])).toBe(true)
    await expect(item).toHaveAttribute("data-active", "false")
    await expectRole(lab.getByRole("button", { name: "Overview", exact: true }), "background-color", "--md-sys-color-secondary-container")
    await lab.getByRole("button", { name: "Notes", exact: true }).hover()
    await expect(item).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  }
})

for (const mode of ["light", "dark"] as const) {
  test(`Material foundation shares global surfaces while keeping action accents scoped in ${mode} mode`, async ({ page }, testInfo) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    await page.goto("/#/button")
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    const specimen = page.locator('#button-default [data-slot="canvas"]')
    await expect(specimen).toBeVisible()
    const baseline = await specimen.evaluate(element => {
      const root = getComputedStyle(document.documentElement)
      const local = getComputedStyle(element)
      return {
        root: ["--primary", "--card", "--elevation-raised", "--elevation-floating"].map(token => root.getPropertyValue(token)),
        local: ["--primary", "--card", "--elevation-raised", "--elevation-floating"].map(token => local.getPropertyValue(token)),
        material: local.getPropertyValue("--md-sys-color-primary").trim(),
      }
    })
    expect(baseline.local).toEqual(baseline.root)
    expect(baseline.material).toBe("")
    if (testInfo.project.use.isMobile) {
      await page.getByRole("button", { name: "Open navigation pane", exact: true }).click()
    }
    const navigation = page.locator('[data-theme-scope="showcase-navigation"]')
    await expect(navigation).toBeVisible()
    await expect(navigation).toHaveAttribute("data-color-scale", "website")
    await expect(navigation).not.toHaveAttribute("data-slot", "color-theme")
    const selected = navigation.getByRole("button", { name: "Button", exact: true })
    await expect(selected).toHaveAttribute("data-active", "true")
    await expectRole(selected, "background-color", "--md-sys-color-secondary-container")
    await expectRole(selected, "color", "--md-sys-color-on-secondary-container")
    const tokens = await navigation.evaluate(element => {
      const style = getComputedStyle(element)
      return ["hover", "focus", "pressed", "dragged"].map(state => Number(style.getPropertyValue(`--md-sys-state-${state}-state-layer-opacity`)))
    })
    expect(tokens).toEqual([0.08, 0.1, 0.1, 0.16])
    await navigation.getByRole("searchbox", { name: "Search library" }).fill("color")
    await expect(navigation.getByRole("button", { name: "Colors", exact: true })).toBeVisible()
    await navigation.getByRole("button", { name: "Colors", exact: true }).click()
    await expect(page).toHaveURL(/#\/colors$/)
    await expect(page.locator('[data-slot="color-theme"]')).toHaveAttribute("data-color-scale", "website")
    if (testInfo.project.use.isMobile) {
      await expect(navigation).toBeHidden()
    } else {
      await navigation.getByRole("button", { name: "Close navigation pane", exact: true }).click()
      const reopen = page.locator('[data-placement="floating"][aria-controls="navigation-pane-panel"]')
      await expect(reopen).toBeVisible()
      await reopen.click()
      await expect(navigation).toBeVisible()
      await expect(navigation.getByRole("button", { name: "Colors", exact: true })).toHaveAttribute("data-active", "true")
    }
  })
}

for (const mode of ["light", "dark"] as const) {
  test(`Global surface tokens propagate through components and portals in ${mode} mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    const samples = [
      { route: "card", selector: '[data-slot="card"]', role: "surface-container-lowest" },
      { route: "input", selector: '[data-slot="input"]:not(:disabled)', role: "field-fill" },
      { route: "textarea", selector: '[data-slot="textarea"]:not(:disabled)', role: "field-fill" },
      { route: "select", selector: '[data-slot="select-trigger"]', role: "field-fill" },
      { route: "input-group", selector: '[data-slot="input-group"]', role: "field-fill" },
      { route: "tabs", selector: '[data-slot="tabs-indicator"]', role: "surface-container-lowest" },
    ]
    for (const { route, selector, role } of samples) {
      await page.goto(`/#/${route}`)
      await expect(page.locator("html")).toHaveClass(new RegExp(mode))
      const sample = page.locator(`[data-slot="canvas"] ${selector}`).first()
      await expect(sample).toBeVisible()
      await expectRole(page.locator("body"), "background-color", "--md-sys-color-surface")
      await expectRole(sample, "background-color", role === "field-fill" ? "--field-fill" : `--md-sys-color-${role}`)
      const initial = await sample.evaluate(element => getComputedStyle(element).backgroundColor)
      const source = role === "field-fill"
        ? `--theme-website-on-surface-variant-${mode}`
        : `--theme-website-${role}-${mode}`
      await page.locator("html").evaluate((element, source) => element.style.setProperty(source, "#b5c9d3"), source)
      if (role === "field-fill") {
        await expect.poll(() => sample.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(initial)
        await expectRole(sample, "background-color", "--field-fill")
      } else {
        await expect(sample).toHaveCSS("background-color", "rgb(181, 201, 211)")
      }
      await page.locator("html").evaluate((element, source) => element.style.removeProperty(source), source)
    }
    await page.goto("/#/dialog")
    await page.locator('[data-slot="canvas"] button').first().click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expectRole(dialog, "background-color", "--md-sys-color-surface-container-lowest")
    const popupSource = `--theme-website-surface-container-lowest-${mode}`
    await page.locator("html").evaluate((element, source) => element.style.setProperty(source, "#b5c9d3"), popupSource)
    await expect(dialog).toHaveCSS("background-color", "rgb(181, 201, 211)")
    await dialog.press("Escape")
    await page.locator("html").evaluate((element, source) => element.style.removeProperty(source), popupSource)
    await page.goto("/#/card")
    const surfaceSource = `--theme-website-surface-${mode}`
    await page.locator("html").evaluate((element, source) => element.style.setProperty(source, "#b5c9d3"), surfaceSource)
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(181, 201, 211)")
    await page.locator("html").evaluate((element, source) => element.style.removeProperty(source), surfaceSource)
  })
}

for (const mode of ["light", "dark"] as const) {
  test(`Alert semantic tones use owned token pairs in ${mode} mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    await page.goto("/#/alert")
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    const shapes = {
      neutral: "cookie6",
      info: "cookie7",
      success: "clover8",
      warning: "pentagon",
      error: "gem",
    } as const
    const symbols = {
      neutral: "info",
      info: "info",
      success: "check_circle",
      warning: "warning",
      error: "error",
    } as const
    for (const tone of ["neutral", "info", "success", "warning", "error"] as const) {
      const alert = page.locator(`[data-slot="alert"][data-tone="${tone}"]`).first()
      const title = alert.locator('[data-slot="alert-title"]')
      const description = alert.locator('[data-slot="alert-description"]')
      const icon = alert.locator('[data-slot="alert-icon"]')
      const shape = icon.locator('[data-slot="shape"]')
      const glyph = icon.locator('[data-slot="alert-icon-glyph"]')
      const materialIcon = glyph.locator('[data-slot="icon"]')
      await expect(alert).toBeVisible()
      await expectRole(alert, "background-color", `--alert-${tone}-fill`)
      await expectRole(title, "color", `--alert-${tone}-ink`)
      await expectRole(description, "color", "--muted-foreground")
      await expect(alert).toHaveAttribute("data-elevation", "flat")
      await expect(alert).toHaveCSS("border-top-width", "0px")
      const elevation = await alert.evaluate(element => {
        const style = getComputedStyle(element)
        const probe = document.createElement("span")
        probe.style.color = style.getPropertyValue("--elevation-stroke")
        document.body.append(probe)
        const stroke = getComputedStyle(probe).color
        probe.remove()
        return { shadow: style.boxShadow, stroke }
      })
      expect(elevation.shadow).toContain(elevation.stroke)
      await expect(icon).toBeVisible()
      await expect(icon).toHaveAttribute("data-shape", shapes[tone])
      await expect(icon).toHaveCSS("width", "56px")
      await expect(icon).toHaveCSS("height", "56px")
      await expect(shape).toHaveAttribute("data-shape", shapes[tone])
      await expectRole(shape, "fill", `--alert-${tone}-ink`)
      await expect(glyph).toHaveCSS("width", "24px")
      await expect(glyph).toHaveCSS("height", "24px")
      await expectRole(glyph, "color", `--alert-${tone}-fill`)
      const renderedFill = await alert.evaluate(element => {
        const glyph = element.querySelector<HTMLElement>('[data-slot="alert-icon-glyph"]')!
        const fill = getComputedStyle(element).backgroundColor
        const canvas = document.createElement("canvas")
        canvas.width = 1
        canvas.height = 1
        const context = canvas.getContext("2d")!
        context.fillStyle = fill
        context.fillRect(0, 0, 1, 1)
        return {
          fill,
          glyph: getComputedStyle(glyph).color,
          alpha: context.getImageData(0, 0, 1, 1).data[3],
        }
      })
      expect(renderedFill.glyph).toBe(renderedFill.fill)
      expect(renderedFill.alpha).toBe(255)
      await expect(materialIcon).toHaveAttribute("data-filled", "true")
      await expect(materialIcon).toHaveAttribute("data-material-symbol", symbols[tone])
      if (tone === "warning") {
        await expect(materialIcon).toHaveAttribute("data-optical-correction", "triangle")
        await expect(materialIcon.locator("text")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -2)")
      }
      await expect(alert.locator('[data-slot="alert-content"]')).toHaveClass(/icon-label/)
    }
    const anatomy = await page.locator('[data-slot="alert"][data-tone="neutral"]').first().evaluate(element => {
      const layout = element.querySelector<HTMLElement>('[data-slot="alert-layout"]')!
      const icon = element.querySelector<HTMLElement>('[data-slot="alert-icon"]')!
      const content = element.querySelector<HTMLElement>('[data-slot="alert-content"]')!
      const title = element.querySelector<HTMLElement>('[data-slot="alert-title"]')!
      const description = element.querySelector<HTMLElement>('[data-slot="alert-description"]')!
      const style = getComputedStyle(element)
      const alertBounds = element.getBoundingClientRect()
      const iconBounds = icon.getBoundingClientRect()
      const contentBounds = content.getBoundingClientRect()
      return {
        gap: getComputedStyle(layout).columnGap,
        opticalPadding: getComputedStyle(content).paddingInlineEnd,
        leadingInset: iconBounds.left - alertBounds.left,
        graphicGap: contentBounds.left - iconBounds.right,
        padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft],
        radius: style.borderTopRightRadius,
        title: {
          size: getComputedStyle(title).fontSize,
          lineHeight: getComputedStyle(title).lineHeight,
          weight: getComputedStyle(title).fontWeight,
        },
        description: {
          size: getComputedStyle(description).fontSize,
          lineHeight: getComputedStyle(description).lineHeight,
          weight: getComputedStyle(description).fontWeight,
        },
      }
    })
    expect(anatomy).toEqual({
      gap: "8px",
      opticalPadding: "4px",
      leadingInset: 16,
      graphicGap: 12,
      padding: ["16px", "16px", "16px", "16px"],
      radius: "44px",
      title: { size: "18px", lineHeight: "28px", weight: "500" },
      description: { size: "14px", lineHeight: "21px", weight: "500" },
    })
  })
}

test("Alert action stays inline when roomy and stacks when narrow", async ({ page }) => {
  await page.goto("/#/alert")
  const alert = page.locator('#alert-action [data-slot="alert"]').first()
  const measure = (width: string) => alert.evaluate((element, width) => {
    element.style.width = width
    const content = element.querySelector<HTMLElement>('[data-slot="alert-content"]')!.getBoundingClientRect()
    const action = element.querySelector<HTMLElement>('[data-slot="alert-action"]')!
    const button = action.querySelector<HTMLElement>('[data-slot="button"]')!
    const alertStyle = getComputedStyle(element)
    const buttonStyle = getComputedStyle(button)
    const actionBounds = action.getBoundingClientRect()
    const buttonBounds = button.getBoundingClientRect()
    const alertBounds = element.getBoundingClientRect()
    const result = {
      content: { left: content.left, right: content.right, top: content.top, bottom: content.bottom },
      action: { left: actionBounds.left, right: actionBounds.right, top: actionBounds.top, bottom: actionBounds.bottom },
      button: { left: buttonBounds.left, right: buttonBounds.right, top: buttonBounds.top, bottom: buttonBounds.bottom },
      alert: { left: alertBounds.left, right: alertBounds.right, top: alertBounds.top, bottom: alertBounds.bottom },
      alertRadius: parseFloat(alertStyle.borderTopRightRadius),
      buttonRadius: parseFloat(buttonStyle.borderTopRightRadius),
      actionPosition: getComputedStyle(action).position,
      overflows: element.scrollWidth > element.clientWidth + 1,
    }
    element.style.removeProperty("width")
    return result
  }, width)
  const roomy = await measure("28rem")
  expect(roomy.action.left).toBeGreaterThanOrEqual(roomy.content.right)
  expect(roomy.action.top).toBeLessThan(roomy.content.bottom)
  expect(roomy.alert.right - roomy.button.right).toBeCloseTo(16, 0)
  expect(roomy.button.top - roomy.alert.top).toBeCloseTo(16, 0)
  expect(roomy.alertRadius).toBeCloseTo(roomy.buttonRadius + roomy.alert.right - roomy.button.right, 0)
  expect(roomy.actionPosition).toBe("static")
  expect(roomy.overflows).toBe(false)
  const narrow = await measure("20rem")
  expect(narrow.action.top).toBeGreaterThanOrEqual(narrow.content.bottom)
  expect(narrow.action.left).toBeCloseTo(narrow.content.left, 0)
  expect(narrow.action.right).toBeLessThanOrEqual(narrow.content.right + 1)
  expect(narrow.alert.right - narrow.button.right).toBeCloseTo(16, 0)
  expect(narrow.alert.bottom - narrow.button.bottom).toBeCloseTo(16, 0)
  expect(narrow.alertRadius).toBeCloseTo(narrow.buttonRadius + narrow.alert.right - narrow.button.right, 0)
  expect(narrow.overflows).toBe(false)
  const button = alert.locator('[data-slot="alert-action"] [data-slot="button"]')
  await expect(button).toHaveAttribute("data-variant", "primary")
  await expect(button).toHaveAttribute("data-size", "expressive")
})

for (const mode of ["light", "dark"] as const) {
  test(`Focused Input and Textarea keep neutral fills and purple rings in ${mode} mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    const samples = [
      { route: "input", selector: '[data-slot="input"]:not(:disabled)' },
      { route: "textarea", selector: '[data-slot="textarea"]:not(:disabled)' },
    ]
    for (const { route, selector } of samples) {
      await page.goto(`/#/${route}`)
      await expect(page.locator("html")).toHaveClass(new RegExp(mode))
      const sample = page.locator(`[data-slot="canvas"] ${selector}`).first()
      await expect(sample).toBeVisible()
      await page.keyboard.press("Tab")
      await sample.focus()
      await expect(sample).toBeFocused()
      await expectRole(sample, "background-color", "--field-hover-fill")
      const focus = await sample.evaluate(element => {
        const style = getComputedStyle(element)
        const probe = document.createElement("span")
        probe.style.color = style.getPropertyValue("--ring")
        document.body.append(probe)
        const ring = getComputedStyle(probe).color
        probe.remove()
        return {
          visible: element.matches(":focus-visible"),
          ring,
          shadow: style.boxShadow,
          controlOutlineWidth: style.getPropertyValue("--control-outline-width").trim(),
        }
      })
      expect(focus.visible).toBe(true)
      expect(focus.shadow).toContain(focus.ring)
      expect(focus.shadow).toContain(`0px 0px 0px ${focus.controlOutlineWidth}`)
    }
  })
}

for (const mode of ["light", "dark"] as const) {
  test(`Input and Textarea tint responds to the shared surface ink in ${mode} mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    for (const route of ["input", "textarea"]) {
      await page.goto(`/#/${route}`)
      await page.mouse.move(0, 0)
      const field = page.locator(`[data-slot="canvas"] [data-slot="${route}"]:not(:disabled)`).first()
      await expect(field).toBeVisible()
      await expectRole(field, "background-color", "--field-fill")
      const original = await field.evaluate(element => getComputedStyle(element).backgroundColor)
      const source = `--theme-website-on-surface-variant-${mode}`
      await page.locator("html").evaluate((element, token) => element.style.setProperty(token, "#b5c9d3"), source)
      await expect.poll(() => field.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(original)
      await expectRole(field, "background-color", "--field-fill")
      await page.locator("html").evaluate((element, token) => element.style.removeProperty(token), source)
    }
  })
}

for (const mode of ["light", "dark"] as const) {
  test(`Checkbox and Radio move from Tertiary outlines to selected fills in ${mode} mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    const samples = [
      { route: "checkbox", slot: "checkbox" },
      { route: "radio-group", slot: "radio-group-item" },
    ]
    for (const { route, slot } of samples) {
      await page.goto(`/#/${route}`)
      await expect(page.locator("html")).toHaveClass(new RegExp(mode))
      const unchecked = page.locator(`[data-slot="canvas"] [data-slot="${slot}"][data-state="unchecked"]:not([aria-invalid="true"]):not(:disabled)`).first()
      const checked = page.locator(`[data-slot="canvas"] [data-slot="${slot}"][data-state="checked"]:not([aria-invalid="true"]):not(:disabled)`).first()
      await expect(unchecked).toBeVisible()
      await expect(checked).toBeVisible()
      await expect(unchecked).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
      const outline = await unchecked.evaluate(element => {
        const style = getComputedStyle(element)
        const probe = document.createElement("span")
        probe.style.boxShadow = style.getPropertyValue("--control-outline-shadow")
        probe.style.backgroundColor = "var(--control-outline)"
        document.body.append(probe)
        const expected = getComputedStyle(probe).boxShadow
        const color = getComputedStyle(probe).backgroundColor
        probe.style.backgroundColor = "var(--tertiary-fill)"
        const tertiary = getComputedStyle(probe).backgroundColor
        probe.remove()
        return {
          actual: style.boxShadow,
          color,
          expected,
          tertiary,
          width: style.getPropertyValue("--control-outline-width").trim(),
        }
      })
      expect(outline.width).toBe("3px")
      expect(outline.color).toBe(outline.tertiary)
      expect(outline.actual).toContain(outline.expected)
      await expectRole(checked, "background-color", "--button-selected-secondary-fill")
      await expectRole(checked, "border-top-color", "--button-selected-secondary-fill")
      const checkedOutline = await checked.evaluate(element => {
        const style = getComputedStyle(element)
        const probe = document.createElement("span")
        probe.style.boxShadow = style.getPropertyValue("--control-outline-clear-shadow")
        document.body.append(probe)
        const expected = getComputedStyle(probe).boxShadow
        probe.remove()
        return { actual: style.boxShadow, expected }
      })
      expect(checkedOutline.actual).toContain(checkedOutline.expected)
    }
  })
}

test("Checkbox and Radio selection fades use Material icon timing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  const samples = [
    { route: "checkbox", role: "checkbox", name: "SMS", indicator: "checkbox-indicator" },
    { route: "radio-group", role: "radio", name: "Compact", indicator: "radio-group-indicator" },
  ] as const
  for (const { route, role, name, indicator } of samples) {
    await page.goto(`/#/${route}`)
    const control = page.locator(`#${route}-group [data-slot="canvas"]`).getByRole(role, { name, exact: true }).first()
    await expect(control).not.toBeChecked()
    const motion = await control.evaluate((element, indicator) => {
      const mark = element.querySelector<HTMLElement>(`[data-slot="${indicator}"]`)!
      const before = {
        background: getComputedStyle(element).backgroundColor,
        markOpacity: Number(getComputedStyle(mark).opacity),
        shadow: getComputedStyle(element).boxShadow,
      }
      const style = getComputedStyle(element)
      const expectedDuration = parseFloat(style.getPropertyValue("--material-icon-fill-speed"))
      const expectedCurve = style.getPropertyValue("--material-icon-fill-curve").trim()
      return new Promise<{
        before: typeof before
        expectedDuration: number
        expectedCurve: string
        transitions: { property: string; duration: number; easing: string }[]
        middle: typeof before
        after: typeof before
      }>(resolve => {
        const observer = new MutationObserver(() => {
          if (element.getAttribute("data-state") !== "checked") return
          observer.disconnect()
          const animations = [...element.getAnimations(), ...mark.getAnimations()]
            .filter((animation): animation is CSSTransition => animation instanceof CSSTransition)
          const transitions = animations.map(animation => ({
            property: animation.transitionProperty,
            duration: Number(animation.effect!.getTiming().duration),
            easing: animation.effect!.getTiming().easing,
          }))
          animations.forEach(animation => {
            animation.pause()
            animation.currentTime = Number(animation.effect!.getTiming().duration) / 2
          })
          const middle = {
            background: getComputedStyle(element).backgroundColor,
            markOpacity: Number(getComputedStyle(mark).opacity),
            shadow: getComputedStyle(element).boxShadow,
          }
          animations.forEach(animation => animation.finish())
          resolve({
            before,
            expectedDuration,
            expectedCurve,
            transitions,
            middle,
            after: {
              background: getComputedStyle(element).backgroundColor,
              markOpacity: Number(getComputedStyle(mark).opacity),
              shadow: getComputedStyle(element).boxShadow,
            },
          })
        })
        observer.observe(element, { attributes: true, attributeFilter: ["data-state"] })
        element.click()
      })
    }, indicator)
    expect(motion.before.markOpacity).toBe(0)
    for (const property of ["background-color", "box-shadow", "opacity"]) {
      const transition = motion.transitions.find(transition => transition.property === property)
      expect(transition, `${route}/${property}`).toBeDefined()
      expect(transition!.duration).toBe(motion.expectedDuration)
      expect(transition!.easing).toBe(motion.expectedCurve)
    }
    expect(motion.middle.markOpacity).toBeGreaterThan(0)
    expect(motion.middle.markOpacity).toBeLessThan(1)
    expect(motion.middle.background).not.toBe(motion.before.background)
    expect(motion.middle.background).not.toBe(motion.after.background)
    expect(motion.middle.shadow).not.toBe(motion.before.shadow)
    expect(motion.middle.shadow).not.toBe(motion.after.shadow)
    expect(motion.after.markOpacity).toBe(1)
  }

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/checkbox")
  const checkbox = page.locator('#checkbox-group [data-slot="canvas"]').getByRole("checkbox", { name: "SMS", exact: true }).first()
  const reducedDurations = await checkbox.evaluate(element => {
    const mark = element.querySelector<HTMLElement>('[data-slot="checkbox-indicator"]')!
    return [getComputedStyle(element).transitionDuration, getComputedStyle(mark).transitionDuration]
  })
  expect(reducedDurations.every(duration => duration.split(",").every(value => parseFloat(value) <= 0.001))).toBe(true)
  await checkbox.click()
  await expect(checkbox).toBeChecked()
  await expect(checkbox.locator('[data-slot="checkbox-indicator"]')).toHaveCSS("opacity", "1")
})

for (const mode of ["light", "dark"] as const) {
  test(`Primary Button offers purple and pink in ${mode} mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    await page.goto("/#/button")
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    const canvas = page.locator('#button-default [data-slot="canvas"]')
    const purple = canvas.locator('[data-variant="primary"][data-primary-color="purple"][data-size="default"]')
    const pink = canvas.locator('[data-variant="primary"][data-primary-color="pink"][data-size="default"]')

    await expect(purple).toHaveText("Primary purple")
    await expectRole(purple, "background-color", "--button-primary-fill")
    await expectRole(purple, "color", "--button-primary-ink")
    await expect(pink).toHaveText("Primary pink")
    await expectRole(pink, "background-color", "--button-primary-pink-fill")
    await expectRole(pink, "color", "--button-primary-pink-ink")
    await expect(pink).toHaveCSS("background-color", mode === "light" ? "rgb(241, 211, 249)" : "rgb(85, 63, 93)")
    await expect(pink).toHaveCSS("color", mode === "light" ? "rgb(39, 20, 48)" : "rgb(247, 216, 255)")

    await pink.hover()
    await expectRole(pink, "background-color", "--button-primary-hover")
    await page.mouse.down()
    await expectRole(pink, "background-color", "--button-primary-pressed")
    await page.mouse.up()
  })
}

for (const mode of ["light", "dark"] as const) {
  test(`Shared Buttons use purple and pink Primary, Secondary, Tertiary, and Material destructive tokens in ${mode} mode`, async ({ page }, testInfo) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    await page.goto("/#/button")
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    const canvas = page.locator('#button-default [data-slot="canvas"]')
    await expect(canvas.getByRole("button", { name: "Primary purple", exact: true })).toHaveCount(2)
    await expect(canvas.getByRole("button", { name: "Primary pink", exact: true })).toHaveCount(2)
    await expect(canvas.getByRole("button", { name: "Secondary", exact: true })).toHaveCount(2)
    await expect(canvas.getByRole("button", { name: "Tertiary", exact: true })).toHaveCount(2)
    await expect(canvas.getByRole("button", { name: "Material destructive", exact: true })).toHaveCount(0)
    await expect(canvas.getByRole("button", { name: "Destructive", exact: true })).toHaveCount(2)
    const generic = await page.locator("html").evaluate(element => ["--primary", "--secondary"].map(token => getComputedStyle(element).getPropertyValue(token)))
    for (const size of ["default", "expressive"]) {
      for (const [variant, family] of [["primary", "primary"], ["secondary", "secondary"], ["tertiary", "tertiary"]]) {
        const button = canvas.locator(`[data-variant="${variant}"][data-size="${size}"]:not([data-selected])${variant === "primary" ? '[data-primary-color="purple"]' : ""}`)
        await page.getByRole("heading", { name: "Button", exact: true }).hover()
        await expectRole(button, "background-color", `--button-${family}-fill`)
        await expectRole(button, "color", `--button-${family}-ink`)
        await expect(button).toHaveCSS("height", size === "default" ? "40px" : "56px")
        await expect(button).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)")
        const states = testInfo.project.use.isMobile ? ["rest", "pressed"] as const : ["rest", "hover", "pressed"] as const
        for (const state of states) {
          if (state !== "rest") await button.hover()
          if (state === "pressed") await page.mouse.down()
          await expectRole(button, "background-color", `--button-${family}-${state === "rest" ? "fill" : state}`)
          const paint = await button.evaluate(element => {
            const style = getComputedStyle(element)
            const context = document.createElement("canvas").getContext("2d")!
            const pixel = (color: string) => {
              context.clearRect(0, 0, 1, 1)
              context.fillStyle = color
              context.fillRect(0, 0, 1, 1)
              return Array.from(context.getImageData(0, 0, 1, 1).data)
            }
            const luminance = (channels: number[]) => channels.slice(0, 3).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
            const fill = pixel(style.backgroundColor)
            const values = [luminance(fill), luminance(pixel(style.color))].sort((left, right) => right - left)
            return { opacity: fill[3], ratio: (values[0] + 0.05) / (values[1] + 0.05) }
          })
          expect(paint.opacity).toBe(255)
          expect(paint.ratio, `${mode}/${variant}/${size}/${state}`).toBeGreaterThanOrEqual(4.5)
          if (state === "pressed") await page.mouse.up()
        }
      }
    }
    const primary = canvas.locator('[data-variant="primary"][data-primary-color="purple"][data-size="default"]:not([data-selected])')
    const pink = canvas.locator('[data-variant="primary"][data-primary-color="pink"][data-size="default"]:not([data-selected])')
    await page.getByRole("heading", { name: "Button", exact: true }).hover()
    await expect(primary).toHaveCSS("background-color", mode === "light" ? "rgb(103, 80, 164)" : "rgb(208, 188, 255)")
    await expect(primary).toHaveCSS("color", mode === "light" ? "rgb(255, 255, 255)" : "rgb(26, 0, 86)")
    await expect(pink).toHaveCSS("background-color", mode === "light" ? "rgb(241, 211, 249)" : "rgb(85, 63, 93)")
    await expect(pink).toHaveCSS("color", mode === "light" ? "rgb(39, 20, 48)" : "rgb(247, 216, 255)")
    await expectRole(pink, "background-color", "--button-primary-pink-fill")
    await expectRole(pink, "color", "--button-primary-pink-ink")
    for (const size of ["default", "expressive"]) {
      const material = canvas.locator(`[data-variant="destructive"][data-size="${size}"]`)
      const states = testInfo.project.use.isMobile ? ["fill", "pressed"] : ["fill", "hover", "pressed"]
      for (const state of states) {
        if (state !== "fill") await material.hover()
        if (state === "pressed") await page.mouse.down()
        const expected = await material.evaluate((element, { mode, state }) => {
          const opacity = state === "fill" ? (mode === "light" ? 10 : 20)
            : state === "hover" ? (mode === "light" ? 20 : 30) : (mode === "light" ? 30 : 40)
          const probe = document.createElement("span")
          probe.style.transition = "none"
          probe.style.backgroundColor = `color-mix(in oklab, ${mode === "light" ? "#b3261e" : "#f2b8b5"} ${opacity}%, transparent)`
          document.body.append(probe)
          const color = getComputedStyle(probe).backgroundColor
          probe.remove()
          return { color, height: element.getBoundingClientRect().height }
        }, { mode, state })
        await expect(material).toHaveCSS("background-color", expected.color)
        await expectRole(material, "color", "--button-destructive-ink")
        expect(expected.height).toBe(size === "default" ? 40 : 56)
        if (state === "pressed") await page.mouse.up()
      }
      await page.getByRole("heading", { name: "Button", exact: true }).hover()
    }
    expect(await canvas.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
    await expect(canvas.locator('[data-variant="secondary"][data-size="default"]')).toHaveCSS("background-color", mode === "light" ? "rgb(220, 218, 245)" : "rgb(69, 69, 90)")
    await expect(canvas.locator('[data-variant="link"][data-size="default"]')).toHaveCSS("color", mode === "light" ? "rgb(103, 80, 164)" : "rgb(208, 188, 255)")
    const disabled = page.locator('#button-motion button[disabled]').first()
    await expect(disabled).toBeDisabled()
    await expect(disabled).toHaveCSS("opacity", "0.5")
    await expect(disabled).toHaveAttribute("data-variant", "tertiary")
    await expectRole(disabled, "background-color", "--button-tertiary-fill")
    const secondary = canvas.locator('[data-variant="secondary"][data-size="default"]')
    const source = `--theme-website-secondary-container-${mode}`
    await page.locator("html").evaluate((element, source) => element.style.setProperty(source, "#b5c9d3"), source)
    await expect(secondary).toHaveCSS("background-color", "rgb(181, 201, 211)")
    if (!testInfo.project.use.isMobile) {
      await secondary.hover()
      await expectRole(secondary, "background-color", "--button-secondary-hover")
      await expectRole(page.locator('[data-theme-scope="showcase-navigation"]').getByRole("button", { name: "Sort alphabetically", exact: true }), "background-color", "--button-tertiary-fill")
    }
    expect(await page.locator("html").evaluate(element => ["--primary", "--secondary"].map(token => getComputedStyle(element).getPropertyValue(token)))).toEqual(generic)
    await page.locator("html").evaluate((element, source) => element.style.removeProperty(source), source)
  })
}

for (const mode of ["light", "dark"] as const) {
  test(`Selected Buttons toggle Material shape and color without layout shifts in ${mode} mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    await page.goto("/#/button")
    const canvas = page.locator('#button-selected [data-slot="canvas"]')
    await expect(canvas.locator('button[data-selected]')).toHaveCount(8)
    for (const button of await canvas.locator('button[data-selected]:not(:disabled)').all()) {
      const size = await button.getAttribute("data-size")
      const variant = await button.getAttribute("data-variant")
      const secondary = variant === "secondary"
      const expressive = size === "expressive" || size === "icon-expressive"
      const dimensions = await button.evaluate(element => [element.offsetWidth, element.offsetHeight])
      const icon = button.locator('[data-slot="button-selection-icon"]')
      const iconGeometry = () => icon.evaluate(element => {
        const bounds = element.getBoundingClientRect()
        const parent = element.closest('button')!.getBoundingClientRect()
        return [bounds.width, bounds.height, bounds.x - parent.x, bounds.y - parent.y]
      })
      const originalIconGeometry = await iconGeometry()
      await expect(icon).toHaveAttribute("aria-hidden", "true")
      await expect(icon).toHaveCSS("width", expressive ? "24px" : "20px")
      await expect(icon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
      await expect(button).toHaveAttribute("aria-pressed", "true")
      await expect(button).toHaveCSS("border-radius", expressive ? "28px" : "20px")
      await expectRole(button, "background-color", secondary ? "--button-selected-secondary-fill" : "--button-secondary-fill")
      await expectRole(button, "color", secondary ? "--button-selected-secondary-ink" : "--button-secondary-ink")
      await button.click()
      await page.getByRole("heading", { name: "Button", exact: true }).hover()
      await expect(button).toHaveAttribute("aria-pressed", "false")
      await expect(icon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
      expect(await iconGeometry()).toEqual(originalIconGeometry)
      await expect(button).toHaveCSS("border-radius", expressive ? "16px" : "12px")
      await expectRole(button, "background-color", secondary ? "--button-secondary-fill" : "--md-sys-color-surface-container-highest")
      expect(await button.evaluate(element => [element.offsetWidth, element.offsetHeight])).toEqual(dimensions)
      await button.focus()
      await button.press("Space")
      await expect(button).toHaveAttribute("aria-pressed", "true")
      await expect(button).toHaveCSS("border-radius", expressive ? "28px" : "20px")
      await expect(icon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
      await button.press("Enter")
      await expect(button).toHaveAttribute("aria-pressed", "false")
      await expect(icon.locator("text")).toHaveCSS("font-variation-settings", /"FILL" 0(?:,|$)/)
      await button.press("Enter")
      await expect(button).toHaveAttribute("aria-pressed", "true")
      expect(await button.evaluate(element => [element.offsetWidth, element.offsetHeight])).toEqual(dimensions)
      expect(await iconGeometry()).toEqual(originalIconGeometry)
    }
    for (const disabled of await canvas.locator('button:disabled').all()) {
      await expect(disabled).toHaveAttribute("aria-pressed", "true")
      await expect(disabled.locator('[data-slot="button-selection-icon"] text')).toHaveCSS("font-variation-settings", /"FILL" 1(?:,|$)/)
      await disabled.evaluate(element => element.click())
      await expect(disabled).toHaveAttribute("aria-pressed", "true")
    }
    expect(await canvas.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
    const ordinary = page.locator('#button-default button[data-size="default"][data-variant="tertiary"]:not([data-selected])')
    await expect(ordinary).not.toHaveAttribute("aria-pressed")
    await expect(ordinary).toHaveCSS("border-radius", "10px")
  })
}

test("Website lab preserves workflows through appearance changes", async ({ page }) => {
  const { preview, lab } = await openColors(page, "light")
  await lab.getByRole("button", { name: "Pause session", exact: true }).click()
  await lab.getByRole("button", { name: "Complete next", exact: true }).click()
  await expect(lab.getByText("2 of 2 explored", { exact: true })).toBeVisible()
  await lab.getByLabel("Working note", { exact: true }).fill("Material surface comparison")
  await lab.getByRole("button", { name: "Save note", exact: true }).click()
  await expect(lab.locator('.expression-lab__capture [data-slot="badge"]')).toHaveText("Saved")
  await lab.getByLabel("Category", { exact: true }).selectOption("motion")
  await lab.getByRole("switch", { name: "Auto-save draft" }).uncheck()
  await lab.getByRole("textbox", { name: "Message the design assistant" }).fill("Compare the surface roles")
  await lab.getByRole("textbox", { name: "Message the design assistant" }).press("Enter")
  await expect(lab.getByText("Compare the surface roles", { exact: true })).toBeVisible()
  await lab.getByRole("button", { name: "Add to prompt" }).click()
  await page.getByRole("menuitemcheckbox", { name: "Search web" }).click()
  await page.emulateMedia({ colorScheme: "dark" })
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expectRole(lab.locator('[data-slot="card"]').first(), "background-color", "--md-sys-color-surface-container-lowest")
  await expect(lab.getByLabel("Working note", { exact: true })).toHaveValue("Material surface comparison")
  await expect(lab.getByLabel("Category", { exact: true })).toHaveValue("motion")
  await expect(lab.getByRole("switch", { name: "Auto-save draft" })).not.toBeChecked()
  await expect(lab.getByRole("button", { name: "Search web", exact: true })).toBeVisible()
  await expect(preview).toHaveAttribute("data-color-scale", "website")
  await lab.getByRole("button", { name: "Quick actions", exact: true }).click()
  await page.getByRole("menuitem", { name: "Reset lab", exact: true }).click()
  await expect(lab.getByRole("button", { name: "Pause session", exact: true })).toHaveCount(1)
  await expect(lab.getByText("1 of 2 explored", { exact: true })).toHaveCount(1)
  await expect(lab.getByText("Compare the surface roles", { exact: true })).toHaveCount(0)
})