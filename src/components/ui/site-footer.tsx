import * as React from "react"
import { Slot } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

type SiteFooterVariant = "default" | "docked" | "floating" | "inverted"

const SiteFooterContext = React.createContext<SiteFooterVariant>("default")

function useSiteFooterVariant() {
  return React.useContext(SiteFooterContext)
}

const siteFooterVariants = cva("w-full transition-colors", {
  variants: {
    variant: {
      default: "text-foreground",
      docked: "text-foreground",
      floating:
        "mx-auto my-(--space-lg) max-w-7xl rounded-(--site-footer-floating-radius) border border-(--elevation-stroke) bg-(--site-footer-surface-floating) shadow-(--site-footer-floating-shadow) text-foreground",
      inverted: "dark text-foreground",
    },
  },
  defaultVariants: {
    variant: "docked",
  },
})

function SiteFooter({
  className,
  variant = "docked",
  wave = true,
  children,
  ...props
}: React.ComponentProps<"footer"> & {
  variant?: SiteFooterVariant
  wave?: boolean
}) {
  const resolvedVariant = variant === "default" ? "docked" : variant
  const isFloating = resolvedVariant === "floating"
  const hasWave = !isFloating && wave

  return (
    <SiteFooterContext.Provider value={resolvedVariant}>
      <footer
        data-slot="site-footer"
        data-variant={resolvedVariant}
        className={cn(siteFooterVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        {hasWave && (
          <div
            data-slot="site-footer-wave"
            className="relative z-10 -mb-px w-full overflow-hidden leading-none"
          >
            <Separator
              variant="wavy"
              wavySize="medium"
              tone={resolvedVariant === "inverted" ? "subtle" : "neutral"}
              fill="bottom"
              fillClassName="fill-(--sidebar) text-(--sidebar)"
              className="block w-full text-(--separator-stroke)"
            />
          </div>
        )}
        <div
          data-slot="site-footer-body"
          className={cn(
            "w-full",
            !isFloating && "bg-sidebar"
          )}
        >
          {children}
        </div>
      </footer>
    </SiteFooterContext.Provider>
  )
}

function SiteFooterContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const variant = useSiteFooterVariant()

  return (
    <div
      data-slot="site-footer-container"
      className={cn(
        "mx-auto flex w-full flex-col gap-(--site-footer-gap)",
        variant === "floating"
          ? "p-(--site-footer-floating-inset)"
          : "px-(--site-footer-padding-inline) py-(--site-footer-padding-block)",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterTop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-top"
      className={cn(
        "flex flex-col gap-(--site-footer-gap) lg:flex-row lg:justify-between",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterIntro({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-intro"
      className={cn("flex flex-col gap-(--space-lg) lg:max-w-sm", className)}
      {...props}
    />
  )
}

function SiteFooterBrand({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="site-footer-brand"
      className={cn(
        "flex w-fit cursor-pointer items-center gap-(--space-xs) rounded-sm text-base font-semibold whitespace-nowrap text-foreground outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-6 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="site-footer-description"
      className={cn("max-w-xs text-sm text-pretty leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function SiteFooterColumns({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-columns"
      className={cn(
        "grid grid-cols-2 gap-x-(--site-footer-column-gap) gap-y-(--site-footer-gap) sm:grid-cols-3 lg:grid-cols-4",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-column"
      className={cn("flex flex-col gap-(--site-footer-title-gap)", className)}
      {...props}
    />
  )
}

function SiteFooterColumnTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="site-footer-column-title"
      className={cn("text-sm font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

function SiteFooterNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="site-footer-nav"
      className={cn("flex flex-col gap-(--site-footer-item-gap) text-sm", className)}
      {...props}
    />
  )
}

function SiteFooterLink({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="site-footer-link"
      className={cn(
        "w-fit cursor-pointer rounded-xs text-sm text-muted-foreground transition-colors duration-(--speed-swift) ease-(--ease-settle) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterNewsletter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-newsletter"
      className={cn("flex flex-col gap-(--site-footer-item-gap)", className)}
      {...props}
    />
  )
}

function SiteFooterNewsletterTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="site-footer-newsletter-title"
      className={cn("text-sm font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

function SiteFooterNewsletterDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="site-footer-newsletter-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function SiteFooterNewsletterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      data-slot="site-footer-newsletter-form"
      className={cn("flex w-full max-w-sm items-center gap-(--space-xs)", className)}
      {...props}
    />
  )
}

function SiteFooterSocial({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-social"
      className={cn("flex items-center gap-(--space-xs)", className)}
      {...props}
    />
  )
}

function SiteFooterSocialLink({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="site-footer-social-link"
      className={cn(
        "button-motion inline-flex size-(--site-footer-social-size) shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--tertiary-fill) text-muted-foreground outline-none transition-colors duration-(--speed-swift) ease-(--ease-settle) hover:bg-(--button-tertiary-hover) hover:text-foreground active:translate-y-(--button-press-distance) active:scale-(--button-press-scale) active:bg-(--button-tertiary-pressed) focus-visible:ring-3 focus-visible:ring-ring [&_svg]:size-5 **:data-[slot=favicon]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterSeparator({
  className,
  variant = "faded",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="site-footer-separator"
      variant={variant}
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function SiteFooterBottom({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-bottom"
      className={cn(
        "flex flex-col gap-(--space-md) sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterLegal({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="site-footer-legal"
      className={cn(
        "flex flex-wrap items-center gap-x-(--space-lg) gap-y-(--space-xs) text-sm",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterCopyright({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="site-footer-copyright"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  SiteFooter,
  SiteFooterContainer,
  SiteFooterTop,
  SiteFooterIntro,
  SiteFooterBrand,
  SiteFooterDescription,
  SiteFooterColumns,
  SiteFooterColumn,
  SiteFooterColumnTitle,
  SiteFooterNav,
  SiteFooterLink,
  SiteFooterNewsletter,
  SiteFooterNewsletterTitle,
  SiteFooterNewsletterDescription,
  SiteFooterNewsletterForm,
  SiteFooterSocial,
  SiteFooterSocialLink,
  SiteFooterSeparator,
  SiteFooterBottom,
  SiteFooterLegal,
  SiteFooterCopyright,
}
