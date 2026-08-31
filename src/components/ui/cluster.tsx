import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const clusterVariants = cva("flex", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
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
  },
  defaultVariants: {
    gap: "sm",
    align: "center",
    wrap: true,
  },
})

function Cluster({
  className,
  gap,
  align,
  justify,
  wrap,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof clusterVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="cluster"
      className={cn(clusterVariants({ gap, align, justify, wrap }), className)}
      {...props}
    />
  )
}

export { Cluster, clusterVariants }
