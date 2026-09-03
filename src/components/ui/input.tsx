import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-control bg-clip-padding px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
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
    <div data-slot="search-input" className="relative w-full">
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={inputRef}
        type="search"
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onKeyDown={(event) => {
          if (event.key === "Escape" && currentValue.length > 0) {
            event.preventDefault()
            clear()
          }
          props.onKeyDown?.(event)
        }}
        className={cn(
          "rounded-full pl-9",
          showClear ? "pr-9" : "pr-3",
          "[&::-webkit-search-cancel-button]:appearance-none",
          className
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={clear}
          className="absolute top-1/2 right-2.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export { Input, SearchInput }
