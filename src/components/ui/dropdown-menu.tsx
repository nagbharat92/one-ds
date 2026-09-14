import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useOpenOnMouseUp } from "@/hooks/use-open-on-mouse-up"
import { ButtonTooltipSuppression } from "@/components/ui/button"
import { Scroller } from "@/components/ui/scroller"
import { CheckIcon, ChevronRightIcon } from "@/components/ui/icons"
import { withIconLabels } from "@/components/ui/icon-label"
import {
  GroupedMenuChildren,
  MenuGroupedContext,
  menuScrollerBaseClassName,
  groupedContentResetClassName,
  groupedMenuScrollerClassName,
  groupedSubmenuScrollerClassName,
  groupedMenuSurfaceClassName,
  groupedGroupClassName,
  groupedItemClassName,
  groupedLabelClassName,
  groupedSeparatorClassName,
  groupedSubTriggerOpenClassName,
  menuTextPaddingClassName,
  useMenuPressHandlers,
} from "@/components/ui/menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  onPointerDown,
  onPointerUp,
  tooltip,
  tooltipSide = "top",
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger> & {
  tooltip?: React.ReactNode
  tooltipSide?: React.ComponentProps<typeof TooltipContent>["side"]
}) {
  const mouseUpHandlers = useOpenOnMouseUp<HTMLButtonElement>(
    onPointerDown,
    onPointerUp
  )
  // asChild hands the trigger's props to the child, so the child cannot host a
  // tooltip wrapper of its own. A named-by-aria-label trigger wraps itself.
  const child = React.isValidElement<{ "aria-label"?: string }>(children)
    ? children
    : null
  const label = tooltip ?? child?.props["aria-label"]

  const trigger = (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...mouseUpHandlers}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  )

  return (
    <ButtonTooltipSuppression>
      {label ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side={tooltipSide}>{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        trigger
      )}
    </ButtonTooltipSuppression>
  )
}

function DropdownMenuContent({
  className,
  children,
  align = "start",
  grouped = true,
  onCloseAutoFocus,
  onPointerDownOutside,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  grouped?: boolean
}) {
  const dismissedByPointerRef = React.useRef(false)

  return (
    <DropdownMenuPrimitive.Portal>
      <MenuGroupedContext.Provider value={grouped}>
        <DropdownMenuPrimitive.Content
          data-slot="dropdown-menu-content"
          data-grouped={grouped}
          sideOffset={sideOffset}
          align={align}
          onPointerDownOutside={(event) => {
            dismissedByPointerRef.current = true
            onPointerDownOutside?.(event)
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event)
            if (dismissedByPointerRef.current && !event.defaultPrevented) {
              event.preventDefault()
            }
            dismissedByPointerRef.current = false
          }}
          className={cn(
            "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-top overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) duration-(--speed-swift) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            grouped && groupedContentResetClassName,
            className
          )}
          {...props}
        >
          <Scroller
            fadeSize="sm"
            scrollbar="none"
            inertia={!grouped}
            className={cn(
              menuScrollerBaseClassName,
              grouped && groupedMenuScrollerClassName
            )}
          >
            {grouped ? (
              <GroupedMenuChildren groupType={DropdownMenuGroup}>
                {children}
              </GroupedMenuChildren>
            ) : (
              children
            )}
          </Scroller>
        </DropdownMenuPrimitive.Content>
      </MenuGroupedContext.Provider>
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="dropdown-menu-group"
      className={cn(groupedGroupClassName, className)}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  children,
  disabled,
  inset,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const pressHandlers = useMenuPressHandlers<HTMLDivElement>(
    disabled,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel
  )

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      data-variant={variant}
      disabled={disabled}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-(--space-xs) rounded-md px-(--space-xs) py-(--space-2xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:active:bg-destructive/10 data-[variant=destructive]:data-[pressed=true]:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 dark:data-[variant=destructive]:active:bg-destructive/20 dark:data-[variant=destructive]:data-[pressed=true]:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
        groupedItemClassName,
        menuTextPaddingClassName,
        className
      )}
      onPointerCancel={pressHandlers.onPointerCancel}
      onPointerDown={pressHandlers.onPointerDown}
      onPointerLeave={pressHandlers.onPointerLeave}
      onPointerUp={pressHandlers.onPointerUp}
      {...props}
    >
      {withIconLabels(children)}
    </DropdownMenuPrimitive.Item>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  disabled,
  inset,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean
}) {
  const pressHandlers = useMenuPressHandlers<HTMLDivElement>(
    disabled,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel
  )

  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      className={cn(
        "relative flex cursor-default items-center gap-(--space-xs) rounded-md py-(--space-2xs) pr-(--space-xl) pl-(--space-xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        groupedItemClassName,
        menuTextPaddingClassName,
        className
      )}
      checked={checked}
      disabled={disabled}
      onPointerCancel={pressHandlers.onPointerCancel}
      onPointerDown={pressHandlers.onPointerDown}
      onPointerLeave={pressHandlers.onPointerLeave}
      onPointerUp={pressHandlers.onPointerUp}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {withIconLabels(children)}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      className={cn(
        "in-data-[grouped=true]:[&>[data-slot=dropdown-menu-radio-item]:first-child]:rounded-t-(--menu-item-inner-radius)",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  disabled,
  inset,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean
}) {
  const pressHandlers = useMenuPressHandlers<HTMLDivElement>(
    disabled,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel
  )

  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      className={cn(
        "relative flex cursor-default items-center gap-(--space-xs) rounded-md py-(--space-2xs) pr-(--space-xl) pl-(--space-xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        groupedItemClassName,
        menuTextPaddingClassName,
        className
      )}
      disabled={disabled}
      onPointerCancel={pressHandlers.onPointerCancel}
      onPointerDown={pressHandlers.onPointerDown}
      onPointerLeave={pressHandlers.onPointerLeave}
      onPointerUp={pressHandlers.onPointerUp}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {withIconLabels(children)}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-(--space-xs) py-(--space-2xs) text-sm font-medium text-muted-foreground data-inset:pl-7",
        groupedLabelClassName,
        menuTextPaddingClassName,
        className
      )}
      {...props}
    >
      {withIconLabels(children)}
    </DropdownMenuPrimitive.Label>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-(--card-stroke)",
        groupedSeparatorClassName,
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  disabled,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  const pressHandlers = useMenuPressHandlers<HTMLDivElement>(
    disabled,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel
  )

  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      disabled={disabled}
      className={cn(
        "flex cursor-default items-center gap-(--space-xs) rounded-md px-(--space-xs) py-(--space-2xs) text-sm outline-none select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        groupedItemClassName,
        groupedSubTriggerOpenClassName,
        menuTextPaddingClassName,
        className
      )}
      onPointerCancel={pressHandlers.onPointerCancel}
      onPointerDown={pressHandlers.onPointerDown}
      onPointerLeave={pressHandlers.onPointerLeave}
      onPointerUp={pressHandlers.onPointerUp}
      {...props}
    >
      {withIconLabels(children)}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  sideOffset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const grouped = React.useContext(MenuGroupedContext)

  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      data-grouped={grouped}
      sideOffset={grouped ? 8 : sideOffset}
      className={cn(
        "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-top overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) duration-(--speed-swift) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        grouped && groupedMenuSurfaceClassName,
        className
      )}
      {...props}
    >
      <Scroller
        fadeSize="sm"
        scrollbar="none"
        className={cn(
          menuScrollerBaseClassName,
          grouped && groupedSubmenuScrollerClassName
        )}
      >
        {children}
      </Scroller>
    </DropdownMenuPrimitive.SubContent>
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
