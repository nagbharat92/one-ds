"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { useIsMobile } from "@/hooks/use-mobile"
import { useScrollerRef } from "@/hooks/use-scroller"
import { cn } from "@/lib/utils"
import { shapeSpinKeyframes } from "@/lib/shapes"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ColorThemePortal } from "@/components/ui/color-theme"
import { DragHandle } from "@/components/ui/drag-handle"
import { Input } from "@/components/ui/input"
import { withIconLabels } from "@/components/ui/icon-label"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { Fab } from "@/components/ui/fab"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PanelLeftIcon } from "@/components/ui/icons"

const SIDEBAR_STORAGE_PREFIX = "oneds-sidebar"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

/** What the layout reserves for the sidebar. Persisted. */
type SidebarDock = "expanded" | "bar" | "hidden"
/** The full visual state, derived from dock + width + peek. */
type SidebarCollapse = SidebarDock | "resized" | "peeking"
/** Which collapse states an author allows. */
type SidebarCollapsible = "none" | "bar" | "hidden"
type SidebarPlacement = "docked" | "floating" | "inset" | "overlay" | "drawer"
type SidebarSide = "start" | "end"
type SidebarForm = "panel" | "bar" | "pane"
/** How the panel's boundary meets the content. Independent of placement. */
type SidebarEdge = "line" | "faded" | "none"
type SidebarVariant = "sidebar" | "floating" | "inset"

type SidebarConfig = {
  collapsible: SidebarCollapsible
  side: SidebarSide
  form: SidebarForm
  placement: SidebarPlacement
}

function normalizeCollapsible(
  value: SidebarCollapsible | "icon" | "offcanvas"
): SidebarCollapsible {
  if (value === "icon") return "bar"
  if (value === "offcanvas") return "hidden"
  return value
}

function normalizeSide(value: SidebarSide | "left" | "right"): SidebarSide {
  if (value === "left") return "start"
  if (value === "right") return "end"
  return value
}

function placementFromVariant(variant: SidebarVariant): SidebarPlacement {
  return variant === "sidebar" ? "docked" : variant
}

function variantFromPlacement(placement: SidebarPlacement): SidebarVariant {
  return placement === "floating" || placement === "inset" ? placement : "sidebar"
}

type SidebarStore = { dock?: SidebarDock; width?: string }

function readSidebarStore(key: string): SidebarStore {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "{}") as SidebarStore
  } catch {
    return {}
  }
}

function writeSidebarStore(key: string, value: SidebarStore) {
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

function readTokenMs(host: HTMLElement | null, name: string) {
  if (typeof document === "undefined") return 0
  const parent = host ?? document.body
  if (!parent) return 0
  const probe = document.createElement("div")
  probe.style.cssText = `position:absolute;visibility:hidden;transition-duration:var(${name})`
  parent.appendChild(probe)
  const raw = getComputedStyle(probe).transitionDuration
  probe.remove()
  const value = Number.parseFloat(raw)
  if (!Number.isFinite(value) || value <= 0) return 0
  return raw.trim().endsWith("ms") ? value : value * 1000
}

type SidebarContextProps = {
  id: string
  form: SidebarForm
  side: SidebarSide
  /** Effective placement: flips to overlay while peeking, drawer on mobile. */
  placement: SidebarPlacement
  collapsible: SidebarCollapsible
  collapse: SidebarCollapse
  dock: SidebarDock
  setDock: (dock: SidebarDock) => void
  width: string | null
  setWidth: (width: string | null) => void
  resetWidth: () => void
  isResizing: boolean
  setResizing: (resizing: boolean) => void
  peekEnabled: boolean
  peeking: boolean
  startPeek: (immediate?: boolean) => void
  stopPeek: (immediate?: boolean) => void
  registerConfig: (config: SidebarConfig) => void
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  id = "sidebar",
  defaultOpen = true,
  defaultDock,
  open: openProp,
  onOpenChange: setOpenProp,
  persist = true,
  peek: peekEnabled = false,
  shortcut = true,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  id?: string
  defaultOpen?: boolean
  defaultDock?: SidebarDock
  open?: boolean
  onOpenChange?: (open: boolean) => void
  persist?: boolean
  peek?: boolean
  shortcut?: boolean
}) {
  const isMobile = useIsMobile()
  const storageKey = `${SIDEBAR_STORAGE_PREFIX}:${id}`

  const [openMobile, setOpenMobile] = React.useState(false)
  const [config, setConfig] = React.useState<SidebarConfig>({
    collapsible: "hidden",
    side: "start",
    form: "panel",
    placement: "docked",
  })

  // Read during the first render so a restored width never flashes.
  const [restored] = React.useState<SidebarStore>(() =>
    persist ? readSidebarStore(storageKey) : {}
  )
  const [dockState, setDockState] = React.useState<SidebarDock>(
    () => restored.dock ?? defaultDock ?? (defaultOpen ? "expanded" : "hidden")
  )
  const [width, setWidthState] = React.useState<string | null>(
    () => restored.width ?? null
  )
  const [peeking, setPeeking] = React.useState(false)
  const [isResizing, setResizing] = React.useState(false)
  const pendingFocus = React.useRef<"panel" | "trigger" | null>(null)

  const collapsedDock: SidebarDock =
    config.collapsible === "bar" ? "bar" : "hidden"
  const dock: SidebarDock =
    config.collapsible === "none"
      ? "expanded"
      : openProp !== undefined
        ? openProp
          ? "expanded"
          : collapsedDock
        : dockState === "expanded"
          ? "expanded"
          : collapsedDock

  const persistPatch = React.useCallback(
    (patch: SidebarStore) => {
      if (!persist) return
      writeSidebarStore(storageKey, {
        ...readSidebarStore(storageKey),
        ...patch,
      })
    },
    [persist, storageKey]
  )

  const peekTimer = React.useRef<number | null>(null)
  const peekDelays = React.useRef<{ open: number; close: number } | null>(null)
  const clearPeekTimer = React.useCallback(() => {
    if (peekTimer.current !== null) {
      window.clearTimeout(peekTimer.current)
      peekTimer.current = null
    }
  }, [])

  React.useEffect(() => clearPeekTimer, [clearPeekTimer])

  const setDock = React.useCallback(
    (value: SidebarDock) => {
      const next = value === "expanded" ? "expanded" : collapsedDock
      const panel = document.getElementById(`${id}-panel`)
      const trigger = document.getElementById(`${id}-floating-trigger`)
      if (next === "expanded" && document.activeElement === trigger) {
        pendingFocus.current = "panel"
      } else if (next === "hidden" && panel?.contains(document.activeElement)) {
        pendingFocus.current = "trigger"
      }
      clearPeekTimer()
      setPeeking(false)
      if (setOpenProp) setOpenProp(next === "expanded")
      else setDockState(next)
      persistPatch({ dock: next })
    },
    [id, collapsedDock, clearPeekTimer, setOpenProp, persistPatch]
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

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current)
      return
    }
    setDock(open ? collapsedDock : "expanded")
  }, [isMobile, open, collapsedDock, setDock])

  const startPeek = React.useCallback(
    (immediate = false) => {
      if (!peekEnabled || isMobile) return
      clearPeekTimer()
      if (immediate) {
        setPeeking(true)
        return
      }
      peekDelays.current ??= {
        open: readTokenMs(null, "--sidebar-peek-open-delay"),
        close: readTokenMs(null, "--sidebar-peek-close-delay"),
      }
      peekTimer.current = window.setTimeout(
        () => setPeeking(true),
        peekDelays.current.open
      )
    },
    [peekEnabled, isMobile, clearPeekTimer]
  )

  const stopPeek = React.useCallback(
    (immediate = false) => {
      clearPeekTimer()
      if (immediate) {
        setPeeking(false)
        return
      }
      peekDelays.current ??= {
        open: readTokenMs(null, "--sidebar-peek-open-delay"),
        close: readTokenMs(null, "--sidebar-peek-close-delay"),
      }
      peekTimer.current = window.setTimeout(
        () => setPeeking(false),
        peekDelays.current.close
      )
    },
    [clearPeekTimer]
  )

  const setWidth = React.useCallback(
    (value: string | null) => {
      setWidthState(value)
      persistPatch({ width: value ?? undefined })
    },
    [persistPatch]
  )
  const resetWidth = React.useCallback(() => setWidth(null), [setWidth])

  const registerConfig = React.useCallback((next: SidebarConfig) => {
    setConfig((prev) =>
      prev.collapsible === next.collapsible &&
      prev.side === next.side &&
      prev.form === next.form &&
      prev.placement === next.placement
        ? prev
        : next
    )
  }, [])

  React.useEffect(() => {
    if (!shortcut) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcut, toggleSidebar])

  const collapse: SidebarCollapse = open
    ? width
      ? "resized"
      : "expanded"
    : peeking
      ? "peeking"
      : dock
  const placement: SidebarPlacement = isMobile
    ? "drawer"
    : collapse === "peeking"
      ? "overlay"
      : config.placement
  // Labels are visible whenever the panel is at full width, peek included.
  const state = open || peeking ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      id,
      form: config.form,
      side: config.side,
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
      peekEnabled,
      peeking,
      startPeek,
      stopPeek,
      registerConfig,
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [
      id,
      config.form,
      config.side,
      config.collapsible,
      placement,
      collapse,
      dock,
      setDock,
      width,
      setWidth,
      resetWidth,
      isResizing,
      peekEnabled,
      peeking,
      startPeek,
      stopPeek,
      registerConfig,
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      toggleSidebar,
    ]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={style}
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[>[data-slot=sidebar][data-placement=inset]]:bg-(--sidebar-inset-backdrop)",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

/**
 * A gradient edge, which `border` cannot draw — so it renders as a real rule
 * pinned to the panel's outer edge rather than a border on the panel itself.
 */
function SidebarEdgeRule({ side }: { side: SidebarSide }) {
  return (
    <Separator
      data-slot="sidebar-edge"
      orientation="vertical"
      variant="faded"
      className={cn(
        "absolute inset-y-0 z-10",
        side === "start" ? "inset-e-0" : "inset-s-0"
      )}
    />
  )
}

function Sidebar({
  side: sideProp = "start",
  variant,
  placement: placementProp,
  form = "panel",
  edge = "line",
  collapsible: collapsibleProp = "hidden",
  className,
  children,
  dir,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  side?: SidebarSide | "left" | "right"
  variant?: SidebarVariant
  placement?: SidebarPlacement
  form?: SidebarForm
  edge?: SidebarEdge
  collapsible?: SidebarCollapsible | "icon" | "offcanvas"
}) {
  const side = normalizeSide(sideProp)
  const collapsible = normalizeCollapsible(collapsibleProp)
  const authored =
    placementProp ?? (variant ? placementFromVariant(variant) : "docked")
  const floats = authored === "floating" || authored === "inset"

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
    peekEnabled,
    peeking,
    registerConfig,
    startPeek,
    stopPeek,
  } = useSidebar()

  React.useEffect(() => {
    registerConfig({ collapsible, side, form, placement: authored })
  }, [registerConfig, collapsible, side, form, authored])

  // Only emit the width when it has been resized, so an author's override on
  // an ancestor (or the :root token) still wins by inheritance.
  const widthStyle = {
    ...style,
    ...(width ? { "--sidebar-width": width } : {}),
  } as React.CSSProperties

  const rootRef = React.useRef<HTMLDivElement>(null)
  // A peek put away on purpose must not spring straight back while the pointer
  // is still resting on the panel. Cleared once the pointer leaves the root.
  const dismissedRef = React.useRef(false)

  const dismissPeek = React.useCallback(() => {
    dismissedRef.current = true
    stopPeek(true)
  }, [stopPeek])

  // A peek is transient, so acting anywhere ends it: clicking away, or opening
  // one of its pages. The account row is exempt — it owns a menu of its own.
  React.useEffect(() => {
    const el = rootRef.current
    if (!peeking || !el) return

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!target) return
      if (!el.contains(target)) {
        dismissPeek()
        return
      }
      if (target.closest('[data-slot="sidebar-account"]')) return
      if (
        target.closest(
          '[data-slot="sidebar-menu-button"], [data-slot="sidebar-menu-sub-button"]'
        )
      ) {
        dismissPeek()
      }
    }

    window.addEventListener("click", onClick)
    return () => window.removeEventListener("click", onClick)
  }, [peeking, dismissPeek])

  // Peek opens on PROXIMITY rather than on entering a hairline strip, so the
  // edge does not have to be hunted for, and it closes once the pointer has
  // clearly moved past the panel.
  React.useEffect(() => {
    const el = rootRef.current
    if (!peekEnabled || isMobile || dock === "expanded" || !el) return

    const threshold = readTokenPx(el, "--sidebar-peek-edge-width")
    const onMove = (event: PointerEvent) => {
      const gap = el.querySelector('[data-slot="sidebar-gap"]')
      const host = el.parentElement
      if (!gap || !host) return
      const bounds = host.getBoundingClientRect()
      if (event.clientY < bounds.top || event.clientY > bounds.bottom) return

      const gapRect = gap.getBoundingClientRect()
      const edge = side === "start" ? gapRect.left : gapRect.right
      const distance =
        side === "start" ? event.clientX - edge : edge - event.clientX

      if (distance >= 0 && distance <= threshold) {
        if (!dismissedRef.current) startPeek()
        return
      }
      const panel = el.querySelector('[data-slot="sidebar-container"]')
      const reach = (panel?.getBoundingClientRect().width ?? 0) + threshold
      if (distance > reach) stopPeek()
    }

    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [peekEnabled, isMobile, dock, side, startPeek, stopPeek])

  // Checked before `collapsible="none"`: never-collapses is a DESKTOP layout
  // contract, but on a phone a permanent panel would own the whole viewport.
  if (isMobile) {
    return (
      <Drawer
        open={openMobile}
        onOpenChange={setOpenMobile}
        autoFocus
        direction={side === "start" ? "left" : "right"}
      >
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
          dir={dir}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          data-form={form}
          data-side={side}
          data-placement="drawer"
          data-edge={edge}
          data-collapse="expanded"
          showCloseButton={false}
          className="overflow-hidden bg-sidebar p-0 text-sidebar-foreground"
          style={
            {
              "--sidebar-width": "var(--sidebar-width-mobile)",
              "--drawer-width": "var(--sidebar-width-mobile)",
            } as React.CSSProperties
          }
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>Sidebar</DrawerTitle>
            <DrawerDescription>Displays the mobile sidebar.</DrawerDescription>
          </DrawerHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </DrawerContent>
        </ColorThemePortal>
      </Drawer>
    )
  }

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        data-form={form}
        data-side={side}
        data-placement={authored}
        data-edge={edge}
        data-dock="expanded"
        data-collapse={width ? "resized" : "expanded"}
        data-state="expanded"
        data-resizing={isResizing ? "true" : undefined}
        style={widthStyle}
        className={cn(
          "group peer relative flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          edge === "line" && (side === "start" ? "border-e" : "border-s"),
          className
        )}
        {...props}
        id={`${id}-panel`}
      >
        {children}
        {edge === "faded" && <SidebarEdgeRule side={side} />}
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className="group peer hidden text-sidebar-foreground md:block"
      data-slot="sidebar"
      data-form={form}
      data-side={side}
      data-dock={dock}
      data-collapse={collapse}
      data-placement={placement}
      data-edge={edge}
      data-peek={peekEnabled ? "true" : "false"}
      data-resizing={isResizing ? "true" : undefined}
      data-state={state}
      data-collapsible={
        state === "collapsed"
          ? collapsible === "bar"
            ? "icon"
            : "offcanvas"
          : ""
      }
      data-variant={variantFromPlacement(authored)}
      style={widthStyle}
      onPointerEnter={() => {
        if (!dismissedRef.current) startPeek()
      }}
      onPointerLeave={() => {
        dismissedRef.current = false
        stopPeek()
      }}
      onFocusCapture={() => startPeek(true)}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return
        stopPeek()
      }}
    >
      {/* Reserves layout space. Tracks dock, not collapse, so a peek never reflows the page. */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative bg-transparent transition-[width] duration-(--sidebar-speed) ease-(--sidebar-ease)",
          "group-data-resizing:transition-none",
          "group-data-[dock=expanded]:w-(--sidebar-width)",
          "group-data-[dock=hidden]:w-0",
          floats
            ? "group-data-[dock=bar]:w-(--sidebar-width-icon-floating)"
            : "group-data-[dock=bar]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden w-(--sidebar-width) transition-[inset-inline-start,inset-inline-end,width,padding] duration-(--sidebar-speed) ease-(--sidebar-ease) md:flex",
          "group-data-resizing:transition-none",
          "group-data-[side=end]:inset-e-0 group-data-[side=start]:inset-s-0",
          "[[data-collapse=hidden][data-side=start]_&]:-inset-s-(--sidebar-width)",
          "[[data-collapse=hidden][data-side=end]_&]:-inset-e-(--sidebar-width)",
          "group-data-[placement=overlay]:z-20 group-data-[placement=overlay]:p-(--sidebar-floating-padding)",
          floats
            ? "p-(--sidebar-floating-padding) group-data-[collapse=bar]:w-(--sidebar-width-icon-floating)"
            : cn(
                "group-data-[collapse=bar]:w-(--sidebar-width-icon)",
                // A peek floats as a rounded card, so the docked edge would hang in
                // space 8px outside it. Decided here, not by variant precedence.
                placement !== "overlay" &&
                  edge === "line" &&
                  "group-data-[side=end]:border-s group-data-[side=start]:border-e"
              ),
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          id={`${id}-panel`}
          tabIndex={-1}
          inert={collapse === "hidden"}
          className="flex size-full flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-[border-radius,box-shadow,background-color] duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[placement=floating]:rounded-(--sidebar-radius) group-data-[placement=floating]:shadow-(--elevation-flat) group-data-[placement=floating]:ring-1 group-data-[placement=floating]:ring-(--elevation-stroke) group-data-[placement=overlay]:rounded-(--sidebar-radius) group-data-[placement=overlay]:shadow-(--elevation-floating) group-data-[placement=overlay]:ring-1 group-data-[placement=overlay]:ring-(--elevation-stroke)"
        >
          {children}
        </div>
        {!floats && placement !== "overlay" && edge === "faded" && (
          <SidebarEdgeRule side={side} />
        )}
      </div>
    </div>
  )
}

const sidebarFabShapes = ["cookie4", "cookie6", "cookie7"] as const

function SidebarFloatingTrigger({ visible, ref, ...props }: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "selected"> & {
  visible: boolean
}) {
  const elementRef = React.useRef<HTMLButtonElement>(null)
  React.useImperativeHandle(ref, () => elementRef.current!, [])
  const [reveal, setReveal] = React.useState(() => ({
    visible,
    shape: sidebarFabShapes[Math.floor(Math.random() * sidebarFabShapes.length)],
  }))
  if (reveal.visible !== visible) {
    const choices = sidebarFabShapes.filter(shape => shape !== reveal.shape)
    setReveal({ visible, shape: visible ? choices[Math.floor(Math.random() * choices.length)] : reveal.shape })
  }

  React.useLayoutEffect(() => {
    const element = elementRef.current
    const shape = element?.querySelector<SVGSVGElement>('[data-slot="shape"]')
    if (!visible || !element || !shape) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    element.style.removeProperty("scale")
    shape.style.removeProperty("rotate")
    if (motion.matches) return
    const tokens = getComputedStyle(element)
    const entryScale = Number(tokens.getPropertyValue("--sidebar-floating-trigger-entry-scale"))
    const spinVelocity = Number(tokens.getPropertyValue("--sidebar-floating-trigger-spin-velocity"))
    const growthVelocity = Number(tokens.getPropertyValue("--sidebar-floating-trigger-growth-velocity"))
    if (spinVelocity <= 0 || growthVelocity <= 0) return
    const turns = Number(tokens.getPropertyValue("--sidebar-floating-trigger-spin-turns"))
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
  }, [visible])

  return <Fab {...props} ref={elementRef} variant="expressive" shape={reveal.shape} />
}

function SidebarTrigger({
  className,
  onClick,
  placement = "inline",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size"> & {
  placement?: "inline" | "floating"
}) {
  const { id, side, toggleSidebar, open, openMobile, isMobile, collapsible, collapse } = useSidebar()
  // `open` is the desktop dock; on mobile the panel is the drawer.
  const expanded = isMobile ? openMobile : open
  const label = expanded ? "Close sidebar" : "Open sidebar"
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) toggleSidebar()
  }

  if (placement === "floating") {
    if (!isMobile && collapsible !== "hidden") return null
    const visible = isMobile ? !openMobile : collapse === "hidden"

    return (
      <SidebarFloatingTrigger
        visible={visible}
        tooltipSide={side === "start" ? "right" : "left"}
        id={`${id}-floating-trigger`}
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        data-placement="floating"
        data-visible={visible}
        inert={!visible}
        aria-hidden={!visible}
        aria-label={label}
        aria-expanded={expanded}
        aria-controls={!isMobile || openMobile ? `${id}-panel` : undefined}
        className={cn(
          "absolute top-(--sidebar-floating-trigger-inset) inset-s-(--sidebar-floating-trigger-inset) z-20",
          "transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease) data-[visible=false]:pointer-events-none data-[visible=false]:opacity-0",
          "data-[visible=false]:duration-(--sidebar-floating-trigger-fade-out-speed)",
          "data-[visible=true]:delay-(--sidebar-floating-trigger-fade-in-delay) data-[visible=true]:motion-reduce:delay-0",
          className
        )}
        onClick={toggle}
        {...props}
      >
        <PanelLeftIcon size={20} className="rtl:rotate-180" />
      </SidebarFloatingTrigger>
    )
  }

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      data-placement={placement}
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={!isMobile || openMobile ? `${id}-panel` : undefined}
      className={cn(
        "ms-auto transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease)",
        "aria-expanded:bg-transparent aria-expanded:hover:bg-(--state-layer-hover) aria-expanded:active:bg-(--state-layer-pressed)",
        // Collapsed the toggle always fades away, so the bar stays clean.
        "group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0",
        // Collapsed it leaves the flex flow so the brand mark centers on the
        // 24px rail; without peek it parks over the mark as a hover-return.
        "group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:inset-0 group-data-[collapsible=icon]:m-auto group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:rounded-(--item-compact-radius)",
        "group-data-[peek=false]:group-data-[collapsible=icon]:group-hover:pointer-events-auto group-data-[peek=false]:group-data-[collapsible=icon]:group-hover:opacity-100",
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

function SidebarBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-brand"
      // gap-1: the mark is a 32px box, so 4px lands its label on the shared column.
      className={cn(
        "relative flex h-8 shrink-0 items-center gap-1 overflow-hidden transition-[width,height] duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center",
        className
      )}
      {...props}
    />
  )
}

function SidebarBrandMark({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-brand-mark"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease) ms-1 group-data-[collapsible=icon]:ms-0 group-data-[collapsible=icon]:m-auto",
        // Only yields to the toggle when there is no peek to fall back on.
        "group-data-[peek=false]:group-data-[collapsible=icon]:group-hover:pointer-events-none group-data-[peek=false]:group-data-[collapsible=icon]:group-hover:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarBrandLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-brand-label"
      className={cn(
        "min-w-0 flex-1 truncate text-sm font-medium transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=end]:inset-s-0 group-data-[side=start]:-inset-e-4 after:absolute after:inset-y-0 after:inset-s-1/2 after:w-0.5 hover:after:bg-sidebar-border sm:flex",
        "in-data-[side=start]:cursor-w-resize in-data-[side=end]:cursor-e-resize",
        "[[data-side=start][data-state=collapsed]_&]:cursor-e-resize [[data-side=end][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:inset-s-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=start][data-collapsible=offcanvas]_&]:-inset-e-2",
        "[[data-side=end][data-collapsible=offcanvas]_&]:-inset-s-2",
        className
      )}
      {...props}
    />
  )
}

type SidebarResizeBounds = { min: number; max: number; snap: number; step: number }

function SidebarResizeHandle({
  className,
  onKeyDown,
  onDoubleClick,
  onPointerDown,
  ...props
}: React.ComponentProps<"div">) {
  const {
    side,
    width,
    collapsible,
    isMobile,
    setDock,
    setWidth,
    resetWidth,
    setResizing,
    toggleSidebar,
  } = useSidebar()
  const ref = React.useRef<HTMLDivElement>(null)
  const boundsRef = React.useRef<SidebarResizeBounds | null>(null)
  const [bounds, setBounds] = React.useState<SidebarResizeBounds | null>(null)
  const [naturalWidth, setNaturalWidth] = React.useState(0)

  const panel = React.useCallback(
    () =>
      ref.current?.closest<HTMLElement>('[data-slot="sidebar-container"]') ??
      ref.current?.closest<HTMLElement>('[data-slot="sidebar"]') ??
      null,
    []
  )

  const readBounds = React.useCallback(
    (): SidebarResizeBounds => ({
      min: readTokenPx(panel(), "--sidebar-width-min"),
      max: readTokenPx(panel(), "--sidebar-width-max"),
      snap: readTokenPx(panel(), "--sidebar-snap-threshold"),
      step: readTokenPx(panel(), "--sidebar-resize-step"),
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

  // The panel can sit on either physical edge once direction is factored in.
  const geometry = React.useCallback(() => {
    const host = panel()
    if (!host) return null
    const rect = host.getBoundingClientRect()
    const rtl = getComputedStyle(host).direction === "rtl"
    return { rect, onLeft: (side === "start") !== rtl }
  }, [panel, side])

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
      toggleSidebar()
    }
  }

  if (isMobile) return null

  return (
    <div
      ref={ref}
      data-slot="sidebar-resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
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
        "group/sidebar-resize-handle absolute inset-y-0 z-20 hidden w-(--sidebar-resize-handle-width) cursor-col-resize touch-none outline-none select-none",
        "group-data-[side=start]:inset-e-0 group-data-[side=start]:me-(--sidebar-resize-handle-offset)",
        "group-data-[side=end]:inset-s-0 group-data-[side=end]:ms-(--sidebar-resize-handle-offset)",
        // Two attribute selectors outrank the base `hidden`, whatever the emit order.
        "[[data-slot=sidebar][data-dock=expanded]_&]:block",
        // A peek is transient, so it is not a thing you resize.
        "[[data-slot=sidebar][data-placement=overlay]_&]:hidden",
        className
      )}
      {...props}
    >
      <DragHandle
        aria-hidden="true"
        variant="grip"
        orientation="vertical"
        className="pointer-events-none absolute top-1/2 inset-s-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-(--drag-handle-speed) ease-(--drag-handle-ease) group-hover/sidebar-resize-handle:h-(--drag-handle-active-length) group-hover/sidebar-resize-handle:w-(--drag-handle-active-thickness) group-hover/sidebar-resize-handle:bg-(--drag-handle-fill-hover) group-focus-visible/sidebar-resize-handle:h-(--drag-handle-active-length) group-focus-visible/sidebar-resize-handle:w-(--drag-handle-active-thickness) group-focus-visible/sidebar-resize-handle:bg-(--drag-handle-fill-pressed) group-focus-visible/sidebar-resize-handle:shadow-(--drag-handle-active-shadow) group-data-resizing:h-(--drag-handle-active-length) group-data-resizing:w-(--drag-handle-active-thickness) group-data-resizing:bg-(--drag-handle-fill-pressed) group-data-resizing:shadow-(--drag-handle-active-shadow)"
      />
    </div>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-(--sidebar-inset-margin) md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-(--sidebar-inset-radius) md:peer-data-[variant=inset]:shadow-(--elevation-raised)",
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-control shadow-none", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        "flex min-h-(--sidebar-header-height) shrink-0 flex-col justify-center gap-(--space-xs) px-(--sidebar-menu-group-inset) pt-(--sidebar-padding) pb-(--space-xs) transition-[padding] duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:px-(--sidebar-menu-group-inset-collapsed)",
        className
      )}
      {...props}
    />
  )
}

function SidebarHeaderActions({
  className,
  ...props
}: React.ComponentProps<typeof ButtonGroup>) {
  return (
    <ButtonGroup
      data-sidebar="header-actions"
      shape="square"
      spacing="none"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        "flex shrink-0 flex-col gap-(--space-xs) px-(--sidebar-menu-group-inset) pt-(--space-xs) pb-(--sidebar-padding) transition-[padding] duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:px-(--sidebar-menu-group-inset-collapsed)",
        className
      )}
      {...props}
    />
  )
}

function SidebarAccount({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-account"
      data-sidebar="account"
      className={cn(
        "flex h-12 w-full cursor-pointer items-center gap-(--space-sm) overflow-hidden rounded-full p-(--space-xs) text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height] duration-(--sidebar-speed) ease-(--sidebar-ease) hover:bg-(--item-default-hover-surface) hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-(--item-default-pressed-surface)",
        // Collapsed it stops being a row and becomes an avatar chip sized to the
        // icon column; the pill radius already carries it from row to circle.
        "group-data-[collapsible=icon]:size-10!",
        // 24px avatar in 40px circle with 8px padding keeps the avatar centered at x=24px at all times.
        "*:data-[slot=avatar]:size-6 *:data-[slot=avatar]:shrink-0",
        "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:transition-opacity [&>svg]:duration-(--sidebar-speed) [&>svg]:ease-(--sidebar-ease) group-data-[collapsible=icon]:[&>svg]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarAccountDetails({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-account-details"
      className={cn(
        "grid min-w-0 flex-1 text-start leading-tight transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:opacity-0",
        "*:truncate *:first:font-medium [&>:last-child:not(:first-child)]:text-xs [&>:last-child:not(:first-child)]:text-sidebar-foreground/70",
        className
      )}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
}

function SidebarContent({
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
        data-slot="sidebar-content"
        data-sidebar="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-(--space-none) overflow-hidden group-data-[collapsible=icon]:justify-center",
          className
        )}
        {...props}
      >
        <div data-slot="sidebar-content-sticky" className="shrink-0">
          {stickyHeader}
        </div>
        <div
          ref={setRef}
          data-slot="sidebar-content-viewport"
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:justify-center",
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
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-(--space-none) overflow-auto group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:justify-center",
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

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col px-(--sidebar-menu-group-inset) py-(--space-xs) transition-[padding,margin] duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:my-auto group-data-[collapsible=icon]:py-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-(--item-compact-inset) text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[opacity,height,padding] duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute top-3.5 right-3 flex aspect-(--aspect-ratio-square) w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-(--space-2xs)", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full cursor-pointer items-center gap-(--space-sm) overflow-hidden text-left whitespace-nowrap ring-sidebar-ring outline-hidden transition-[width,height,padding] duration-(--sidebar-speed) ease-(--sidebar-ease) group-has-data-[sidebar=menu-action]/menu-item:pr-(--sidebar-menu-action-reserved-space) group-has-data-[sidebar=menu-badge]/menu-item:pr-(--sidebar-menu-badge-reserved-space) hover:bg-(--item-default-hover-surface) hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-(--item-default-pressed-surface) active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-(--item-default-hover-surface) data-open:hover:text-sidebar-accent-foreground data-active:font-medium data-active:bg-(--sidebar-selected-fill) data-active:text-(--sidebar-selected-ink) [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate [&>span:last-child]:transition-opacity [&>span:last-child]:duration-(--sidebar-speed) [&>span:last-child]:ease-(--sidebar-ease) group-data-[collapsible=icon]:[&>span:last-child]:opacity-0",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "bg-(--item-surface) shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-(--item-outline-hover-surface) hover:text-sidebar-accent-foreground active:bg-(--item-outline-pressed-surface) hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default:
          "h-(--item-compact-height) rounded-(--item-compact-radius) py-(--item-compact-inset) px-(--sidebar-menu-button-padding-inline) text-sm",
        sm: "h-7 rounded-md p-(--space-xs) text-xs",
        lg: "h-12 rounded-md p-(--space-xs) text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  children,
  title,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : "button"
  const { isMobile, state } = useSidebar()
  const content =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? React.cloneElement(
          children,
          undefined,
          withIconLabels(children.props.children)
        )
      : withIconLabels(children)

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-icon-label-host
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      // Our tooltip replaces the native one, never stacks with it.
      title={tooltip ? undefined : title}
      {...props}
    >
      {content}
    </Comp>
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    </TooltipProvider>
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute top-1.5 right-1 flex aspect-(--aspect-ratio-square) w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-(--item-compact-inset) peer-data-[size=default]/menu-button:right-(--item-compact-inset) peer-data-[size=default]/menu-button:size-(--item-compact-media-host-size) peer-data-[size=default]/menu-button:rounded-(--item-compact-media-host-radius) peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        // A hover-revealed action answers the pointer, not the panel.
        showOnHover &&
          "duration-(--sidebar-fade-speed) group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-(--sidebar-menu-button-padding-inline) flex h-(--sidebar-menu-badge-height) min-w-(--sidebar-menu-badge-height) items-center justify-center rounded-(--sidebar-menu-badge-radius) px-(--sidebar-menu-badge-padding-inline) text-(length:--text-caption-size) leading-(--text-caption-leading) font-medium text-sidebar-foreground tabular-nums transition-opacity duration-(--sidebar-speed) ease-(--sidebar-ease) select-none group-data-[collapsible=icon]:opacity-0 peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-2.5 peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:bg-(--sidebar-selected-ink) peer-data-active/menu-button:text-(--sidebar-selected-fill)",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  })

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        "flex h-(--item-compact-height) items-center gap-(--space-xs) rounded-(--item-compact-radius) p-(--item-compact-inset)",
        className
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-(--space-2xs) border-l border-sidebar-border px-(--space-sm) py-(--space-hairline)",
        // allow-discrete holds the row open for the fade, so it never pops.
        "transition-[opacity,display] transition-discrete duration-(--sidebar-speed) ease-(--sidebar-ease) group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-(--space-xs) overflow-hidden rounded-md px-(--space-xs) text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-(--item-default-hover-surface) hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-(--item-default-pressed-surface) active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-(--sidebar-selected-fill) data-active:text-(--sidebar-selected-ink) data-active:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarAccount,
  SidebarAccountDetails,
  SidebarBrand,
  SidebarBrandLabel,
  SidebarBrandMark,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarHeaderActions,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarResizeHandle,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
export type {
  SidebarCollapse,
  SidebarCollapsible,
  SidebarDock,
  SidebarForm,
  SidebarPlacement,
  SidebarSide,
}
