import { cva, type VariantProps } from "class-variance-authority"

import { elevationVariants } from "@/components/ui/elevation"
import { Shape } from "@/components/ui/shape"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import type { ShapeName } from "@/lib/shapes"

type EmptyShapeName = Extract<
  ShapeName,
  | "pentagon"
  | "gem"
  | "verySunny"
  | "sunny"
  | "cookie6"
  | "cookie7"
  | "cookie9"
  | "cookie12"
  | "clover8"
>

const emptyVariants = cva(
  "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-(--empty-region-gap) rounded-(--empty-radius) p-(--empty-padding) text-center",
  {
    variants: {
      variant: {
        default: "max-w-(--empty-max-width) bg-(--empty-surface) ring-1 ring-(--empty-stroke)",
        tonal: "max-w-(--empty-max-width) bg-(--empty-tonal-surface) ring-1 ring-(--empty-stroke)",
        plain: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Empty({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyVariants>) {
  const hasSurface = variant !== "plain"

  return (
    <div
      data-slot="empty"
      data-variant={variant}
      data-elevation={hasSurface ? "flat" : undefined}
      className={cn(
        emptyVariants({ variant }),
        hasSurface && elevationVariants({ level: "flat" }),
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex w-full max-w-(--empty-content-max-width) flex-col items-center gap-(--empty-header-gap)",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-(--empty-media-offset) flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "relative size-(--empty-media-size) text-(--empty-media-ink)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  shape = "cookie6",
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof emptyMediaVariants> & { shape?: EmptyShapeName }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      data-shape={variant === "icon" ? shape : undefined}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    >
      {variant === "icon" ? (
        <>
          <Shape
            name={shape}
            tone="neutral"
            role="presentation"
            aria-label={undefined}
            aria-hidden="true"
            focusable="false"
            className="empty-icon__shape absolute inset-0 size-full"
          />
          <span
            data-slot="empty-icon-glyph"
            className="relative grid size-(--empty-media-graphic-size) place-items-center [&>svg]:size-(--empty-media-graphic-size)"
          >
            {children}
          </span>
        </>
      ) : children}
    </div>
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Text variant="heading" asChild>
      <div
        data-slot="empty-title"
        className={cn("font-heading", className)}
        {...props}
      />
    </Text>
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <Text variant="body" tone="muted" asChild>
      <div
        data-slot="empty-description"
        className={cn(
          "text-balance [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
          className
        )}
        {...props}
      />
    </Text>
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-(--empty-content-max-width) min-w-0 flex-col items-center gap-(--empty-content-gap) text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  emptyVariants,
}
