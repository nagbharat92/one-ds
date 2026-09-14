import { expect, test, type Locator } from "@playwright/test"

test("expression lab applies coordinated expressive roles without changing Original", async ({ page }) => {
  await page.goto('/#/expression-lab')
  const lab = page.locator('.expression-lab')
  const tools = page.getByRole('toolbar', { name: 'Experiment tools' })
  const mode = async (name: string) => tools.getByText(name, { exact: true }).click()
  await mode('Original')
  await expect(lab.locator('.expression-lab__capture-footer button').first()).toHaveCSS('height', '40px')
  const original = await lab.evaluate(root => {
    const button = root.querySelector('.expression-lab__capture-footer button')!
    const textarea = root.querySelector('#expression-lab-note')!
    return { height: getComputedStyle(button).height, padding: getComputedStyle(textarea).padding, radius: getComputedStyle(textarea).borderRadius }
  })
  await expect(lab.locator('#expression-lab-category')).toHaveJSProperty('tagName', 'SELECT')
  await mode('Expressive')
  await expect(lab).toHaveAttribute('data-expression', 'expressive')
  await expect(lab.locator('[data-slot="card-title"]').first()).toHaveCSS('font-size', '20px')
  await expect(lab.locator('[data-slot="card-title"]').first()).toHaveCSS('font-weight', '700')
  await expect(lab.locator('[data-slot="card-description"]').first()).toHaveCSS('font-size', '16px')
  await expect(lab.locator('[data-slot="card-header"]').first()).toHaveCSS('gap', '8px')
  await expect(lab.locator('[data-slot="card-content"]').first()).toHaveCSS('padding-left', '24px')
  await expect(lab.locator('.expression-lab__capture-footer button').first()).toHaveCSS('height', '56px')
  await expect(lab.locator('.expression-lab__capture-footer')).toHaveCSS('gap', '12px')
  const note = lab.getByRole('textbox', { name: 'Working note' })
  await expect(note).toHaveCSS('padding', '16px')
  await expect(note).toHaveCSS('border-radius', '12px')
  await note.fill('A coordinated expressive system.')
  await lab.getByRole('button', { name: 'Save note', exact: true }).click()
  await expect(lab.locator('.expression-lab__capture [data-slot="badge"]')).toHaveText('Saved')
  const height = await note.evaluate(element => element.getBoundingClientRect().height)
  await lab.getByRole('button', { name: 'Resize working note' }).press('ArrowDown')
  await expect.poll(() => note.evaluate(element => element.getBoundingClientRect().height)).toBeCloseTo(height + 16)
  const category = lab.getByRole('combobox', { name: 'Category' })
  await expect(category).toHaveCSS('height', '48px')
  await expect(category).toHaveCSS('padding', '4px 16px')
  await category.click()
  const list = page.getByRole('listbox')
  await expect(list).toHaveAttribute('data-expression', 'expressive')
  await expect(list.getByRole('option').first()).toHaveCSS('min-height', '48px')
  await list.getByRole('option', { name: 'Motion', exact: true }).click()
  await expect(category.locator('[data-slot="select-value"]')).toHaveText('Motion')
  await lab.getByRole('button', { name: 'Quick actions', exact: true }).click()
  const menu = page.getByRole('menu')
  await expect(menu).toHaveAttribute('data-expression', 'expressive')
  await expect(menu.getByRole('menuitem').first()).toHaveCSS('min-height', '48px')
  await expect(menu.getByRole('menuitem').first()).toHaveCSS('padding', '4px 16px')
  await menu.press('Escape')
  await lab.getByRole('button', { name: 'Pause session', exact: true }).click()
  await expect(lab.getByRole('button', { name: 'Start session', exact: true })).toBeVisible()
  const prompt = lab.getByRole('textbox', { name: 'Message the design assistant' })
  await prompt.fill('Check the new scale')
  await prompt.press('Enter')
  await expect(lab.getByText('Check the new scale', { exact: true })).toBeVisible()
  await lab.getByRole('button', { name: 'Add to prompt', exact: true }).click()
  await expect(page.getByRole('menu')).toHaveAttribute('data-expression', 'expressive')
  await page.getByRole('menuitemcheckbox', { name: 'Search web' }).click()
  await expect(lab.locator('[data-slot="ai-composer-tool"]')).toContainText('Search web')
  const overflow = await lab.evaluate(root => Array.from(root.querySelectorAll('[data-slot="card"], .expression-lab__chat, [data-slot="ai-composer"], [data-slot="site-header-shell"]')).map(element => ({ slot: element.getAttribute('data-slot'), extra: element.scrollWidth - element.clientWidth })).filter(item => item.extra > 2))
  expect(overflow).toEqual([])
  const smallText = await lab.evaluate(root => Array.from(root.querySelectorAll('*')).filter(element =>
    element.getClientRects().length && !element.closest('[aria-hidden="true"],.sr-only') && Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) && parseFloat(getComputedStyle(element).fontSize) < 14
  ).map(element => ({ text: element.textContent, slot: element.getAttribute('data-slot') })))
  expect(smallText).toEqual([])
  await mode('Original')
  await expect(lab).toHaveAttribute('data-expression', 'baseline')
  await expect(lab.locator('.expression-lab__capture-footer button').first()).toHaveCSS('height', original.height)
  await expect(note).toHaveCSS('padding', original.padding)
  await expect(note).toHaveCSS('border-radius', original.radius)
  await expect(note).toHaveValue('A coordinated expressive system.')
  await expect(lab.locator('#expression-lab-category')).toHaveValue('motion')
  await expect(lab.getByRole('button', { name: 'Resize working note' })).toHaveCount(0)
})

test("expression lab compact dark view and navigation preserve usable bounds", async ({ page }, testInfo) => {
  await page.goto('/#/expression-lab')
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  const lab = page.locator('.expression-lab')
  await page.getByRole('button', { name: 'More experiment tools' }).click()
  await page.getByRole('menuitem', { name: 'Preview size', exact: true }).hover()
  await page.getByRole('menuitemradio', { name: 'Compact', exact: true }).click()
  await expect(page.locator('.form-experiment__viewport')).toHaveAttribute('data-preview-size', 'compact')
  await expect(lab.locator('.expression-lab__capture-footer button').first()).toHaveCSS('height', '56px')
  await expect.poll(() => lab.evaluate(root => Array.from(root.querySelectorAll('[data-slot="card"], [data-slot="choice-card"], [data-slot="ai-composer"], [data-slot="site-header-shell"]')).map(element => ({ slot: element.getAttribute('data-slot'), extra: element.scrollWidth - element.clientWidth })).filter(item => item.extra > 2))).toEqual([])
  if (testInfo.project.name === 'mobile') {
    await lab.locator('.expression-lab__header').getByRole('button', { name: /sidebar/i }).click()
    const panel = page.locator('#expression-lab-panel')
    await expect(panel).toHaveAttribute('data-expression', 'expressive')
    await expect(panel.locator('[data-slot="sidebar-menu-button"]').first()).toHaveCSS('min-height', '48px')
    await expect(panel.locator('[data-slot="sidebar-account"] [data-slot="avatar"]')).toHaveCSS('width', '40px')
    await panel.getByRole('button', { name: 'Notes', exact: true }).click()
    await expect(panel).toBeHidden()
  } else {
    await lab.locator('[data-slot="sidebar-brand"]').getByRole('button', { name: /sidebar/i }).click()
    await expect(lab.locator('[data-slot="sidebar"]')).toHaveAttribute('data-collapsible', 'icon')
    await expect(lab.locator('[data-slot="sidebar-account"] [data-slot="avatar"]')).toHaveCSS('width', '24px')
  }
})

test("concentric textarea has uniform padding and an inset working resize handle", async ({ page }) => {
  await page.goto("/#/concentric")
  const section = page.locator('#concentric-edit-project')
  const slider = section.getByRole('slider')
  await slider.press('End')
  for (let step = 0; step < 8; step++) await slider.press('ArrowLeft')
  const textarea = section.getByRole('textbox', { name: 'Description', exact: true })
  const handle = section.getByRole('button', { name: 'Resize description' })
  await expect(handle.locator('svg')).toHaveCount(0)
  await expect(handle.locator('.resizable-textarea__grip')).toBeVisible()
  await expect(handle.locator('.resizable-textarea__grip')).toHaveCSS('clip-path', 'none')
  const strokes = await handle.locator('.resizable-textarea__grip').evaluate(grip => ['::before', '::after'].map(pseudo => {
    const style = getComputedStyle(grip, pseudo)
    return { width: style.width, height: style.height, transform: style.transform }
  }))
  expect(strokes.map(stroke => stroke.width)).toEqual(['10px', '6px'])
  expect(strokes.every(stroke => stroke.height === '1px' && stroke.transform !== 'none')).toBe(true)
  await expect(textarea).toHaveCSS('padding', '16px')
  await expect(textarea).toHaveCSS('border-radius', '12px')
  await expect(textarea).toHaveCSS('resize', 'none')
  const height = () => textarea.evaluate(element => element.getBoundingClientRect().height)
  const initial = await height()
  const inset = await handle.evaluate(handle => {
    const control = handle.parentElement!.getBoundingClientRect()
    const bounds = handle.getBoundingClientRect()
    return { right: control.right - bounds.right, bottom: control.bottom - bounds.bottom }
  })
  expect(inset.right).toBeCloseTo(4)
  expect(inset.bottom).toBeCloseTo(4)
  await handle.press('ArrowDown')
  await expect.poll(height).toBeCloseTo(initial + 16)
  await handle.press('Home')
  await expect.poll(height).toBeCloseTo(initial)
  await handle.scrollIntoViewIfNeeded()
  const bounds = await handle.boundingBox()
  if (!bounds) throw new Error('Resize handle missing')
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
  await page.mouse.down()
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2 + 64, { steps: 5 })
  await page.mouse.up()
  await expect.poll(height).toBeCloseTo(initial + 64)
  await textarea.fill('A resized description.')
  await expect(textarea).toHaveValue('A resized description.')
  await expect.poll(height).toBeCloseTo(initial + 64)
  await section.getByRole('button', { name: 'Reset example' }).click()
  await expect(textarea).toHaveValue("A shared home for the team's next ideas.")
  await expect(textarea).not.toHaveAttribute('style')
})

test("concentric medium scale has a 14px minimum for specimen text", async ({ page }) => {
  await page.goto("/#/concentric")
  for (const id of ["concentric-type-and-controls", "concentric-vertical-card", "concentric-edit-project"]) {
    const section = page.locator(`#${id}`)
    const slider = section.getByRole("slider")
    await slider.press("End")
    for (let step = 0; step < 8; step++) await slider.press("ArrowLeft")
    const specimen = section.locator('.concentric-card, .concentric-project-card, .concentric-project-form')
    const textPair = specimen.locator(id === "concentric-type-and-controls" ? '.concentric-card__body' : '[data-slot="card-header"]')
    await expect(textPair).toHaveCSS("row-gap", "8px")
    const pairGap = await textPair.evaluate(pair => {
      const title = pair.querySelector('.concentric-card__title, [data-slot="card-title"]')!.getBoundingClientRect()
      const description = pair.querySelector('.concentric-card__description, [data-slot="card-description"]')!.getBoundingClientRect()
      return description.top - title.bottom
    })
    expect(pairGap).toBeCloseTo(8, 0)
    if (id === "concentric-edit-project") {
      await expect(specimen.locator('[data-slot="card-title"]')).toHaveCSS("font-size", "20px")
      await expect(specimen.locator('[data-slot="card-description"]')).toHaveCSS("font-size", "16px")
      await expect(specimen.locator('[data-slot="card-content"]')).toHaveCSS("padding-left", "24px")
      await expect(specimen.locator('[data-slot="field-group"]')).toHaveCSS("gap", "24px")
      await expect(specimen.locator('[data-slot="field-content"]')).toHaveCSS("gap", "8px")
      await expect(specimen.locator('[data-slot="field-description"]')).toHaveCSS("font-size", "14px")
      await expect(specimen.locator('[data-slot="field-description"]')).toHaveCSS("line-height", "20px")
      await expect(specimen.locator('[data-slot="field"][data-orientation="horizontal"]')).toHaveCSS("gap", "12px")
      const notificationGap = await specimen.locator('[data-slot="field-content"]').evaluate(content => {
        const label = content.querySelector('[data-slot="field-label"]')!.getBoundingClientRect()
        const description = content.querySelector('[data-slot="field-description"]')!.getBoundingClientRect()
        return description.top - label.bottom
      })
      expect(notificationGap).toBeCloseTo(8, 0)
      await expect(specimen.locator('[data-slot="input"]')).toHaveCSS("height", "48px")
      for (const slot of ["input", "select-trigger", "textarea"]) {
        await expect(specimen.locator(`[data-slot="${slot}"]`)).toHaveCSS("padding", slot === "textarea" ? "16px" : "4px 16px")
      }
    }
    const action = specimen.locator('.concentric-card__actions [data-slot="button"]').first()
    await expect(action).toHaveCSS("height", "56px")
    await expect(action).toHaveCSS("padding-top", "16px")
    await expect(action).toHaveCSS("padding-bottom", "16px")
    await expect(action).toHaveCSS("padding-left", "24px")
    await expect(action).toHaveCSS("padding-right", "24px")
    await expect(specimen.locator('.concentric-card__actions')).toHaveCSS("gap", "12px")
    await expect(action).toHaveCSS("line-height", "24px")
    await expect(action).toHaveCSS("border-top-width", "0px")
    const outline = await action.evaluate(element => {
      const style = getComputedStyle(element, "::before")
      return { width: style.borderTopWidth, events: style.pointerEvents }
    })
    expect(outline).toEqual({ width: "1px", events: "none" })
    await action.focus()
    await expect(action).toBeFocused()
    await expect(action).not.toHaveCSS("box-shadow", "none")
    const tooSmall = await specimen.evaluate(root => Array.from(root.querySelectorAll('*')).filter(element =>
      !element.closest('[aria-hidden="true"], .sr-only') && element.getClientRects().length &&
      (Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) || element.matches('input,textarea')) &&
      parseFloat(getComputedStyle(element).fontSize) < 14
    ).map(element => element.textContent))
    expect(tooSmall).toEqual([])
    await slider.press("ArrowRight")
    await slider.press("ArrowRight")
    await expect(action).toHaveCSS("padding-left", "25px")
    await expect(action).toHaveCSS("padding-right", "25px")
    await expect(specimen.locator('.concentric-card__actions')).toHaveCSS("gap", "12px")
    await expect(action).toHaveCSS("height", "56px")
    await slider.press("ArrowLeft")
    await slider.press("ArrowLeft")
    if (id === "concentric-vertical-card") {
      await expect(specimen.locator('.concentric-project-card__owner-text')).toHaveCSS("row-gap", "4px")
      await expect(specimen.locator('.concentric-project-card__owner-text')).toHaveCSS("height", "44px")
      await expect(specimen.locator('[data-slot="avatar"]')).toHaveCSS("width", "40px")
      await expect(specimen.locator('[data-slot="avatar"]')).toHaveCSS("height", "40px")
      await expect(specimen.locator('.concentric-project-card__owner')).toHaveCSS("gap", "12px")
      const ownerGeometry = await specimen.locator('.concentric-project-card__owner').evaluate(owner => {
        const avatar = owner.children[0].getBoundingClientRect()
        const text = owner.children[1].getBoundingClientRect()
        return { gap: text.left - avatar.right, centerDelta: (text.top + text.bottom - avatar.top - avatar.bottom) / 2 }
      })
      expect(ownerGeometry.gap).toBeCloseTo(12, 0)
      expect(Math.abs(ownerGeometry.centerDelta)).toBeLessThan(1)
      await expect(specimen.locator('[data-slot="badge"]')).toHaveCSS("font-size", "14px")
      await expect(specimen.locator('[data-slot="badge"]')).toHaveCSS("min-height", "24px")
      await expect(specimen.locator('.concentric-project-card__owner')).toHaveCSS("font-size", "14px")
      await expect(specimen.locator('.concentric-project-card__status')).toHaveCSS("font-size", "14px")
    }
  }
})

test("concentric card and form measure padding and major gaps", async ({ page }) => {
  await page.goto("/#/concentric")
  for (const id of ["concentric-vertical-card", "concentric-edit-project"]) {
    const section = page.locator(`#${id}`)
    const toggle = section.getByRole("checkbox", { name: "Show annotations" })
    const padding = section.getByRole("button", { name: "Content padding left", exact: true, includeHidden: true })
    await expect(padding).toBeHidden()
    const slider = section.getByRole("slider")
    await slider.press("Home")
    await toggle.click()
    await expect(padding).toBeVisible()
    await expect(section.getByLabel("Measurement legend")).toBeVisible()
    for (const label of ["Header padding left", "Header padding right", "Content padding right", "Footer padding bottom", "Footer padding left", "Card sections gap 1", "Card sections gap 2"]) {
      await expect(section.getByRole("button", { name: label, exact: true })).toBeVisible()
    }
    if (id === "concentric-vertical-card") {
      await expect(section.getByRole("button", { name: "Card sections gap 3", exact: true })).toBeVisible()
    } else {
      await expect(section.getByRole("button", { name: "Card sections padding top", exact: true })).toBeVisible()
      for (let index = 1; index <= 3; index++) {
        await expect(section.getByRole("button", { name: `Fields gap ${index}`, exact: true })).toBeVisible()
      }
    }
    const gap = section.getByRole("button", { name: id === "concentric-edit-project" ? "Fields gap 1" : "Card sections gap 1", exact: true })
    for (const [targetRadius, expected] of [[24, 12], [40, 20]]) {
      if (targetRadius === 40) for (let step = 0; step < 16; step++) await slider.press("ArrowRight")
      await expect.poll(() => padding.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(expected, 0)
      await expect.poll(() => gap.evaluate(element => element.getBoundingClientRect().height)).toBeCloseTo(expected, 0)
      await padding.click()
      await expect(padding).toHaveAttribute("aria-pressed", "true")
      await expect(section.locator('[data-callout-id] [data-slot="annotation-dimensions"]')).toHaveText(new RegExp(`^${expected} \\D+ \\d+(?:\\.\\d+)? px$`))
      await gap.click()
      await expect(gap).toHaveAttribute("aria-pressed", "true")
      await expect(section.locator('[data-callout-id] [data-slot="annotation-dimensions"]')).toContainText(`${expected} px`)
      await gap.press("Escape")
    }
    await toggle.click()
    await expect(padding).toBeHidden()
    await expect(section.locator('[data-slot="annotation-dimensions"]')).toHaveCount(0)
    await expect(section.locator('[role="status"].sr-only')).toHaveCount(0)
  }
})

test("concentric specimens share continuous geometry between scale stops", async ({ page }) => {
  await page.goto("/#/concentric")
  for (const id of ["concentric-type-and-controls", "concentric-vertical-card", "concentric-edit-project"]) {
    const section = page.locator(`#${id}`)
    const slider = section.getByRole("slider")
    const horizontal = id === "concentric-type-and-controls"
    const surface = section.locator(horizontal ? ".concentric-card" : id === "concentric-vertical-card" ? ".concentric-project-card" : ".concentric-project-form")
    let radius = 24
    await slider.press("Home")
    await slider.press("ArrowLeft")
    await expect(slider).toHaveAttribute("aria-valuemin", "24")
    await expect(slider).toHaveAttribute("aria-valuenow", "24")
    for (const target of [24, 26, 30, 32, 34, 38, 40, 42, 46, 48, 52, 56, 24]) {
      while (radius !== target) {
        await slider.press(radius < target ? "ArrowRight" : "ArrowLeft")
        radius += radius < target ? 1 : -1
      }
      const inset = target / 2
      const corner = horizontal ? target : 14 + target - 20
      const height = target < 48 ? 32 : target < 56 ? 56 : 48
      await expect(surface).toHaveCSS("border-top-left-radius", `${corner}px`)
      await expect(horizontal ? surface : surface.locator('[data-slot="card-content"]')).toHaveCSS("padding-left", `${inset}px`)
      if (!horizontal) {
        await expect(surface).toHaveCSS("row-gap", `${inset}px`)
        for (const slot of ["card-header", "card-content", "card-footer"]) {
          await expect(surface.locator(`[data-slot="${slot}"]`)).toHaveCSS("padding-left", `${inset}px`)
          await expect(surface.locator(`[data-slot="${slot}"]`)).toHaveCSS("padding-right", `${inset}px`)
        }
        await expect(surface.locator('[data-slot="card-footer"]')).toHaveCSS("gap", `${target >= 48 && target < 56 ? 12 : 8}px`)
        await expect(surface.locator('[data-slot="card-header"]')).toHaveCSS("gap", "8px")
      }
      const button = surface.locator(horizontal ? '.concentric-card__actions button' : '[data-slot="card-footer"] button').first()
      await expect(button).toHaveCSS("height", `${height}px`)
      await expect(button).toHaveCSS("border-top-left-radius", `${target / 2}px`)
      if (id === "concentric-edit-project") {
        for (const slot of ["input", "textarea", "select-trigger"]) {
          await expect(surface.locator(`[data-slot="${slot}"]`)).toHaveCSS("border-radius", "12px")
        }
        await expect(surface.locator('[data-slot="field-group"]')).toHaveCSS("gap", `${inset}px`)
      }
      expect(await surface.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    }
  }
})

test("concentric cards preserve component styling with shared experimental spacing", async ({ page }) => {
  async function cardStyles(card: Locator) {
    return card.evaluate(card => {
      const read = (element: Element, properties: string[]) => Object.fromEntries(properties.map(property => [property, getComputedStyle(element).getPropertyValue(property)]))
      const parts = ["card-header", "card-content", "card-footer", "card-title", "card-description"]
      return Object.fromEntries(parts.map(slot => [slot, read(card.querySelector(`[data-slot="${slot}"]`)!, ["row-gap", "font-size", "line-height", "font-weight", "border-top-width", "background-color"])]))
    })
  }
  await page.goto("/#/card")
  const reference = page.locator('#card-default [data-slot="canvas"] [data-slot="card"]').first()
  const expected = await cardStyles(reference)
  const inputExpected = await reference.locator('input').first().evaluate(input => {
    const style = getComputedStyle(input)
    return { height: style.height, padding: style.padding, radius: style.borderRadius, font: style.fontSize }
  })
  await page.goto("/#/concentric")
  for (const selector of [".concentric-project-card", ".concentric-project-form"]) {
    const card = page.locator(selector)
    expect(await cardStyles(card)).toEqual(expected)
    await expect(card).toHaveCSS("row-gap", "12px")
    await expect(card).toHaveCSS("border-top-left-radius", "18px")
  }
  const input = page.locator('.concentric-project-form input').first()
  expect(await input.evaluate(input => {
    const style = getComputedStyle(input)
    return { height: style.height, padding: style.padding, radius: style.borderRadius, font: style.fontSize }
  })).toEqual({ ...inputExpected, radius: "12px" })
  await expect(page.locator('.concentric-project-form [data-slot="field-group"]')).toHaveCSS("gap", "12px")
  await expect(page.locator('.concentric-project-form [data-slot="field"]').first()).toHaveCSS("gap", "8px")
  await page.evaluate(() => document.documentElement.style.setProperty("--card-spacing-default", "28px"))
  for (const selector of [".concentric-project-card", ".concentric-project-form"]) {
    await expect(page.locator(`${selector} [data-slot="card-content"]`)).toHaveCSS("padding-left", "12px")
  }
  await page.evaluate(() => document.documentElement.style.removeProperty("--card-spacing-default"))
})

test("concentric preserves horizontal variants alongside the vertical card", async ({ page }) => {
  await page.goto("/#/concentric")
  const sections = page.locator("section.showcase-example")
  await expect(sections.locator(".showcase-example__title")).toHaveText(["Space and Shape", "Type and Controls", "Vertical Card", "Edit Project"])
  const shape = page.locator("#concentric-space-and-shape")
  const type = page.locator("#concentric-type-and-controls")
  await expect(shape.locator(".concentric-card__title")).toHaveCSS("font-size", "16px")
  await expect(type.locator(".concentric-card__title")).toHaveCSS("font-size", "16px")
  await expect(type.locator(".concentric-card__description")).toHaveCSS("font-size", "14px")
  await expect(shape.locator('.concentric-card__actions button').first()).toHaveCSS("height", "40px")
  await expect(type.locator('.concentric-card__actions button').first()).toHaveCSS("height", "40px")
  for (const section of [shape, type]) {
    await expect(section.locator(".concentric-card__actions")).toHaveCSS("gap", "8px")
    await expect(section.locator('[data-slot="canvas"]')).toHaveCount(1)
    const geometry = await section.locator(".concentric-card").evaluate(card => {
      const media = card.querySelector(".concentric-card__media")!.getBoundingClientRect()
      const body = card.querySelector(".concentric-card__body")!.getBoundingClientRect()
      return { overflow: card.scrollWidth - card.clientWidth, mediaRatio: media.width / media.height, bodyWidth: body.width }
    })
    expect(geometry.overflow).toBeLessThanOrEqual(1)
    expect(geometry.mediaRatio).toBeCloseTo(1)
    expect(geometry.bodyWidth).toBeGreaterThan(0)
    await section.getByRole("tab", { name: "Code", exact: true }).click()
    await expect(section.locator("code")).toContainText("function ConcentricSpecimen")
    await section.getByRole("tab", { name: "Preview", exact: true }).click()
  }
  await type.getByRole("slider").press("End")
  await expect(type.getByRole("slider")).toHaveAttribute("aria-valuenow", "56")
  await expect(shape.getByRole("slider")).toHaveAttribute("aria-valuenow", "24")
  await expect.poll(() => type.locator(".concentric-card").evaluate(card => card.scrollWidth - card.clientWidth)).toBeLessThanOrEqual(1)
  await type.getByRole("button", { name: "Reset example" }).click()
  await expect(type.getByRole("slider")).toHaveAttribute("aria-valuenow", "24")
})

test("concentric edit project is inline, adaptive, and saves or discards valid drafts", async ({ page }) => {
  await page.goto("/#/concentric")
  const section = page.locator("#concentric-edit-project")
  const form = section.getByRole("form", { name: "Edit project" })
  const name = form.getByRole("textbox", { name: "Project name" })
  const slider = section.getByRole("slider")
  const status = form.getByRole("combobox", { name: "Status", exact: true })
  const notifications = form.getByRole("switch", { name: "Notifications" })
  await expect(form).toBeVisible()
  await expect(page.locator('[data-slot="dialog-overlay"]')).toHaveCount(0)
  await expect(section.getByRole("checkbox", { name: "Show grid" })).not.toBeChecked()
  await expect(section.getByRole("checkbox", { name: "Show annotations" })).not.toBeChecked()
  let radius = 24
  for (const [target, scale, height] of [[40, "normal", 32], [48, "medium", 48], [56, "large", 48]] as const) {
    while (radius < target) { await slider.press("ArrowRight"); radius++ }
    await expect(name).toHaveCSS("height", `${height}px`)
    await expect(status).toHaveCSS("height", `${height}px`)
    await expect(form.getByRole("button", { name: "Save changes" })).toHaveCSS("height", `${scale === "medium" ? 56 : scale === "normal" ? 40 : height}px`)
    expect(await form.evaluate(form => form.scrollWidth - form.clientWidth)).toBeLessThanOrEqual(1)
    await status.click()
    const list = page.getByRole("listbox")
    await expect(list).toHaveAttribute("data-scale", scale)
    if (scale !== "normal") await expect(list.getByRole("option").first()).toHaveCSS("min-height", `${height}px`)
    if (scale === "medium") {
      await expect(list.getByRole("option").first()).toHaveCSS("padding-top", "4px")
      await expect(list.getByRole("option").first()).toHaveCSS("padding-left", "16px")
      await expect(list.locator('[data-radix-select-viewport]')).toHaveCSS("padding", "8px")
    }
    await list.getByRole("option", { name: "Planning", exact: true }).click()
    await expect(status).toContainText("Planning")
    await expect(status).toBeFocused()
    await expect(notifications).toBeChecked()
    await notifications.click()
    await expect(notifications).not.toBeChecked()
    const unchecked = await notifications.locator('[data-slot="switch-thumb"]').boundingBox()
    await notifications.click()
    await expect(notifications).toBeChecked()
    if (scale !== "normal") await expect.poll(() => notifications.evaluate(track => {
      const thumb = track.querySelector('[data-slot="switch-thumb"]')!.getBoundingClientRect()
      const bounds = track.getBoundingClientRect()
      return Math.abs(bounds.right - thumb.right - 2)
    })).toBeLessThan(1)
    expect(unchecked).not.toBeNull()
  }
  await name.fill("   ")
  await form.getByRole("button", { name: "Save changes" }).click()
  await expect(form.getByText("Enter a project name.", { exact: true })).toBeVisible()
  await expect(name).toBeFocused()
  await expect(name).toHaveAttribute("aria-invalid", "true")
  await name.fill("Design workspace")
  await form.getByRole("textbox", { name: "Description" }).fill("Ready for review.")
  await notifications.click()
  await form.getByRole("button", { name: "Save changes" }).click()
  await expect(form.getByRole("status")).toHaveText("Changes saved")
  await expect(form).toBeVisible()
  await name.fill("Unsaved name")
  await status.click()
  await page.getByRole("option", { name: "Complete", exact: true }).click()
  await notifications.click()
  await form.getByRole("button", { name: "Cancel" }).click()
  await expect(name).toHaveValue("Design workspace")
  await expect(status).toContainText("Planning")
  await expect(notifications).not.toBeChecked()
  await expect(form.getByRole("status")).toHaveText("Unsaved changes discarded")
  await section.getByRole("button", { name: "Reset example" }).click()
  await expect(name).toHaveValue("Studio workspace")
  await expect(status).toContainText("In progress")
  await expect(notifications).toBeChecked()
  await expect(slider).toHaveAttribute("aria-valuenow", "24")
  await section.getByRole("tab", { name: "Code", exact: true }).click()
  await expect(section.locator("code")).toContainText("function ConcentricProjectForm")
})

test("concentric vertical card shares scale with its portaled menu and supports project actions", async ({ page }) => {
  await page.goto("/#/concentric")
  const section = page.locator("#concentric-vertical-card")
  const card = section.locator('.concentric-project-card[data-slot="card"]')
  const slider = section.getByRole("slider")
  const trigger = section.getByRole("button", { name: "Project options" })
  await expect(card).toHaveCount(1)
  for (const slot of ["card-header", "card-content", "card-footer", "card-title", "card-description", "card-media"]) {
    await expect(card.locator(`[data-slot="${slot}"]`)).toHaveCount(1)
  }
  await expect(section.getByRole("checkbox", { name: "Show grid" })).not.toBeChecked()
  await expect(section.getByRole("checkbox", { name: "Show annotations" })).not.toBeChecked()
  await expect.poll(() => card.locator('[data-slot="card-media"] img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  let radius = 24
  for (const [target, scale, rowHeight, fontSize] of [[24, "normal", 32, 14], [40, "normal", 32, 14], [48, "medium", 40, 16], [56, "large", 48, 18]] as const) {
    while (radius < target) {
      await slider.press("ArrowRight")
      radius++
    }
    await expect(card.locator('[data-slot="card-footer"] button').first()).toHaveCSS("height", `${scale === "medium" ? 56 : rowHeight}px`)
    await expect(card.locator('[data-slot="card-header"]')).toHaveCSS("row-gap", "8px")
    const headerGeometry = await card.evaluate(card => {
      const title = card.querySelector('[data-slot="card-title"]')!.getBoundingClientRect()
      const action = card.querySelector('[data-slot="card-action"]')!.getBoundingClientRect()
      const description = card.querySelector('[data-slot="card-description"]')!.getBoundingClientRect()
      const owner = card.querySelector('[data-annotate="owner"]')!
      return { centerDelta: (action.top + action.bottom - title.top - title.bottom) / 2,
        gap: description.top - title.bottom, descriptionRight: description.right - action.right,
        updateWithOwner: owner.contains(card.querySelector('[role="status"]')) }
    })
    expect(Math.abs(headerGeometry.centerDelta)).toBeLessThan(1)
    expect(headerGeometry.gap).toBeCloseTo(scale === "normal" ? 10 : 8, 0)
    expect(Math.abs(headerGeometry.descriptionRight)).toBeLessThan(1)
    expect(headerGeometry.updateWithOwner).toBe(true)
    const geometry = await card.evaluate(card => {
      const bounds = card.getBoundingClientRect()
      const media = card.querySelector('[data-slot="card-media"]')!.getBoundingClientRect()
      return { overflow: card.scrollWidth - card.clientWidth, mediaRatio: media.width / media.height, insetDelta: (media.left - bounds.left) - (media.top - bounds.top) }
    })
    expect(geometry.overflow).toBeLessThanOrEqual(1)
    expect(geometry.mediaRatio).toBeCloseTo(16 / 9, 1)
    expect(Math.abs(geometry.insetDelta)).toBeLessThan(1)
    await trigger.click()
    const menu = page.getByRole("menu")
    await expect(menu).toBeVisible()
    await expect(menu).toHaveAttribute("data-scale", scale)
    if (scale !== "normal") await expect(menu.getByRole("menuitem").first()).toHaveCSS("min-height", `${scale === "medium" ? 48 : rowHeight}px`)
    if (scale === "medium") await expect(menu.getByRole("menuitem").first()).toHaveCSS("padding", "4px 16px")
    await expect(menu.getByRole("menuitem").first()).toHaveCSS("font-size", `${fontSize}px`)
    const bounds = await menu.evaluate(menu => {
      const rect = menu.getBoundingClientRect()
      const item = menu.querySelector('[data-slot="dropdown-menu-item"]')!
      const padding = parseFloat(getComputedStyle(item.parentElement!).paddingLeft)
      return { inViewport: rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight,
        nested: !!menu.closest('.concentric-project-card'), radiusDifference: parseFloat(getComputedStyle(menu).borderTopLeftRadius) - parseFloat(getComputedStyle(item).borderTopLeftRadius) - padding }
    })
    expect(bounds.inViewport).toBe(true)
    expect(bounds.nested).toBe(false)
    if (scale !== "normal") expect(Math.abs(bounds.radiusDifference)).toBeLessThan(1)
    await menu.press("Escape")
    await expect(trigger).toBeFocused()
  }
  await trigger.click()
  await page.getByRole("menuitem", { name: "Pin project", exact: true }).click()
  await expect(card.getByText("Pinned", { exact: true })).toBeVisible()
  await trigger.press("Enter")
  await page.getByRole("menuitem", { name: "Archive project", exact: true }).click()
  await expect(card.getByText("Archived", { exact: true })).toBeVisible()
  await trigger.click()
  await page.getByRole("menuitem", { name: "Restore project", exact: true }).click()
  await expect(card.getByText("In progress", { exact: true })).toBeVisible()
  await trigger.click()
  await page.getByRole("menuitem", { name: "Duplicate project", exact: true }).click()
  await expect(card.locator('[data-slot="card-title"]')).toHaveText("Studio workspace (copy 1)")
  await expect(card.getByText("Pinned", { exact: true })).toHaveCount(0)
  await card.getByRole("button", { name: "Follow", exact: true }).click()
  await expect(card.getByRole("button", { name: "Following", exact: true })).toHaveAttribute("aria-pressed", "true")
  await card.getByRole("button", { name: "Open project", exact: true }).click()
  await expect(card.getByText("Next milestone", { exact: true })).toBeVisible()
  await section.getByRole("checkbox", { name: "Show annotations" }).click()
  await expect(section.locator('[data-callout-id="outer"]')).toBeVisible()
  await section.getByRole("button", { name: "Reset example" }).click()
  await expect(card.locator('[data-slot="card-title"]')).toHaveText("Studio workspace")
  await expect(slider).toHaveAttribute("aria-valuenow", "24")
  await expect(card.getByText("Next milestone", { exact: true })).toHaveCount(0)
  await section.getByRole("tab", { name: "Code", exact: true }).click()
  await expect(section.locator("code")).toContainText("function ConcentricProjectCard")
})

test("concentric type and controls adapt at padding boundaries in both directions", async ({ page }) => {
  await page.goto("/#/concentric")
  const section = page.locator("#concentric-type-and-controls")
  const slider = section.getByRole("slider")
  let radius = 24
  for (const [target, scale, title, copy, buttonHeight, mediaSize, iconSize] of [
    [24, "normal", 16, 14, 40, 64, 24],
    [31, "normal", 16, 14, 40, 64, 24],
    [32, "normal", 16, 14, 40, 64, 24],
    [39, "normal", 16, 14, 40, 64, 24],
    [40, "normal", 16, 14, 40, 64, 24],
    [47, "normal", 16, 14, 40, 64, 24],
    [48, "medium", 20, 16, 56, 80, 28],
    [55, "medium", 20, 16, 56, 80, 28],
    [56, "large", 24, 18, 48, 96, 32],
    [55, "medium", 20, 16, 56, 80, 28],
    [39, "normal", 16, 14, 40, 64, 24],
    [24, "normal", 16, 14, 40, 64, 24],
  ] as const) {
    while (radius !== target) {
      await slider.press(radius < target ? "ArrowRight" : "ArrowLeft")
      radius += radius < target ? 1 : -1
    }
    await expect(section.locator(".concentric-demo")).toHaveAttribute("data-scale", scale)
    await expect(section.locator(".concentric-card__body")).toHaveCSS("row-gap", scale === "medium" ? "8px" : "4px")
    await expect(section.locator(".concentric-card__title")).toHaveCSS("font-size", `${title}px`)
    await expect(section.locator(".concentric-card__description")).toHaveCSS("font-size", `${copy}px`)
    await expect(section.locator(".concentric-card__actions button").first()).toHaveCSS("height", `${buttonHeight}px`)
    await expect(section.locator(".concentric-card__actions button").first()).toHaveCSS("font-size", `${copy}px`)
    await expect(section.locator(".concentric-card__media")).toHaveCSS("width", `${mediaSize}px`)
    await expect(section.locator(".concentric-card__media")).toHaveCSS("height", `${mediaSize}px`)
    await expect(section.locator(".concentric-card__media svg")).toHaveCSS("width", `${iconSize}px`)
    await expect(section.locator(".concentric-card__actions")).toHaveCSS("gap", `${scale === "medium" ? 12 : 8}px`)
    await expect.poll(() => section.locator(".concentric-card").evaluate(card => card.scrollWidth - card.clientWidth)).toBeLessThanOrEqual(1)
  }
  const shape = page.locator("#concentric-space-and-shape")
  await shape.getByRole("slider").press("End")
  await expect(shape.locator(".concentric-card__title")).toHaveCSS("font-size", "16px")
  await expect(shape.locator(".concentric-card__media")).toHaveCSS("width", "64px")
  await expect(shape.locator(".concentric-card__actions button").first()).toHaveCSS("height", "40px")
  await section.getByRole("button", { name: "Reset example" }).click()
  await expect(section.locator(".concentric-demo")).toHaveAttribute("data-scale", "normal")
})

test("concentric magnetically snaps to padding grid values", async ({ page }) => {
  await page.goto("/#/concentric")
  const root = page.locator('#concentric-space-and-shape .concentric-toolbar [data-slot="slider"]')
  const thumb = root.getByRole("slider", { name: "Corner radius" })
  await expect(root).toHaveAttribute("data-snap-mode", "magnetic")
  await expect(root.locator('[data-slot="slider-stop"]')).toHaveCount(3)
  for (const [requestedRadius, expectedRadius, expectedPadding] of [[39, 40, 20], [47, 48, 24], [55, 56, 28], [43, 43, 21.5]]) {
    await root.scrollIntoViewIfNeeded()
    const bounds = await root.boundingBox()
    if (!bounds) throw new Error("Slider has no bounds")
    await page.mouse.click(bounds.x + bounds.width * (requestedRadius - 24) / 32, bounds.y + bounds.height / 2)
    await expect(thumb).toHaveAttribute("aria-valuenow", String(expectedRadius))
    await expect(page.locator('#concentric-space-and-shape .concentric-equation__term').last()).toHaveText(`padding ${expectedPadding}`)
  }
})

test("concentric button spacing stays fixed without a gap annotation", async ({ page }) => {
  await page.goto("/#/concentric")
  const section = page.locator("#concentric-space-and-shape")
  const actions = section.locator(".concentric-card__actions")
  const slider = section.getByRole("slider", { name: "Corner radius" })
  for (const key of [null, "End", "Home"]) {
    if (key) await slider.press(key)
    await expect(actions).toHaveCSS("column-gap", "8px")
    await expect(actions.locator(":scope > *")).toHaveCount(2)
    const gap = await actions.evaluate(actions => {
      const [first, second] = Array.from(actions.children).map(child => child.getBoundingClientRect())
      return second.left - first.right
    })
    expect(gap).toBeCloseTo(8, 0)
  }
  await expect(page.locator('[data-annotate="gap-buttons"], [data-callout-id="gap-buttons"]')).toHaveCount(0)
  await expect(section.locator('[data-annotate="gap-media-text"], [data-annotate="gap-text-actions"]')).toHaveCount(2)
})

test("concentric uses the shared toolbar title and fills the slider row", async ({ page }, testInfo) => {
  if (testInfo.project.name === "desktop") await page.setViewportSize({ width: 1600, height: 1000 })
  await page.goto("/#/concentric")
  const toolbar = page.locator("#concentric-space-and-shape").getByRole("toolbar", { name: "Concentric controls" })
  const title = toolbar.locator('[data-slot="toolbar-title"]')
  await expect(title).toHaveText("Corner radius")
  await expect(title).toHaveCSS("padding-left", "8px")
  const geometry = await toolbar.evaluate(toolbar => {
    const group = toolbar.querySelector('[data-slot="toolbar-group"]')!.getBoundingClientRect()
    const slider = toolbar.querySelector('[data-slot="slider"]')!.getBoundingClientRect()
    return { endGap: group.right - slider.right, overflow: toolbar.scrollWidth - toolbar.clientWidth, width: slider.width }
  })
  expect(Math.abs(geometry.endGap)).toBeLessThan(1)
  expect(geometry.overflow).toBeLessThanOrEqual(1)
  if (testInfo.project.name === "desktop") expect(geometry.width).toBeGreaterThan(448)
  await toolbar.evaluate(toolbar => (toolbar as HTMLElement).style.setProperty("--toolbar-title-padding-start", "calc(var(--spacing) * 4)"))
  await expect(title).toHaveCSS("padding-left", "16px")
  await toolbar.evaluate(toolbar => (toolbar as HTMLElement).style.removeProperty("--toolbar-title-padding-start"))
  const slider = toolbar.getByRole("slider", { name: "Corner radius" })
  await slider.press("ArrowRight")
  await expect(slider).toHaveAttribute("aria-valuenow", "25")
})

test("slider magnetic and discrete snapping preserve pointer and keyboard interaction", async ({ page }) => {
  await page.goto("/#/slider")
  const magnetic = page.locator("#slider-magnetic-snapping")
  const discrete = page.locator("#slider-discrete-snapping")
  const magneticThumb = magnetic.getByRole("slider", { name: "Magnetic level" })
  const discreteThumb = discrete.getByRole("slider", { name: "Discrete level" })
  await expect(magnetic.locator('[data-slot="slider-stop"]')).toHaveCount(3)
  await expect(discrete.locator('[data-slot="slider-stop"]')).toHaveCount(5)

  async function pointAt(section: Locator, fraction: number) {
    const root = section.locator('[data-slot="slider"]')
    await root.scrollIntoViewIfNeeded()
    const bounds = await root.boundingBox()
    if (!bounds) throw new Error("Slider has no bounds")
    await page.mouse.move(bounds.x + bounds.width * fraction, bounds.y + bounds.height / 2)
  }

  await pointAt(magnetic, 0.48)
  await page.mouse.down()
  await expect(magneticThumb).toHaveAttribute("aria-valuenow", "50")
  await pointAt(magnetic, 0.52)
  await expect(magneticThumb).toHaveAttribute("aria-valuenow", "50")
  await pointAt(magnetic, 0.56)
  await expect(magneticThumb).toHaveAttribute("aria-valuenow", "56")
  await page.mouse.up()
  await pointAt(magnetic, 0.48)
  await page.mouse.down()
  await page.mouse.up()
  await expect(magneticThumb).toHaveAttribute("aria-valuenow", "50")
  await magneticThumb.press("ArrowRight")
  await expect(magneticThumb).toHaveAttribute("aria-valuenow", "51")
  await expect(magnetic.locator("output")).toHaveText("51")

  await pointAt(discrete, 0.67)
  await page.mouse.down()
  await page.mouse.up()
  await expect(discreteThumb).toHaveAttribute("aria-valuenow", "50")
  await discreteThumb.press("ArrowRight")
  await expect(discreteThumb).toHaveAttribute("aria-valuenow", "85")
  const alignment = await discrete.locator('[data-slot="slider"]').evaluate(root => {
    const stop = root.querySelector('[data-slot="slider-stop"][data-value="85"]')!.getBoundingClientRect()
    const thumb = root.querySelector('[data-slot="slider-thumb"]')!.getBoundingClientRect()
    return Math.abs((stop.left + stop.right - thumb.left - thumb.right) / 2)
  })
  expect(alignment).toBeLessThan(1)
  await discreteThumb.press("ArrowLeft")
  await expect(discreteThumb).toHaveAttribute("aria-valuenow", "50")
  await discreteThumb.press("End")
  await expect(discreteThumb).toHaveAttribute("aria-valuenow", "100")
  await discreteThumb.press("Home")
  await expect(discreteThumb).toHaveAttribute("aria-valuenow", "0")
  await discrete.getByRole("button", { name: "Reset example" }).click()
  await expect(discreteThumb).toHaveAttribute("aria-valuenow", "20")
  await expect(page.locator('#slider-disabled [data-slot="slider"]')).toHaveAttribute("aria-disabled", "true")
})

test("preview frames align controls and canvas across pages", async ({ page }, testInfo) => {
  if (testInfo.project.name === "desktop") await page.setViewportSize({ width: 1600, height: 1000 })
  for (const route of ["concentric", "canvas", "annotation", "toolbar", "checkbox", "block-ai-chat"]) {
    await page.goto(`/#/${route}`)
    const section = route === "concentric" ? page.locator("#concentric-space-and-shape") : page.locator("section.showcase-example").first()
    await expect(section.locator('[data-slot="canvas"]').first()).toBeVisible()
    const geometry = await section.evaluate(section => {
      const canvas = section.querySelector<HTMLElement>('[data-slot="canvas"]')!
      const controls = section.querySelector<HTMLElement>(".canvas-toolbar")!
      const bounds = section.getBoundingClientRect()
      const canvasBounds = canvas.getBoundingClientRect()
      const controlsBounds = controls.getBoundingClientRect()
      return {
        left: canvasBounds.left - bounds.left,
        right: canvasBounds.right - bounds.right,
        controlsLeft: controlsBounds.left - bounds.left,
        controlsRight: controlsBounds.right - bounds.right,
        gap: canvasBounds.top - controlsBounds.bottom,
        outside: !canvas.contains(controls),
        overflow: controls.scrollWidth - controls.clientWidth,
      }
    })
    expect(Math.abs(geometry.left), route).toBeLessThan(1)
    expect(Math.abs(geometry.right), route).toBeLessThan(1)
    expect(Math.abs(geometry.controlsLeft), route).toBeLessThan(1)
    expect(Math.abs(geometry.controlsRight), route).toBeLessThan(1)
    expect(geometry.gap, route).toBeCloseTo(24, 0)
    expect(geometry.outside, route).toBe(true)
    expect(geometry.overflow, route).toBeLessThanOrEqual(1)
    if (route === "concentric") {
      const centered = await section.evaluate(section => {
        const canvas = section.querySelector('[data-slot="canvas"]')!.getBoundingClientRect()
        const card = section.querySelector('.concentric-card')!.getBoundingClientRect()
        const footer = section.querySelector('[data-slot="canvas-footer"]')!.getBoundingClientRect()
        return { horizontal: (card.left + card.right - canvas.left - canvas.right) / 2,
          vertical: (card.top + card.bottom - canvas.top - canvas.bottom) / 2,
          footerGap: footer.top - canvas.bottom }
      })
      expect(Math.abs(centered.horizontal)).toBeLessThan(1)
      expect(Math.abs(centered.vertical)).toBeLessThan(1)
      expect(centered.footerGap).toBeCloseTo(12, 0)
    }
  }
})

test("grid background stays below ordinary content without trapping the cursor", async ({ page }) => {
  await page.goto("/#/checkbox")
  const section = page.locator("#checkbox-group")
  const canvas = section.locator('[data-slot="canvas"]')
  const grid = canvas.locator('[data-slot="canvas-grid"]')
  const cursor = canvas.locator(":scope > .canvas-measure__cursor")
  const toggle = section.getByRole("checkbox", { name: "Grid", exact: true })
  await toggle.click()
  await expect(canvas).toHaveCSS("isolation", "isolate")
  await expect(grid).toHaveCSS("z-index", "-1")
  await expect(cursor).toHaveCount(1)
  await expect(cursor).toHaveCSS("pointer-events", "none")
  await expect(cursor).toBeVisible()
  const text = canvas.locator('[data-slot="checkbox-group-text"]').first()
  await expect(text).toBeVisible()
  await text.click()
  await expect(canvas.getByRole("checkbox", { name: "Email", exact: true }).first()).not.toBeChecked()
  await toggle.click()
  await expect(grid).toBeHidden()
  await expect(cursor).toBeHidden()
  await expect(text).toBeVisible()
})

for (const control of [
  { route: "checkbox", slot: "checkbox-group", role: "checkbox" as const, label: "SMS" },
  { route: "radio-group", slot: "radio-group", role: "radio" as const, label: "Compact" },
  { route: "switch", slot: "switch-group", role: "switch" as const, label: "Bluetooth" },
]) {
  test(`${control.route} labeled options share padded text spacing`, async ({ page }) => {
    await page.goto(`/#/${control.route}`)
    const section = page.locator(`#${control.route}-group [data-slot="canvas"]`)
    const horizontal = section.locator(`[data-slot="${control.slot}"][data-orientation="horizontal"]`)
    const vertical = section.locator(`[data-slot="${control.slot}"][data-orientation="vertical"]`)
    await expect(horizontal).toBeVisible()
    await expect(horizontal).toHaveCSS("column-gap", "0px")
    for (const group of [horizontal, vertical]) {
      const texts = group.locator(`[data-slot="${control.slot}-text"]`)
      await expect(texts).toHaveCount(3)
      for (const text of await texts.all()) await expect(text).toHaveCSS("padding-right", "12px")
      await expect(group.locator("label").first()).toHaveCSS("gap", "8px")
    }
    await horizontal.locator(`[data-slot="${control.slot}-text"]`).filter({ hasText: control.label }).click()
    await expect(horizontal.getByRole(control.role, { name: control.label, exact: true })).toBeChecked()
    await expect(vertical.getByRole(control.role, { name: control.label, exact: true })).not.toBeChecked()
    const defaultTexts = page.locator(`#${control.route}-default [data-slot="canvas"] [data-slot="${control.slot}-text"]`)
    expect(await defaultTexts.count()).toBeGreaterThan(0)
    for (const text of await defaultTexts.all()) await expect(text).toHaveCSS("padding-right", "12px")
    const disabled = page.locator(`#${control.route}-disabled [data-slot="canvas"]`).getByRole(control.role)
    for (const item of await disabled.all()) await expect(item).toBeDisabled()
    if (control.role === "radio") {
      await expect(horizontal.getByRole("radio", { checked: true })).toHaveCount(1)
      await vertical.getByRole("radio", { name: "Default", exact: true }).focus()
      await vertical.getByRole("radio", { name: "Default", exact: true }).press("Space")
      await expect(vertical.getByRole("radio", { name: "Default", exact: true })).toBeChecked()
    } else {
      const selected = horizontal.getByRole(control.role, { name: control.label, exact: true })
      await selected.press("Space")
      await expect(selected).not.toBeChecked()
    }
  })
}

async function expectSharedDisplayOptions(section: Locator) {
  const group = section.locator('[data-slot="checkbox-group"]')
  await expect(group).toHaveCount(1)
  await expect(group).toHaveAttribute("data-orientation", "horizontal")
  await expect(group).toHaveCSS("column-gap", "0px")
  const texts = group.locator('[data-slot="checkbox-group-text"]')
  await expect(texts).toHaveCount(2)
  await expect(texts.nth(0)).toHaveCSS("padding-right", "12px")
  await expect(texts.nth(1)).toHaveCSS("padding-right", "12px")
  await expect(group.locator('[data-slot="checkbox-group-item"]').first()).toHaveCSS("gap", "8px")
}

const examples = [
  { id: "toolbar-default", target: "toolbar", region: "Toolbar padding top" },
  { id: "toolbar-variants", target: "toolbar-default", region: "default toolbar padding top" },
  { id: "toolbar-text-formatting", target: "toolbar", region: "Toolbar padding top" },
  { id: "toolbar-vertical", target: "toolbar", region: "Toolbar padding top" },
  { id: "toolbar-with-title", target: "toolbar", region: "Toolbar padding top" },
]

for (const example of examples) {
  test(`${example.id} shares inspection, reset, and complete code`, async ({ page }) => {
    await page.goto("/#/toolbar")
    const section = page.locator(`#${example.id}`)
    const canvas = section.locator('[data-slot="canvas"]')
    const annotations = section.getByRole("checkbox", { name: "Annotations", exact: true })
    const grid = section.getByRole("checkbox", { name: "Grid", exact: true })
    const region = section.getByRole("button", { name: example.region, exact: true, includeHidden: true })
    await expect(region).toBeHidden()
    await expect(canvas).toHaveCount(1)
    await expectSharedDisplayOptions(section)
    await expect(annotations).not.toBeChecked()
    await expect(grid).not.toBeChecked()
    await expect(section.locator('[data-callout-id]')).toHaveCount(0)
    await expect(section.locator('.sr-only[role="status"]')).toHaveCount(0)
    await grid.click()
    await annotations.click()
    await expect(region).toBeVisible()
    await expect(section.getByLabel("Measurement legend")).toBeVisible()

    await region.click()
    await expect(region).toHaveAttribute("aria-pressed", "true")
    const callout = section.locator('[data-callout-id]')
    await expect(callout).toHaveCount(1)
    await expect(callout.locator('[data-slot="annotation-dimensions"]')).toContainText("px")
    await expect.poll(() => section.evaluate(section => {
      const callout = section.querySelector('[data-callout-id]')!.getBoundingClientRect()
      const canvas = section.querySelector('[data-slot="canvas"]')!.getBoundingClientRect()
      return callout.left >= canvas.left && callout.right <= canvas.right && callout.top >= canvas.top && callout.bottom <= canvas.bottom
    })).toBe(true)

    await region.press("Escape")
    await expect(callout).toHaveCount(0)
    await region.focus()
    await region.press("Enter")
    await expect(region).toBeFocused()
    await expect(callout).toHaveCount(1)
    await annotations.click()
    await expect(callout).toHaveCount(0)
    await expect(region).toBeDisabled()
    await expect(section.locator('[data-slot="canvas-footer"]')).toHaveText("Annotations hidden")
    await grid.click()
    await section.getByRole("button", { name: "Reset example", exact: true }).click()
    await expect(grid).not.toBeChecked()
    await expect(annotations).not.toBeChecked()
    await expect(callout).toHaveCount(0)
    await grid.click()
    await annotations.click()

    const source = section.locator(`[data-measure="${example.target}"]`)
    const originalPadding = await source.evaluate(element => parseFloat(getComputedStyle(element).paddingTop))
    await source.evaluate(element => (element as HTMLElement).style.setProperty("--tb-pad", "calc(var(--spacing) * 4)"))
    const changedPadding = await source.evaluate(element => parseFloat(getComputedStyle(element).paddingTop))
    expect(changedPadding).not.toBe(originalPadding)
    await expect.poll(() => region.evaluate(element => element.getBoundingClientRect().height)).toBe(changedPadding)
    await region.click()
    await expect(callout.locator('[data-slot="annotation-dimensions"]')).toContainText(`${changedPadding} px`)
    await section.getByRole("button", { name: "Reset example", exact: true }).click()
    await expect.poll(() => region.evaluate(element => element.getBoundingClientRect().height)).toBe(originalPadding)

    const specimen = section.locator('[data-annotate="toolbar-specimen"]')
    const control = specimen.locator("button").first()
    await control.click()
    await expect(control).toBeFocused()
    await expect(callout).toHaveCount(0)
    await section.getByRole("tab", { name: "Code", exact: true }).click()
    const code = section.locator("code")
    await expect(code).toContainText("function ToolbarPreview")
    await expect(code).toContainText("AnnotationMeasurements")
    await expect(code).toContainText("export const Demo")
    await expect(code).not.toContainText("generatedExampleCode")
    await section.getByRole("tab", { name: "Preview", exact: true }).click()
    await expect(region).toBeHidden()
  })
}

test("preview controls and specimen share the toolbar title token", async ({ page }) => {
  await page.goto("/#/toolbar")
  const titles = page.locator('[data-slot="toolbar-title"]')
  await expect(titles.first()).toBeVisible()
  await expect(titles).toHaveCount(8)
  const padding = () => titles.evaluateAll(elements => elements.map(element => getComputedStyle(element).paddingLeft))
  await expect.poll(padding).toEqual(Array(8).fill("8px"))
  await page.evaluate(() => document.documentElement.style.setProperty("--toolbar-title-padding-start", "calc(var(--spacing) * 4)"))
  await expect.poll(padding).toEqual(Array(8).fill("16px"))
  await page.evaluate(() => document.documentElement.style.removeProperty("--toolbar-title-padding-start"))
  await expect.poll(padding).toEqual(Array(8).fill("8px"))
})

test("toolbar expressive scale and floating variant provide soft hardware geometry and interaction", async ({ page }) => {
  await page.goto("/#/toolbar")
  const expressiveSection = page.locator("#toolbar-expressive")
  const expressiveToolbar = expressiveSection.locator('[data-slot="toolbar"]').last()
  await expect(expressiveToolbar).toHaveAttribute("data-size", "expressive")
  await expect(expressiveToolbar).toHaveCSS("border-radius", "37px")
  await expect(expressiveToolbar).toHaveCSS("padding", "8px")

  const expressiveButton = expressiveToolbar.locator('[data-slot="button"]').first()
  await expect(expressiveButton).toHaveCSS("height", "56px")
  await expect(expressiveButton).toHaveCSS("width", "56px")
  await expect(expressiveButton).toHaveCSS("border-radius", "28px")

  const floatingSection = page.locator("#toolbar-floating-island")
  const floatingToolbars = floatingSection.locator('[data-slot="toolbar"][data-elevation="floating"]')
  await expect(floatingToolbars).toHaveCount(2)
  for (const tb of await floatingToolbars.all()) {
    await expect(tb).toHaveAttribute("data-elevation", "floating")
    await expect(tb).toHaveAttribute("data-shape", "pill")
    await expect(tb).toHaveCSS("border-radius", "37px")
  }

  // Verify concentric rule on the floating island: outer radius (37px) - padding (8px) - border (1px) = inner button radius (28px)
  const concentricMetrics = await floatingToolbars.first().evaluate(tb => {
    const tbCs = getComputedStyle(tb);
    const firstBtn = tb.querySelector('[data-slot="button"]')!;
    const lastBtn = tb.querySelectorAll('[data-slot="button"]')[tb.querySelectorAll('[data-slot="button"]').length - 1];
    const firstCs = getComputedStyle(firstBtn);
    const lastCs = getComputedStyle(lastBtn);
    return {
      tbRadius: parseFloat(tbCs.borderRadius),
      tbPad: parseFloat(tbCs.paddingTop),
      tbBorder: parseFloat(tbCs.borderTopWidth),
      firstRadius: parseFloat(firstCs.borderRadius),
      lastRadius: parseFloat(lastCs.borderRadius),
    };
  });
  expect(concentricMetrics.tbRadius - concentricMetrics.tbPad - concentricMetrics.tbBorder).toBe(concentricMetrics.firstRadius);
  expect(concentricMetrics.firstRadius).toBe(28);
  expect(concentricMetrics.lastRadius).toBe(28);

  // Test interactive selection on text formatting
  const formatSection = page.locator("#toolbar-text-formatting")
  const boldButton = formatSection.getByRole("button", { name: "Bold", exact: true })
  await expect(boldButton).toHaveAttribute("aria-pressed", "true")
  await boldButton.click()
  await expect(boldButton).toHaveAttribute("aria-pressed", "false")
  await boldButton.click()
  await expect(boldButton).toHaveAttribute("aria-pressed", "true")
})

test("special preview pages explicitly opt into the requested defaults", async ({ page }) => {
  for (const route of ["annotation", "canvas", "canvas-grid", "cursor-follower", "concentric"]) {
    const defaultGrid = route !== "concentric"
    const defaultAnnotations = !["canvas", "canvas-grid", "concentric"].includes(route)
    await page.goto(`/#/${route}`)
    const sections = page.locator('section[id]')
    const count = await sections.count()
    expect(count).toBeGreaterThan(0)
    for (let index = 0; index < count; index++) {
      const section = sections.nth(index)
      const grid = section.getByRole("checkbox", { name: /^(Show grid|Grid)$/ })
      const annotations = section.getByRole("checkbox", { name: /^(Show annotations|Annotations)$/ })
      await expectSharedDisplayOptions(section)
      await expect(grid).toBeChecked({ checked: defaultGrid })
      await expect(annotations).toBeChecked({ checked: defaultAnnotations })
      await expect(section.locator('[data-slot="canvas-grid"]')).toHaveAttribute("data-active", String(defaultGrid))
      await grid.click()
      await expect(section.locator('[data-slot="canvas-grid"]')).toHaveAttribute("data-active", String(!defaultGrid))
      await annotations.click()
      await section.getByRole("button", { name: /^Reset( example)?$/, exact: true }).click()
      await expect(grid).toBeChecked({ checked: defaultGrid })
      await expect(annotations).toBeChecked({ checked: defaultAnnotations })
    }
  }
  await page.goto("/#/button")
  await expect(page.locator('[data-slot="canvas"]').first()).toHaveAttribute("data-background", "plain")
})

for (const route of ["checkbox", "button", "input", "dialog", "table", "scroll-area", "resizable", "sidebar", "page", "carousel"]) {
  test(`${route} uses shared headers and grid-only previews`, async ({ page }) => {
    await page.goto(`/#/${route}`)
    const sections = page.locator('section.showcase-example')
    await expect(sections.first()).toBeVisible()
    const count = await sections.count()
    for (let index = 0; index < count; index++) {
      const section = sections.nth(index)
      await expect(section.getByRole("button", { name: "Reset example", exact: true })).toHaveCount(1)
      const controls = section.locator('[data-slot="checkbox-group"]').filter({ has: page.getByRole("checkbox", { name: "Grid", exact: true }) }).first()
      await expect(controls.getByRole("checkbox")).toHaveCount(1)
      await expect(controls.getByRole("checkbox", { name: "Grid", exact: true })).not.toBeChecked()
      await expect(section.locator('[data-slot="annotation-measured-regions"]')).toHaveCount(0)
    }
    const first = sections.first()
    const grid = first.getByRole("checkbox", { name: "Grid", exact: true })
    await grid.click()
    await expect(first.locator('[data-slot="canvas-grid"]').first()).toHaveAttribute("data-active", "true")
    await first.getByRole("button", { name: "Reset example", exact: true }).click()
    await expect(grid).not.toBeChecked()
    await first.getByRole("tab", { name: "Code", exact: true }).click()
    await expect(first.locator("code")).toBeVisible()
    await first.getByRole("tab", { name: "Preview", exact: true }).click()
    await expect(grid).toBeVisible()
  })
}

test("authored annotations and measurements are separate capabilities", async ({ page }) => {
  await page.goto("/#/annotation")
  const anatomy = page.locator('#annotation-default')
  await anatomy.locator('[data-callout-id="3"] button').click()
  await expect(anatomy.locator('[data-selected-bounds="3"]')).toHaveCount(1)
  await expect(anatomy.locator('[data-slot="annotation-dimensions"]')).toHaveCount(0)
  const dimensions = page.locator('#annotation-dimensions')
  await dimensions.getByRole("button", { name: "Card padding top", exact: true }).click()
  await expect(dimensions.locator('[data-callout-id] [data-slot="annotation-dimensions"]')).toContainText("px")
})