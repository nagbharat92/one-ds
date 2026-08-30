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
import { composedDemos } from "@/showcase/demos/composed"

export type { ComponentEntry, ComponentExample } from "@/showcase/types"

export const registry: ComponentEntry[] = [
  ...formsDemos,
  ...selectionDemos,
  ...overlaysDemos,
  ...navigationDemos,
  ...dataDemos,
  ...feedbackDemos,
  ...layoutDemos,
  ...chatDemos,
  ...miscDemos,
  ...composedDemos,
]

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
