import { useState } from "react"
import { MousePointer2Icon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import { Button } from "@/components/ui/button"
import { Canvas, CanvasContent } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { CanvasPreviewControls, useCanvasPreviewState } from "@/components/ui/canvas-preview"
import { AnnotationCallouts } from "@/components/ui/annotation"
import { CursorFollower, type CursorFollowerVariant, type CursorPosition } from "@/components/ui/cursor-follower"
import { ButtonGroupChoice, ButtonGroupChoiceItem } from "@/components/ui/button-group"

function cursorFollowerContent({ x, y }: CursorPosition) {
  return (
    <span className="flex items-center gap-2">
      <MousePointer2Icon className="size-4 shrink-0" />
      <span className="font-mono tabular-nums">x {Math.round(x)} / y {Math.round(y)}</span>
    </span>
  )
}

function CursorFollowerDemo() {
  const [variant, setVariant] = useState<CursorFollowerVariant>("surface")
  const [saved, setSaved] = useState(false)
  const { grid, annotations, setGrid, setAnnotations } = useCanvasPreviewState({ defaultGrid: true, defaultAnnotations: true })

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <CanvasPreviewControls name="Cursor follower" annotationsAvailable grid={grid} annotations={annotations} onGridChange={setGrid} onAnnotationsChange={setAnnotations}>
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
      </CanvasPreviewControls>
      <Canvas annotationSpace className="w-full">
        <CanvasGrid active={grid} followerVariant={variant} followerContent={cursorFollowerContent} />
        <CanvasContent className="flex justify-center">
          <Button data-annotate="save" variant={saved ? "secondary" : "default"} onClick={() => setSaved((value) => !value)}>
            {saved ? "Saved" : "Save changes"}
          </Button>
          <AnnotationCallouts active={annotations} items={[{ id: "save", target: "save", side: "bottom", content: "Button", label: true }]} />
        </CanvasContent>
        {!grid && <CursorFollower variant={variant}>{cursorFollowerContent}</CursorFollower>}
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
    code: generatedExampleCode["cursor-follower:Default"],
  },
]