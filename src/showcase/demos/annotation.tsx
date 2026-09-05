import { useState, type ReactNode } from "react"
import { BookmarkIcon, CheckIcon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Canvas, CanvasContent, CanvasFooter, CanvasToolbar } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { ToolbarGroup, ToolbarSpacer } from "@/components/ui/toolbar"
import {
  AnnotationBand,
  AnnotationCallouts,
  AnnotationLayer,
} from "@/components/ui/annotation"

function AnnotationPreview({
  name,
  footnote,
  className = "max-w-md",
  children,
}: {
  name: string
  footnote: string
  className?: string
  children: (showing: boolean) => ReactNode
}) {
  const [grid, setGrid] = useState(true)
  const [showing, setShowing] = useState(true)

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <CanvasToolbar aria-label={`${name} controls`}>
        <span className="text-sm font-medium">{name}</span>
        <ToolbarSpacer />
        <ToolbarGroup>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={grid} onCheckedChange={(value) => setGrid(value === true)} />
            Grid
          </label>
        </ToolbarGroup>
        <ToolbarGroup>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={showing} onCheckedChange={(value) => setShowing(value === true)} />
            Annotations
          </label>
        </ToolbarGroup>
      </CanvasToolbar>
      <div className="w-full min-w-0">
        <Canvas annotationSpace className="w-full">
          <CanvasGrid active={grid} />
          <CanvasContent className={className}>{children(showing)}</CanvasContent>
        </Canvas>
        <CanvasFooter>{showing ? footnote : "Annotations hidden"}</CanvasFooter>
      </div>
    </div>
  )
}

function AnnotationCalloutsDemo() {
  return (
    <AnnotationPreview name="Anatomy" footnote="6 callouts / Dialog anatomy">
      {(showing) => <>
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
    </AnnotationPreview>
  )
}

function AnnotationDimensionsDemo() {
  return (
    <AnnotationPreview name="Dimensions" footnote="4 padding measurements / Dialog spacing" className="max-w-sm">
      {(showing) => <>
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

        <AnnotationLayer active={showing} kind="padding">
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
        active={showing}
        items={[
          { id: "top", target: "pad-top", side: "top", content: "24", label: true },
          { id: "right", target: "pad-right", side: "right", content: "24", label: true },
          { id: "bottom", target: "pad-bottom", side: "bottom", content: "24", label: true },
          { id: "left", target: "pad-left", side: "left", content: "24", label: true },
        ]}
        kind="padding"
      />
      </>}
    </AnnotationPreview>
  )
}

function AnnotationCornersDemo() {
  const [saved, setSaved] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <AnnotationPreview name="Corners" footnote="Card / Standard button / Pill / Circle" className="max-w-sm">
      {(showing) => <>
        <Card data-annotate="corner-card">
          <CardHeader>
            <CardTitle>Project settings</CardTitle>
            <CardDescription role="status">
              {saved ? "Your project settings are saved." : "Manage your workspace preferences."}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-wrap">
            <Button data-annotate="corner-button" variant="outline" onClick={() => setSaved(false)}>
              Cancel
            </Button>
            <Button data-annotate="corner-pill" className="rounded-full px-4" onClick={() => setSaved(true)}>
              Save
            </Button>
            <Button
              data-annotate="corner-circle"
              variant="outline"
              size="icon"
              className="ml-auto rounded-full"
              aria-label="Bookmark project"
              aria-pressed={bookmarked}
              onClick={() => setBookmarked((value) => !value)}
            >
              <BookmarkIcon className={bookmarked ? "fill-current" : undefined} />
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
    </AnnotationPreview>
  )
}

export const annotationDemos: ComponentEntry[] = [
  {
    slug: "annotation",
    name: "Annotations",
    description:
      "Measured anatomy callouts that keep labels clear of the specimen and each other, using alternate sides when the preferred placement cannot fit.",
    category: "Preview Tools",
    surface: "medium",
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
          "Tinted bands isolate the padding on each edge, with separate labels for the four spacing measurements.",
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
    code: `import { useState } from "react"
  import { CheckIcon } from "lucide-react"
import { AnnotationCallouts } from "@/components/ui/annotation"
import { Canvas, CanvasContent, CanvasFooter, CanvasToolbar } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { Checkbox } from "@/components/ui/checkbox"

export function DialogAnatomy() {
  const [grid, setGrid] = useState(true)
  const [showing, setShowing] = useState(true)

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <CanvasToolbar aria-label="Anatomy controls">
        <label className="flex items-center gap-2">
          <Checkbox checked={grid} onCheckedChange={(value) => setGrid(value === true)} />
          Grid
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={showing} onCheckedChange={(value) => setShowing(value === true)} />
          Annotations
        </label>
      </CanvasToolbar>
      <div className="w-full min-w-0">
        <Canvas annotationSpace>
          <CanvasGrid active={grid} />
          <CanvasContent className="max-w-md">
            <div data-annotate="card" className="rounded-2xl border bg-card p-6 shadow-sm">
              <div data-annotate="icon" className="mx-auto mb-4 flex size-10 items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                <CheckIcon className="size-5" />
              </div>
              <h3 className="text-center text-lg font-semibold">
                <span data-annotate="title">Dialog with hero icon</span>
              </h3>
              <p data-annotate="description" className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground">
                A dialog is a modal window that appears in front of app content to provide critical information or ask for a decision.
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
          </CanvasContent>
        </Canvas>
        <CanvasFooter>{showing ? "6 callouts / Dialog anatomy" : "Annotations hidden"}</CanvasFooter>
      </div>
    </div>
  )
}`,
  },
]
