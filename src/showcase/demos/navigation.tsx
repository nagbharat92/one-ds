import { Favicon } from "@/components/ui/favicon"
import { useState, type CSSProperties } from "react"
import {
  HomeIcon,
  InboxIcon,
  CalendarIcon,
  SettingsIcon,
  ChevronDownIcon,
  MusicIcon,
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  BellIcon,
  BoxIcon,
  SearchIcon,
  ArrowRightIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { Button } from "@/components/ui/button"
import { Input, SearchInput } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SiteHeader,
  SiteHeaderActions,
  SiteHeaderBrand,
  SiteHeaderContainer,
  SiteHeaderGroup,
  SiteHeaderLink,
  SiteHeaderNav,
  SiteHeaderSeparator,
} from "@/components/ui/site-header"
import {
  SiteFooter,
  SiteFooterBottom,
  SiteFooterBrand,
  SiteFooterColumn,
  SiteFooterColumns,
  SiteFooterColumnTitle,
  SiteFooterContainer,
  SiteFooterCopyright,
  SiteFooterDescription,
  SiteFooterIntro,
  SiteFooterLegal,
  SiteFooterLink,
  SiteFooterNav,
  SiteFooterNewsletter,
  SiteFooterNewsletterDescription,
  SiteFooterNewsletterForm,
  SiteFooterNewsletterTitle,
  SiteFooterSeparator,
  SiteFooterSocial,
  SiteFooterSocialLink,
  SiteFooterTop,
} from "@/components/ui/site-footer"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import {
  NavigationPane,
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
  NavigationPaneInset,
  NavigationPaneMenu,
  NavigationPaneMenuItem,
  NavigationPaneProvider,
  NavigationPaneSearch,
  NavigationPaneTrigger,
  useNavigationPane,
} from "@/components/ui/navigation-pane"
import {
  NavigationRail,
  NavigationRailIcon,
  NavigationRailItem,
  NavigationRailLabel,
  NavigationRailList,
} from "@/components/ui/navigation-rail"

function PaginationSimpleDemo() {
  const [page, setPage] = useState(2)
  const total = 10
  const prevent = (e: React.MouseEvent) => e.preventDefault()
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              prevent(e)
              setPage((p) => Math.max(1, p - 1))
            }}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        {[1, 2, 3, 4, 5].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink
              href="#"
              isActive={n === page}
              onClick={(e) => {
                prevent(e)
                setPage(n)
              }}
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive={page === total}
            onClick={(e) => {
              prevent(e)
              setPage(total)
            }}
          >
            {total}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              prevent(e)
              setPage((p) => Math.min(total, p + 1))
            }}
            aria-disabled={page === total}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function PaginationIconsOnlyDemo() {
  const [page, setPage] = useState(3)
  const total = 8
  const prevent = (e: React.MouseEvent) => e.preventDefault()
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text=""
            onClick={(e) => {
              prevent(e)
              setPage((p) => Math.max(1, p - 1))
            }}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        {[1, 2, 3, 4, 5].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink
              href="#"
              isActive={n === page}
              onClick={(e) => {
                prevent(e)
                setPage(n)
              }}
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive={page === total}
            onClick={(e) => {
              prevent(e)
              setPage(total)
            }}
          >
            {total}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            text=""
            onClick={(e) => {
              prevent(e)
              setPage((p) => Math.min(total, p + 1))
            }}
            aria-disabled={page === total}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function SiteHeaderDemo() {
  const [active, setActive] = useState("Product")
  const links = ["Product", "Solutions", "Pricing", "Docs"]
  return (
    <div className="showcase-contained-viewport min-h-(--showcase-preview-min-height) w-full overflow-hidden rounded-lg border">
      <SiteHeader className="static">
        <SiteHeaderContainer>
          <SiteHeaderBrand href="#" onClick={(e) => e.preventDefault()}>
            <BoxIcon />
            <span>Acme</span>
          </SiteHeaderBrand>
          <SiteHeaderNav>
            {links.map((label) => (
              <SiteHeaderLink
                key={label}
                href="#"
                isActive={active === label}
                onClick={(e) => {
                  e.preventDefault()
                  setActive(label)
                }}
              >
                {label}
              </SiteHeaderLink>
            ))}
          </SiteHeaderNav>
          <SiteHeaderActions>
            <div className="relative hidden sm:block">
              <SearchInput placeholder="Search..." className="w-44" />
            </div>
            <SiteHeaderSeparator />
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <Button size="default">Sign in</Button>
          </SiteHeaderActions>
        </SiteHeaderContainer>
      </SiteHeader>
    </div>
  )
}

function SiteHeaderFloatingDemo() {
  const [active, setActive] = useState("Product")
  const links = ["Product", "Solutions", "Pricing", "Docs"]
  return (
    <div className="showcase-contained-viewport min-h-(--showcase-preview-min-height) w-full overflow-hidden rounded-lg border">
      <SiteHeader variant="floating" className="static">
        <SiteHeaderContainer>
          <SiteHeaderBrand href="#" onClick={(e) => e.preventDefault()}>
            <BoxIcon />
            <span>Acme</span>
          </SiteHeaderBrand>
          <SiteHeaderNav>
            {links.map((label) => (
              <SiteHeaderLink
                key={label}
                href="#"
                isActive={active === label}
                onClick={(e) => {
                  e.preventDefault()
                  setActive(label)
                }}
              >
                {label}
              </SiteHeaderLink>
            ))}
          </SiteHeaderNav>
          <SiteHeaderActions>
            <SiteHeaderSeparator />
            <Button variant="ghost" size="icon" aria-label="Search">
              <SearchIcon />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <Button size="default">Sign in</Button>
          </SiteHeaderActions>
        </SiteHeaderContainer>
      </SiteHeader>
    </div>
  )
}

function SiteHeaderAnchoredDemo() {
  const [active, setActive] = useState("Work")
  const links = ["Work", "About", "Journal"]
  return (
    <div className="showcase-contained-viewport min-h-(--showcase-preview-min-height) w-full overflow-hidden rounded-lg border">
      <SiteHeader variant="floating" align="end" className="static">
        <SiteHeaderContainer>
          <SiteHeaderNav>
            {links.map((label) => (
              <SiteHeaderLink
                key={label}
                href="#"
                isActive={active === label}
                onClick={(e) => {
                  e.preventDefault()
                  setActive(label)
                }}
              >
                {label}
              </SiteHeaderLink>
            ))}
          </SiteHeaderNav>
          <SiteHeaderActions>
            <Avatar>
              <AvatarImage src={persona.avatar} alt="" />
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
          </SiteHeaderActions>
        </SiteHeaderContainer>
      </SiteHeader>
    </div>
  )
}

function SiteHeaderClusteredDemo() {
  const [active, setActive] = useState("Home")
  const links = ["Home", "Projects", "Reports"]
  return (
    <div className="showcase-contained-viewport min-h-(--showcase-preview-min-height) w-full overflow-hidden rounded-lg border">
      <SiteHeader variant="clustered" className="static">
        <SiteHeaderContainer>
          <SiteHeaderGroup>
            <SiteHeaderBrand href="#" onClick={(e) => e.preventDefault()}>
              <BoxIcon />
            </SiteHeaderBrand>
          </SiteHeaderGroup>
          <SiteHeaderGroup>
            <SiteHeaderNav>
              {links.map((label) => (
                <SiteHeaderLink
                  key={label}
                  href="#"
                  isActive={active === label}
                  onClick={(e) => {
                    e.preventDefault()
                    setActive(label)
                  }}
                >
                  {label}
                </SiteHeaderLink>
              ))}
            </SiteHeaderNav>
          </SiteHeaderGroup>
          <SiteHeaderGroup>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <SettingsIcon />
            </Button>
          </SiteHeaderGroup>
        </SiteHeaderContainer>
      </SiteHeader>
    </div>
  )
}

function SiteHeaderDockDemo() {
  const [active, setActive] = useState("Home")
  const items = [
    { label: "Home", icon: HomeIcon },
    { label: "Search", icon: SearchIcon },
    { label: "Inbox", icon: InboxIcon },
    { label: "Calendar", icon: CalendarIcon },
    { label: "Settings", icon: SettingsIcon },
  ]
  return (
    <div className="showcase-contained-viewport flex min-h-(--showcase-preview-min-height) w-full flex-col justify-end overflow-hidden rounded-lg border">
      <SiteHeader variant="floating" position="bottom" className="static">
        <SiteHeaderContainer>
          <SiteHeaderNav aria-label="Sections">
            {items.map(({ label, icon: Icon }) => (
              <SiteHeaderLink
                key={label}
                href="#"
                aria-label={label}
                isActive={active === label}
                className="w-(--site-header-item-size) justify-center px-0"
                onClick={(e) => {
                  e.preventDefault()
                  setActive(label)
                }}
              >
                <Icon />
              </SiteHeaderLink>
            ))}
          </SiteHeaderNav>
        </SiteHeaderContainer>
      </SiteHeader>
    </div>
  )
}









function SiteFooterDemo() {
  const columns = [
    {
      title: "Product",
      links: ["Overview", "Features", "Pricing", "Integrations", "Changelog"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: ["Docs", "Guides", "Help center", "API status", "Community"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Cookies"],
    },
  ]
  return (
    <div className="showcase-contained-viewport flex w-full flex-col justify-between overflow-hidden rounded-lg border bg-background">
      <div className="flex flex-col gap-(--space-sm) px-(--space-2xl) pt-(--space-3xl) pb-(--space-3xl)">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Platform overview
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          The page content transitions naturally into the footer with an expressive sine wave separator.
        </p>
      </div>
      <SiteFooter>
        <SiteFooterContainer>
          <SiteFooterTop>
            <SiteFooterIntro>
              <SiteFooterBrand href="#">
                <BoxIcon />
                <span>Acme</span>
              </SiteFooterBrand>
              <SiteFooterDescription>
                Build, ship, and scale your product with a single design system.
              </SiteFooterDescription>
              <SiteFooterNewsletter>
                <SiteFooterNewsletterTitle>
                  Subscribe to our newsletter
                </SiteFooterNewsletterTitle>
                <SiteFooterNewsletterDescription>
                  The latest news, articles, and resources, sent to your inbox
                  weekly.
                </SiteFooterNewsletterDescription>
                <SiteFooterNewsletterForm>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                  />
                  <Button type="submit">
                    Subscribe
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </SiteFooterNewsletterForm>
              </SiteFooterNewsletter>
              <SiteFooterSocial>
                <SiteFooterSocialLink href="#" aria-label="X" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="x.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="linkedin.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="YouTube" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="youtube.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="GitHub" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="github.com" alt="" />
                </SiteFooterSocialLink>
              </SiteFooterSocial>
            </SiteFooterIntro>
            <SiteFooterColumns>
              {columns.map((column) => (
                <SiteFooterColumn key={column.title}>
                  <SiteFooterColumnTitle>{column.title}</SiteFooterColumnTitle>
                  <SiteFooterNav>
                    {column.links.map((link) => (
                      <SiteFooterLink key={link} href="#" onClick={(e) => e.preventDefault()}>
                        {link}
                      </SiteFooterLink>
                    ))}
                  </SiteFooterNav>
                </SiteFooterColumn>
              ))}
            </SiteFooterColumns>
          </SiteFooterTop>
          <SiteFooterSeparator />
          <SiteFooterBottom>
            <SiteFooterCopyright>
              © 2026 Acme, Inc. All rights reserved.
            </SiteFooterCopyright>
            <SiteFooterLegal>
              <SiteFooterLink href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</SiteFooterLink>
              <SiteFooterLink href="#" onClick={(e) => e.preventDefault()}>Terms of Service</SiteFooterLink>
              <SiteFooterLink href="#" onClick={(e) => e.preventDefault()}>Sitemap</SiteFooterLink>
            </SiteFooterLegal>
          </SiteFooterBottom>
        </SiteFooterContainer>
      </SiteFooter>
    </div>
  )
}

function SiteFooterFloatingDemo() {
  const columns = [
    {
      title: "Product",
      links: ["Overview", "Features", "Pricing", "Integrations"],
    },
    {
      title: "Resources",
      links: ["Docs", "Guides", "Help center", "Community"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog", "Contact"],
    },
  ]
  return (
    <div className="showcase-contained-viewport flex w-full flex-col justify-between overflow-hidden rounded-lg border bg-background p-(--space-md)">
      <div className="flex flex-col gap-(--space-sm) px-(--space-2xl) pt-(--space-3xl) pb-(--space-2xl)">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Platform overview
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Floating card island elevated above the page with rounded corners.
        </p>
      </div>
      <SiteFooter variant="floating">
        <SiteFooterContainer>
          <SiteFooterTop>
            <SiteFooterIntro>
              <SiteFooterBrand href="#" onClick={(e) => e.preventDefault()}>
                <BoxIcon />
                <span>Acme</span>
              </SiteFooterBrand>
              <SiteFooterDescription>
                Build, ship, and scale your product with a single design system.
              </SiteFooterDescription>
              <SiteFooterSocial>
                <SiteFooterSocialLink href="#" aria-label="X" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="x.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="linkedin.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="GitHub" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="github.com" alt="" />
                </SiteFooterSocialLink>
              </SiteFooterSocial>
            </SiteFooterIntro>
            <SiteFooterColumns>
              {columns.map((column) => (
                <SiteFooterColumn key={column.title}>
                  <SiteFooterColumnTitle>{column.title}</SiteFooterColumnTitle>
                  <SiteFooterNav>
                    {column.links.map((link) => (
                      <SiteFooterLink key={link} href="#" onClick={(e) => e.preventDefault()}>
                        {link}
                      </SiteFooterLink>
                    ))}
                  </SiteFooterNav>
                </SiteFooterColumn>
              ))}
            </SiteFooterColumns>
          </SiteFooterTop>
          <SiteFooterSeparator />
          <SiteFooterBottom>
            <SiteFooterCopyright>
              © 2026 Acme, Inc. All rights reserved.
            </SiteFooterCopyright>
            <SiteFooterLegal>
              <SiteFooterLink href="#" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </SiteFooterLink>
              <SiteFooterLink href="#" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </SiteFooterLink>
            </SiteFooterLegal>
          </SiteFooterBottom>
        </SiteFooterContainer>
      </SiteFooter>
    </div>
  )
}

function SiteFooterInvertedDemo() {
  const columns = [
    {
      title: "Product",
      links: ["Overview", "Features", "Pricing", "Integrations"],
    },
    {
      title: "Resources",
      links: ["Docs", "Guides", "API status", "Community"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security"],
    },
  ]
  return (
    <div className="showcase-contained-viewport flex w-full flex-col justify-between overflow-hidden rounded-lg border bg-background">
      <div className="flex flex-col gap-(--space-sm) px-(--space-2xl) pt-(--space-3xl) pb-(--space-3xl)">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Platform overview
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          High-contrast dark footer anchored with the medium squiggly sine wave divider.
        </p>
      </div>
      <SiteFooter variant="inverted">
        <SiteFooterContainer>
          <SiteFooterTop>
            <SiteFooterIntro>
              <SiteFooterBrand href="#" onClick={(e) => e.preventDefault()}>
                <BoxIcon />
                <span>Acme</span>
              </SiteFooterBrand>
              <SiteFooterDescription>
                Build, ship, and scale your product with a single design system.
              </SiteFooterDescription>
              <SiteFooterSocial>
                <SiteFooterSocialLink href="#" aria-label="X" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="x.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="linkedin.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="YouTube" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="youtube.com" alt="" />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="GitHub" onClick={(e) => e.preventDefault()}>
                  <Favicon domain="github.com" alt="" />
                </SiteFooterSocialLink>
              </SiteFooterSocial>
            </SiteFooterIntro>
            <SiteFooterColumns>
              {columns.map((column) => (
                <SiteFooterColumn key={column.title}>
                  <SiteFooterColumnTitle>{column.title}</SiteFooterColumnTitle>
                  <SiteFooterNav>
                    {column.links.map((link) => (
                      <SiteFooterLink key={link} href="#" onClick={(e) => e.preventDefault()}>
                        {link}
                      </SiteFooterLink>
                    ))}
                  </SiteFooterNav>
                </SiteFooterColumn>
              ))}
            </SiteFooterColumns>
          </SiteFooterTop>
          <SiteFooterSeparator />
          <SiteFooterBottom>
            <SiteFooterCopyright>
              © 2026 Acme, Inc. All rights reserved.
            </SiteFooterCopyright>
            <SiteFooterLegal>
              <SiteFooterLink href="#" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </SiteFooterLink>
              <SiteFooterLink href="#" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </SiteFooterLink>
            </SiteFooterLegal>
          </SiteFooterBottom>
        </SiteFooterContainer>
      </SiteFooter>
    </div>
  )
}

const navigationPaneNavItems = [
  { label: "Home", icon: HomeIcon },
  { label: "Inbox", icon: InboxIcon },
  { label: "Calendar", icon: CalendarIcon },
  { label: "Settings", icon: SettingsIcon },
]

const navigationRailItems = [
  {
    label: "Home",
    icon: HomeIcon,
    destinations: ["Overview", "Activity", "Saved"],
  },
  {
    label: "Inbox",
    icon: InboxIcon,
    destinations: ["All messages", "Unread", "Drafts"],
  },
  {
    label: "Calendar",
    icon: CalendarIcon,
    destinations: ["Schedule", "Upcoming", "Reminders"],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    destinations: ["General", "Notifications", "Account"],
  },
]

function AttachedNavigationRailDemo() {
  const [activeRailItem, setActiveRailItem] = useState("Inbox")
  const activeItem = navigationRailItems.find(
    (item) => item.label === activeRailItem
  ) ?? navigationRailItems[0]
  const [activeDestination, setActiveDestination] = useState("All messages")

  return (
    <div className="showcase-contained-viewport h-(--page-preview-height) w-full overflow-hidden rounded-lg border">
      <NavigationPaneProvider
        id="showcase-navigation-rail"
        persist={false}
        className="min-h-full"
      >
        <NavigationPane
          placement="floating"
          collapsible="hidden"
          edge="faded"
          rail={
            <NavigationRail attached aria-label="Primary navigation">
              <NavigationRailList>
                {navigationRailItems.map(({ label, icon: Icon, destinations }) => (
                  <NavigationRailItem
                    key={label}
                    selected={activeRailItem === label}
                    onClick={() => {
                      setActiveRailItem(label)
                      setActiveDestination(destinations[0])
                    }}
                  >
                    <NavigationRailIcon>
                      <Icon size={24} />
                    </NavigationRailIcon>
                    <NavigationRailLabel>{label}</NavigationRailLabel>
                  </NavigationRailItem>
                ))}
              </NavigationRailList>
            </NavigationRail>
          }
        >
          <NavigationPaneHeader className="h-(--showcase-header-row-height) min-h-0 flex-row items-center justify-between px-4 py-0">
            <NavigationPaneBrand>
              <NavigationPaneBrandMark>
                <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-5" />
              </NavigationPaneBrandMark>
              <NavigationPaneBrandLabel className="text-lg font-semibold">
                Acme
              </NavigationPaneBrandLabel>
            </NavigationPaneBrand>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
          </NavigationPaneHeader>
          <Separator variant="faded" />
          <NavigationPaneGroup>
            <NavigationPaneSearch placeholder={`Search ${activeItem.label}`} aria-label={`Search ${activeItem.label}`} />
          </NavigationPaneGroup>
          <NavigationPaneContent>
            <NavigationPaneGroup>
              <NavigationPaneGroupLabel>{activeItem.label}</NavigationPaneGroupLabel>
              <NavigationPaneGroupContent>
                <NavigationPaneMenu>
                  {activeItem.destinations.map((destination) => (
                    <NavigationPaneMenuItem key={destination}>
                      <Item
                        compact
                        asChild
                        variant={activeDestination === destination ? "muted" : "default"}
                      >
                        <button
                          type="button"
                          aria-pressed={activeDestination === destination}
                          onClick={() => setActiveDestination(destination)}
                        >
                          <ItemContent>
                            <ItemTitle>{destination}</ItemTitle>
                          </ItemContent>
                        </button>
                      </Item>
                    </NavigationPaneMenuItem>
                  ))}
                </NavigationPaneMenu>
              </NavigationPaneGroupContent>
            </NavigationPaneGroup>
          </NavigationPaneContent>
          <NavigationPaneDemoFooter />
        </NavigationPane>
        <NavigationPaneInset className="min-h-full">
          <NavigationPaneTrigger placement="floating" />
        </NavigationPaneInset>
      </NavigationPaneProvider>
    </div>
  )
}

function NavigationPaneDemoNav({
  active,
  onSelect,
}: {
  active: string
  onSelect: (label: string) => void
}) {
  const { isMobile, setOpenMobile } = useNavigationPane()
  return (
    <NavigationPaneContent>
      <NavigationPaneGroup>
        <NavigationPaneGroupLabel>Application</NavigationPaneGroupLabel>
        <NavigationPaneGroupContent>
          <NavigationPaneMenu>
            {navigationPaneNavItems.map(({ label, icon: Icon }) => (
              <NavigationPaneMenuItem key={label}>
                <Item compact asChild variant={active === label ? "muted" : "default"}>
                  <button
                    type="button"
                    aria-pressed={active === label}
                    onClick={() => {
                      onSelect(label)
                      if (isMobile) setOpenMobile(false)
                    }}
                  >
                    <ItemMedia variant="icon">
                      <Icon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{label}</ItemTitle>
                    </ItemContent>
                  </button>
                </Item>
              </NavigationPaneMenuItem>
            ))}
          </NavigationPaneMenu>
        </NavigationPaneGroupContent>
      </NavigationPaneGroup>
    </NavigationPaneContent>
  )
}

function NavigationPaneDemoBrand() {
  return (
    <NavigationPaneHeader className="h-(--showcase-header-row-height) min-h-0 flex-row items-center justify-between px-4 py-0">
      <NavigationPaneBrand>
        <NavigationPaneBrandMark>
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-5" />
        </NavigationPaneBrandMark>
        <NavigationPaneBrandLabel className="text-lg font-semibold">Acme</NavigationPaneBrandLabel>
      </NavigationPaneBrand>
      <NavigationPaneHeaderActions>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <BellIcon />
        </Button>
        <NavigationPaneTrigger />
      </NavigationPaneHeaderActions>
    </NavigationPaneHeader>
  )
}

function NavigationPaneBarDemoBrand() {
  return (
    <NavigationPaneHeader className="h-(--showcase-header-row-height) min-h-0 flex-row items-center justify-between px-4 py-0">
      <NavigationPaneBrand>
        <NavigationPaneBrandMark>
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-5" />
        </NavigationPaneBrandMark>
        <NavigationPaneBrandLabel className="text-lg font-semibold">Acme</NavigationPaneBrandLabel>
      </NavigationPaneBrand>
      <NavigationPaneHeaderActions>
        <NavigationPaneTrigger />
      </NavigationPaneHeaderActions>
    </NavigationPaneHeader>
  )
}

// The real SearchInput, built to match a nav row exactly: it sits in a
// NavigationPaneGroup (same 16px inset as the menu), takes the Item's compact radius
// and 6px inset, and pins its leading icon as a fixed 28px host — the same
// geometry as a nav row's ItemMedia. So the pill width and the icon column line
// up with the rows below in every state. On the icon bar the field naturally
// narrows to a 40px circle (its height never changes) while the text and clear
// button fade and surrender their width — only width/opacity move, nothing
// reflows.
function NavigationPaneDemoSearch() {
  return (
    <NavigationPaneGroup>
      <NavigationPaneSearch placeholder="Search..." aria-label="Search" />
    </NavigationPaneGroup>
  )
}

function NavigationPaneDemoFooter() {
  return (
    <NavigationPaneFooter>
      <NavigationPaneMenu>
        <NavigationPaneMenuItem>
          <Item compact asChild>
            <button type="button">
              <ItemMedia>
                <Avatar className="size-(--item-compact-media-host-size)">
                  <AvatarImage src={persona.avatar} alt="" />
                  <AvatarFallback>{persona.initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{persona.name}</ItemTitle>
              </ItemContent>
            </button>
          </Item>
        </NavigationPaneMenuItem>
      </NavigationPaneMenu>
    </NavigationPaneFooter>
  )
}

function InteractiveNavigationPaneDemo() {
  const [activeItem, setActiveItem] = useState("Home")
  return (
    <div className="showcase-contained-viewport h-(--page-preview-height) w-full overflow-hidden rounded-lg border">
      <NavigationPaneProvider
        id="showcase-navigation-pane"
        persist={false}
        className="min-h-full"
        style={{ "--navigation-pane-floating-trigger-inset": "var(--showcase-navigation-pane-trigger-inset)" } as CSSProperties}
      >
        <NavigationPane placement="floating" collapsible="hidden" edge="faded">
          <NavigationPaneDemoBrand />
          <Separator
            variant="faded"
            className="transition-opacity duration-(--navigation-pane-speed) ease-(--navigation-pane-ease) group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0"
          />
          <NavigationPaneDemoSearch />
          <NavigationPaneDemoNav active={activeItem} onSelect={setActiveItem} />
          <NavigationPaneDemoFooter />
        </NavigationPane>
        <NavigationPaneInset className="min-h-full">
          <NavigationPaneTrigger placement="floating" />
        </NavigationPaneInset>
      </NavigationPaneProvider>
    </div>
  )
}

function NavigationPaneIconBarDemo() {
  const [activeItem, setActiveItem] = useState("Home")
  return (
    <div className="showcase-contained-viewport h-(--page-preview-height) w-full overflow-hidden rounded-lg border">
      <NavigationPaneProvider
        id="showcase-navigation-pane-bar"
        persist={false}
        className="min-h-full"
        style={{ "--navigation-pane-floating-trigger-inset": "var(--showcase-navigation-pane-trigger-inset)" } as CSSProperties}
      >
        <NavigationPane placement="floating" collapsible="bar" edge="faded">
          <NavigationPaneBarDemoBrand />
          <Separator
            variant="faded"
            className="transition-opacity duration-(--navigation-pane-speed) ease-(--navigation-pane-ease) group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0"
          />
          <NavigationPaneDemoSearch />
          <NavigationPaneDemoNav active={activeItem} onSelect={setActiveItem} />
          <NavigationPaneDemoFooter />
        </NavigationPane>
        <NavigationPaneInset className="min-h-full">
          <NavigationPaneTrigger placement="floating" />
        </NavigationPaneInset>
      </NavigationPaneProvider>
    </div>
  )
}

export const navigationDemos: ComponentEntry[] = [
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description: "Displays the path to the current resource using a hierarchy.",
    category: "Navigation",
    Demo: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
    examples: [
      {
        name: "Dropdown",
        description:
          "A breadcrumb item that opens a dropdown menu of sibling pages.",
        Demo: () => (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground">
                    Components
                    <ChevronDownIcon className="size-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Documentation
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Themes
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      GitHub
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ),
      },
      {
        name: "Collapsed",
        description:
          "Breadcrumb with an ellipsis indicating hidden intermediate levels.",
        Demo: () => (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                  Components
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ),
      },
    ],
  },
  {
    slug: "navigation-menu",
    name: "Navigation Menu",
    description: "A collection of links for navigating websites.",
    category: "Navigation",
    Demo: () => (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              onClick={(e) => e.preventDefault()}
              className={navigationMenuTriggerStyle()}
            >
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              onClick={(e) => e.preventDefault()}
              className={navigationMenuTriggerStyle()}
            >
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              onClick={(e) => e.preventDefault()}
              className={navigationMenuTriggerStyle()}
            >
              Components
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    code: `import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
    examples: [
      {
        name: "Viewport popup",
        description: "A shared floating viewport for navigation destinations.",
        Demo: () => (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="#/button">
                    Buttons
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#/card">
                    Cards
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuIndicator />
          </NavigationMenu>
        ),
      },
      {
        name: "Direct popup",
        description: "A floating menu anchored to its own trigger.",
        Demo: () => (
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="#/input">
                    Inputs
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#/select">
                    Selects
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ),
      },
    ],
  },
  {
    slug: "pagination",
    name: "Pagination",
    description: "Pagination with page navigation, next and previous links.",
    category: "Navigation",
    Demo: () => (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => e.preventDefault()}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => e.preventDefault()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
    code: `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`,
    examples: [
      {
        name: "Simple",
        description:
          "Interactive pagination with clickable page numbers and previous/next navigation.",
        Demo: PaginationSimpleDemo,
      },
      {
        name: "Icons only",
        description:
          "Pagination with icon-only previous and next controls and no text labels.",
        Demo: PaginationIconsOnlyDemo,
      },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Layered sections of content displayed one panel at a time.",
    category: "Navigation",
    Demo: () => (
      <Tabs defaultValue="account" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-muted-foreground text-sm">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password" className="text-muted-foreground text-sm">
          Change your password here.
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}`,
    examples: [
      {
        name: "Line",
        description: "Tabs with a line indicator instead of the default pill.",
        Demo: () => (
          <Tabs defaultValue="posts" className="w-full max-w-sm">
            <TabsList variant="line">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
            </TabsList>
            <TabsContent
              value="posts"
              className="text-muted-foreground text-sm"
            >
              Your recent posts will appear here.
            </TabsContent>
            <TabsContent
              value="following"
              className="text-muted-foreground text-sm"
            >
              People you follow.
            </TabsContent>
            <TabsContent
              value="followers"
              className="text-muted-foreground text-sm"
            >
              People who follow you.
            </TabsContent>
          </Tabs>
        ),
      },
      {
        name: "Vertical",
        description: "Tabs arranged vertically with content beside the list.",
        Demo: () => (
          <Tabs
            defaultValue="general"
            orientation="vertical"
            className="w-full max-w-md"
          >
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent
              value="general"
              className="text-muted-foreground text-sm"
            >
              Manage your general account preferences.
            </TabsContent>
            <TabsContent
              value="security"
              className="text-muted-foreground text-sm"
            >
              Update your password and security settings.
            </TabsContent>
            <TabsContent
              value="notifications"
              className="text-muted-foreground text-sm"
            >
              Choose what notifications you receive.
            </TabsContent>
          </Tabs>
        ),
      },
      {
        name: "Disabled",
        description: "A tab trigger can be individually disabled.",
        Demo: () => (
          <Tabs defaultValue="active" className="w-full max-w-sm">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="disabled" disabled>
                Disabled
              </TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent
              value="active"
              className="text-muted-foreground text-sm"
            >
              This tab is active.
            </TabsContent>
            <TabsContent
              value="other"
              className="text-muted-foreground text-sm"
            >
              Another panel.
            </TabsContent>
          </Tabs>
        ),
      },
      {
        name: "Icons",
        description: "Tab triggers with leading icons.",
        Demo: () => (
          <Tabs defaultValue="music" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="music">
                <MusicIcon />
                Music
              </TabsTrigger>
              <TabsTrigger value="photos">
                <ImageIcon />
                Photos
              </TabsTrigger>
              <TabsTrigger value="videos">
                <VideoIcon />
                Videos
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileTextIcon />
                Documents
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="music"
              className="text-muted-foreground text-sm"
            >
              Your music library.
            </TabsContent>
            <TabsContent
              value="photos"
              className="text-muted-foreground text-sm"
            >
              Your photo gallery.
            </TabsContent>
            <TabsContent
              value="videos"
              className="text-muted-foreground text-sm"
            >
              Your video collection.
            </TabsContent>
            <TabsContent
              value="documents"
              className="text-muted-foreground text-sm"
            >
              Your documents.
            </TabsContent>
          </Tabs>
        ),
      },
      {
        name: "Rounded",
        description:
          "shape=\"pill\" rounds the track and the pill fully; the default shape keeps the rectangular corner.",
        Demo: () => (
          <Tabs defaultValue="week" className="w-full max-w-sm">
            <TabsList shape="pill">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        ),
      },
      {
        name: "Icon Only",
        description:
          "Square icon tabs. Each trigger names itself with aria-label.",
        Demo: () => (
          <Tabs defaultValue="music" className="w-full max-w-sm">
            <TabsList iconOnly aria-label="Library">
              <TabsTrigger value="music" aria-label="Music">
                <MusicIcon />
              </TabsTrigger>
              <TabsTrigger value="photos" aria-label="Photos">
                <ImageIcon />
              </TabsTrigger>
              <TabsTrigger value="videos" aria-label="Videos">
                <VideoIcon />
              </TabsTrigger>
              <TabsTrigger value="documents" aria-label="Documents">
                <FileTextIcon />
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="music"
              className="text-muted-foreground text-sm"
            >
              Your music library.
            </TabsContent>
            <TabsContent
              value="photos"
              className="text-muted-foreground text-sm"
            >
              Your photo gallery.
            </TabsContent>
            <TabsContent
              value="videos"
              className="text-muted-foreground text-sm"
            >
              Your video collection.
            </TabsContent>
            <TabsContent
              value="documents"
              className="text-muted-foreground text-sm"
            >
              Your documents.
            </TabsContent>
          </Tabs>
        ),
      },
      {
        name: "Round Icons",
        description:
          "The same icon tabs with shape=\"pill\", so the track and the travelling pill are circles.",
        Demo: () => (
          <Tabs defaultValue="music" className="w-full max-w-sm">
            <TabsList iconOnly shape="pill" aria-label="Library">
              <TabsTrigger value="music" aria-label="Music">
                <MusicIcon />
              </TabsTrigger>
              <TabsTrigger value="photos" aria-label="Photos">
                <ImageIcon />
              </TabsTrigger>
              <TabsTrigger value="videos" aria-label="Videos">
                <VideoIcon />
              </TabsTrigger>
              <TabsTrigger value="documents" aria-label="Documents">
                <FileTextIcon />
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="music"
              className="text-muted-foreground text-sm"
            >
              Your music library.
            </TabsContent>
            <TabsContent
              value="photos"
              className="text-muted-foreground text-sm"
            >
              Your photo gallery.
            </TabsContent>
            <TabsContent
              value="videos"
              className="text-muted-foreground text-sm"
            >
              Your video collection.
            </TabsContent>
            <TabsContent
              value="documents"
              className="text-muted-foreground text-sm"
            >
              Your documents.
            </TabsContent>
          </Tabs>
        ),
      },
    ],
  },
  {
    slug: "navigation-rail",
    name: "Navigation - Rail",
    description:
      "Material 3 Expressive primary navigation paired with a floating navigation pane as two flat surfaces separated by an 8px gap, with smaller concentric corners.",
    category: "Navigation",
    Demo: AttachedNavigationRailDemo,
    code: `import {
  NavigationRail,
  NavigationRailIcon,
  NavigationRailItem,
  NavigationRailLabel,
  NavigationRailList,
} from "@/components/ui/navigation-rail"
import {
  NavigationPane,
  NavigationPaneInset,
  NavigationPaneProvider,
} from "@/components/ui/navigation-pane"

export function NavigationRailDemo() {
  return (
    <NavigationPaneProvider>
      <NavigationPane
        placement="floating"
        rail={
          <NavigationRail attached aria-label="Primary navigation">
            <NavigationRailList>
              <NavigationRailItem selected>
                <NavigationRailIcon>
                  <HomeIcon size={24} />
                </NavigationRailIcon>
                <NavigationRailLabel>Home</NavigationRailLabel>
              </NavigationRailItem>
            </NavigationRailList>
          </NavigationRail>
        }
      >
        Navigation pane content
      </NavigationPane>
      <NavigationPaneInset>
        <NavigationPaneTrigger placement="floating" />
      </NavigationPaneInset>
    </NavigationPaneProvider>
  )
}`,
  },
  {
    slug: "navigation-pane",
    name: "Navigation - Pane",
    description:
      "Application navigation pane — the same default used by this site: a floating panel that hides fully on toggle rather than collapsing to icons.",
    category: "Navigation",
    Demo: InteractiveNavigationPaneDemo,
    code: `import {
  NavigationPane,
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
  NavigationPaneInset,
  NavigationPaneMenu,
  NavigationPaneMenuItem,
  NavigationPaneProvider,
  NavigationPaneSearch,
  NavigationPaneTrigger,
} from "@/components/ui/navigation-pane"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"

export function NavigationPaneDemo() {
  return (
    <NavigationPaneProvider>
      <NavigationPane placement="floating" collapsible="hidden" edge="faded">
        <NavigationPaneHeader className="h-(--showcase-header-row-height) min-h-0 flex-row items-center justify-between px-4 py-0">
          <NavigationPaneBrand>
            <NavigationPaneBrandMark>
              <img src={import.meta.env.BASE_URL + "favicon.svg"} alt="" className="size-5" />
            </NavigationPaneBrandMark>
            <NavigationPaneBrandLabel className="text-lg font-semibold">Acme</NavigationPaneBrandLabel>
          </NavigationPaneBrand>
          <NavigationPaneHeaderActions>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <NavigationPaneTrigger />
          </NavigationPaneHeaderActions>
        </NavigationPaneHeader>
          <Separator
            variant="faded"
            className="transition-opacity duration-(--navigation-pane-speed) ease-(--navigation-pane-ease) group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0"
          />
        <NavigationPaneGroup>
          <NavigationPaneSearch placeholder="Search..." aria-label="Search" />
        </NavigationPaneGroup>
        <NavigationPaneContent>
          <NavigationPaneGroup>
            <NavigationPaneGroupLabel>Application</NavigationPaneGroupLabel>
            <NavigationPaneGroupContent>
              <NavigationPaneMenu>
                <NavigationPaneMenuItem>
                  <Item compact asChild variant="muted">
                    <button type="button">
                      <ItemMedia variant="icon">
                        <HomeIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Home</ItemTitle>
                      </ItemContent>
                    </button>
                  </Item>
                </NavigationPaneMenuItem>
              </NavigationPaneMenu>
            </NavigationPaneGroupContent>
          </NavigationPaneGroup>
        </NavigationPaneContent>
        <NavigationPaneFooter />
      </NavigationPane>
      <NavigationPaneInset>
        <NavigationPaneTrigger placement="floating" />
      </NavigationPaneInset>
    </NavigationPaneProvider>
  )
}`,
    examples: [
      {
        name: "Icon Bar",
        description:
          "Collapses to a narrow icon bar instead of hiding entirely. The search field shrinks to its icon and labels fade out in place — nothing reflows, so every icon keeps its exact position.",
        Demo: NavigationPaneIconBarDemo,
        layout: "wide",
      },
    ],
  },
  {
    slug: "site-header",
    name: "Site Header",
    description:
      "Top navigation as three independent axes: how the shell is composed, where it sits, and which edge it hugs.",
    category: "Navigation",
    Demo: SiteHeaderDemo,
    examples: [
      {
        name: "Floating",
        description:
          "A rounded shell inset from the window edge. The corner radius is the signal: square means the bar belongs to the frame, rounded means it is a surface floating above the content.",
        Demo: SiteHeaderFloatingDemo,
        layout: "wide",
      },
      {
        name: "Anchored to one corner",
        description:
          "The same floating shell with align set to end. Because the shell only takes the width it needs, the rest of the row stays available to the page.",
        Demo: SiteHeaderAnchoredDemo,
        layout: "wide",
      },
      {
        name: "Clustered",
        description:
          "The shell turns transparent and each group carries its own chrome, so related controls read as one object without a divider between them.",
        Demo: SiteHeaderClusteredDemo,
        layout: "wide",
      },
      {
        name: "Bottom dock",
        description:
          "Position set to bottom turns the same component into a dock. Do not pair this with a second navigation elsewhere on the page.",
        Demo: SiteHeaderDockDemo,
        layout: "wide",
      },
    ],
    code: `import { BellIcon, BoxIcon, SearchIcon } from "@/components/ui/icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SiteHeader,
  SiteHeaderActions,
  SiteHeaderBrand,
  SiteHeaderContainer,
  SiteHeaderLink,
  SiteHeaderNav,
} from "@/components/ui/site-header"

export function SiteHeaderDemo() {
  return (
    <SiteHeader>
      <SiteHeaderContainer>
        <SiteHeaderBrand href="#">
          <BoxIcon />
          <span>Acme</span>
        </SiteHeaderBrand>
        <SiteHeaderNav>
          <SiteHeaderLink href="#" isActive>
            Product
          </SiteHeaderLink>
          <SiteHeaderLink href="#">Solutions</SiteHeaderLink>
          <SiteHeaderLink href="#">Pricing</SiteHeaderLink>
          <SiteHeaderLink href="#">Docs</SiteHeaderLink>
        </SiteHeaderNav>
        <SiteHeaderActions>
          <div className="relative hidden sm:block">
            <SearchInput placeholder="Search..." className="w-44" />
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <BellIcon />
          </Button>
          <Button size="default">Sign in</Button>
        </SiteHeaderActions>
      </SiteHeaderContainer>
    </SiteHeader>
  )
}`,
  },
  {
    slug: "site-footer",
    name: "Site Footer",
    description:
      "A comprehensive themed footer as docked, floating island, or high-contrast inverted surfaces.",
    category: "Navigation",
    Demo: SiteFooterDemo,
    examples: [
      {
        name: "Floating island",
        description:
          "An expressive rounded card footer elevated above the page with soft depth, concentric geometry, and tactile social knobs.",
        Demo: SiteFooterFloatingDemo,
        layout: "wide",
      },
      {
        name: "Inverted",
        description:
          "A high-contrast dark footer surface providing an authoritative, grounded anchor at the bottom of the page.",
        Demo: SiteFooterInvertedDemo,
        layout: "wide",
      },
    ],
    code: `import { ArrowRightIcon, BoxIcon } from "@/components/ui/icons"

// Brand marks (X, LinkedIn, YouTube, GitHub) are your own inline SVG components.
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SiteFooter,
  SiteFooterBottom,
  SiteFooterBrand,
  SiteFooterColumn,
  SiteFooterColumns,
  SiteFooterColumnTitle,
  SiteFooterContainer,
  SiteFooterCopyright,
  SiteFooterDescription,
  SiteFooterIntro,
  SiteFooterLegal,
  SiteFooterLink,
  SiteFooterNav,
  SiteFooterNewsletter,
  SiteFooterNewsletterDescription,
  SiteFooterNewsletterForm,
  SiteFooterNewsletterTitle,
  SiteFooterSeparator,
  SiteFooterSocial,
  SiteFooterSocialLink,
  SiteFooterTop,
} from "@/components/ui/site-footer"

export function SiteFooterDemo() {
  return (
    <SiteFooter>
      <SiteFooterContainer>
        <SiteFooterTop>
          <SiteFooterIntro>
            <SiteFooterBrand href="#">
              <BoxIcon />
              <span>Acme</span>
            </SiteFooterBrand>
            <SiteFooterDescription>
              Build, ship, and scale your product with a single design system.
            </SiteFooterDescription>
            <SiteFooterNewsletter>
              <SiteFooterNewsletterTitle>
                Subscribe to our newsletter
              </SiteFooterNewsletterTitle>
              <SiteFooterNewsletterDescription>
                The latest news, articles, and resources, sent to your inbox
                weekly.
              </SiteFooterNewsletterDescription>
              <SiteFooterNewsletterForm>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                />
                <Button type="submit">
                  Subscribe
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </SiteFooterNewsletterForm>
            </SiteFooterNewsletter>
            <SiteFooterSocial>
              <SiteFooterSocialLink href="#" aria-label="X">
                <Favicon domain="x.com" alt="" />
              </SiteFooterSocialLink>
              <SiteFooterSocialLink href="#" aria-label="LinkedIn">
                <Favicon domain="linkedin.com" alt="" />
              </SiteFooterSocialLink>
              <SiteFooterSocialLink href="#" aria-label="YouTube">
                <Favicon domain="youtube.com" alt="" />
              </SiteFooterSocialLink>
              <SiteFooterSocialLink href="#" aria-label="GitHub">
                <Favicon domain="github.com" alt="" />
              </SiteFooterSocialLink>
            </SiteFooterSocial>
          </SiteFooterIntro>
          <SiteFooterColumns>
            <SiteFooterColumn>
              <SiteFooterColumnTitle>Product</SiteFooterColumnTitle>
              <SiteFooterNav>
                <SiteFooterLink href="#">Overview</SiteFooterLink>
                <SiteFooterLink href="#">Features</SiteFooterLink>
                <SiteFooterLink href="#">Pricing</SiteFooterLink>
              </SiteFooterNav>
            </SiteFooterColumn>
            <SiteFooterColumn>
              <SiteFooterColumnTitle>Company</SiteFooterColumnTitle>
              <SiteFooterNav>
                <SiteFooterLink href="#">About</SiteFooterLink>
                <SiteFooterLink href="#">Careers</SiteFooterLink>
                <SiteFooterLink href="#">Blog</SiteFooterLink>
              </SiteFooterNav>
            </SiteFooterColumn>
          </SiteFooterColumns>
        </SiteFooterTop>
        <SiteFooterSeparator />
        <SiteFooterBottom>
          <SiteFooterCopyright>
            © 2026 Acme, Inc. All rights reserved.
          </SiteFooterCopyright>
          <SiteFooterLegal>
            <SiteFooterLink href="#">Privacy Policy</SiteFooterLink>
            <SiteFooterLink href="#">Terms of Service</SiteFooterLink>
          </SiteFooterLegal>
        </SiteFooterBottom>
      </SiteFooterContainer>
    </SiteFooter>
  )
}`,
  },
]
