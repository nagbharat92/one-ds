import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Text at the leading or trailing edge of a control row. Inside a container marked
// data-optical-edges, the first/last EdgeText gains --optical-edge-text-padding so a
// bare text run matches the optical inset of the controls beside it.
function EdgeText({ className, asChild = false, ...props }: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return <Comp data-slot="edge-text" className={cn("edge-text min-w-0", className)} {...props} />
}

export { EdgeText }
