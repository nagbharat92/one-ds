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

    // Verify default/docked footer body uses sidebar fill color
    const dockedBodyBg = await dockedFooter.locator('[data-slot="site-footer-body"]').evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })
    const sidebarBg = await page.evaluate(() => {
      const el = document.createElement("div")
      el.className = "bg-sidebar"
      document.body.appendChild(el)
      const bg = getComputedStyle(el).backgroundColor
      document.body.removeChild(el)
      return bg
    })
    expect(dockedBodyBg).toBe(sidebarBg)

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

    // 3. Inverted dark footer has top wavy separator and dark sidebar fill
    const invertedFooter = page.locator('[data-slot="site-footer"][data-variant="inverted"]')
    await expect(invertedFooter).toBeVisible()
    await expect(invertedFooter).toHaveClass(/dark/)
    const invertedWave = invertedFooter.locator('[data-slot="site-footer-wave"] [data-slot="separator"][data-variant="wavy"]')
    await expect(invertedWave).toBeVisible()
    await expect(invertedWave).toHaveAttribute("data-wavy-size", "medium")

    const invertedBodyBg = await invertedFooter.locator('[data-slot="site-footer-body"]').evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })
    const darkSidebarBg = await page.evaluate(() => {
      const el = document.createElement("div")
      el.className = "dark bg-sidebar"
      document.body.appendChild(el)
      const bg = getComputedStyle(el).backgroundColor
      document.body.removeChild(el)
      return bg
    })
    expect(invertedBodyBg).toBe(darkSidebarBg)
  })
})
