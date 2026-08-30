import type { ReactNode } from "react"

export type ComponentExample = {
  name: string
  description?: string
  Demo: () => ReactNode
  code?: string
  layout?: "center" | "start" | "wide" | "viewport"
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
}

export const CATEGORY_ORDER = [
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
