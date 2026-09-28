"use client"

import * as React from "react"
import { Slot } from "radix-ui"

import { useIsMobile } from "@/hooks/use-mobile"
import { useScrollerRef } from "@/hooks/use-scroller"
import { cn } from "@/lib/utils"
import { shapeSpinKeyframes } from "@/lib/shapes"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ColorThemePortal } from "@/components/ui/color-theme"
import { DragHandle } from "@/components/ui/drag-handle"
import { Input, SearchInput, type SearchInputProps } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Fab } from "@/components/ui/fab"
import { PanelLeftIcon } from "@/components/ui/icons"

const NAVIGATION_PANE_STORAGE_PREFIX = "oneds-navigation-pane"
const NAVIGATION_PANE_KEYBOARD_SHORTCUT = "b"

// Every animated part of the panel shares one speed and easing so the whole
// navigation pane collapses/expands as a single object. Pair it with a `transition-*`
// utility that names which properties move, e.g. `transition-opacity ${MOTION}`.
const MOTION = "duration-(--navigation-pane-speed) ease-(--navigation-pane-ease)"

/** What the layout reserves for the navigation pane. Persisted. */
type NavigationPaneDock = "expanded" | "bar" | "hidden"
/** The full visual state, derived from dock + width. */
type NavigationPaneCollapse = NavigationPaneDock | "resized"
/** Which collapse states an author allows: full show/hide, or an icon bar. */
type NavigationPaneCollapsible = "hidden" | "bar"
/** Docked sits flush with the edge; floating lifts the panel off it. */
type NavigationPanePlacement = "docked" | "floating" | "drawer"
/** How the panel's boundary meets the content. */
type NavigationPaneEdge = "line" | "faded"

type NavigationPaneConfig = {
  collapsible: NavigationPaneCollapsible
  placement: NavigationPanePlacement
}

type NavigationPaneStore = { dock?: NavigationPaneDock; width?: string }

function readNavigationPaneStore(key: string): NavigationPaneStore {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "{}") as NavigationPaneStore
  } catch {
    return {}
  }
}

function writeNavigationPaneStore(key: string, value: NavigationPaneStore) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode); state stays in memory.
  }
}

// getComputedStyle does not resolve custom properties, so a throwaway probe
// turns a token into a used value. Returns 0 when the token is not defined.
function readTokenPx(host: HTMLElement | null, name: string) {
  if (typeof document === "undefined") return 0
  const parent = host ?? document.body
  if (!parent) return 0
  const probe = document.createElement("div")
  probe.style.cssText = `position:absolute;visibility:hidden;width:var(${name})`
  parent.appendChild(probe)
  const value = probe.getBoundingClientRect().width
  probe.remove()
  return value
}

type NavigationPaneContextProps = {
  id: string
  /** Effective placement: drawer on mobile. */
  placement: NavigationPanePlacement
  collapsible: NavigationPaneCollapsible
  collapse: NavigationPaneCollapse
  dock: NavigationPaneDock
  setDock: (dock: NavigationPaneDock) => void
  width: string | null
  setWidth: (width: string | null) => void
  resetWidth: () => void
  isResizing: boolean
  setResizing: (resizing: boolean) => void
  registerConfig: (config: NavigationPaneConfig) => void
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleNavigationPane: () => void
}

const NavigationPaneContext = React.createContext<NavigationPaneContextProps | null>(null)

function useNavigationPane() {
  const context = React.useContext(NavigationPaneContext)
  if (!context) {
    throw new Error("useNavigationPane must be used within a NavigationPaneProvider.")
  }

  return context
}

function NavigationPaneProvider({
  id = "navigation-pane",
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  persist = true,
  shortcut = true,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  id?: string
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  persist?: boolean
  shortcut?: boolean
}) {
  const isMobile = useIsMobile()
  const storageKey = `${NAVIGATION_PANE_STORAGE_PREFIX}:${id}`

  const [openMobile, setOpenMobile] = React.useState(false)
  const [config, setConfig] = React.useState<NavigationPaneConfig>({
    collapsible: "hidden",
    placement: "docked",
  })

  // Read during the first render so a restored width never flashes.
  const [restored] = React.useState<NavigationPaneStore>(() =>
    persist ? readNavigationPaneStore(storageKey) : {}
  )
  const [dockState, setDockState] = React.useState<NavigationPaneDock>(
    () => restored.dock ?? (defaultOpen ? "expanded" : "hidden")
  )
  const [width, setWidthState] = React.useState<string | null>(
    () => restored.width ?? null
  )
  const [isResizing, setResizing] = React.useState(false)
  const pendingFocus = React.useRef<"panel" | "trigger" | null>(null)

  const collapsedDock: NavigationPaneDock =
    config.collapsible === "bar" ? "bar" : "hidden"
  const dock: NavigationPaneDock =
    openProp !== undefined
      ? openProp
        ? "expanded"
        : collapsedDock
      : dockState === "expanded"
        ? "expanded"
        : collapsedDock

  const persistPatch = React.useCallback(
    (patch: NavigationPaneStore) => {
      if (!persist) return
      writeNavigationPaneStore(storageKey, {
        ...readNavigationPaneStore(storageKey),
        ...patch,
      })
    },
    [persist, storageKey]
  )

  const setDock = React.useCallback(
    (value: NavigationPaneDock) => {
      const next = value === "expanded" ? "expanded" : collapsedDock
      const panel = document.getElementById(`${id}-panel`)
      const trigger = document.getElementById(`${id}-floating-trigger`)
      if (next === "expanded" && document.activeElement === trigger) {
        pendingFocus.current = "panel"
      } else if (next === "hidden" && panel?.contains(document.activeElement)) {
        pendingFocus.current = "trigger"
      }
      if (setOpenProp) setOpenProp(next === "expanded")
      else setDockState(next)
      persistPatch({ dock: next })
    },
    [id, collapsedDock, setOpenProp, persistPatch]
  )

  const open = dock === "expanded"

  React.useLayoutEffect(() => {
    const request = pendingFocus.current
    if (!request || isMobile) return
    if ((request === "panel") !== open) return
    pendingFocus.current = null
    const panel = document.getElementById(`${id}-panel`)
    const target = request === "panel"
      ? panel?.querySelector<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]'
        ) ?? panel
      : document.getElementById(`${id}-floating-trigger`)
    target?.focus({ preventScroll: true })
  }, [id, open, isMobile])

  const setOpen = React.useCallback(
    (value: boolean) => setDock(value ? "expanded" : collapsedDock),
    [setDock, collapsedDock]
  )

  const toggleNavigationPane = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current)
      return
    }
    setDock(open ? collapsedDock : "expanded")
  }, [isMobile, open, collapsedDock, setDock])

  const setWidth = React.useCallback(
    (value: string | null) => {
      setWidthState(value)
      persistPatch({ width: value ?? undefined })
    },
    [persistPatch]
  )
  const resetWidth = React.useCallback(() => setWidth(null), [setWidth])

  const registerConfig = React.useCallback((next: NavigationPaneConfig) => {
    setConfig((prev) =>
      prev.collapsible === next.collapsible && prev.placement === next.placement
        ? prev
        : next
    )
  }, [])

  React.useEffect(() => {
    if (!shortcut) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === NAVIGATION_PANE_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleNavigationPane()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcut, toggleNavigationPane])

  const collapse: NavigationPaneCollapse = open ? (width ? "resized" : "expanded") : dock
  const placement: NavigationPanePlacement = isMobile ? "drawer" : config.placement
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<NavigationPaneContextProps>(
    () => ({
      id,
      placement,
      collapsible: config.collapsible,
      collapse,
      dock,
      setDock,
      width,
      setWidth,
      resetWidth,
      isResizing,
      setResizing,
      registerConfig,
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleNavigationPane,
    }),
    [
      id,
      config.collapsible,
      placement,
      collapse,
      dock,
      setDock,
      width,
      setWidth,
      resetWidth,
      isResizing,
      registerConfig,
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      toggleNavigationPane,
    ]
  )

  return (
    <NavigationPaneContext.Provider value={contextValue}>
      <div
        data-slot="navigation-pane-wrapper"
        style={style}
        className={cn("group/navigation-pane-wrapper flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </NavigationPaneContext.Provider>
  )
}

/**
 * A gradient edge, which `border` cannot draw — so it renders as a real rule
 * pinned to the panel's outer (end) edge rather than a border on the panel.
 */
function NavigationPaneEdgeRule() {
  return (
    <Separator
      data-slot="navigation-pane-edge"
      orientation="vertical"
      variant="faded"
      className="absolute inset-y-0 inset-e-0 z-10"
    />
  )
}

function NavigationPane({
  placement: placementProp,
  edge = "line",
  collapsible = "hidden",
  rail,
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  placement?: Extract<NavigationPanePlacement, "docked" | "floating">
  edge?: NavigationPaneEdge
  collapsible?: NavigationPaneCollapsible
  rail?: React.ReactNode
}) {
  const authored = placementProp ?? "docked"
  const floats = authored === "floating"
  const hasRail = Boolean(rail)

  const {
    id,
    isMobile,
    openMobile,
    setOpenMobile,
    collapse,
    dock,
    state,
    width,
    isResizing,
    placement,
    registerConfig,
  } = useNavigationPane()

  React.useEffect(() => {
    registerConfig({ collapsible, placement: authored })
  }, [registerConfig, collapsible, authored])

  // Only emit the width when it has been resized, so an author's override on
  // an ancestor (or the :root token) still wins by inheritance.
  const widthStyle = {
    ...style,
    ...(width ? { "--navigation-pane-width": width } : {}),
  } as React.CSSProperties

  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile} autoFocus direction="left">
        <ColorThemePortal>
        <DrawerContent
          {...props}
          id={`${id}-panel`}
          onCloseAutoFocus={(event) => {
            const trigger = document.getElementById(`${id}-floating-trigger`)
            if (!trigger) return
            event.preventDefault()
            trigger.focus({ preventScroll: true })
          }}
          data-navigation-pane="navigation-pane"
          data-slot="navigation-pane"
          data-placement="drawer"
          data-edge={edge}
          data-collapse="expanded"
          showCloseButton={false}
          className="overflow-hidden bg-navigation-pane p-0 text-navigation-pane-foreground"
          style={
            {
              "--navigation-pane-width": "var(--navigation-pane-width-mobile)",
              "--drawer-width": "var(--navigation-pane-width-mobile)",
            } as React.CSSProperties
          }
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>Navigation - Pane</DrawerTitle>
            <DrawerDescription>Displays the mobile navigation pane.</DrawerDescription>
          </DrawerHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </DrawerContent>
        </ColorThemePortal>
      </Drawer>
    )
  }

  return (
    <div
      className="group peer hidden text-navigation-pane-foreground md:block"
      data-slot="navigation-pane"
      data-dock={dock}
      data-collapse={collapse}
      data-placement={placement}
      data-attached-rail={hasRail ? "true" : undefined}
      data-edge={edge}
      data-resizing={isResizing ? "true" : undefined}
      data-state={state}
      data-collapsible={
        state === "collapsed" ? (collapsible === "bar" ? "icon" : "offcanvas") : ""
      }
      style={widthStyle}
    >
      {/* Reserves layout space. Tracks dock, not collapse, so nothing else reflows unexpectedly. */}
      <div
        data-slot="navigation-pane-gap"
        className={cn(
          `relative bg-transparent transition-[width] ${MOTION}`,
          "group-data-resizing:transition-none",
          hasRail
            ? "group-data-[dock=expanded]:w-(--navigation-pane-attached-width)"
            : "group-data-[dock=expanded]:w-(--navigation-pane-width)",
          "group-data-[dock=hidden]:w-0",
          floats
            ? "group-data-[dock=bar]:w-(--navigation-pane-width-icon-floating)"
            : "group-data-[dock=bar]:w-(--navigation-pane-width-icon)"
        )}
      />
      <div
        data-slot="navigation-pane-container"
        className={cn(
          `fixed inset-y-0 inset-s-0 z-10 hidden transition-[inset-inline-start,width,padding] ${MOTION} md:flex`,
          "group-data-resizing:transition-none",
          hasRail
            ? "w-(--navigation-pane-attached-width) group-data-[collapse=hidden]:-inset-s-(--navigation-pane-attached-width)"
            : "w-(--navigation-pane-width) group-data-[collapse=hidden]:-inset-s-(--navigation-pane-width)",
          floats
            ? "p-(--navigation-pane-floating-padding) group-data-[collapse=bar]:w-(--navigation-pane-width-icon-floating)"
            : cn(
                "group-data-[collapse=bar]:w-(--navigation-pane-width-icon)",
                edge === "line" && "border-e"
              ),
          className
        )}
        {...props}
      >
        <div
          data-navigation-pane="navigation-pane"
          data-slot="navigation-pane-inner"
          id={`${id}-panel`}
          tabIndex={-1}
          inert={collapse === "hidden"}
          className={cn(
            "flex size-full text-navigation-pane-foreground",
            hasRail
              ? "flex-row gap-(--navigation-pane-attached-gap) overflow-visible bg-transparent"
              : "flex-col overflow-hidden bg-navigation-pane",
            `transition-[border-radius,box-shadow,background-color] ${MOTION}`,
            !hasRail && "group-data-[placement=floating]:rounded-(--navigation-pane-radius) group-data-[placement=floating]:shadow-(--elevation-flat) group-data-[placement=floating]:ring-1 group-data-[placement=floating]:ring-(--elevation-stroke)"
          )}
        >
          {hasRail ? (
            <>
              {rail}
              <div
                data-slot="navigation-pane-panel"
                className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-s-(--navigation-pane-attached-inner-radius) rounded-e-(--navigation-pane-radius) bg-navigation-pane shadow-(--elevation-flat) ring-1 ring-(--elevation-stroke)"
              >
                {children}
              </div>
            </>
          ) : children}
        </div>
        {!floats && edge === "faded" && <NavigationPaneEdgeRule />}
      </div>
    </div>
  )
}

function NavigationPaneTrigger({
  className,
  onClick,
  placement = "inline",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size"> & {
  placement?: "inline" | "floating"
}) {
  const { id, toggleNavigationPane, open, openMobile, isMobile, collapsible, collapse } = useNavigationPane()
  // `open` is the desktop dock; on mobile the panel is the drawer.
  const expanded = isMobile ? openMobile : open
  const label = expanded ? "Close navigation pane" : "Open navigation pane"
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) toggleNavigationPane()
  }
  const floatingVisible = isMobile ? !openMobile : collapse === "hidden"
  const floatingTriggerRef = React.useRef<HTMLButtonElement>(null)

  // Rotates and grows the expressive shape in whenever the trigger reappears.
  React.useLayoutEffect(() => {
    const element = floatingTriggerRef.current
    const shape = element?.querySelector<SVGSVGElement>('[data-slot="shape"]')
    if (placement !== "floating" || !floatingVisible || !element || !shape) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    element.style.removeProperty("scale")
    shape.style.removeProperty("rotate")
    if (motion.matches) return
    const tokens = getComputedStyle(element)
    const entryScale = Number(tokens.getPropertyValue("--navigation-pane-floating-trigger-entry-scale"))
    const spinVelocity = Number(tokens.getPropertyValue("--navigation-pane-floating-trigger-spin-velocity"))
    const growthVelocity = Number(tokens.getPropertyValue("--navigation-pane-floating-trigger-growth-velocity"))
    if (spinVelocity <= 0 || growthVelocity <= 0) return
    const turns = Number(tokens.getPropertyValue("--navigation-pane-floating-trigger-spin-turns"))
    const spinDistance = 360 * turns + 2 * Number(tokens.getPropertyValue("--shape-spin-anticipation"))
    const spin = shape.animate(shapeSpinKeyframes(tokens, 0, turns), { duration: spinDistance / spinVelocity * 1000, fill: "both" })
    const growth = element.animate([{ scale: entryScale }, { scale: 1 }], {
      duration: element.offsetWidth * (1 - entryScale) / growthVelocity * 1000,
      easing: tokens.getPropertyValue("--shape-spin-travel-ease").trim(), fill: "both",
    })
    const stop = () => {
      spin.cancel()
      growth.cancel()
      element.style.removeProperty("scale")
      shape.style.removeProperty("rotate")
    }
    const onMotionChange = () => { if (motion.matches) stop() }
    motion.addEventListener("change", onMotionChange)
    return () => {
      for (const animation of [spin, growth]) {
        if (animation.playState !== "idle") animation.commitStyles()
        animation.cancel()
      }
      motion.removeEventListener("change", onMotionChange)
    }
  }, [placement, floatingVisible])

  if (placement === "floating") {
    if (!isMobile && collapsible !== "hidden") return null
    const visible = floatingVisible

    return (
      <Fab
        {...props}
        ref={floatingTriggerRef}
        variant="expressive"
        shape="cookie7"
        tooltipSide="right"
        id={`${id}-floating-trigger`}
        data-navigation-pane="trigger"
        data-slot="navigation-pane-trigger"
        data-placement="floating"
        data-visible={visible}
        inert={!visible}
        aria-hidden={!visible}
        aria-label={label}
        aria-expanded={expanded}
        aria-controls={!isMobile || openMobile ? `${id}-panel` : undefined}
        className={cn(
          "absolute top-(--navigation-pane-floating-trigger-inset) inset-s-(--navigation-pane-floating-trigger-inset) z-20",
          `transition-[opacity,scale] ${MOTION}`,
          "data-[visible=false]:pointer-events-none data-[visible=false]:scale-95 data-[visible=false]:opacity-0 data-[visible=false]:ease-(--ease-exit)",
          "data-[visible=false]:duration-(--navigation-pane-floating-trigger-fade-out-speed)",
          "data-[visible=true]:scale-100 data-[visible=true]:opacity-100 data-[visible=true]:delay-(--navigation-pane-floating-trigger-fade-in-delay) data-[visible=true]:motion-reduce:delay-0",
          className
        )}
        onClick={toggle}
      >
        <PanelLeftIcon size={20} className="rtl:rotate-180" />
      </Fab>
    )
  }

  return (
    <Button
      data-navigation-pane="trigger"
      data-slot="navigation-pane-trigger"
      data-placement={placement}
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={!isMobile || openMobile ? `${id}-panel` : undefined}
      className={cn(
        `ms-auto transition-opacity ${MOTION}`,
        "aria-expanded:bg-transparent aria-expanded:hover:bg-(--state-layer-hover) aria-expanded:active:bg-(--state-layer-pressed)",
        // Collapsed the toggle always fades away, so the bar stays clean.
        "group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0",
        // Collapsed it leaves the flex flow so the brand mark centers on the
        // icon bar, and it returns on hover. Scoped to the header: hovering a nav
        // row must not swap the brand for the toggle.
        "group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:inset-0 group-data-[collapsible=icon]:m-auto group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:rounded-(--item-compact-radius)",
        "group-data-[collapsible=icon]:group-hover/navigation-pane-header:pointer-events-auto group-data-[collapsible=icon]:group-hover/navigation-pane-header:opacity-100",
        "group-data-[collapsible=icon]:focus-visible:pointer-events-auto group-data-[collapsible=icon]:focus-visible:opacity-100",
        className
      )}
      onClick={toggle}
      {...props}
    >
      <PanelLeftIcon size={20} className="rtl:rotate-180" />
    </Button>
  )
}

function NavigationPaneBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-brand"
      // Box size snaps instantly (no width/height transition): the mark's own
      // rendered position is already identical at both sizes, so animating the
      // box only adds a wobble with nothing that needs to visibly move.
      className={cn(
        "flex h-8 shrink-0 items-center overflow-hidden group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:mx-auto",
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneBrandMark({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-brand-mark"
      // Pinned by a fixed inset, entirely out of flex flow: the label and
      // trigger can fade/reflow around it however they like without ever
      // moving this box — no collapse-state size or margin changes either.
      className={cn(
        `absolute inset-y-0 inset-s-(--navigation-pane-brand-mark-inset) my-auto flex size-8 shrink-0 items-center justify-center transition-opacity ${MOTION}`,
        // Yields to the toggle, which sits on top of it while collapsed. Scoped to
        // the header: hovering a nav row must not flicker the brand.
        "group-data-[collapsible=icon]:group-hover/navigation-pane-header:pointer-events-none group-data-[collapsible=icon]:group-hover/navigation-pane-header:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneBrandLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-brand-label"
      // Opacity only, never display/width: the mark is absolutely pinned and this
      // label is clipped by the brand box, so fading it moves nothing.
      className={cn(
        `ms-(--navigation-pane-brand-label-inset) min-w-0 flex-1 truncate text-sm font-medium transition-opacity ${MOTION} group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0`,
        className
      )}
      {...props}
    />
  )
}

type NavigationPaneResizeBounds = { min: number; max: number; snap: number; step: number }

function NavigationPaneResizeHandle({
  className,
  onKeyDown,
  onDoubleClick,
  onPointerDown,
  ...props
}: React.ComponentProps<"div">) {
  const { width, collapsible, isMobile, setDock, setWidth, resetWidth, setResizing, toggleNavigationPane } =
    useNavigationPane()
  const ref = React.useRef<HTMLDivElement>(null)
  const boundsRef = React.useRef<NavigationPaneResizeBounds | null>(null)
  const [bounds, setBounds] = React.useState<NavigationPaneResizeBounds | null>(null)
  const [naturalWidth, setNaturalWidth] = React.useState(0)

  const panel = React.useCallback(
    () =>
      ref.current?.closest<HTMLElement>('[data-slot="navigation-pane-container"]') ??
      ref.current?.closest<HTMLElement>('[data-slot="navigation-pane"]') ??
      null,
    []
  )

  const readBounds = React.useCallback(
    (): NavigationPaneResizeBounds => ({
      min: readTokenPx(panel(), "--navigation-pane-width-min"),
      max: readTokenPx(panel(), "--navigation-pane-width-max"),
      snap: readTokenPx(panel(), "--navigation-pane-snap-threshold"),
      step: readTokenPx(panel(), "--navigation-pane-resize-step"),
    }),
    [panel]
  )

  // One mount-time read of the token bounds and the untouched panel width.
  // Everything after that is derived from the committed width.
  React.useEffect(() => {
    const next = readBounds()
    boundsRef.current = next
    setBounds(next)
    const host = panel()
    if (host) setNaturalWidth(Math.round(host.getBoundingClientRect().width))
  }, [readBounds, panel])

  const committed = width?.endsWith("px") ? Number.parseFloat(width) : NaN
  const valueNow = Number.isFinite(committed)
    ? Math.round(committed)
    : naturalWidth

  const commit = React.useCallback(
    (raw: number) => {
      const limits = boundsRef.current ?? readBounds()
      boundsRef.current = limits
      if (limits.snap > 0 && raw < limits.snap) {
        setDock(collapsible === "bar" ? "bar" : "hidden")
        return
      }
      const max = limits.max > 0 ? limits.max : Number.POSITIVE_INFINITY
      const next = Math.round(Math.min(max, Math.max(limits.min, raw)))
      setWidth(`${next}px`)
    },
    [readBounds, setDock, collapsible, setWidth]
  )

  const geometry = React.useCallback(() => {
    const host = panel()
    if (!host) return null
    const rect = host.getBoundingClientRect()
    const rtl = getComputedStyle(host).direction === "rtl"
    return { rect, onLeft: !rtl }
  }, [panel])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event)
    if (event.defaultPrevented || event.button !== 0) return
    event.preventDefault()
    boundsRef.current = readBounds()
    setResizing(true)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Synthetic pointers reject capture; the window listeners still fire.
    }
    const move = (moveEvent: PointerEvent) => {
      const box = geometry()
      if (!box) return
      commit(
        box.onLeft
          ? moveEvent.clientX - box.rect.left
          : box.rect.right - moveEvent.clientX
      )
    }
    const end = () => {
      setResizing(false)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", end)
      window.removeEventListener("pointercancel", end)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", end)
    window.addEventListener("pointercancel", end)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const limits = boundsRef.current ?? readBounds()
    boundsRef.current = limits
    const box = geometry()
    const current = box ? box.rect.width : valueNow

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      const towardRight = event.key === "ArrowRight" ? 1 : -1
      const grow = box?.onLeft === false ? -towardRight : towardRight
      commit(current + grow * limits.step)
      return
    }
    if (event.key === "Home") {
      event.preventDefault()
      commit(limits.min)
      return
    }
    if (event.key === "End") {
      event.preventDefault()
      commit(limits.max > 0 ? limits.max : current)
      return
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      toggleNavigationPane()
    }
  }

  if (isMobile) return null

  return (
    <div
      ref={ref}
      data-slot="navigation-pane-resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize navigation pane"
      aria-valuenow={valueNow || undefined}
      aria-valuemin={bounds?.min || undefined}
      aria-valuemax={bounds && bounds.max > 0 ? bounds.max : undefined}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onDoubleClick={(event) => {
        onDoubleClick?.(event)
        if (!event.defaultPrevented) resetWidth()
      }}
      className={cn(
        "group/navigation-pane-resize-handle absolute inset-y-0 inset-e-0 z-20 hidden w-(--navigation-pane-resize-handle-width) me-(--navigation-pane-resize-handle-offset) cursor-col-resize touch-none outline-none select-none",
        // Two attribute selectors outrank the base `hidden`, whatever the emit order.
        "[[data-slot=navigation-pane][data-dock=expanded]_&]:block",
        className
      )}
      {...props}
    >
      <DragHandle
        aria-hidden="true"
        variant="grip"
        orientation="vertical"
        className="pointer-events-none absolute top-1/2 inset-s-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-(--drag-handle-speed) ease-(--drag-handle-ease) group-hover/navigation-pane-resize-handle:h-(--drag-handle-active-length) group-hover/navigation-pane-resize-handle:w-(--drag-handle-active-thickness) group-hover/navigation-pane-resize-handle:bg-(--drag-handle-fill-hover) group-focus-visible/navigation-pane-resize-handle:h-(--drag-handle-active-length) group-focus-visible/navigation-pane-resize-handle:w-(--drag-handle-active-thickness) group-focus-visible/navigation-pane-resize-handle:bg-(--drag-handle-fill-pressed) group-focus-visible/navigation-pane-resize-handle:shadow-(--drag-handle-active-shadow) group-data-resizing:h-(--drag-handle-active-length) group-data-resizing:w-(--drag-handle-active-thickness) group-data-resizing:bg-(--drag-handle-fill-pressed) group-data-resizing:shadow-(--drag-handle-active-shadow)"
      />
    </div>
  )
}

function NavigationPaneInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="navigation-pane-inset"
      className={cn("relative flex w-full flex-1 flex-col bg-background", className)}
      {...props}
    />
  )
}

function NavigationPaneInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="navigation-pane-input"
      data-navigation-pane="input"
      className={cn("h-8 w-full bg-control shadow-none", className)}
      {...props}
    />
  )
}

// The canonical navigation pane search. Its geometry matches a nav row — the Item's
// compact radius and inset, and a fixed 28px leading icon host (like ItemMedia)
// — so its pill width and icon column line up with the menu below it. On an icon
// bar it collapses to that icon host: the field narrows to a circle (its height
// never changes) while the text and clear button fade and give up their width.
// Only width/opacity move, so nothing reflows. Place it inside a NavigationPaneGroup so
// it inherits the same inset as the menu.
function NavigationPaneSearch({ className, ref, ...props }: SearchInputProps) {
  const { collapse, setDock } = useNavigationPane()
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  return (
    // The field itself is unclickable while collapsed (its control gets
    // pointer-events-none below), so the click lands here instead — expand
    // the pane, then focus once the control can actually receive it.
    <div
      className="contents"
      onClick={() => {
        if (collapse !== "bar") return
        setDock("expanded")
        requestAnimationFrame(() => inputRef.current?.focus())
      }}
    >
      <SearchInput
        ref={inputRef}
        data-navigation-pane="search"
        className={cn(
          "overflow-hidden rounded-(--item-compact-radius) p-(--item-compact-inset)",
          // Leading icon: a fixed, non-shrinking, centered 28px host.
          "**:data-[slot=input-group-addon]:data-[align=inline-start]:flex-none **:data-[slot=input-group-addon]:data-[align=inline-start]:size-(--item-compact-media-host-size) **:data-[slot=input-group-addon]:data-[align=inline-start]:justify-center **:data-[slot=input-group-addon]:data-[align=inline-start]:p-0",
          // Text control stays shrinkable so its width tracks the field as the
          // panel animates; only its opacity toggles on collapse.
          "**:data-[slot=input-group-control]:min-w-0 **:data-[slot=input-group-control]:transition-opacity **:data-[slot=input-group-control]:duration-(--navigation-pane-speed) **:data-[slot=input-group-control]:ease-(--navigation-pane-ease)",
          "group-data-[collapsible=icon]:**:data-[slot=input-group-control]:pointer-events-none group-data-[collapsible=icon]:**:data-[slot=input-group-control]:opacity-0",
          // Clear button fades out.
          "**:data-[slot=input-group-addon]:data-[align=inline-end]:transition-opacity **:data-[slot=input-group-addon]:data-[align=inline-end]:duration-(--navigation-pane-speed) **:data-[slot=input-group-addon]:data-[align=inline-end]:ease-(--navigation-pane-ease)",
          "group-data-[collapsible=icon]:**:data-[slot=input-group-addon]:data-[align=inline-end]:pointer-events-none group-data-[collapsible=icon]:**:data-[slot=input-group-addon]:data-[align=inline-end]:opacity-0",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationPaneHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-header"
      data-navigation-pane="header"
      className={cn(
        `group/navigation-pane-header relative flex min-h-(--navigation-pane-header-height) shrink-0 flex-col justify-center gap-(--space-xs) px-(--navigation-pane-menu-group-inset) pt-(--navigation-pane-padding) pb-(--space-xs) transition-[padding] ${MOTION}`,
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneHeaderActions({
  className,
  ...props
}: React.ComponentProps<typeof ButtonGroup>) {
  return (
    <ButtonGroup
      data-navigation-pane="header-actions"
      shape="round"
      spacing="none"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function NavigationPaneFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-footer"
      data-navigation-pane="footer"
      className={cn(
        `flex shrink-0 flex-col gap-(--space-xs) px-(--navigation-pane-menu-group-inset) pt-(--space-xs) pb-(--navigation-pane-padding) transition-[padding] ${MOTION}`,
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneAccount({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="navigation-pane-account"
      data-navigation-pane="account"
      className={cn(
        `flex h-12 w-full cursor-pointer items-center gap-(--space-sm) overflow-hidden rounded-full p-(--space-xs) text-left text-sm ring-navigation-pane-ring outline-hidden transition-[width,height] ${MOTION} hover:bg-(--item-default-hover-surface) hover:text-navigation-pane-accent-foreground focus-visible:ring-2 active:bg-(--item-default-pressed-surface)`,
        // Collapsed it stops being a row and becomes an avatar chip sized to the
        // icon column; the pill radius already carries it from row to circle.
        "group-data-[collapsible=icon]:size-10!",
        // 24px avatar in 40px circle with 8px padding keeps the avatar centered at x=24px at all times.
        "*:data-[slot=avatar]:size-6 *:data-[slot=avatar]:shrink-0",
        "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:transition-opacity [&>svg]:duration-(--navigation-pane-speed) [&>svg]:ease-(--navigation-pane-ease) group-data-[collapsible=icon]:[&>svg]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneAccountDetails({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-account-details"
      className={cn(
        `grid min-w-0 flex-1 text-start leading-tight transition-opacity ${MOTION} group-data-[collapsible=icon]:opacity-0`,
        "*:truncate *:first:font-medium [&>:last-child:not(:first-child)]:text-xs [&>:last-child:not(:first-child)]:text-navigation-pane-foreground/70",
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneContent({
  children,
  className,
  fade = true,
  scrollbar = "hidden",
  stickyHeader,
  ...props
}: React.ComponentProps<"div"> & {
  fade?: boolean
  scrollbar?: "hidden" | "thin"
  stickyHeader?: React.ReactNode
}) {
  const setRef = useScrollerRef<HTMLDivElement>()

  if (stickyHeader) {
    return (
      <div
        data-slot="navigation-pane-content"
        data-navigation-pane="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-(--space-none) overflow-hidden",
          className
        )}
        {...props}
      >
        <div data-slot="navigation-pane-content-sticky" className="shrink-0">
          {stickyHeader}
        </div>
        <div
          ref={setRef}
          data-slot="navigation-pane-content-viewport"
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
            fade && "scroll-fade-y scroll-fade-6",
            scrollbar === "hidden" ? "no-scrollbar" : "scrollbar-thin"
          )}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setRef}
      data-slot="navigation-pane-content"
      data-navigation-pane="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-(--space-none) overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        fade && "scroll-fade-y scroll-fade-6",
        scrollbar === "hidden" ? "no-scrollbar" : "scrollbar-thin",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function NavigationPaneGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-group"
      data-navigation-pane="group"
      className={cn(
        `relative flex w-full min-w-0 flex-col px-(--navigation-pane-menu-group-inset) py-(--space-xs) transition-[padding,margin] ${MOTION}`,
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="navigation-pane-group-label"
      data-navigation-pane="group-label"
      className={cn(
        `flex h-8 shrink-0 items-center rounded-md px-(--item-compact-inset) text-xs font-medium text-navigation-pane-foreground/70 ring-navigation-pane-ring outline-hidden transition-opacity ${MOTION} group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0`,
        className
      )}
      {...props}
    />
  )
}

function NavigationPaneGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-pane-group-content"
      data-navigation-pane="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function NavigationPaneMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="navigation-pane-menu"
      data-navigation-pane="menu"
      className={cn("flex w-full min-w-0 flex-col gap-(--space-2xs)", className)}
      {...props}
    />
  )
}

function NavigationPaneMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="navigation-pane-menu-item"
      data-navigation-pane="menu-item"
      // Owns collapse presentation for its row, so every consumer animates the
      // same way: the row never re-wraps while the panel width animates (text is
      // clipped instead), and only opacity changes as it collapses.
      className={cn(
        "group/menu-item relative",
        "**:data-[slot=item]:flex-nowrap **:data-[slot=item]:overflow-hidden",
        "**:data-[slot=item-title]:whitespace-nowrap",
        "**:data-[slot=item-content]:transition-opacity **:data-[slot=item-content]:duration-(--navigation-pane-speed) **:data-[slot=item-content]:ease-(--navigation-pane-ease)",
        "group-data-[collapsible=icon]:**:data-[slot=item-content]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationPane,
  NavigationPaneAccount,
  NavigationPaneAccountDetails,
  NavigationPaneBrand,
  NavigationPaneBrandLabel,
  NavigationPaneBrandMark,
  NavigationPaneContent,
  NavigationPaneFooter,
  NavigationPaneGroup,
  NavigationPaneGroupContent,
  NavigationPaneGroupLabel,
  NavigationPaneHeader,
  NavigationPaneHeaderActions,
  NavigationPaneInput,
  NavigationPaneInset,
  NavigationPaneMenu,
  NavigationPaneMenuItem,
  NavigationPaneProvider,
  NavigationPaneResizeHandle,
  NavigationPaneSearch,
  NavigationPaneTrigger,
  useNavigationPane,
}
export type { NavigationPaneCollapse, NavigationPaneCollapsible, NavigationPanePlacement }
