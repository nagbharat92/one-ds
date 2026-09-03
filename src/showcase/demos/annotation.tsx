import { useState } from "react"
import { CheckIcon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AnnotationBand,
  AnnotationCallouts,
  AnnotationLayer,
} from "@/components/ui/annotation"

// A mock dialog documented with numbered callouts. Each red dot sits on a real
// element edge (icon, title text, description, Accept button, or the card); the
// leader elbows (rounded) out to a number, and hovering one highlights it,
// outlines its element, and fades the rest.
function AnnotationCalloutsDemo() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div data-annotate="card" className="rounded-2xl border bg-card p-6 shadow-sm">
        <div
          data-annotate="icon"
          className="mx-auto mb-4 flex size-10 items-center justify-center rounded-xl border bg-muted text-muted-foreground"
        >
          <CheckIcon className="size-5" />
        </div>
        <h3 className="text-center text-lg font-semibold">
          <span data-annotate="title">Dialog with hero icon</span>
        </h3>
        <p
          data-annotate="description"
          className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground"
        >
          A dialog is a modal window that appears in front of app content to
          provide critical information or ask for a decision.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-sm font-medium text-primary">
          <span>Cancel</span>
          <span data-annotate="accept">Accept</span>
        </div>
      </div>

      <AnnotationCallouts
        items={[
          { id: 1, target: "card", side: "left", content: 1 },
          { id: 2, target: "icon", side: "top", content: 2 },
          { id: 3, target: "title", side: "right", content: 3 },
          { id: 4, target: "description", side: "right", content: 4 },
          { id: 5, target: "accept", side: "right", content: 5 },
          { id: 6, target: "card", side: "bottom", content: 6 },
        ]}
      />
    </div>
  )
}

// Redline dimensions: tinted bands trace the padding frame while arcs trace the
// rounded corners; every measured value rides outside on the shared callout system.
function AnnotationDimensionsDemo() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        data-annotate="surface"
        className="relative overflow-hidden rounded-2xl border bg-card"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold">Basic dialog title</h3>
          <p className="mt-4 text-sm text-muted-foreground">
            A dialog is a modal window that appears in front of app content to
            provide critical information or prompt for a decision to be made.
          </p>
          <div className="mt-6 flex justify-end gap-6 text-sm font-medium text-primary">
            <span>Action 2</span>
            <span>Action 1</span>
          </div>
        </div>

        <AnnotationLayer>
          <AnnotationBand
            data-annotate="pad-top"
            className="absolute inset-x-0 top-0 h-6 rounded-none"
          />
          <AnnotationBand
            data-annotate="pad-right"
            className="absolute inset-y-0 right-0 w-6 rounded-none"
          />
          <AnnotationBand
            data-annotate="pad-bottom"
            className="absolute inset-x-0 bottom-0 h-6 rounded-none"
          />
          <AnnotationBand
            data-annotate="pad-left"
            className="absolute inset-y-0 left-0 w-6 rounded-none"
          />
        </AnnotationLayer>
      </div>

      <AnnotationCallouts
        items={[
          { id: "top", target: "pad-top", side: "top", content: "24", label: true },
          { id: "right", target: "pad-right", side: "right", content: "24", label: true },
          { id: "bottom", target: "pad-bottom", side: "bottom", content: "24", label: true },
          { id: "left", target: "pad-left", side: "left", content: "24", label: true },
          { id: "radius-tl", target: "surface", side: "top-left", content: "16", label: true },
          { id: "radius-br", target: "surface", side: "bottom-right", content: "16", label: true },
        ]}
      />
    </div>
  )
}

// The layer toggles as one unit on the checkbox. Labelled leaders use the same
// measured callout system: dots on the media and card edges, hover to highlight.
function AnnotationToggleDemo() {
  const [showing, setShowing] = useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="relative w-full">
        <div
          data-annotate="card"
          className="flex items-center gap-3 rounded-xl border bg-card p-3"
        >
          <div
            data-annotate="media"
            className="size-10 shrink-0 rounded-lg bg-muted"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Concentric corners</p>
            <p className="truncate text-sm text-muted-foreground">
              Inner radius = outer radius − padding.
            </p>
          </div>
        </div>

        <AnnotationCallouts
          active={showing}
          items={[
            { id: "media", target: "media", side: "top", content: "media 40", label: true },
            { id: "radius", target: "card", side: "right", content: "radius 12", label: true },
          ]}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox
          checked={showing}
          onCheckedChange={(value) => setShowing(value === true)}
          aria-label="Show annotations"
        />
        Show annotations
      </label>
    </div>
  )
}

export const annotationDemos: ComponentEntry[] = [
  {
    slug: "annotation",
    name: "Annotation",
    description:
      "A toggleable design-spec overlay for redlining a component: numbered callouts, dimension labels, spacing bands, and leader lines drawn on top of any surface.",
    category: "Utilities",
    surface: "medium",
    installCommand: null,
    Demo: AnnotationCalloutsDemo,
    examples: [
      {
        name: "Dimensions",
        description:
          "Tinted bands trace a padding frame and chips carry the measured values, like a spec redline.",
        Demo: AnnotationDimensionsDemo,
      },
      {
        name: "Toggle",
        description:
          "The whole layer is non-interactive and fades in and out as one unit — the same checkmark pattern the concentric lab uses.",
        Demo: AnnotationToggleDemo,
      },
    ],
    code: `import { AnnotationCallouts } from "@/components/ui/annotation"

// Mark target elements with data-annotate, then declare items referencing them.
// Each leader is measured onto its element's edge midpoint, stacks its number in
// the margin with a rounded elbow, and on hover highlights + outlines the element.
export function DialogAnatomy() {
  return (
    <div className="relative">
      <div data-annotate="card">
        <div data-annotate="icon" />
        <h3><span data-annotate="title">Dialog with hero icon</span></h3>
      </div>
      <AnnotationCallouts
        items={[
          { id: 1, target: "card", side: "left", content: 1 },
          { id: 2, target: "icon", side: "top", content: 2 },
          { id: 3, target: "title", side: "right", content: 3 },
        ]}
      />
    </div>
  )
}`,
  },
]
