"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { controlIndicatorVariants } from "@/components/ui/control-indicator"

function RadioGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      orientation={orientation}
      data-orientation={orientation}
      className={cn("w-full gap-y-(--radio-group-row-gap)", orientation === "horizontal" ? "flex flex-wrap items-center gap-x-(--radio-group-column-gap)" : "grid gap-x-(--radio-group-row-gap)", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        controlIndicatorVariants({ shape: "circle" }),
        "group/radio-group-item peer aspect-(--aspect-ratio-square) outline-none group-has-focus-visible/field-label:not-data-checked:border-muted-foreground after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-focus-visible/field-label:data-checked:border-primary dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

function RadioGroupOption({ children, ...props }: React.ComponentProps<typeof RadioGroupItem>) {
  return (
    <label data-slot="radio-group-option" className="flex items-center gap-(--radio-group-label-gap) text-sm font-medium">
      <RadioGroupItem {...props} />
      <span data-slot="radio-group-text" className="block pr-(--radio-group-text-padding-right)">{children}</span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupOption }
