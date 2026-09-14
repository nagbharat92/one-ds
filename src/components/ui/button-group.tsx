import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot, ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { CheckIcon } from "@/components/ui/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  // overflow-x-auto forces overflow-y to clip too, which would cut off a child's
  // outward focus ring. Inset every child's ring so the scroll container can never
  // clip an indicator, whatever the child type (button, input, input-group, select).
  "button-group group/button-group flex w-fit max-w-full items-stretch overflow-x-auto *:focus-visible:relative *:focus-visible:z-10 [&>*]:ring-inset [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:min-w-0 [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
      spacing: {
        default: "gap-(--button-group-gap)",
        none: "gap-(--space-none)",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      spacing: "default",
    },
  }
)

function ButtonGroup({
  className,
  orientation = "horizontal",
  spacing = "default",
  shape,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants> & {
  shape?: "round" | "square"
}) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      data-spacing={spacing}
      data-shape={shape}
      className={cn(buttonGroupVariants({ orientation, spacing }), className)}
      {...props}
    />
  )
}

const ButtonGroupChoiceContext = React.createContext<string | undefined>(undefined)

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
    <ButtonGroupChoiceContext.Provider value={value ?? internalValue}>
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
    </ButtonGroupChoiceContext.Provider>
  )
}

function ButtonGroupChoiceItem({
  children,
  className,
  value,
  size = "default",
  variant = "tertiary",
  tooltip = false,
  ...props
}: Omit<React.ComponentProps<typeof ToggleGroupPrimitive.Item>, "asChild"> & {
  size?: React.ComponentProps<typeof Button>["size"]
  variant?: "default" | "secondary" | "tertiary" | "ghost"
  tooltip?: React.ComponentProps<typeof Button>["tooltip"]
}) {
  const selectedValue = React.useContext(ButtonGroupChoiceContext)
  const iconOnly = size === "icon" || size === "icon-expressive"
  return (
    <ToggleGroupPrimitive.Item {...props} value={value} asChild>
      <Button variant={variant} size={size} selected={value === selectedValue} tooltip={tooltip} className={cn(!iconOnly && "button-group-choice", className)}>
        {iconOnly ? children : (
          <>
            <CheckIcon aria-hidden="true" className="button-group-choice__check" />
            <span className="button-group-choice__label">{children}</span>
          </>
        )}
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
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-(--space-xs) rounded-lg bg-muted bg-clip-padding px-(--space-md) text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
        "button-group-separator self-stretch",
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
