import { CATEGORY_ORDER, type ComponentEntry } from "@/showcase/types"
import { formsDemos } from "@/showcase/demos/forms"
import { selectionDemos } from "@/showcase/demos/selection"
import { overlaysDemos } from "@/showcase/demos/overlays"
import { navigationDemos } from "@/showcase/demos/navigation"
import { dataDemos } from "@/showcase/demos/data"
import { feedbackDemos } from "@/showcase/demos/feedback"
import { layoutDemos } from "@/showcase/demos/layout"
import { chatDemos } from "@/showcase/demos/chat"
import { miscDemos } from "@/showcase/demos/misc"
import { personaDemos } from "@/showcase/demos/persona"
import { composedDemos } from "@/showcase/demos/composed"
import { colorDemos } from "@/showcase/demos/colors"
import { blockDemos } from "@/showcase/demos/blocks"
import { experimentDemos } from "@/showcase/demos/experiments"
import { concentricDemos } from "@/showcase/experiments/concentric"
import { pointerDemos } from "@/showcase/experiments/pointer"
import { shapeDemos } from "@/showcase/experiments/shapes"
import { annotationDemos } from "@/showcase/demos/annotation"
import { canvasDemos, canvasGridDemos } from "@/showcase/demos/canvas"
import { cursorFollowerDemos } from "@/showcase/demos/cursor-follower"
import { dragHandleDemos } from "@/showcase/demos/drag-handle"
import { elevationDemos } from "@/showcase/demos/elevation"
import { fabDemos } from "@/showcase/demos/fab"
import { swapDemos } from "@/showcase/demos/swap"
import { referenceDemos } from "@/showcase/demos/reference"
import { iconDemos } from "@/showcase/demos/icons"

export type { ComponentEntry, ComponentExample } from "@/showcase/types"

export const registry: ComponentEntry[] = [
  ...iconDemos,
  ...referenceDemos,
  ...blockDemos,
  ...experimentDemos,
  ...concentricDemos,
  ...pointerDemos,
  ...shapeDemos,
  ...annotationDemos,
  ...canvasDemos,
  ...canvasGridDemos,
  ...cursorFollowerDemos,
  ...dragHandleDemos,
  ...elevationDemos,
  ...fabDemos,
  ...swapDemos,
  ...formsDemos,
  ...selectionDemos,
  ...overlaysDemos,
  ...navigationDemos,
  ...dataDemos,
  ...feedbackDemos,
  ...layoutDemos,
  ...chatDemos,
  ...miscDemos,
  ...personaDemos,
  ...colorDemos,
  ...composedDemos,
]

export const blockRegistry = registry.filter((item) => item.category === "Blocks")
export const experimentRegistry = registry.filter(
  (item) => item.category === "Experiments",
)
export const componentRegistry = registry.filter(
  (item) => item.category !== "Blocks" && item.category !== "Experiments" && item.category !== "Preview Tools",
)

export const previewRegistry = registry.filter((item) => item.category === "Preview Tools")

export type CategoryGroup = {
  category: string
  items: ComponentEntry[]
}

export const groupedRegistry: CategoryGroup[] = CATEGORY_ORDER.map(
  (category) => ({
    category,
    items: registry
      .filter((item) => item.category === category)
      .sort((left, right) => left.name.localeCompare(right.name)),
  }),
).filter((group) => group.items.length > 0)

// Build order: the sequence to tune components in, leaves before branches, so a
// page is only touched after every component it composes is already finalized.
const BUILD_ORDER: { label: string; slugs: string[] }[] = [
  {
    label: "Foundations",
    slugs: [
      "button", "input", "textarea", "label", "checkbox", "radio-group",
      "switch", "slider", "badge", "kbd", "avatar", "icon",
      "icon-label", "edge-text", "text", "typography", "separator", "aspect-ratio",
      "skeleton", "spinner", "progress", "elevation", "swap",
      "drag-handle",
    ],
  },
  {
    label: "Composites",
    slugs: [
      "button-group", "fab", "input-group", "input-otp", "field",
      "select", "native-select", "tabs", "breadcrumb",
      "pagination", "accordion", "collapsible", "alert", "tooltip", "card",
      "list-item", "table", "empty",
    ],
  },
  {
    label: "Molecules",
    slugs: [
      "form", "questionnaire", "combobox", "command", "dropdown-menu",
      "context-menu", "menubar", "navigation-menu", "calendar", "date-picker",
      "data-table", "chart", "carousel", "persona", "table-of-contents",
    ],
  },
  {
    label: "Overlays & shells",
    slugs: [
      "dialog", "alert-dialog", "drawer", "popover", "hover-card", "coachmark",
      "sonner", "sidebar", "site-header", "site-footer", "page", "page-header",
      "section", "container", "stack", "cluster", "toolbar", "scroll-area",
      "resizable",
    ],
  },
  {
    label: "Patterns",
    slugs: [
      "ai-composer", "bubble", "message", "response", "message-scroller",
      "attachment", "marker", "block-ai-chat",
    ],
  },
  {
    label: "Experiments & tools",
    slugs: [
      "expression-lab", "colors", "concentric", "pointer", "shapes",
      "annotation", "canvas", "canvas-grid", "cursor-follower",
    ],
  },
]

const entryBySlug = new Map(registry.map((item) => [item.slug, item]))

export const buildOrderRegistry: CategoryGroup[] = (() => {
  const assigned = new Set<string>()
  const groups = BUILD_ORDER.map((layer) => {
    const items = layer.slugs
      .map((slug) => entryBySlug.get(slug))
      .filter((item): item is ComponentEntry => Boolean(item))
    items.forEach((item) => assigned.add(item.slug))
    return { category: layer.label, items }
  }).filter((group) => group.items.length > 0)
  // Anything not yet placed (e.g. a newly added page) trails alphabetically.
  const rest = registry
    .filter((item) => !assigned.has(item.slug))
    .sort((left, right) => left.name.localeCompare(right.name))
  if (rest.length > 0) groups.push({ category: "More", items: rest })
  return groups
})()
