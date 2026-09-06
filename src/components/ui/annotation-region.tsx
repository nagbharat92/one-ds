import * as React from "react"

import { cn } from "@/lib/utils"
import { AnnotationBand, type AnnotationKind } from "@/components/ui/annotation"

function AnnotationRegion({
  target,
  kind,
  label,
  active = false,
  selected = false,
  disabled,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children" | "aria-label" | "aria-pressed"> & {
  target: string
  kind: AnnotationKind
  label: string
  active?: boolean
  selected?: boolean
}) {
  return (
    <AnnotationBand
      asChild
      kind={kind}
      data-annotate={target}
      className={cn(
        "absolute rounded-none pointer-events-auto cursor-pointer focus-visible:outline-(length:--annotation-region-focus-width) focus-visible:outline-current focus-visible:outline-offset-(--annotation-region-focus-offset)",
        className,
        !active && "invisible"
      )}
    >
      <button
        type="button"
        {...props}
        disabled={!active || disabled}
        aria-label={label}
        aria-pressed={active && selected}
      />
    </AnnotationBand>
  )
}

export { AnnotationRegion }