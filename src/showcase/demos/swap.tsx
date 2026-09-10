import { useState } from "react"
import { BellIcon, CheckIcon, PencilIcon, ShareIcon } from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { Button } from "@/components/ui/button"
import { Swap, SwapItem } from "@/components/ui/swap"

function SwapDemo() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Swap justify="center">
        <SwapItem active={!saved}>
          <Button type="button" onClick={() => setSaved(true)}>
            <PencilIcon data-icon="inline-start" />
            Save changes
          </Button>
        </SwapItem>
        <SwapItem active={saved}>
          <Button type="button" variant="secondary" onClick={() => setSaved(false)}>
            <CheckIcon data-icon="inline-start" />
            Saved
          </Button>
        </SwapItem>
      </Swap>
      <p className="text-sm text-muted-foreground">
        The box keeps the width of its widest state, so nothing reflows.
      </p>
    </div>
  )
}

function SwapTitleDemo() {
  const [inConversation, setInConversation] = useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center gap-2 rounded-lg border p-3">
        <Swap className="flex-1">
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
    examples: [
      {
        name: "Header slot",
        description:
          "A title and an action group that both swap with the surrounding state. Inactive items stay laid out but are inert, so they are neither focusable nor announced.",
        Demo: SwapTitleDemo,
      },
    ],
    code: `import { Swap, SwapItem } from "@/components/ui/swap"

export function SaveSwap({ saved }: { saved: boolean }) {
  return (
    <Swap justify="center">
      <SwapItem active={!saved}>
        <Button>Save changes</Button>
      </SwapItem>
      <SwapItem active={saved}>
        <Button variant="secondary">Saved</Button>
      </SwapItem>
    </Swap>
  )
}`,
  },
]
