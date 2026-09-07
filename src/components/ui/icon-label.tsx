import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function IconLabel({ className, asChild = false, ...props }: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return <Comp data-slot="icon-label" className={cn("icon-label", className)} {...props} />
}

function withIconLabels(children: React.ReactNode): React.ReactNode {
  const result: React.ReactNode[] = []
  let text: React.ReactNode[] = []
  const flush = () => {
    if (!text.length) return
    result.push(<IconLabel key={`label-${result.length}`}>{text}</IconLabel>)
    text = []
  }
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      text.push(child)
      continue
    }
    flush()
    if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
      result.push(<React.Fragment key={child.key}>{withIconLabels(child.props.children)}</React.Fragment>)
    } else if (
      React.isValidElement<React.ComponentProps<"span">>(child) && child.type === "span" &&
      !child.props.className?.split(/\s+/).includes("sr-only") && !child.props["aria-hidden"] &&
      React.Children.toArray(child.props.children).length > 0 &&
      React.Children.toArray(child.props.children).every(node => typeof node === "string" || typeof node === "number")
    ) {
      result.push(<IconLabel key={child.key} asChild>{child}</IconLabel>)
    } else {
      result.push(child)
    }
  }
  flush()
  return result
}

export { IconLabel, withIconLabels }