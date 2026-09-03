import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const swapVariants = cva(
  // Every item shares one grid cell, so the box is sized by its largest child
  // and never reflows as the active one changes.
  "grid min-w-0 [&>*]:col-start-1 [&>*]:row-start-1",
  {
    variants: {
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
      },
      justify: {
        start: "justify-items-start",
        center: "justify-items-center",
        end: "justify-items-end",
      },
    },
    defaultVariants: {
      align: "center",
      justify: "start",
    },
  }
)

function Swap({
  className,
  align,
  justify,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof swapVariants>) {
  return (
    <div
      data-slot="swap"
      className={cn(swapVariants({ align, justify }), className)}
      {...props}
    />
  )
}

function SwapItem({
  active = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { active?: boolean }) {
  return (
    <div
      data-slot="swap-item"
      data-active={active}
      // The inactive item stays laid out but must not be reachable or read.
      inert={!active}
      className={cn(
        "max-w-full min-w-0 transition-opacity duration-(--swap-speed) ease-(--swap-ease) data-[active=false]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

export { Swap, SwapItem, swapVariants }
