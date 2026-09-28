import { defineConfig } from "vite"

export default defineConfig({
  build: {
    outDir: "consumer-package/dist",
    emptyOutDir: false,
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      entry: "src/consumer/material-theme.css",
      formats: ["es"],
      fileName: "material-theme",
      cssFileName: "material-theme",
    },
  },
})
