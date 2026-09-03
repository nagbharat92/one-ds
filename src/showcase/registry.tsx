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
import { annotationDemos } from "@/showcase/demos/annotation"
import { dragHandleDemos } from "@/showcase/demos/drag-handle"
import { elevationDemos } from "@/showcase/demos/elevation"
import { fabDemos } from "@/showcase/demos/fab"
import { swapDemos } from "@/showcase/demos/swap"

export type { ComponentEntry, ComponentExample } from "@/showcase/types"

export const registry: ComponentEntry[] = [
  ...blockDemos,
  ...experimentDemos,
  ...concentricDemos,
  ...annotationDemos,
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
  (item) => item.category !== "Blocks" && item.category !== "Experiments",
)

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
