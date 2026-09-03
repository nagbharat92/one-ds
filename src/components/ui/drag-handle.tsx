import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const dragHandleVariants = cva("block shrink-0 rounded-full", {
  variants: {
    variant: {
      grabber: "bg-muted",
      grip: "bg-border",
    },
    orientation: {
      horizontal: "",
      vertical: "",
    },
  },
  compoundVariants: [
    {
      variant: "grabber",
      orientation: "horizontal",
      className:
        "h-(--drag-handle-thickness) w-(--drag-handle-grabber-length)",
    },
    {
      variant: "grabber",
      orientation: "vertical",
      className:
        "h-(--drag-handle-grabber-length) w-(--drag-handle-thickness)",
    },
    {
      variant: "grip",
      orientation: "horizontal",
      className: "h-(--drag-handle-thickness) w-(--drag-handle-grip-length)",
    },
    {
      variant: "grip",
      orientation: "vertical",
      className: "h-(--drag-handle-grip-length) w-(--drag-handle-thickness)",
    },
  ],
  defaultVariants: {
    variant: "grabber",
    orientation: "horizontal",
  },
})

function DragHandle({
  className,
  variant,
  orientation,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof dragHandleVariants>) {
  return (
    <span
      data-slot="drag-handle"
      data-variant={variant ?? "grabber"}
      data-orientation={orientation ?? "horizontal"}
      className={cn(dragHandleVariants({ variant, orientation }), className)}
      {...props}
    />
  )
}

export { DragHandle }