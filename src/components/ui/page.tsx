"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Scroller } from "@/components/ui/scroller"
import { resolveHang, type HangOffset } from "@/lib/hang"

function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page"
      className={cn(
        "relative flex min-h-0 flex-1 flex-col bg-(--page-fill)",
        className
      )}
      {...props}
    />
  )
}

function PageScroll({
  className,
  smooth = true,
  fade = true,
  scrollbar = "thin",
  ...props
}: Omit<React.ComponentProps<typeof Scroller>, "fade" | "scrollbar"> & {
  smooth?: boolean
  fade?: boolean
  scrollbar?: "auto" | "thin" | "hidden"
}) {
  return (
    <Scroller
      data-slot="page-scroll"
      inertia={smooth}
      fade={fade ? "both" : "none"}
      scrollbar={scrollbar === "hidden" ? "none" : scrollbar}
      className={cn("page-scroll flex-1", className)}
      {...props}
    />
  )
}

const pageContentVariants = cva(
  "page-content mx-auto flex w-full flex-col px-(--page-gutter-sm) sm:px-(--page-gutter-md) lg:px-(--page-gutter-lg)",
  {
    variants: {
      variant: {
        docs: "max-w-3xl",
        app: "max-w-6xl",
        marketing: "max-w-none",
        centered: "max-w-md flex-1 justify-center",
      },
      animate: {
        true: "page-content--animate",
        false: "",
      },
    },
    defaultVariants: {
      variant: "app",
      animate: true,
    },
  }
)

function PageContent({
  className,
  variant,
  animate,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageContentVariants>) {
  return (
    <div
      data-slot="page-content"
      data-variant={variant ?? "app"}
      className={cn(pageContentVariants({ variant, animate }), className)}
      {...props}
    />
  )
}

const pageBleedVariants = cva("", {
  variants: {
    extent: {
      gutter:
        "-mx-(--page-gutter-sm) sm:-mx-(--page-gutter-md) lg:-mx-(--page-gutter-lg)",
      surface: "page-bleed--surface",
    },
  },
  defaultVariants: {
    extent: "gutter",
  },
})

// Breaks a child out of the PageContent gutters:
// - extent="gutter" (default): breaks out across page gutters to the page boundary
// - extent="surface": breaks out by the surface padding so child text aligns with page text
// - hang: custom hanging offset (e.g. "8px", "16px", "24px", "xs", "sm", "md", "lg", "xl", or boolean)
function PageBleed({
  className,
  extent,
  hang,
  style,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof pageBleedVariants> & {
    hang?: HangOffset
  }) {
  const isSurface =
    extent === "surface" || (hang !== undefined && hang !== false && hang !== "none")
  const { dataHang, hangStyle, isHanging } = resolveHang(
    hang ?? (extent === "surface" ? true : undefined)
  )

  return (
    <div
      data-slot="page-bleed"
      data-extent={extent ?? (isSurface ? "surface" : "gutter")}
      data-hang={isSurface ? dataHang : undefined}
      style={isSurface && hangStyle ? { ...hangStyle, ...style } : style}
      className={cn(
        pageBleedVariants({ extent: isSurface ? "surface" : "gutter" }),
        isHanging && "page-bleed--surface",
        className
      )}
      {...props}
    />
  )
}

export {
  Page,
  PageScroll,
  PageContent,
  PageBleed,
  pageContentVariants,
  pageBleedVariants,
}
