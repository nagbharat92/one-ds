import { MoreHorizontalIcon } from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Elevation, elevationVariants } from "@/components/ui/elevation"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

function NestedElevationDemo() {
  return (
    <Elevation level="raised" asChild>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Nested interaction</CardTitle>
          <CardDescription>
            Hover the selected row, then hover or open its More action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Item variant="muted" size="xs" className="flex-nowrap">
            <ItemContent>
              <ItemTitle>
                OneDS navigation review decisions and implementation follow-up
              </ItemTitle>
            </ItemContent>
            <ItemActions hosted>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Item actions">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        </CardContent>
      </Card>
    </Elevation>
  )
}

function ElevationScaleDemo() {
  const levels = [
    {
      level: "flat" as const,
      title: "Flat",
      description: "Ground and backplates establish grouping without depth.",
    },
    {
      level: "raised" as const,
      title: "Raised",
      description: "Controls and cards lift above a backplate or canvas.",
    },
    {
      level: "floating" as const,
      title: "Floating",
      description: "Transient surfaces sit outside the normal content flow.",
    },
  ]

  return (
    <div className="grid w-full max-w-md gap-6">
      {levels.map(({ level, title, description }) => (
        <Elevation key={level} level={level} asChild>
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit">{title}</Badge>
              <CardTitle>{title} surface</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        </Elevation>
      ))}
    </div>
  )
}

function StateLayersDemo() {
  const states = [
    {
      name: "Hover",
      value: "8%",
      layer: "bg-(--state-layer-hover)",
      description: "Pointer is over the control.",
    },
    {
      name: "Focus",
      value: "10%",
      layer: "bg-(--state-layer-focus)",
      description: "Keyboard or voice focus is active.",
    },
    {
      name: "Pressed",
      value: "10%",
      layer: "bg-(--state-layer-pressed)",
      description: "The control is being activated.",
    },
    {
      name: "Dragged",
      value: "16%",
      layer: "bg-(--state-layer-dragged)",
      description: "The component is moving with input.",
    },
  ]

  return (
    <div className="grid w-full max-w-md gap-2">
      {states.map(({ name, value, layer, description }) => (
        <Item key={name} variant="outline">
          <ItemContent>
            <ItemTitle>{name}</ItemTitle>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="ghost"
              className={layer}
              aria-label={`${name} state layer ${value}`}
            >
              {value}
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}

function RaisedWithFloatingChildDemo() {
  return (
    <Elevation level="raised" asChild>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Raised workspace card</CardTitle>
          <CardDescription>
            The card is raised; its popover leaves flow and floats above it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open floating details</Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className={elevationVariants({ level: "floating" })}
            >
              <PopoverHeader>
                <PopoverTitle>Floating child</PopoverTitle>
                <PopoverDescription>
                  This surface is one elevation role above its raised parent.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </Elevation>
  )
}

function FloatingElevationDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className={elevationVariants({ level: "floating" })}>
          <PopoverHeader>
            <PopoverTitle>Floating surface</PopoverTitle>
            <PopoverDescription>
              Popovers leave content flow and use floating elevation.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={elevationVariants({ level: "floating" })}
        >
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function ModalElevationDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open modal layer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal relationship</DialogTitle>
          <DialogDescription>
            The scrim separates the modal layer from the application beneath it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">More actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={elevationVariants({ level: "floating" })}
            >
              <DropdownMenuItem>Save draft</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const elevationDemos: ComponentEntry[] = [
  {
    slug: "elevation",
    name: "Elevation",
    description:
      "Spatial elevation and interaction state layers for ground, raised, floating and modal relationships.",
    category: "Utilities",
    installCommand: null,
    Demo: NestedElevationDemo,
    code: `import { Elevation } from "@/components/ui/elevation"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"

export function NestedElevationDemo() {
  return (
    <Elevation level="raised" asChild>
      <Card>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Selected row</ItemTitle>
          </ItemContent>
          <ItemActions hosted>{/* Raised action */}</ItemActions>
        </Item>
      </Card>
    </Elevation>
  )
}`,
    examples: [
      {
        name: "State Layers",
        description:
          "Theme-aware foreground overlays communicate interaction without implying physical lift.",
        layout: "wide",
        Demo: StateLayersDemo,
      },
      {
        name: "Scale",
        description:
          "Flat, raised and floating are spatial roles, separate from interaction state.",
        layout: "wide",
        Demo: ElevationScaleDemo,
      },
      {
        name: "Floating Surfaces",
        description: "Menus and popovers use floating elevation outside content flow.",
        Demo: FloatingElevationDemo,
      },
      {
        name: "Floating Child on Raised Parent",
        description:
          "A floating child remains visually above the raised component that opened it.",
        Demo: RaisedWithFloatingChildDemo,
      },
      {
        name: "Modal Layer",
        description:
          "Dialogs combine a scrim with modal depth and can host another floating surface.",
        Demo: ModalElevationDemo,
      },
    ],
  },
]
