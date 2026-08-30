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

const tags = Array.from({ length: 12 }).map((_, i) => `v1.2.0-beta.${12 - i}`)

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
        <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-2">
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
      <div className="flex items-center justify-between rounded-md border px-4 py-2">
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
              <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-2">
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
                  <ChevronRightIcon className={`size-3.5 text-muted-foreground transition-transform ${srcOpen ? "rotate-90" : ""}`} />
                  {srcOpen ? <FolderOpenIcon className="size-4 text-muted-foreground" /> : <FolderIcon className="size-4 text-muted-foreground" />}
                  <span>src</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 border-l pl-2">
                  <Collapsible open={compOpen} onOpenChange={setCompOpen}>
                    <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-muted">
                      <ChevronRightIcon className={`size-3.5 text-muted-foreground transition-transform ${compOpen ? "rotate-90" : ""}`} />
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
            <ScrollArea className="w-full max-w-lg whitespace-nowrap rounded-md border">
              <div className="flex gap-4 p-4">
                {artworks.map((work) => (
                  <div key={work.title} className="w-36 shrink-0">
                    <div className="aspect-square rounded-md bg-muted" />
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
]
