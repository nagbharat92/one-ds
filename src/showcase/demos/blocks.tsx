import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import {
  CheckIcon,
  CalendarIcon,
  CopyIcon,
  Eyeglasses3Icon,
  FileIcon,
  FileTextIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PencilLineIcon,
  PlusIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { cn } from "@/lib/utils"
import { useBroadcastState } from "@/hooks/use-broadcast-state"
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
import { Chip } from "@/components/ui/chip"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemPrimaryAction,
  ItemTitle,
} from "@/components/ui/item"
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
  NavigationPane,
  NavigationPaneBrand,
  NavigationPaneBrandLabel,
  NavigationPaneBrandMark,
  NavigationPaneContent,
  NavigationPaneFooter,
  NavigationPaneGroup,
  NavigationPaneGroupContent,
  NavigationPaneGroupLabel,
  NavigationPaneHeader,
  NavigationPaneHeaderActions,
  NavigationPaneInset,
  NavigationPaneMenu,
  NavigationPaneMenuItem,
  NavigationPaneProvider,
  NavigationPaneSearch,
  NavigationPaneTrigger,
} from "@/components/ui/navigation-pane"
import { Separator } from "@/components/ui/separator"

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

// A follow-up turn on the same conversation, so the pane demonstrates a
// multi-step exchange rather than a single question and answer.
const onboardingFollowUpResponse = `## Is 60% realistic?

Yes, with a phased approach — teams that cut onboarding from seven steps to three typically see activation gains in this range within two releases.

- **Release 1:** ship the three-step flow. Expect activation to jump to roughly 50% just from removing friction.
- **Release 2:** add the progress indicator. This closes most of the remaining gap by reducing perceived length.

> [!TIP]
> Track time-to-value alongside activation — a flow that activates fast but delays value can still churn later.`

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

const frameworksFollowUpResponse = `## With SSR as a hard requirement

React still leads, but for a different reason — its SSR frameworks (Next.js, Remix) are the most mature of the three.

| Framework | SSR framework | Maturity |
| --- | --- | --- |
| React | Next.js, Remix | High |
| Svelte | SvelteKit | Growing |
| Solid | SolidStart | Early |

\`\`\`tsx
// Next.js: data fetches on the server by default
export default async function Page() {
  const data = await getDashboardData()
  return <Panel data={data} />
}
\`\`\`

**Recommendation holds:** React, and more specifically Next.js, for SSR maturity.`

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

const deploymentFollowUpResponse = `## Fixing the out-of-memory build

Clean installs surface the real workload — the build was always this heavy, the stale cache just hid it.

\`\`\`yaml
env:
  NODE_OPTIONS: --max-old-space-size=4096
\`\`\`

> [!WARNING]
> Treat this as a temporary unblock, not a fix. If the heap keeps growing release over release, profile the build for a bundling or memory-leak regression instead of raising the limit again.`

const mobileNavResponse = `## Recurring themes from the interviews

Across all twelve sessions, three themes came up far more than any others.

- **Predictable navigation** — people expect the back gesture and the home tab to behave the same way every time.
- **Visible system status** — a spinner alone was not enough; participants wanted to know *what* was loading.
- **Easy recovery** — nobody wanted a confirmation dialog for browsing, only for anything destructive.

> "I don't mind it being slow. I mind not knowing if it's stuck."
> — Participant 7, field study

> [!NOTE]
> Two participants used the app one-handed for almost the whole session — bottom-anchored actions kept the interaction reachable.`

const launchChecklistResponse = `## Copilot onboarding launch checklist

Work through this list in order — each step gates the next.

1. Confirm the onboarding flow passes an accessibility pass (keyboard, screen reader, contrast).
2. Verify the flow renders correctly at the smallest supported viewport.
3. Enable telemetry for every step so drop-off is measurable from day one.
4. Assign a support owner for the first two weeks after launch.
5. Rehearse the rollback path before announcing a launch date.

### Sign-off checklist

- [x] Accessibility pass complete
- [x] Responsive layouts verified
- [ ] Telemetry wired to the dashboard
- [ ] Support ownership confirmed
- [ ] Rollback rehearsed

> [!TIP]
> Schedule the rollback rehearsal for the same day as the launch review — it's the check most likely to get skipped otherwise.`

const tokenAuditResponse = `## What to verify in the token audit

| Risk | Why it matters | Check |
| --- | --- | --- |
| Raw values | Bypasses the token pipeline entirely | Grep for hex codes and px literals |
| Duplicated roles | Two tokens resolving to the same value drift apart later | Diff resolved values, not names |
| Dark-mode gaps | A token defined for light mode silently falls back | Toggle themes and diff computed styles |
| Motion outliers | Custom durations break the shared speed scale | Grep for raw \`ms\` / \`transition-duration\` values |

> [!CAUTION]
> A token that resolves correctly today can still be wrong — if it was hand-copied from a color picker instead of referencing the palette, it will drift the next time the palette changes.`

const accessibilityAuditResponse = `## Checkout accessibility findings, prioritized

1. **Keyboard-blocking defects** — the promo code field traps focus; fix first, it blocks task completion entirely.
2. **Missing accessible names** — the quantity stepper's buttons only have icons.
3. **Error recovery** — validation errors aren't announced and don't move focus to the first invalid field.
4. **Focus order** — the order summary panel is reachable before the fields it summarizes.
5. **Contrast** — the "Apply" button's disabled state is 2.1:1, below the 3:1 minimum for UI components.

> [!IMPORTANT]
> Fix items 1–3 before the next release; they block task completion, not just comfort. See the [severity rubric](#/response) for how these were ranked.`

const accessibilityFollowUpResponse = `## Estimated remediation time

| Item | Effort | Owner |
| --- | --- | --- |
| Keyboard-blocking defect | 0.5 day | Frontend |
| Missing accessible names | 0.5 day | Frontend |
| Error recovery | 1.5 days | Frontend + Content |
| Focus order | 1 day | Frontend |
| Contrast | 0.5 day | Design |

**Total: roughly 4 days** if items run in parallel across the two available engineers; closer to 6 days sequentially.

> [!IMPORTANT]
> Don't parallelize items 1 and 3 — the same field owns both, and fixing error recovery first makes the keyboard trap easier to verify.`

const roadmapResponse = `## Q3 design systems roadmap

### Foundation hardening
Close the remaining token and contrast gaps before building on top of them.

### High-use workflow blocks
Ship the AI chat, table, and form blocks that consuming teams ask for most.

### Adoption support
Publish the catalog, add usage guidance, and clear the top migration blockers.

### Measurable quality
Wire the design-rule tests into CI so regressions surface before release.

| Quarter | Theme | Exit criteria |
| --- | --- | --- |
| Weeks 1–4 | Foundation hardening | Zero raw-value findings in the audit |
| Weeks 5–8 | Workflow blocks | AI chat and table blocks ship |
| Weeks 9–11 | Adoption support | Catalog live for all governed components |
| Week 12 | Measurable quality | Design-rule tests required to merge |`

const roadmapFollowUpResponse = `## Risk of skipping foundation hardening

Every later phase inherits the gaps we skip now — this is the one phase that isn't optional without a cost.

> [!CAUTION]
> Workflow blocks built on top of ungoverned tokens will need to be reworked when the tokens are fixed later, which typically costs more than fixing them first.

- Adoption support material would document workarounds instead of the real system.
- Design-rule tests would have nothing stable to check against.

**Recommendation:** keep foundation hardening as a hard gate, even if it compresses a later phase.`

const searchEmptyStateResponse = `## Empty-state copy for zero search results

Three options, from most literal to most actionable:

- \`No results found.\` — plain confirmation, no next step.
- \`No results for "{query}". Try a different term or remove a filter.\` — names the query, offers two paths forward.
- \`Nothing matched "{query}" yet. Browse all components instead?\` — softer tone, offers an escape hatch.

| Option | Tone | Best for |
| --- | --- | --- |
| Plain confirmation | Neutral | Power users who will self-correct |
| Named query + next step | Direct | Most general search surfaces |
| Soft + escape hatch | Encouraging | New users unfamiliar with the catalog |

**Recommendation:** the second option — it names what was searched and gives two concrete next actions.`

const permissionsResponse = `## Enterprise permissions model

| Role | View | Edit | Publish | Manage members |
| --- | --- | --- | --- | --- |
| Viewer | ✓ | | | |
| Contributor | ✓ | ✓ | | |
| Manager | ✓ | ✓ | ✓ | |
| Administrator | ✓ | ✓ | ✓ | ✓ |

Scope and inheritance:

- **Organization** — administrators set defaults here; every project inherits them unless overridden.
  - A project can only *narrow* an inherited permission, never widen it.
- **Project** — managers can promote a contributor to manager within their own project only.
- **Component** — the finest scope; used only for pre-release components still under review.`

const releaseNotesResponse = `## August component release

### Added
- Workflow blocks for AI chat, tables, and multi-step forms.
- A \`size="icon-expressive"\` tier for touch-first surfaces.

### Changed
- Navigation pane collapse now fades content instead of toggling display, removing a layout jump.
- Motion across navigation and chat now shares one speed scale — see the [motion guide](#/response).

### Fixed
\`\`\`diff
- transition: all 300ms ease;
+ transition: background-color var(--speed-swift) var(--ease-standard);
\`\`\`

> [!NOTE]
> The diff above is representative — each component's actual transition list is scoped to only the properties that visibly change.`

const localizationResponse = `## Before localization testing, verify

- [x] Layouts use flexible containers, not fixed pixel widths
- [x] Spacing and positioning use logical properties (\`margin-inline-start\`, not \`margin-left\`)
- [ ] Plural rules are handled per-locale, not just singular/plural
- [ ] Dates and numbers format per-locale
- [ ] UI tolerates at least 35% text expansion without clipping
- [ ] Bidirectional layouts (RTL) mirror correctly

> [!NOTE]
> Logical properties are the highest-leverage item here — most of the bidirectional issues we've found trace back to a hardcoded \`left\`/\`right\`.`

const analyticsResponse = `## Adoption dashboard metrics

| Metric | Signal | Target |
| --- | --- | --- |
| Component coverage | Share of UI built from governed components | ≥ 90% |
| Active consuming teams | Teams shipping with the system this quarter | Growing |
| Upgrade latency | Time from release to adoption | ≤ 2 weeks |
| Accessibility defects | Open defects tied to governed components | 0 blocking |
| Support volume | Questions per active team per month | Trending down |

Coverage is computed per surface as

$$
\\text{coverage} = \\frac{\\text{governed components}}{\\text{governed components} + \\text{one-off components}}
$$

so a surface with a few well-justified one-offs still scores highly if the rest is fully governed.`

const notificationTaxonomyResponse = `## Notification severity taxonomy

| Level | Use for | Example |
| --- | --- | --- |
| Note | Background information | "This setting applies to the whole workspace." |
| Tip | An optional, helpful shortcut | "You can also press ⌘K to search." |
| Important | Something the user should not miss | "Changes here affect every project." |
| Warning | A recoverable risk | "This will remove the component from three pages." |
| Caution | A destructive or irreversible outcome | "This permanently deletes the workspace." |

> [!NOTE]
> Background information the user doesn't need to act on.

> [!TIP]
> An optional shortcut or better way to do something.

> [!IMPORTANT]
> Something the user should not miss, even if it isn't urgent.

> [!WARNING]
> A recoverable risk — the user can undo or retry.

> [!CAUTION]
> A destructive or irreversible outcome. Use sparingly.`

const notificationExamplesResponse = `## Example copy per level

- **Note:** "Workspace settings were last updated 3 days ago."
- **Tip:** "Press ⌘K anywhere to jump straight to search."
- **Important:** "This role change applies to every project the user can access."
- **Warning:** "Removing this component will affect 3 pages that still reference it."
- **Caution:** "This will permanently delete the workspace and everything in it."

> [!NOTE]
> Keep caution copy specific about what's irreversible — a vague "this cannot be undone" is less effective than naming exactly what's lost.`

const responsiveTablesResponse = `## Responsive approaches for dense data tables

![Table pattern comparison](https://picsum.photos/seed/tables/640/320)

Preserve tabular relationships first. Horizontal scroll keeps every row and column aligned, which a card view or drop-columns approach both lose.

\`\`\`css
.data-table {
  overflow-x: auto;
  scrollbar-gutter: stable;
}
\`\`\`

| Approach | Preserves relationships | Best for |
| --- | --- | --- |
| Horizontal scroll | Yes | Default choice for dense data |
| Column controls | Yes, for shown columns | Power users who customize views |
| Compact/card view | No | Small tables, at-a-glance summaries |`

const designReviewResponse = `## Decisions from the navigation review

Three decisions came out of today's review, in order of impact.

1. **Reuse established components.** No new list-item or menu patterns — extend \`Item\` and the shared menu module instead of building bespoke rows.
2. **Keep every visual decision token-driven.** No hand-picked hex values or one-off spacing, even for "just this one case."
3. **Let motion communicate state, not decorate it.** A transition should only exist to show something changed — position, size, or emphasis.

| Area | Before | Decision |
| --- | --- | --- |
| Navigation rows | Bespoke per surface | Shared \`Item compact\` everywhere |
| Color | Some hardcoded hex | 100% token-driven |
| Motion | Mixed durations | One shared speed scale |

> [!IMPORTANT]
> Anyone shipping a new navigation surface should start from these three decisions, not from the closest-looking existing screen.`

const designReviewFollowUpResponse = `## Rollout ownership

The design systems team owns the pattern and the migration guide; each product team owns applying it to their own surfaces.

- [x] Design systems team publishes the updated \`Item\` guidance
- [x] Design systems team flags every non-compliant navigation surface
- [ ] Each product team migrates its own surfaces on its own timeline
- [ ] Design systems team re-audits after the next release

> [!NOTE]
> This mirrors how the token migration rolled out — central ownership of the pattern, distributed ownership of the migration, prevented it from becoming a systems-team backlog item.`

const projectUpdateResponse = `## Design platform weekly update

### Shipped
- Shared navigation patterns across the pane and rail.
- Motion aligned to the shared speed-token scale.

### In progress
- [x] AI chat workflow — conversation history
- [ ] AI chat workflow — multi-step tool calls
- [ ] Table block — responsive column controls

### Metrics

| Metric | This week | Last week |
| --- | --- | --- |
| Components shipped | 3 | 2 |
| Open defects | 4 | 7 |
| Adopting teams | 11 | 9 |

> [!TIP]
> Adopting teams grew fastest right after the navigation patterns shipped — bundling a workflow block with its supporting components seems to drive adoption more than shipping either alone.`

const projectUpdateFollowUpResponse = `## What's blocking AI workflow validation

One dependency, not a design problem: the multi-step tool-call pattern needs a decision on how partial/streaming tool results render before the interaction can be finalized.

> [!WARNING]
> Two open questions are blocking this: whether a tool call shows inline in the transcript or in a side panel, and whether a failed tool call should retry automatically or wait for the user.

- Design has a proposal ready for both; needs one review session to decide.
- Engineering has the composer and message primitives ready either way.

**Next step:** schedule the decision review this week so the pattern can land before the next release.`

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
      {
        id: "onboarding-user-2",
        role: "user",
        text: "Is the 60% activation target realistic given our current pace?",
      },
      {
        id: "onboarding-assistant-2",
        role: "assistant",
        text: onboardingFollowUpResponse,
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
      {
        id: "framework-user-2",
        role: "user",
        text: "Does the recommendation change if we need strong SSR support?",
      },
      {
        id: "framework-assistant-2",
        role: "assistant",
        text: frameworksFollowUpResponse,
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
      {
        id: "deployment-user-2",
        role: "user",
        text: "I cleared the cache but now the build runs out of memory instead.",
      },
      {
        id: "deployment-assistant-2",
        role: "assistant",
        text: deploymentFollowUpResponse,
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
    turns: [
      {
        id: "design-review-user",
        role: "user",
        text: "Summarize the most important decisions from our design review.",
      },
      {
        id: "design-review-assistant",
        role: "assistant",
        text: designReviewResponse,
      },
      {
        id: "design-review-user-2",
        role: "user",
        text: "Who owns rolling this out to the other teams?",
      },
      {
        id: "design-review-assistant-2",
        role: "assistant",
        text: designReviewFollowUpResponse,
      },
    ],
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
        text: projectUpdateResponse,
      },
      {
        id: "project-user-2",
        role: "user",
        text: "What's blocking the AI workflow validation?",
      },
      {
        id: "project-assistant-2",
        role: "assistant",
        text: projectUpdateFollowUpResponse,
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
        text: mobileNavResponse,
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
        text: launchChecklistResponse,
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
        text: tokenAuditResponse,
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
        text: accessibilityAuditResponse,
      },
      {
        id: "accessibility-user-2",
        role: "user",
        text: "How long will remediation take for these five items?",
      },
      {
        id: "accessibility-assistant-2",
        role: "assistant",
        text: accessibilityFollowUpResponse,
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
        text: roadmapResponse,
      },
      {
        id: "roadmap-user-2",
        role: "user",
        text: "What's the risk if we skip foundation hardening this quarter?",
      },
      {
        id: "roadmap-assistant-2",
        role: "assistant",
        text: roadmapFollowUpResponse,
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
        text: searchEmptyStateResponse,
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
        text: permissionsResponse,
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
        text: releaseNotesResponse,
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
        text: localizationResponse,
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
        text: analyticsResponse,
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
        text: notificationTaxonomyResponse,
      },
      {
        id: "notification-user-2",
        role: "user",
        text: "Give me one example notification for each level.",
      },
      {
        id: "notification-assistant-2",
        role: "assistant",
        text: notificationExamplesResponse,
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
        text: responsiveTablesResponse,
      },
    ],
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

// Each starter chip gets its own tailored answer, so clicking one begins a
// genuinely on-topic conversation instead of a generic reply.
const suggestionDraftUpdateResponse = `## Component catalog rollout update

### Shipped
- The agent-facing catalog now covers Button, Card, and Response.
- Usage guidance surfaces directly in \`catalog:show\`, not just prop shape.

### In progress
- [x] Extend extraction to Table and Form
- [ ] Wire catalog freshness into CI
- [ ] Publish the catalog CLI to the team wiki

| Metric | This week | Target |
| --- | --- | --- |
| Components cataloged | 3 | 12 |
| Assisted-task accuracy | 100% | ≥ 90% |

> [!TIP]
> The accuracy jump came from printing usage guidance up front — teams read the "how" before the prop list, not after.`

const suggestionSummarizeDocResponse = `## Summary: Q3 reliability postmortem

1. **Root cause** was a cache invalidation gap between the token pipeline and the build step, not the deployment itself.
2. **Detection** took 40 minutes because the alert threshold was tuned for a different metric.
3. **Recovery** was fast (12 minutes) once the stale cache was identified.
4. **Process gap:** no runbook existed for this failure mode.
5. **Follow-up:** three action items are now tracked, one already shipped (see the release notes conversation).

> "The fix was simple. Finding it wasn't — we were looking at the wrong dashboard for the first half hour."
> — Incident notes

> [!IMPORTANT]
> Write the runbook before the next on-call rotation starts, not after the next incident.`

const suggestionPlanReviewResponse = `## Next design review agenda

| Time | Topic | Owner |
| --- | --- | --- |
| 0:00–0:10 | Recap decisions from the last review | Facilitator |
| 0:10–0:30 | Walk through the AI chat block | Design |
| 0:30–0:45 | Open questions on navigation pane motion | Engineering |
| 0:45–0:55 | Prioritize follow-ups | Everyone |
| 0:55–1:00 | Confirm owners and dates | Facilitator |

> [!TIP]
> Send the walkthrough recording as a pre-read. Reviews that start from "what changed" instead of a live demo leave more time for the open questions.`

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

const suggestionResponseByPrompt: Record<string, string> = {
  [suggestions[0].prompt]: suggestionDraftUpdateResponse,
  [suggestions[1].prompt]: suggestionSummarizeDocResponse,
  [suggestions[2].prompt]: suggestionPlanReviewResponse,
}

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
  layout,
  onTurnsChange,
}: {
  conversation: Conversation
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
        : (suggestionResponseByPrompt[value] ??
          "Here is a concise answer organized around the goals and constraints in your prompt. Start with the smallest complete experience, preserve the established component behaviors, and introduce a new abstraction only when the pattern repeats."),
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
          <Chip
            key={label}
            variant="secondary"
            onClick={() => {
              setPrompt(starter)
              promptRef.current?.focus()
            }}
          >
            <Icon data-icon="inline-start" />
            {label}
          </Chip>
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
                    <Marker variant="pill">
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
            variant="plain"
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
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Add to prompt</DropdownMenuLabel>
                      <DropdownMenuItem
                        onSelect={() => fileInputRef.current?.click()}
                      >
                        <PaperclipIcon />
                        Add files
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Tools</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem
                        checked={webSearch}
                        onCheckedChange={(checked) =>
                          setWebSearch(checked === true)
                        }
                      >
                        <GlobeIcon />
                        Search web
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
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

function AIChatSidepanelBrand() {
  return (
    <NavigationPaneHeader className="h-(--showcase-header-row-height) min-h-0 flex-row items-center justify-between px-4 py-0">
      <NavigationPaneBrand>
        <NavigationPaneBrandMark>
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-5" />
        </NavigationPaneBrandMark>
        <NavigationPaneBrandLabel className="text-lg font-semibold">Chat</NavigationPaneBrandLabel>
      </NavigationPaneBrand>
      <NavigationPaneHeaderActions>
        <NavigationPaneTrigger />
      </NavigationPaneHeaderActions>
    </NavigationPaneHeader>
  )
}

function AIChatSidepanelSearch() {
  return (
    <NavigationPaneGroup>
      <NavigationPaneSearch placeholder="Search..." aria-label="Search" />
    </NavigationPaneGroup>
  )
}

function AIChatSidepanelChatAction({
  isNewChat,
  onSelect,
}: {
  isNewChat: boolean
  onSelect: () => void
}) {
  const fade =
    "transition-opacity duration-(--motion-effects-fast-speed) ease-(--motion-effects-fast-curve)"

  return (
    <NavigationPaneGroup>
      <NavigationPaneMenu>
        <NavigationPaneMenuItem>
          <Item
            compact
            asChild
            variant="muted"
            style={{
              "--item-muted-surface": "var(--button-primary-pink-fill)",
              "--item-muted-ink": "var(--button-primary-pink-ink)",
              "--item-muted-hover-surface": "color-mix(in srgb, var(--button-primary-pink-fill), var(--button-primary-pink-ink) var(--state-layer-hover-opacity))",
              "--item-muted-pressed-surface": "color-mix(in srgb, var(--button-primary-pink-fill), var(--button-primary-pink-ink) var(--state-layer-pressed-opacity))",
            } as CSSProperties}
          >
            <button
              type="button"
              aria-label={isNewChat ? "Temporary chat" : "New chat"}
              data-chat-action={isNewChat ? "temporary" : "new"}
              onClick={onSelect}
            >
              <ItemMedia variant="icon">
                <span className="grid place-items-center" aria-hidden="true">
                  <PlusIcon
                    className={cn(
                      "col-start-1 row-start-1",
                      fade,
                      isNewChat ? "opacity-0" : "opacity-100",
                    )}
                  />
                  <Eyeglasses3Icon
                    className={cn(
                      "col-start-1 row-start-1",
                      fade,
                      isNewChat ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
              </ItemMedia>
              <ItemContent>
                <span className="grid" aria-hidden="true">
                  <ItemTitle
                    className={cn(
                      "col-start-1 row-start-1",
                      fade,
                      isNewChat ? "opacity-0" : "opacity-100",
                    )}
                  >
                    New chat
                  </ItemTitle>
                  <ItemTitle
                    className={cn(
                      "col-start-1 row-start-1",
                      fade,
                      isNewChat ? "opacity-100" : "opacity-0",
                    )}
                  >
                    Temporary chat
                  </ItemTitle>
                </span>
              </ItemContent>
            </button>
          </Item>
        </NavigationPaneMenuItem>
      </NavigationPaneMenu>
    </NavigationPaneGroup>
  )
}

const conversationGroupOrder: Conversation["group"][] = [
  "Today",
  "Previous 7 days",
  "Older",
]

function AIChatSidepanelNav({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <NavigationPaneContent>
      {/* No icons on these rows, so a collapsed selected pill would show as an
          empty box — hide the whole list in icon-bar mode instead. */}
      {conversationGroupOrder.map((group) => {
        const items = conversations.filter(
          (conversation) =>
            conversation.turns.length > 0 && conversation.group === group,
        )
        if (items.length === 0) return null
        return (
          <NavigationPaneGroup
            key={group}
            className="group-data-[collapsible=icon]:hidden"
          >
            <NavigationPaneGroupLabel>{group}</NavigationPaneGroupLabel>
            <NavigationPaneGroupContent>
              <NavigationPaneMenu>
                {items.map((conversation) => (
                  <NavigationPaneMenuItem key={conversation.id}>
                    <Item
                      compact
                      variant={activeId === conversation.id ? "muted" : "default"}
                    >
                      <ItemPrimaryAction
                        type="button"
                        aria-pressed={activeId === conversation.id}
                        onClick={() => onSelect(conversation.id)}
                      >
                        <ItemContent>
                          <ItemTitle
                            className={
                              activeId === conversation.id
                                ? undefined
                                : "text-muted-foreground"
                            }
                          >
                            {conversation.title}
                          </ItemTitle>
                        </ItemContent>
                      </ItemPrimaryAction>
                      <ItemActions hosted>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild tooltip="More actions">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${conversation.title}`}
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent grouped align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </ItemActions>
                    </Item>
                  </NavigationPaneMenuItem>
                ))}
              </NavigationPaneMenu>
            </NavigationPaneGroupContent>
          </NavigationPaneGroup>
        )
      })}
    </NavigationPaneContent>
  )
}

function AIChatSidepanelFooter() {
  return (
    <NavigationPaneFooter>
      <NavigationPaneMenu>
        <NavigationPaneMenuItem>
          <Item compact asChild>
            <button type="button">
              <ItemMedia>
                <Avatar className="size-(--item-compact-media-host-size)">
                  <AvatarImage src={persona.avatar} alt="" />
                  <AvatarFallback>{persona.initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{persona.name}</ItemTitle>
              </ItemContent>
            </button>
          </Item>
        </NavigationPaneMenuItem>
      </NavigationPaneMenu>
    </NavigationPaneFooter>
  )
}

// Falls back to the placeholder title until the first message arrives, then
// derives a short title from it — same convention as most chat apps.
function deriveConversationTitle(prompt: string) {
  const trimmed = prompt.trim().replace(/\s+/g, " ")
  if (trimmed.length <= 48) return trimmed
  return `${trimmed.slice(0, 48).trimEnd()}\u2026`
}

function AIChatBlock({ layout = "auto" }: { layout?: ChatLayout } = {}) {
  const workspaceRef = useRef<HTMLDivElement>(null)
  const resolvedLayout = useResolvedChatLayout(layout, workspaceRef)
  const [conversations, setConversations] = useBroadcastState(
    "oneds:ai-chat:v1:conversations",
    starterConversations,
  )
  const [activeId, setActiveId] = useBroadcastState(
    "oneds:ai-chat:v1:active-id",
    starterConversations[0].id,
  )
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
          const firstUserTurn = turns.find((turn) => turn.role === "user")
          const title =
            conversation.turns.length === 0 &&
            conversation.title === "New conversation" &&
            firstUserTurn
              ? deriveConversationTitle(firstUserTurn.text)
              : conversation.title
          return { ...conversation, turns, title }
        })
        return changed ? next : current
      })
    },
    [setConversations],
  )
  // Reuses an existing blank conversation instead of piling up empty ones;
  // otherwise starts a genuinely new one so it never reopens a past chat.
  const startNewChat = useCallback(() => {
    const existingEmpty = conversations.find(
      (conversation) => conversation.turns.length === 0,
    )
    if (existingEmpty) {
      setActiveId(existingEmpty.id)
      return
    }
    const fresh: Conversation = {
      id: `new-${Date.now()}`,
      title: "New conversation",
      group: "Today",
      turns: [],
    }
    setConversations((current) => [fresh, ...current])
    setActiveId(fresh.id)
  }, [conversations, setConversations, setActiveId])

  if (!activeConversation) return null

  return (
    <div
      ref={workspaceRef}
      data-layout={resolvedLayout}
      className="ai-chat-workspace showcase-contained-viewport h-full w-full min-h-0 overflow-hidden"
    >
      <NavigationPaneProvider
        id="ai-chat-history"
        persist={false}
        className="min-h-full"
      >
        {resolvedLayout === "workspace" ? (
          <NavigationPane placement="floating" collapsible="bar" edge="faded">
            <AIChatSidepanelBrand />
            <Separator
              variant="faded"
              className="transition-opacity duration-(--navigation-pane-speed) ease-(--navigation-pane-ease) group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0"
            />
            <AIChatSidepanelSearch />
            <AIChatSidepanelChatAction
              isNewChat={activeConversation.turns.length === 0}
              onSelect={startNewChat}
            />
            <AIChatSidepanelNav
              conversations={conversations}
              activeId={activeId}
              onSelect={setActiveId}
            />
            <AIChatSidepanelFooter />
          </NavigationPane>
        ) : null}
        <NavigationPaneInset className="min-h-0 overflow-hidden">
          <MessageScrollerProvider defaultScrollPosition="start">
            <AIChatBlockContent
              conversation={activeConversation}
              layout={resolvedLayout}
              onTurnsChange={updateConversationTurns}
            />
          </MessageScrollerProvider>
        </NavigationPaneInset>
      </NavigationPaneProvider>
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
      "A complete conversational workspace composed from OneDS chat, feedback and composer primitives. It adapts to the width it is given: below --ai-chat-panel-max-width the composer docks to the bottom and the greeting and suggestions flow above it.",
    category: "Blocks",
    installCommand: null,
    Demo: AIChatBlock,
    examples: [
      {
        name: "Side panel",
        description:
          "The same block at 360px, the default and minimum content width of a browser side panel. The composer stays docked, and the greeting and suggestions flow above it.",
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
