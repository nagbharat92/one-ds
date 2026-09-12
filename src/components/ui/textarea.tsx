import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-(--field-radius) border border-transparent bg-(--field-fill) bg-clip-border px-(--field-padding-inline) py-(--field-gap) text-base font-medium text-(--field-ink) transition-colors outline-none placeholder:font-normal placeholder:text-(--field-ink)/60 hover:bg-(--field-hover-fill) focus-visible:bg-(--field-focus-fill) focus-visible:text-(--field-focus-ink) focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-(--field-disabled-fill) disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
