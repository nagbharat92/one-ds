import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Scroller } from "@/components/ui/scroller"
import { ChevronRightIcon, CheckIcon } from "@/components/ui/icons"
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

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("select-none", className)}
      {...props}
    />
  )
}

function ContextMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group
      data-slot="context-menu-group"
      className={cn(groupedGroupClassName, className)}
      {...props}
    />
  )
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

function ContextMenuRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      className={cn(
        "in-data-[grouped=true]:[&>[data-slot=context-menu-radio-item]:first-child]:rounded-t-(--menu-item-inner-radius)",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  children,
  grouped = true,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
  grouped?: boolean
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <ContextMenuPrimitive.Portal>
      <MenuGroupedContext.Provider value={grouped}>
        <ContextMenuPrimitive.Content
          data-slot="context-menu-content"
          data-grouped={grouped}
          data-orientation={orientation}
          className={cn(
            "z-50 max-h-(--radix-context-menu-content-available-height) min-w-36 origin-top overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) duration-(--speed-swift) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            grouped && groupedContentResetClassName,
            className
          )}
          {...props}
        >
          <Scroller
            fadeSize="sm"
            scrollbar="none"
            inertia={!grouped}
            data-orientation={orientation}
            className={cn(
              menuScrollerBaseClassName,
              grouped && groupedMenuScrollerClassName
            )}
          >
            {grouped ? (
              <GroupedMenuChildren groupType={ContextMenuGroup}>
                {children}
              </GroupedMenuChildren>
            ) : (
              children
            )}
          </Scroller>
        </ContextMenuPrimitive.Content>
      </MenuGroupedContext.Provider>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
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
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
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
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      data-variant={variant}
      disabled={disabled}
      className={cn(
        "group/context-menu-item relative flex cursor-default items-center gap-(--space-xs) rounded-md px-(--space-xs) py-(--space-2xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:active:bg-destructive/10 data-[variant=destructive]:data-[pressed=true]:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 dark:data-[variant=destructive]:active:bg-destructive/20 dark:data-[variant=destructive]:data-[pressed=true]:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
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
    </ContextMenuPrimitive.Item>
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  disabled,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
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
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      disabled={disabled}
      className={cn(
        "flex cursor-default items-center gap-(--space-xs) rounded-md px-(--space-xs) py-(--space-2xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

function ContextMenuSubContent({
  className,
  children,
  sideOffset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  const grouped = React.useContext(MenuGroupedContext)

  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      data-grouped={grouped}
      sideOffset={grouped ? 8 : sideOffset}
      className={cn(
        "z-50 max-h-(--radix-context-menu-content-available-height) min-w-32 origin-top overflow-hidden rounded-lg border bg-popover bg-clip-padding text-popover-foreground shadow-(--elevation-floating) duration-(--speed-swift) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        grouped && "border-0",
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
    </ContextMenuPrimitive.SubContent>
  )
}

function ContextMenuCheckboxItem({
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
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
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
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      className={cn(
        "relative flex cursor-default items-center gap-(--space-xs) rounded-md py-(--space-2xs) pr-(--space-xl) pl-(--space-xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {withIconLabels(children)}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  disabled,
  inset,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
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
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      className={cn(
        "relative flex cursor-default items-center gap-(--space-xs) rounded-md py-(--space-2xs) pr-(--space-xl) pl-(--space-xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {withIconLabels(children)}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuLabel({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-(--space-xs) py-(--space-2xs) text-xs font-medium text-muted-foreground data-inset:pl-7",
        groupedLabelClassName,
        menuTextPaddingClassName,
        className
      )}
      {...props}
    >
      {withIconLabels(children)}
    </ContextMenuPrimitive.Label>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-(--card-stroke)",
        groupedSeparatorClassName,
        className
      )}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
