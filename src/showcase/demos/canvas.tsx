import { useState } from "react"
import { ArrowUpRightIcon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { AnnotationCallouts } from "@/components/ui/annotation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { Canvas, CanvasToolbar, CanvasContent, CanvasFooter } from "@/components/ui/canvas"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ToolbarGroup, ToolbarSpacer } from "@/components/ui/toolbar"

function CanvasWorkbenchDemo() {
  const [annotations, setAnnotations] = useState(false)
  const [grid, setGrid] = useState(true)
  const [upgraded, setUpgraded] = useState(false)

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <CanvasToolbar aria-label="Billing preview controls">
        <span className="text-sm font-medium">Billing</span>
        <ToolbarSpacer />
        <ToolbarGroup>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={grid} onCheckedChange={(value) => setGrid(value === true)} />
            Grid
          </label>
        </ToolbarGroup>
        <ToolbarGroup>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={annotations} onCheckedChange={(value) => setAnnotations(value === true)} />
            Annotations
          </label>
        </ToolbarGroup>
      </CanvasToolbar>
      <div className="w-full min-w-0">
        <Canvas annotationSpace className="w-full">
          <CanvasGrid active={grid} />
          <CanvasContent className="max-w-sm">
            <Card data-annotate="plan">
              <CardHeader>
                <CardTitle>{upgraded ? "Your Pro plan" : "Upgrade your plan"}</CardTitle>
                <CardDescription>
                  {upgraded ? "Your team now has room to grow." : "Add more seats and shared projects for your team."}
                </CardDescription>
                <CardAction>
                  <Badge variant="secondary">{upgraded ? "Pro" : "Free"}</Badge>
                </CardAction>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => setUpgraded((value) => !value)}>
                  <ArrowUpRightIcon data-icon="inline-start" />
                  {upgraded ? "Return to Free" : "Upgrade to Pro"}
                </Button>
              </CardFooter>
            </Card>
            <AnnotationCallouts
              active={annotations}
              items={[{ id: "plan", target: "plan", side: "bottom", content: "Plan", label: true }]}
            />
          </CanvasContent>
        </Canvas>
        <CanvasFooter>
          <span role="status">{upgraded ? "Pro plan / 10 seats" : "Free plan / 1 seat"}</span>
        </CanvasFooter>
      </div>
    </div>
  )
}

export const canvasDemos: ComponentEntry[] = [
  {
    slug: "canvas",
    name: "Canvas",
    description:
      "A reusable preview surface with a separate product toolbar, centered content, and an optional footnote below the canvas. Annotations compose inside the content region.",
    category: "Preview Tools",
    surface: "medium",
    installCommand: null,
    ownsCanvas: true,
    defaultExampleHeader: {
      style: "inline",
      description: "A token-scaled measurement grid with rulers, cursor tracking, and optional annotations around the specimen.",
    },
    Demo: CanvasWorkbenchDemo,
    code: `import { Canvas, CanvasToolbar, CanvasContent, CanvasFooter } from "@/components/ui/canvas"
  import { CanvasGrid } from "@/components/ui/canvas-grid"
import { Button } from "@/components/ui/button"

export function Preview() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <CanvasToolbar aria-label="Product controls">
        <Button variant="outline">Settings</Button>
      </CanvasToolbar>
      <div className="w-full min-w-0">
        <Canvas annotationSpace>
          <CanvasGrid />
          <CanvasContent className="max-w-sm">
            <Button>Save changes</Button>
          </CanvasContent>
        </Canvas>
        <CanvasFooter>Draft</CanvasFooter>
      </div>
    </div>
  )
}`,
  },
]

export const canvasGridDemos: ComponentEntry[] = [
  {
    ...canvasDemos[0],
    slug: "canvas-grid",
    name: "Canvas Grid",
    description:
      "A spacing-token measurement layer with top and left rulers, CSS-pixel coordinates, and primary-accent cursor markers. The overlay leaves the specimen fully interactive.",
  },
]