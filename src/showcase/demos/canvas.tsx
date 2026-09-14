import { useState } from "react"
import { ArrowUpRightIcon } from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import { AnnotationCallouts } from "@/components/ui/annotation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanvasPreview } from "@/components/ui/canvas-preview"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function CanvasWorkbenchDemo() {
  const [upgraded, setUpgraded] = useState(false)

  return (
    <CanvasPreview
      annotationsAvailable
      name="Billing"
      defaultGrid
      contentClassName="max-w-sm"
      footnote={<span role="status">{upgraded ? "Pro plan / 10 seats" : "Free plan / 1 seat"}</span>}
    >
      {({ annotations }) => <>
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
      </>}
    </CanvasPreview>
  )
}

function CanvasSplitSurfacesDemo() {
  return (
    <div className="grid w-full grid-cols-2 items-center">
      <div className="flex justify-center">
        <Button variant="tertiary">Open details</Button>
      </div>
      <div className="flex justify-center">
        <Button variant="tertiary">Open details</Button>
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
    surface: "default",
    installCommand: null,
    ownsCanvas: true,
    defaultExampleHeader: {
      style: "inline",
      description: "A token-scaled measurement grid with rulers, cursor tracking, and optional annotations around the specimen.",
    },
    Demo: CanvasWorkbenchDemo,
    code: generatedExampleCode["canvas:Default"],
    examples: [
      {
        name: "Split surfaces",
        description: "The same control shown on the card and sidebar fills, separated at the canvas midpoint.",
        background: "split",
        Demo: CanvasSplitSurfacesDemo,
      },
    ],
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