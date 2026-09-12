import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Elevation } from "@/components/ui/elevation"
import { IconLabel } from "@/components/ui/icon-label"
import { Shape } from "@/components/ui/shape"
import { Text } from "@/components/ui/text"
import type { ShapeName } from "@/lib/shapes"

const alertVariants = cva(
  "group/alert @container/alert w-full rounded-(--alert-radius) bg-(--alert-fill) px-(--alert-padding-inline) py-(--alert-padding-block) text-left text-sm text-(--alert-ink) ring-1 ring-(--elevation-stroke)",
  {
    variants: {
      variant: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        error: "",
        default: "",
        destructive: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>
type AlertTone = "neutral" | "info" | "success" | "warning" | "error"

const alertTones = {
  neutral: "neutral",
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
  default: "neutral",
  destructive: "error",
} as const satisfies Record<AlertVariant, AlertTone>

const alertShapes = {
  neutral: "cookie6",
  info: "circle",
  success: "clover4",
  warning: "diamond",
  error: "cookie4",
} as const satisfies Record<AlertTone, ShapeName>

const AlertToneContext = React.createContext<AlertTone>("neutral")

const alertLiveRoles = {
  off: undefined,
  polite: "status",
  assertive: "alert",
} as const

function Alert({
  className,
  variant = "neutral",
  live = "off",
  role,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    live?: keyof typeof alertLiveRoles
  }) {
  const resolvedVariant = variant ?? "neutral"

  const tone = alertTones[resolvedVariant]

  return (
    <AlertToneContext.Provider value={tone}>
      <Elevation asChild level="flat">
        <div
          data-slot="alert"
          data-variant={resolvedVariant}
          data-tone={tone}
          // Only an alert that APPEARS in response to something should interrupt.
          // Alerts present at load are page content, so they stay silent by default.
          role={role ?? alertLiveRoles[live]}
          className={cn(alertVariants({ variant: resolvedVariant }), className)}
          {...props}
        >
          <div
            data-slot="alert-layout"
            className="group/alert-layout grid min-w-0 grid-cols-(--alert-layout-content-columns) items-start gap-y-(--alert-action-gap) has-data-[slot=alert-icon]:grid-cols-(--alert-layout-icon-columns) @sm/alert:has-data-[slot=alert-action]:grid-cols-(--alert-layout-action-columns) @sm/alert:has-data-[slot=alert-icon]:has-data-[slot=alert-action]:grid-cols-(--alert-layout-icon-action-columns)"
          >
            {children}
          </div>
        </div>
      </Elevation>
    </AlertToneContext.Provider>
  )
}

function AlertIcon({ className, shape, children, ...props }: React.ComponentProps<"div"> & { shape?: ShapeName }) {
  const tone = React.useContext(AlertToneContext)
  const resolvedShape = shape ?? alertShapes[tone]

  return (
    <div
      data-slot="alert-icon"
      data-icon
      data-shape={resolvedShape}
      className={cn(
        "relative col-start-1 row-start-1 grid size-(--alert-accent-size) shrink-0 place-items-center text-(--alert-accent-ink)",
        className
      )}
      {...props}
    >
      <Shape name={resolvedShape} aria-hidden="true" focusable="false" className="alert-icon__shape absolute inset-0 size-full" />
      <span data-slot="alert-icon-glyph" className="relative grid size-(--alert-accent-icon-size) place-items-center [&>svg]:size-(--alert-accent-icon-size)">
        {children}
      </span>
    </div>
  )
}

function AlertContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <IconLabel asChild>
      <div
        data-slot="alert-content"
        className={cn(
          "col-start-1 row-start-1 grid min-w-0 gap-(--alert-content-gap) group-has-data-[slot=alert-icon]/alert-layout:col-start-2 group-has-data-[slot=alert-icon]/alert-layout:ms-(--alert-graphic-gap-offset)",
          className
        )}
        {...props}
      />
    </IconLabel>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Text variant="lead" tone={null} asChild>
      <div
        data-slot="alert-title"
        className={cn(
          "font-medium [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
          className
        )}
        {...props}
      />
    </Text>
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Text variant="label" tone="muted" asChild>
      <div
        data-slot="alert-description"
        className={cn(
          "text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
        {...props}
      />
    </Text>
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "col-start-1 row-start-2 flex flex-wrap items-center justify-end gap-(--graphic-label-gap) group-has-data-[slot=alert-icon]/alert-layout:col-start-2 group-has-data-[slot=alert-icon]/alert-layout:ms-(--alert-graphic-gap-offset) @sm/alert:col-start-2 @sm/alert:row-start-1 @sm/alert:ms-0 @sm/alert:self-start @sm/alert:justify-self-end @sm/alert:group-has-data-[slot=alert-icon]/alert-layout:col-start-3",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription, AlertAction }
