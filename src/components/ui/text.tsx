import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textVariants = cva("min-w-0 wrap-break-word", {
  variants: {
    variant: {
      title: "text-(length:--text-title-size) leading-(--text-title-leading) font-semibold text-balance",
      heading: "text-(length:--text-heading-size) leading-(--text-heading-leading) font-semibold text-balance",
      subheading: "text-(length:--text-subheading-size) leading-(--text-subheading-leading) font-semibold text-balance",
      lead: "text-(length:--text-lead-size) leading-(--text-lead-leading)",
      body: "text-(length:--text-body-size) leading-(--text-body-leading)",
      label: "text-(length:--text-label-size) leading-(--text-label-leading) font-medium",
      metadata: "text-(length:--text-metadata-size) leading-(--text-metadata-leading)",
      code: "font-mono text-(length:--text-code-size) leading-(--text-code-leading) break-all",
      caption: "text-(length:--text-caption-size) leading-(--text-caption-leading)",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: { variant: "body", tone: "default" },
})

function Text({ className, variant, tone, asChild = false, ...props }: React.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "p"
  return <Comp data-slot="text" className={cn(textVariants({ variant, tone }), className)} {...props} />
}

export { Text, textVariants }