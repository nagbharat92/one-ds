import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentProps<"textarea"> & {
  focusRing?: boolean
}

function Textarea({ className, focusRing = true, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-focus-ring={focusRing ? "true" : "false"}
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-(--field-radius) border border-transparent bg-(--field-fill) bg-clip-border px-(--field-padding-inline) py-(--field-gap) text-base font-medium text-(--field-ink) transition-colors outline-none placeholder:font-normal placeholder:text-(--field-placeholder-ink) hover:bg-(--field-hover-fill) focus-visible:bg-(--field-focus-fill) focus-visible:text-(--field-focus-ink) disabled:cursor-not-allowed disabled:bg-(--field-disabled-fill) disabled:opacity-50 md:text-sm",
        focusRing
          ? "focus-visible:ring-3 focus-visible:ring-ring aria-invalid:ring-3 aria-invalid:ring-destructive"
          : "focus-visible:ring-0 focus-visible:outline-none aria-invalid:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
