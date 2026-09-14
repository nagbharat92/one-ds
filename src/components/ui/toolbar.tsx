import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const toolbarVariants = cva(
  "flex bg-clip-padding rounded-(--tb-radius)",
  {
    variants: {
      variant: {
        default: "border bg-card",
        muted: "bg-muted",
        ghost: "bg-transparent",
        floating:
          "w-fit border bg-card shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke)",
      },
      size: {
        default: "gap-(--space-sm)",
        expressive: "gap-(--space-xs)",
      },
      shape: {
        default: "",
        pill: "",
      },
      orientation: {
        horizontal: "flex-row flex-wrap items-center px-(--tb-pad-ends) py-(--tb-pad)",
        vertical: "w-fit flex-col items-center px-(--tb-pad) py-(--tb-pad-ends)",
      },
      sticky: {
        true: "sticky top-0 z-30 supports-backdrop-filter:backdrop-blur",
        false: "",
      },
    },
    compoundVariants: [
      // size: default + shape: default (standard rectangular toolbar with 10px controls)
      // Concentric rule: outer = inner (10) + pad (12) + border (1) = 23px
      {
        size: "default",
        shape: "default",
        className:
          "[--tb-inner:var(--radius-lg)] [--tb-pad:calc(var(--spacing)*3)] [--tb-pad-ends:var(--tb-pad)] [--tb-border:1px] [--tb-radius:calc(var(--tb-inner)+var(--tb-pad)+var(--tb-border))]",
      },
      // size: default + shape: pill (concentric capsule toolbar with 40px round controls)
      // Height = 40 + 2*8 + 2*1 = 58px. Concentric outer radius = 20 + 8 + 1 = 29px = 58/2
      {
        size: "default",
        shape: "pill",
        className:
          "[--tb-inner:calc(var(--button-height-default)/2)] [--tb-pad:calc(var(--spacing)*2)] [--tb-pad-ends:calc(var(--spacing)*2)] [--tb-border:1px] [--tb-radius:calc(var(--tb-inner)+var(--tb-pad)+var(--tb-border))]",
      },
      // size: expressive + shape: default (expressive rectangular toolbar with 14px controls)
      // Concentric rule: outer = inner (14) + pad (12) + border (1) = 27px
      {
        size: "expressive",
        shape: "default",
        className:
          "[--tb-inner:var(--radius-xl)] [--tb-pad:calc(var(--spacing)*3)] [--tb-pad-ends:var(--tb-pad)] [--tb-border:1px] [--tb-radius:calc(var(--tb-inner)+var(--tb-pad)+var(--tb-border))]",
      },
      // size: expressive + shape: pill (concentric capsule toolbar with 56px round controls)
      // Height = 56 + 2*8 + 2*1 = 74px. Concentric outer radius = 28 + 8 + 1 = 37px = 74/2
      {
        size: "expressive",
        shape: "pill",
        className:
          "[--tb-inner:calc(var(--button-height-expressive)/2)] [--tb-pad:calc(var(--spacing)*2)] [--tb-pad-ends:calc(var(--spacing)*2)] [--tb-border:1px] [--tb-radius:calc(var(--tb-inner)+var(--tb-pad)+var(--tb-border))]",
      },
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
      size: "default",
      shape: "default",
      orientation: "horizontal",
      sticky: false,
    },
  }
)

type ToolbarOrientation = "horizontal" | "vertical"
type ToolbarSize = "default" | "expressive"
type ToolbarShape = "default" | "pill"

const ToolbarContext = React.createContext<{
  orientation: ToolbarOrientation
  size: ToolbarSize
  shape: ToolbarShape
}>({
  orientation: "horizontal",
  size: "default",
  shape: "default",
})

function Toolbar({
  className,
  variant = "default",
  size = "default",
  shape,
  orientation = "horizontal",
  sticky,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof toolbarVariants>) {
  const resolvedSize = size ?? "default"
  const resolvedOrientation = orientation ?? "horizontal"
  const resolvedShape =
    shape ??
    (variant === "floating" || size === "expressive" ? "pill" : "default")
  const isFloating = variant === "floating"

  return (
    <ToolbarContext.Provider
      value={{
        orientation: resolvedOrientation,
        size: resolvedSize,
        shape: resolvedShape,
      }}
    >
      <div
        role="toolbar"
        data-slot="toolbar"
        data-size={resolvedSize}
        data-shape={resolvedShape}
        data-orientation={resolvedOrientation}
        {...(isFloating ? { "data-elevation": "floating" } : {})}
        {...(resolvedOrientation === "horizontal"
          ? { "data-optical-edges": "" }
          : {})}
        aria-orientation={resolvedOrientation ?? undefined}
        className={cn(
          toolbarVariants({
            variant,
            size: resolvedSize,
            shape: resolvedShape,
            orientation: resolvedOrientation,
            sticky,
          }),
          className
        )}
        {...props}
      />
    </ToolbarContext.Provider>
  )
}

function ToolbarGroup({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, size, shape } = React.useContext(ToolbarContext)
  return (
    <div
      data-slot="toolbar-group"
      className={cn(
        "flex items-center",
        shape === "pill" || size === "expressive" ? "gap-(--space-xs)" : "gap-(--space-2xs)",
        orientation === "vertical" && "flex-col items-center",
        className
      )}
      {...props}
    />
  )
}

/** Edge text receives mirrored optical padding; interior text and controls do not. */
function ToolbarTitle({ className, ...props }: React.ComponentProps<"div">) {
  const { size } = React.useContext(ToolbarContext)
  return (
    <div
      data-slot="toolbar-title"
      className={cn(
        "edge-text min-w-0 font-medium",
        size === "expressive" ? "text-base font-semibold" : "text-sm",
        className
      )}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  orientation: orientationProp,
  ...props
}: React.ComponentProps<typeof Separator>) {
  const { orientation, size, shape } = React.useContext(ToolbarContext)
  // The separator runs across the toolbar's cross axis.
  const resolved =
    orientationProp ??
    (orientation === "vertical" ? "horizontal" : "vertical")
  const isExpressive = size === "expressive"
  const isPill = shape === "pill"

  return (
    <Separator
      data-slot="toolbar-separator"
      orientation={resolved}
      className={cn(
        resolved === "vertical"
          ? isExpressive
            ? "mx-(--space-xs) h-8! data-vertical:self-center"
            : isPill
              ? "mx-(--space-xs) h-6! data-vertical:self-center"
              : "mx-(--space-2xs) h-6! data-vertical:self-center"
          : isExpressive || isPill
            ? "my-(--space-xs) w-full data-horizontal:self-center"
            : "my-(--space-2xs) w-full data-horizontal:self-center",
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
