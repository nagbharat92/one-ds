"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Popover as PopoverPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CoachmarkTone = "default" | "inverted"

type CoachmarkDismissReason =
  | "action"
  | "close"
  | "dismiss"
  | "escape"
  | "outside"

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop: T | undefined
  defaultProp: T
  onChange?: (value: T) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolled

  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  })

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next)
      onChangeRef.current?.(next)
    },
    [isControlled]
  )

  return [value, setValue] as const
}

// ---------------------------------------------------------------------------
// Coachmark
// ---------------------------------------------------------------------------

type CoachmarkContextValue = {
  titleId: string
  descriptionId: string
  hasTitle: boolean
  hasDescription: boolean
  setHasTitle: React.Dispatch<React.SetStateAction<boolean>>
  setHasDescription: React.Dispatch<React.SetStateAction<boolean>>
  dismiss: (reason: CoachmarkDismissReason) => void
}

const CoachmarkContext = React.createContext<CoachmarkContextValue | null>(null)

function useCoachmarkContext(part: string) {
  const context = React.useContext(CoachmarkContext)
  if (!context) {
    throw new Error(`<${part}> must be used within <Coachmark>.`)
  }
  return context
}

function Coachmark({
  open,
  defaultOpen = false,
  onOpenChange,
  onDismiss,
  openDelay = 0,
  modal = false,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof PopoverPrimitive.Root>,
  "open" | "defaultOpen" | "onOpenChange"
> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onDismiss?: (reason: CoachmarkDismissReason) => void
  openDelay?: number
}) {
  const id = React.useId()
  const [hasTitle, setHasTitle] = React.useState(false)
  const [hasDescription, setHasDescription] = React.useState(false)
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: openDelay > 0 ? false : defaultOpen,
    onChange: onOpenChange,
  })

  const onDismissRef = React.useRef(onDismiss)
  React.useEffect(() => {
    onDismissRef.current = onDismiss
  })

  const openedRef = React.useRef(false)
  React.useEffect(() => {
    if (open !== undefined || !defaultOpen || openDelay <= 0) return
    if (openedRef.current) return
    const timer = window.setTimeout(() => {
      openedRef.current = true
      setIsOpen(true)
    }, openDelay)
    return () => window.clearTimeout(timer)
  }, [open, defaultOpen, openDelay, setIsOpen])

  const dismiss = React.useCallback(
    (reason: CoachmarkDismissReason) => {
      onDismissRef.current?.(reason)
      setIsOpen(false)
    },
    [setIsOpen]
  )

  const context = React.useMemo<CoachmarkContextValue>(
    () => ({
      titleId: `${id}-title`,
      descriptionId: `${id}-description`,
      hasTitle,
      hasDescription,
      setHasTitle,
      setHasDescription,
      dismiss,
    }),
    [id, hasTitle, hasDescription, dismiss]
  )

  return (
    <CoachmarkContext.Provider value={context}>
      <PopoverPrimitive.Root
        data-slot="coachmark"
        open={isOpen}
        onOpenChange={setIsOpen}
        modal={modal}
        {...props}
      >
        {children}
      </PopoverPrimitive.Root>
    </CoachmarkContext.Provider>
  )
}

function CoachmarkAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="coachmark-anchor" {...props} />
}

function CoachmarkTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="coachmark-trigger" {...props} />
}

function CoachmarkBeacon({
  className,
  label = "Show tip",
  ...props
}: React.ComponentProps<"button"> & { label?: string }) {
  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        type="button"
        data-slot="coachmark-beacon"
        className={cn(
          "relative inline-flex size-(--coachmark-beacon-size) shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden",
          className
        )}
        {...props}
      >
        <span
          aria-hidden
          className="coachmark-beacon-pulse absolute inset-0 rounded-full bg-primary"
        />
        <span
          aria-hidden
          className="relative size-full rounded-full bg-primary"
        />
        <span className="sr-only">{label}</span>
      </button>
    </PopoverPrimitive.Trigger>
  )
}

const coachmarkContentVariants = cva(
  "group/coachmark relative z-50 flex origin-top flex-col gap-(--coachmark-gap) rounded-(--coachmark-radius) px-(--coachmark-padding-inline) pt-(--coachmark-padding-block-start) pb-(--coachmark-padding-block-end) text-sm shadow-(--elevation-floating) outline-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      tone: {
        default: "bg-popover text-popover-foreground ring-1 ring-foreground/10",
        inverted: "bg-foreground text-background",
      },
      size: {
        sm: "w-(--coachmark-width-sm)",
        md: "w-(--coachmark-width)",
        lg: "w-(--coachmark-width-lg)",
      },
    },
    defaultVariants: {
      tone: "inverted",
      size: "md",
    },
  }
)

// Radix sizes and insets the arrow with numeric props, so the beak geometry lives here.
// Padding must clear --coachmark-radius, or an end-aligned beak lands on the rounded corner.
const COACHMARK_ARROW_WIDTH = 14
const COACHMARK_ARROW_HEIGHT = 7
const COACHMARK_ARROW_PADDING = 24
const COACHMARK_ARROW_TIP = 2.4

// Triangle whose tip is pulled back along both edges and closed with a curve, so the
// beak rounds off like the tooltip. Base corners stay sharp to merge into the card edge.
const coachmarkArrowPaths = (() => {
  const half = COACHMARK_ARROW_WIDTH / 2
  const edge = Math.hypot(half, COACHMARK_ARROW_HEIGHT)
  const insetX = (half / edge) * COACHMARK_ARROW_TIP
  const insetY = (COACHMARK_ARROW_HEIGHT / edge) * COACHMARK_ARROW_TIP
  const left = (half - insetX).toFixed(2)
  const right = (half + insetX).toFixed(2)
  const y = (COACHMARK_ARROW_HEIGHT - insetY).toFixed(2)
  const edgePath = `M0 0L${left} ${y}Q${half} ${COACHMARK_ARROW_HEIGHT} ${right} ${y}L${COACHMARK_ARROW_WIDTH} 0`
  return {
    fill: `${edgePath}Z`,
    stroke: edgePath,
  }
})()

const coachmarkArrowTone: Record<CoachmarkTone, string> = {
  default: "fill-popover",
  inverted: "fill-foreground",
}

function CoachmarkContent({
  className,
  tone = "inverted",
  size = "md",
  side = "bottom",
  align = "center",
  sideOffset = 4,
  arrowPadding = COACHMARK_ARROW_PADDING,
  showArrow = true,
  autoFocus = false,
  dismissOnOutsideClick = false,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof PopoverPrimitive.Content>,
  "tone" | "size"
> &
  VariantProps<typeof coachmarkContentVariants> & {
    showArrow?: boolean
    autoFocus?: boolean
    dismissOnOutsideClick?: boolean
  }) {
  const { titleId, descriptionId, hasTitle, hasDescription, dismiss } =
    useCoachmarkContext("CoachmarkContent")

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="coachmark-content"
        data-tone={tone}
        side={side}
        align={align}
        sideOffset={sideOffset}
        arrowPadding={arrowPadding}
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        onOpenAutoFocus={(event) => {
          if (!autoFocus) event.preventDefault()
        }}
        onEscapeKeyDown={() => dismiss("escape")}
        onInteractOutside={(event) => {
          if (!dismissOnOutsideClick) {
            event.preventDefault()
            return
          }
          dismiss("outside")
        }}
        className={cn(coachmarkContentVariants({ tone, size }), className)}
        {...props}
      >
        {children}
        {showArrow ? (
          <PopoverPrimitive.Arrow
            asChild
            width={COACHMARK_ARROW_WIDTH}
            height={COACHMARK_ARROW_HEIGHT}
          >
            <svg
              viewBox={`0 0 ${COACHMARK_ARROW_WIDTH} ${COACHMARK_ARROW_HEIGHT}`}
              preserveAspectRatio="none"
              className={cn(
                coachmarkArrowTone[tone ?? "inverted"],
                tone === "default" && "overflow-visible"
              )}
            >
              <path d={coachmarkArrowPaths.fill} />
              {tone === "default" ? (
                <path
                  d={coachmarkArrowPaths.stroke}
                  className="fill-none stroke-foreground/10"
                  strokeWidth={1}
                />
              ) : null}
            </svg>
          </PopoverPrimitive.Arrow>
        ) : null}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

import { AspectRatio } from "@/components/ui/aspect-ratio"
function CoachmarkMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <AspectRatio
      data-slot="coachmark-media"
      ratio="landscape"
      className={cn(
        "mx-(--coachmark-media-inset-inline) mt-(--coachmark-media-inset-block-start) overflow-hidden rounded-t-(--coachmark-radius) bg-muted [&>img]:size-full [&>img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

function CoachmarkHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="coachmark-header"
      className={cn(
        "grid gap-1 has-data-[slot=coachmark-close]:grid-cols-[minmax(0,1fr)_auto] has-data-[slot=coachmark-close]:gap-x-2",
        className
      )}
      {...props}
    />
  )
}

function CoachmarkBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="coachmark-badge"
      className={cn(
        "col-start-1 mb-1 w-fit rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground group-data-[tone=inverted]/coachmark:bg-control/15 group-data-[tone=inverted]/coachmark:text-background",
        className
      )}
      {...props}
    />
  )
}

function CoachmarkTitle({ className, ...props }: React.ComponentProps<"h3">) {
  const { titleId, setHasTitle } = useCoachmarkContext("CoachmarkTitle")

  React.useEffect(() => {
    setHasTitle(true)
    return () => setHasTitle(false)
  }, [setHasTitle])

  return (
    <h3
      id={titleId}
      data-slot="coachmark-title"
      className={cn("col-start-1 font-heading text-sm font-semibold", className)}
      {...props}
    />
  )
}

function CoachmarkDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { descriptionId, setHasDescription } =
    useCoachmarkContext("CoachmarkDescription")

  React.useEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])

  return (
    <p
      id={descriptionId}
      data-slot="coachmark-description"
      className={cn(
        "col-span-full text-sm text-muted-foreground group-data-[tone=inverted]/coachmark:text-background/70",
        className
      )}
      {...props}
    />
  )
}

function CoachmarkClose({
  className,
  variant = "ghost",
  size = "icon-sm",
  "aria-label": ariaLabel = "Dismiss",
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { dismiss } = useCoachmarkContext("CoachmarkClose")

  return (
    <Button
      type="button"
      data-slot="coachmark-close"
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) dismiss("close")
      }}
      className={cn(
        coachmarkQuietAction,
        "col-start-2 row-start-1 -my-1 -mr-1.5 opacity-70 hover:opacity-100",
        className
      )}
      {...props}
    >
      <XIcon />
    </Button>
  )
}

function CoachmarkFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="coachmark-footer"
      className={cn(
        "flex items-center justify-end gap-2 has-data-[slot=coachmark-progress]:justify-between",
        className
      )}
      {...props}
    />
  )
}

const coachmarkPrimaryAction =
  "rounded-full px-4 group-data-[tone=inverted]/coachmark:bg-control group-data-[tone=inverted]/coachmark:text-foreground group-data-[tone=inverted]/coachmark:hover:bg-control/90"

const coachmarkQuietAction =
  "rounded-full group-data-[tone=inverted]/coachmark:text-background group-data-[tone=inverted]/coachmark:hover:bg-background/10 group-data-[tone=inverted]/coachmark:hover:text-background"

const coachmarkSecondaryAction = cn(coachmarkQuietAction, "px-4")

function CoachmarkAction({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { dismiss } = useCoachmarkContext("CoachmarkAction")

  return (
    <Button
      data-slot="coachmark-action"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) dismiss("action")
      }}
      className={cn(coachmarkPrimaryAction, className)}
      {...props}
    />
  )
}

function CoachmarkDismiss({
  className,
  variant = "ghost",
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { dismiss } = useCoachmarkContext("CoachmarkDismiss")

  return (
    <Button
      data-slot="coachmark-dismiss"
      variant={variant}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) dismiss("dismiss")
      }}
      className={cn(coachmarkSecondaryAction, className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Tour
// ---------------------------------------------------------------------------

type CoachmarkTourContextValue = {
  step: number
  count: number
  open: boolean
  isFirst: boolean
  isLast: boolean
  next: () => void
  previous: () => void
  goTo: (step: number) => void
  start: (step?: number) => void
  stop: () => void
}

const CoachmarkTourContext =
  React.createContext<CoachmarkTourContextValue | null>(null)

function useCoachmarkTour() {
  const context = React.useContext(CoachmarkTourContext)
  if (!context) {
    throw new Error("useCoachmarkTour must be used within <CoachmarkTour>.")
  }
  return context
}

function CoachmarkTour({
  count,
  step,
  defaultStep = 0,
  onStepChange,
  open,
  defaultOpen = false,
  onOpenChange,
  onComplete,
  children,
}: {
  count: number
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onComplete?: () => void
  children?: React.ReactNode
}) {
  const [currentStep, setCurrentStep] = useControllableState({
    prop: step,
    defaultProp: defaultStep,
    onChange: onStepChange,
  })
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  const onCompleteRef = React.useRef(onComplete)
  React.useEffect(() => {
    onCompleteRef.current = onComplete
  })

  const value = React.useMemo<CoachmarkTourContextValue>(() => {
    const clamp = (next: number) => Math.min(Math.max(next, 0), count - 1)
    const isLast = currentStep >= count - 1

    return {
      step: currentStep,
      count,
      open: isOpen,
      isFirst: currentStep <= 0,
      isLast,
      next: () => {
        if (isLast) {
          onCompleteRef.current?.()
          setIsOpen(false)
          return
        }
        setCurrentStep(currentStep + 1)
      },
      previous: () => setCurrentStep(clamp(currentStep - 1)),
      goTo: (next: number) => setCurrentStep(clamp(next)),
      start: (next = 0) => {
        setCurrentStep(clamp(next))
        setIsOpen(true)
      },
      stop: () => setIsOpen(false),
    }
  }, [count, currentStep, isOpen, setCurrentStep, setIsOpen])

  return (
    <CoachmarkTourContext.Provider value={value}>
      {children}
    </CoachmarkTourContext.Provider>
  )
}

function CoachmarkStep({
  index,
  children,
  ...props
}: React.ComponentProps<typeof Coachmark> & { index: number }) {
  const tour = useCoachmarkTour()

  return (
    <Coachmark
      open={tour.open && tour.step === index}
      onOpenChange={(next) => {
        if (!next) tour.stop()
      }}
      {...props}
    >
      {children}
    </Coachmark>
  )
}

function CoachmarkProgress({
  className,
  value,
  total,
  ...props
}: Omit<React.ComponentProps<"div">, "value"> & {
  value?: number
  total?: number
}) {
  const tour = React.useContext(CoachmarkTourContext)
  const current = value ?? tour?.step ?? 0
  const count = total ?? tour?.count ?? 0

  if (count <= 1) return null

  return (
    <div
      data-slot="coachmark-progress"
      role="group"
      aria-label={`Step ${current + 1} of ${count}`}
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          aria-hidden
          data-active={index === current || undefined}
          className="size-1.5 rounded-full bg-current opacity-25 transition-opacity data-active:opacity-100"
        />
      ))}
    </div>
  )
}

function CoachmarkPrevious({
  className,
  variant = "ghost",
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const tour = useCoachmarkTour()

  return (
    <Button
      data-slot="coachmark-previous"
      variant={variant}
      disabled={tour.isFirst}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) tour.previous()
      }}
      className={cn(coachmarkSecondaryAction, className)}
      {...props}
    >
      {children ?? "Back"}
    </Button>
  )
}

function CoachmarkNext({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const tour = useCoachmarkTour()

  return (
    <Button
      data-slot="coachmark-next"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) tour.next()
      }}
      className={cn(coachmarkPrimaryAction, className)}
      {...props}
    >
      {children ?? (tour.isLast ? "Got it" : "Next")}
    </Button>
  )
}

export {
  Coachmark,
  CoachmarkAction,
  CoachmarkAnchor,
  CoachmarkBadge,
  CoachmarkBeacon,
  CoachmarkClose,
  CoachmarkContent,
  CoachmarkDescription,
  CoachmarkDismiss,
  CoachmarkFooter,
  CoachmarkHeader,
  CoachmarkMedia,
  CoachmarkNext,
  CoachmarkPrevious,
  CoachmarkProgress,
  CoachmarkStep,
  CoachmarkTitle,
  CoachmarkTour,
  CoachmarkTrigger,
  coachmarkContentVariants,
  useCoachmarkTour,
}
export type { CoachmarkDismissReason, CoachmarkTone }
