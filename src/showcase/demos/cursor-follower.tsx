import { useState } from "react"
import { MousePointer2Icon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Button } from "@/components/ui/button"
import { Canvas, CanvasContent, CanvasToolbar } from "@/components/ui/canvas"
import { CursorFollower, type CursorFollowerVariant } from "@/components/ui/cursor-follower"
import { ButtonGroupChoice, ButtonGroupChoiceItem } from "@/components/ui/button-group"

function CursorFollowerDemo() {
  const [variant, setVariant] = useState<CursorFollowerVariant>("surface")
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <CanvasToolbar aria-label="Cursor follower controls">
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <span>Appearance</span>
          <ButtonGroupChoice
            aria-label="Appearance"
            value={variant}
            onValueChange={(value) => {
              if (value === "surface" || value === "accent") setVariant(value)
            }}
          >
            <ButtonGroupChoiceItem value="surface">Surface</ButtonGroupChoiceItem>
            <ButtonGroupChoiceItem value="accent">Accent</ButtonGroupChoiceItem>
          </ButtonGroupChoice>
        </div>
      </CanvasToolbar>
      <Canvas className="w-full">
        <CanvasContent className="flex justify-center">
          <Button variant={saved ? "secondary" : "default"} onClick={() => setSaved((value) => !value)}>
            {saved ? "Saved" : "Save changes"}
          </Button>
        </CanvasContent>
        <CursorFollower variant={variant}>
          {({ x, y }) => (
            <span className="flex items-center gap-2">
              <MousePointer2Icon className="size-4 shrink-0" />
              <span className="font-mono tabular-nums">x {Math.round(x)} / y {Math.round(y)}</span>
            </span>
          )}
        </CursorFollower>
      </Canvas>
    </div>
  )
}

export const cursorFollowerDemos: ComponentEntry[] = [
  {
    slug: "cursor-follower",
    name: "Cursor Follower",
    category: "Preview Tools",
    surface: "medium",
    ownsCanvas: true,
    installCommand: null,
    description: "A compact pointer-following ornament with a pill shape, theme-aware shadow, and edge-aware placement. Surface is the default; Accent is an explicit color option.",
    defaultExampleHeader: {
      style: "inline",
      description: "Compact surface and compact accent ornaments follow the pointer without blocking the underlying controls.",
    },
    Demo: CursorFollowerDemo,
    code: `import { Canvas } from "@/components/ui/canvas"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { Button } from "@/components/ui/button"

export function Preview() {
  return (
    <Canvas>
      <Button>Save changes</Button>
      <CursorFollower>
        {({ x, y }) => <span>x {Math.round(x)} / y {Math.round(y)}</span>}
      </CursorFollower>
    </Canvas>
  )
}`,
  },
]