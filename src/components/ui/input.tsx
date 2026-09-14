import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.ComponentProps<"input"> & {
  focusRing?: boolean
}

function Input({ className, type, focusRing = true, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-focus-ring={focusRing ? "true" : "false"}
      className={cn(
        "h-(--field-height) w-full min-w-0 rounded-(--field-radius) border border-transparent bg-(--field-fill) bg-clip-border px-(--field-padding-inline) text-base font-medium text-(--field-ink) transition-[background-color,border-color,color] duration-(--speed-swift) outline-none placeholder:font-normal placeholder:text-(--field-ink)/60 hover:bg-(--field-hover-fill) focus-visible:bg-(--field-focus-fill) focus-visible:text-(--field-focus-ink) disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--field-disabled-fill) disabled:opacity-50 md:text-sm",
        focusRing
          ? "focus-visible:ring-3 focus-visible:ring-ring aria-invalid:ring-3 aria-invalid:ring-destructive"
          : "focus-visible:ring-0 focus-visible:outline-none aria-invalid:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
export { SearchInput, type SearchInputProps } from "@/components/ui/input-group"
