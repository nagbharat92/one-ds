import { expect, test } from "@playwright/test"

test.describe("Expressive SiteHeader and SiteFooter", () => {
  test("SiteHeader docked and floating geometry, active indicator, and icon fill", async ({ page }) => {
    await page.goto("/#/site-header")
    await page.waitForSelector('[data-slot="site-header"]')

    // 1. Docked header geometry
    const dockedHeader = page.locator('[data-slot="site-header"][data-variant="docked"]').first()
    await expect(dockedHeader).toBeVisible()

    const visibleLink = dockedHeader.locator('[data-slot="site-header-link"]:not([hidden])').first()
    if (await visibleLink.count() > 0 && await visibleLink.isVisible()) {
      const linkMetrics = await visibleLink.evaluate((el) => {
        const style = getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        return {
          height: Math.round(rect.height),
          borderRadius: style.borderRadius,
          cursor: style.cursor,
        }
      })
      expect(linkMetrics.height).toBe(40)
      expect(linkMetrics.borderRadius).toBe("20px")
      expect(linkMetrics.cursor).toBe("pointer")
    } else {
      // On narrow viewports, links collapse into the More button with 40px height
      const moreButton = dockedHeader.locator('button[aria-label="More"]')
      await expect(moreButton).toBeVisible()
      const moreHeight = await moreButton.evaluate((el) => Math.round(el.getBoundingClientRect().height))
      expect(moreHeight).toBe(40)
    }

    // Active indicator sits under active link with secondary purple pair
    const indicator = dockedHeader.locator('[data-slot="site-header-indicator"]')
    await expect(indicator).toBeAttached()
    const indicatorBg = await indicator.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(indicatorBg).not.toBe("rgba(0, 0, 0, 0)")

    // 2. Floating header geometry
    const floatingHeader = page.locator('[data-slot="site-header"][data-variant="floating"]').first()
    await expect(floatingHeader).toBeVisible()
    const floatingShell = floatingHeader.locator('[data-slot="site-header-shell"]')
    const shellMetrics = await floatingShell.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        borderRadius: style.borderRadius,
        borderWidth: style.borderWidth,
      }
    })
    expect(shellMetrics.borderRadius).toBe("28px")
    expect(shellMetrics.borderWidth).toBe("1px")

    // 3. Dock demo has animated FILL on active Material Symbol icon
    const dockNav = page.locator('#site-header-bottom-dock [data-slot="site-header-nav"]')
    await expect(dockNav).toBeVisible()
    const activeDockLink = dockNav.locator('[data-slot="site-header-link"][data-active="true"]')
    const activeIconFill = await activeDockLink.locator('.oneds-icon').evaluate((el) => {
      return getComputedStyle(el).getPropertyValue("--icon-fill").trim()
    })
    expect(activeIconFill).toBe("1")
  })

  test("SiteHeader surfaces and overflow selection survive forced colors at 320px", async ({ page, isMobile }) => {
    if (isMobile) await page.setViewportSize({ width: 320, height: 640 })
    await page.emulateMedia({ forcedColors: "active" })
    await page.goto("/#/site-header")
    const docked = page.locator('[data-slot="site-header"][data-variant="docked"]').first()
    const floating = page.locator('[data-slot="site-header"][data-variant="floating"]').first()

    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ forcedColors: "active", colorScheme })
      const shell = floating.locator('[data-slot="site-header-shell"]')
      const edge = await shell.evaluate((node) => {
        const style = getComputedStyle(node)
        return { color: style.borderColor, width: style.borderTopWidth, fill: style.backgroundColor }
      })
      expect(edge.width).not.toBe("0px")
      expect(edge.color).not.toBe("rgba(0, 0, 0, 0)")
      expect(edge.color).not.toBe(edge.fill)
      if (isMobile) {
        const more = docked.getByRole("button", { name: "More" })
        await expect(more).toBeVisible()
        await expect(more).toHaveAttribute("data-active", "true")
        const activeEdge = await more.evaluate((node) => {
          const style = getComputedStyle(node)
          return { border: style.borderColor, fill: style.backgroundColor }
        })
        expect(activeEdge.border).not.toBe("rgba(0, 0, 0, 0)")
        expect(activeEdge.border).not.toBe(activeEdge.fill)
      } else {
        const indicator = docked.locator('[data-slot="site-header-indicator"]')
        await expect(indicator).toHaveCSS("opacity", "1")
        const indicatorFill = await indicator.evaluate((node) => getComputedStyle(node).backgroundColor)
        expect(indicatorFill).not.toBe(await docked.evaluate((node) => getComputedStyle(node).backgroundColor))
        expect(await docked.locator('[data-slot="site-header-link"][data-active="true"]').evaluate((node) => getComputedStyle(node).color))
          .not.toBe(indicatorFill)
      }
    }
    if (isMobile) {
      await docked.getByRole("button", { name: "More" }).click()
      await expect(page.getByRole("menuitem", { name: "Product" })).toHaveAttribute("aria-current", "page")
      await page.getByRole("menuitem", { name: "Docs" }).click()
      await docked.getByRole("button", { name: "More" }).click()
      await expect(page.getByRole("menuitem", { name: "Docs" })).toHaveAttribute("aria-current", "page")
      await expect(page.getByRole("menuitem", { name: "Product" })).not.toHaveAttribute("aria-current")
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  })

  test("SiteFooter docked, floating, and inverted variants with 40px tactile social links", async ({ page }) => {
    await page.goto("/#/site-footer")
    await page.waitForSelector('[data-slot="site-footer"]')

    // 1. Docked footer
    const dockedFooter = page.locator('[data-slot="site-footer"][data-variant="docked"]').first()
    await expect(dockedFooter).toBeVisible()

    // 40px circular tactile social links
    const socialLink = dockedFooter.locator('[data-slot="site-footer-social-link"]').first()
    await expect(socialLink).toBeVisible()
    const socialMetrics = await socialLink.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        borderRadius: style.borderRadius,
        cursor: style.cursor,
      }
    })
    expect(socialMetrics.width).toBe(40)
    expect(socialMetrics.height).toBe(40)
    expect(socialMetrics.borderRadius).toBe("20px")
    expect(socialMetrics.cursor).toBe("pointer")

    // Navigation link accessibility and cursor
    const footerLink = dockedFooter.locator('[data-slot="site-footer-link"]').first()
    const linkCursor = await footerLink.evaluate((el) => getComputedStyle(el).cursor)
    expect(linkCursor).toBe("pointer")

    // Top wavy separator on non-floating (docked) footer
    const wave = dockedFooter.locator('[data-slot="site-footer-wave"] [data-slot="separator"][data-variant="wavy"]')
    await expect(wave).toBeVisible()
    await expect(wave).toHaveAttribute("data-wavy-size", "medium")

    // Verify default/docked footer body uses navigation pane fill color
    const dockedBodyBg = await dockedFooter.locator('[data-slot="site-footer-body"]').evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })
    const navigationPaneBg = await page.evaluate(() => {
      const el = document.createElement("div")
      el.className = "bg-navigation-pane"
      document.body.appendChild(el)
      const bg = getComputedStyle(el).backgroundColor
      document.body.removeChild(el)
      return bg
    })
    expect(dockedBodyBg).toBe(navigationPaneBg)

    // Separator uses OneDS separator with faded variant
    const separator = dockedFooter.locator('[data-slot="site-footer-separator"]')
    await expect(separator).toHaveAttribute("data-slot", "site-footer-separator")

    // 2. Floating card island footer (no wave separator)
    const floatingFooter = page.locator('[data-slot="site-footer"][data-variant="floating"]')
    await expect(floatingFooter).toBeVisible()
    const floatingWave = floatingFooter.locator('[data-slot="site-footer-wave"]')
    await expect(floatingWave).toHaveCount(0)
    const floatingRadius = await floatingFooter.evaluate((el) => getComputedStyle(el).borderRadius)
    expect(parseFloat(floatingRadius)).toBeGreaterThanOrEqual(20)

    // 3. Inverted dark footer has top wavy separator and dark navigation pane fill
    const invertedFooter = page.locator('[data-slot="site-footer"][data-variant="inverted"]')
    await expect(invertedFooter).toBeVisible()
    await expect(invertedFooter).toHaveClass(/dark/)
    const invertedWave = invertedFooter.locator('[data-slot="site-footer-wave"] [data-slot="separator"][data-variant="wavy"]')
    await expect(invertedWave).toBeVisible()
    await expect(invertedWave).toHaveAttribute("data-wavy-size", "medium")

    const invertedBodyBg = await invertedFooter.locator('[data-slot="site-footer-body"]').evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })
    const darkNavigationPaneBg = await page.evaluate(() => {
      const el = document.createElement("div")
      el.className = "dark bg-navigation-pane"
      document.body.appendChild(el)
      const bg = getComputedStyle(el).backgroundColor
      document.body.removeChild(el)
      return bg
    })
    expect(invertedBodyBg).toBe(darkNavigationPaneBg)
  })

  test("SiteFooter wave and floating shell stay distinct at 320px in forced colors", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.emulateMedia({ forcedColors: "active" })
    await page.goto("/#/site-footer")
    const docked = page.locator('[data-slot="site-footer"][data-variant="docked"]').first()
    const floating = page.locator('[data-slot="site-footer"][data-variant="floating"]').first()
    const wave = docked.locator('[data-slot="separator"][data-variant="wavy"] path[stroke]')

    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ forcedColors: "active", colorScheme })
      const floatingEdge = await floating.evaluate((node) => {
        const style = getComputedStyle(node)
        return { color: style.borderColor, width: style.borderTopWidth, fill: style.backgroundColor }
      })
      expect(floatingEdge.width).not.toBe("0px")
      expect(floatingEdge.color).not.toBe("rgba(0, 0, 0, 0)")
      expect(floatingEdge.color).not.toBe(floatingEdge.fill)
      expect(await wave.evaluate((node) => getComputedStyle(node).stroke))
        .not.toBe(await docked.locator('[data-slot="site-footer-body"]').evaluate((node) => getComputedStyle(node).backgroundColor))
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  })
})
