import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { controlIndicatorVariants } from "@/components/ui/control-indicator"
import { CheckIcon } from "@/components/ui/icons"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        controlIndicatorVariants({ shape: "box" }),
        "peer transition-colors outline-none group-has-disabled/field:opacity-50 group-has-focus-visible/field-label:not-data-checked:border-muted-foreground after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-focus-visible/field-label:data-checked:border-primary dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

function CheckboxGroup({
  orientation = "horizontal",
  className,
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="group"
      data-slot="checkbox-group"
      data-orientation={orientation}
      className={cn(
        "flex min-w-0 gap-x-(--checkbox-group-column-gap) gap-y-(--checkbox-group-gap)",
        orientation === "horizontal" ? "flex-wrap items-center" : "flex-col items-start",
        className
      )}
      {...props}
    />
  )
}

function CheckboxGroupItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  return (
    <label
      data-slot="checkbox-group-item"
      className="flex items-center gap-(--checkbox-group-label-gap) text-sm font-medium"
    >
      <Checkbox className={className} {...props} />
      <span data-slot="checkbox-group-text" className="block pr-(--checkbox-group-text-padding-right)">
        {children}
      </span>
    </label>
  )
}

export { Checkbox, CheckboxGroup, CheckboxGroupItem }
