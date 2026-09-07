import * as React from "react"

import { cn } from "@/lib/utils"

type TableOfContentsItem = { id: string; label: string }

function TableOfContentsLayout({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="table-of-contents-layout" className={cn("flex min-w-0 flex-col gap-(--toc-layout-gap) lg:flex-row", className)} {...props} />
}

function TableOfContentsContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="table-of-contents-content" className={cn("min-w-0 flex-1", className)} {...props} />
}

function TableOfContents({ items, className, "aria-label": label = "On this page", ...props }:
  React.ComponentProps<"nav"> & { items: readonly TableOfContentsItem[] }) {
  const navigationRef = React.useRef<HTMLElement>(null)
  return (
    <nav ref={navigationRef} data-slot="table-of-contents" aria-label={label} className={cn("min-w-0 shrink-0 self-start lg:sticky lg:top-(--toc-sticky-inset) lg:max-h-(--toc-max-height) lg:w-(--toc-width) lg:overflow-y-auto", className)} {...props}>
      <ul className="flex flex-wrap gap-x-(--toc-inline-gap) gap-y-(--toc-item-gap) lg:flex-col">
        {items.map(item => (
          <li key={item.id}>
            <button type="button" data-slot="table-of-contents-link" className="w-full cursor-pointer text-start text-(length:--toc-font-size) leading-(--toc-line-height) text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-(length:--toc-focus-width) focus-visible:outline-ring" onClick={() => {
              const target = navigationRef.current?.ownerDocument.getElementById(item.id)
              if (!target) return
              target.scrollIntoView({ block: "start", behavior: "instant" })
              if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1")
              target.focus({ preventScroll: true })
            }}>{item.label}</button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { TableOfContents, TableOfContentsLayout, TableOfContentsContent }
export type { TableOfContentsItem }