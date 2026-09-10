import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  CheckIcon,
  ArchiveIcon,
  CalendarIcon,
  ChevronDownIcon,
  CopyIcon,
  FileIcon,
  FileTextIcon,
  GlobeIcon,
  HatGlassesIcon,
  HistoryIcon,
  MessageCirclePlusIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PaletteIcon,
  PencilIcon,
  PencilLineIcon,
  PlusIcon,
  RefreshCwIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  XIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { cn } from "@/lib/utils"
import {
  AIComposer,
  AIComposerAction,
  AIComposerActions,
  AIComposerFooter,
  AIComposerHeader,
  AIComposerInput,
  AIComposerSubmit,
  AIComposerTool,
  AIComposerTools,
  type AIComposerStatus,
} from "@/components/ui/ai-composer"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Marker, MarkerContent } from "@/components/ui/marker"
import {
  Message,
  MessageActions,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import { Markdown, Response, ResponseStream } from "@/components/ui/response"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
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
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarProvider,
  SidebarResizeHandle,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Swap, SwapItem } from "@/components/ui/swap"
import {
  SiteHeader,
  SiteHeaderActions,
  SiteHeaderContainer,
  SiteHeaderTitle,
} from "@/components/ui/site-header"

type ChatTurn = {
  id: string
  role: "user" | "assistant"
  text: string
  attachments?: string[]
  streaming?: boolean
  targetText?: string
}

type PendingResponse = {
  id: string
  text: string
}

type Conversation = {
  id: string
  title: string
  group: "Today" | "Previous 7 days" | "Older"
  turns: ChatTurn[]
}

/** `auto` resolves against the block's own width, never the viewport. */
type ChatLayout = "auto" | "workspace" | "panel"
type ResolvedChatLayout = Exclude<ChatLayout, "auto">

type ChatHistory = {
  activeId: string
  conversations: Conversation[]
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onNewChat: () => void
  onSelect: (id: string) => void
}

const starterTurns: ChatTurn[] = [
  {
    id: "welcome-user",
    role: "user",
    text: "Summarize the most important decisions from our design review.",
  },
  {
    id: "welcome-assistant",
    role: "assistant",
    text: "The review aligned on three priorities: reuse established components, keep every visual decision token-driven, and make motion communicate state rather than decorate it.",
  },
]

// Themed answers show the response surface across different content shapes:
// math, rich media, comparison tables with citations, and code-heavy fixes.
const quadraticResponse = `## Deriving the quadratic formula

Start from the general quadratic equation:

$$
ax^2 + bx + c = 0
$$

**Divide** through by $a$, then move the constant term to the right:

1. $x^2 + \\frac{b}{a}x = -\\frac{c}{a}$
2. Add $\\left(\\frac{b}{2a}\\right)^2$ to both sides to complete the square.
3. The left side is now a perfect square.

$$
\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}
$$

Take the square root of both sides and isolate $x$:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

> [!TIP]
> The discriminant $b^2 - 4ac$ tells you how many real roots the equation has.`

const onboardingResponse = `## Onboarding flow redesign brief

The current flow loses **32%** of new users before activation. This redesign trims the path and makes progress obvious.

![Onboarding wireframe](https://picsum.photos/seed/onboarding/640/320)

### Scope for this sprint

- [x] Audit the existing seven-step flow
- [x] Define the three must-have steps
- [ ] Prototype the progress indicator
- [ ] Usability test with five participants

> [!IMPORTANT]
> Keep account creation last so users reach value before committing.

### Success metrics

| Metric | Today | Target |
| --- | --- | --- |
| Activation | 41% | 60% |
| Time to value | 6 min | 2 min |`

const frameworksResponse = `## Comparing frontend frameworks

Here is how the three candidates stack up for the dashboard[^1].

| Framework | Bundle | Learning curve | Ecosystem |
| --- | --- | --- | --- |
| React | Medium | Gentle | Huge |
| Svelte | Small | Gentle | Growing |
| Solid | Small | Steeper | Small |

**Recommendation:** React, for the ecosystem and hiring pool — unless bundle size is the top constraint[^2].

\`\`\`tsx
function Dashboard() {
  return <Panel title="Overview" />
}
\`\`\`

[^1]: [Framework benchmarks](#/response) — bundle and runtime comparisons.
[^2]: [Team skills survey](#/message) — current familiarity across the team.`

const deploymentResponse = `## Fixing the failing deployment

The pipeline fails at the build step because the Node version drifted between local and CI.

### What to change

1. Pin the Node version in the workflow.
2. Clear the stale dependency cache.
3. Re-run the job from a clean install.

\`\`\`yaml
strategy:
  matrix:
    node-version: [20.x]
\`\`\`

Then reinstall cleanly instead of reusing \`node_modules\`:

\`\`\`bash
rm -rf node_modules
npm ci
\`\`\`

> [!WARNING]
> A cached \`node_modules\` from Node 18 is the usual culprit. Always use \`npm ci\` in CI, never \`npm install\`.`

const themedConversations: Conversation[] = [
  {
    id: "quadratic-derivation",
    title: "Derive the quadratic formula",
    group: "Today",
    turns: [
      {
        id: "quadratic-user",
        role: "user",
        text: "Walk me through deriving the quadratic formula step by step.",
      },
      {
        id: "quadratic-assistant",
        role: "assistant",
        text: quadraticResponse,
      },
    ],
  },
  {
    id: "onboarding-redesign",
    title: "Onboarding flow redesign brief",
    group: "Today",
    turns: [
      {
        id: "onboarding-user",
        role: "user",
        text: "Draft a brief for redesigning our onboarding flow.",
      },
      {
        id: "onboarding-assistant",
        role: "assistant",
        text: onboardingResponse,
      },
    ],
  },
  {
    id: "framework-comparison",
    title: "Compare frontend frameworks",
    group: "Today",
    turns: [
      {
        id: "framework-user",
        role: "user",
        text: "Compare React, Svelte and Solid for our dashboard.",
      },
      {
        id: "framework-assistant",
        role: "assistant",
        text: frameworksResponse,
      },
    ],
  },
  {
    id: "deployment-fix",
    title: "Fix the failing deployment",
    group: "Today",
    turns: [
      {
        id: "deployment-user",
        role: "user",
        text: "Our deployment keeps failing at the build step. How do I fix it?",
      },
      {
        id: "deployment-assistant",
        role: "assistant",
        text: deploymentResponse,
      },
    ],
  },
]

const starterConversations: Conversation[] = [
  {
    id: "new-chat",
    title: "New conversation",
    group: "Today",
    turns: [],
  },
  ...themedConversations,
  {
    id: "design-review",
    title: "OneDS navigation review decisions",
    group: "Today",
    turns: starterTurns,
  },
  {
    id: "project-update",
    title: "Design platform weekly update",
    group: "Today",
    turns: [
      {
        id: "project-user",
        role: "user",
        text: "Draft a concise update for the design platform project.",
      },
      {
        id: "project-assistant",
        role: "assistant",
        text: "The design platform work is on track. This week the team completed the shared navigation patterns, aligned motion behavior around speed tokens, and began validating complete AI workflows.",
      },
    ],
  },
  {
    id: "research-summary",
    title: "Mobile navigation interview themes",
    group: "Previous 7 days",
    turns: [
      {
        id: "research-user",
        role: "user",
        text: "Summarize the recurring themes from the interviews.",
      },
      {
        id: "research-assistant",
        role: "assistant",
        text: "Participants consistently valued predictable navigation, visible system status, and the ability to recover from mistakes without losing their work.",
      },
    ],
  },
  {
    id: "launch-checklist",
    title: "Copilot onboarding launch checklist",
    group: "Previous 7 days",
    turns: [
      {
        id: "launch-user",
        role: "user",
        text: "Create a launch readiness checklist.",
      },
      {
        id: "launch-assistant",
        role: "assistant",
        text: "Confirm accessibility, responsive layouts, telemetry, support ownership, rollback steps, and final stakeholder approval before release.",
      },
    ],
  },
  {
    id: "token-audit",
    title: "Semantic token migration risks",
    group: "Older",
    turns: [
      {
        id: "token-user",
        role: "user",
        text: "What should we verify in the token audit?",
      },
      {
        id: "token-assistant",
        role: "assistant",
        text: "Check for raw values, duplicated semantic roles, incomplete dark-mode mappings, and motion values that bypass the shared speed scale.",
      },
    ],
  },
  {
    id: "accessibility-audit",
    title: "Checkout accessibility audit",
    group: "Today",
    turns: [
      {
        id: "accessibility-user",
        role: "user",
        text: "Prioritize the checkout accessibility findings for this sprint.",
      },
      {
        id: "accessibility-assistant",
        role: "assistant",
        text: "Start with keyboard-blocking defects, missing accessible names, and error recovery. Follow with focus order and contrast improvements.",
      },
    ],
  },
  {
    id: "q3-roadmap",
    title: "Q3 design systems roadmap",
    group: "Today",
    turns: [
      {
        id: "roadmap-user",
        role: "user",
        text: "Turn our Q3 priorities into a design systems roadmap.",
      },
      {
        id: "roadmap-assistant",
        role: "assistant",
        text: "Sequence the roadmap around foundation hardening, high-use workflow blocks, adoption support, and measurable quality improvements.",
      },
    ],
  },
  {
    id: "search-empty-state",
    title: "Search empty-state copy options",
    group: "Previous 7 days",
    turns: [
      {
        id: "search-empty-user",
        role: "user",
        text: "Write concise empty-state options for search with no results.",
      },
      {
        id: "search-empty-assistant",
        role: "assistant",
        text: "No results found. Try a different term, remove a filter, or browse all components.",
      },
    ],
  },
  {
    id: "enterprise-permissions",
    title: "Enterprise permissions model",
    group: "Previous 7 days",
    turns: [
      {
        id: "permissions-user",
        role: "user",
        text: "Map the roles needed for our enterprise permissions model.",
      },
      {
        id: "permissions-assistant",
        role: "assistant",
        text: "Use viewer, contributor, manager, and administrator roles with explicit scope and inheritance rules.",
      },
    ],
  },
  {
    id: "release-notes",
    title: "August component release notes",
    group: "Previous 7 days",
    turns: [
      {
        id: "release-user",
        role: "user",
        text: "Draft release notes for the August component update.",
      },
      {
        id: "release-assistant",
        role: "assistant",
        text: "This release adds workflow blocks, improves sidebar behavior, and unifies motion across navigation and chat patterns.",
      },
    ],
  },
  {
    id: "localization-plan",
    title: "Localization readiness plan",
    group: "Previous 7 days",
    turns: [
      {
        id: "localization-user",
        role: "user",
        text: "What should the team verify before localization testing?",
      },
      {
        id: "localization-assistant",
        role: "assistant",
        text: "Verify flexible layouts, logical properties, plural rules, date formats, expansion tolerance, and bidirectional behavior.",
      },
    ],
  },
  {
    id: "analytics-dashboard",
    title: "Adoption dashboard metrics",
    group: "Older",
    turns: [
      {
        id: "analytics-user",
        role: "user",
        text: "Choose metrics for the design system adoption dashboard.",
      },
      {
        id: "analytics-assistant",
        role: "assistant",
        text: "Track component coverage, active consuming teams, upgrade latency, accessibility defects, and support volume.",
      },
    ],
  },
  {
    id: "notification-taxonomy",
    title: "Notification severity taxonomy",
    group: "Older",
    turns: [
      {
        id: "notification-user",
        role: "user",
        text: "Clarify the notification severity taxonomy.",
      },
      {
        id: "notification-assistant",
        role: "assistant",
        text: "Use neutral for awareness, success for confirmation, warning for recoverable risk, and danger for destructive or blocking outcomes.",
      },
    ],
  },
  {
    id: "responsive-tables",
    title: "Responsive data table patterns",
    group: "Older",
    turns: [
      {
        id: "tables-user",
        role: "user",
        text: "Compare responsive approaches for dense data tables.",
      },
      {
        id: "tables-assistant",
        role: "assistant",
        text: "Preserve tabular relationships with horizontal scrolling first, then offer column controls or a purpose-built compact view.",
      },
    ],
  },
  {
    id: "design-critique",
    title: "Design critique facilitation guide",
    group: "Today",
    turns: starterTurns,
  },
  {
    id: "component-inventory",
    title: "Component inventory cleanup",
    group: "Today",
    turns: starterTurns,
  },
  {
    id: "research-repository",
    title: "Research repository structure",
    group: "Previous 7 days",
    turns: starterTurns,
  },
  {
    id: "content-guidelines",
    title: "Product content guidelines",
    group: "Previous 7 days",
    turns: starterTurns,
  },
  {
    id: "prototype-testing",
    title: "Prototype testing plan",
    group: "Previous 7 days",
    turns: starterTurns,
  },
  {
    id: "support-workflow",
    title: "Customer support workflow",
    group: "Previous 7 days",
    turns: starterTurns,
  },
  {
    id: "design-ops",
    title: "Design operations planning",
    group: "Older",
    turns: starterTurns,
  },
  {
    id: "quality-scorecard",
    title: "Experience quality scorecard",
    group: "Older",
    turns: starterTurns,
  },
  {
    id: "governance-review",
    title: "Component governance review",
    group: "Older",
    turns: starterTurns,
  },
  {
    id: "handoff-checklist",
    title: "Engineering handoff checklist",
    group: "Older",
    turns: starterTurns,
  },
]

const greeting = "Ready when you are."

const regeneratedResponse =
  "Here is a regenerated answer with the same guidance expressed more directly. Keep the interaction focused, preserve the shared component behavior, and add complexity only when the product requires it."

// Opening a conversation replays its last answer so it streams in again; the
// existing word-feed drives the reveal from its full text.
function replayLastAssistant(turns: ChatTurn[]): ChatTurn[] {
  let lastAssistant = -1
  turns.forEach((turn, index) => {
    if (turn.role === "assistant") lastAssistant = index
  })
  if (lastAssistant === -1) return turns
  return turns.map((turn, index) => {
    if (index !== lastAssistant) {
      return turn.streaming
        ? { ...turn, streaming: false, targetText: undefined }
        : turn
    }
    return {
      ...turn,
      text: "",
      targetText: turn.targetText ?? turn.text,
      streaming: true,
    }
  })
}

const suggestions = [
  {
    label: "Draft an update",
    prompt: "Draft a concise project update for the design platform.",
    icon: PencilLineIcon,
  },
  {
    label: "Summarize a doc",
    prompt: "Summarize this document in five bullet points.",
    icon: FileTextIcon,
  },
  {
    label: "Plan a review",
    prompt: "Plan the agenda for the next design review.",
    icon: CalendarIcon,
  },
]

function readMotionToken(
  host: HTMLElement,
  speedToken: string,
  easingToken: string,
) {
  const probe = document.createElement("span")
  probe.style.cssText = `position:absolute;visibility:hidden;transition-duration:var(${speedToken});transition-timing-function:var(${easingToken})`
  host.appendChild(probe)
  const style = getComputedStyle(probe)
  const rawDuration = style.transitionDuration
  const easing = style.transitionTimingFunction
  probe.remove()

  const value = Number.parseFloat(rawDuration)
  const duration = Number.isFinite(value)
    ? rawDuration.trim().endsWith("ms")
      ? value
      : value * 1000
    : 0

  return { duration, easing }
}

function readBlockToken(host: HTMLElement, token: string) {
  const probe = document.createElement("span")
  probe.style.cssText = `position:absolute;visibility:hidden;block-size:var(${token});inline-size:0`
  host.appendChild(probe)
  const value = probe.getBoundingClientRect().height
  probe.remove()
  return value
}

/**
 * One measured decision drives both the CSS and the component tree, so a
 * forced `layout` renders identically to an auto-resolved one.
 */
function useResolvedChatLayout(
  layout: ChatLayout,
  ref: React.RefObject<HTMLDivElement | null>,
): ResolvedChatLayout {
  const [measured, setMeasured] = useState<ResolvedChatLayout>("workspace")

  useLayoutEffect(() => {
    const host = ref.current
    if (layout !== "auto" || !host) return

    // Resolving before paint keeps a panel-width host from flashing the rail.
    const resolve = () => {
      const threshold = readBlockToken(host, "--ai-chat-panel-max-width")
      setMeasured(
        threshold > 0 && host.clientWidth <= threshold ? "panel" : "workspace",
      )
    }

    resolve()
    const observer = new ResizeObserver(resolve)
    observer.observe(host)
    return () => observer.disconnect()
  }, [layout, ref])

  return layout === "auto" ? measured : layout
}

function AIChatBlockContent({
  conversation,
  history,
  layout,
  onTurnsChange,
}: {
  conversation: Conversation
  history: ChatHistory
  layout: ResolvedChatLayout
  onTurnsChange: (id: string, turns: ChatTurn[]) => void
}) {
  const isPanel = layout === "panel"
  const blockRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const nextIdRef = useRef(conversation.turns.length)
  const scrollAfterSubmitRef = useRef<string | null>(null)
  const pendingResponseRef = useRef<PendingResponse | null>(null)
  const scrollAnimationRef = useRef<Animation | null>(null)
  const scrollFrameRef = useRef(0)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const { scrollToMessage } = useMessageScroller()
  const [turns, setTurns] = useState<ChatTurn[]>(conversation.turns)
  const [prompt, setPrompt] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [webSearch, setWebSearch] = useState(false)
  const [status, setStatus] = useState<AIComposerStatus>("ready")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({})
  // The pane is never remounted on a conversation switch, so the empty and
  // docked layouts can transition into each other. Local drafts reset here.
  const [loadedId, setLoadedId] = useState(conversation.id)
  if (loadedId !== conversation.id) {
    setLoadedId(conversation.id)
    const loaded = replayLastAssistant(conversation.turns)
    setTurns(loaded)
    setPrompt("")
    setAttachments([])
    setStatus(loaded.some((turn) => turn.streaming) ? "streaming" : "ready")
    setCopiedId(null)
    setFeedback({})
  }
  const isEmpty = turns.length === 0
  const isBusy = status === "submitted" || status === "streaming"

  const streamingTurn = turns.find(
    (turn) => turn.streaming && turn.targetText,
  )
  const streamingTurnId = streamingTurn?.id
  const streamingTargetText = streamingTurn?.targetText

  useEffect(() => {
    onTurnsChange(conversation.id, turns)
  }, [conversation.id, onTurnsChange, turns])

  // The copy affordance has to fall back to its resting icon and label.
  useEffect(() => {
    const block = blockRef.current
    if (!copiedId || !block) return
    const { duration } = readMotionToken(
      block,
      "--ai-chat-copy-reset-delay",
      "--ai-chat-layout-ease",
    )
    const timer = window.setTimeout(() => setCopiedId(null), duration)
    return () => window.clearTimeout(timer)
  }, [copiedId])

  // Remounting on every arrival at an empty chat replays the reveal sweep.
  const greetingKey = `${conversation.id}|${isEmpty}`

  // Loading a different conversation drops any in-flight send. The id counter
  // is deliberately not reset: it only has to stay unique, and the pane is no
  // longer remounted per conversation.
  useLayoutEffect(() => {
    pendingResponseRef.current = null
    scrollAfterSubmitRef.current = null
    scrollAnimationRef.current?.cancel()
    scrollAnimationRef.current = null
    if (viewportRef.current) viewportRef.current.scrollTop = 0
  }, [conversation.id])

  const beginPendingResponse = () => {
    const pending = pendingResponseRef.current
    if (!pending) return

    pendingResponseRef.current = null
    setTurns((current) => [
      ...current,
      {
        id: pending.id,
        role: "assistant",
        text: "",
        targetText: pending.text,
        streaming: true,
      },
    ])
    setStatus("streaming")
  }

  useLayoutEffect(() => {
    const messageId = scrollAfterSubmitRef.current
    const block = blockRef.current
    const transcript = transcriptRef.current
    const viewport = viewportRef.current
    if (!messageId || !block || !transcript || !viewport) return

    scrollAfterSubmitRef.current = null
    const initialScrollTop = viewport.scrollTop
    const scrollMargin = readBlockToken(viewport, "--ai-chat-scroll-inset")
    const didScroll = scrollToMessage(messageId, {
      align: "start",
      behavior: "auto",
      scrollMargin,
    })
    const message = Array.from(transcript.children).find(
      (item) =>
        item instanceof HTMLElement && item.dataset.messageId === messageId,
    )
    if (!didScroll || !message || !Number.isFinite(scrollMargin)) {
      beginPendingResponse()
      return
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
      const currentInset =
        message.getBoundingClientRect().top - viewport.getBoundingClientRect().top
      viewport.scrollTop += currentInset - scrollMargin

      const distance = viewport.scrollTop - initialScrollTop
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches

      if (distance === 0 || reducedMotion) {
        beginPendingResponse()
        return
      }

      const { duration, easing } = readMotionToken(
        block,
        "--ai-chat-scroll-speed",
        "--ai-chat-scroll-ease",
      )
      const animation = transcript.animate(
        [
          { transform: `translateY(${distance}px)` },
          { transform: "translateY(0)" },
        ],
        { duration, easing, fill: "both" },
      )
      scrollAnimationRef.current = animation
      animation.finished
        .then(() => {
          if (scrollAnimationRef.current !== animation) return
          scrollAnimationRef.current = null
          beginPendingResponse()
        })
        .catch(() => {})
    })

    return () => cancelAnimationFrame(scrollFrameRef.current)
  }, [scrollToMessage, turns])

  useEffect(() => {
    if (!streamingTurnId || !streamingTargetText || !blockRef.current) return

    const units = streamingTargetText.match(/\S+\s*/g) ?? [streamingTargetText]
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const { duration } = readMotionToken(
      blockRef.current,
      "--ai-chat-stream-speed",
      "--ai-chat-scroll-ease",
    )
    let animationFrame = 0
    let startedAt: number | null = null
    let visibleUnits = 0

    const finish = () => {
      setTurns((current) =>
        current.map((turn) =>
          turn.id === streamingTurnId
            ? {
                ...turn,
                text: streamingTargetText,
                streaming: false,
                targetText: undefined,
              }
            : turn,
        ),
      )
      setStatus("ready")
    }

    const stream = (timestamp: number) => {
      if (reducedMotion || duration <= 0) {
        finish()
        return
      }

      startedAt ??= timestamp
      const progress = Math.min(1, (timestamp - startedAt) / duration)
      const nextVisibleUnits = Math.min(
        units.length,
        Math.max(1, Math.ceil(units.length * progress)),
      )

      if (nextVisibleUnits !== visibleUnits) {
        visibleUnits = nextVisibleUnits
        const visibleText = units.slice(0, visibleUnits).join("")
        setTurns((current) =>
          current.map((turn) =>
            turn.id === streamingTurnId
              ? { ...turn, text: visibleText }
              : turn,
          ),
        )
      }

      if (progress < 1) animationFrame = requestAnimationFrame(stream)
      else finish()
    }

    animationFrame = requestAnimationFrame(stream)
    return () => cancelAnimationFrame(animationFrame)
  }, [streamingTargetText, streamingTurnId])

  const stopResponse = () => {
    pendingResponseRef.current = null
    scrollAnimationRef.current?.cancel()
    scrollAnimationRef.current = null
    setTurns((current) =>
      current.map((turn) =>
        turn.streaming
          ? { ...turn, streaming: false, targetText: undefined }
          : turn,
      ),
    )
    setStatus("ready")
  }

  const setFeedbackFor = (id: string, rating: "up" | "down") => {
    setFeedback((current) => {
      if (current[id] !== rating) return { ...current, [id]: rating }
      const { [id]: _removed, ...rest } = current
      return rest
    })
  }

  const regenerate = (id: string) => {
    if (status !== "ready") return
    setTurns((current) =>
      current.map((turn) =>
        turn.id === id
          ? {
              ...turn,
              text: "",
              targetText: regeneratedResponse,
              streaming: true,
            }
          : turn,
      ),
    )
    setStatus("streaming")
  }

  const submitPrompt = () => {
    const value = prompt.trim()
    if (!value || status !== "ready") return

    const sequence = nextIdRef.current++
    const userMessageId = `user-${sequence}`
    scrollAfterSubmitRef.current = userMessageId
    pendingResponseRef.current = {
      id: `assistant-${sequence}`,
      text: webSearch
        ? "I searched the available sources and organized the answer around the strongest recurring themes. The strongest direction is to keep the experience focused, reuse the established components, and reveal supporting detail only when it helps the task."
        : "Here is a concise answer organized around the goals and constraints in your prompt. Start with the smallest complete experience, preserve the established component behaviors, and introduce a new abstraction only when the pattern repeats.",
    }
    setStatus("submitted")
    setTurns((current) => [
      ...current,
      {
        id: userMessageId,
        role: "user",
        text: value,
        attachments: attachments.length > 0 ? attachments : undefined,
      },
    ])
    setPrompt("")
    setAttachments([])
  }

  const suggestionsRegion = (
    <div
      className="ai-chat-block__reveal ai-chat-block__suggestions-region"
      data-anchor={isPanel ? "start" : "end"}
      inert={!isEmpty}
    >
      <EmptyContent
        className={cn(
          "ai-chat-block__suggestions max-w-(--ai-chat-empty-suggestions-width) gap-(--ai-chat-empty-chip-gap)",
          isPanel
            ? "flex-col items-start"
            : "flex-row flex-wrap justify-center",
        )}
      >
        {suggestions.map(({ label, prompt: starter, icon: Icon }) => (
          <Button
            key={label}
            type="button"
            variant="secondary"
            className="rounded-full"
            onClick={() => {
              setPrompt(starter)
              promptRef.current?.focus()
            }}
          >
            <Icon data-icon="inline-start" />
            {label}
          </Button>
        ))}
      </EmptyContent>
    </div>
  )

  return (
    <section
      ref={blockRef}
      className="ai-chat-block showcase-contained-viewport"
      aria-label="AI chat"
      data-empty={isEmpty}
    >
      <SiteHeader
        variant="docked"
        className="ai-chat-block__header static border-b-0"
      >
        <SiteHeaderContainer>
          <SiteHeaderTitle>
            {isPanel ? <PaletteIcon aria-hidden /> : null}
            <Swap>
              {isPanel ? (
                <SwapItem active={isEmpty} className="truncate">
                  OneDS Chat
                </SwapItem>
              ) : null}
              <SwapItem
                key={conversation.id}
                active={!isEmpty}
                className="truncate"
              >
                {conversation.title}
              </SwapItem>
            </Swap>
          </SiteHeaderTitle>
          <SiteHeaderActions role="toolbar" aria-label="Conversation actions">
            {isPanel ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="New chat"
                  aria-hidden={isEmpty}
                  tabIndex={isEmpty ? -1 : 0}
                  className={cn(
                    "transition-opacity duration-(--sidebar-fade-speed) ease-(--sidebar-ease)",
                    isEmpty && "pointer-events-none opacity-0",
                  )}
                  onClick={history.onNewChat}
                >
                  <MessageCirclePlusIcon />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild tooltip="Recents">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Recent chats"
                    >
                      <HistoryIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-(--ai-chat-recents-menu-width) min-h-(--ai-chat-recents-menu-min-height) max-h-(--ai-chat-recents-menu-max-height)"
                  >
                    <DropdownMenuLabel>Recents</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {visibleConversations(history.conversations).map(
                        (item) => (
                          <DropdownMenuItem
                            key={item.id}
                            aria-current={
                              item.id === history.activeId ? "true" : undefined
                            }
                            onSelect={() => history.onSelect(item.id)}
                          >
                            <span className="min-w-0 flex-1 truncate">
                              {item.title}
                            </span>
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild tooltip="More actions">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Conversation options"
                    >
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <ShareIcon />
                        Share conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HatGlassesIcon />
                        Temporary chat
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {!isEmpty ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onSelect={() => history.onArchive(conversation.id)}
                          >
                            <ArchiveIcon />
                            Archive chat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => history.onDelete(conversation.id)}
                          >
                            <Trash2Icon />
                            Delete chat
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Avatar className="size-5!">
                        <AvatarImage src={persona.avatar} alt="" />
                        <AvatarFallback>{persona.initials}</AvatarFallback>
                      </Avatar>
                      {persona.name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Swap justify="end">
                <SwapItem
                  active={isEmpty}
                  className="flex items-center gap-(--site-header-action-gap)"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Temporary chat"
                  >
                    <HatGlassesIcon />
                  </Button>
                </SwapItem>
                <SwapItem
                  active={!isEmpty}
                  className="flex items-center gap-(--site-header-action-gap)"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Share conversation"
                  >
                    <ShareIcon />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Conversation options"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setTurns([])}
                      >
                        <Trash2Icon />
                        Clear conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SwapItem>
              </Swap>
            )}
          </SiteHeaderActions>
        </SiteHeaderContainer>
      </SiteHeader>

      <MessageScroller className="ai-chat-block__scroller">
          <MessageScrollerViewport
            ref={viewportRef}
            className="ai-chat-block__viewport"
          >
            <MessageScrollerContent
              ref={transcriptRef}
              className="ai-chat-block__transcript"
              aria-live="polite"
            >
              {turns.length > 0 ? (
                <>
                  <MessageScrollerItem id="today" className="ai-chat-block__turn">
                    <Marker variant="separator">
                      <MarkerContent>Today</MarkerContent>
                    </Marker>
                  </MessageScrollerItem>
                  {turns.map((turn) => (
                    <MessageScrollerItem
                      key={turn.id}
                      id={turn.id}
                      className="ai-chat-block__turn"
                    >
                      <Message align={turn.role === "user" ? "end" : "start"}>
                        <MessageContent>
                          {turn.role === "assistant" ? (
                            <MessageHeader>
                              {turn.streaming ? "Responding" : "Assistant"}
                            </MessageHeader>
                          ) : null}
                          <Bubble
                            align={turn.role === "user" ? "end" : "start"}
                            variant={turn.role === "user" ? "secondary" : "ghost"}
                          >
                            <BubbleContent>
                              {turn.role === "assistant" ? (
                                <Response>
                                  <Markdown
                                    streaming={turn.streaming}
                                    throttle={false}
                                  >
                                    {turn.text}
                                  </Markdown>
                                </Response>
                              ) : (
                                turn.text
                              )}
                            </BubbleContent>
                          </Bubble>
                          {turn.attachments?.length ? (
                            <AttachmentGroup>
                              {turn.attachments.map((name) => (
                                <Attachment key={name} size="sm">
                                  <AttachmentMedia variant="icon">
                                    <FileIcon />
                                  </AttachmentMedia>
                                  <AttachmentContent>
                                    <AttachmentTitle>{name}</AttachmentTitle>
                                    <AttachmentDescription>Attached file</AttachmentDescription>
                                  </AttachmentContent>
                                </Attachment>
                              ))}
                            </AttachmentGroup>
                          ) : null}
                          {turn.role === "assistant" && !turn.streaming ? (
                            <MessageFooter>
                              <MessageActions>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={copiedId === turn.id ? "Copied" : "Copy response"}
                                  onClick={() => {
                                    navigator.clipboard.writeText(turn.text).catch(() => {})
                                    setCopiedId(turn.id)
                                  }}
                                >
                                  {copiedId === turn.id ? <CheckIcon /> : <CopyIcon />}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Helpful"
                                  aria-pressed={feedback[turn.id] === "up"}
                                  onClick={() => setFeedbackFor(turn.id, "up")}
                                >
                                  <ThumbsUpIcon />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Not helpful"
                                  aria-pressed={feedback[turn.id] === "down"}
                                  onClick={() => setFeedbackFor(turn.id, "down")}
                                >
                                  <ThumbsDownIcon />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Regenerate"
                                  disabled={isBusy}
                                  onClick={() => regenerate(turn.id)}
                                >
                                  <RefreshCwIcon />
                                </Button>
                              </MessageActions>
                            </MessageFooter>
                          ) : null}
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </>
              ) : null}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
      </MessageScroller>

      <div className="ai-chat-block__composer-lockup">
        <div
          className="ai-chat-block__reveal ai-chat-block__greeting-region"
          data-anchor="start"
          inert={!isEmpty}
        >
          <Empty
            className={cn(
              "p-0 pb-(--ai-chat-empty-greeting-gap)",
              isPanel &&
                "items-start ps-(--ai-chat-panel-greeting-indent) text-left",
            )}
          >
            <EmptyHeader className={cn(isPanel && "items-start")}>
              <EmptyTitle className="text-(length:--ai-chat-greeting-size) leading-(--ai-chat-greeting-line-height) tracking-(--ai-chat-greeting-tracking)">
                <ResponseStream
                  key={greetingKey}
                  text={greeting}
                  revealOnMount
                  reserve
                />
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>

        {isPanel ? suggestionsRegion : null}

        <div className="ai-chat-block__composer-region">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            aria-label="Add files"
            onChange={(event) => {
              const names = Array.from(event.currentTarget.files ?? []).map(
                (file) => file.name,
              )
              // The file name is the attachment's identity here, so the same
              // file cannot be listed twice.
              setAttachments((current) => [
                ...current,
                ...names.filter(
                  (name, index) =>
                    !current.includes(name) && names.indexOf(name) === index,
                ),
              ])
              event.currentTarget.value = ""
            }}
          />
          <AIComposer
            status={status}
            onSubmit={(event) => {
              event.preventDefault()
              submitPrompt()
            }}
          >
            {attachments.length > 0 ? (
              <AIComposerHeader>
                <AttachmentGroup>
                  {attachments.map((name) => (
                    <Attachment key={name} size="sm">
                      <AttachmentMedia variant="icon">
                        <FileIcon />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{name}</AttachmentTitle>
                        <AttachmentDescription>
                          Ready to send
                        </AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions>
                        <AttachmentAction
                          aria-label={`Remove ${name}`}
                          onClick={() =>
                            setAttachments((current) =>
                              current.filter((item) => item !== name),
                            )
                          }
                        >
                          <XIcon />
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                  ))}
                </AttachmentGroup>
              </AIComposerHeader>
            ) : null}
            <AIComposerInput
              ref={promptRef}
              aria-label="Message"
              placeholder="Ask anything"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <AIComposerFooter>
              <AIComposerTools>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <AIComposerAction aria-label="Add to prompt">
                      <PlusIcon />
                    </AIComposerAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start">
                    <DropdownMenuLabel>Add to prompt</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => fileInputRef.current?.click()}
                      >
                        <PaperclipIcon />
                        Add files
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={webSearch}
                      onCheckedChange={(checked) =>
                        setWebSearch(checked === true)
                      }
                    >
                      <GlobeIcon />
                      Search web
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {webSearch ? (
                  <AIComposerTool
                    variant="secondary"
                    aria-pressed="true"
                    onClick={() => setWebSearch(false)}
                  >
                    <GlobeIcon data-icon="inline-start" />
                    Search web
                  </AIComposerTool>
                ) : null}
              </AIComposerTools>
              <AIComposerActions>
                <AIComposerSubmit
                  status={status}
                  onClick={status === "streaming" ? stopResponse : undefined}
                />
              </AIComposerActions>
            </AIComposerFooter>
          </AIComposer>
        </div>
        {isPanel ? null : suggestionsRegion}
      </div>
      {/* Only the full-page layout anchors the composer above center. */}
      {isPanel ? null : (
        <div className="ai-chat-block__spacer" aria-hidden="true" />
      )}
    </section>
  )
}

const conversationGroups: Conversation["group"][] = [
  "Today",
  "Previous 7 days",
  "Older",
]

/** Recents is a flat list: the groups only order it, they never label it. */
function visibleConversations(conversations: Conversation[]) {
  return conversations
    .filter((conversation) => conversation.turns.length > 0)
    .sort(
      (left, right) =>
        conversationGroups.indexOf(left.group) -
        conversationGroups.indexOf(right.group),
    )
}

function makeNewChat(count: number): Conversation {
  return {
    id: `new-chat-${count}`,
    title: count === 1 ? "New conversation" : `New conversation ${count}`,
    group: "Today",
    turns: [],
  }
}

function ConversationHistory({
  activeId,
  conversations,
  onArchive,
  onDelete,
  onNewChat,
  onRename,
  onSelect,
}: {
  activeId: string
  conversations: Conversation[]
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onNewChat: () => void
  onRename: (id: string, title: string) => void
  onSelect: (id: string) => void
}) {
  const [recentsOpen, setRecentsOpen] = useState(true)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const hasActiveChat = conversations.some(
    (conversation) =>
      conversation.id === activeId && conversation.turns.length > 0,
  )
  const visible = visibleConversations(conversations)

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim())
    }
    setRenamingId(null)
  }

  return (
    <>
      <SidebarHeader className="ai-chat-history__header min-h-(--ai-chat-top-band-height) p-(--ai-chat-history-rail-inset)">
        <SidebarBrand>
          <SidebarBrandMark>
            <PaletteIcon className="size-5" />
          </SidebarBrandMark>
          <SidebarBrandLabel>OneDS Chat</SidebarBrandLabel>
          <SidebarTrigger />
        </SidebarBrand>
      </SidebarHeader>
      <Collapsible
        open={recentsOpen}
        onOpenChange={setRecentsOpen}
        className="group/recents ai-chat-history__chats flex min-h-0 flex-1 flex-col"
      >
        <SidebarContent
          scrollbar="thin"
          stickyHeader={
            <div className="ai-chat-history__recents-bar">
            <CollapsibleTrigger className="ai-chat-history__recents-trigger">
              <span>Recents</span>
              <ChevronDownIcon aria-hidden />
            </CollapsibleTrigger>
            <div className="ai-chat-history__recents-header">
              <div className="ai-chat-history__recents-actions">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="New chat"
                  aria-hidden={!hasActiveChat}
                  tabIndex={hasActiveChat ? 0 : -1}
                  className={cn(
                    "ai-chat-history__compose transition-opacity duration-(--sidebar-fade-speed) ease-(--sidebar-ease)",
                    !hasActiveChat && "pointer-events-none opacity-0",
                  )}
                  onClick={onNewChat}
                >
                  <MessageCirclePlusIcon />
                </Button>
              </div>
            </div>
            </div>
          }
          className="ai-chat-history__content"
          aria-label="Conversation history"
        >
          <CollapsibleContent
            containerClassName="shrink-0"
            className="ai-chat-history__recents-content [[data-slot=sidebar][data-collapsible=icon]_&]:hidden"
          >
            <SidebarGroup>
              <SidebarGroupContent>
                <ItemGroup className="gap-(--ai-chat-history-item-gap)!">
                  {visible.map((conversation) => (
                    <Item
                      key={conversation.id}
                      size="xs"
                      variant={activeId === conversation.id ? "muted" : "default"}
                      className="ai-chat-history__item flex-nowrap text-muted-foreground hover:bg-muted"
                    >
                      {renamingId === conversation.id ? (
                        <SidebarInput
                          autoFocus
                          aria-label={`Rename ${conversation.title}`}
                          value={renameValue}
                          onChange={(event) =>
                            setRenameValue(event.currentTarget.value)
                          }
                          onBlur={commitRename}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
                              commitRename()
                            }
                            if (event.key === "Escape") {
                              event.preventDefault()
                              setRenamingId(null)
                            }
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          className="ai-chat-history__item-button"
                          aria-pressed={activeId === conversation.id}
                          onClick={() => onSelect(conversation.id)}
                        >
                          <ItemContent>
                            <ItemTitle>{conversation.title}</ItemTitle>
                          </ItemContent>
                        </button>
                      )}
                      {renamingId !== conversation.id ? (
                        <ItemActions hosted>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild tooltip="More actions">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ai-chat-history__item-action"
                                aria-label={`Actions for ${conversation.title}`}
                              >
                                <MoreHorizontalIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuItem
                                onSelect={() => {
                                  setRenamingId(conversation.id)
                                  setRenameValue(conversation.title)
                                }}
                              >
                                <PencilIcon />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => onArchive(conversation.id)}
                              >
                                <ArchiveIcon />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => onDelete(conversation.id)}
                              >
                                <Trash2Icon />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </ItemActions>
                      ) : null}
                    </Item>
                  ))}
                </ItemGroup>
              </SidebarGroupContent>
            </SidebarGroup>
          </CollapsibleContent>
        </SidebarContent>
      </Collapsible>
      <SidebarFooter className="ai-chat-history__profile">
        <SidebarAccount type="button">
          <Avatar>
            <AvatarImage src={persona.avatar} alt="" />
            <AvatarFallback>{persona.initials}</AvatarFallback>
          </Avatar>
          <SidebarAccountDetails>
            <span>{persona.name}</span>
            <span>{persona.title}</span>
          </SidebarAccountDetails>
        </SidebarAccount>
      </SidebarFooter>
    </>
  )
}

function AIChatBlock({ layout = "auto" }: { layout?: ChatLayout } = {}) {
  const workspaceRef = useRef<HTMLDivElement>(null)
  const resolvedLayout = useResolvedChatLayout(layout, workspaceRef)
  const [conversations, setConversations] = useState(starterConversations)
  const [activeId, setActiveId] = useState(starterConversations[0].id)
  const newChatCountRef = useRef(0)
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ??
    conversations[0]
  const updateConversationTurns = useCallback(
    (id: string, turns: ChatTurn[]) => {
      setConversations((current) => {
        let changed = false
        const next = current.map((conversation) => {
          if (conversation.id !== id || conversation.turns === turns) {
            return conversation
          }
          changed = true
          return { ...conversation, turns }
        })
        return changed ? next : current
      })
    },
    [],
  )

  const createNewChat = () => {
    const conversation = makeNewChat(++newChatCountRef.current)
    setConversations((current) => [
      conversation,
      ...current.filter((item) => item.turns.length > 0),
    ])
    setActiveId(conversation.id)
  }

  const deleteConversation = (id: string) => {
    const next = conversations.filter((conversation) => conversation.id !== id)
    // Deleting the last record has to land on a usable empty chat rather than
    // an empty workspace.
    if (next.length === 0) {
      const conversation = makeNewChat(++newChatCountRef.current)
      setConversations([conversation])
      setActiveId(conversation.id)
      return
    }
    setConversations(next)
    if (activeId === id) setActiveId(next[0].id)
  }

  if (!activeConversation) return null

  const archiveConversation = (id: string) =>
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? { ...conversation, group: "Older" }
          : conversation,
      ),
    )

  const history: ChatHistory = {
    activeId,
    conversations,
    onArchive: archiveConversation,
    onDelete: deleteConversation,
    onNewChat: createNewChat,
    onSelect: setActiveId,
  }

  return (
    // The measured box is one we own: a ref spread through SidebarProvider
    // never reaches the DOM node, and the pane's own width depends on whether
    // the rail is rendered, which would make it circular.
    <div ref={workspaceRef} className="h-full w-full min-h-0">
      <SidebarProvider
        id="ai-chat-history"
        persist={false}
        shortcut={false}
        data-layout={resolvedLayout}
        className="ai-chat-workspace showcase-contained-viewport h-full min-h-0 overflow-hidden"
      >
        {resolvedLayout === "workspace" ? (
          <Sidebar collapsible="bar" edge="line" className="ai-chat-history">
            <ConversationHistory
              activeId={activeId}
              conversations={conversations}
              onNewChat={createNewChat}
              onSelect={setActiveId}
              onRename={(id, title) =>
                setConversations((current) =>
                  current.map((conversation) =>
                    conversation.id === id
                      ? { ...conversation, title }
                      : conversation,
                  ),
                )
              }
              onArchive={archiveConversation}
              onDelete={deleteConversation}
            />
            <SidebarResizeHandle />
          </Sidebar>
        ) : null}
        <SidebarInset className="min-h-0 overflow-hidden">
          <MessageScrollerProvider defaultScrollPosition="start">
            <AIChatBlockContent
              conversation={activeConversation}
              history={history}
              layout={resolvedLayout}
              onTurnsChange={updateConversationTurns}
            />
          </MessageScrollerProvider>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function AIChatSidePanelDemo() {
  return (
    <div className="mx-auto h-full w-(--ai-chat-panel-min-width) max-w-full">
      <AIChatBlock layout="panel" />
    </div>
  )
}

export const blockDemos: ComponentEntry[] = [
  {
    slug: "block-ai-chat",
    name: "AI Chat",
    description:
      "A complete conversational workspace composed from OneDS chat, feedback and navigation primitives. It adapts to the width it is given: below --ai-chat-panel-max-width the history rail becomes a header menu and the composer docks to the bottom.",
    category: "Blocks",
    installCommand: null,
    Demo: AIChatBlock,
    examples: [
      {
        name: "Side panel",
        description:
          "The same block at 360px, the default and minimum content width of a browser side panel. History moves into the header, the composer stays docked, and the greeting and suggestions flow above it.",
        layout: "application",
        Demo: AIChatSidePanelDemo,
      },
    ],
    code: `import { AIComposer } from "@/components/ui/ai-composer"
import { Message } from "@/components/ui/message"
import { MessageScroller } from "@/components/ui/message-scroller"

export function AIChat() {
  return (
    <section className="ai-chat-block">
      <MessageScroller>{/* Conversation turns */}</MessageScroller>
      <AIComposer>{/* Prompt input and actions */}</AIComposer>
    </section>
  )
}`,
  },
]
