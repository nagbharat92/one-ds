import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { MoreHorizontalIcon } from "@/components/ui/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SiteHeaderVariant = "docked" | "floating" | "clustered"

const SiteHeaderContext = React.createContext<SiteHeaderVariant>("docked")

function useSiteHeaderVariant() {
  return React.useContext(SiteHeaderContext)
}

/**
 * One source for item metrics so a link, the overflow trigger beside it, and a
 * row in the overflow menu can never drift apart.
 */
function itemShape(variant: SiteHeaderVariant, square = false) {
  if (variant === "docked") {
    return square
      ? "size-(--site-header-flat-item-height) rounded-(--site-header-flat-item-radius)"
      : "h-(--site-header-flat-item-height) rounded-(--site-header-flat-item-radius) px-(--site-header-flat-item-padding-inline)"
  }
  return square
    ? "size-(--site-header-item-size) rounded-(--site-header-item-radius)"
    : "h-(--site-header-item-size) rounded-(--site-header-item-radius) px-(--site-header-item-padding-inline)"
}

/** The sheet is one item plus its padding, so it inherits the bar's language. */
function menuSheetShape(variant: SiteHeaderVariant) {
  return variant === "docked"
    ? "rounded-(--site-header-flat-menu-radius) *:p-(--site-header-flat-menu-padding)"
    : "rounded-(--site-header-menu-radius) *:p-(--site-header-menu-padding)"
}

/**
 * A radius alone is not concentric. An item only shares the shell's corner
 * centre once it FILLS the inner height, so these two always travel together.
 * Parts that read the variant themselves size in `cn`, where a call site can
 * still override; these cover components whose internals we cannot reach.
 */
const nestedItemSizing = [
  "[&_[data-slot=button]]:h-(--site-header-item-size)",
  "[&_[data-slot=button]]:rounded-(--site-header-item-radius)",
  // Fills must reach the border box, or a button paints shorter than the link
  // backplate beside it.
  "[&_[data-slot=button]]:bg-clip-border",
  "[&_[data-slot=button]:not([data-size^=icon])]:px-(--site-header-item-padding-inline)",
  "[&_[data-slot=button][data-size^=icon]]:w-(--site-header-item-size)",
  // Ties Button's own `svg:not([class*='size-'])` rule, so it needs the extra
  // attribute to win rather than fall to source order.
  "[&_[data-slot=button]_svg:not([class*='size-'])]:size-5",
  "[&_[data-slot=avatar]]:size-(--site-header-item-size)",
].join(" ")

/**
 * Corner radius is load bearing here: a square, full-bleed bar belongs to the
 * window frame, while a rounded one reads as a surface lifted above the content.
 */
const siteHeaderVariants = cva(
  "group/site-header z-50 flex w-full items-center",
  {
    variants: {
      variant: {
        docked: "bg-background",
        floating: "",
        clustered: "",
      },
      position: {
        top: "sticky top-0",
        bottom: "sticky bottom-0",
      },
      align: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
    },
    compoundVariants: [
      { variant: "docked", position: "top", class: "border-b" },
      { variant: "docked", position: "bottom", class: "border-t" },
      {
        variant: ["floating", "clustered"],
        // The inset gutter must stay click-through; only the shell takes pointers.
        class: `pointer-events-none bg-transparent p-(--site-header-inset) ${nestedItemSizing}`,
      },
    ],
    defaultVariants: {
      variant: "docked",
      position: "top",
      align: "center",
    },
  }
)

function SiteHeader({
  className,
  variant = "docked",
  position = "top",
  align = "center",
  ...props
}: React.ComponentProps<"header"> &
  Omit<VariantProps<typeof siteHeaderVariants>, "variant"> & {
    variant?: SiteHeaderVariant
  }) {
  return (
    <SiteHeaderContext.Provider value={variant}>
      <header
        data-slot="site-header"
        data-variant={variant}
        data-position={position}
        data-align={align}
        className={cn(
          siteHeaderVariants({ variant, position, align }),
          className
        )}
        {...props}
      />
    </SiteHeaderContext.Provider>
  )
}

const siteHeaderContainerVariants = cva(
  "pointer-events-auto flex h-(--site-header-height) items-center gap-(--site-header-gap)",
  {
    variants: {
      variant: {
        docked: "mx-auto w-full px-(--site-header-gutter)",
        floating:
          "w-auto max-w-full rounded-(--site-header-radius) border bg-popover bg-clip-padding px-(--site-header-padding) shadow-(--site-header-shadow)",
        // The shell stays invisible; each group carries its own chrome instead.
        clustered: "w-auto max-w-full gap-(--site-header-cluster-gap)",
      },
    },
    defaultVariants: {
      variant: "docked",
    },
  }
)

function SiteHeaderContainer({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & { variant?: SiteHeaderVariant }) {
  const inherited = useSiteHeaderVariant()
  const resolved = variant ?? inherited

  return (
    <div
      data-slot="site-header-shell"
      data-variant={resolved}
      className={cn(
        siteHeaderContainerVariants({ variant: resolved }),
        className
      )}
      {...props}
    />
  )
}

function SiteHeaderGroup({ className, ...props }: React.ComponentProps<"div">) {
  const variant = useSiteHeaderVariant()

  return (
    <div
      data-slot="site-header-group"
      className={cn(
        "flex h-full items-center gap-(--space-2xs)",
        variant === "clustered" &&
          "rounded-(--site-header-radius) border bg-popover bg-clip-padding px-(--site-header-padding) shadow-(--site-header-shadow)",
        className
      )}
      {...props}
    />
  )
}

function SiteHeaderBrand({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  const variant = useSiteHeaderVariant()

  return (
    <Comp
      data-slot="site-header-brand"
      className={cn(
        "flex shrink-0 items-center gap-(--space-xs) text-base font-semibold whitespace-nowrap text-foreground transition-opacity hover:opacity-80 [&_svg]:size-5 [&_svg]:shrink-0",
        // A lone mark centres in a square slot, so its group renders as a
        // circle; a mark with a label pads out to clear the cap curve.
        variant !== "docked" &&
          "h-(--site-header-item-size) min-w-(--site-header-item-size) justify-center has-[span]:px-(--site-header-item-padding-inline)",
        className
      )}
      {...props}
    />
  )
}

/** A non-interactive header title, as opposed to the brand's home link. */
function SiteHeaderTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="site-header-title"
      className={cn(
        "flex min-w-0 items-center gap-(--site-header-title-gap) text-sm font-semibold text-foreground [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SiteHeaderIndicator() {
  const ref = React.useRef<HTMLSpanElement>(null)
  const pivot = React.useRef(-1)
  const variant = useSiteHeaderVariant()

  React.useLayoutEffect(() => {
    const indicator = ref.current
    const nav = indicator?.parentElement
    if (!indicator || !nav) return

    const measure = () => {
      const links = Array.from(
        nav.querySelectorAll<HTMLElement>('[data-slot="site-header-link"]')
      )
      const next = links.findIndex((link) => link.dataset.active === "true")
      const active = links[next]
      // An overflowed link reports offset 0, which would fling the backplate
      // to the corner; drop it instead.
      if (!active || active.hidden) {
        nav.removeAttribute("data-ready")
        pivot.current = -1
        return
      }

      // Travel time counts the links crossed, so every jump moves at one speed.
      const distance = pivot.current < 0 ? 1 : Math.abs(next - pivot.current)
      pivot.current = next

      const style = indicator.style
      style.setProperty(
        "--site-header-pivot-distance",
        String(Math.max(distance, 1))
      )
      style.setProperty("--site-header-indicator-x", `${active.offsetLeft}px`)
      style.setProperty("--site-header-indicator-y", `${active.offsetTop}px`)
      style.setProperty("--site-header-indicator-w", `${active.offsetWidth}px`)
      style.setProperty("--site-header-indicator-h", `${active.offsetHeight}px`)

      // Reveal only once placed, or the backplate would fly in from the corner.
      if (!nav.hasAttribute("data-ready")) {
        requestAnimationFrame(() => nav.setAttribute("data-ready", ""))
      }
    }

    measure()

    const resize = new ResizeObserver(measure)
    resize.observe(nav)
    const mutation = new MutationObserver(measure)
    mutation.observe(nav, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-active", "hidden"],
    })

    return () => {
      resize.disconnect()
      mutation.disconnect()
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      data-slot="site-header-indicator"
      className={cn(
        "pointer-events-none absolute top-0 left-0 h-(--site-header-indicator-h) w-(--site-header-indicator-w) translate-x-(--site-header-indicator-x) translate-y-(--site-header-indicator-y) rounded-md bg-muted opacity-0 transition-none group-data-ready/site-header-nav:opacity-100 group-data-ready/site-header-nav:transition-[translate,width,height] group-data-ready/site-header-nav:duration-(--site-header-travel-duration) group-data-ready/site-header-nav:ease-(--site-header-ease)",
        variant !== "docked" && "rounded-(--site-header-item-radius)"
      )}
    />
  )
}

function SiteHeaderNav({
  className,
  children,
  overflowLabel = "More",
  ...props
}: React.ComponentProps<"nav"> & { overflowLabel?: string }) {
  const navRef = React.useRef<HTMLElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [overflowed, setOverflowed] = React.useState<string[]>([])
  const variant = useSiteHeaderVariant()

  React.useLayoutEffect(() => {
    const nav = navRef.current
    const shell = nav?.closest<HTMLElement>('[data-slot="site-header-shell"]')
    const root = nav?.closest<HTMLElement>('[data-slot="site-header"]')
    if (!nav || !shell || !root) return

    const measure = () => {
      const links = Array.from(
        nav.querySelectorAll<HTMLElement>('[data-slot="site-header-link"]')
      )
      const trigger = triggerRef.current
      // Every pass must start fully expanded, or the budget gets measured
      // against a row that is already collapsed and the result drifts.
      links.forEach((link) => {
        link.hidden = false
      })
      shell.dataset.compact = "false"
      if (trigger) trigger.hidden = false

      const navGap = parseFloat(getComputedStyle(nav).columnGap) || 0
      const widths = links.map((link) => link.offsetWidth)
      const triggerWidth = trigger ? trigger.offsetWidth : 0

      const shellStyle = getComputedStyle(shell)
      const shellGap = parseFloat(shellStyle.columnGap) || 0
      const kids = Array.from(shell.children) as HTMLElement[]
      // Everything in the row that is not the nav. All of it is shrink-0, so
      // this total does not move when links are hidden.
      let rest =
        parseFloat(shellStyle.paddingLeft) +
        parseFloat(shellStyle.paddingRight) +
        parseFloat(shellStyle.borderLeftWidth) +
        parseFloat(shellStyle.borderRightWidth) +
        shellGap * Math.max(kids.length - 1, 0)
      kids.forEach((kid) => {
        rest += kid.contains(nav) ? kid.offsetWidth - nav.offsetWidth : kid.offsetWidth
      })

      const rootStyle = getComputedStyle(root)
      // The header is full width in every variant, so it is the one ruler that
      // does not depend on the content being measured.
      const rootInner =
        root.clientWidth -
        parseFloat(rootStyle.paddingLeft) -
        parseFloat(rootStyle.paddingRight)
      const available = rootInner - rest

      const runTo = (count: number, withTrigger: boolean) =>
        widths.slice(0, count).reduce((sum, w) => sum + w, 0) +
        navGap * Math.max(count - 1, 0) +
        (withTrigger ? triggerWidth + navGap : 0)

      let visible = links.length
      if (runTo(links.length, false) > available) {
        while (visible > 0 && runTo(visible, true) > available) visible -= 1
      }

      const next: string[] = []
      links.forEach((link, index) => {
        const overflow = index >= visible
        link.hidden = overflow
        if (overflow) next.push(link.textContent?.trim() ?? "")
      })
      if (trigger) trigger.hidden = next.length === 0

      // Last resort once the nav has given up everything it can: drop the brand
      // label and keep the mark, rather than let the row escape the shell.
      const needed = rest + runTo(visible, visible < links.length)
      shell.dataset.compact = needed > rootInner + 0.5 ? "true" : "false"

      setOverflowed((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next
      )
    }

    // The current page can end up inside the menu, where it would otherwise
    // read as nothing being selected.
    const syncActive = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const holdsActive = Array.from(
        nav.querySelectorAll<HTMLElement>('[data-slot="site-header-link"]')
      ).some((link) => link.hidden && link.dataset.active === "true")
      const value = String(holdsActive)
      if (trigger.dataset.active !== value) trigger.dataset.active = value
    }

    const run = () => {
      measure()
      syncActive()
    }

    run()

    const observer = new ResizeObserver(run)
    observer.observe(root)
    const mutation = new MutationObserver(syncActive)
    mutation.observe(nav, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-active", "hidden"],
    })
    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [children])

  return (
    <nav
      ref={navRef}
      data-slot="site-header-nav"
      className={cn(
        "group/site-header-nav relative flex min-w-0 items-center gap-(--space-2xs) text-sm",
        className
      )}
      {...props}
    >
      <SiteHeaderIndicator />
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={overflowLabel}
            className={cn(
              // Button clips its fill to the padding box, which would paint 1px
              // shorter than a link's backplate sitting right beside it.
              "shrink-0 bg-clip-border data-[active=true]:bg-muted data-[active=true]:text-foreground",
              itemShape(variant, true)
            )}
            // Must come from state: React would reset a bare `hidden` attribute
            // on every re-render and undo the measurement.
            hidden={overflowed.length === 0}
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(
            "min-w-(--site-header-menu-width)",
            menuSheetShape(variant)
          )}
        >
          {overflowed.map((label, index) => (
            <DropdownMenuItem
              key={label}
              className={cn("font-medium", itemShape(variant))}
              onSelect={() => {
                const hiddenLinks = Array.from(
                  navRef.current?.querySelectorAll<HTMLElement>(
                    '[data-slot="site-header-link"]'
                  ) ?? []
                ).filter((link) => link.hidden)
                hiddenLinks[index]?.click()
              }}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

function SiteHeaderLink({
  className,
  isActive = false,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { isActive?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  const variant = useSiteHeaderVariant()

  return (
    <Comp
      data-slot="site-header-link"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        // relative keeps the link above the absolutely placed backplate.
        "relative inline-flex shrink-0 items-center font-medium whitespace-nowrap text-muted-foreground transition-colors duration-(--site-header-speed) ease-(--ease-settle) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        itemShape(variant),
        variant !== "docked" && "[&_svg]:size-5",
        className
      )}
      {...props}
    />
  )
}

function SiteHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const variant = useSiteHeaderVariant()

  return (
    <div
      data-slot="site-header-actions"
      className={cn(
        "flex shrink-0 items-center gap-(--site-header-action-gap) [&_[data-slot=button]]:bg-clip-border [&_[data-slot=dropdown-menu-trigger]]:bg-clip-border",
        // A shell that hugs its content has no slack to push actions into.
        variant === "docked" &&
          "ms-auto me-(--site-header-actions-edge-offset)",
        className
      )}
      {...props}
    />
  )
}

function SiteHeaderSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="site-header-separator"
      orientation="vertical"
      // Separator is data-vertical:self-stretch, which pins a fixed height to
      // the top of the row. The override must carry the same variant prefix or
      // tailwind-merge keeps both and the more specific stretch wins.
      className={cn(
        "mx-(--space-2xs) h-(--site-header-separator-height)! data-vertical:self-center",
        className
      )}
      {...props}
    />
  )
}

export {
  SiteHeader,
  SiteHeaderContainer,
  SiteHeaderGroup,
  SiteHeaderBrand,
  SiteHeaderTitle,
  SiteHeaderNav,
  SiteHeaderLink,
  SiteHeaderActions,
  SiteHeaderSeparator,
  siteHeaderVariants,
}
