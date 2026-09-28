import * as React from "react"

// Shared expressive-menu treatment for Radix menu families (Dropdown, Context,
// Menubar). This context bridges the treatment to portaled submenu content. All
// geometry and color come from the shared --menu-* tokens in styles/tokens.css.
const MenuGroupedContext = React.createContext(false)

// Base scroller for every menu surface; grouped mode overrides padding below.
const menuScrollerBaseClassName = "p-1"

// Grouped content is a transparent shell: the raised white chunks are the groups.
const groupedContentResetClassName =
  "overflow-visible bg-transparent shadow-none ring-0"

// Grouped root scroller: stacks chunks with the tokenized gap, no scroll mask.
const groupedMenuScrollerClassName =
  "flex flex-col gap-(--menu-chunk-gap) overflow-visible overflow-x-visible overflow-y-visible scroll-fade-none p-0"

// Grouped submenu scroller: a single continuous chunk, so rows sit flush.
const groupedSubmenuScrollerClassName =
  "flex flex-col gap-0 overflow-visible overflow-x-visible overflow-y-visible scroll-fade-none p-0"

// A raised white chunk surface (used by a group and by a grouped submenu).
const groupedMenuSurfaceClassName =
  "overflow-x-hidden overflow-y-auto overscroll-contain rounded-(--menu-chunk-radius) bg-popover p-(--menu-chunk-padding) shadow-(--elevation-floating) ring-1 ring-(--elevation-stroke) no-scrollbar"

type GroupedMenuChildrenProps = {
  children: React.ReactNode
  groupType: React.ElementType
}

type MenuGroupElement = React.ReactElement<{
  children?: React.ReactNode
}>

function isMenuGroupElement(
  child: React.ReactNode,
  groupType: React.ElementType
): child is MenuGroupElement {
  return React.isValidElement(child) && child.type === groupType
}

function GroupedMenuChildren({
  children,
  groupType,
}: GroupedMenuChildrenProps) {
  const childNodes = React.Children.toArray(children)
  const hasOnlyExplicitGroups =
    childNodes.length > 0 &&
    childNodes.every((child) => isMenuGroupElement(child, groupType))

  if (hasOnlyExplicitGroups) {
    return children
  }

  return React.createElement(
    "div",
    {
      "data-slot": "menu-group",
      role: "group",
      className: groupedMenuSurfaceClassName,
    },
    childNodes.map((child, index) =>
      isMenuGroupElement(child, groupType)
        ? React.createElement(
            React.Fragment,
            { key: child.key ?? `menu-group-${index}` },
            child.props.children
          )
        : child
    )
  )
}

// A group becomes a chunk only inside grouped content.
const groupedGroupClassName =
  "in-data-[grouped=true]:flex in-data-[grouped=true]:w-full in-data-[grouped=true]:flex-col in-data-[grouped=true]:overflow-x-hidden in-data-[grouped=true]:overflow-y-auto in-data-[grouped=true]:overscroll-contain in-data-[grouped=true]:rounded-(--menu-chunk-radius) in-data-[grouped=true]:bg-popover in-data-[grouped=true]:p-(--menu-chunk-padding) in-data-[grouped=true]:shadow-(--elevation-floating) in-data-[grouped=true]:ring-1 in-data-[grouped=true]:ring-(--elevation-stroke) in-data-[grouped=true]:no-scrollbar"

// A grouped row: 40px min height, concentric inner/edge radii, tertiary state layers.
const groupedItemClassName =
  "in-data-[grouped=true]:min-h-(--menu-item-height) in-data-[grouped=true]:rounded-(--menu-item-inner-radius) in-data-[grouped=true]:px-(--menu-item-padding-inline) in-data-[grouped=true]:py-0 in-data-[grouped=true]:first:rounded-t-(--menu-item-edge-radius) in-data-[grouped=true]:last:rounded-b-(--menu-item-edge-radius) in-data-[grouped=true]:hover:bg-(--menu-item-hover-fill) in-data-[grouped=true]:focus:bg-(--menu-item-focus-fill) in-data-[grouped=true]:active:bg-(--menu-item-pressed-fill) in-data-[grouped=true]:data-[pressed=true]:bg-(--menu-item-pressed-fill)"

// Listbox-style menu surfaces (Select, Combobox) use the same row geometry
// without grouped chunks.
const menuListboxItemClassName =
  "min-h-(--menu-item-height) rounded-(--menu-item-inner-radius) px-(--menu-item-padding-inline) py-0 first:rounded-t-(--menu-item-edge-radius) last:rounded-b-(--menu-item-edge-radius)"

const menuListboxLabelClassName =
  "flex min-h-(--menu-item-height) items-center rounded-(--menu-item-inner-radius) px-(--menu-item-padding-inline) py-0 text-xs font-medium text-muted-foreground **:text-muted-foreground"

const menuListboxSeparatorClassName =
  "mx-(--menu-divider-margin-inline) my-1 h-px bg-(--card-stroke)"

// A grouped title: a muted 40px row that aligns to the icon column when inset.
const groupedLabelClassName =
  "in-data-[grouped=true]:flex in-data-[grouped=true]:min-h-(--menu-item-height) in-data-[grouped=true]:items-center in-data-[grouped=true]:rounded-(--menu-item-inner-radius) in-data-[grouped=true]:px-(--menu-item-padding-inline) in-data-[grouped=true]:py-0 in-data-[grouped=true]:first:rounded-t-(--menu-item-edge-radius) in-data-[grouped=true]:data-inset:ps-(--menu-label-icon-padding-start) **:text-muted-foreground"

// Grouped dividers are padded inside a chunk, never edge to edge.
const groupedSeparatorClassName =
  "in-data-[grouped=true]:mx-(--menu-divider-margin-inline) in-data-[grouped=true]:bg-(--card-stroke)"

// A grouped submenu trigger changes only color while open; its corner radius
// stays whatever its row position gives it (no shape morph).
const groupedSubTriggerOpenClassName =
  "in-data-[grouped=true]:data-open:bg-(--menu-item-focus-fill) in-data-[grouped=true]:data-open:text-popover-foreground in-data-[grouped=true]:data-open:hover:bg-(--menu-item-focus-fill) in-data-[grouped=true]:data-open:focus:bg-(--menu-item-focus-fill) in-data-[grouped=true]:data-open:active:bg-(--menu-item-pressed-fill)"

// Menu rows align text consistently; trailing graphics must not shift labels.
const menuTextPaddingClassName =
  "[&>[data-slot=icon-label]]:ps-0 [&>[data-slot=icon-label]]:pe-(--space-xs)"

// Press is a transient pointer state: hover shows the lighter fill, holding the
// row darkens it. Cleared on release, leave, or cancel; ignored while disabled.
function useMenuPressHandlers<T extends HTMLElement>(
  disabled: boolean | undefined,
  onPointerDown: React.PointerEventHandler<T> | undefined,
  onPointerUp: React.PointerEventHandler<T> | undefined,
  onPointerLeave: React.PointerEventHandler<T> | undefined,
  onPointerCancel: React.PointerEventHandler<T> | undefined
) {
  const [pressed, setPressed] = React.useState(false)

  return {
    pressed,
    onPointerDown: (event: React.PointerEvent<T>) => {
      onPointerDown?.(event)
      if (
        event.defaultPrevented ||
        disabled ||
        event.currentTarget.hasAttribute("data-disabled")
      ) {
        return
      }
      setPressed(true)
    },
    onPointerUp: (event: React.PointerEvent<T>) => {
      onPointerUp?.(event)
      setPressed(false)
    },
    onPointerLeave: (event: React.PointerEvent<T>) => {
      onPointerLeave?.(event)
      setPressed(false)
    },
    onPointerCancel: (event: React.PointerEvent<T>) => {
      onPointerCancel?.(event)
      setPressed(false)
    },
  }
}

export {
  MenuGroupedContext,
  GroupedMenuChildren,
  menuScrollerBaseClassName,
  groupedContentResetClassName,
  groupedMenuScrollerClassName,
  groupedSubmenuScrollerClassName,
  groupedMenuSurfaceClassName,
  groupedGroupClassName,
  groupedItemClassName,
  menuListboxItemClassName,
  menuListboxLabelClassName,
  menuListboxSeparatorClassName,
  groupedLabelClassName,
  groupedSeparatorClassName,
  groupedSubTriggerOpenClassName,
  menuTextPaddingClassName,
  useMenuPressHandlers,
}
