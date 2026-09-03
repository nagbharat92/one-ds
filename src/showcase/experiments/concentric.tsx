import * as React from "react"
import { useState } from "react"
import { ImageIcon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/ui/toolbar"
import {
  AnnotationCallouts,
  AnnotationLayer,
} from "@/components/ui/annotation"

// One control (the outer radius) drives padding and every inner corner; the
// relationships live in CSS calc(), so only the raw radius is injected here.
const PAD_RATIO = 0.5
const MIN_RADIUS = 4
const MAX_RADIUS = 48

function Concentric() {
  const [radius, setRadius] = useState(20)
  const [annotate, setAnnotate] = useState(true)
  const padding = Math.round(radius * PAD_RATIO)
  const inner = radius - padding

  return (
    <div
      className="preview-canvas concentric-demo"
      style={
        {
          "--concentric-r": `${radius}px`,
          "--concentric-pad-ratio": PAD_RATIO,
        } as React.CSSProperties
      }
    >
      <Toolbar className="concentric-toolbar" aria-label="Concentric controls">
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
        <ToolbarSeparator />
        <ToolbarGroup className="concentric-toolbar__readout">
          {/* The relationship, live: inner = outer − padding. */}
          <span className="concentric-equation">
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
          </span>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup className="concentric-toolbar__toggle">
          <label className="concentric-toolbar__toggle-label">
            <Checkbox
              checked={annotate}
              onCheckedChange={(value) => setAnnotate(value === true)}
              aria-label="Show annotations"
            />
            Annotations
          </label>
        </ToolbarGroup>
      </Toolbar>

      <div className="concentric-stage">
        <div data-annotate="card" className="concentric-card">
          <div
            data-annotate="media"
            className="concentric-card__media"
            aria-hidden="true"
          >
            <ImageIcon />
          </div>
          <div className="concentric-card__body">
            <strong className="concentric-card__title">
              Concentric corners
            </strong>
            <span className="concentric-card__description">
              The image, buttons, and card share one center: each inner radius is
              the outer radius minus the padding.
            </span>
          </div>
          <div className="concentric-card__actions">
            <Button variant="outline">Details</Button>
            <Button>Open</Button>
          </div>
        </div>

        <AnnotationLayer active={annotate} className="concentric-annotations">
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
          ]}
        />
      </div>
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
    Demo: Concentric,
    code: `import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  AnnotationCallouts,
  AnnotationLayer,
} from "@/components/ui/annotation"

// padding = radius * 0.5; inner radius = radius - padding (concentric rule)
export function Concentric() {
  const [radius, setRadius] = useState(20)
  const [annotate, setAnnotate] = useState(true)
  const padding = Math.round(radius * 0.5)
  const inner = radius - padding

  return (
    <div className="concentric-demo" style={{ "--concentric-r": radius + "px" }}>
      <div className="flex items-center gap-4">
        <Slider value={[radius]} min={4} max={48} onValueChange={([v]) => setRadius(v)} />
        {/* Live equation: inner = outer − padding */}
        <span>
          inner <b>{inner}</b> = outer <b>{radius}</b> − padding <b>{padding}</b>
        </span>
        <label className="flex items-center gap-2">
          <Checkbox checked={annotate} onCheckedChange={(v) => setAnnotate(v === true)} />
          Annotations
        </label>
      </div>

      <div className="concentric-stage">
        <div data-annotate="card" className="concentric-card">
          <div data-annotate="media" className="concentric-card__media" />
          <div className="concentric-card__body">
            <strong>Concentric corners</strong>
            <span>Inner radius = outer radius − padding.</span>
          </div>
          <div className="concentric-card__actions">
            <Button variant="outline">Details</Button>
            <Button>Open</Button>
          </div>
        </div>

        {/* The frame draws the concentric relationship; the callouts label the
            live values with measured leaders, hover highlight, and collision-safe
            placement — the same system as the Annotation component. */}
        <AnnotationLayer active={annotate} className="concentric-annotations">
          <div className="concentric-annotations__frame" />
        </AnnotationLayer>

        <AnnotationCallouts
          active={annotate}
          items={[
            { id: "outer", target: "card", side: "top-left", content: \`outer \${radius}\`, label: true },
            { id: "padding", target: "card", side: "right", content: \`padding \${padding}\`, label: true },
            { id: "inner", target: "media", side: "bottom-left", content: \`inner \${inner}\`, label: true },
          ]}
        />
      </div>
    </div>
  )
}`,
  },
]
