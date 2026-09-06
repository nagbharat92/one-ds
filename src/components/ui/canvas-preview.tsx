import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas, CanvasContent, CanvasFooter, CanvasToolbar } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox"
import { ToolbarSpacer, ToolbarTitle } from "@/components/ui/toolbar"

type CanvasPreviewState = { grid: boolean; annotations: boolean }
type CanvasPreviewDefaults = { defaultGrid?: boolean; defaultAnnotations?: boolean }

function useCanvasPreviewState({ defaultGrid = false, defaultAnnotations = false }: CanvasPreviewDefaults = {}) {
  const [grid, setGrid] = React.useState(defaultGrid)
  const [annotations, setAnnotations] = React.useState(defaultAnnotations)
  return { grid, annotations, setGrid, setAnnotations }
}

function CanvasPreviewControls({
  name,
  grid,
  annotations = false,
  annotationsAvailable = false,
  onGridChange,
  onAnnotationsChange,
  children,
  ...props
}: React.ComponentProps<typeof CanvasToolbar> & {
  name: string
  grid: boolean
  annotations?: boolean
  annotationsAvailable?: boolean
  onGridChange: (value: boolean) => void
  onAnnotationsChange?: (value: boolean) => void
}) {
  return (
    <CanvasToolbar aria-label={`${name} controls`} {...props}>
      <ToolbarTitle>{name}</ToolbarTitle>
      {children}
      <ToolbarSpacer />
      <CheckboxGroup aria-label={`${name} display options`} orientation="horizontal">
        <CheckboxGroupItem checked={grid} onCheckedChange={(value) => onGridChange(value === true)}>
          Grid
        </CheckboxGroupItem>
        {annotationsAvailable && <CheckboxGroupItem checked={annotations} onCheckedChange={(value) => onAnnotationsChange?.(value === true)}>
          Annotations
        </CheckboxGroupItem>}
      </CheckboxGroup>
    </CanvasToolbar>
  )
}

function CanvasPreview({
  name,
  footnote,
  contentClassName = "max-w-md",
  className,
  defaultGrid,
  defaultAnnotations,
  annotationsAvailable = false,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & CanvasPreviewDefaults & {
  name: string
  annotationsAvailable?: boolean
  footnote?: React.ReactNode | ((state: CanvasPreviewState) => React.ReactNode)
  contentClassName?: string
  children: (state: CanvasPreviewState) => React.ReactNode
}) {
  const { grid, annotations, setGrid, setAnnotations } = useCanvasPreviewState({ defaultGrid, defaultAnnotations })
  const state = { grid, annotations: annotationsAvailable && annotations }
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-6", className)} {...props}>
      <CanvasPreviewControls name={name} {...state} annotationsAvailable={annotationsAvailable} onGridChange={setGrid} onAnnotationsChange={setAnnotations} />
      <div className="w-full min-w-0">
        <Canvas annotationSpace={annotationsAvailable} className="w-full">
          <CanvasGrid active={grid} />
          <CanvasContent className={contentClassName}>{children(state)}</CanvasContent>
        </Canvas>
        {footnote !== undefined && (
          <CanvasFooter>{typeof footnote === "function" ? footnote(state) : footnote}</CanvasFooter>
        )}
      </div>
    </div>
  )
}

export { CanvasPreview, CanvasPreviewControls, useCanvasPreviewState }
export type { CanvasPreviewState, CanvasPreviewDefaults }