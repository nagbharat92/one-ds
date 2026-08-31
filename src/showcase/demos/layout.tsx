import { useState } from "react"
import {
  ChevronsUpDownIcon,
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  WifiIcon,
  BellIcon,
  MoonIcon,
  GlobeIcon,
  LinkIcon,
  SettingsIcon,
  UserIcon,
  HomeIcon,
  BookmarkIcon,
  MailIcon,
  ShieldIcon,
  KeyIcon,
  PlusIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  RocketIcon,
  ListIcon,
  LayoutGridIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Container } from "@/components/ui/container"
import { Page, PageContent, PageScroll } from "@/components/ui/page"
import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/ui/page-header"
import {
  Section,
  SectionActions,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
} from "@/components/ui/toolbar"

const tags = Array.from({ length: 12 }).map((_, i) => `v1.2.0-beta.${12 - i}`)

function ClusterWrappingDemo() {
  return (
    <Cluster
      gap="sm"
      className="w-full max-w-md rounded-lg border border-dashed p-3"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="flex h-14 min-w-28 flex-1 items-center justify-center rounded-md bg-muted text-sm font-medium"
        >
          Item {index + 1}
        </div>
      ))}
    </Cluster>
  )
}

function ClusterAlignmentDemo() {
  return (
    <Cluster
      gap="sm"
      align="center"
      className="h-32 w-full max-w-md rounded-lg border border-dashed p-3"
    >
      <div className="flex h-12 w-24 items-center justify-center rounded-md bg-muted text-sm font-medium">
        Short
      </div>
      <div className="flex h-24 w-24 items-center justify-center rounded-md bg-muted text-sm font-medium">
        Tall
      </div>
      <div className="flex h-16 w-24 items-center justify-center rounded-md bg-muted text-sm font-medium">
        Medium
      </div>
    </Cluster>
  )
}

function ClusterDistributionDemo() {
  return (
    <Stack gap="md" className="w-full max-w-md">
      {(["start", "center", "between"] as const).map((justify) => (
        <div key={justify} className="space-y-2">
          <p className="text-sm font-medium">
            {justify === "between"
              ? "Space between"
              : justify === "center"
                ? "Center"
                : "Start"}
          </p>
          <Cluster
            gap="sm"
            justify={justify}
            wrap={false}
            className="rounded-lg border border-dashed p-2"
          >
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className="grid size-8 place-items-center rounded-sm bg-muted text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </Cluster>
        </div>
      ))}
    </Stack>
  )
}

function PageDemo() {
  return (
    <div className="showcase-contained-viewport flex h-96 w-full flex-col overflow-hidden rounded-lg border">
      <Page>
        <PageScroll strength={0.1}>
          <PageContent variant="docs">
            <PageHeader>
              <PageHeaderContent>
                <PageHeaderEyebrow>
                  <RocketIcon />
                  Documentation
                </PageHeaderEyebrow>
                <PageHeaderTitle>Getting started</PageHeaderTitle>
                <PageHeaderDescription>
                  Scroll this panel to feel the lazy inertial motion and the
                  top and bottom fade. Content also eases in on load.
                </PageHeaderDescription>
              </PageHeaderContent>
            </PageHeader>
            {Array.from({ length: 6 }).map((_, index) => (
              <Section key={index}>
                <SectionHeader>
                  <SectionHeading>
                    <SectionTitle>Section {index + 1}</SectionTitle>
                    <SectionDescription>
                      A titled region inside the page content column.
                    </SectionDescription>
                  </SectionHeading>
                </SectionHeader>
                <SectionContent>
                  <Card>
                    <CardContent className="text-sm text-muted-foreground">
                      The page owns the scroll region, its fade, the scrollbar,
                      the responsive gutters, and the bottom padding.
                    </CardContent>
                  </Card>
                </SectionContent>
              </Section>
            ))}
          </PageContent>
        </PageScroll>
      </Page>
    </div>
  )
}

export const layoutDemos: ComponentEntry[] = [
  {
    slug: "accordion",
    name: "Accordion",
    description: "A stacked set of interactive headings that reveal content.",
    category: "Layout",
    Demo: () => (
      <Accordion type="single" collapsible className="w-full max-w-md">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that match the other components.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
    examples: [
      {
        name: "Multiple",
        description: "Multiple items can be open at the same time.",
        Demo: () => (
          <Accordion type="multiple" className="w-full max-w-md">
            <AccordionItem value="multi-1">
              <AccordionTrigger>First section</AccordionTrigger>
              <AccordionContent>
                This section can stay open while you expand others.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-2">
              <AccordionTrigger>Second section</AccordionTrigger>
              <AccordionContent>
                Open both sections at once to compare content side by side.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-3">
              <AccordionTrigger>Third section</AccordionTrigger>
              <AccordionContent>
                All three can be expanded simultaneously.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Disabled",
        description: "Individual items can be disabled to prevent interaction.",
        Demo: () => (
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="dis-1">
              <AccordionTrigger>Available item</AccordionTrigger>
              <AccordionContent>
                This item works normally and can be expanded.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dis-2" disabled>
              <AccordionTrigger>Disabled item</AccordionTrigger>
              <AccordionContent>
                You should not be able to see this.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dis-3">
              <AccordionTrigger>Another available item</AccordionTrigger>
              <AccordionContent>
                This item also works normally.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Borders",
        description: "Accordion items with a surrounding card border.",
        Demo: () => (
          <Accordion type="single" collapsible className="w-full max-w-md rounded-lg border">
            <AccordionItem value="brd-1" className="border-b-0 px-4">
              <AccordionTrigger>Account settings</AccordionTrigger>
              <AccordionContent>
                Manage your username, email, and profile picture.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brd-2" className="border-b-0 px-4">
              <AccordionTrigger>Notifications</AccordionTrigger>
              <AccordionContent>
                Choose which notifications you want to receive.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brd-3" className="border-b-0 px-4">
              <AccordionTrigger>Privacy</AccordionTrigger>
              <AccordionContent>
                Control who can see your profile and activity.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Card",
        description: "Each accordion item rendered inside its own card.",
        Demo: () => (
          <div className="flex w-full max-w-md flex-col gap-3">
            <Accordion type="single" collapsible>
              <Card>
                <AccordionItem value="card-1" className="border-b-0">
                  <CardContent className="p-0">
                    <AccordionTrigger className="px-4">What is your refund policy?</AccordionTrigger>
                    <AccordionContent className="px-4">
                      We offer a 30-day money-back guarantee on all plans.
                    </AccordionContent>
                  </CardContent>
                </AccordionItem>
              </Card>
            </Accordion>
            <Accordion type="single" collapsible>
              <Card>
                <AccordionItem value="card-2" className="border-b-0">
                  <CardContent className="p-0">
                    <AccordionTrigger className="px-4">Can I change plans later?</AccordionTrigger>
                    <AccordionContent className="px-4">
                      Yes, you can upgrade or downgrade at any time.
                    </AccordionContent>
                  </CardContent>
                </AccordionItem>
              </Card>
            </Accordion>
            <Accordion type="single" collapsible>
              <Card>
                <AccordionItem value="card-3" className="border-b-0">
                  <CardContent className="p-0">
                    <AccordionTrigger className="px-4">Do you offer support?</AccordionTrigger>
                    <AccordionContent className="px-4">
                      Yes, we provide 24/7 email and chat support.
                    </AccordionContent>
                  </CardContent>
                </AccordionItem>
              </Card>
            </Accordion>
          </div>
        ),
      },
    ],
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    description: "An interactive component that expands and collapses content.",
    category: "Layout",
    Demo: () => (
      <Collapsible className="w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between gap-4 rounded-md border py-2 ps-4 pe-2">
          <span className="text-sm font-medium">@peduarte starred 3 repositories</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDownIcon />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/react</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@shadcn/ui</div>
        </CollapsibleContent>
      </Collapsible>
    ),
    code: `import { ChevronsUpDownIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export function CollapsibleDemo() {
  return (
    <Collapsible className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between rounded-md border py-2 ps-4 pe-2">
        <span className="text-sm font-medium">@peduarte starred 3 repositories</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>@shadcn/ui</CollapsibleContent>
    </Collapsible>
  )
}`,
    examples: [
      {
        name: "Settings Panel",
        description: "A collapsible settings panel with interactive controls.",
        Demo: function SettingsPanel() {
          const [wifiOn, setWifiOn] = useState(true)
          const [notifs, setNotifs] = useState(false)
          const [darkMode, setDarkMode] = useState(false)
          return (
            <Collapsible defaultOpen className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between gap-4 rounded-md border py-2 ps-4 pe-2">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Quick settings</span>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDownIcon />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-3 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WifiIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="settings-wifi" className="text-sm">Wi-Fi</Label>
                  </div>
                  <Switch id="settings-wifi" checked={wifiOn} onCheckedChange={setWifiOn} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="settings-notifs" className="text-sm">Notifications</Label>
                  </div>
                  <Switch id="settings-notifs" checked={notifs} onCheckedChange={setNotifs} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MoonIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="settings-dark" className="text-sm">Dark mode</Label>
                  </div>
                  <Switch id="settings-dark" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        },
      },
      {
        name: "File Tree",
        description: "A nested collapsible file tree with expandable folders.",
        Demo: function FileTree() {
          const [srcOpen, setSrcOpen] = useState(true)
          const [compOpen, setCompOpen] = useState(false)
          return (
            <div className="w-full max-w-xs rounded-md border p-2">
              <Collapsible open={srcOpen} onOpenChange={setSrcOpen}>
                <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-muted">
                  <ChevronRightIcon className={`size-3.5 text-muted-foreground transition-transform duration-(--speed-swift) ease-(--ease-glide) ${srcOpen ? "rotate-90" : ""}`} />
                  {srcOpen ? <FolderOpenIcon className="size-4 text-muted-foreground" /> : <FolderIcon className="size-4 text-muted-foreground" />}
                  <span>src</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 border-l pl-2">
                  <Collapsible open={compOpen} onOpenChange={setCompOpen}>
                    <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-muted">
                      <ChevronRightIcon className={`size-3.5 text-muted-foreground transition-transform duration-(--speed-swift) ease-(--ease-glide) ${compOpen ? "rotate-90" : ""}`} />
                      {compOpen ? <FolderOpenIcon className="size-4 text-muted-foreground" /> : <FolderIcon className="size-4 text-muted-foreground" />}
                      <span>components</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 border-l pl-2">
                      <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                        <FileIcon className="size-4 text-muted-foreground" />
                        <span>button.tsx</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                        <FileIcon className="size-4 text-muted-foreground" />
                        <span>card.tsx</span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                    <FileIcon className="size-4 text-muted-foreground" />
                    <span>App.tsx</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                    <FileIcon className="size-4 text-muted-foreground" />
                    <span>main.tsx</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )
        },
      },
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    description: "Visually or semantically separates content.",
    category: "Layout",
    Demo: () => (
      <div className="max-w-sm">
        <div className="space-y-1">
          <h4 className="text-sm leading-none font-medium">OneDS UI</h4>
          <p className="text-muted-foreground text-sm">A component showcase.</p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center gap-4 text-sm">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Components</span>
          <Separator orientation="vertical" />
          <span>Themes</span>
        </div>
      </div>
    ),
    code: `import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div>
      <h4 className="text-sm leading-none font-medium">OneDS UI</h4>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
      </div>
    </div>
  )
}`,
    examples: [
      {
        name: "Menu",
        description: "Separator used to group actions in a menu-like layout.",
        Demo: function SeparatorMenu() {
          const [selected, setSelected] = useState("profile")
          const menuItems = [
            { id: "profile", icon: UserIcon, label: "Profile" },
            { id: "settings", icon: SettingsIcon, label: "Settings" },
          ]
          const menuItems2 = [
            { id: "home", icon: HomeIcon, label: "Home" },
            { id: "bookmarks", icon: BookmarkIcon, label: "Bookmarks" },
            { id: "mail", icon: MailIcon, label: "Mail" },
          ]
          return (
            <div className="w-full max-w-xs rounded-lg border p-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${selected === item.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ))}
              <Separator className="my-1" />
              {menuItems2.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${selected === item.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ))}
              <Separator className="my-1" />
              <button
                type="button"
                onClick={() => setSelected("logout")}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${selected === "logout" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
              >
                <KeyIcon className="size-4" />
                Log out
              </button>
            </div>
          )
        },
      },
      {
        name: "List",
        description: "Separator dividing items in a content list.",
        Demo: () => {
          const items = [
            { icon: GlobeIcon, title: "Public access", desc: "Anyone with the link can view" },
            { icon: ShieldIcon, title: "Private", desc: "Only invited members can access" },
            { icon: LinkIcon, title: "Shared link", desc: "Generate a shareable link" },
          ]
          return (
            <div className="w-full max-w-sm rounded-lg border">
              {items.map((item, i) => (
                <div key={item.title}>
                  {i > 0 && <Separator />}
                  <div className="flex items-start gap-3 p-4">
                    <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        },
      },
    ],
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    description: "Augments native scroll with custom, cross-browser styling.",
    category: "Layout",
    Demo: () => (
      <ScrollArea className="h-72 w-full max-w-60 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <div key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}`,
    examples: [
      {
        name: "Horizontal",
        description: "A horizontally scrolling area with artwork items.",
        Demo: () => {
          const artworks = [
            { title: "Starry Night", artist: "Vincent van Gogh" },
            { title: "The Persistence of Memory", artist: "Salvador Dali" },
            { title: "Girl with a Pearl Earring", artist: "Johannes Vermeer" },
            { title: "Water Lilies", artist: "Claude Monet" },
            { title: "The Great Wave", artist: "Katsushika Hokusai" },
            { title: "Guernica", artist: "Pablo Picasso" },
            { title: "The Birth of Venus", artist: "Sandro Botticelli" },
          ]
          return (
            <ScrollArea axis="x" className="w-full max-w-lg whitespace-nowrap rounded-md border">
              <div className="flex gap-4 p-4">
                {artworks.map((work) => (
                  <div key={work.title} className="w-36 shrink-0">
                    <AspectRatio ratio="square" className="rounded-md bg-muted" />
                    <p className="mt-2 truncate text-sm font-medium">{work.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{work.artist}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )
        },
      },
    ],
  },
  {
    slug: "resizable",
    name: "Resizable",
    description: "Accessible resizable panel groups and layouts.",
    category: "Layout",
    Demo: () => (
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-55 w-full max-w-md rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableDemo() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={50}>One</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}`,
  },
  {
    slug: "page-header",
    name: "Page Header",
    description:
      "A page-level header with an eyebrow, title, description, and actions.",
    category: "Layout",
    Demo: () => (
      <PageHeader className="w-full">
        <PageHeaderContent>
          <PageHeaderEyebrow>
            <RocketIcon />
            Projects
          </PageHeaderEyebrow>
          <PageHeaderTitle>Dashboard</PageHeaderTitle>
          <PageHeaderDescription>
            Monitor activity across your workspace and jump back into recent
            work.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button variant="outline">
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
          <Button>
            <PlusIcon data-icon="inline-start" />
            New project
          </Button>
        </PageHeaderActions>
      </PageHeader>
    ),
    code: `import { DownloadIcon, PlusIcon, RocketIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/ui/page-header"

export function PageHeaderDemo() {
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageHeaderEyebrow>
          <RocketIcon />
          Projects
        </PageHeaderEyebrow>
        <PageHeaderTitle>Dashboard</PageHeaderTitle>
        <PageHeaderDescription>
          Monitor activity across your workspace and jump back into recent work.
        </PageHeaderDescription>
      </PageHeaderContent>
      <PageHeaderActions>
        <Button variant="outline">
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button>
          <PlusIcon data-icon="inline-start" />
          New project
        </Button>
      </PageHeaderActions>
    </PageHeader>
  )
}`,
    examples: [
      {
        name: "Centered",
        description: "A centered hero variant for landing and marketing pages.",
        Demo: () => (
          <PageHeader variant="centered" className="w-full">
            <PageHeaderContent>
              <PageHeaderEyebrow>Introducing OneDS</PageHeaderEyebrow>
              <PageHeaderTitle>Build any page from blocks</PageHeaderTitle>
              <PageHeaderDescription>
                A tokenized set of composable layout primitives that keep every
                page consistent.
              </PageHeaderDescription>
            </PageHeaderContent>
            <PageHeaderActions>
              <Button>Get started</Button>
              <Button variant="outline">View components</Button>
            </PageHeaderActions>
          </PageHeader>
        ),
      },
    ],
  },
  {
    slug: "section",
    name: "Section",
    description:
      "A titled content region with an optional description and actions.",
    category: "Layout",
    Demo: () => (
      <Section className="w-full">
        <SectionHeader>
          <SectionHeading>
            <SectionTitle>Team members</SectionTitle>
            <SectionDescription>
              People with access to this workspace.
            </SectionDescription>
          </SectionHeading>
          <SectionActions>
            <Button variant="outline" size="sm">
              <PlusIcon data-icon="inline-start" />
              Invite
            </Button>
          </SectionActions>
        </SectionHeader>
        <SectionContent>
          <Card>
            <CardContent className="text-muted-foreground text-sm">
              Section content goes here.
            </CardContent>
          </Card>
        </SectionContent>
      </Section>
    ),
    code: `import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Section,
  SectionActions,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"

export function SectionDemo() {
  return (
    <Section>
      <SectionHeader>
        <SectionHeading>
          <SectionTitle>Team members</SectionTitle>
          <SectionDescription>
            People with access to this workspace.
          </SectionDescription>
        </SectionHeading>
        <SectionActions>
          <Button variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            Invite
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <Card>
          <CardContent>Section content goes here.</CardContent>
        </Card>
      </SectionContent>
    </Section>
  )
}`,
  },
  {
    slug: "container",
    name: "Container",
    description:
      "A centered, max-width page wrapper with responsive gutters and size variants.",
    category: "Layout",
    Demo: () => (
      <div className="w-full space-y-3">
        {(["prose", "md", "lg", "xl"] as const).map((size) => (
          <Container
            key={size}
            size={size}
            gutter={false}
            className="rounded-lg border bg-card p-3 text-center text-sm text-muted-foreground"
          >
            size=&quot;{size}&quot;
          </Container>
        ))}
      </div>
    ),
    code: `import { Container } from "@/components/ui/container"

export function ContainerDemo() {
  return (
    <Container size="lg">
      <p>Centered content constrained to a max width with responsive gutters.</p>
    </Container>
  )
}`,
  },
  {
    slug: "stack",
    name: "Stack",
    description: "A vertical layout primitive with tokenized gap and alignment.",
    category: "Layout",
    Demo: () => (
      <Stack gap="md" className="w-full max-w-sm">
        <Card>
          <CardContent className="text-sm">First</CardContent>
        </Card>
        <Card>
          <CardContent className="text-sm">Second</CardContent>
        </Card>
        <Card>
          <CardContent className="text-sm">Third</CardContent>
        </Card>
      </Stack>
    ),
    code: `import { Stack } from "@/components/ui/stack"

export function StackDemo() {
  return (
    <Stack gap="md">
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
    </Stack>
  )
}`,
  },
  {
    slug: "cluster",
    name: "Cluster",
    description:
      "Arrange items in a horizontal row that can wrap, align, and distribute its children.",
    category: "Layout",
    Demo: ClusterWrappingDemo,
    code: `import { Cluster } from "@/components/ui/cluster"

export function ClusterDemo() {
  return (
    <Cluster gap="sm" className="max-w-md rounded-lg border border-dashed p-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="flex h-14 min-w-28 flex-1 items-center justify-center rounded-md bg-muted"
        >
          Item {index + 1}
        </div>
      ))}
    </Cluster>
  )
}`,
    examples: [
      {
        name: "Alignment",
        description:
          "Items with different heights share the same vertical center line.",
        Demo: ClusterAlignmentDemo,
      },
      {
        name: "Distribution",
        description:
          "Compare start, center, and space-between distribution across the available width.",
        Demo: ClusterDistributionDemo,
      },
    ],
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description:
      "A horizontal action bar for filters, search, and view toggles.",
    category: "Layout",
    Demo: () => (
      <Toolbar className="w-full">
        <ToolbarGroup>
          <Button variant="outline" size="sm">
            <FilterIcon data-icon="inline-start" />
            Filter
          </Button>
          <Button variant="ghost" size="sm">
            <SearchIcon data-icon="inline-start" />
            Search
          </Button>
        </ToolbarGroup>
        <ToolbarSpacer />
        <ToolbarGroup>
          <Button variant="ghost" size="icon-sm" aria-label="List view">
            <ListIcon />
          </Button>
          <ToolbarSeparator />
          <Button variant="ghost" size="icon-sm" aria-label="Grid view">
            <LayoutGridIcon />
          </Button>
        </ToolbarGroup>
      </Toolbar>
    ),
    code: `import { FilterIcon, LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
} from "@/components/ui/toolbar"

export function ToolbarDemo() {
  return (
    <Toolbar>
      <ToolbarGroup>
        <Button variant="outline" size="sm">
          <FilterIcon data-icon="inline-start" />
          Filter
        </Button>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup>
        <Button variant="ghost" size="icon-sm" aria-label="List view">
          <ListIcon />
        </Button>
        <ToolbarSeparator />
        <Button variant="ghost" size="icon-sm" aria-label="Grid view">
          <LayoutGridIcon />
        </Button>
      </ToolbarGroup>
    </Toolbar>
  )
}`,
  },
  {
    slug: "page",
    name: "Page",
    description:
      "A page shell that owns the scroll region: lazy inertial scroll, edge fades, scrollbar, gutters, and content entrance.",
    category: "Layout",
    Demo: PageDemo,
    code: `import { Page, PageContent, PageScroll } from "@/components/ui/page"
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header"
import { Section, SectionContent, SectionTitle } from "@/components/ui/section"

export function PageDemo() {
  return (
    <Page>
      {/* strength controls the lazy-scroll lag (lower = laggier) */}
      <PageScroll strength={0.1} scrollbar="thin" fade>
        <PageContent variant="docs">
          <PageHeader>
            <PageHeaderContent>
              <PageHeaderTitle>Getting started</PageHeaderTitle>
              <PageHeaderDescription>
                Scroll to feel the lazy motion and edge fades.
              </PageHeaderDescription>
            </PageHeaderContent>
          </PageHeader>
          <Section>
            <SectionTitle>Section</SectionTitle>
            <SectionContent>Content goes here.</SectionContent>
          </Section>
        </PageContent>
      </PageScroll>
    </Page>
  )
}`,
  },
]
