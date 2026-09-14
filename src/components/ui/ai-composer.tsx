import * as React from "react"
import {
  ArrowUpIcon,
  MicIcon,
  RefreshCwIcon,
  SquareIcon,
  XIcon,
} from "@/components/ui/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Chip, type ChipProps } from "@/components/ui/chip"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

type AIComposerStatus = "ready" | "submitted" | "streaming" | "error"
type AIComposerSize = "default" | "mini"

type AIComposerContextValue = {
  hasPrompt: boolean
  setHasPrompt: React.Dispatch<React.SetStateAction<boolean>>
  size: AIComposerSize
}

const AIComposerContext = React.createContext<AIComposerContextValue | null>(
  null
)

function AIComposer({
  className,
  status = "ready",
  size = "default",
  ...props
}: React.ComponentProps<"form"> & {
  status?: AIComposerStatus
  size?: AIComposerSize
}) {
  const [hasPrompt, setHasPrompt] = React.useState(false)
  const context = React.useMemo(
    () => ({ hasPrompt, setHasPrompt, size }),
    [hasPrompt, size]
  )

  return (
    <AIComposerContext.Provider value={context}>
      <form
        data-slot="ai-composer"
        data-status={status}
        data-size={size}
        aria-busy={status === "submitted" || status === "streaming"}
        className={cn(
          "grid w-full max-w-(--ai-composer-max-width) gap-(--ai-composer-gap) rounded-(--ai-composer-radius) border border-(--elevation-stroke) bg-(--surface-lowest) bg-clip-border p-(--ai-composer-padding) text-foreground shadow-(--elevation-flat) transition-[background-color,border-color,box-shadow] duration-(--ai-composer-speed) ease-(--ai-composer-ease) hover:shadow-(--elevation-floating) focus-within:shadow-(--elevation-floating) data-[status=error]:shadow-(--elevation-floating) data-[status=error]:border-destructive/40",
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
      focusRing={false}
      className={cn(
        "max-h-(--ai-composer-input-max-height) min-h-(--ai-composer-input-min-height) resize-none rounded-none border-0",
        "bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent",
        "dark:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent dark:focus-visible:bg-transparent",
        "px-(--ai-composer-input-padding-inline) py-(--ai-composer-input-padding-block) shadow-none ring-0 focus-visible:ring-0",
        "align-middle leading-(--ai-composer-input-line-height)",
        "disabled:bg-transparent dark:disabled:bg-transparent",
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
      className={cn("rounded-full", className)}
      {...props}
    />
  )
}

function AIComposerTool({
  className,
  children,
  dismissible = true,
  onDismiss,
  variant,
  size,
  onClick,
  ...props
}: ChipProps) {
  const composer = React.useContext(AIComposerContext)
  const isMini = composer?.size === "mini"
  const chipSize = size ?? (isMini ? "sm" : "default")
  const isPressed = props["aria-pressed"] === true
  const chipVariant = variant ?? (isPressed ? "secondary" : "ghost")

  const toolChildren = React.Children.toArray(children)
  const leading = toolChildren[0]
  const content = toolChildren.slice(1)

  return (
    <Chip
      data-slot="ai-composer-tool"
      size={chipSize}
      variant={chipVariant}
      dismissible={dismissible}
      iconSwapOnHover={dismissible}
      onDismiss={onDismiss}
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none transition-all duration-(--ai-composer-speed)",
        isPressed
          ? "bg-(--button-secondary-fill) text-(--button-secondary-ink) shadow-xs"
          : "hover:bg-(--state-layer-hover) active:bg-(--state-layer-pressed)",
        className
      )}
      {...props}
    >
      {dismissible && leading ? (
        <span
          data-slot="ai-composer-tool-icon"
          aria-hidden="true"
          className="relative inline-flex size-(--ai-composer-tool-icon-size) shrink-0 items-center justify-center [&_svg]:size-(--ai-composer-tool-icon-size)!"
        >
          <span className="flex size-full items-center justify-center scale-100 opacity-100 transition-[opacity,scale] duration-(--speed-swift) ease-(--ease-glide) group-hover/chip:scale-75 group-hover/chip:opacity-0 group-focus-visible/chip:scale-75 group-focus-visible/chip:opacity-0">
            {React.isValidElement(leading)
              ? React.cloneElement(leading as React.ReactElement<{ filled?: boolean }>, { filled: true })
              : leading}
          </span>
          <span className="absolute inset-0 flex size-full items-center justify-center scale-75 opacity-0 transition-[opacity,scale] duration-(--speed-swift) ease-(--ease-glide) group-hover/chip:scale-100 group-hover/chip:opacity-100 group-focus-visible/chip:scale-100 group-focus-visible/chip:opacity-100">
            <XIcon filled />
          </span>
        </span>
      ) : leading ? (
        <span
          data-slot="ai-composer-tool-icon"
          aria-hidden="true"
          className="inline-flex size-(--ai-composer-tool-icon-size) shrink-0 items-center justify-center [&_svg]:size-(--ai-composer-tool-icon-size)!"
        >
          {React.isValidElement(leading)
            ? React.cloneElement(leading as React.ReactElement<{ filled?: boolean }>, { filled: true })
            : leading}
        </span>
      ) : null}
      <span className="inline-flex items-center leading-none truncate">
        {content}
      </span>
    </Chip>
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
      data-mode={isVoice ? "voice" : status === "streaming" ? "stop" : "send"}
      type={type ?? (isVoice || status === "streaming" ? "button" : "submit")}
      size="icon"
      variant={status === "error" ? "destructive" : "primary"}
      primaryColor="pink"
      aria-label={props["aria-label"] ?? label}
      disabled={disabled || status === "submitted"}
      className={cn(
        "relative rounded-full shadow-(--elevation-flat) transition-[width,transform,box-shadow] duration-(--ai-composer-speed) ease-(--ai-composer-ease) hover:shadow-(--elevation-raised) focus-visible:shadow-(--elevation-raised) focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children ??
        (status === "ready" ? (
          <>
            <span className="absolute grid place-items-center transition-[opacity,scale] duration-(--ai-composer-speed) ease-(--ai-composer-ease) group-data-[mode=send]/button:scale-75 group-data-[mode=send]/button:opacity-0">
              <MicIcon aria-hidden filled />
            </span>
            <span className="absolute grid scale-75 place-items-center opacity-0 transition-[opacity,scale] duration-(--ai-composer-speed) ease-(--ai-composer-ease) group-data-[mode=send]/button:scale-100 group-data-[mode=send]/button:opacity-100">
              <ArrowUpIcon aria-hidden filled />
            </span>
          </>
        ) : status === "submitted" ? (
          <Spinner aria-label={label} />
        ) : status === "streaming" ? (
          <SquareIcon aria-hidden filled />
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
  type AIComposerSize,
}
