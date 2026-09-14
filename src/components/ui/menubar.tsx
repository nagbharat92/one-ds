import * as React from "react"
import { Menubar as MenubarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useOpenOnMouseUp } from "@/hooks/use-open-on-mouse-up"
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

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-8 items-center gap-(--space-hairline) rounded-lg border p-0.75",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return (
    <MenubarPrimitive.Group
      data-slot="menubar-group"
      className={cn(groupedGroupClassName, className)}
      {...props}
    />
  )
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup
      data-slot="menubar-radio-group"
      className={cn(
        "in-data-[grouped=true]:[&>[data-slot=menubar-radio-item]:first-child]:rounded-t-(--menu-item-inner-radius)",
        className
      )}
      {...props}
    />
  )
}

function MenubarTrigger({
  className,
  onPointerDown,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  const mouseUpHandlers = useOpenOnMouseUp<HTMLButtonElement>(
    onPointerDown,
    onPointerUp
  )
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-sm px-(--space-xs) py-(--space-hairline) text-sm font-medium outline-hidden select-none hover:bg-(--state-layer-hover) active:bg-(--state-layer-pressed) aria-expanded:bg-muted",
        className
      )}
      {...mouseUpHandlers}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  children,
  grouped = true,
  orientation = "vertical",
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content> & {
  grouped?: boolean
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <MenubarPortal>
      <MenuGroupedContext.Provider value={grouped}>
        <MenubarPrimitive.Content
          data-slot="menubar-content"
          data-grouped={grouped}
          data-orientation={orientation}
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={cn(
            "z-50 max-h-(--radix-menubar-content-available-height) min-w-36 origin-top overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) duration-(--speed-swift) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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
              <GroupedMenuChildren groupType={MenubarGroup}>
                {children}
              </GroupedMenuChildren>
            ) : (
              children
            )}
          </Scroller>
        </MenubarPrimitive.Content>
      </MenuGroupedContext.Provider>
    </MenubarPortal>
  )
}

function MenubarItem({
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
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
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
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-pressed={pressHandlers.pressed ? "true" : undefined}
      data-variant={variant}
      disabled={disabled}
      className={cn(
        "group/menubar-item relative flex cursor-default items-center gap-(--space-xs) rounded-md px-(--space-xs) py-(--space-2xs) text-sm outline-hidden select-none focus:bg-(--state-layer-focus) focus:text-accent-foreground active:bg-(--state-layer-pressed) data-[pressed=true]:bg-(--state-layer-pressed) not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:active:bg-destructive/10 data-[variant=destructive]:data-[pressed=true]:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 dark:data-[variant=destructive]:active:bg-destructive/20 dark:data-[variant=destructive]:data-[pressed=true]:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
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
    </MenubarPrimitive.Item>
  )
}

function MenubarCheckboxItem({
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
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
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
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
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
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {withIconLabels(children)}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  disabled,
  inset,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
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
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
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
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {withIconLabels(children)}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
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
    </MenubarPrimitive.Label>
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-(--card-stroke)",
        groupedSeparatorClassName,
        className
      )}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  disabled,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
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
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
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
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  children,
  sideOffset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  const grouped = React.useContext(MenuGroupedContext)

  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      data-grouped={grouped}
      sideOffset={grouped ? 8 : sideOffset}
      className={cn(
        "z-50 max-h-(--radix-menubar-content-available-height) min-w-32 origin-top overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) duration-(--speed-swift) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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
    </MenubarPrimitive.SubContent>
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
