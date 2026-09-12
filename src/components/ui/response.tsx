import * as React from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remend from "remend"
import {
  CircleAlertIcon,
  InfoIcon,
  LightbulbIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
} from "@/components/ui/icons"
import "katex/dist/katex.min.css"

import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CodeBlock } from "@/components/code-block"
import { cn } from "@/lib/utils"

/**
 * The assistant's answer surface. It owns block rhythm, the streaming caret,
 * and a default reading width (`--response-max-width`, the composer's text
 * width) so answers never run edge to edge. Rich content keeps the metrics of
 * whatever it is made of.
 */
function Response({
  className,
  streaming = false,
  ...props
}: React.ComponentProps<"div"> & { streaming?: boolean }) {
  return (
    <div
      data-slot="response"
      data-streaming={streaming}
      aria-busy={streaming || undefined}
      className={cn(
        "w-full max-w-(--response-max-width) min-w-0 text-sm leading-relaxed wrap-break-word",
        className
      )}
      {...props}
    />
  )
}

// The reveal is tuned entirely by tokens (buffer, adjust, rate window, and
// char cadence). Ported from llm-ui's throttleBasic
// (https://llm-ui.com/docs/advanced/throttle-functions): the display lags the
// source by a small buffer and glides toward it so bursty growth reads as one
// steady, calm reveal.
type StreamRevealTokens = {
  charSpeedMs: number
  rateWindowMs: number
  buffer: number
  adjust: number
}

const STREAM_REVEAL_FALLBACK: StreamRevealTokens = {
  charSpeedMs: 12,
  rateWindowMs: 10000,
  buffer: 9,
  adjust: 0.2,
}

let cachedStreamTokens: StreamRevealTokens | null = null

// getComputedStyle does not resolve custom properties, so one probe reads the
// tokens off real properties: times off transition-duration/-delay (normalized
// to seconds) and the two unitless tuning values off lengths, once.
function streamRevealTokens(): StreamRevealTokens {
  if (cachedStreamTokens) return cachedStreamTokens
  if (typeof document === "undefined") return STREAM_REVEAL_FALLBACK
  const probe = document.createElement("span")
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.display = "block"
  probe.style.transitionDuration = "var(--response-stream-char-speed)"
  probe.style.transitionDelay = "var(--response-stream-rate-window)"
  probe.style.width = "calc(var(--response-stream-buffer) * 1px)"
  probe.style.height = "calc(var(--response-stream-adjust) * 100px)"
  document.body.appendChild(probe)
  const cs = getComputedStyle(probe)
  const charSpeedMs = parseFloat(cs.transitionDuration) * 1000
  const rateWindowMs = parseFloat(cs.transitionDelay) * 1000
  const buffer = parseFloat(cs.width)
  const adjustPx = parseFloat(cs.height)
  probe.remove()
  cachedStreamTokens = {
    charSpeedMs: charSpeedMs > 0 ? charSpeedMs : STREAM_REVEAL_FALLBACK.charSpeedMs,
    rateWindowMs:
      rateWindowMs > 0 ? rateWindowMs : STREAM_REVEAL_FALLBACK.rateWindowMs,
    buffer: buffer > 0 ? buffer : STREAM_REVEAL_FALLBACK.buffer,
    adjust: adjustPx > 0 ? adjustPx / 100 : STREAM_REVEAL_FALLBACK.adjust,
  }
  return cachedStreamTokens
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * The shared throttle reveal. Drives one constant-velocity character reveal
 * for both a growing source (`streaming`, lags a token buffer behind and
 * never completes until streaming clears) and a static one-shot on mount
 * (`revealOnMount`, reveals the full string once). Returns the revealed slice
 * and whether the loop has taken over rendering.
 */
function useStreamReveal({
  text,
  streaming = false,
  revealOnMount = false,
}: {
  text: string
  streaming?: boolean
  revealOnMount?: boolean
}) {
  const [display, setDisplay] = React.useState(() =>
    revealOnMount && !prefersReducedMotion() ? "" : text
  )
  const [active, setActive] = React.useState(false)

  const textRef = React.useRef(text)
  const streamingRef = React.useRef(streaming)
  const revealedRef = React.useRef(0)
  const rafRef = React.useRef(0)
  const runningRef = React.useRef(false)
  const activeRef = React.useRef(false)
  const lastRef = React.useRef(0)
  const samplesRef = React.useRef<{ t: number; len: number }[]>([])

  // The loop reads the latest props from refs, synced after each commit.
  React.useEffect(() => {
    textRef.current = text
    streamingRef.current = streaming
  })

  const startLoop = React.useCallback(() => {
    if (runningRef.current) return
    if (prefersReducedMotion()) {
      setDisplay(textRef.current)
      return
    }
    runningRef.current = true
    revealedRef.current = 0
    lastRef.current = 0
    samplesRef.current = []

    const { charSpeedMs, rateWindowMs, buffer, adjust } = streamRevealTokens()
    const baseCharsPerMs = 1 / charSpeedMs

    const step = (now: number) => {
      if (!activeRef.current) {
        activeRef.current = true
        setActive(true)
      }
      const dt = lastRef.current ? Math.min(64, now - lastRef.current) : 0
      lastRef.current = now

      const len = textRef.current.length
      const samples = samplesRef.current
      samples.push({ t: now, len })
      while (samples.length > 2 && now - samples[0].t > rateWindowMs) {
        samples.shift()
      }
      const oldest = samples[0]
      const measured =
        now > oldest.t ? (len - oldest.len) / (now - oldest.t) : 0
      const rate = Math.max(baseCharsPerMs, measured)

      const maxReveal = streamingRef.current ? Math.max(0, len - buffer) : len
      let advance = rate * dt
      if (maxReveal - revealedRef.current > buffer) {
        advance *= 1 + adjust
      }
      revealedRef.current = Math.min(maxReveal, revealedRef.current + advance)
      setDisplay(textRef.current.slice(0, Math.floor(revealedRef.current)))

      if (!streamingRef.current && revealedRef.current >= len) {
        runningRef.current = false
        activeRef.current = false
        setActive(false)
        return
      }
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
  }, [])

  // Start once when a stream begins; the loop drains itself after `streaming`
  // clears, so this deliberately does not cancel on that transition.
  React.useEffect(() => {
    if (streaming) startLoop()
  }, [streaming, startLoop])

  // A static one-shot reveals on mount; callers key the element to replay it.
  React.useEffect(() => {
    if (revealOnMount) startLoop()
  }, [revealOnMount, startLoop])

  React.useEffect(
    () => () => {
      runningRef.current = false
      cancelAnimationFrame(rafRef.current)
    },
    []
  )

  return { display, active }
}

/**
 * Streaming text that reveals at a steady, self-correcting pace instead of
 * snapping to each chunk. Bursty growth (words or clumps of tokens) is smoothed
 * into one constant-velocity character reveal that lags a small buffer behind
 * the source, so the flow never stutters or catches up in jumps. No fade — the
 * even pacing is the effect.
 *
 * `revealOnMount` runs the same reveal once over a static string (e.g. a
 * greeting); pair it with `reserve` to hold the final box size with a hidden
 * ghost so a centred one-shot never reflows or re-centres as it types.
 */
function ResponseStream({
  text,
  streaming = false,
  revealOnMount = false,
  reserve = false,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  text: string
  streaming?: boolean
  revealOnMount?: boolean
  reserve?: boolean
}) {
  const { display, active } = useStreamReveal({ text, streaming, revealOnMount })
  const shown = revealOnMount ? display : active ? display : text

  if (reserve) {
    return (
      <div
        data-slot="response-stream"
        className={cn(
          "inline-grid min-w-0 text-start *:col-start-1 *:row-start-1",
          className
        )}
        {...props}
      >
        <span aria-hidden="true" className="invisible whitespace-pre-wrap">
          {text}
        </span>
        <span className="whitespace-pre-wrap">{shown}</span>
      </div>
    )
  }

  return (
    <div
      data-slot="response-stream"
      data-streaming={streaming || undefined}
      aria-busy={streaming || undefined}
      className={cn("min-w-0", className)}
      {...props}
    >
      {shown}
    </div>
  )
}

// Fenced code arrives as <pre><code class="language-x">…</code></pre>; unwrap
// it into a CodeBlock, reading the raw text and language off the inner node.
function markdownNodeText(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(markdownNodeText).join("")
  if (React.isValidElement(node)) {
    return markdownNodeText(
      (node.props as { children?: React.ReactNode }).children
    )
  }
  return ""
}

// GitHub alert syntax (`> [!NOTE]` … `[!CAUTION]`) isn't part of GFM, so a
// small remark pass retags those blockquotes as a `callout` element carrying
// the type, which then renders through the Alert component.
type MdNode = {
  type?: string
  value?: string
  children?: MdNode[]
  data?: { hName?: string; hProperties?: Record<string, string> }
}

const calloutMarker = /^\[!(note|tip|important|warning|caution)\]\s*\n?/i

function applyCallout(node: MdNode) {
  const first = node.children?.[0]
  if (first?.type !== "paragraph") return
  const text = first.children?.[0]
  if (text?.type !== "text" || typeof text.value !== "string") return
  const marker = calloutMarker.exec(text.value)
  if (!marker) return
  text.value = text.value.slice(marker[0].length)
  if (text.value === "" && first.children?.length === 1) node.children?.shift()
  node.data = {
    ...node.data,
    hName: "callout",
    hProperties: { "data-callout": marker[1].toLowerCase() },
  }
}

function remarkCallouts() {
  return (tree: MdNode) => {
    const walk = (node: MdNode) => {
      if (!node.children) return
      for (const child of node.children) {
        if (child.type === "blockquote") applyCallout(child)
        walk(child)
      }
    }
    walk(tree)
  }
}

const calloutConfig = {
  note: { Icon: InfoIcon, title: "Note", variant: "neutral" },
  tip: { Icon: LightbulbIcon, title: "Tip", variant: "neutral" },
  important: { Icon: CircleAlertIcon, title: "Important", variant: "info" },
  warning: { Icon: TriangleAlertIcon, title: "Warning", variant: "warning" },
  caution: { Icon: OctagonAlertIcon, title: "Caution", variant: "error" },
} as const

type CalloutType = keyof typeof calloutConfig

function MarkdownCallout({
  node,
  children,
}: {
  node?: { properties?: Record<string, unknown> }
  children?: React.ReactNode
}) {
  const raw = node?.properties?.["data-callout"]
  const type: CalloutType =
    typeof raw === "string" && raw in calloutConfig
      ? (raw as CalloutType)
      : "note"
  const { Icon, title, variant } = calloutConfig[type]
  return (
    <Alert variant={variant} data-callout={type}>
      <AlertIcon><Icon /></AlertIcon>
      <AlertContent>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </AlertContent>
    </Alert>
  )
}

// GFM footnotes are the citation mechanism. Each definition is parsed into a
// source preview, provided by context so the inline chip can open a popover.
type CitationSource = { title?: string; href?: string; description?: string }

const CitationContext = React.createContext<Record<string, CitationSource>>({})

const citationDefinition = /^\[\^([^\]]+)\]:[ \t]*(.+)$/gm
const citationLink = /\[([^\]]+)\]\(([^)]+)\)[ \t]*(?:[—–-][ \t]*)?(.*)/

function parseCitations(markdown: string): Record<string, CitationSource> {
  const map: Record<string, CitationSource> = {}
  for (const [, label, content] of markdown.matchAll(citationDefinition)) {
    const link = citationLink.exec(content)
    map[label] = link
      ? {
          title: link[1],
          href: link[2],
          description: link[3].trim() || undefined,
        }
      : { description: content.trim() }
  }
  return map
}

function CitationMark({
  label,
  children,
}: {
  label: string
  children?: React.ReactNode
}) {
  const source = React.useContext(CitationContext)[label]
  if (!source) return <span className="response-citation">{children}</span>
  return (
    <Popover>
      <PopoverTrigger className="response-citation" aria-label={`Source ${label}`}>
        {children}
      </PopoverTrigger>
      <PopoverContent align="start" className="gap-(--space-2xs)">
        {source.href ? (
          <a
            href={source.href}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {source.title ?? source.href}
          </a>
        ) : (
          <span className="font-medium text-foreground">
            {source.title ?? "Source"}
          </span>
        )}
        {source.description ? (
          <p className="text-muted-foreground">{source.description}</p>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

const markdownComponents = {
  pre: ({ children }: { children?: React.ReactNode }) => {
    const codeEl = React.Children.toArray(children)[0]
    const codeProps = React.isValidElement(codeEl)
      ? (codeEl.props as { className?: string; children?: React.ReactNode })
      : null
    const language = /language-([\w-]+)/.exec(codeProps?.className ?? "")?.[1]
    const code = markdownNodeText(
      codeProps ? codeProps.children : children
    ).replace(/\n$/, "")
    return <CodeBlock code={code} language={language} showLineNumbers={false} />
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="response-table">
      <table>{children}</table>
    </div>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    // A footnote reference (#…fn-N, not the fnref backref) becomes a citation.
    if (href && href.includes("fn-") && !href.includes("fnref")) {
      return (
        <CitationMark label={href.slice(href.lastIndexOf("fn-") + 3)}>
          {children}
        </CitationMark>
      )
    }
    const external = /^https?:\/\//i.test(href ?? "")
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    )
  },
  // The custom element emitted by remarkCallouts; react-markdown types
  // `components` by HTML tag, so the map is widened for it.
  callout: MarkdownCallout,
} as unknown as Components

/**
 * Renders a markdown string as tokenized OneDS content. GitHub-flavored
 * markdown maps to the elements the response surface already styles; fenced
 * code becomes a CodeBlock and tables gain their own horizontal scroll. When
 * `streaming`, unterminated markdown is closed so partial tokens never flash
 * raw syntax mid-stream.
 */
function Markdown({
  children,
  streaming = false,
  throttle = true,
}: {
  children: string
  streaming?: boolean
  throttle?: boolean
}) {
  // Reuse the response throttle so markdown reveals at the same calm, buffered
  // cadence as text; remend then closes whatever token the prefix cut through.
  // A caller that paces the text itself (e.g. the chat block) sets
  // `throttle={false}` to keep only remend and avoid a second reveal clock.
  const useThrottle = streaming && throttle
  const { display, active } = useStreamReveal({
    text: children,
    streaming: useThrottle,
  })
  const source = useThrottle
    ? active
      ? remend(display)
      : children
    : streaming
      ? remend(children)
      : children
  const citations = React.useMemo(() => parseCitations(children), [children])
  return (
    <CitationContext.Provider value={citations}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCallouts]}
        // Mid-stream LaTeX is briefly incomplete; render the error in the text
        // color so it reads as pending text instead of flashing KaTeX red.
        rehypePlugins={[[rehypeKatex, { errorColor: "currentColor" }]]}
        components={markdownComponents}
      >
        {source}
      </ReactMarkdown>
    </CitationContext.Provider>
  )
}

export { Response, ResponseStream, Markdown }
