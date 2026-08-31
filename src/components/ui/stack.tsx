import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const gapVariants = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
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
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
  },
})

function Stack({
  className,
  gap,
  align,
  justify,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof stackVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="stack"
      className={cn(stackVariants({ gap, align, justify }), className)}
      {...props}
    />
  )
}

export { Stack, stackVariants }
