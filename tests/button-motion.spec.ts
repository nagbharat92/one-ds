import { expect, test } from "@playwright/test"

test("sidebar cookie FAB reveals with random shape spin and exits with fade only", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/fab")
  const floating = page.locator('.fab[data-placement="floating"]')
  const close = page.getByRole("button", { name: "Close sidebar", exact: true })
  const shape = floating.locator('[data-slot="shape"]')
  await expect(floating).toHaveCount(1)
  if (await floating.getAttribute("data-visible") === "true") {
    await floating.evaluate(element => element.click())
  }
  await expect(close).toBeVisible()
  await expect(floating).toHaveCSS("opacity", "0")
  let previousShape = await floating.getAttribute("data-shape")
  for (let cycle = 0; cycle < 3; cycle++) {
    await close.focus()
    await close.evaluate(element => element.click())
    await expect(floating).toHaveAttribute("data-visible", "true")
    const nextShape = await floating.getAttribute("data-shape")
    expect(["cookie4", "cookie6", "cookie7"]).toContain(nextShape)
    expect(nextShape).not.toBe(previousShape)
    previousShape = nextShape
    const samples = await floating.evaluate(element => {
      const graphic = element.querySelector<SVGSVGElement>('[data-slot="shape"]')!
      const spin = graphic.getAnimations().find(animation => (animation.effect as KeyframeEffect).getKeyframes().some(frame => "rotate" in frame))!
      const growth = element.getAnimations().find(animation => (animation.effect as KeyframeEffect).getKeyframes().some(frame => "scale" in frame))!
      const fade = element.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === "opacity")!
      const animations = [spin, growth, fade]
      animations.forEach(animation => animation.pause())
      const fadeDelay = fade.effect!.getTiming().delay
      animations.forEach(animation => { animation.currentTime = fadeDelay / 2 })
      const hiddenStart = { rotation: parseFloat(getComputedStyle(graphic).rotate), scale: parseFloat(getComputedStyle(element).scale), opacity: parseFloat(getComputedStyle(element).opacity) }
      const values = [0, 0.15, 0.5, 1].map(progress => {
        animations.forEach(animation => { animation.currentTime = animation.effect!.getTiming().delay + Number(animation.effect!.getTiming().duration) * progress })
        return { rotation: parseFloat(getComputedStyle(graphic).rotate), scale: parseFloat(getComputedStyle(element).scale), opacity: parseFloat(getComputedStyle(element).opacity) }
      })
      const duration = Number(spin.effect!.getTiming().duration)
      const growthDuration = Number(growth.effect!.getTiming().duration)
      const fadeDuration = Number(fade.effect!.getTiming().duration)
      const fadeEase = fade.effect!.getTiming().easing
      const settle = [0.7, 0.8, 0.9, 1].map(progress => {
        spin.currentTime = duration * progress
        growth.currentTime = growthDuration * progress
        return { rotation: parseFloat(getComputedStyle(graphic).rotate), scale: parseFloat(getComputedStyle(element).scale) }
      })
      const spinEase = (spin.effect as KeyframeEffect).getKeyframes()[1].easing
      const growthEase = growth.effect!.getTiming().easing
      animations.forEach(animation => { animation.currentTime = animation.effect!.getTiming().delay + Number(animation.effect!.getTiming().duration) / 2 })
      return { values, duration, growthDuration, fadeDuration, fadeDelay, fadeEase, hiddenStart, settle, spinEase, growthEase, width: element.offsetWidth, height: element.offsetHeight,
        iconRotation: getComputedStyle(element.querySelector('[data-slot="fab-icon"]')!).rotate }
    })
    expect(samples.width).toBe(72)
    expect(samples.height).toBe(72)
    expect(samples.duration).toBeCloseTo(216 / 240 * 1000)
    expect(samples.growthDuration).toBeCloseTo(72 * 0.2 / 32 * 1000)
    expect(samples.fadeDuration).toBe(450)
    expect(samples.fadeDelay).toBe(160)
    expect(samples.fadeEase).toBe("cubic-bezier(0.32, 0.72, 0, 1)")
    expect(samples.hiddenStart.opacity).toBe(0)
    expect(samples.hiddenStart.rotation).toBeLessThan(0)
    expect(samples.hiddenStart.scale).toBeGreaterThan(0.8)
    expect(samples.spinEase).toBe("cubic-bezier(0.22, 0, 0.1, 1)")
    expect(samples.growthEase).toBe(samples.spinEase)
    for (const property of ["rotation", "scale"] as const) {
      const steps = samples.settle.slice(1).map((value, index) => value[property] - samples.settle[index][property])
      expect(steps[2]).toBeGreaterThan(0)
      expect(steps[2]).toBeLessThan(steps[1])
      expect(steps[1]).toBeLessThan(steps[0])
    }
    expect(samples.values[0].rotation).toBe(0)
    expect(samples.values[1].rotation).toBe(-18)
    expect(samples.values[2].rotation).toBeGreaterThan(0)
    expect(samples.values[3].rotation).toBe(180)
    expect(samples.values[0].scale).toBeCloseTo(0.8)
    expect(samples.values[2].scale).toBeGreaterThan(0.8)
    expect(samples.values[3].scale).toBe(1)
    expect(samples.values[0].opacity).toBe(0)
    expect(samples.values[2].opacity).toBeGreaterThan(0)
    expect(samples.values[3].opacity).toBe(1)
    expect(samples.iconRotation).toBe("none")
    if (!isMobile) await expect(floating).toBeFocused()
    const rotationAtExit = await shape.evaluate(element => getComputedStyle(element).rotate)
    const scaleAtExit = await floating.evaluate(element => getComputedStyle(element).scale)
    await floating.evaluate(element => element.click())
    await expect(floating).toHaveAttribute("data-visible", "false")
    await expect(floating).toHaveAttribute("inert", "")
    await expect(floating).toHaveCSS("transition-duration", "0.16s")
    const exit = await floating.evaluate(element => {
      const graphic = element.querySelector('[data-slot="shape"]')!
      const animations = [...element.getAnimations(), ...graphic.getAnimations()]
      const spatial = animations.filter(animation => (animation.effect as KeyframeEffect).getKeyframes().some(frame => "rotate" in frame || "scale" in frame))
      const fade = element.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === "opacity")!
      fade.pause()
      fade.currentTime = Number(fade.effect!.getTiming().duration) / 2
      const middle = parseFloat(getComputedStyle(element).opacity)
      fade.finish()
      return { spatial: spatial.length, middle, delay: fade.effect!.getTiming().delay, rotation: getComputedStyle(graphic).rotate, scale: getComputedStyle(element).scale }
    })
    expect(exit.spatial).toBe(0)
    expect(exit.delay).toBe(0)
    expect(exit.middle).toBeGreaterThan(0)
    expect(exit.middle).toBeLessThan(1)
    expect(exit.rotation).toBe(rotationAtExit)
    expect(exit.scale).toBe(scaleAtExit)
    await expect(close).toBeVisible()
    if (!isMobile) expect(await close.evaluate(element => element.closest('[data-slot="sidebar"]')!.contains(document.activeElement))).toBe(true)
  }
  await page.emulateMedia({ reducedMotion: "reduce" })
  await close.evaluate(element => element.click())
  await expect(floating).toHaveAttribute("data-visible", "true")
  await expect(floating).toHaveCSS("scale", "none")
  await expect(shape).toHaveCSS("rotate", "none")
  await expect(floating).toHaveCSS("opacity", "1")
  await expect(floating).toHaveCSS("transition-delay", "0s")
})

test("Button selection animates corners with spatial tokens and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/button")
  const button = page.locator('#button-selected button[data-size="default"][data-variant="tertiary"]:not(:disabled)')
  await button.click()
  await expect(button).toHaveAttribute("aria-pressed", "false")
  await expect(button).toHaveCSS("border-radius", "12px")
  const transition = await button.evaluate(element => {
    element.click()
    return new Promise<{ duration: number; first: number; last: number }>(resolve => requestAnimationFrame(() => {
      getComputedStyle(element).borderTopLeftRadius
      const animation = element.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === "border-top-left-radius")!
      animation.pause()
      const duration = Number(animation.effect!.getTiming().duration)
      animation.currentTime = 0
      const first = parseFloat(getComputedStyle(element).borderTopLeftRadius)
      animation.currentTime = duration
      const last = parseFloat(getComputedStyle(element).borderTopLeftRadius)
      animation.finish()
      resolve({ duration, first, last })
    }))
  })
  expect(transition).toEqual({ duration: 350, first: 12, last: 20 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await button.click()
  await expect(button).toHaveAttribute("aria-pressed", "false")
  await expect(button).toHaveCSS("border-radius", "12px")
  expect(await button.evaluate(element => getComputedStyle(element).transitionDuration.split(",").every(duration => parseFloat(duration) <= 0.001))).toBe(true)
})

test("Button push uses spring timing with unchanged corners and stable layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/button")
  const section = page.locator("#button-motion")
  const button = section.getByRole("button", { name: "Save a copy", exact: true }).last()
  await button.scrollIntoViewIfNeeded()
  const bounds = await button.boundingBox()
  const layout = await button.evaluate(element => [element.offsetWidth, element.offsetHeight])
  const style = await button.evaluate(element => {
    const css = getComputedStyle(element)
    return { properties: css.transitionProperty, speed: css.transitionDuration, curve: css.transitionTimingFunction }
  })
  expect(style.properties).not.toContain("all")
  expect(style.properties).not.toContain("transform")
  expect(style.properties).not.toContain("width")
  expect(style.speed).toBe("0.35s, 0.35s, 0.35s, 0.15s, 0.15s, 0.15s, 0.15s")
  expect(style.curve).toContain("cubic-bezier(0.42, 1.67, 0.21, 0.9)")
  expect(style.curve).toContain("cubic-bezier(0.31, 0.94, 0.34, 1)")
  await button.hover()
  await page.mouse.down()
  await expect.poll(() => button.evaluate(element => element.getAnimations().filter(animation => animation instanceof CSSTransition && animation.transitionProperty === "scale").length)).toBeGreaterThan(0)
  const samples = await button.evaluate(element => {
    const animations = element.getAnimations().filter(animation => animation instanceof CSSTransition && animation.transitionProperty === "scale")
    animations.forEach(animation => animation.pause())
    return [0, 0.2, 0.4, 0.6, 1].map(fraction => {
      animations.forEach(animation => { animation.currentTime = Number(animation.effect!.getTiming().duration) * fraction })
      return parseFloat(getComputedStyle(element).scale)
    })
  })
  expect(samples[0]).toBeCloseTo(1)
  expect(Math.min(...samples)).toBeLessThan(0.97)
  expect(samples.at(-1)).toBeCloseTo(0.97)
  expect(await button.evaluate(element => [element.offsetWidth, element.offsetHeight])).toEqual(layout)
  await expect(button).toHaveCSS("border-radius", "28px")
  await button.evaluate(element => element.getAnimations().forEach(animation => { if (animation.effect?.getTiming().iterations !== Infinity) animation.finish() }))
  await page.mouse.up()
  await expect(section.getByRole("status").last()).toHaveText("1 changes saved")
  await expect(button).toHaveCSS("scale", "none")
  await page.mouse.down()
  await page.mouse.up()
  await page.mouse.down()
  await page.mouse.up()
  await expect(section.getByRole("status").last()).toHaveText("3 changes saved")
  await expect(button).toHaveCSS("scale", "none")
  expect(await button.boundingBox()).toEqual(bounds)
  await button.focus()
  await page.keyboard.down("Space")
  await expect(button).toHaveCSS("scale", "0.97")
  await expect(button).toHaveCSS("translate", "0px 2px")
  await expect(button).toHaveCSS("border-radius", "28px")
  await page.keyboard.up("Space")
  await expect(section.getByRole("status").last()).toHaveText("4 changes saved")
  await expect(button).toHaveCSS("scale", "none")
  await page.evaluate(() => document.documentElement.style.setProperty("--button-spatial-speed", "600ms"))
  await expect(button).toHaveCSS("transition-duration", "0.6s, 0.6s, 0.6s, 0.15s, 0.15s, 0.15s, 0.15s")
  await page.evaluate(() => document.documentElement.style.removeProperty("--button-spatial-speed"))
})

test("Button reduced motion, joined corners, and touch activation retain their contracts", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#/button")
  const section = page.locator("#button-motion")
  const button = section.getByRole("button", { name: "Save a copy", exact: true }).last()
  await button.scrollIntoViewIfNeeded()
  const radius = await button.evaluate(element => getComputedStyle(element).borderRadius)
  await button.hover()
  await page.mouse.down()
  await expect(button).toHaveCSS("border-radius", radius)
  await expect(button).toHaveCSS("scale", "none")
  await expect(button).toHaveCSS("translate", "none")
  const durations = await button.evaluate(element => getComputedStyle(element).transitionDuration.split(",").map(value => parseFloat(value)))
  expect(durations.every(value => value <= 0.001)).toBeTruthy()
  await page.mouse.up()
  if (testInfo.project.name === "mobile") {
    await button.tap()
    await expect(section.getByRole("status").last()).toHaveText("2 changes saved")
  }
  const disabled = section.getByRole("button", { name: "Saving", exact: true }).last()
  await expect(disabled).toBeDisabled()
  await expect(disabled).toHaveCSS("border-radius", "28px")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/button-group")
  const grouped = page.locator('#button-group-default [data-slot="canvas"] [data-slot="button"]').first()
  await grouped.hover()
  const joined = await grouped.evaluate(element => getComputedStyle(element).borderRadius)
  await page.mouse.down()
  await expect(grouped).toHaveCSS("border-radius", joined)
  await expect(grouped).toHaveCSS("scale", "none")
  await page.mouse.up()
})

test("Field action Ghost buttons inherit push and stay contained", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/input")
  const fieldInput = page.locator('[data-slot="input-group"] input[placeholder="you@example.com"]')
  await fieldInput.fill("a")
  const fieldAction = page.getByRole("button", { name: "Submit email" })
  await expect(page.locator("[data-field-action]")).toHaveCount(2)
  await expect(fieldAction).toHaveAttribute("data-variant", "ghost")
  await fieldAction.hover()
  const field = fieldAction.locator('xpath=ancestor::*[@data-slot="input-group"][1]')
  await page.mouse.down()
  await expect(fieldAction).toHaveCSS("scale", "0.97")
  await expect(fieldAction).toHaveCSS("translate", "0px 2px")
  const [fieldBounds, actionBounds] = await Promise.all([
    field.boundingBox(),
    fieldAction.boundingBox(),
  ])
  await page.mouse.up()
  expect(fieldBounds).not.toBeNull()
  expect(actionBounds).not.toBeNull()
  expect(actionBounds?.x).toBeGreaterThanOrEqual(fieldBounds?.x ?? 0)
  expect(actionBounds?.y).toBeGreaterThanOrEqual(fieldBounds?.y ?? 0)
  expect((actionBounds?.x ?? 0) + (actionBounds?.width ?? 0)).toBeLessThanOrEqual((fieldBounds?.x ?? 0) + (fieldBounds?.width ?? 0))
  expect((actionBounds?.y ?? 0) + (actionBounds?.height ?? 0)).toBeLessThanOrEqual((fieldBounds?.y ?? 0) + (fieldBounds?.height ?? 0))
})

test("Button corner morph remains available only by explicit opt-in", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#/button")
  const button = page.locator('#button-motion [data-variant="secondary"][data-size="expressive"]')
  await button.evaluate(element => element.setAttribute("data-press-effect", "morph"))
  await button.hover()
  await page.mouse.down()
  await expect(button).toHaveCSS("border-radius", "12px")
  await expect(button).toHaveCSS("scale", "none")
  await expect(button).toHaveCSS("translate", "none")
  await page.mouse.up()
  await expect(button).toHaveCSS("border-radius", "28px")
})