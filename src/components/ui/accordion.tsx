"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { PlusIcon, MinusIcon } from "@/components/ui/icons"

type AccordionSize = "default" | "lg"

const AccordionSizeContext = React.createContext<AccordionSize>("default")

function Accordion({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
  size?: AccordionSize
}) {
  return (
    <AccordionSizeContext.Provider value={size}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-size={size}
        className={cn("flex w-full flex-col", className)}
        {...props}
      />
    </AccordionSizeContext.Provider>
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const size = React.useContext(AccordionSizeContext)
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 cursor-pointer items-start justify-between rounded-lg border border-transparent pt-(--space-sm) pb-(--accordion-content-gap) text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          size === "lg" &&
            "py-(--space-md) text-lg font-semibold **:data-[slot=accordion-trigger-icon]:size-6",
          className
        )}
        {...props}
      >
        {children}
        <PlusIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-data-[state=open]/accordion-trigger:hidden!" />
        <MinusIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden! shrink-0 group-data-[state=open]/accordion-trigger:block!" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const size = React.useContext(AccordionSizeContext)
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm text-muted-foreground data-open:animate-accordion-down data-closed:animate-accordion-up",
        size === "lg" && "text-base"
      )}
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-(--space-none) pb-(--space-sm) [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-(--space-md)",
          size === "lg" && "pb-(--space-md)",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
