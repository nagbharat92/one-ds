import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
  {
    variants: {
      variant: {
        default: "bg-border",
        // Fades to transparent at both ends so the rule dissolves into the page
        // instead of hard-stopping. Colour comes from the `border` token.
        faded:
          "bg-transparent from-transparent via-border to-transparent data-horizontal:bg-linear-to-r data-vertical:bg-linear-to-b",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Separator }
