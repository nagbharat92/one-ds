import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot, ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

type ButtonGroupChoiceProps = Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange" | "asChild"
> & {
  onValueChange?: (value: string) => void
} & (
  | { value: string; defaultValue?: never }
  | { value?: never; defaultValue: string }
)

function ButtonGroupChoice({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
  ...props
}: ButtonGroupChoiceProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? value)

  return (
    <ToggleGroupPrimitive.Root
      {...props}
      type="single"
      value={value ?? internalValue}
      onValueChange={(nextValue) => {
        if (!nextValue) return
        if (value === undefined) setInternalValue(nextValue)
        onValueChange?.(nextValue)
      }}
      orientation={orientation}
      data-slot="button-group"
      data-selection="single"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
    />
  )
}

function ButtonGroupChoiceItem({
  children,
  className,
  size = "default",
  variant = "secondary",
  tooltip = false,
  ...props
}: Omit<React.ComponentProps<typeof ToggleGroupPrimitive.Item>, "asChild"> & {
  size?: React.ComponentProps<typeof Button>["size"]
  variant?: React.ComponentProps<typeof Button>["variant"]
  tooltip?: React.ComponentProps<typeof Button>["tooltip"]
}) {
  return (
    <ToggleGroupPrimitive.Item {...props} asChild>
      <Button variant={variant} size={size} tooltip={tooltip} className={cn("button-group-choice", className)}>
        <CheckIcon
          aria-hidden="true"
          className="button-group-choice__check"
        />
        <span className="button-group-choice__label">{children}</span>
      </Button>
    </ToggleGroupPrimitive.Item>
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-muted bg-clip-padding px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupChoice,
  ButtonGroupChoiceItem,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
