import * as React from "react"
import {
  ArrowUpIcon,
  MicIcon,
  RefreshCwIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

type AIComposerStatus = "ready" | "submitted" | "streaming" | "error"

type AIComposerContextValue = {
  hasPrompt: boolean
  setHasPrompt: React.Dispatch<React.SetStateAction<boolean>>
}

const AIComposerContext = React.createContext<AIComposerContextValue | null>(
  null
)

function AIComposer({
  className,
  status = "ready",
  ...props
}: React.ComponentProps<"form"> & { status?: AIComposerStatus }) {
  const [hasPrompt, setHasPrompt] = React.useState(false)
  const context = React.useMemo(
    () => ({ hasPrompt, setHasPrompt }),
    [hasPrompt]
  )

  return (
    <AIComposerContext.Provider value={context}>
      <form
        data-slot="ai-composer"
        data-status={status}
        aria-busy={status === "submitted" || status === "streaming"}
        className={cn(
          "grid w-full max-w-(--ai-composer-max-width) gap-(--ai-composer-gap) rounded-(--ai-composer-radius) border border-input bg-control bg-clip-padding p-(--ai-composer-padding) text-foreground shadow-(--ai-composer-shadow) transition-[border-color,box-shadow] duration-(--speed-swift) focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-[status=error]:border-destructive data-[status=error]:ring-3 data-[status=error]:ring-destructive/20 dark:data-[status=error]:ring-destructive/40",
          className
        )}
        {...props}
      />
    </AIComposerContext.Provider>
  )
}

function AIComposerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-composer-header"
      className={cn("min-w-0 empty:hidden", className)}
      {...props}
    />
  )
}

function AIComposerInput({
  className,
  onInput,
  onKeyDown,
  ref,
  submitOnEnter = true,
  ...props
}: React.ComponentProps<"textarea"> & { submitOnEnter?: boolean }) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const composer = React.useContext(AIComposerContext)

  const updateLayout = React.useCallback(
    (input: HTMLTextAreaElement) => {
      const hasPrompt = input.value.trim().length > 0
      composer?.setHasPrompt(hasPrompt)

      const wasMultiline = input.dataset.multiline === "true"
      const isMultiline =
        hasPrompt &&
        (wasMultiline ||
          input.value.includes("\n") ||
          input.scrollHeight > input.clientHeight)
      input.dataset.multiline = String(isMultiline)
    },
    [composer]
  )

  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return

    updateLayout(input)
    const observer = new ResizeObserver(() => updateLayout(input))
    observer.observe(input)
    return () => observer.disconnect()
  }, [props.value, updateLayout])

  return (
    <Textarea
      ref={(node) => {
        inputRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      data-slot="ai-composer-input"
      rows={1}
      className={cn(
        "max-h-(--ai-composer-input-max-height) min-h-(--ai-composer-input-min-height) resize-none rounded-none border-0 bg-transparent px-(--ai-composer-input-padding-inline) py-(--ai-composer-input-padding-block) shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      onInput={(event) => {
        onInput?.(event)
        updateLayout(event.currentTarget)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (
          event.defaultPrevented ||
          !submitOnEnter ||
          event.key !== "Enter" ||
          event.shiftKey ||
          event.nativeEvent.isComposing
        ) {
          return
        }

        event.preventDefault()
        event.currentTarget.form?.requestSubmit()
      }}
      {...props}
    />
  )
}

function AIComposerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-composer-footer"
      className={cn(
        "flex min-w-0 items-end justify-between gap-(--ai-composer-gap)",
        className
      )}
      {...props}
    />
  )
}

function AIComposerTools({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-composer-tools"
      className={cn(
        "flex min-w-0 flex-1 flex-wrap items-center gap-(--ai-composer-tool-gap)",
        className
      )}
      {...props}
    />
  )
}

function AIComposerActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-composer-actions"
      className={cn(
        "flex shrink-0 items-center gap-(--ai-composer-tool-gap)",
        className
      )}
      {...props}
    />
  )
}

function AIComposerAction({
  className,
  variant = "ghost",
  size = "icon",
  type = "button",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="ai-composer-action"
      type={type}
      variant={variant}
      size={size}
      className={cn(
        "size-(--ai-composer-control-size) rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AIComposerTool({
  className,
  children,
  dismissible = true,
  variant = "ghost",
  type = "button",
  ...props
}: React.ComponentProps<typeof Button> & { dismissible?: boolean }) {
  const toolChildren = React.Children.toArray(children)
  const leading = toolChildren[0]
  const content = toolChildren.slice(1)

  return (
    <Button
      data-slot="ai-composer-tool"
      data-dismissible={dismissible}
      type={type}
      variant={variant}
      className={cn(
        "h-(--ai-composer-control-size) rounded-full px-(--ai-composer-tool-padding-inline)",
        className
      )}
      {...props}
    >
      {dismissible && leading ? (
        <span
          data-slot="ai-composer-tool-icon"
          aria-hidden="true"
          className="relative grid size-(--ai-composer-tool-icon-size) shrink-0 place-items-center [&>span]:absolute [&>span]:inset-0 [&>span]:grid [&>span]:place-items-center [&_svg]:size-(--ai-composer-tool-icon-size)"
        >
          <span className="scale-100 opacity-100 transition-[opacity,scale] duration-(--ai-composer-speed) ease-(--ai-composer-ease) group-hover/button:scale-75 group-hover/button:opacity-0 group-focus-visible/button:scale-75 group-focus-visible/button:opacity-0">
            {leading}
          </span>
          <span className="scale-75 opacity-0 transition-[opacity,scale] duration-(--ai-composer-speed) ease-(--ai-composer-ease) group-hover/button:scale-100 group-hover/button:opacity-100 group-focus-visible/button:scale-100 group-focus-visible/button:opacity-100">
            <XIcon />
          </span>
        </span>
      ) : (
        leading
      )}
      {content}
    </Button>
  )
}

const submitLabels: Record<AIComposerStatus, string> = {
  ready: "Send message",
  submitted: "Sending message",
  streaming: "Stop generating",
  error: "Retry message",
}

function AIComposerSubmit({
  className,
  status = "ready",
  type,
  children,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  status?: AIComposerStatus
  children?: React.ReactNode
}) {
  const composer = React.useContext(AIComposerContext)
  const isVoice = status === "ready" && !composer?.hasPrompt
  const label = isVoice ? "Voice input" : submitLabels[status]

  return (
    <Button
      data-slot="ai-composer-submit"
      data-status={status}
      data-mode={isVoice ? "voice" : "send"}
      type={type ?? (isVoice || status === "streaming" ? "button" : "submit")}
      size="icon"
      variant={status === "error" ? "destructive" : "default"}
      aria-label={props["aria-label"] ?? label}
      disabled={disabled || status === "submitted"}
      className={cn(
        "relative size-(--ai-composer-control-size) rounded-full",
        className
      )}
      {...props}
    >
      {children ??
        (status === "ready" ? (
          <>
            <span className="absolute grid place-items-center transition-[opacity,scale] duration-(--ai-composer-speed) ease-(--ai-composer-ease) group-data-[mode=send]/button:scale-75 group-data-[mode=send]/button:opacity-0">
              <MicIcon aria-hidden />
            </span>
            <span className="absolute grid scale-75 place-items-center opacity-0 transition-[opacity,scale] duration-(--ai-composer-speed) ease-(--ai-composer-ease) group-data-[mode=send]/button:scale-100 group-data-[mode=send]/button:opacity-100">
              <ArrowUpIcon aria-hidden />
            </span>
          </>
        ) : status === "submitted" ? (
          <Spinner aria-label={label} />
        ) : status === "streaming" ? (
          <SquareIcon aria-hidden />
        ) : status === "error" ? (
          <RefreshCwIcon aria-hidden />
        ) : null)}
    </Button>
  )
}

export {
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
}
