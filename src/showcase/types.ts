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
  defaultExampleName?: string
  ownsCanvas?: boolean
  surface?: "default" | "application"
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
