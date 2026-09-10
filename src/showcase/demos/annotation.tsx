import { useState } from "react"
import { BookmarkIcon, CheckIcon } from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CanvasPreview } from "@/components/ui/canvas-preview"
import { AnnotationLegend } from "@/components/ui/annotation-legend"
import { AnnotationMeasurements, type AnnotationMeasurementTarget } from "@/components/ui/annotation-measurements"
import {
  AnnotationCallouts,
} from "@/components/ui/annotation"

function AnnotationCalloutsDemo() {
  return (
    <CanvasPreview name="Anatomy" annotationsAvailable defaultGrid defaultAnnotations footnote={({ annotations }) => annotations ? "6 callouts / Dialog anatomy" : "Annotations hidden"}>
      {({ annotations: showing }) => <>
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
          <span data-annotate="cancel">Cancel</span>
          <span data-annotate="accept">Accept</span>
        </div>
      </div>

      <AnnotationCallouts
        active={showing}
        items={[
          { id: 1, target: "card", side: "left", content: 1 },
          { id: 2, target: "icon", side: "top", content: "2 Media", label: true },
          { id: 3, target: "title", side: "right", content: "Title", label: true },
          { id: 4, target: "description", side: "right", content: 4 },
          { id: 5, target: "accept", side: "right", content: "5 Accept", label: true },
          { id: 6, target: "cancel", side: "bottom", content: "Cancel", label: true },
        ]}
      />
      </>}
    </CanvasPreview>
  )
}

const dimensionTargets: AnnotationMeasurementTarget[] = [
  { target: "card", label: "Card", kinds: ["margin", "padding", "gap"] },
  { target: "header", label: "Header", kinds: ["padding", "gap"] },
  { target: "footer", label: "Footer", kinds: ["padding", "border", "gap"] },
  { target: "title", label: "Title", kinds: ["bounds"] },
]

function AnnotationDimensionsSpecimen({ active }: { active: boolean }) {
  const [saved, setSaved] = useState(false)

  return <>
    <div className="relative flow-root">
      <Card data-annotate="surface" data-measure="card" className="relative m-4">
        <CardHeader data-measure="header" className="relative">
          <div className="relative">
            <CardTitle data-measure="title" asChild><h3>Project settings</h3></CardTitle>
          </div>
          <CardDescription role="status">
            {saved ? "Your project settings are saved." : "Manage your workspace preferences and project details."}
          </CardDescription>
        </CardHeader>
        <CardFooter data-measure="footer" className="relative justify-end">
          <div className="relative">
            <Button variant="secondary" onClick={() => setSaved(false)}>Cancel</Button>
          </div>
          <Button onClick={() => setSaved(true)}>Save</Button>
        </CardFooter>
      </Card>
    </div>
    <AnnotationMeasurements active={active} targets={dimensionTargets} />
  </>
}

function AnnotationDimensionsDemo() {
  return (
    <CanvasPreview name="Dimensions" annotationsAvailable defaultGrid defaultAnnotations footnote={({ annotations }) => annotations ? <AnnotationLegend /> : "Annotations hidden"}>
      {({ annotations }) => <AnnotationDimensionsSpecimen active={annotations} />}
    </CanvasPreview>
  )
}

function AnnotationCornersDemo() {
  const [saved, setSaved] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <CanvasPreview name="Corners" annotationsAvailable defaultGrid defaultAnnotations footnote={({ annotations }) => annotations ? "Card / Standard button / Pill / Circle" : "Annotations hidden"} contentClassName="max-w-sm">
      {({ annotations: showing }) => <>
        <Card data-annotate="corner-card">
          <CardHeader>
            <CardTitle>Project settings</CardTitle>
            <CardDescription role="status">
              {saved ? "Your project settings are saved." : "Manage your workspace preferences."}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-wrap">
            <Button data-annotate="corner-button" variant="secondary" onClick={() => setSaved(false)}>
              Cancel
            </Button>
            <Button data-annotate="corner-pill" className="rounded-full px-4" onClick={() => setSaved(true)}>
              Save
            </Button>
            <Button
              data-annotate="corner-circle"
              variant="ghost"
              size="icon"
              className="ml-auto rounded-full"
              aria-label="Bookmark project"
              aria-pressed={bookmarked}
              onClick={() => setBookmarked((value) => !value)}
            >
              <BookmarkIcon data-selected={bookmarked} />
            </Button>
          </CardFooter>
        </Card>
        <AnnotationCallouts
          active={showing}
          items={[
            { id: "card", target: "corner-card", side: "top-left", content: "Card", label: true },
            { id: "button", target: "corner-button", side: "bottom-left", content: "Button", label: true },
            { id: "pill", target: "corner-pill", side: "bottom-right", content: "Pill", label: true },
            { id: "circle", target: "corner-circle", side: "top-right", content: "Circle", label: true },
          ]}
        />
      </>}
    </CanvasPreview>
  )
}

export const annotationDemos: ComponentEntry[] = [
  {
    slug: "annotation",
    name: "Annotations",
    description:
      "Measured anatomy callouts that keep labels clear of the specimen and each other, using alternate sides when the preferred placement cannot fit.",
    category: "Preview Tools",
    surface: "default",
    installCommand: null,
    ownsCanvas: true,
    defaultExampleHeader: {
      style: "inline",
      description: "Numbers, named labels, and numbered labels identify six distinct parts of the dialog, with grid measurements anchored to the specimen.",
    },
    Demo: AnnotationCalloutsDemo,
    examples: [
      {
        name: "Dimensions",
        ownsCanvas: true,
        header: "inline",
        description:
          "Colored regions identify bounds, padding, borders, margins, and gaps; selecting a region reveals its live dimensions.",
        Demo: AnnotationDimensionsDemo,
      },
      {
        name: "Corners",
        ownsCanvas: true,
        header: "inline",
        description:
          "Corner arcs trace a card, a standard button, a fully rounded pill, and a circular icon button using their rendered geometry.",
        Demo: AnnotationCornersDemo,
      },
    ],
    code: generatedExampleCode["annotation:Default"],
  },
]
