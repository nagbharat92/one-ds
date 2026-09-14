import { expect, test, type Locator } from "@playwright/test"

async function composerMetrics(form: Locator) {
  return form.evaluate(element => {
    const input = element.querySelector<HTMLTextAreaElement>('[data-slot="ai-composer-input"]')!
    const add = element.querySelector<HTMLButtonElement>('[aria-label="Add to prompt"]')!
    const submit = element.querySelector<HTMLButtonElement>('[data-slot="ai-composer-submit"]')!
    const footer = element.querySelector<HTMLElement>('[data-slot="ai-composer-footer"]')!
    const bounds = element.getBoundingClientRect()
    const inputBounds = input.getBoundingClientRect()
    const addBounds = add.getBoundingClientRect()
    const submitBounds = submit.getBoundingClientRect()
    const footerBounds = footer.getBoundingClientRect()
    const style = getComputedStyle(element)
    const inputStyle = getComputedStyle(input)

    return {
      height: element.offsetHeight,
      radius: parseFloat(style.borderRadius),
      padding: parseFloat(style.paddingTop),
      overflowX: element.scrollWidth - element.clientWidth,
      inputHeight: input.offsetHeight,
      inputLineHeight: parseFloat(inputStyle.lineHeight),
      inputPaddingBlock: parseFloat(inputStyle.paddingBlockStart),
      inputPaddingInline: parseFloat(inputStyle.paddingInlineStart),
      inputPaddingInlineEnd: parseFloat(inputStyle.paddingInlineEnd),
      addWidth: add.offsetWidth,
      addHeight: add.offsetHeight,
      submitWidth: submit.offsetWidth,
      submitHeight: submit.offsetHeight,
      addRadius: parseFloat(getComputedStyle(add).borderRadius),
      submitRadius: parseFloat(getComputedStyle(submit).borderRadius),
      leftInset: addBounds.left - bounds.left,
      rightInset: bounds.right - submitBounds.right,
      textStartGap:
        inputBounds.left + parseFloat(inputStyle.paddingInlineStart) - addBounds.right,
      textEndGap:
        submitBounds.left - (inputBounds.right - parseFloat(inputStyle.paddingInlineEnd)),
      footerPosition: getComputedStyle(footer).position,
      footerHeight: footer.offsetHeight,
      footerInside:
        footerBounds.top >= bounds.top && footerBounds.bottom <= bounds.bottom,
      footerGap: footerBounds.top - inputBounds.bottom,
      submitHasInlineStyle: submit.hasAttribute("style"),
      addDisabled: add.matches(":disabled"),
      submitDisabled: submit.matches(":disabled"),
    }
  })
}

test("AI Composer states and Mini keep stable concentric geometry", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/ai-composer")

  const states = [
    { name: "Ready message", status: "ready", busy: "false", submit: "Send message", submitWidth: 40, disabled: false },
    { name: "Submitted message", status: "submitted", busy: "true", submit: "Sending message", submitWidth: 40, disabled: true },
    { name: "Streaming message", status: "streaming", busy: "true", submit: "Stop generating", submitWidth: 80, disabled: false },
    { name: "Error message", status: "error", busy: "false", submit: "Retry message", submitWidth: 40, disabled: false },
    { name: "Disabled message", status: "ready", busy: "false", submit: "Voice input", submitWidth: 80, disabled: true },
  ]

  for (const state of states) {
    const form = page.getByRole("textbox", { name: state.name, exact: true })
      .locator('xpath=ancestor::form[@data-slot="ai-composer"]')
    await expect(form).toHaveAttribute("data-status", state.status)
    await expect(form).toHaveAttribute("aria-busy", state.busy)
    await expect(form.getByRole("button", { name: state.submit, exact: true })).toBeVisible()
    const metrics = await composerMetrics(form)
    const wrapsAtMobileWidth = testInfo.project.name === "mobile" &&
      (state.name === "Ready message" || state.name === "Streaming message")
    expect(metrics).toMatchObject({
      radius: 29,
      padding: 8,
      inputLineHeight: 24,
      inputPaddingBlock: 8,
      addWidth: 40,
      addHeight: 40,
      submitWidth: state.submitWidth,
      submitHeight: 40,
      addRadius: 20,
      submitRadius: 20,
      footerHeight: 40,
      footerInside: true,
      submitHasInlineStyle: false,
      submitDisabled: state.disabled,
    })
    expect(metrics.leftInset).toBeCloseTo(9, 0)
    expect(metrics.rightInset).toBeCloseTo(9, 0)
    expect(metrics.overflowX).toBeLessThanOrEqual(1)
    if (wrapsAtMobileWidth) {
      expect(metrics.height).toBeGreaterThan(58)
      expect(metrics.inputHeight).toBe(44)
      expect(metrics.inputPaddingInline).toBe(12)
      expect(metrics.inputPaddingInlineEnd).toBe(12)
      expect(metrics.footerPosition).toBe("static")
      expect(metrics.footerGap).toBeCloseTo(8, 0)
    } else {
      expect(metrics.height).toBe(58)
      expect(metrics.inputHeight).toBe(40)
      expect(metrics.inputPaddingInline).toBe(48)
      expect(metrics.inputPaddingInlineEnd).toBe(state.submitWidth + 8)
      expect(metrics.footerPosition).toBe("absolute")
      expect(metrics.textStartGap).toBeCloseTo(8, 0)
      expect(metrics.textEndGap).toBeCloseTo(8, 0)
    }
    if (state.name === "Disabled message") expect(metrics.addDisabled).toBe(true)
  }

  const mini = page.getByRole("textbox", { name: "Quick message", exact: true })
    .locator('xpath=ancestor::form[@data-slot="ai-composer"]')
  const miniMetrics = await composerMetrics(mini)
  expect(miniMetrics).toMatchObject({
    height: 74,
    radius: 37,
    padding: 16,
    inputHeight: 40,
    inputLineHeight: 24,
    inputPaddingBlock: 8,
    inputPaddingInline: 48,
    inputPaddingInlineEnd: 88,
    addWidth: 40,
    addHeight: 40,
    submitWidth: 80,
    submitHeight: 40,
    addRadius: 20,
    submitRadius: 20,
    footerInside: true,
  })
  expect(miniMetrics.leftInset).toBeCloseTo(17, 0)
  expect(miniMetrics.rightInset).toBeCloseTo(17, 0)
  expect(miniMetrics.textStartGap).toBeCloseTo(8, 0)
  expect(miniMetrics.textEndGap).toBeCloseTo(8, 0)
  await expect(mini.locator('[data-slot="ai-composer-tool"]')).toHaveCount(0)
})

test("AI Composer grows around wrapped tools without overlap", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/ai-composer")
  const form = page.getByPlaceholder("Type a prompt or toggle tools below…")
    .locator('xpath=ancestor::form[@data-slot="ai-composer"]')
  await form.evaluate(element => { element.style.maxInlineSize = "360px" })

  for (const name of ["Search web", "Deep research"]) {
    await form.getByRole("button", { name: "Add to prompt", exact: true }).click()
    await page.getByRole("menuitemcheckbox", { name, exact: true }).click()
  }
  await expect(form.locator('[data-slot="ai-composer-tool"]')).toHaveCount(3)

  const metrics = await composerMetrics(form)
  expect(metrics.footerPosition).toBe("static")
  expect(metrics.footerHeight).toBeGreaterThan(40)
  expect(metrics.footerGap).toBeCloseTo(8, 0)
  expect(metrics.footerInside).toBe(true)
  expect(metrics.overflowX).toBeLessThanOrEqual(1)
})

test("Expression Lab keeps composer controls on one scoped scale", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/expression-lab")
  const lab = page.locator(".expression-lab")
  const tools = page.getByRole("toolbar", { name: "Experiment tools" })
  await tools.getByText("Expressive", { exact: true }).click()
  await expect(lab).toHaveAttribute("data-expression", "expressive")

  const form = lab.getByRole("textbox", { name: "Message the design assistant", exact: true })
    .locator('xpath=ancestor::form[@data-slot="ai-composer"]')
  const metrics = await composerMetrics(form)
  expect(metrics).toMatchObject({
    height: 74,
    radius: 37,
    padding: 12,
    inputHeight: 48,
    inputLineHeight: 24,
    inputPaddingBlock: 12,
    inputPaddingInline: 56,
    inputPaddingInlineEnd: 104,
    addWidth: 48,
    addHeight: 48,
    submitWidth: 96,
    submitHeight: 48,
    addRadius: 24,
    submitRadius: 24,
    footerInside: true,
  })
  expect(metrics.leftInset).toBeCloseTo(13, 0)
  expect(metrics.rightInset).toBeCloseTo(13, 0)
  expect(metrics.textStartGap).toBeCloseTo(8, 0)
  expect(metrics.textEndGap).toBeCloseTo(8, 0)
  expect(metrics.overflowX).toBeLessThanOrEqual(1)
})