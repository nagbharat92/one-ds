import * as React from "react"

import { Button } from "@/components/ui/button"
import { EdgeText } from "@/components/ui/edge-text"
import { elevationVariants } from "@/components/ui/elevation"
import { cn } from "@/lib/utils"
import { useScrollerRef } from "@/hooks/use-scroller"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const setRef = useScrollerRef<HTMLDivElement>({ axis: "x" })
  return (
    <div
      ref={setRef}
      data-slot="table-container"
      data-elevation="flat"
      className={cn(
        "scroll-fade-x scroll-fade-6 scrollbar-thin relative w-full overflow-x-auto rounded-(--table-surface-radius) bg-card ring-1 ring-(--table-stroke)",
        elevationVariants({ level: "flat" })
      )}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b",
        "[&:has(+[data-slot=table-body]>[data-slot=table-row]:first-child:hover)>[data-slot=table-row]:last-child]:border-transparent",
        "[&:has(+[data-slot=table-body]>[data-slot=table-row]:first-child[data-state=selected])>[data-slot=table-row]:last-child]:border-transparent",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function isBareTableText(children: React.ReactNode) {
  const parts = React.Children.toArray(children)
  return (
    parts.length > 0 &&
    parts.every(
      (part) => typeof part === "string" || typeof part === "number"
    )
  )
}

function withTableEdgeText(children: React.ReactNode) {
  if (isBareTableText(children)) {
    return <EdgeText>{children}</EdgeText>
  }

  if (
    React.isValidElement<{ children?: React.ReactNode }>(children) &&
    children.type === "span" &&
    isBareTableText(children.props.children)
  ) {
    return <EdgeText asChild>{children}</EdgeText>
  }

  return children
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      data-optical-edges
      className={cn(
        "border-b transition-colors *:transition-colors [&>*:first-child]:rounded-s-(--table-row-radius) [&>*:last-child]:rounded-e-(--table-row-radius)",
        "hover:border-transparent hover:*:bg-(--state-layer-hover)",
        "[&:has(+[data-slot=table-row]:hover)]:border-transparent",
        "has-aria-expanded:*:bg-(--state-layer-focus)",
        "data-[state=selected]:border-transparent data-[state=selected]:*:bg-muted",
        "[&:has(+[data-slot=table-row][data-state=selected])]:border-transparent",
        className
      )}
      {...props}
    />
  )
}

function TableHead({
  children,
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-(--table-header-height) px-(--table-header-padding-inline) text-left align-middle font-medium whitespace-nowrap text-foreground [&:first-child:not(:has(>.edge-text))]:ps-(--table-edge-cell-padding) [&:last-child:not(:has(>.edge-text))]:pe-(--table-edge-cell-padding) [&:has([data-table-sort-button])]:px-(--space-none) [&:has([role=checkbox])]:pr-(--space-none)",
        className
      )}
      {...props}
    >
      {withTableEdgeText(children)}
    </th>
  )
}

type TableSortButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "size" | "variant"
>

function TableSortButton({
  className,
  type = "button",
  ...props
}: TableSortButtonProps) {
  return (
    <Button
      type={type}
      variant="secondary"
      size="default"
      data-table-sort-button
      className={cn(
        "rounded-(--button-round-radius) px-(--table-header-padding-inline)",
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  children,
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-(--space-xs) align-middle whitespace-nowrap [&:first-child:not(:has(>.edge-text))]:ps-(--table-edge-cell-padding) [&:last-child:not(:has(>.edge-text))]:pe-(--table-edge-cell-padding) [&:has([role=checkbox])]:pr-(--space-none)",
        className
      )}
      {...props}
    >
      {withTableEdgeText(children)}
    </td>
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-(--space-md) text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSortButton,
}
