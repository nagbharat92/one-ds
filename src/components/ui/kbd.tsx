import { cn } from "@/lib/utils"
import { badgeBaseClass } from "@/components/ui/badge"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        badgeBaseClass,
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
