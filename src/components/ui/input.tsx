import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-(--field-height) w-full min-w-0 rounded-(--field-radius) border border-transparent bg-(--field-fill) bg-clip-border px-(--field-padding-inline) text-base font-medium text-(--field-ink) transition-[background-color,border-color,color] duration-(--speed-swift) outline-none placeholder:font-normal placeholder:text-(--field-ink)/60 hover:bg-(--field-hover-fill) focus-visible:bg-(--field-focus-fill) focus-visible:text-(--field-focus-ink) focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--field-disabled-fill) disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
export { SearchInput } from "@/components/ui/input-group"
