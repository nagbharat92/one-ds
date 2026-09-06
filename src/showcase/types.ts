import type { ReactNode } from "react"
import type { CanvasLayout, CanvasBackground } from "@/components/ui/canvas"

export type ComponentExample = {
  name: string
  description?: string
  Demo: () => ReactNode
  code?: string
  layout?: CanvasLayout
  background?: CanvasBackground
  ownsCanvas?: boolean
} & (
  | { header?: "standard" }
  | { header: "inline"; description: string }
)

export type ComponentEntry = {
  slug: string
  name: string
  description: string
  category: string
  Demo: () => ReactNode
  code: string
  codeSource?: "complete"
  examples?: ComponentExample[]
  installCommand?: string | null
  defaultExampleHeader?: { style: "inline"; description: string }
  ownsCanvas?: boolean
  // Sizing tier for the page column + default preview canvas. Defaults to
  // "component" for library primitives and "application" for Blocks/Experiments;
  // set "medium" for a wider-than-docs page with a roomy but non-fullscreen canvas.
  surface?: "component" | "medium" | "application"
}

export const CATEGORY_ORDER = [
  "Blocks",
  "Experiments",
  "Preview Tools",
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
