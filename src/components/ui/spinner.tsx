import { cn } from "@/lib/utils"
import { Loader2Icon } from "@/components/ui/icons"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin group-data-[size=default]/button:size-(--button-icon-default) group-data-[size=icon]/button:size-(--button-icon-default) group-data-[size=expressive]/button:size-(--button-icon-expressive) group-data-[size=icon-expressive]/button:size-(--button-icon-expressive)", className)} {...props} />
  )
}

export { Spinner }
