import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const toolbarVariants = cva(
  "flex bg-clip-padding gap-3 rounded-(--tb-radius) [--tb-inner:var(--radius-lg)] [--tb-pad:calc(var(--spacing)*3)] [--tb-pad-ends:var(--tb-pad)] [--tb-radius:calc(var(--tb-inner)+var(--tb-pad))]",
  {
    variants: {
      variant: {
        default: "border bg-card",
        muted: "bg-muted",
        ghost: "bg-transparent",
      },
      orientation: {
        horizontal: "flex-row flex-wrap items-center px-(--tb-pad-ends) py-(--tb-pad)",
        vertical: "w-fit flex-col items-stretch px-(--tb-pad) py-(--tb-pad-ends)",
      },
      sticky: {
        true: "sticky top-0 z-30 supports-backdrop-filter:backdrop-blur",
        false: "",
      },
    },
    compoundVariants: [
      // Full-bleed sticky bar: drop the side/top border and rounding, add a
      // translucent surface that frosts over content scrolling beneath it.
      {
        sticky: true,
        variant: "default",
        className:
          "rounded-none! border-x-0 border-t-0 bg-card/95 supports-backdrop-filter:bg-card/60",
      },
    ],
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
      sticky: false,
    },
  }
)

type ToolbarOrientation = "horizontal" | "vertical"

const ToolbarContext = React.createContext<{ orientation: ToolbarOrientation }>({
  orientation: "horizontal",
})

function Toolbar({
  className,
  variant,
  orientation = "horizontal",
  sticky,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof toolbarVariants>) {
  return (
    <ToolbarContext.Provider
      value={{ orientation: orientation ?? "horizontal" }}
    >
      <div
        role="toolbar"
        data-slot="toolbar"
        data-orientation={orientation}
        aria-orientation={orientation ?? undefined}
        className={cn(
          toolbarVariants({ variant, orientation, sticky }),
          className
        )}
        {...props}
      />
    </ToolbarContext.Provider>
  )
}

function ToolbarGroup({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(ToolbarContext)
  return (
    <div
      data-slot="toolbar-group"
      className={cn(
        "flex items-center gap-1",
        orientation === "vertical" && "flex-col items-stretch",
        className
      )}
      {...props}
    />
  )
}

/** Edge text receives mirrored optical padding; interior text and controls do not. */
function ToolbarTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toolbar-title"
      className={cn("min-w-0 text-sm font-medium", className)}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  orientation: orientationProp,
  ...props
}: React.ComponentProps<typeof Separator>) {
  const { orientation } = React.useContext(ToolbarContext)
  // The separator runs across the toolbar's cross axis.
  const resolved =
    orientationProp ??
    (orientation === "vertical" ? "horizontal" : "vertical")
  return (
    <Separator
      data-slot="toolbar-separator"
      orientation={resolved}
      className={cn(
        resolved === "vertical" ? "mx-1 h-6!" : "my-1 w-full",
        className
      )}
      {...props}
    />
  )
}

function ToolbarSpacer({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(ToolbarContext)
  return (
    <div
      data-slot="toolbar-spacer"
      aria-hidden="true"
      className={cn(
        orientation === "vertical" ? "mt-auto" : "ml-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
  ToolbarSeparator,
  ToolbarSpacer,
  toolbarVariants,
}
