import { SearchIcon, PlusIcon, DownloadIcon } from "@/components/ui/icons"

import { iconSizes, type IconBoxSize } from "@/components/ui/icon"
import { IconPreview, IconPreviewGroup } from "@/components/ui/icon-preview"
import { CanvasPreview } from "@/components/ui/canvas-preview"
import { Cluster } from "@/components/ui/cluster"
import { Button } from "@/components/ui/button"
import type { ComponentEntry } from "@/showcase/types"

function IconSizesDemo() {
  return (
    <CanvasPreview name="SVG sizes" annotationsAvailable defaultAnnotations contentClassName="max-w-none">
      {({ annotations }) => <IconPreviewGroup>
        {iconSizes.map(size => <IconPreview key={size} icon={SearchIcon} size={size} annotations={annotations} caption={`${size}px SVG / 48px box`} />)}
      </IconPreviewGroup>}
    </CanvasPreview>
  )
}

const boxSizes: IconBoxSize[] = [20, 24, 28, 32, 40, 48, 56]

function IconBoxesDemo() {
  return (
    <CanvasPreview name="Box sizes" annotationsAvailable defaultAnnotations contentClassName="max-w-none">
      {({ annotations }) => <IconPreviewGroup>
        {boxSizes.map(boxSize => <IconPreview key={boxSize} icon={SearchIcon} size={20} boxSize={boxSize} annotations={annotations} caption={`${boxSize}px box / 20px SVG`} />)}
      </IconPreviewGroup>}
    </CanvasPreview>
  )
}

function IconControlsDemo() {
  return <Cluster gap="md" justify="center">
    <Button variant="tertiary"><DownloadIcon size={20} />Download</Button>
    <Button variant="secondary" size="expressive"><DownloadIcon size={24} />Download</Button>
    <Button variant="ghost" size="icon" aria-label="Add item"><PlusIcon size={20} /></Button>
    <Button variant="ghost" size="icon-expressive" aria-label="Search library"><SearchIcon size={24} /></Button>
    <SearchIcon size={20} label="Search" />
  </Cluster>
}

export const iconDemos: ComponentEntry[] = [{
  slug: "icon",
  name: "Icons",
  category: "Utilities",
  surface: "default",
  description: "Material Symbols Rounded is the site's icon library. The self-hosted variable font supports a continuous outline-to-fill transition. Icon owns the SVG viewport and accessibility; IconBox owns an independent centered square. Viewport dimensions include internal whitespace, not just painted bounds.",
  installCommand: null,
  codeSource: "complete",
  code: "",
  ownsCanvas: true,
  defaultExampleName: "SVG sizes",
  defaultExampleHeader: { style: "inline", description: "8px legacy avatar badges; 12px badges and compact indicators; 14px checks and chevrons; 16px menus and navigation; 20px default buttons; 24px expressive buttons and FABs; 28px and 32px focal experiment icons. All use the same 48px inspection box. Annotations expose measured box and SVG viewport dimensions on selection." },
  Demo: IconSizesDemo,
  examples: [
    { name: "Box sizes", ownsCanvas: true, header: "inline", description: "A fixed 20px SVG centered in independently sized boxes. IconBox is layout only, not a button or hit target. Smaller boxes are available for matching the smaller glyph sizes.", Demo: IconBoxesDemo },
    { name: "In controls", description: "20px default and 24px expressive icons. Decorative glyphs are hidden; the button owns its name and tooltip. Selected buttons smoothly animate Material's FILL axis from outlined to filled. Reduced motion changes the state immediately.", Demo: IconControlsDemo },
  ],
}]