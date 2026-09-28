import type { ComponentEntry } from "@/showcase/types"
import { CanvasPreview } from "@/components/ui/canvas-preview"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { SearchInput } from "@/components/ui/input"
import { UsersIcon } from "@/components/ui/icons"

function ItemsPlaygroundDemo() {
  return (
    <CanvasPreview name="Items" contentClassName="max-w-md">
      {() => (
        <div className="flex w-full flex-col gap-(--space-lg)">
          <ItemGroup className="w-full">
            <Item variant="outline">
              <ItemMedia variant="icon">
                <UsersIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Design</ItemTitle>
                <ItemDescription>Team workspace</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
          <SearchInput placeholder="Search items" aria-label="Search items" />
        </div>
      )}
    </CanvasPreview>
  )
}

export const itemsExperimentDemos: ComponentEntry[] = [
  {
    slug: "items",
    name: "Items",
    description: "A list item with icon and a search input stacked in one preview.",
    category: "Experiments",
    ownsCanvas: true,
    Demo: ItemsPlaygroundDemo,
    code: `import { CanvasPreview } from "@/components/ui/canvas-preview"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { SearchInput } from "@/components/ui/input"
import { UsersIcon } from "@/components/ui/icons"

<CanvasPreview name="Items" contentClassName="max-w-md">
  {() => (
    <div className="flex w-full flex-col gap-(--space-lg)">
      <ItemGroup className="w-full">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <UsersIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Design</ItemTitle>
            <ItemDescription>Team workspace</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <SearchInput placeholder="Search items" aria-label="Search items" />
    </div>
  )}
</CanvasPreview>`,
  },
]
