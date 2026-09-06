import * as React from "react"

import { cn } from "@/lib/utils"
import type { AnnotationKind } from "@/components/ui/annotation"

const annotationLegendLabels: Record<AnnotationKind, string> = {
  bounds: "Bounds",
  padding: "Padding",
  border: "Border",
  margin: "Margin",
  gap: "Gap",
}
const annotationLegendKinds: AnnotationKind[] = ["bounds", "padding", "border", "margin", "gap"]

function AnnotationLegend({
  kinds = annotationLegendKinds,
  className,
  ...props
}: React.ComponentProps<"span"> & { kinds?: readonly AnnotationKind[] }) {
  return (
    <span
      aria-label="Measurement legend"
      className={cn("flex flex-wrap items-center justify-center gap-x-(--annotation-legend-column-gap) gap-y-(--annotation-legend-row-gap)", className)}
      {...props}
    >
      {kinds.map(kind => (
        <span key={kind} data-annotation-kind={kind} className="inline-flex items-center gap-(--annotation-legend-label-gap)">
          <span aria-hidden="true" className="size-(--annotation-legend-dot-size) shrink-0 rounded-(--annotation-circle-radius) bg-(--annotation-color)" />
          {annotationLegendLabels[kind]}
        </span>
      ))}
    </span>
  )
}

export { AnnotationLegend }