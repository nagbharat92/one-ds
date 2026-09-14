import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { useScrollerRef } from "@/hooks/use-scroller"
import { Button } from "@/components/ui/button"

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-(--attachment-radius) border border-(--elevation-stroke) bg-(--surface-lowest) bg-clip-border text-card-foreground shadow-(--elevation-flat) transition-all duration-(--speed-swift) ease-(--ease-glide) focus-within:ring-2 focus-within:ring-ring/50 has-[>a,>button,[data-slot=attachment-trigger]]:hover:bg-(--state-layer-hover) has-[>a,>button,[data-slot=attachment-trigger]]:hover:shadow-(--elevation-raised) data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-(--attachment-gap) p-(--attachment-padding) text-sm",
        sm: "gap-(--attachment-gap) p-(--attachment-padding) text-xs",
        xs: "gap-(--space-2xs) p-(--space-2xs) rounded-(--radius-lg) text-xs",
      },
      orientation: {
        horizontal: "min-w-44 items-center",
        vertical: "w-28 flex-col has-data-[slot=attachment-content]:w-32",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  }
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-(--aspect-ratio-square) size-(--attachment-media-size) shrink-0 items-center justify-center overflow-hidden rounded-(--attachment-inner-radius) bg-(--surface-container) text-foreground transition-all duration-(--speed-swift) ease-(--ease-glide) group-data-[orientation=vertical]/attachment:w-full group-data-[orientation=vertical]/attachment:h-auto group-data-[size=sm]/attachment:size-(--attachment-media-size-sm) group-data-[size=xs]/attachment:size-(--attachment-media-size-xs) group-data-[size=xs]/attachment:rounded-sm group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 group-data-[size=sm]/attachment:[&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-80 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-(--aspect-ratio-square) *:[img]:size-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-(--space-hairline) block min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80",
        "max-w-full",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center opacity-0 transition-opacity duration-(--speed-swift) group-hover/attachment:opacity-100 group-focus-within/attachment:opacity-100 group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn("size-7 rounded-full cursor-pointer", className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="attachment-trigger"
      type={asChild ? undefined : (type ?? "button")}
      className={cn("absolute inset-0 z-10 cursor-pointer outline-none", className)}
      {...props}
    />
  )
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  // No inertia here: a rAF lerp fights CSS scroll snapping.
  const setRef = useScrollerRef<HTMLDivElement>({ axis: "x", inertia: false })
  return (
    <div
      ref={setRef}
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 scroll-fade-x scroll-fade-6 snap-x snap-mandatory scroll-px-1 scrollbar-none gap-(--space-sm) overflow-x-auto overscroll-x-contain py-(--space-2xs) *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
