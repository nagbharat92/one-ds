import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const containerVariants = cva("w-full", {
  variants: {
    size: {
      prose: "max-w-(--container-max-width-prose)",
      sm: "max-w-(--container-max-width-sm)",
      md: "max-w-(--container-max-width-md)",
      lg: "max-w-(--container-max-width-lg)",
      xl: "max-w-(--container-max-width-xl)",
      full: "max-w-none",
    },
    gutter: {
      true: "px-(--container-gutter-sm) sm:px-(--container-gutter-md) lg:px-(--container-gutter-lg)",
      false: "",
    },
    align: {
      center: "mx-auto",
      start: "mr-auto ml-0",
      end: "ml-auto mr-0",
    },
  },
  defaultVariants: {
    size: "lg",
    gutter: true,
    align: "center",
  },
})

function Container({
  className,
  size,
  gutter,
  align,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof containerVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="container"
      data-size={size ?? "lg"}
      className={cn(containerVariants({ size, gutter, align }), className)}
      {...props}
    />
  )
}

export { Container, containerVariants }
