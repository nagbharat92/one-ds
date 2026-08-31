import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const toolbarVariants = cva(
  "flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2",
  {
    variants: {
      sticky: {
        true: "sticky top-0 z-30 rounded-none border-x-0 border-t-0 bg-card/95 supports-backdrop-filter:bg-card/60 supports-backdrop-filter:backdrop-blur",
        false: "",
      },
    },
    defaultVariants: {
      sticky: false,
    },
  }
)

function Toolbar({
  className,
  sticky,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof toolbarVariants>) {
  return (
    <div
      role="toolbar"
      data-slot="toolbar"
      className={cn(toolbarVariants({ sticky }), className)}
      {...props}
    />
  )
}

function ToolbarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toolbar-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="toolbar-separator"
      orientation="vertical"
      className={cn("mx-1 h-6!", className)}
      {...props}
    />
  )
}

function ToolbarSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toolbar-spacer"
      aria-hidden="true"
      className={cn("ml-auto", className)}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
  toolbarVariants,
}
