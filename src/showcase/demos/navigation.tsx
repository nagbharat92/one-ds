import { useState } from "react"
import {
  HomeIcon,
  InboxIcon,
  CalendarIcon,
  SettingsIcon,
  SlashIcon,
  MusicIcon,
  ImageIcon,
  VideoIcon,
  FileTextIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
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
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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

function InteractiveSidebarDemo() {
  const [activeItem, setActiveItem] = useState("Home")
  const items = [
    { label: "Home", icon: HomeIcon },
    { label: "Inbox", icon: InboxIcon },
    { label: "Calendar", icon: CalendarIcon },
    { label: "Settings", icon: SettingsIcon },
  ]
  return (
    <div className="showcase-contained-viewport h-80 w-full overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen className="min-h-full">
        <Sidebar collapsible="offcanvas" className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map(({ label, icon: Icon }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        isActive={activeItem === label}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveItem(label)
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
        </Sidebar>
        <SidebarInset className="min-h-full">
          <div className="flex items-center gap-2 border-b p-3">
            <SidebarTrigger />
            <span className="text-sm font-medium">{activeItem}</span>
          </div>
          <div className="text-muted-foreground p-4 text-sm">
            Viewing {activeItem}. Use the trigger to collapse or expand the sidebar.
          </div>
        </SidebarInset>
      </SidebarProvider>
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
        name: "Custom separator",
        description: "Use a custom icon as the separator between items.",
        Demo: () => (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                  Components
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ),
      },
      {
        name: "Dropdown",
        description:
          "A breadcrumb item that opens a dropdown menu for hidden levels.",
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
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                    >
                      Documentation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                    >
                      Themes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                    >
                      GitHub
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
      {
        name: "Link component",
        description:
          "Use the asChild prop to render a custom link element inside a breadcrumb.",
        Demo: () => (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Home
                  </a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Components
                  </a>
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
    ],
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    description: "A composable, themeable and customizable application sidebar.",
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
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function SidebarDemo() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Home</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  )
}`,
  },
]
