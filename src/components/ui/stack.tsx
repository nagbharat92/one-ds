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
  "3xl": "gap-(--space-3xl)",
} as const

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: gapVariants,
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    divided: {
      true: "divide-y divide-(--separator-stroke)",
      false: "",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
    divided: false,
  },
})

function Stack({
  className,
  gap,
  align,
  justify,
  divided,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof stackVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="stack"
      data-divided={divided ? "" : undefined}
      className={cn(stackVariants({ gap, align, justify, divided }), className)}
      {...props}
    />
  )
}

export { Stack, stackVariants }
