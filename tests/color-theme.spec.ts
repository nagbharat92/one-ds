import { expect, test, type Locator, type Page } from "@playwright/test"

async function openColors(page: Page, mode: "light" | "dark") {
  await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
  await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
  await page.goto("/#/colors")
  const preview = page.locator('[data-slot="color-theme"]')
  const lab = preview.getByRole("region", { name: "Expression lab workbench", exact: true })
  await expect(preview).toHaveAttribute("data-color-scale", "website")
  await expect(lab).toBeVisible()
  await expect(page.locator("html")).toHaveClass(new RegExp(mode))
  return { preview, lab }
}

async function expectRole(element: Locator, property: "color" | "background-color", token: string) {
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

for (const mode of ["light", "dark"] as const) {
  test(`Website theme uses paired Material roles in ${mode} mode`, async ({ page }, testInfo) => {
    const { preview, lab } = await openColors(page, mode)
    await expect(page.getByRole("combobox", { name: /Color scale|Material scheme|Material contrast/ })).toHaveCount(0)
    await expect(page.getByRole("checkbox", { name: "Accent buttons" })).toHaveCount(0)
    await expect(preview.locator('[data-slot="material-color-roles"] tbody tr')).toHaveCount(25)
    const surfaces = preview.locator('[data-slot="material-surface-roles"]')
    await expect(surfaces.locator('tbody tr')).toHaveCount(6)
    await expect(surfaces.getByText("Surface container lowest", { exact: true })).toBeVisible()
    for (const sample of await surfaces.locator('[data-role]').all()) {
      const role = await sample.getAttribute("data-role")
      await expectRole(sample, "background-color", `--md-sys-color-${role}`)
      await expectRole(sample, "color", await sample.textContent() === "On surface" ? "--md-sys-color-on-surface" : "--md-sys-color-on-surface-variant")
    }
    await expect(preview.locator('[data-slot="material-color-families"] tbody tr')).toHaveCount(3)
    await expect(preview.getByText("On primary container", { exact: true }).first()).toBeVisible()
    await expect(lab.locator('[data-slot="sidebar-inset"]')).toHaveCSS("background-color", mode === "light" ? "rgb(254, 251, 255)" : "rgb(20, 19, 20)")
    const primary = lab.getByRole("button", { name: "Complete next", exact: true })
    await expect(primary).toHaveCSS("background-color", mode === "light" ? "rgb(103, 80, 164)" : "rgb(208, 188, 255)")
    await expectRole(primary, "background-color", "--button-primary-fill")
    await expectRole(primary, "color", "--md-sys-color-on-primary")
    await expectRole(lab.getByRole("button", { name: "Pause session", exact: true }), "background-color", "--button-primary-fill")
    expect(await preview.evaluate(element => getComputedStyle(element).getPropertyValue("--md-sys-color-primary").trim())).toBe(mode === "light" ? "#6442d6" : "#9f86ff")
    await expect(primary).toHaveCSS("height", "40px")
    for (const card of await lab.locator('[data-slot="card"]').all()) {
      await expect(card).toHaveCSS("background-color", mode === "light" ? "rgb(255, 255, 255)" : "rgb(15, 14, 15)")
    }
    await expectRole(lab.locator('[data-slot="card-footer"]').first(), "background-color", "--md-sys-color-surface-container-low")
    const tabs = lab.getByRole("tablist", { name: "Lab horizon" })
    await expectRole(tabs, "background-color", "--md-sys-color-surface-container-low")
    await expectRole(tabs.locator('[data-slot="tabs-indicator"]'), "background-color", "--md-sys-color-secondary-container")
    await expectRole(tabs.getByRole("tab", { selected: true }), "color", "--md-sys-color-on-secondary-container")
    await tabs.getByRole("tab", { name: "This week", exact: true }).click()
    await expectRole(tabs.getByRole("tab", { selected: true }), "color", "--md-sys-color-on-secondary-container")
    await lab.getByRole("button", { name: "Quick actions", exact: true }).click()
    const menu = page.getByRole("menu")
    await expect(menu).toHaveAttribute("data-color-scale", "website")
    await expectRole(menu, "background-color", "--md-sys-color-surface-container-high")
    await menu.press("Escape")
    await expect(menu).toBeHidden()
    expect(await preview.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
    const overflow = await lab.evaluate(element => Array.from(element.querySelectorAll('[data-slot="card"], [data-slot="site-header-shell"], [data-slot="ai-composer"]')).filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.getAttribute("data-slot")))
    expect(overflow).toEqual([])
    if (testInfo.project.use.isMobile) {
      await lab.locator('.expression-lab__header').getByRole("button", { name: "Open sidebar", exact: true }).click()
      const drawer = page.locator('#expression-lab-panel[data-mobile="true"]')
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
    await expectRole(item, "background-color", "--sidebar-hover-fill")
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
      await page.getByRole("button", { name: "Open sidebar", exact: true }).click()
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
      await navigation.getByRole("button", { name: "Close sidebar", exact: true }).click()
      const reopen = page.locator('[data-placement="floating"][aria-controls="sidebar-panel"]')
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
      { route: "input", selector: '[data-slot="input"]:not(:disabled)', role: "surface-container-highest" },
      { route: "textarea", selector: '[data-slot="textarea"]:not(:disabled)', role: "surface-container-highest" },
      { route: "select", selector: '[data-slot="select-trigger"]', role: "surface-container-highest" },
      { route: "input-group", selector: '[data-slot="input-group"]', role: "surface-container-highest" },
      { route: "tabs", selector: '[data-slot="tabs-indicator"]', role: "surface-container-low" },
    ]
    for (const { route, selector, role } of samples) {
      await page.goto(`/#/${route}`)
      await expect(page.locator("html")).toHaveClass(new RegExp(mode))
      const sample = page.locator(`[data-slot="canvas"] ${selector}`).first()
      await expect(sample).toBeVisible()
      await expectRole(page.locator("body"), "background-color", "--md-sys-color-surface")
      await expectRole(sample, "background-color", `--md-sys-color-${role}`)
      const source = `--theme-website-${role}-${mode}`
      await page.locator("html").evaluate((element, source) => element.style.setProperty(source, "#b5c9d3"), source)
      await expect(sample).toHaveCSS("background-color", "rgb(181, 201, 211)")
      await page.locator("html").evaluate((element, source) => element.style.removeProperty(source), source)
    }
    await page.goto("/#/dialog")
    await page.locator('[data-slot="canvas"] button').first().click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expectRole(dialog, "background-color", "--md-sys-color-surface-container-high")
    const popupSource = `--theme-website-surface-container-high-${mode}`
    await page.locator("html").evaluate((element, source) => element.style.setProperty(source, "#b5c9d3"), popupSource)
    await expect(dialog).toHaveCSS("background-color", "rgb(181, 201, 211)")
    await dialog.press("Escape")
    await page.locator("html").evaluate((element, source) => element.style.removeProperty(source), popupSource)
    await page.goto("/#/surfaces")
    const surfaceSource = `--theme-website-surface-${mode}`
    await page.locator("html").evaluate((element, source) => element.style.setProperty(source, "#b5c9d3"), surfaceSource)
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(181, 201, 211)")
    await expect(page.locator('.surface-diagram__main').first()).toHaveCSS("background-color", "rgb(181, 201, 211)")
    await expect(page.locator('[data-slot="canvas"]').first()).toHaveCSS("background-color", "rgb(181, 201, 211)")
  })
}

test("Surfaces diagrams show color relationships with bounded noninteractive shapes", async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" })
  await page.goto("/#/surfaces")
  await expect(page.getByRole("heading", { name: "Surfaces", exact: true })).toBeVisible()
  const diagrams = page.locator('[data-slot="surface-diagram"]')
  await expect(diagrams).toHaveCount(3)
  for (const mode of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: mode })
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    for (const diagram of await diagrams.all()) {
      await expect(diagram).toHaveAttribute("role", "img")
      await expect(diagram).toHaveAttribute("aria-label", /silhouette/)
      const scene = diagram.locator('.surface-diagram__scene')
      await expect(scene).toHaveAttribute("inert", "")
      await expect(scene).toHaveText("")
      await expect(scene.locator('[data-kind="line"], [data-kind="heading"], [data-tone="foreground"], [data-tone="muted"], [data-tone="on-primary"], [data-tone="on-secondary"]')).toHaveCount(0)
      await expect(scene.locator('.surface-diagram__action > *, .surface-diagram__selected > *')).toHaveCount(0)
      await expect(scene.locator('button, input, textarea, select, a, [tabindex]')).toHaveCount(0)
      for (const surface of await diagram.locator('[data-material-surface]').all()) {
        const role = await surface.getAttribute("data-material-surface")
        const content = await surface.getAttribute("data-material-content")
        await expectRole(surface, "background-color", `--md-sys-color-${role}`)
        await expectRole(surface, "color", `--md-sys-color-${content}`)
      }
      await expectRole(diagram.locator('.surface-diagram__action[data-primary="true"]').first(), "background-color", "--button-primary-fill")
      const clipped = await scene.evaluate(element => Array.from(element.querySelectorAll('.surface-diagram__shape')).flatMap(shape => {
        const parent = shape.closest('[data-slot="card"], .surface-diagram__overlay, .surface-diagram__navigation, .surface-diagram__detail, .surface-diagram__media') ?? element
        const bounds = parent.getBoundingClientRect()
        const rect = shape.getBoundingClientRect()
        return rect.width <= 0 || rect.height <= 0 || rect.left < bounds.left - 1 || rect.top < bounds.top - 1 || rect.right > bounds.right + 1 || rect.bottom > bounds.bottom + 1
          ? [{ kind: shape.getAttribute('data-kind'), parent: parent.className, width: rect.width, height: rect.height }] : []
      }))
      expect(clipped).toEqual([])
      expect(await diagram.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
    }
    const workspace = diagrams.filter({ has: page.locator('.surface-diagram__workspace') }).first()
    const corners = await workspace.evaluate(element => {
      const outer = getComputedStyle(element.querySelector('.surface-diagram__scene')!)
      const inner = getComputedStyle(element.querySelector('.surface-diagram__main')!)
      const container = getComputedStyle(element.querySelector('.surface-diagram__workspace')!)
      return { outer: parseFloat(outer.borderTopRightRadius), inner: parseFloat(inner.borderTopRightRadius), inset: parseFloat(container.paddingTop) }
    })
    expect(corners.outer).toBeCloseTo(corners.inner + corners.inset, 1)
    await expectRole(workspace.locator('[data-slot="card"]').first(), "background-color", "--md-sys-color-surface-container-lowest")
    await expectRole(workspace.locator('.surface-diagram__selected'), "background-color", "--md-sys-color-secondary-container")
    if (mode === "light" && testInfo.project.name === "desktop" && process.env.THEME_SCREENSHOT) {
      await workspace.screenshot({ path: process.env.THEME_SCREENSHOT })
    }
  }
})

for (const mode of ["light", "dark"] as const) {
  test(`Shared Buttons use Primary Secondary Tertiary and Material destructive tokens in ${mode} mode`, async ({ page }, testInfo) => {
    await page.addInitScript(() => localStorage.setItem("oneds-theme", "system"))
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" })
    await page.goto("/#/button")
    await expect(page.locator("html")).toHaveClass(new RegExp(mode))
    const canvas = page.locator('#button-default [data-slot="canvas"]')
    await expect(canvas.getByRole("button", { name: "Primary", exact: true })).toHaveCount(2)
    await expect(canvas.getByRole("button", { name: "Secondary", exact: true })).toHaveCount(2)
    await expect(canvas.getByRole("button", { name: "Tertiary", exact: true })).toHaveCount(2)
    await expect(canvas.getByRole("button", { name: "Material destructive", exact: true })).toHaveCount(0)
    await expect(canvas.getByRole("button", { name: "Destructive", exact: true })).toHaveCount(2)
    const generic = await page.locator("html").evaluate(element => ["--primary", "--secondary"].map(token => getComputedStyle(element).getPropertyValue(token)))
    for (const size of ["default", "expressive"]) {
      for (const [variant, family] of [["primary", "primary"], ["secondary", "secondary"], ["tertiary", "tertiary"]]) {
        const button = canvas.locator(`[data-variant="${variant}"][data-size="${size}"]:not([data-selected])`)
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
    const primary = canvas.locator('[data-variant="primary"][data-size="default"]:not([data-selected])')
    await page.getByRole("heading", { name: "Button", exact: true }).hover()
    await expect(primary).toHaveCSS("background-color", mode === "light" ? "rgb(103, 80, 164)" : "rgb(208, 188, 255)")
    await expect(primary).toHaveCSS("color", mode === "light" ? "rgb(255, 255, 255)" : "rgb(26, 0, 86)")
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
        await expectRole(material, "color", "--destructive")
        expect(expected.height).toBe(size === "default" ? 40 : 56)
        if (state === "pressed") await page.mouse.up()
      }
      await page.getByRole("heading", { name: "Button", exact: true }).hover()
    }
    expect(await canvas.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
    await expect(canvas.locator('[data-variant="secondary"][data-size="default"]')).toHaveCSS("background-color", mode === "light" ? "rgb(220, 218, 245)" : "rgb(69, 69, 90)")
    await expect(canvas.locator('[data-variant="link"][data-size="default"]')).toHaveCSS("color", mode === "light" ? "rgb(100, 66, 214)" : "rgb(159, 134, 255)")
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
      await expectRole(page.locator('[data-theme-scope="showcase-navigation"]').getByRole("button", { name: "Group by section", exact: true }), "background-color", "--button-tertiary-fill")
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