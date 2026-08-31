import { useCallback, useRef, useState } from "react"
import {
  FileIcon,
  XIcon,
  CircleCheckIcon,
  ImageIcon,
  RotateCwIcon,
  PaperclipIcon,
  AlertCircleIcon,
  ThumbsUpIcon,
  HeartIcon,
  CopyIcon,
  ShareIcon,
  ThumbsDownIcon,
  ClockIcon,
  LinkIcon,
  CheckIcon,
  PlusIcon,
  LoaderIcon,
  BookmarkIcon,
} from "lucide-react"

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
import { Button } from "@/components/ui/button"
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
        variant="outline"
        size="xs"
        onClick={() => scrollToStart({ behavior: "smooth" })}
      >
        Top
      </Button>
      {ids.slice(0, 3).map((id) => (
        <Button
          key={id}
          variant="outline"
          size="xs"
          onClick={() => scrollToMessage(id, { behavior: "smooth" })}
        >
          {id}
        </Button>
      ))}
      <Button
        variant="outline"
        size="xs"
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
      <Button variant="outline" size="sm" onClick={addMessage}>
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
        variant="outline"
        size="sm"
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

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

export const chatDemos: ComponentEntry[] = [
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
                    <ThumbsUpIcon className="size-3" aria-hidden />
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
                    <HeartIcon className="size-3" aria-hidden />
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
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
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
                        size="icon-xs"
                        aria-label="Like"
                        aria-pressed={liked === true}
                        onClick={() => setLiked((v) => (v === true ? null : true))}
                      >
                        <ThumbsUpIcon aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
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
                        size="icon-xs"
                        aria-label="Share"
                      >
                        <ShareIcon aria-hidden />
                      </Button>
                    </div>
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
  // MESSAGE SCROLLER
  // =======================================================================
  {
    slug: "message-scroller",
    name: "Message Scroller",
    description: "A virtualized, auto-scrolling container for chat messages.",
    category: "Chat",
    Demo: () => (
      <MessageScrollerProvider>
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
    <MessageScrollerProvider>
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
          <MessageScrollerProvider>
            <MessageScroller className="h-80 w-full max-w-sm rounded-lg border">
              <MessageScrollerViewport className="p-4">
                <MessageScrollerContent>
                  {scrollerMessages.map((m, i) => (
                    <MessageScrollerItem
                      key={m.id}
                      id={m.id}
                      scrollAnchor={i === 4}
                    >
                      <Message align={m.align}>
                        <MessageContent>
                          <Bubble
                            variant={
                              m.align === "start" ? "secondary" : "default"
                            }
                          >
                            <BubbleContent>
                              {i === 4 ? `[anchored] ${m.text}` : m.text}
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
          <MessageScrollerProvider>
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
          <MessageScrollerProvider scrollPreviousItemPeek={60}>
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
                variant="outline"
                size="sm"
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
          <MessageScrollerProvider>
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
          <MessageScrollerProvider>
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
    code: `import { FileIcon, XIcon } from "lucide-react"
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
    code: `import { CircleCheckIcon } from "lucide-react"
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
