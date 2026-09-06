import * as React from "react"
import { useState } from "react"
import { ImageIcon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Button } from "@/components/ui/button"
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ToolbarGroup } from "@/components/ui/toolbar"
import { Canvas, CanvasWorkbench, CanvasToolbar, CanvasContent, CanvasFooter } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { useCanvasPreviewState } from "@/components/ui/canvas-preview"
import {
  AnnotationBand,
  AnnotationCallouts,
  AnnotationLayer,
} from "@/components/ui/annotation"

// One control (the outer radius) drives padding and every inner corner; the
// relationships live in CSS calc(), so only the raw radius is injected here.
const PAD_RATIO = 0.5
const MIN_RADIUS = 8
const MAX_RADIUS = 48
// Padding (and every gap) never drops below this, so tight radii stay legible.
const MIN_PAD = 8

function Concentric() {
  const [radius, setRadius] = useState(20)
  const { grid, annotations: annotate, setGrid, setAnnotations: setAnnotate } = useCanvasPreviewState({ defaultGrid: true, defaultAnnotations: true })
  const padding = Math.max(Math.round(radius * PAD_RATIO), MIN_PAD)
  const inner = radius - padding

  // The media keeps a square minimum but stretches to the lockup height, so its
  // aspect ratio is measured live rather than assumed.
  const mediaRef = React.useRef<HTMLDivElement>(null)
  const [aspect, setAspect] = useState("1")
  React.useLayoutEffect(() => {
    const el = mediaRef.current
    if (!el) return
    const measure = () =>
      setAspect(el.offsetHeight ? (el.offsetWidth / el.offsetHeight).toFixed(2) : "1")
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      className="concentric-demo w-full min-w-0"
      style={
        {
          "--concentric-r": `${radius}px`,
          "--concentric-pad-ratio": PAD_RATIO,
        } as React.CSSProperties
      }
    >
      <Canvas layout="viewport" className="w-full">
      <CanvasGrid active={grid} />
      <CanvasWorkbench>
      <CanvasToolbar
        className="concentric-toolbar"
        aria-label="Concentric controls"
        data-annotate-avoid
      >
        <ToolbarGroup className="concentric-toolbar__control">
          <span className="concentric-toolbar__label">Corner radius</span>
          <Slider
            className="concentric-toolbar__slider"
            value={[radius]}
            min={MIN_RADIUS}
            max={MAX_RADIUS}
            step={1}
            onValueChange={(value) => setRadius(value[0] ?? MIN_RADIUS)}
            aria-label="Corner radius"
            aria-valuetext={`${radius} pixels`}
          />
        </ToolbarGroup>
        <CheckboxGroup className="concentric-toolbar__toggle" aria-label="Concentric display options" orientation="horizontal">
          <CheckboxGroupItem checked={grid} onCheckedChange={(value) => setGrid(value === true)} aria-label="Show grid">
            Grid
          </CheckboxGroupItem>
          <CheckboxGroupItem checked={annotate} onCheckedChange={(value) => setAnnotate(value === true)} aria-label="Show annotations">
            Annotations
          </CheckboxGroupItem>
        </CheckboxGroup>
      </CanvasToolbar>

      <CanvasContent className="concentric-stage">
        <div data-annotate="card" className="concentric-card">
          <div
            ref={mediaRef}
            data-annotate="media"
            className="concentric-card__media"
            aria-hidden="true"
          >
            <ImageIcon />
          </div>
          <AnnotationBand
            data-active={annotate}
            data-annotate="gap-media-text"
            kind="gap"
            className="concentric-gap-band"
          />
          <div data-annotate="body" className="concentric-card__body">
            <strong className="concentric-card__title">
              Concentric corners
            </strong>
            <span className="concentric-card__description">
              The image, buttons, and card share one center: each inner radius is
              the outer radius minus the padding.
            </span>
          </div>
          <AnnotationBand
            data-active={annotate}
            data-annotate="gap-text-actions"
            kind="gap"
            className="concentric-gap-band"
          />
          <div data-annotate="actions" className="concentric-card__actions">
            <Button variant="outline">Details</Button>
            <AnnotationBand
              data-active={annotate}
              data-annotate="gap-buttons"
              kind="gap"
              className="concentric-gap-band"
            />
            <Button data-annotate="action">Open</Button>
          </div>
        </div>

        <AnnotationLayer active={annotate} kind="padding" className="concentric-annotations">
          {/* A rounded border sitting over the padding: its outer corner is the
              card radius and the inner corner is automatically concentric, so it
              redraws the whole relationship as the slider moves. */}
          <div className="concentric-annotations__frame" aria-hidden="true" />
        </AnnotationLayer>

        {/* Numeric redlines use the shared measured-callout system: the radii ride
            on corner arcs that trace the actual curve, padding stays an edge chip. */}
        <AnnotationCallouts
          active={annotate}
          items={[
            {
              id: "outer",
              target: "card",
              side: "top-left",
              content: `outer ${radius}`,
              label: true,
            },
            {
              id: "padding",
              kind: "padding",
              target: "card",
              side: "right",
              content: `padding ${padding}`,
              label: true,
            },
            {
              id: "inner",
              target: "media",
              side: "bottom-left",
              content: `inner ${inner}`,
              label: true,
            },
            {
              id: "button",
              target: "action",
              side: "bottom-right",
              content: `button ${inner}`,
              label: true,
            },
            {
              id: "aspect",
              target: "media",
              side: "top",
              content: `aspect ${aspect}`,
              label: true,
            },
            {
              id: "gap-media-text",
              kind: "gap",
              target: "gap-media-text",
              side: "bottom",
              content: `gap ${padding}`,
              label: true,
              markerAlign: "target",
            },
            {
              id: "gap-text-actions",
              kind: "gap",
              target: "gap-text-actions",
              side: "bottom",
              content: `gap ${padding}`,
              label: true,
              markerAlign: "target",
            },
            {
              id: "gap-buttons",
              kind: "gap",
              target: "gap-buttons",
              side: "bottom",
              content: `gap ${padding}`,
              label: true,
              markerAlign: "target",
            },
          ]}
        />
      </CanvasContent>
      </CanvasWorkbench>
      </Canvas>

      <CanvasFooter className="concentric-equation">
        <span className="concentric-equation__term">
          inner <b>{inner}</b>
        </span>
        <span className="concentric-equation__op" aria-hidden="true">
          =
        </span>
        <span className="concentric-equation__term">
          outer <b>{radius}</b>
        </span>
        <span className="concentric-equation__op" aria-hidden="true">
          −
        </span>
        <span className="concentric-equation__term">
          padding <b>{padding}</b>
        </span>
      </CanvasFooter>
    </div>
  )
}

export const concentricDemos: ComponentEntry[] = [
  {
    slug: "concentric",
    name: "Concentric",
    description:
      "One radius slider drives padding and every inner corner mathematically: inner = outer − padding. Toggle annotations to redline the live values.",
    category: "Experiments",
    surface: "medium",
    installCommand: null,
    ownsCanvas: true,
    Demo: Concentric,
    code: `import * as React from "react"

import { Button } from "@/components/ui/button"
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ToolbarGroup } from "@/components/ui/toolbar"
import { Canvas, CanvasWorkbench, CanvasToolbar, CanvasContent, CanvasFooter } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { useCanvasPreviewState } from "@/components/ui/canvas-preview"
import {
  AnnotationBand,
  AnnotationCallouts,
  AnnotationLayer,
} from "@/components/ui/annotation"

// padding (and every gap) = max(radius * 0.5, 8); inner = radius - padding
export function Concentric() {
  const [radius, setRadius] = React.useState(20)
  const { grid, annotations: annotate, setGrid, setAnnotations: setAnnotate } = useCanvasPreviewState({ defaultGrid: true, defaultAnnotations: true })
  const padding = Math.max(Math.round(radius * 0.5), 8)
  const inner = radius - padding

  // Media keeps a square minimum but stretches to the lockup height.
  const mediaRef = React.useRef<HTMLDivElement>(null)
  const [aspect, setAspect] = React.useState("1")
  React.useLayoutEffect(() => {
    const el = mediaRef.current
    if (!el) return
    const measure = () =>
      setAspect(el.offsetHeight ? (el.offsetWidth / el.offsetHeight).toFixed(2) : "1")
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="concentric-demo w-full min-w-0" style={{ "--concentric-r": radius + "px" }}>
      <Canvas layout="viewport" className="w-full">
      <CanvasGrid active={grid} />
      <CanvasWorkbench>
      <CanvasToolbar className="concentric-toolbar" aria-label="Concentric controls">
        <ToolbarGroup className="concentric-toolbar__control">
          <span className="concentric-toolbar__label">Corner radius</span>
          <Slider
            className="concentric-toolbar__slider"
            value={[radius]}
            min={8}
            max={48}
            step={1}
            onValueChange={([value]) => setRadius(value)}
            aria-label="Corner radius"
            aria-valuetext={radius + " pixels"}
          />
        </ToolbarGroup>
        <CheckboxGroup className="concentric-toolbar__toggle" aria-label="Concentric display options" orientation="horizontal">
          <CheckboxGroupItem checked={grid} onCheckedChange={(value) => setGrid(value === true)} aria-label="Show grid">
            Grid
          </CheckboxGroupItem>
          <CheckboxGroupItem checked={annotate} onCheckedChange={(value) => setAnnotate(value === true)} aria-label="Show annotations">
            Annotations
          </CheckboxGroupItem>
        </CheckboxGroup>
      </CanvasToolbar>

      <CanvasContent className="concentric-stage">
        <div data-annotate="card" className="concentric-card">
          <div ref={mediaRef} data-annotate="media" className="concentric-card__media" />
          <AnnotationBand kind="gap" data-active={annotate} data-annotate="gap-media-text" className="concentric-gap-band" />
          <div data-annotate="body" className="concentric-card__body">
            <strong>Concentric corners</strong>
            <span>Inner radius = outer radius − padding.</span>
          </div>
          <AnnotationBand kind="gap" data-active={annotate} data-annotate="gap-text-actions" className="concentric-gap-band" />
          <div data-annotate="actions" className="concentric-card__actions">
            <Button variant="outline">Details</Button>
            <AnnotationBand kind="gap" data-active={annotate} data-annotate="gap-buttons" className="concentric-gap-band" />
            <Button data-annotate="action">Open</Button>
          </div>
        </div>

        {/* The frame draws the concentric relationship; the callouts label the
            live values with measured leaders, hover highlight, and collision-safe
            placement — the same system as the Annotation component. */}
        <AnnotationLayer active={annotate} kind="padding" className="concentric-annotations">
          <div className="concentric-annotations__frame" />
        </AnnotationLayer>

        <AnnotationCallouts
          active={annotate}
          items={[
            { id: "outer", target: "card", side: "top-left", content: \`outer \${radius}\`, label: true },
            { id: "aspect", target: "media", side: "top", content: \`aspect \${aspect}\`, label: true },
            { id: "padding", kind: "padding", target: "card", side: "right", content: \`padding \${padding}\`, label: true },
            { id: "inner", target: "media", side: "bottom-left", content: \`inner \${inner}\`, label: true },
            { id: "button", target: "action", side: "bottom-right", content: \`button \${inner}\`, label: true },
            { id: "gap-media-text", kind: "gap", target: "gap-media-text", side: "bottom", content: \`gap \${padding}\`, label: true, markerAlign: "target" },
            { id: "gap-text-actions", kind: "gap", target: "gap-text-actions", side: "bottom", content: \`gap \${padding}\`, label: true, markerAlign: "target" },
            { id: "gap-buttons", kind: "gap", target: "gap-buttons", side: "bottom", content: \`gap \${padding}\`, label: true, markerAlign: "target" },
          ]}
        />
      </CanvasContent>
      </CanvasWorkbench>
      </Canvas>

      <CanvasFooter className="concentric-equation">
        <span className="concentric-equation__term">inner <b>{inner}</b></span>
        <span className="concentric-equation__op" aria-hidden="true">=</span>
        <span className="concentric-equation__term">outer <b>{radius}</b></span>
        <span className="concentric-equation__op" aria-hidden="true">−</span>
        <span className="concentric-equation__term">padding <b>{padding}</b></span>
      </CanvasFooter>
    </div>
  )
}`,
  },
]
