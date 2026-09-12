import { useState } from "react"
import { BellIcon, CircleCheckIcon, RefreshCwIcon, ShareIcon, WifiIcon, XIcon } from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Swap, SwapItem } from "@/components/ui/swap"
import { Text } from "@/components/ui/text"

function SwapDemo() {
  const [expanded, setExpanded] = useState(false)
  const short = "Saved"
  const long = "All changes saved to the cloud"

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-24 text-sm text-muted-foreground">Without Swap</span>
          <span className="text-sm font-medium">{expanded ? long : short}</span>
          <CircleCheckIcon className="text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 text-sm text-muted-foreground">With Swap</span>
          <Swap>
            <SwapItem active={!expanded} className="text-sm font-medium">
              {short}
            </SwapItem>
            <SwapItem active={expanded} className="text-sm font-medium">
              {long}
            </SwapItem>
          </Swap>
          <CircleCheckIcon className="text-muted-foreground" />
        </div>
      </div>
      <Button type="button" variant="secondary" onClick={() => setExpanded((current) => !current)}>
        Toggle message length
      </Button>
      <Text tone="muted" className="max-w-sm text-center">
        Both rows switch between the same two messages. Watch the check icon: without Swap it
        slides as the text grows and shrinks; with Swap the box holds its widest width, so the
        icon never moves.
      </Text>
    </div>
  )
}

function SwapStatusDemo() {
  const states = [
    { label: "Online", Icon: WifiIcon, variant: "secondary" as const },
    { label: "Reconnecting\u2026", Icon: RefreshCwIcon, variant: "default" as const },
    { label: "Offline", Icon: XIcon, variant: "destructive" as const },
  ]
  const [step, setStep] = useState(0)

  return (
    <div className="flex flex-col items-center gap-4">
      <Swap justify="center">
        {states.map(({ label, Icon, variant }, index) => (
          <SwapItem key={label} active={index === step}>
            <Badge variant={variant}>
              <Icon />
              {label}
            </Badge>
          </SwapItem>
        ))}
      </Swap>
      <Button type="button" variant="secondary" onClick={() => setStep((current) => (current + 1) % states.length)}>
        Next state
      </Button>
      <Text tone="muted" className="max-w-sm text-center">
        Three states share one grid cell and crossfade. The chip stays the width of the widest
        label, so it never resizes as the status changes.
      </Text>
    </div>
  )
}

function SwapTitleDemo() {
  const [inConversation, setInConversation] = useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div data-optical-edges className="flex items-center gap-2 rounded-lg border p-3">
        <Swap className="edge-text flex-1">
          <SwapItem active={!inConversation} className="truncate text-sm font-semibold">
            OneDS Chat
          </SwapItem>
          <SwapItem active={inConversation} className="truncate text-sm font-semibold">
            Q3 design systems roadmap
          </SwapItem>
        </Swap>
        <Swap justify="end">
          <SwapItem active={!inConversation}>
            <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
          </SwapItem>
          <SwapItem active={inConversation}>
            <Button type="button" variant="ghost" size="icon" aria-label="Share">
              <ShareIcon />
            </Button>
          </SwapItem>
        </Swap>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setInConversation((current) => !current)}
      >
        Toggle state
      </Button>
    </div>
  )
}

export const swapDemos: ComponentEntry[] = [
  {
    slug: "swap",
    name: "Swap",
    description:
      "Stacks several states in one grid cell and crossfades between them, so a slot can change content without resizing or reflowing its neighbours.",
    category: "Utilities",
    installCommand: null,
    Demo: SwapDemo,
    defaultExampleName: "No layout shift",
    defaultExampleHeader: {
      style: "inline",
      description:
        "Swap reserves the width of its widest state, so content around it never reflows when the active state changes.",
    },
    examples: [
      {
        name: "Crossfade states",
        description:
          "Several states share one grid cell and crossfade. The chip stays the size of the widest label, so it never resizes as the status changes.",
        Demo: SwapStatusDemo,
      },
      {
        name: "Header slot",
        description:
          "A title and an action group that both swap with the surrounding state. Inactive items stay laid out but are inert, so they are neither focusable nor announced.",
        Demo: SwapTitleDemo,
      },
    ],
    code: `import { Swap, SwapItem } from "@/components/ui/swap"

export function StatusMessage({ expanded }: { expanded: boolean }) {
  return (
    <Swap>
      <SwapItem active={!expanded}>Saved</SwapItem>
      <SwapItem active={expanded}>All changes saved to the cloud</SwapItem>
    </Swap>
  )
}`,
  },
]
