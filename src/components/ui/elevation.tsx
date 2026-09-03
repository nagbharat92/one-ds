import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const elevationVariants = cva("", {
  variants: {
    level: {
      flat: "shadow-(--elevation-flat)",
      raised: "shadow-(--elevation-raised)",
      floating: "shadow-(--elevation-floating)",
    },
  },
  defaultVariants: {
    level: "flat",
  },
})

function Elevation({
  asChild = false,
  className,
  level = "flat",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof elevationVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      {...(!asChild ? { "data-slot": "elevation" } : {})}
      data-elevation={level}
      className={cn(elevationVariants({ level }), className)}
      {...props}
    />
  )
}

export { Elevation, elevationVariants }
