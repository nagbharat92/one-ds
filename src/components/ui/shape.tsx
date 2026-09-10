import { useMemo, useState, type ComponentProps } from "react"
import { interpolate } from "flubber"

import { Button } from "@/components/ui/button"
import { ButtonGroupChoice, ButtonGroupChoiceItem } from "@/components/ui/button-group"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { shapeNames, shapePaths, type ShapeName } from "@/lib/shapes"
import { useShapeMorph } from "@/hooks/use-shape-playback"
import { Scroller } from "@/components/ui/scroller"
import { Canvas, CanvasToolbar } from "@/components/ui/canvas"
import { CanvasPreviewFrame } from "@/components/ui/canvas-preview"
import { Slider } from "@/components/ui/slider"
import { ToolbarGroup, ToolbarTitle } from "@/components/ui/toolbar"

type ShapeTone = "neutral" | "purple" | "pink"

function Shape({ name, tone = "purple", className, ...props }: Omit<ComponentProps<"svg">, "name"> & {
  name: ShapeName
  tone?: ShapeTone
}) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={shapePaths[name].label}
      data-slot="shape" data-shape={name} data-tone={tone} className={cn("shape", className)} {...props}>
      <path d={shapePaths[name].path} />
    </svg>
  )
}

function ShapePreview({ name, tone = "purple" }: { name: ShapeName; tone?: ShapeTone }) {
  return (
    <figure className="shape-preview" data-slot="shape-preview">
      <Shape name={name} tone={tone} />
      <figcaption aria-live="polite"><Text variant="label">{shapePaths[name].label}</Text></figcaption>
    </figure>
  )
}

function ShapeMorphPreview({ from, to, progress, tone = "purple" }: {
  from: ShapeName
  to: ShapeName
  progress: number
  tone?: ShapeTone
}) {
  const morph = useMemo(() => interpolate(shapePaths[from].path, shapePaths[to].path, { maxSegmentLength: 2 }), [from, to])
  return (
    <figure className="shape-preview" data-slot="shape-morph-preview">
      <svg viewBox="0 0 100 100" role="img" aria-label={`${shapePaths[from].label} to ${shapePaths[to].label}`}
        className="shape" data-tone={tone} data-progress={progress}>
        <path d={morph(Math.max(0, Math.min(1, progress)))} />
      </svg>
      <figcaption><Text variant="label">{shapePaths[from].label} / {shapePaths[to].label}</Text></figcaption>
    </figure>
  )
}

function ShapeGallery({ value, onValueChange, tone = "purple" }: {
  value: ShapeName
  onValueChange: (value: ShapeName) => void
  tone?: ShapeTone
}) {
  return (
    <div className="shape-gallery" role="group" aria-label="Shape library">
      {shapeNames.map(name => (
        <Button key={name} variant="tertiary" selected={value === name}
          aria-label={shapePaths[name].label} className="shape-gallery__choice"
          onClick={() => onValueChange(name)}>
          <span className="shape-gallery__graphic" aria-hidden="true"><Shape name={name} tone={tone} /></span>
          <span className="shape-gallery__label">
            <Text variant="metadata">{shapePaths[name].label}</Text>
          </span>
        </Button>
      ))}
    </div>
  )
}

function ShapeBrowser() {
  const [selected, setSelected] = useState<ShapeName>("circle")
  const [timing] = useState(() => {
    const tokens = getComputedStyle(document.documentElement)
    const read = (name: string) => Number(tokens.getPropertyValue(name))
    return { initial: read("--shape-morph-duration"), minimum: read("--shape-morph-duration-min"),
      maximum: read("--shape-morph-duration-max"), step: read("--shape-morph-duration-step") }
  })
  const [duration, setDuration] = useState(timing.initial)
  const [turns, setTurns] = useState("1")
  const { path, previewRef } = useShapeMorph(selected, duration, Number(turns))
  return (
    <CanvasPreviewFrame controls={
      <CanvasToolbar aria-label="Shape timing">
        <ToolbarGroup>
          <ToolbarTitle>Turns</ToolbarTitle>
          <ButtonGroupChoice value={turns} onValueChange={setTurns} aria-label="Spin turns">
            {["1", "3", "5"].map(value => (
              <ButtonGroupChoiceItem key={value} value={value} aria-label={`${value} ${value === "1" ? "turn" : "turns"}`}>{value}</ButtonGroupChoiceItem>
            ))}
          </ButtonGroupChoice>
        </ToolbarGroup>
        <ToolbarTitle>Duration</ToolbarTitle>
        <Slider className="min-w-0 flex-1" aria-label="Morph duration" min={timing.minimum} max={timing.maximum}
          step={timing.step} value={[duration]} onValueChange={values => setDuration(values[0])}
          aria-valuetext={`${duration} milliseconds`} />
        <ToolbarTitle><output className="shape-duration">{duration} ms</output></ToolbarTitle>
      </CanvasToolbar>
    }>
    <Canvas layout="wide" padding="none">
    <div className="shape-browser" data-slot="shape-browser">
      <figure className="shape-preview" data-slot="shape-morph-preview">
        <svg ref={previewRef} viewBox="0 0 100 100" role="img" aria-label={shapePaths[selected].label}
          className="shape" data-tone="purple" data-shape={selected}>
          <path d={path} />
        </svg>
        <figcaption aria-live="polite"><Text variant="label">{shapePaths[selected].label}</Text></figcaption>
      </figure>
      <Scroller className="shape-browser__list" role="region" aria-label="Scrollable shapes" tabIndex={0}>
        <ShapeGallery value={selected} onValueChange={setSelected} />
      </Scroller>
    </div>
    </Canvas>
    </CanvasPreviewFrame>
  )
}

export { Shape, ShapePreview, ShapeMorphPreview, ShapeGallery, ShapeBrowser }
export type { ShapeTone }