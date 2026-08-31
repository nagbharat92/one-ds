import type { ReactNode } from "react"

import type { ComponentEntry } from "@/showcase/types"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ColorTokenRow {
  token: string
  utility: string
  role: string
  preview: ReactNode
}

function TokenSample({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div className="inline-flex rounded-xl bg-muted p-1">
      <div
        aria-hidden="true"
        className={cn(
          "flex size-10 items-center justify-center rounded-lg border text-xs font-semibold",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

function ColorTokenTable({
  caption,
  rows,
}: {
  caption: string
  rows: ColorTokenRow[]
}) {
  return (
    <Table>
      <TableCaption className="caption-top mt-0 mb-4 text-left">
        {caption}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Preview</TableHead>
          <TableHead>Token and utility</TableHead>
          <TableHead>Use for</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.token}:${row.utility}`}>
            <TableCell>{row.preview}</TableCell>
            <TableCell className="min-w-56 whitespace-normal">
              <span className="block font-mono text-xs">{row.token}</span>
              <span className="mt-1 block font-mono text-xs text-muted-foreground">
                {row.utility}
              </span>
            </TableCell>
            <TableCell className="min-w-56 whitespace-normal text-muted-foreground">
              {row.role}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const semanticColorRows: ColorTokenRow[] = [
  {
    token: "--surface-ground / --background / --foreground",
    utility: "bg-background / text-foreground",
    role: "The warm structural ground, application canvas, and default text.",
    preview: <TokenSample className="bg-background text-foreground">Aa</TokenSample>,
  },
  {
    token: "--card / --card-foreground",
    utility: "bg-card / text-card-foreground",
    role: "Raised or bounded content surfaces and their text.",
    preview: <TokenSample className="bg-card text-card-foreground shadow-(--elevation-raised)">Aa</TokenSample>,
  },
  {
    token: "--control",
    utility: "bg-control",
    role: "The white resting surface for buttons, composers, and input controls.",
    preview: <TokenSample className="border-input bg-control">Aa</TokenSample>,
  },
  {
    token: "--popover / --popover-foreground",
    utility: "bg-popover / text-popover-foreground",
    role: "Floating menus, popovers, and transient surfaces.",
    preview: <TokenSample className="bg-popover text-popover-foreground shadow-(--elevation-floating)">Aa</TokenSample>,
  },
  {
    token: "--primary / --primary-foreground",
    utility: "bg-primary / text-primary-foreground",
    role: "Highest-emphasis actions and selected controls.",
    preview: <TokenSample className="border-primary bg-primary text-primary-foreground">Aa</TokenSample>,
  },
  {
    token: "--surface-backplate → --secondary / --secondary-foreground",
    utility: "bg-secondary / text-secondary-foreground",
    role: "Lower-emphasis actions and neutral filled controls.",
    preview: <TokenSample className="border-secondary bg-secondary text-secondary-foreground">Aa</TokenSample>,
  },
  {
    token: "--surface-backplate → --muted / --muted-foreground",
    utility: "bg-muted / text-muted-foreground",
    role: "Quiet regions, supporting copy, and subdued states.",
    preview: <TokenSample className="border-muted bg-muted text-muted-foreground">Aa</TokenSample>,
  },
  {
    token: "--surface-backplate → --accent / --accent-foreground",
    utility: "bg-accent / text-accent-foreground",
    role: "Hover, focus-adjacent, and temporary emphasis states.",
    preview: <TokenSample className="border-accent bg-accent text-accent-foreground">Aa</TokenSample>,
  },
  {
    token: "--destructive",
    utility: "bg-destructive / text-destructive",
    role: "Destructive actions, validation, and critical feedback.",
    preview: <TokenSample className="border-destructive bg-destructive" />,
  },
  {
    token: "--surface-stroke → --border",
    utility: "border-border",
    role: "Default separators and low-emphasis boundaries.",
    preview: <TokenSample className="border-border bg-background" />,
  },
  {
    token: "--surface-stroke → --input",
    utility: "border-input",
    role: "Resting field and control boundaries.",
    preview: <TokenSample className="border-input bg-background" />,
  },
  {
    token: "--ring",
    utility: "ring-ring",
    role: "Keyboard focus rings and focused control emphasis.",
    preview: <TokenSample className="border-background bg-background ring-2 ring-ring" />,
  },
]

const badgeColorRows: ColorTokenRow[] = [
  {
    token: "--badge-blue / --badge-blue-foreground",
    utility: "bg-badge-blue / text-badge-blue-foreground",
    role: "Blue categorical labels without status semantics.",
    preview: <TokenSample className="border-badge-blue bg-badge-blue text-badge-blue-foreground">Aa</TokenSample>,
  },
  {
    token: "--badge-green / --badge-green-foreground",
    utility: "bg-badge-green / text-badge-green-foreground",
    role: "Green categorical labels without presence semantics.",
    preview: <TokenSample className="border-badge-green bg-badge-green text-badge-green-foreground">Aa</TokenSample>,
  },
  {
    token: "--badge-sky / --badge-sky-foreground",
    utility: "bg-badge-sky / text-badge-sky-foreground",
    role: "Sky categorical labels and lightweight grouping.",
    preview: <TokenSample className="border-badge-sky bg-badge-sky text-badge-sky-foreground">Aa</TokenSample>,
  },
  {
    token: "--badge-purple / --badge-purple-foreground",
    utility: "bg-badge-purple / text-badge-purple-foreground",
    role: "Purple categorical labels and lightweight grouping.",
    preview: <TokenSample className="border-badge-purple bg-badge-purple text-badge-purple-foreground">Aa</TokenSample>,
  },
  {
    token: "--badge-red / --badge-red-foreground",
    utility: "bg-badge-red / text-badge-red-foreground",
    role: "Red categorical labels; use destructive for critical actions.",
    preview: <TokenSample className="border-badge-red bg-badge-red text-badge-red-foreground">Aa</TokenSample>,
  },
]

const presenceColorRows: ColorTokenRow[] = [
  {
    token: "--presence-available",
    utility: "bg-presence-available",
    role: "A person who is available now.",
    preview: <TokenSample className="border-presence-available bg-presence-available" />,
  },
  {
    token: "--presence-busy",
    utility: "bg-presence-busy",
    role: "A busy person. Aliases the destructive token.",
    preview: <TokenSample className="border-presence-busy bg-presence-busy" />,
  },
  {
    token: "--presence-away",
    utility: "bg-presence-away",
    role: "A person who is temporarily away.",
    preview: <TokenSample className="border-presence-away bg-presence-away" />,
  },
  {
    token: "--presence-offline",
    utility: "bg-presence-offline",
    role: "An offline person. Aliases muted foreground.",
    preview: <TokenSample className="border-presence-offline bg-presence-offline" />,
  },
]

const chartColorRows: ColorTokenRow[] = [
  {
    token: "--chart-1",
    utility: "bg-chart-1",
    role: "First series in a categorical data visualization.",
    preview: <TokenSample className="border-chart-1 bg-chart-1" />,
  },
  {
    token: "--chart-2",
    utility: "bg-chart-2",
    role: "Second series in a categorical data visualization.",
    preview: <TokenSample className="border-chart-2 bg-chart-2" />,
  },
  {
    token: "--chart-3",
    utility: "bg-chart-3",
    role: "Third series in a categorical data visualization.",
    preview: <TokenSample className="border-chart-3 bg-chart-3" />,
  },
  {
    token: "--chart-4",
    utility: "bg-chart-4",
    role: "Fourth series in a categorical data visualization.",
    preview: <TokenSample className="border-chart-4 bg-chart-4" />,
  },
  {
    token: "--chart-5",
    utility: "bg-chart-5",
    role: "Fifth series in a categorical data visualization.",
    preview: <TokenSample className="border-chart-5 bg-chart-5" />,
  },
]

const sidebarColorRows: ColorTokenRow[] = [
  {
    token: "--sidebar / --sidebar-foreground",
    utility: "bg-sidebar / text-sidebar-foreground",
    role: "The navigation panel surface and its default text.",
    preview: <TokenSample className="bg-sidebar text-sidebar-foreground">Aa</TokenSample>,
  },
  {
    token: "--sidebar-primary / --sidebar-primary-foreground",
    utility: "bg-sidebar-primary / text-sidebar-primary-foreground",
    role: "Highest-emphasis controls inside navigation panels.",
    preview: <TokenSample className="border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground">Aa</TokenSample>,
  },
  {
    token: "--sidebar-accent / --sidebar-accent-foreground",
    utility: "bg-sidebar-accent / text-sidebar-accent-foreground",
    role: "Navigation item hover and active backplates.",
    preview: <TokenSample className="border-sidebar-accent bg-sidebar-accent text-sidebar-accent-foreground">Aa</TokenSample>,
  },
  {
    token: "--sidebar-border",
    utility: "border-sidebar-border",
    role: "Navigation panel separators and boundaries.",
    preview: <TokenSample className="border-sidebar-border bg-sidebar" />,
  },
  {
    token: "--sidebar-ring",
    utility: "ring-sidebar-ring",
    role: "Keyboard focus inside navigation panels.",
    preview: <TokenSample className="border-sidebar bg-sidebar ring-2 ring-sidebar-ring" />,
  },
]

const supportingColorRows: ColorTokenRow[] = [
  {
    token: "--card-media-overlay",
    utility: "bg-(--card-media-overlay)",
    role: "A legibility layer over card media.",
    preview: <TokenSample className="border-card bg-(--card-media-overlay)" />,
  },
  {
    token: "--elevation-ambient / --elevation-key",
    utility: "shadow-(--elevation-raised)",
    role: "The ambient and directional shadow colors composed into raised elevation.",
    preview: <TokenSample className="border-card bg-card shadow-(--elevation-raised)" />,
  },
  {
    token: "--elevation-ambient / --elevation-key",
    utility: "shadow-(--elevation-floating)",
    role: "The same shadow colors composed into floating elevation.",
    preview: <TokenSample className="border-popover bg-popover shadow-(--elevation-floating)" />,
  },
  {
    token: "--sidebar-inset-backdrop",
    utility: "bg-(--sidebar-inset-backdrop)",
    role: "The layer behind an inset navigation panel.",
    preview: <TokenSample className="border-muted bg-(--sidebar-inset-backdrop)" />,
  },
  {
    token: "--scrollbar-thumb / --scrollbar-track",
    utility: "scrollbar-thin",
    role: "Tokenized scrollbar thumb and track colors on scrollable surfaces.",
    preview: <TokenSample className="scrollbar-thin overflow-auto bg-background"><span className="h-16 w-px" /></TokenSample>,
  },
]

function SemanticColorsDemo() {
  return (
    <ColorTokenTable
      caption="Semantic colors adapt automatically between light and dark themes."
      rows={semanticColorRows}
    />
  )
}

function BadgeColorsDemo() {
  return (
    <ColorTokenTable
      caption="Expression colors pair a pale surface with a readable foreground."
      rows={badgeColorRows}
    />
  )
}

function PresenceColorsDemo() {
  return (
    <ColorTokenTable
      caption="Presence colors are reserved for a person's availability."
      rows={presenceColorRows}
    />
  )
}

function ChartColorsDemo() {
  return (
    <ColorTokenTable
      caption="Chart colors are ordered series colors, not permanent status meanings."
      rows={chartColorRows}
    />
  )
}

function SidebarColorsDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Inset sidebars contextually make the sidebar surface transparent and lift
        item accents to the background surface.
      </p>
      <ColorTokenTable
        caption="Sidebar colors let navigation surfaces theme independently from page content."
        rows={sidebarColorRows}
      />
    </div>
  )
}

function SupportingColorsDemo() {
  return (
    <ColorTokenTable
      caption="Supporting color tokens are consumed through composed effects and dedicated utilities."
      rows={supportingColorRows}
    />
  )
}

export const colorDemos: ComponentEntry[] = [
  {
    slug: "colors",
    name: "Colors",
    description:
      "Semantic, expression, presence, chart, navigation, and supporting color tokens for every theme-aware surface.",
    category: "Utilities",
    installCommand: null,
    Demo: SemanticColorsDemo,
    code: `<div className="bg-background text-foreground">
  <div className="bg-card text-card-foreground">Card surface</div>
  <button className="bg-primary text-primary-foreground">Primary action</button>
  <p className="text-muted-foreground">Supporting text</p>
</div>`,
    examples: [
      {
        name: "Expression colors",
        description: "Paired categorical colors for compact labels and grouping.",
        Demo: BadgeColorsDemo,
        layout: "wide",
        code: `<span className="bg-badge-blue text-badge-blue-foreground">Blue</span>
<span className="bg-badge-green text-badge-green-foreground">Green</span>
<span className="bg-badge-sky text-badge-sky-foreground">Sky</span>
<span className="bg-badge-purple text-badge-purple-foreground">Purple</span>
<span className="bg-badge-red text-badge-red-foreground">Red</span>`,
      },
      {
        name: "Presence",
        description: "Reserved status colors for a person's availability.",
        Demo: PresenceColorsDemo,
        layout: "wide",
        code: `<span className="bg-presence-available" aria-label="Available" />
<span className="bg-presence-busy" aria-label="Busy" />
<span className="bg-presence-away" aria-label="Away" />
<span className="bg-presence-offline" aria-label="Offline" />`,
      },
      {
        name: "Chart series",
        description: "An ordered categorical palette for up to five data series.",
        Demo: ChartColorsDemo,
        layout: "wide",
        code: `const chartConfig = {
  first: { color: "var(--chart-1)" },
  second: { color: "var(--chart-2)" },
  third: { color: "var(--chart-3)" },
  fourth: { color: "var(--chart-4)" },
  fifth: { color: "var(--chart-5)" },
}`,
      },
      {
        name: "Sidebar colors",
        description: "A contextual palette for navigation shells and their controls.",
        Demo: SidebarColorsDemo,
        layout: "wide",
        code: `<aside className="bg-sidebar text-sidebar-foreground">
  <a className="bg-sidebar-accent text-sidebar-accent-foreground">
    Active item
  </a>
</aside>`,
      },
      {
        name: "Supporting colors",
        description: "Overlays, shadows, contextual backdrops, and scrollbars.",
        Demo: SupportingColorsDemo,
        layout: "wide",
        code: `<div className="bg-card shadow-(--elevation-raised)" />
<div className="bg-popover shadow-(--elevation-floating)" />
<div className="bg-(--card-media-overlay)" />
<div className="scrollbar-thin overflow-auto" />`,
      },
    ],
  },
]
