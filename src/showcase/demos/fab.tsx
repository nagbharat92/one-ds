import {
  ImageIcon,
  MicIcon,
  PencilIcon,
  PlusIcon,
  ShareIcon,
  VideoIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Fab } from "@/components/ui/fab"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="showcase-contained-viewport relative h-64 w-full overflow-hidden rounded-lg border bg-muted/40">
      {children}
    </div>
  )
}

function FabDefaultDemo() {
  return (
    <Fab variant="primary" aria-label="New task">
      <PlusIcon />
    </Fab>
  )
}

function FabSizesDemo() {
  return (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <Fab size="md" aria-label="New task, medium">
          <PlusIcon />
        </Fab>
        <span className="text-xs text-muted-foreground">md · default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Fab size="lg" aria-label="New task, large">
          <PlusIcon />
        </Fab>
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  )
}

function FabVariantsDemo() {
  return (
    <div className="flex items-end gap-6">
      {(["primary", "secondary", "tertiary"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Fab variant={variant} aria-label={`Compose, ${variant}`}>
            <PencilIcon />
          </Fab>
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  )
}

function FabExtendedDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Fab extended variant="primary">
        <PlusIcon />
        New task
      </Fab>
      <Fab extended variant="secondary">
        Save draft
      </Fab>
      <Fab extended size="lg" variant="tertiary">
        <PencilIcon />
        Compose
      </Fab>
    </div>
  )
}

function FabPlacementDemo() {
  return (
    <Stage>
      <div className="p-4 text-sm text-muted-foreground">
        Placement is owned by the component. Compact windows put the FAB on the
        bottom trailing edge; the inset widens from 16px to 24px once the window
        is expanded.
      </div>
      <Fab placement="bottom-end" aria-label="New task, bottom end">
        <PlusIcon />
      </Fab>
    </Stage>
  )
}

function FabMenuDemo() {
  return (
    <Stage>
      <div className="p-4 text-sm text-muted-foreground">
        Material specifies a bespoke FAB menu on mobile, but says the web should
        use a normal menu. So this is the FAB plus the existing dropdown, not a
        second menu system.
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Fab placement="bottom-end" aria-label="Create" tooltip="Create">
            <PlusIcon />
          </Fab>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top">
          <DropdownMenuItem>
            <ImageIcon />
            Photo
          </DropdownMenuItem>
          <DropdownMenuItem>
            <VideoIcon />
            Video
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MicIcon />
            Audio
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Stage>
  )
}

export const fabDemos: ComponentEntry[] = [
  {
    slug: "fab",
    name: "FABs",
    codeSource: "complete",
    description:
      "A floating action button for the one primary, constructive action on an app surface. Never use it for navigation, overflow or destructive actions — those belong in a toolbar or menu.",
    category: "Forms",
    installCommand: null,
    Demo: FabDefaultDemo,
    code: `import { PlusIcon } from "lucide-react"

import { Fab } from "@/components/ui/fab"

export function FabDefaultDemo() {
  return (
    <Fab variant="primary" aria-label="New task">
      <PlusIcon />
    </Fab>
  )
}`,
    examples: [
      {
        name: "Sizes",
        description:
          "Two sizes, both comfortably above the 48px touch target. Material's small FAB is deliberately absent — it is no longer recommended.",
        Demo: FabSizesDemo,
      },
      {
        name: "Variants",
        description:
          "Primary uses the pink palette for a prominent CTA. Secondary uses light purple; Tertiary is the warm-neutral default. FABs have softer corners and no shadows.",
        Demo: FabVariantsDemo,
      },
      {
        name: "Extended",
        description:
          "An extended FAB adds a label where an icon alone would be ambiguous. The label is required and the icon optional — never the reverse. Keep it to one or two words; the container hugs its content and will not wrap or truncate.",
        Demo: FabExtendedDemo,
      },
      {
        name: "Placement",
        description:
          "Setting placement makes the component own its position and margins, so no call site re-authors them. Leave it off and the FAB is an inline control.",
        Demo: FabPlacementDemo,
        layout: "wide",
      },
      {
        name: "Opening a Menu",
        description:
          "When one action is not enough, the FAB opens the ordinary dropdown rather than a separate speed dial. Two to six closely related actions; if they are unrelated they do not belong behind one button.",
        Demo: FabMenuDemo,
        layout: "wide",
      },
    ],
  },
]
