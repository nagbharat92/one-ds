import type { ComponentProps } from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const materialSurfaces = {
  surface: "bg-(--md-sys-color-surface)",
  "surface-container-lowest": "bg-(--md-sys-color-surface-container-lowest)",
  "surface-container-low": "bg-(--md-sys-color-surface-container-low)",
  "surface-container": "bg-(--md-sys-color-surface-container)",
  "surface-container-high": "bg-(--md-sys-color-surface-container-high)",
  "surface-container-highest": "bg-(--md-sys-color-surface-container-highest)",
}

type MaterialSurfaceRole = keyof typeof materialSurfaces

function MaterialSurface({
  surface = "surface",
  content = "on-surface",
  asChild = false,
  className,
  ...props
}: ComponentProps<"div"> & {
  surface?: MaterialSurfaceRole
  content?: "on-surface" | "on-surface-variant"
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      {...(!asChild ? { "data-slot": "material-surface" } : {})}
      data-material-surface={surface}
      data-material-content={content}
      className={cn(materialSurfaces[surface], content === "on-surface"
        ? "text-(--md-sys-color-on-surface)" : "text-(--md-sys-color-on-surface-variant)", className)}
      {...props}
    />
  )
}

export { MaterialSurface }
export type { MaterialSurfaceRole }