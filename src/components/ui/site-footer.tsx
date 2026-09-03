import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function SiteFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="site-footer"
      className={cn(
        "w-full border-t border-border/60 bg-background text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-container"
      className={cn(
        "mx-auto flex w-full flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8",
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
        "flex flex-col gap-10 lg:flex-row lg:justify-between",
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
      className={cn("flex flex-col gap-6 lg:max-w-sm", className)}
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
        "flex w-fit items-center gap-2 text-base font-semibold whitespace-nowrap text-foreground transition-opacity hover:opacity-80 [&_svg]:size-6 [&_svg]:shrink-0",
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
      className={cn("max-w-xs text-sm text-pretty text-muted-foreground", className)}
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
        "grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4",
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
      className={cn("flex flex-col gap-3", className)}
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
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SiteFooterNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="site-footer-nav"
      className={cn("flex flex-col gap-3 text-sm", className)}
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
        "w-fit text-muted-foreground transition-colors hover:text-foreground",
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
      className={cn("flex flex-col gap-3", className)}
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
      className={cn("text-sm font-semibold text-foreground", className)}
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
      className={cn("text-sm text-muted-foreground", className)}
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
      className={cn("flex w-full max-w-sm items-center gap-2", className)}
      {...props}
    />
  )
}

function SiteFooterSocial({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-social"
      className={cn("flex items-center gap-1", className)}
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
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-(--state-layer-hover) active:bg-(--state-layer-pressed) hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SiteFooterSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-separator"
      role="separator"
      className={cn("h-px w-full bg-border/60", className)}
      {...props}
    />
  )
}

function SiteFooterBottom({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-bottom"
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
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
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm",
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
