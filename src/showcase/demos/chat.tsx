import { useCallback, useEffect, useRef, useState } from "react"
import {
  FileIcon,
  XIcon,
  CircleCheckIcon,
  ImageIcon,
  RotateCwIcon,
  PaperclipIcon,
  AlertCircleIcon,
  ThumbsUpIcon,
  CopyIcon,
  ShareIcon,
  ThumbsDownIcon,
  ClockIcon,
  LinkIcon,
  CheckIcon,
  PlusIcon,
  LoaderIcon,
  BookmarkIcon,
  GlobeIcon,
  SearchIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { persona, team } from "@/lib/persona"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"
import {
  Message,
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
  MessageFooter,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Markdown, Response, ResponseStream } from "@/components/ui/response"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"
import { Favicon } from "@/components/ui/favicon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const scrollerMessages = Array.from({ length: 8 }).map((_, i) => ({
  id: `msg-${i}`,
  align: i % 2 === 0 ? ("start" as const) : ("end" as const),
  text:
    i % 2 === 0
      ? `Question number ${i + 1}: how does this work?`
      : `Great question — here is answer ${i + 1}.`,
}))

const groupChatUsers = team.slice(0, 3)

const groupChatMessages = [
  { user: 0, text: "Has anyone reviewed the pull request?" },
  { user: 1, text: "I left a few comments on the tests." },
  { user: 2, text: "I'll take a look after lunch." },
  { user: 0, text: "Great, let's sync at 2 pm." },
  { user: 1, text: "Works for me." },
  { user: 2, text: "Same here. I'll have my feedback ready." },
  { user: 0, text: "Perfect — talk soon." },
]

// ---------------------------------------------------------------------------
// Scroller helper components
// ---------------------------------------------------------------------------

function ScrollStateDisplay() {
  const scrollable = useMessageScrollerScrollable()
  return (
    <div className="flex gap-2 text-xs text-muted-foreground">
      <span>start: {scrollable.start ? "true" : "false"}</span>
      <span>end: {scrollable.end ? "true" : "false"}</span>
    </div>
  )
}

function VisibilityDisplay() {
  const visibility = useMessageScrollerVisibility()
  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>anchor: {visibility.currentAnchorId ?? "none"}</span>
      <span>visible: {visibility.visibleMessageIds.join(", ") || "none"}</span>
    </div>
  )
}

function JumpControls({ ids }: { ids: string[] }) {
  const { scrollToMessage, scrollToStart, scrollToEnd } = useMessageScroller()
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button
        variant="secondary"
        size="default"
        onClick={() => scrollToStart({ behavior: "smooth" })}
      >
        Top
      </Button>
      {ids.slice(0, 3).map((id) => (
        <Button
          key={id}
          variant="secondary"
          size="default"
          onClick={() => scrollToMessage(id, { behavior: "smooth" })}
        >
          {id}
        </Button>
      ))}
      <Button
        variant="secondary"
        size="default"
        onClick={() => scrollToEnd({ behavior: "smooth" })}
      >
        Bottom
      </Button>
    </div>
  )
}

function FollowingEdgeDemo() {
  const [messages, setMessages] = useState(() =>
    scrollerMessages.slice(0, 4).map((m, i) => ({ ...m, id: `live-${i}` }))
  )
  const counterRef = useRef(4)
  const addMessage = useCallback(() => {
    const i = counterRef.current++
    const align = i % 2 === 0 ? ("start" as const) : ("end" as const)
    setMessages((prev) => [
      ...prev,
      {
        id: `live-${i}`,
        align,
        text: align === "start" ? `New question ${i + 1}` : `New answer ${i + 1}`,
      },
    ])
  }, [])
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="h-64 w-full rounded-lg border">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {messages.map((m) => (
                <MessageScrollerItem key={m.id} id={m.id}>
                  <Message align={m.align}>
                    <MessageContent>
                      <Bubble
                        variant={m.align === "start" ? "secondary" : "default"}
                      >
                        <BubbleContent>{m.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button variant="secondary" size="default" onClick={addMessage}>
        <PlusIcon aria-hidden /> Add message
      </Button>
    </div>
  )
}

function LoadEarlierDemo() {
  const [remaining, setRemaining] = useState(10)
  const [messages, setMessages] = useState(() =>
    Array.from({ length: 4 }).map((_, i) => ({
      id: `early-${i + 10}`,
      text: `Message ${i + 10 + 1}`,
      align: i % 2 === 0 ? ("start" as const) : ("end" as const),
    }))
  )
  const loadEarlier = useCallback(() => {
    const batch = Array.from({ length: 3 }).map((_, i) => {
      const idx = remaining - 1 - i
      return {
        id: `early-${idx}`,
        text: `Earlier message ${idx + 1}`,
        align: idx % 2 === 0 ? ("start" as const) : ("end" as const),
      }
    })
    setRemaining((value) => Math.max(0, value - 3))
    setMessages((prev) => [...batch.reverse(), ...prev])
  }, [remaining])
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Button
        variant="secondary"
        size="default"
        onClick={loadEarlier}
        disabled={remaining <= 0}
      >
        Load earlier
      </Button>
      <MessageScrollerProvider>
        <MessageScroller className="h-64 w-full rounded-lg border">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {messages.map((m) => (
                <MessageScrollerItem key={m.id} id={m.id}>
                  <Message align={m.align}>
                    <MessageContent>
                      <Bubble
                        variant={m.align === "start" ? "secondary" : "default"}
                      >
                        <BubbleContent>{m.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

function AIComposerAddMenu() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [webSearch, setWebSearch] = useState(false)
  const [deepResearch, setDeepResearch] = useState(false)

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="sr-only"
        aria-label="Add files"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label="Add images"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AIComposerAction aria-label="Add to prompt">
            <PlusIcon aria-hidden />
          </AIComposerAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start">
          <DropdownMenuLabel>Add to prompt</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              <PaperclipIcon aria-hidden />
              Add files
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => imageInputRef.current?.click()}>
              <ImageIcon aria-hidden />
              Add images
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Tools</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={webSearch}
            onCheckedChange={(checked) => setWebSearch(checked === true)}
          >
            <GlobeIcon aria-hidden />
            Search web
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={deepResearch}
            onCheckedChange={(checked) => setDeepResearch(checked === true)}
          >
            <SearchIcon aria-hidden />
            Deep research
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
      {deepResearch ? (
        <AIComposerTool
          variant="secondary"
          aria-pressed="true"
          onClick={() => setDeepResearch(false)}
        >
          <SearchIcon data-icon="inline-start" />
          Deep research
        </AIComposerTool>
      ) : null}
    </>
  )
}

function AIComposerDemo() {
  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState<AIComposerStatus>("ready")

  return (
    <AIComposer
      status={status}
      onSubmit={(event) => {
        event.preventDefault()
        if (!prompt.trim()) return
        setStatus("streaming")
      }}
    >
      <AIComposerInput
        aria-label="Message"
        placeholder="Ask anything"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
      <AIComposerFooter>
        <AIComposerTools>
          <AIComposerAddMenu />
        </AIComposerTools>
        <AIComposerActions>
          <AIComposerSubmit
            status={status}
            onClick={
              status === "streaming" ? () => setStatus("ready") : undefined
            }
          />
        </AIComposerActions>
      </AIComposerFooter>
    </AIComposer>
  )
}

function AIComposerAttachmentsDemo() {
  const [attachments, setAttachments] = useState([
    { name: "research-notes.pdf", size: "1.2 MB" },
    { name: "interview-summary.docx", size: "840 KB" },
    { name: "usage-metrics.csv", size: "2.1 MB" },
    { name: "roadmap.png", size: "3.4 MB" },
    { name: "project-brief.pdf", size: "960 KB" },
    { name: "launch-plan.docx", size: "1.7 MB" },
  ])

  return (
    <AIComposer>
      {attachments.length > 0 ? (
        <AIComposerHeader>
          <AttachmentGroup>
            {attachments.map((attachment) => (
              <Attachment key={attachment.name} size="sm">
                <AttachmentMedia variant="icon">
                  <FileIcon aria-hidden />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{attachment.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {attachment.size}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${attachment.name}`}
                    onClick={() =>
                      setAttachments((current) =>
                        current.filter(
                          (item) => item.name !== attachment.name
                        )
                      )
                    }
                  >
                    <XIcon aria-hidden />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </AttachmentGroup>
        </AIComposerHeader>
      ) : null}
      <AIComposerInput
        aria-label="Message"
        defaultValue="Summarize the key findings in this document."
      />
      <AIComposerFooter>
        <AIComposerTools>
          <AIComposerAddMenu />
        </AIComposerTools>
        <AIComposerActions>
          <AIComposerSubmit />
        </AIComposerActions>
      </AIComposerFooter>
    </AIComposer>
  )
}

function AIComposerToolsDemo() {
  return (
    <AIComposer>
      <AIComposerInput aria-label="Message" placeholder="Ask anything" />
      <AIComposerFooter>
        <AIComposerTools>
          <AIComposerAddMenu />
        </AIComposerTools>
        <AIComposerActions>
          <AIComposerSubmit />
        </AIComposerActions>
      </AIComposerFooter>
    </AIComposer>
  )
}

function AIComposerStatesDemo() {
  const states: Array<{
    status: AIComposerStatus
    label: string
    prompt: string
  }> = [
    { status: "ready", label: "Ready", prompt: "Draft a project update" },
    { status: "submitted", label: "Submitted", prompt: "Creating a draft…" },
    { status: "streaming", label: "Streaming", prompt: "Creating a draft…" },
    { status: "error", label: "Error", prompt: "Retry the last request" },
  ]

  return (
    <div className="grid w-full max-w-(--ai-composer-max-width) gap-4">
      {states.map(({ status, label, prompt }) => (
        <div key={status} className="grid gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <AIComposer status={status}>
            <AIComposerInput
              aria-label={`${label} message`}
              defaultValue={prompt}
              readOnly
            />
            <AIComposerFooter>
              <AIComposerTools>
                <AIComposerAddMenu />
              </AIComposerTools>
              <AIComposerActions>
                <AIComposerSubmit status={status} />
              </AIComposerActions>
            </AIComposerFooter>
          </AIComposer>
        </div>
      ))}
      <div className="grid gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Disabled
        </span>
        <AIComposer>
          <fieldset disabled className="contents">
            <AIComposerInput aria-label="Disabled message" placeholder="Ask anything" />
            <AIComposerFooter>
              <AIComposerTools>
                <AIComposerAddMenu />
              </AIComposerTools>
              <AIComposerActions>
                <AIComposerSubmit />
              </AIComposerActions>
            </AIComposerFooter>
          </fieldset>
        </AIComposer>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Response
// ---------------------------------------------------------------------------

const responseAnswers = [
  "Start with the smallest complete experience, keep every visual decision token-driven, and introduce a new abstraction only when the pattern repeats.",
  "Ship the smallest thing that works end to end, drive every visual decision from a token, and only reach for a new abstraction once the same pattern appears a third time.",
]

/** How fast the simulated source grows, not a design value. ResponseStream's
    throttle smooths this into a steady character reveal regardless. */
const responseStreamStepMs = 45
/** Mirrors --ai-chat-copy-reset-delay so the confirmation reads the same. */
const responseCopyResetMs = 1500

function ResponseDemo() {
  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <p>{responseAnswers[0]}</p>
              </Response>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function ResponseStreamingDemo() {
  const [text, setText] = useState(responseAnswers[0])
  const [streaming, setStreaming] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current === null) return
    window.clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  useEffect(() => clear, [clear])

  function start() {
    clear()
    const words = responseAnswers[0].split(" ")
    let shown = 0
    setText("")
    setStreaming(true)
    timerRef.current = window.setInterval(() => {
      shown += 1
      setText(words.slice(0, shown).join(" "))
      if (shown < words.length) return
      clear()
      setStreaming(false)
    }, responseStreamStepMs)
  }

  function stop() {
    clear()
    setStreaming(false)
  }

  return (
    <div className="flex w-full max-w-(--response-max-width) flex-col gap-4">
      <Message align="start">
        <MessageContent>
          <MessageHeader>
            {streaming ? "Responding" : "Assistant"}
          </MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <ResponseStream text={text} streaming={streaming} />
              </Response>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="default"
          onClick={start}
          disabled={streaming}
        >
          Stream response
        </Button>
        <Button
          variant="secondary"
          size="default"
          onClick={stop}
          disabled={!streaming}
        >
          Stop
        </Button>
      </div>
    </div>
  )
}

const responseMarkdownSample = `A response can render straight from a **markdown string**, so real model output arrives with full structure instead of hand-authored markup.

## What you get

- GitHub-flavored lists with \`inline code\` and [links](#/message)
- Tables, quotes and fenced code, all from tokens
- ~~Guesswork~~ replaced by a real type scale

### Checklist

- [x] Parse the markdown
- [x] Close partial tokens while streaming
- [ ] Wire callouts and citations

### Coverage

| Element | Source |
| --- | --- |
| Code block | CodeBlock |
| Divider | Separator tokens |
| Callout | Alert |

> Rendered from text, styled by the surface.

### Callouts

> [!TIP]
> GitHub alert syntax maps straight onto the Alert component.

> [!CAUTION]
> The most severe type carries the destructive treatment.

![A generated preview](https://picsum.photos/seed/oneds/640/320)

\`\`\`tsx
<Response>
  <Markdown>{answer}</Markdown>
</Response>
\`\`\`
`

const responseMarkdownStreamSample = `Streaming keeps the structure intact **as it arrives**[^1], so partial tokens never flash raw syntax.

## How it stays clean

1. Preprocess the partial string.
2. Close any open \`**\`, links, and fences.
3. Render the completed block[^2].

> [!TIP]
> Callouts and citations stream through the same pipeline.

\`\`\`ts
const stream = createStream(answer)
\`\`\`

[^1]: [Streaming reveal](#/response) — the throttle that paces the text.
[^2]: [Remend](https://github.com/vercel/streamdown) — closes partial tokens.
`

function ResponseMarkdownDemo() {
  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <Markdown>{responseMarkdownSample}</Markdown>
              </Response>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function ResponseStreamingMarkdownDemo() {
  const [text, setText] = useState(responseMarkdownStreamSample)
  const [streaming, setStreaming] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current === null) return
    window.clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  useEffect(() => clear, [clear])

  function start() {
    clear()
    // Deliver word bursts; the throttle inside Markdown smooths them.
    const tokens = responseMarkdownStreamSample.match(/\S+\s*/g) ?? []
    let shown = 0
    setText("")
    setStreaming(true)
    timerRef.current = window.setInterval(() => {
      shown += 1
      setText(tokens.slice(0, shown).join(""))
      if (shown < tokens.length) return
      clear()
      setStreaming(false)
    }, responseStreamStepMs)
  }

  return (
    <div className="flex w-full max-w-(--response-max-width) flex-col gap-4">
      <Message align="start">
        <MessageContent>
          <MessageHeader>
            {streaming ? "Responding" : "Assistant"}
          </MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response streaming={streaming}>
                <Markdown streaming={streaming}>{text}</Markdown>
              </Response>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="default"
          onClick={start}
          disabled={streaming}
        >
          Stream markdown
        </Button>
      </div>
    </div>
  )
}

const responseMathSample = `Inline math like $E = mc^2$ sits in the sentence, and a block equation stands on its own:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

The sum $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$ renders inline too.
`

function ResponseMathDemo() {
  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <Markdown>{responseMathSample}</Markdown>
              </Response>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function ResponseRichContentDemo() {
  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <p>
                  A response is ordinary markup, so{" "}
                  <strong>anything the library already ships</strong> can sit
                  inside one — <code>Response</code> just owns the rhythm and{" "}
                  <a href="#/message">message parts</a> stay responsible for the
                  turn around it.
                </p>
                <h2>What changed</h2>
                <p>Hierarchy now comes from tokens, not guesswork:</p>
                <ul>
                  <li>Headings carry a real type scale.</li>
                  <li>
                    Spacing is relationship-aware:
                    <ul>
                      <li>more lead above a heading,</li>
                      <li>a tighter gap to what it introduces.</li>
                    </ul>
                  </li>
                  <li>
                    Inline elements like <del>the old defaults</del> read
                    clearly.
                  </li>
                </ul>
                <h3>Order of operations</h3>
                <ol>
                  <li>Style the elements from tokens.</li>
                  <li>Compose existing components.</li>
                  <li>Keep motion communicating state.</li>
                </ol>
                <blockquote>
                  <p>Motion communicates state instead of decorating it.</p>
                </blockquote>
                <figure>
                  <img
                    src="https://picsum.photos/seed/oneds/640/360"
                    alt="A generated preview"
                  />
                  <figcaption>Figures and captions are tokenized too.</figcaption>
                </figure>
                <hr />
                <h3>Coverage</h3>
                <div className="response-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Element</th>
                        <th>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Code block</td>
                        <td>CodeBlock</td>
                      </tr>
                      <tr>
                        <td>Divider</td>
                        <td>Separator tokens</td>
                      </tr>
                      <tr>
                        <td>Callout</td>
                        <td>Alert</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <CodeBlock
                  language="tsx"
                  code={
                    "<Response>\n  <h2>Heading</h2>\n  <p>Rich <code>markup</code>.</p>\n</Response>"
                  }
                  showLineNumbers={false}
                />
              </Response>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function ResponseActionsDemo() {
  const [index, setIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [rating, setRating] = useState<"up" | "down" | null>(null)
  const resetRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (resetRef.current !== null) window.clearTimeout(resetRef.current)
    },
    []
  )

  function copy() {
    navigator.clipboard.writeText(responseAnswers[index]).catch(() => {})
    setCopied(true)
    if (resetRef.current !== null) window.clearTimeout(resetRef.current)
    resetRef.current = window.setTimeout(
      () => setCopied(false),
      responseCopyResetMs
    )
  }

  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <p>{responseAnswers[index]}</p>
              </Response>
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <MessageActions>
              <Button
                variant="ghost"
                size="icon"
                aria-label={copied ? "Copied" : "Copy response"}
                onClick={copy}
              >
                {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Helpful"
                aria-pressed={rating === "up"}
                onClick={() => setRating((v) => (v === "up" ? null : "up"))}
              >
                <ThumbsUpIcon aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Not helpful"
                aria-pressed={rating === "down"}
                onClick={() => setRating((v) => (v === "down" ? null : "down"))}
              >
                <ThumbsDownIcon aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Regenerate"
                onClick={() =>
                  setIndex((v) => (v + 1) % responseAnswers.length)
                }
              >
                <RotateCwIcon aria-hidden />
              </Button>
            </MessageActions>
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

const responseCitationsSample = `The review settled on three priorities[^1], and both documents agree on the ordering[^2].

[^1]: [Design review notes](#/message) — priorities and their rationale.
[^2]: [Component inventory](#/bubble) — coverage and current gaps.
`

function ResponseCitationsDemo() {
  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <Markdown>{responseCitationsSample}</Markdown>
              </Response>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function ResponseSourcesDemo() {
  const sources = [
    {
      label: "Fluent UI components",
      href: "https://github.com/microsoft/fluentui",
    },
    {
      label: "shadcn/ui components",
      href: "https://github.com/shadcn-ui/ui",
    },
  ]

  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              <Response>
                <p>
                  The review compared two component libraries before settling
                  on three priorities.
                </p>
              </Response>
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <MessageActions>
              {sources.map((source) => (
                <Badge key={source.label} asChild variant="tertiary">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Favicon
                      domain={source.href}
                      alt=""
                      data-icon="inline-start"
                    />
                    {source.label}
                  </a>
                </Badge>
              ))}
            </MessageActions>
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function ResponseErrorDemo() {
  const [failed, setFailed] = useState(true)

  return (
    <MessageGroup className="w-full max-w-(--response-max-width)">
      <Message align="start">
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          {failed ? (
            <Alert variant="destructive" live="assertive">
              <AlertCircleIcon aria-hidden />
              <AlertTitle>Response stopped</AlertTitle>
              <AlertDescription>
                The connection dropped before the answer finished.
              </AlertDescription>
              <AlertAction>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => setFailed(false)}
                >
                  <RotateCwIcon aria-hidden />
                  Retry
                </Button>
              </AlertAction>
            </Alert>
          ) : (
            <Bubble variant="ghost">
              <BubbleContent>
                <Response>
                  <p>{responseAnswers[0]}</p>
                </Response>
              </BubbleContent>
            </Bubble>
          )}
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

export const chatDemos: ComponentEntry[] = [
  // =======================================================================
  // AI COMPOSER
  // =======================================================================
  {
    slug: "ai-composer",
    name: "AI Composer",
    description:
      "A flexible prompt composer with attachments, tools and generation states. Full-page rule: anchor the composer above the viewport center, then attach the greeting and suggestions around it instead of centering the combined lockup.",
    category: "Chat",
    installCommand: null,
    Demo: AIComposerDemo,
    code: `import { useState } from "react"
  import { PaperclipIcon, PlusIcon } from "@/components/ui/icons"
import {
  AIComposer,
  AIComposerAction,
  AIComposerActions,
  AIComposerFooter,
  AIComposerInput,
  AIComposerSubmit,
  AIComposerTools,
  type AIComposerStatus,
} from "@/components/ui/ai-composer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AIComposerDemo() {
  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState<AIComposerStatus>("ready")

  return (
    <AIComposer
      status={status}
      onSubmit={(event) => {
        event.preventDefault()
        if (prompt.trim()) setStatus("streaming")
      }}
    >
      <AIComposerInput
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
              <DropdownMenuItem>
                <PaperclipIcon />
                Add files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </AIComposerTools>
        <AIComposerActions>
          <AIComposerSubmit
            status={status}
            onClick={status === "streaming" ? () => setStatus("ready") : undefined}
          />
        </AIComposerActions>
      </AIComposerFooter>
    </AIComposer>
  )
}`,
    examples: [
      {
        name: "Attachments",
        description:
          "Place existing Attachment components in the composer's header region.",
        layout: "wide",
        Demo: AIComposerAttachmentsDemo,
      },
      {
        name: "Tools",
        description:
          "Compose icon actions and persistent tools without changing the prompt layout.",
        layout: "wide",
        Demo: AIComposerToolsDemo,
      },
      {
        name: "States",
        description:
          "Ready, submitted, streaming, error and disabled states keep one stable geometry.",
        layout: "wide",
        Demo: AIComposerStatesDemo,
      },
    ],
  },

  // =======================================================================
  // BUBBLE
  // =======================================================================
  {
    slug: "bubble",
    name: "Bubble",
    description: "Chat bubbles for conversational interfaces.",
    category: "Chat",
    Demo: () => (
      <BubbleGroup className="w-full max-w-sm">
        <Bubble align="start" variant="secondary">
          <BubbleContent>Hey! Are you coming to the launch?</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Absolutely — wouldn't miss it.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    ),
    code: `import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

export function BubbleDemo() {
  return (
    <BubbleGroup>
      <Bubble align="start" variant="secondary">
        <BubbleContent>Hey! Are you coming to the launch?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Absolutely — wouldn't miss it.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}`,
    examples: [
      {
        name: "Variants",
        Demo: () => (
          <BubbleGroup className="w-full max-w-md">
            {(
              [
                "default",
                "secondary",
                "muted",
                "tinted",
                "outline",
                "ghost",
                "destructive",
              ] as const
            ).map((v) => (
              <Bubble key={v} variant={v}>
                <BubbleContent>{v}</BubbleContent>
              </Bubble>
            ))}
          </BubbleGroup>
        ),
      },
      {
        name: "Links and Buttons",
        Demo: () => (
          <BubbleGroup className="w-full max-w-sm">
            <Bubble variant="secondary">
              <BubbleContent asChild>
                <a
                  href="#bubble-link"
                  onClick={(e) => e.preventDefault()}
                  className="underline underline-offset-2"
                >
                  View the documentation
                </a>
              </BubbleContent>
            </Bubble>
            <Bubble variant="outline">
              <BubbleContent asChild>
                <button type="button" className="text-left">
                  Retry this action
                </button>
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        ),
      },
      {
        name: "Reactions",
        Demo: function ReactionsDemo() {
          const [counts, setCounts] = useState({ thumbsUp: 2, heart: 1 })
          return (
            <BubbleGroup className="w-full max-w-sm pb-4">
              <Bubble variant="secondary">
                <BubbleContent>This looks great!</BubbleContent>
                <BubbleReactions side="bottom" align="start">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs hover:bg-muted/80"
                    onClick={() =>
                      setCounts((c) => ({ ...c, thumbsUp: c.thumbsUp + 1 }))
                    }
                    aria-label={`Thumbs up, ${counts.thumbsUp}`}
                  >
                    <span className="text-sm leading-none" aria-hidden>
                      👍
                    </span>
                    {counts.thumbsUp}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs hover:bg-muted/80"
                    onClick={() =>
                      setCounts((c) => ({ ...c, heart: c.heart + 1 }))
                    }
                    aria-label={`Heart, ${counts.heart}`}
                  >
                    <span className="text-sm leading-none" aria-hidden>
                      ❤️
                    </span>
                    {counts.heart}
                  </button>
                </BubbleReactions>
              </Bubble>
            </BubbleGroup>
          )
        },
      },
      {
        name: "Show More / Collapsible",
        Demo: function ShowMoreDemo() {
          const [open, setOpen] = useState(false)
          return (
            <BubbleGroup className="w-full max-w-sm">
              <Bubble variant="ghost">
                <Collapsible open={open} onOpenChange={setOpen}>
                  <BubbleContent>
                    <p>
                      Here is the summary of the changes we discussed in the
                      last meeting.
                    </p>
                    <CollapsibleContent>
                      <p className="mt-2 text-muted-foreground">
                        We agreed to refactor the authentication module, update
                        the database schema to support multi-tenancy, and revise
                        the onboarding flow. The timeline is two sprints starting
                        next Monday.
                      </p>
                    </CollapsibleContent>
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="mt-1 text-sm font-medium text-primary"
                      >
                        {open ? "Show less" : "Show more"}
                      </button>
                    </CollapsibleTrigger>
                  </BubbleContent>
                </Collapsible>
              </Bubble>
            </BubbleGroup>
          )
        },
      },
      {
        name: "Tooltip",
        Demo: () => (
          <BubbleGroup className="w-full max-w-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Bubble variant="secondary">
                    <BubbleContent>
                      Hover me for delivery info
                    </BubbleContent>
                  </Bubble>
                </div>
              </TooltipTrigger>
              <TooltipContent>Sent at 2:34 pm</TooltipContent>
            </Tooltip>
          </BubbleGroup>
        ),
      },
      {
        name: "Popover",
        Demo: () => (
          <BubbleGroup className="w-full max-w-sm">
            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <Bubble>
                    <BubbleContent>
                      <button type="button" className="text-left">
                        Click for details
                      </button>
                    </BubbleContent>
                  </Bubble>
                </div>
              </PopoverTrigger>
              <PopoverContent align="start">
                <PopoverHeader>
                  <PopoverTitle>Message info</PopoverTitle>
                  <PopoverDescription>
                    Delivered at 2:34 pm. Read by 3 people.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </BubbleGroup>
        ),
      },
    ],
  },

  // =======================================================================
  // MESSAGE
  // =======================================================================
  {
    slug: "message",
    name: "Message",
    description: "A message row with avatar, content and metadata.",
    category: "Chat",
    Demo: () => (
      <MessageGroup className="w-full max-w-sm">
        <Message align="start">
          <MessageAvatar>
            <Avatar>
              <AvatarImage src={persona.avatar} alt="" />
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="secondary">
              <BubbleContent>Hi there! How can I help today?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageContent>
            <Bubble>
              <BubbleContent>
                I'd like to add all shadcn components.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>
    ),
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message"

export function MessageDemo() {
  return (
    <MessageGroup>
      <Message align="start">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>{persona.initials}</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="secondary">
            <BubbleContent>Hi there!</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}`,
    examples: [
      {
        name: "Header and Footer",
        Demo: () => (
          <MessageGroup className="w-full max-w-sm">
            <Message align="start">
              <MessageAvatar>
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <span>Assistant</span>
                  <span className="ml-auto text-muted-foreground">2:30 pm</span>
                </MessageHeader>
                <Bubble variant="secondary">
                  <BubbleContent>
                    Here is the report you requested.
                  </BubbleContent>
                </Bubble>
                <MessageFooter>
                  <span className="text-muted-foreground">Read</span>
                </MessageFooter>
              </MessageContent>
            </Message>
          </MessageGroup>
        ),
      },
      {
        name: "Actions",
        Demo: function ActionsDemo() {
          const [copied, setCopied] = useState(false)
          const [liked, setLiked] = useState<boolean | null>(null)
          return (
            <MessageGroup className="w-full max-w-sm">
              <Message align="start">
                <MessageAvatar>
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <Bubble variant="secondary">
                    <BubbleContent>
                      The deployment succeeded with zero errors.
                    </BubbleContent>
                  </Bubble>
                  <MessageFooter>
                    <MessageActions>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={copied ? "Copied" : "Copy message"}
                        onClick={() => setCopied(true)}
                      >
                        {copied ? (
                          <CheckIcon aria-hidden />
                        ) : (
                          <CopyIcon aria-hidden />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Like"
                        aria-pressed={liked === true}
                        onClick={() => setLiked((v) => (v === true ? null : true))}
                      >
                        <ThumbsUpIcon aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Dislike"
                        aria-pressed={liked === false}
                        onClick={() =>
                          setLiked((v) => (v === false ? null : false))
                        }
                      >
                        <ThumbsDownIcon aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Share"
                      >
                        <ShareIcon aria-hidden />
                      </Button>
                    </MessageActions>
                  </MessageFooter>
                </MessageContent>
              </Message>
            </MessageGroup>
          )
        },
      },
      {
        name: "Attachment",
        Demo: () => (
          <MessageGroup className="w-full max-w-sm">
            <Message align="end">
              <MessageContent>
                <Bubble>
                  <BubbleContent>
                    Here are the files you asked for.
                  </BubbleContent>
                </Bubble>
                <AttachmentGroup>
                  <Attachment size="sm">
                    <AttachmentMedia variant="icon">
                      <FileIcon aria-hidden />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>report.pdf</AttachmentTitle>
                      <AttachmentDescription>1.2 MB</AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                  <Attachment size="sm">
                    <AttachmentMedia variant="icon">
                      <ImageIcon aria-hidden />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>screenshot.png</AttachmentTitle>
                      <AttachmentDescription>340 KB</AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                </AttachmentGroup>
              </MessageContent>
            </Message>
          </MessageGroup>
        ),
      },
    ],
  },

  // =======================================================================
  // RESPONSE
  // =======================================================================
  {
    slug: "response",
    name: "Response",
    description:
      "The assistant's answer surface: streaming text, rich content, and the actions a reader takes on it.",
    category: "Chat",
    installCommand: null,
    Demo: ResponseDemo,
    code: `import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent, MessageHeader } from "@/components/ui/message"
import { Response } from "@/components/ui/response"

export function ResponseDemo() {
  return (
    <Message align="start">
      <MessageContent>
        <MessageHeader>Assistant</MessageHeader>
        <Bubble variant="ghost">
          <BubbleContent>
            <Response streaming>
              <p>Partial answer…</p>
            </Response>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}`,
    examples: [
      {
        name: "Streaming",
        description:
          "A caret trails the last block while the answer is still arriving.",
        Demo: ResponseStreamingDemo,
      },
      {
        name: "From Markdown",
        description:
          "Real model output is a markdown string; it renders as tokenized content.",
        Demo: ResponseMarkdownDemo,
      },
      {
        name: "Streaming Markdown",
        description:
          "Unterminated markdown is closed on the fly, so partial tokens never flash raw syntax.",
        Demo: ResponseStreamingMarkdownDemo,
      },
      {
        name: "Rich Content",
        description:
          "Headings, lists and a real code block inside one response.",
        Demo: ResponseRichContentDemo,
      },
      {
        name: "Math",
        description: "Inline and block LaTeX render with KaTeX.",
        Demo: ResponseMathDemo,
      },
      {
        name: "Actions",
        description:
          "Copy, rate and regenerate sit in the message footer, not the answer.",
        Demo: ResponseActionsDemo,
      },
      {
        name: "Sources",
        description: "Cited documents follow the answer as real links.",
        Demo: ResponseSourcesDemo,
      },
      {
        name: "Citations",
        description:
          "Inline footnote markers link to an auto-generated Sources list.",
        Demo: ResponseCitationsDemo,
      },
      {
        name: "Error and Retry",
        description:
          "A failed answer replaces the bubble and offers the retry.",
        Demo: ResponseErrorDemo,
      },
    ],
  },

  // =======================================================================
  // MESSAGE SCROLLER
  // =======================================================================
  {
    slug: "message-scroller",
    name: "Message Scroller",
    description: "A virtualized, auto-scrolling container for chat messages.",
    category: "Chat",
    Demo: () => (
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="h-80 w-full max-w-sm rounded-lg border">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {scrollerMessages.map((m) => (
                <MessageScrollerItem key={m.id} id={m.id}>
                  <Message align={m.align}>
                    <MessageContent>
                      <Bubble
                        variant={m.align === "start" ? "secondary" : "default"}
                      >
                        <BubbleContent>{m.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>
    ),
    code: `import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

export function MessageScrollerDemo() {
  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="h-80 rounded-lg border">
        <MessageScrollerViewport className="p-4">
          <MessageScrollerContent>
            {messages.map((m) => (
              <MessageScrollerItem key={m.id} id={m.id}>
                {m.text}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`,
    examples: [
      {
        name: "Anchoring Turns",
        description:
          "Use scrollAnchor to pin the viewport to a specific turn.",
        layout: "wide",
        Demo: () => (
          <MessageScrollerProvider defaultScrollPosition="last-anchor">
            <MessageScroller className="h-80 w-full max-w-sm rounded-lg border">
              <MessageScrollerViewport className="p-4">
                <MessageScrollerContent>
                  {scrollerMessages.map((m, i) => (
                    <MessageScrollerItem
                      key={m.id}
                      id={m.id}
                      scrollAnchor={i === 3}
                    >
                      <Message align={m.align}>
                        <MessageContent>
                          <Bubble
                            variant={
                              m.align === "start" ? "secondary" : "default"
                            }
                          >
                            <BubbleContent>
                              {i === 3 ? `[anchored] ${m.text}` : m.text}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        ),
      },
      {
        name: "Group Chat",
        layout: "wide",
        Demo: () => (
          <MessageScrollerProvider autoScroll>
            <MessageScroller className="h-80 w-full max-w-md rounded-lg border">
              <MessageScrollerViewport className="p-4">
                <MessageScrollerContent>
                  {groupChatMessages.map((m, i) => {
                    const u = groupChatUsers[m.user]
                    const isMe = m.user === 0
                    return (
                      <MessageScrollerItem key={`gc-${i}`} id={`gc-${i}`}>
                        <Message align={isMe ? "end" : "start"}>
                          {!isMe && (
                            <MessageAvatar>
                              <Avatar className="size-7">
                                {u.avatar ? (
                                  <AvatarImage src={u.avatar} alt={u.name} />
                                ) : null}
                                <AvatarFallback className="text-xs">
                                  {u.initials}
                                </AvatarFallback>
                              </Avatar>
                            </MessageAvatar>
                          )}
                          <MessageContent>
                            {!isMe && (
                              <MessageHeader>
                                <span>{u.name}</span>
                              </MessageHeader>
                            )}
                            <Bubble
                              variant={isMe ? "default" : "secondary"}
                              align={isMe ? "end" : "start"}
                            >
                              <BubbleContent>{m.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    )
                  })}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        ),
      },
      {
        name: "Keeping Context Visible",
        description:
          "scrollPreviousItemPeek keeps the prior message partially visible.",
        layout: "wide",
        Demo: () => (
          <MessageScrollerProvider
            defaultScrollPosition="last-anchor"
            scrollPreviousItemPeek={60}
          >
            <MessageScroller className="h-64 w-full max-w-sm rounded-lg border">
              <MessageScrollerViewport className="p-4">
                <MessageScrollerContent>
                  {scrollerMessages.map((m, i) => (
                    <MessageScrollerItem
                      key={m.id}
                      id={m.id}
                      scrollAnchor={i === 3}
                    >
                      <Message align={m.align}>
                        <MessageContent>
                          <Bubble
                            variant={
                              m.align === "start" ? "secondary" : "default"
                            }
                          >
                            <BubbleContent>{m.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        ),
      },
      {
        name: "Following the Live Edge",
        description:
          "autoScroll keeps the viewport pinned to the newest message.",
        layout: "wide",
        Demo: FollowingEdgeDemo,
      },
      {
        name: "Opening Saved Threads",
        description:
          'defaultScrollPosition="start" opens the thread at the top.',
        layout: "wide",
        Demo: () => (
          <MessageScrollerProvider defaultScrollPosition="start">
            <MessageScroller className="h-64 w-full max-w-sm rounded-lg border">
              <MessageScrollerViewport className="p-4">
                <MessageScrollerContent>
                  {scrollerMessages.map((m) => (
                    <MessageScrollerItem key={m.id} id={m.id}>
                      <Message align={m.align}>
                        <MessageContent>
                          <Bubble
                            variant={
                              m.align === "start" ? "secondary" : "default"
                            }
                          >
                            <BubbleContent>{m.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton direction="end" />
            </MessageScroller>
          </MessageScrollerProvider>
        ),
      },
      {
        name: "Loading Earlier Messages",
        description: "Prepend older messages above the current viewport.",
        layout: "wide",
        Demo: LoadEarlierDemo,
      },
      {
        name: "Animating New Messages",
        description:
          "New messages slide in from the bottom with CSS animation.",
        layout: "wide",
        Demo: function AnimatingDemo() {
          const [messages, setMessages] = useState(() =>
            scrollerMessages.slice(0, 3).map((m, i) => ({
              ...m,
              id: `anim-${i}`,
            }))
          )
          const counterRef = useRef(3)
          return (
            <div className="flex w-full max-w-sm flex-col gap-2">
              <MessageScrollerProvider autoScroll>
                <MessageScroller className="h-64 w-full rounded-lg border">
                  <MessageScrollerViewport className="p-4">
                    <MessageScrollerContent>
                      {messages.map((m) => (
                        <MessageScrollerItem key={m.id} id={m.id}>
                          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-(--speed-brisk)">
                            <Message align={m.align}>
                              <MessageContent>
                                <Bubble
                                  variant={
                                    m.align === "start"
                                      ? "secondary"
                                      : "default"
                                  }
                                >
                                  <BubbleContent>{m.text}</BubbleContent>
                                </Bubble>
                              </MessageContent>
                            </Message>
                          </div>
                        </MessageScrollerItem>
                      ))}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                </MessageScroller>
              </MessageScrollerProvider>
              <Button
                variant="secondary"
                size="default"
                onClick={() => {
                  const i = counterRef.current++
                  const align =
                    i % 2 === 0 ? ("start" as const) : ("end" as const)
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `anim-${i}`,
                      align,
                      text:
                        align === "start"
                          ? `Question ${i + 1}`
                          : `Answer ${i + 1}`,
                    },
                  ])
                }}
              >
                <PlusIcon aria-hidden /> Send animated
              </Button>
            </div>
          )
        },
      },
      {
        name: "Jumping to Messages",
        description: "scrollToMessage navigates to a specific item by ID.",
        layout: "wide",
        Demo: () => {
          const ids = scrollerMessages.map((m) => m.id)
          return (
            <MessageScrollerProvider>
              <div className="flex w-full max-w-sm flex-col gap-2">
                <JumpControls ids={ids} />
                <MessageScroller className="h-64 w-full rounded-lg border">
                  <MessageScrollerViewport className="p-4">
                    <MessageScrollerContent>
                      {scrollerMessages.map((m) => (
                        <MessageScrollerItem key={m.id} id={m.id}>
                          <Message align={m.align}>
                            <MessageContent>
                              <Bubble
                                variant={
                                  m.align === "start"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                <BubbleContent>
                                  [{m.id}] {m.text}
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      ))}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                </MessageScroller>
              </div>
            </MessageScrollerProvider>
          )
        },
      },
      {
        name: "Tracking the Reader's Position",
        description:
          "useMessageScrollerVisibility exposes visible IDs and anchor.",
        layout: "wide",
        Demo: () => (
          <MessageScrollerProvider autoScroll>
            <div className="flex w-full max-w-sm flex-col gap-2">
              <MessageScroller className="h-64 w-full rounded-lg border">
                <MessageScrollerViewport className="p-4">
                  <MessageScrollerContent>
                    {scrollerMessages.map((m) => (
                      <MessageScrollerItem key={m.id} id={m.id}>
                        <Message align={m.align}>
                          <MessageContent>
                            <Bubble
                              variant={
                                m.align === "start" ? "secondary" : "default"
                              }
                            >
                              <BubbleContent>
                                [{m.id}] {m.text}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
              </MessageScroller>
              <VisibilityDisplay />
            </div>
          </MessageScrollerProvider>
        ),
      },
      {
        name: "Reading Scroll State",
        description:
          "useMessageScrollerScrollable reports whether content overflows.",
        layout: "wide",
        Demo: () => (
          <MessageScrollerProvider autoScroll>
            <div className="flex w-full max-w-sm flex-col gap-2">
              <MessageScroller className="h-64 w-full rounded-lg border">
                <MessageScrollerViewport className="p-4">
                  <MessageScrollerContent>
                    {scrollerMessages.map((m) => (
                      <MessageScrollerItem key={m.id} id={m.id}>
                        <Message align={m.align}>
                          <MessageContent>
                            <Bubble
                              variant={
                                m.align === "start" ? "secondary" : "default"
                              }
                            >
                              <BubbleContent>{m.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton direction="start" />
                <MessageScrollerButton direction="end" />
              </MessageScroller>
              <ScrollStateDisplay />
            </div>
          </MessageScrollerProvider>
        ),
      },
    ],
  },

  // =======================================================================
  // ATTACHMENT
  // =======================================================================
  {
    slug: "attachment",
    name: "Attachment",
    description: "Displays file attachments with media, title and actions.",
    category: "Chat",
    Demo: () => (
      <Attachment className="w-72">
        <AttachmentMedia variant="icon">
          <FileIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>project-brief.pdf</AttachmentTitle>
          <AttachmentDescription>2.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove attachment">
            <XIcon aria-hidden />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    ),
    code: `import { FileIcon, XIcon } from "@/components/ui/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

export function AttachmentDemo() {
  return (
    <Attachment className="w-72">
      <AttachmentMedia variant="icon">
        <FileIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>project-brief.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}`,
    examples: [
      {
        name: "Image",
        Demo: () => (
          <Attachment className="w-72">
            <AttachmentMedia variant="image">
              <img
                src="https://picsum.photos/seed/attach/80/80"
                alt="Photo preview"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>vacation-photo.jpg</AttachmentTitle>
              <AttachmentDescription>1.8 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove image">
                <XIcon aria-hidden />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ),
      },
      {
        name: "States",
        layout: "wide",
        Demo: function StatesDemo() {
          const [states, setStates] = useState<
            Record<string, "idle" | "uploading" | "processing" | "error" | "done">
          >({
            idle: "idle",
            uploading: "uploading",
            processing: "processing",
            error: "error",
            done: "done",
          })
          return (
            <div className="flex flex-wrap gap-3">
              {(
                Object.entries(states) as [
                  string,
                  "idle" | "uploading" | "processing" | "error" | "done",
                ][]
              ).map(([key, state]) => (
                <Attachment key={key} state={state} className="w-56">
                  <AttachmentMedia variant="icon">
                    {state === "error" ? (
                      <AlertCircleIcon aria-hidden />
                    ) : (
                      <FileIcon aria-hidden />
                    )}
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>
                      {state === "uploading"
                        ? "Uploading…"
                        : state === "processing"
                          ? "Processing…"
                          : `file-${key}.pdf`}
                    </AttachmentTitle>
                    <AttachmentDescription>
                      {state === "error" ? "Upload failed" : "2.4 MB"}
                    </AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    {state === "error" ? (
                      <AttachmentAction
                        aria-label="Retry upload"
                        onClick={() =>
                          setStates((s) => ({ ...s, [key]: "uploading" }))
                        }
                      >
                        <RotateCwIcon aria-hidden />
                      </AttachmentAction>
                    ) : (
                      <AttachmentAction
                        aria-label="Remove"
                        onClick={() =>
                          setStates((s) => ({ ...s, [key]: "idle" }))
                        }
                      >
                        <XIcon aria-hidden />
                      </AttachmentAction>
                    )}
                  </AttachmentActions>
                </Attachment>
              ))}
            </div>
          )
        },
      },
      {
        name: "Sizes",
        layout: "wide",
        Demo: () => (
          <div className="flex flex-col gap-3">
            {(["default", "sm", "xs"] as const).map((size) => (
              <Attachment key={size} size={size} className="w-56">
                <AttachmentMedia variant="icon">
                  <FileIcon aria-hidden />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{size} size</AttachmentTitle>
                  <AttachmentDescription>1.2 MB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction aria-label={`Remove ${size}`}>
                    <XIcon aria-hidden />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </div>
        ),
      },
      {
        name: "Group",
        layout: "wide",
        Demo: () => (
          <AttachmentGroup className="max-w-md">
            {["report.pdf", "design.fig", "notes.md", "data.csv"].map(
              (name) => (
                <Attachment key={name} size="sm">
                  <AttachmentMedia variant="icon">
                    <FileIcon aria-hidden />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{name}</AttachmentTitle>
                    <AttachmentDescription>1 MB</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              )
            )}
          </AttachmentGroup>
        ),
      },
      {
        name: "Trigger",
        Demo: function TriggerDemo() {
          const inputRef = useRef<HTMLInputElement>(null)
          const [fileName, setFileName] = useState<string | null>(null)
          return (
            <div className="flex flex-col gap-3">
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                aria-label="Select file"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setFileName(f.name)
                }}
              />
              <Attachment
                state="idle"
                className="w-72 cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <AttachmentMedia variant="icon">
                  <PaperclipIcon aria-hidden />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>
                    {fileName ?? "Choose a file"}
                  </AttachmentTitle>
                  <AttachmentDescription>
                    {fileName ? "Selected" : "Click to browse"}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentTrigger aria-label="Choose file" />
              </Attachment>
            </div>
          )
        },
      },
    ],
  },

  // =======================================================================
  // MARKER
  // =======================================================================
  {
    slug: "marker",
    name: "Marker",
    description: "Inline markers and separators for timelines and chat logs.",
    category: "Chat",
    Demo: () => (
      <div className="w-full max-w-sm space-y-3">
        <Marker>
          <MarkerIcon>
            <CircleCheckIcon aria-hidden />
          </MarkerIcon>
          <MarkerContent>Deployment finished successfully</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>3 new messages</MarkerContent>
        </Marker>
      </div>
    ),
    code: `import { CircleCheckIcon } from "@/components/ui/icons"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export function MarkerDemo() {
  return (
    <div className="space-y-3">
      <Marker>
        <MarkerIcon>
          <CircleCheckIcon />
        </MarkerIcon>
        <MarkerContent>Deployment finished successfully</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
    </div>
  )
}`,
    examples: [
      {
        name: "Status",
        layout: "wide",
        Demo: () => (
          <div className="w-full max-w-sm space-y-3">
            <Marker>
              <MarkerIcon>
                <CircleCheckIcon aria-hidden />
              </MarkerIcon>
              <MarkerContent>Build succeeded</MarkerContent>
            </Marker>
            <Marker>
              <MarkerIcon>
                <AlertCircleIcon aria-hidden />
              </MarkerIcon>
              <MarkerContent>Test coverage dropped to 72%</MarkerContent>
            </Marker>
            <Marker>
              <MarkerIcon>
                <ClockIcon aria-hidden />
              </MarkerIcon>
              <MarkerContent>Scheduled for 3:00 pm</MarkerContent>
            </Marker>
            <Marker>
              <MarkerIcon>
                <BookmarkIcon aria-hidden />
              </MarkerIcon>
              <MarkerContent>Pinned by admin</MarkerContent>
            </Marker>
          </div>
        ),
      },
      {
        name: "Shimmer",
        Demo: () => (
          <div className="w-full max-w-sm space-y-3">
            <Marker>
              <MarkerIcon>
                <LoaderIcon className="animate-spin" aria-hidden />
              </MarkerIcon>
              <MarkerContent className="shimmer">
                Generating summary…
              </MarkerContent>
            </Marker>
            <Marker variant="separator">
              <MarkerContent className="shimmer">Loading…</MarkerContent>
            </Marker>
          </div>
        ),
      },
      {
        name: "Links and Buttons",
        Demo: () => (
          <div className="w-full max-w-sm space-y-3">
            <Marker>
              <MarkerIcon>
                <LinkIcon aria-hidden />
              </MarkerIcon>
              <MarkerContent>
                See the{" "}
                <a
                  href="#marker-link-docs"
                  onClick={(e) => e.preventDefault()}
                >
                  documentation
                </a>{" "}
                for details
              </MarkerContent>
            </Marker>
            <Marker variant="separator">
              <MarkerContent>
                <a
                  href="#marker-link-archive"
                  onClick={(e) => e.preventDefault()}
                >
                  View archived messages
                </a>
              </MarkerContent>
            </Marker>
            <Marker>
              <MarkerContent>
                Conversation paused.{" "}
                <button
                  type="button"
                  className="font-medium text-foreground underline underline-offset-2"
                  onClick={() => {}}
                >
                  Resume
                </button>
              </MarkerContent>
            </Marker>
          </div>
        ),
      },
    ],
  },
]
