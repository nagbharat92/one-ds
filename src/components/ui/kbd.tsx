import { cn } from "@/lib/utils"

const kbdBaseClass =
  "inline-flex h-5 w-fit min-w-5 shrink-0 items-center justify-center gap-(--space-2xs) rounded-sm px-(--space-2xs) text-xs font-medium whitespace-nowrap select-none [&_svg:not([class*='size-'])]:size-3"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        kbdBaseClass,
        "pointer-events-none bg-muted font-sans text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-(--space-2xs)", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
