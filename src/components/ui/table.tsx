import * as React from "react"

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

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors *:transition-colors",
        "hover:border-transparent hover:*:bg-(--state-layer-hover) hover:[&>*:first-child]:rounded-s-(--table-row-radius) hover:[&>*:last-child]:rounded-e-(--table-row-radius)",
        "[&:has(+[data-slot=table-row]:hover)]:border-transparent",
        "has-aria-expanded:*:bg-(--state-layer-focus)",
        "data-[state=selected]:border-transparent data-[state=selected]:*:bg-muted data-[state=selected]:[&>*:first-child]:rounded-s-(--table-row-radius) data-[state=selected]:[&>*:last-child]:rounded-e-(--table-row-radius)",
        "[&:has(+[data-slot=table-row][data-state=selected])]:border-transparent",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-(--space-xs) text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-(--space-none)",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-(--space-xs) align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-(--space-none)",
        className
      )}
      {...props}
    />
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
}
