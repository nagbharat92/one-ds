import { defineConfig } from "@playwright/test"

const externalURL = process.env.PREVIEW_TEST_BASE_URL

export default defineConfig({
  testDir: "./tests",
  testMatch: ["ai-composer.spec.ts", "toolbar-inspection.spec.ts", "design-rules.spec.ts", "button-motion.spec.ts", "color-theme.spec.ts", "pointer.spec.ts", "shapes.spec.ts", "material-icons.spec.ts", "list-item.spec.ts", "menu.spec.ts", "table.spec.ts", "site-header-footer.spec.ts"],
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: externalURL ?? "http://127.0.0.1:5185",
    browserName: "chromium",
    channel: process.env.PREVIEW_TEST_CHANNEL,
    headless: true,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: externalURL ? undefined : {
    command: "npm run dev -- --host 127.0.0.1 --port 5185 --strictPort --logLevel error",
    url: "http://127.0.0.1:5185",
    reuseExistingServer: !process.env.CI,
  },
})