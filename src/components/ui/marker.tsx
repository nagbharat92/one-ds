import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-(--marker-gap) text-left text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:mr-(--space-xs) before:h-px before:min-w-0 before:flex-1 before:bg-(--elevation-stroke) after:ml-(--space-xs) after:h-px after:min-w-0 after:flex-1 after:bg-(--elevation-stroke)",
        pill:
          "justify-center before:mr-(--space-xs) before:h-px before:min-w-0 before:flex-1 before:bg-(--elevation-stroke) after:ml-(--space-xs) after:h-px after:min-w-0 after:flex-1 after:bg-(--elevation-stroke)",
        unread:
          "justify-center text-destructive before:mr-(--space-xs) before:h-px before:min-w-0 before:flex-1 before:bg-destructive/30 after:ml-(--space-xs) after:h-px after:min-w-0 after:flex-1 after:bg-destructive/30",
        border: "border-b border-(--elevation-stroke) pb-(--space-xs)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Marker({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof markerVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="marker"
      data-variant={variant}
      className={cn(markerVariants({ variant, className }))}
      {...props}
    />
  )
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word",
        "group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
        "group-data-[variant=pill]/marker:flex-none group-data-[variant=pill]/marker:inline-flex group-data-[variant=pill]/marker:items-center group-data-[variant=pill]/marker:gap-(--space-2xs) group-data-[variant=pill]/marker:rounded-full group-data-[variant=pill]/marker:border group-data-[variant=pill]/marker:border-(--elevation-stroke) group-data-[variant=pill]/marker:bg-(--surface-lowest) group-data-[variant=pill]/marker:px-(--marker-pill-padding-inline) group-data-[variant=pill]/marker:py-(--space-hairline) group-data-[variant=pill]/marker:text-xs group-data-[variant=pill]/marker:font-medium group-data-[variant=pill]/marker:text-muted-foreground group-data-[variant=pill]/marker:shadow-xs",
        "group-data-[variant=unread]/marker:flex-none group-data-[variant=unread]/marker:inline-flex group-data-[variant=unread]/marker:items-center group-data-[variant=unread]/marker:gap-(--space-2xs) group-data-[variant=unread]/marker:rounded-full group-data-[variant=unread]/marker:border group-data-[variant=unread]/marker:border-destructive/20 group-data-[variant=unread]/marker:bg-destructive/10 group-data-[variant=unread]/marker:px-(--marker-pill-padding-inline) group-data-[variant=unread]/marker:py-(--space-hairline) group-data-[variant=unread]/marker:text-xs group-data-[variant=unread]/marker:font-medium group-data-[variant=unread]/marker:text-destructive group-data-[variant=unread]/marker:shadow-xs",
        "*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
