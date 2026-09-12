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
        "group/radio-group-item peer aspect-(--aspect-ratio-square) cursor-pointer outline-none group-has-focus-visible/field-label:not-data-checked:border-muted-foreground after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-transparent aria-invalid:shadow-(--control-outline-clear-shadow) aria-invalid:ring-3 aria-invalid:ring-destructive aria-invalid:aria-checked:border-(--button-selected-secondary-fill) data-checked:border-(--button-selected-secondary-fill) data-checked:bg-(--button-selected-secondary-fill) data-checked:text-(--button-selected-secondary-ink) data-checked:shadow-(--control-outline-clear-shadow) not-data-checked:hover:shadow-(--control-hover-outline-shadow) data-checked:hover:bg-(--control-checked-hover-fill) group-has-focus-visible/field-label:data-checked:border-(--button-selected-secondary-fill)",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        forceMount
        data-slot="radio-group-indicator"
        className="flex size-(--control-size) items-center justify-center opacity-0 transition-opacity duration-(--material-icon-fill-speed) ease-(--material-icon-fill-curve) data-[state=checked]:opacity-100 motion-reduce:transition-none"
      >
        <span className="absolute top-1/2 left-1/2 size-(--control-dot-size) -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
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
