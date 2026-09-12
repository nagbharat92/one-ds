import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { SearchIcon, XIcon } from "@/components/ui/icons"
import { FieldActionButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-(--field-height) w-full min-w-0 items-center rounded-(--field-radius) bg-(--field-fill) p-(--field-action-inset) text-(--field-ink) transition-colors outline-none hover:bg-(--field-hover-fill) in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[>[data-slot=input-group-control]:disabled]:bg-(--field-disabled-fill) has-[>[data-slot=input-group-control]:disabled]:opacity-50 has-[>[data-slot=input-group-control]:disabled]:hover:bg-(--field-disabled-fill) has-[[data-slot=input-group-control]:focus-visible]:bg-(--field-focus-fill) has-[[data-slot=input-group-control]:focus-visible]:text-(--field-focus-ink) has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-full cursor-text items-center justify-center gap-(--field-gap) rounded-(--field-action-radius) text-sm font-medium text-(--field-ink) select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-(--field-action-radius) [&>svg:not([class*='size-'])]:size-(--field-action-icon-size)",
  {
    variants: {
      align: {
        "inline-start":
          "order-first ps-(--field-action-padding-inline) has-[>button]:ps-0",
        "inline-end":
          "order-last pe-(--field-action-padding-inline) has-[>button]:pe-0",
        "block-start":
          "order-first h-auto w-full justify-start px-(--field-action-padding-inline) pt-(--field-action-inset) has-[>button]:pe-0 has-[>button]:pt-0",
        "block-end":
          "order-last h-auto w-full justify-start px-(--field-action-padding-inline) pb-(--field-action-inset) has-[>button]:pe-0 has-[>button]:pb-0",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

function InputGroupButton(props: React.ComponentProps<typeof FieldActionButton>) {
  return (
    <FieldActionButton
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-(--field-gap) text-sm text-(--field-ink) [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-(--field-action-icon-size)",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        // The group owns height, shape and boundary; the control fills it and drops its own.
        "h-full flex-1 rounded-none border-0 bg-transparent px-(--field-control-padding-inline) shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

type SearchInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  clearable?: boolean
}

// A search field is an InputGroup: a leading icon, the control, and a clear action.
function SearchInput({
  className,
  value,
  defaultValue,
  onValueChange,
  onChange,
  clearable = true,
  disabled,
  placeholder = "Search",
  "aria-label": ariaLabel = "Search",
  ...props
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      setValue(event.target.value)
      onChange?.(event)
    },
    [setValue, onChange]
  )

  const clear = React.useCallback(() => {
    setValue("")
    inputRef.current?.focus()
  }, [setValue])

  const showClear = clearable && currentValue.length > 0 && !disabled

  return (
    <InputGroup data-slot="search-input" className={className}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        type="search"
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="[&::-webkit-search-cancel-button]:appearance-none"
        onKeyDown={(event) => {
          if (event.key === "Escape" && currentValue.length > 0) {
            event.preventDefault()
            clear()
          }
          props.onKeyDown?.(event)
        }}
        {...props}
      />
      {showClear && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Clear search" onClick={clear}>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  SearchInput,
}
