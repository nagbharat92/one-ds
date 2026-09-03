import type { ReactNode } from "react"

export type ComponentExample = {
  name: string
  description?: string
  Demo: () => ReactNode
  code?: string
  layout?: "center" | "start" | "wide" | "viewport" | "application"
}

export type ComponentEntry = {
  slug: string
  name: string
  description: string
  category: string
  Demo: () => ReactNode
  code: string
  examples?: ComponentExample[]
  installCommand?: string | null
  // Sizing tier for the page column + default preview canvas. Defaults to
  // "component" for library primitives and "application" for Blocks/Experiments;
  // set "medium" for a wider-than-docs page with a roomy but non-fullscreen canvas.
  surface?: "component" | "medium" | "application"
}

export const CATEGORY_ORDER = [
  "Blocks",
  "Experiments",
  "Forms",
  "Selection",
  "Overlays",
  "Navigation",
  "Data Display",
  "Feedback",
  "Layout",
  "Chat",
  "Date",
  "Utilities",
] as const
