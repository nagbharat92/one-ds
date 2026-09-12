import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "@/components/ui/icons"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-(--field-height) w-full min-w-0 cursor-pointer appearance-none rounded-(--field-radius) border border-transparent bg-(--field-fill) bg-clip-border py-(--space-2xs) pr-(--field-affordance-inset) pl-(--field-padding-inline) text-sm font-medium text-(--field-ink) transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-(--field-ink)/60 hover:bg-(--field-hover-fill) focus-visible:bg-(--field-focus-fill) focus-visible:text-(--field-focus-ink) focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:ring-3 aria-invalid:ring-destructive data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5"
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-(--field-padding-inline) size-4 -translate-y-1/2 text-(--field-ink)/70 select-none" aria-hidden="true" data-slot="native-select-icon" />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
