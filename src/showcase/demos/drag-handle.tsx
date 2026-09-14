import type { ComponentEntry } from "@/showcase/types"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

function DrawerGrabberDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {(["top", "right", "bottom", "left"] as const).map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="secondary" className="capitalize">
              {direction} drawer
            </Button>
          </DrawerTrigger>
          <DrawerContent grabber="always">
            <DrawerHeader>
              <DrawerTitle className="capitalize">
                {direction} drawer
              </DrawerTitle>
              <DrawerDescription>
                Drag the handle toward the {direction} edge to dismiss.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}

function PanelGripDemo() {
  return (
    <div className="h-80 w-full max-w-2xl shrink-0">
      <ResizablePanelGroup
        orientation="horizontal"
        className="rounded-(--card-radius) ring-1 ring-(--card-stroke) bg-card"
      >
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize sidebar panel" />
        <ResizablePanel defaultSize={60} minSize={30}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={45} minSize={20}>
              <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
                Header
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize content panels" />
            <ResizablePanel defaultSize={55} minSize={30}>
              <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
                Content
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function SidebarGripDemo() {
  return (
    <div className="h-80 w-full max-w-2xl shrink-0">
      <ResizablePanelGroup
        orientation="horizontal"
        className="rounded-(--card-radius) ring-1 ring-(--card-stroke) bg-card"
      >
        <ResizablePanel defaultSize={35} minSize={20}>
          <div className="flex h-full flex-col justify-between bg-muted p-4">
            <span className="text-sm font-semibold">Navigation sidebar</span>
            <span className="text-sm text-muted-foreground">
              Drag this edge.
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          aria-label="Resize navigation sidebar"
        />
        <ResizablePanel defaultSize={65} minSize={30}>
          <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
            Resizable page content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export const dragHandleDemos: ComponentEntry[] = [
  {
    slug: "drag-handle",
    name: "Drag Handle",
    description:
      "Interactive drag affordances for drawers, panel separators, and resizable sidebar edges.",
    category: "Utilities",
    Demo: PanelGripDemo,
    code: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

<ResizablePanelGroup orientation="horizontal" className="rounded-(--card-radius) ring-1 ring-(--card-stroke) bg-card">
  <ResizablePanel defaultSize={40}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={60}>Content</ResizablePanel>
</ResizablePanelGroup>`,
    examples: [
      {
        name: "Grabber · Drawers",
        description:
          "Used on drawers for direct drag-to-dismiss. Open any edge: top and bottom use a horizontal grabber; left and right use a vertical grabber.",
        Demo: DrawerGrabberDemo,
        layout: "wide",
      },
      {
        name: "Grip · Resizable panels",
        description:
          "Used inside resizable panel separators. Move within the edge threshold to enlarge the grip, then drag it or focus it and use the arrow keys.",
        Demo: PanelGripDemo,
        layout: "wide",
      },
      {
        name: "Grip · Sidebars",
        description:
          "Used by SidebarResizeHandle at the center of a resizable sidebar edge. Move near the edge to reveal the grip, then drag it or focus it and use the arrow keys.",
        Demo: SidebarGripDemo,
        layout: "wide",
      },
    ],
  },
]
