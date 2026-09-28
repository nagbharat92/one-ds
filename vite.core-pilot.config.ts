import { createHash } from "node:crypto"
import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import dts from "vite-plugin-dts"

function externalizeCoreFonts(): Plugin {
  return {
    name: "externalize-core-fonts",
    enforce: "post",
    generateBundle(_options, bundle) {
      const css = bundle["styles.css"]
      if (!css || css.type !== "asset" || typeof css.source !== "string") {
        throw new Error("Core pilot CSS was not generated")
      }

      const emitted = new Set<string>()
      let count = 0
      css.source = css.source.replace(/url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/g, (_match, encoded: string) => {
        const font = Buffer.from(encoded, "base64")
        const name = `fonts/${createHash("sha256").update(font).digest("hex").slice(0, 12)}.woff2`
        if (!emitted.has(name)) {
          this.emitFile({ type: "asset", fileName: name, source: font })
          emitted.add(name)
        }
        count += 1
        return `url("./${name}")`
      })
      if (count === 0) throw new Error("Core pilot fonts were not found in generated CSS")
      for (const fileName of ["styles.css.d.ts", "material-theme.css.d.ts"]) {
        this.emitFile({ type: "asset", fileName, source: "export {}\n" })
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: [
        "src/consumer/core-pilot.ts",
        "src/components/ui/button.tsx",
        "src/components/ui/alert.tsx",
        "src/components/ui/card.tsx",
        "src/components/ui/text.tsx",
        "src/components/ui/page-header.tsx",
        "src/components/ui/aspect-ratio.tsx",
        "src/components/ui/elevation.tsx",
        "src/components/ui/input.tsx",
        "src/components/ui/input-group.tsx",
        "src/components/ui/textarea.tsx",
        "src/components/ui/label.tsx",
        "src/components/ui/color-theme.tsx",
        "src/components/ui/material-theme.tsx",
        "src/components/ui/select.tsx",
        "src/components/ui/menu.ts",
        "src/components/ui/item.tsx",
        "src/components/ui/separator.tsx",
        "src/components/ui/badge.tsx",
        "src/components/ui/empty.tsx",
        "src/components/ui/shape.tsx",
        "src/components/ui/field.tsx",
        "src/components/ui/alert-dialog.tsx",
        "src/components/ui/progress.tsx",
        "src/components/ui/tabs.tsx",
        "src/components/ui/toolbar.tsx",
        "src/components/ui/sonner.tsx",
        "src/components/ui/dialog.tsx",
        "src/components/ui/drawer.tsx",
        "src/components/ui/drag-handle.tsx",
        "src/components/ui/dropdown-menu.tsx",
        "src/components/ui/collapsible.tsx",
        "src/components/ui/popover.tsx",
        "src/components/ui/radio-group.tsx",
        "src/components/ui/checkbox.tsx",
        "src/components/ui/switch.tsx",
        "src/components/ui/control-indicator.ts",
        "src/components/ui/scroller.tsx",
        "src/lib/shapes.ts",
        "src/hooks/use-open-on-mouse-up.ts",
        "src/hooks/use-scroller.ts",
        "src/components/ui/icon.tsx",
        "src/components/ui/icons.tsx",
        "src/components/ui/icon-adapters/*.tsx",
        "src/components/ui/icon-label.tsx",
        "src/components/ui/tooltip.tsx",
        "src/lib/utils.ts",
        "src/lib/hang.ts",
        "src/lib/color-theme.ts",
      ],
      outDirs: "consumer-package/dist",
      bundleTypes: true,
    }),
    externalizeCoreFonts(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    outDir: "consumer-package/dist",
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: "src/consumer/core-pilot.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rollupOptions: {
      external: (id) => /^(react|react-dom|radix-ui|vaul|class-variance-authority|clsx|tailwind-merge|next-themes|sonner|@material\/material-color-utilities)(?:\/|$)/.test(id),
    },
  },
})
