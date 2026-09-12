"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-(--switch-height-default) w-12 shrink-0 items-center rounded-full p-0.5 transition-all outline-none group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring aria-invalid:ring-3 aria-invalid:ring-destructive data-checked:bg-(--button-selected-secondary-fill) data-unchecked:bg-(--control-fill) data-unchecked:hover:bg-(--control-hover-fill) data-checked:hover:bg-(--control-checked-hover-fill) data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-6 rounded-full ring-0 transition-[translate,background-color] data-checked:bg-(--surface-lowest) data-unchecked:bg-(--switch-knob-off) data-checked:translate-x-[calc(100%-4px)] data-unchecked:translate-x-0 dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground"
      />
    </SwitchPrimitive.Root>
  )
}

function SwitchGroup({
  orientation = "horizontal",
  className,
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="group"
      data-slot="switch-group"
      data-orientation={orientation}
      className={cn(
        "flex min-w-0 gap-x-(--switch-group-column-gap) gap-y-(--switch-group-gap)",
        orientation === "horizontal" ? "flex-wrap items-center" : "flex-col items-start",
        className
      )}
      {...props}
    />
  )
}

function SwitchGroupItem({ children, ...props }: React.ComponentProps<typeof Switch>) {
  return (
    <label data-slot="switch-group-item" className="flex items-center gap-(--switch-group-label-gap) text-sm font-medium">
      <Switch {...props} />
      <span data-slot="switch-group-text" className="block pr-(--switch-group-text-padding-right)">{children}</span>
    </label>
  )
}

export { Switch, SwitchGroup, SwitchGroupItem }
