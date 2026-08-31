import { useState } from "react"
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
  BoxesIcon,
  ChevronsUpDownIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
import {
  Sidebar,
  SidebarAccount,
  SidebarAccountDetails,
  SidebarBrand,
  SidebarBrandLabel,
  SidebarBrandMark,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarResizeHandle,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

const sidebarNavItems = [
  { label: "Home", icon: HomeIcon },
  { label: "Inbox", icon: InboxIcon },
  { label: "Calendar", icon: CalendarIcon },
  { label: "Settings", icon: SettingsIcon },
]

function SidebarDemoNav({
  active,
  onSelect,
}: {
  active: string
  onSelect: (label: string) => void
}) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarNavItems.map(({ label, icon: Icon }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton
                  isActive={active === label}
                  tooltip={label}
                  onClick={(event) => {
                    event.preventDefault()
                    onSelect(label)
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

function SidebarStateReadout() {
  const { form, placement, collapse, width } = useSidebar()
  const rows: [string, string][] = [
    ["form", form],
    ["placement", placement],
    ["collapse", collapse],
    ["width", width ?? "token default"],
  ]

  return (
    <dl className="w-full">
      {rows.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-4 border-b py-1 last:border-b-0"
        >
          <dt className="text-muted-foreground text-xs">{key}</dt>
          <dd className="font-mono text-xs">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function SidebarDemoBrand() {
  return (
    <SidebarHeader>
      <SidebarBrand>
        <SidebarBrandMark>
          <BoxesIcon className="size-4" />
        </SidebarBrandMark>
        <SidebarBrandLabel>Acme</SidebarBrandLabel>
        <SidebarTrigger />
      </SidebarBrand>
    </SidebarHeader>
  )
}

function SidebarDemoAccount() {
  return (
    <SidebarFooter>
      <SidebarAccount>
        <Avatar>
          <AvatarImage src={persona.avatar} alt="" />
          <AvatarFallback>{persona.initials}</AvatarFallback>
        </Avatar>
        <SidebarAccountDetails>
          <span>{persona.name}</span>
          <span>Free plan</span>
        </SidebarAccountDetails>
        <ChevronsUpDownIcon />
      </SidebarAccount>
    </SidebarFooter>
  )
}

function SidebarDemoTopBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-(--sidebar-header-height) shrink-0 items-center gap-2 border-b px-4 text-sm font-medium">
      {children}
    </div>
  )
}

function InteractiveSidebarDemo() {
  const [activeItem, setActiveItem] = useState("Home")
  return (
    <div className="showcase-contained-viewport h-96 w-full overflow-hidden rounded-lg border">
      <SidebarProvider
        id="showcase-sidebar"
        persist={false}
        className="min-h-full"
      >
        <Sidebar collapsible="bar">
          <SidebarDemoBrand />
          <SidebarDemoNav active={activeItem} onSelect={setActiveItem} />
          <SidebarDemoAccount />
          <SidebarResizeHandle />
        </Sidebar>
        <SidebarInset className="min-h-full">
          <SidebarDemoTopBar>{activeItem}</SidebarDemoTopBar>
          <div className="flex flex-col gap-3 p-4">
            <p className="text-muted-foreground text-sm">
              The toggle lives in the panel: top-right when expanded, and once
              collapsed it fades out and returns whenever the bar is hovered.
              Drag the inner edge to resize, or double-click it to reset.
            </p>
            <SidebarStateReadout />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function SidebarStateControls() {
  const { setDock, setWidth, resetWidth, startPeek } = useSidebar()
  const states: [string, () => void][] = [
    [
      "expanded",
      () => {
        resetWidth()
        setDock("expanded")
      },
    ],
    [
      "resized",
      () => {
        setDock("expanded")
        setWidth("18rem")
      },
    ],
    ["bar", () => setDock("bar")],
    [
      "peeking",
      () => {
        setDock("bar")
        startPeek(true)
      },
    ],
  ]

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap gap-2">
        {states.map(([label, apply]) => (
          <Button key={label} size="sm" variant="outline" onClick={apply}>
            {label}
          </Button>
        ))}
      </div>
      <SidebarStateReadout />
    </div>
  )
}

function SidebarCollapseStatesDemo() {
  const [activeItem, setActiveItem] = useState("Home")
  return (
    <div className="showcase-contained-viewport h-96 w-full overflow-hidden rounded-lg border">
      <SidebarProvider
        id="showcase-sidebar-states"
        persist={false}
        shortcut={false}
        peek
        className="min-h-full"
      >
        <Sidebar collapsible="bar">
          <SidebarDemoBrand />
          <SidebarDemoNav active={activeItem} onSelect={setActiveItem} />
          <SidebarDemoAccount />
          <SidebarResizeHandle />
        </Sidebar>
        <SidebarInset className="min-h-full">
          <SidebarStateControls />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function SidebarPeekDemo() {
  const [activeItem, setActiveItem] = useState("Inbox")
  return (
    <div className="showcase-contained-viewport h-80 w-full overflow-hidden rounded-lg border">
      <SidebarProvider
        id="showcase-sidebar-peek"
        persist={false}
        shortcut={false}
        peek
        defaultOpen={false}
        className="min-h-full"
      >
        <Sidebar collapsible="hidden">
          <SidebarDemoBrand />
          <SidebarDemoNav active={activeItem} onSelect={setActiveItem} />
          <SidebarDemoAccount />
        </Sidebar>
        <SidebarInset className="min-h-full">
          <SidebarDemoTopBar>{activeItem}</SidebarDemoTopBar>
          <div className="flex flex-col gap-3 p-4">
            <p className="text-muted-foreground text-sm">
              The panel is hidden, so the layout has the full width. Sweep the
              pointer toward the left edge to peek it over the content — nothing
              reflows. With peek on, the toggle simply fades out instead of
              taking over the logo.
            </p>
            <SidebarStateReadout />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function SidebarEdgeDemo() {
  const [activeItem, setActiveItem] = useState("Home")
  const [edge, setEdge] = useState<"line" | "faded" | "none">("faded")
  return (
    <div className="showcase-contained-viewport h-80 w-full overflow-hidden rounded-lg border">
      <SidebarProvider
        id="showcase-sidebar-edge"
        persist={false}
        shortcut={false}
        className="min-h-full"
      >
        <Sidebar collapsible="bar" edge={edge}>
          <SidebarDemoBrand />
          <SidebarDemoNav active={activeItem} onSelect={setActiveItem} />
          <SidebarDemoAccount />
        </Sidebar>
        <SidebarInset className="min-h-full">
          <SidebarDemoTopBar>{activeItem}</SidebarDemoTopBar>
          <div className="flex flex-wrap gap-2 p-4">
            {(["line", "faded", "none"] as const).map((option) => (
              <Button
                key={option}
                size="sm"
                variant={edge === option ? "default" : "outline"}
                onClick={() => setEdge(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function SidebarPlacementDemo() {
  const [activeItem, setActiveItem] = useState("Home")
  return (
    // rounded-3xl: the inset card's 14px radius plus its 8px margin, so the two curves stay concentric.
    <div className="showcase-contained-viewport h-80 w-full overflow-hidden rounded-3xl border">
      <SidebarProvider
        id="showcase-sidebar-inset"
        persist={false}
        shortcut={false}
        className="min-h-full"
      >
        <Sidebar placement="inset" collapsible="bar">
          <SidebarDemoBrand />
          <SidebarDemoNav active={activeItem} onSelect={setActiveItem} />
          <SidebarDemoAccount />
          <SidebarResizeHandle />
        </Sidebar>
        <SidebarInset className="min-h-full">
          <SidebarDemoTopBar>{activeItem}</SidebarDemoTopBar>
          <div className="text-muted-foreground p-4 text-sm">
            <code className="font-mono">placement=&quot;inset&quot;</code> pulls
            the content into a rounded card. Use{" "}
            <code className="font-mono">&quot;floating&quot;</code> to float the
            panel instead, or <code className="font-mono">&quot;docked&quot;</code>{" "}
            for a flush edge.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
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
            <SiteHeaderSeparator />
            <Button variant="ghost" size="icon" aria-label="Search">
              <SearchIcon />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <Button size="sm">Sign in</Button>
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
            <Button size="sm">Sign in</Button>
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

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YouTubeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function GitHubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
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
    <div className="showcase-contained-viewport w-full overflow-hidden rounded-lg border">
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
                  <XIcon />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="LinkedIn">
                  <LinkedInIcon />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="YouTube">
                  <YouTubeIcon />
                </SiteFooterSocialLink>
                <SiteFooterSocialLink href="#" aria-label="GitHub">
                  <GitHubIcon />
                </SiteFooterSocialLink>
              </SiteFooterSocial>
            </SiteFooterIntro>
            <SiteFooterColumns>
              {columns.map((column) => (
                <SiteFooterColumn key={column.title}>
                  <SiteFooterColumnTitle>{column.title}</SiteFooterColumnTitle>
                  <SiteFooterNav>
                    {column.links.map((link) => (
                      <SiteFooterLink key={link} href="#">
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
              <SiteFooterLink href="#">Privacy Policy</SiteFooterLink>
              <SiteFooterLink href="#">Terms of Service</SiteFooterLink>
              <SiteFooterLink href="#">Sitemap</SiteFooterLink>
            </SiteFooterLegal>
          </SiteFooterBottom>
        </SiteFooterContainer>
      </SiteFooter>
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
    slug: "sidebar",
    name: "Sidebar (Navigation)",
    description:
      "An application shell with three independent axes — form, placement, and collapse — plus resize, hover peek, and persistence.",
    category: "Navigation",
    Demo: InteractiveSidebarDemo,
    code: `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarResizeHandle,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function SidebarDemo() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="bar">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home">
                    Home
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarResizeHandle />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  )
}`,
    examples: [
      {
        name: "Collapse States",
        description:
          "Five states, not three. Expanded and resized reflow the layout, bar shrinks it to icons, hidden removes it, and peeking floats the panel over the content without reflowing anything.",
        Demo: SidebarCollapseStatesDemo,
        layout: "wide",
      },
      {
        name: "Hover Peek",
        description:
          "When the panel is collapsed, sweeping the pointer toward the edge expands it as an overlay. Placement flips to overlay so the page behind never reflows, and the toggle stays independent instead of taking over the logo.",
        Demo: SidebarPeekDemo,
        layout: "wide",
      },
      {
        name: "Placement",
        description:
          "Placement is independent of collapse. Docked sits flush, floating lifts the panel off the edge, and inset drops the whole shell to a grey layer zero with the content raised above it.",
        Demo: SidebarPlacementDemo,
        layout: "wide",
      },
      {
        name: "Edge",
        description:
          "How the boundary reads is its own axis. A line is the flush hairline, faded dissolves the rule at both ends so it never hard-stops, and none hands the edge to the surfaces either side. Floating and inset panels ignore it — they already carry a ring.",
        Demo: SidebarEdgeDemo,
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
    code: `import { BellIcon, BoxIcon, SearchIcon } from "lucide-react"

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
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="h-8 w-40 pl-8"
            />
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <BellIcon />
          </Button>
          <Button size="sm">Sign in</Button>
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
      "A comprehensive dark footer with link columns, a newsletter, social links, and legal.",
    category: "Navigation",
    Demo: SiteFooterDemo,
    code: `import { ArrowRightIcon, BoxIcon } from "lucide-react"

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
                <XIcon />
              </SiteFooterSocialLink>
              <SiteFooterSocialLink href="#" aria-label="LinkedIn">
                <LinkedInIcon />
              </SiteFooterSocialLink>
              <SiteFooterSocialLink href="#" aria-label="YouTube">
                <YouTubeIcon />
              </SiteFooterSocialLink>
              <SiteFooterSocialLink href="#" aria-label="GitHub">
                <GitHubIcon />
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
