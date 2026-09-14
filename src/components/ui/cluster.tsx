import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const gapVariants = {
  none: "gap-(--space-none)",
  xs: "gap-(--space-2xs)",
  sm: "gap-(--space-xs)",
  md: "gap-(--space-md)",
  lg: "gap-(--space-lg)",
  xl: "gap-(--space-xl)",
  "2xl": "gap-(--space-2xl)",
} as const

const clusterVariants = cva("flex", {
  variants: {
    gap: gapVariants,
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    divided: {
      true: "divide-x divide-(--separator-stroke)",
      false: "",
    },
  },
  defaultVariants: {
    gap: "sm",
    align: "center",
    wrap: true,
    divided: false,
  },
})

function Cluster({
  className,
  gap,
  align,
  justify,
  wrap,
  divided,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof clusterVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="cluster"
      data-divided={divided ? "" : undefined}
      className={cn(clusterVariants({ gap, align, justify, wrap, divided }), className)}
      {...props}
    />
  )
}

export { Cluster, clusterVariants }
