"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Scroller } from "@/components/ui/scroller"

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
  "page-content mx-auto flex w-full flex-col px-(--space-lg) sm:px-(--space-xl) lg:px-10",
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
      className={cn(pageContentVariants({ variant, animate }), className)}
      {...props}
    />
  )
}

// Breaks a child out of the PageContent gutters to span the full page width.
function PageBleed({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-bleed"
      className={cn("-mx-6 sm:-mx-8 lg:-mx-10", className)}
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
}
