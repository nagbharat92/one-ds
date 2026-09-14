import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
  XIcon,
} from "@/components/ui/icons"
import { Shape } from "@/components/ui/shape"
import type { ShapeName } from "@/lib/shapes"

function ToastShapeIcon({
  shape = "cookie6",
  fill = "var(--alert-neutral-ink)",
  ink = "var(--alert-neutral-fill)",
  children,
}: {
  shape?: ShapeName
  fill?: string
  ink?: string
  children: React.ReactNode
}) {
  const filledIcon = React.isValidElement<{ filled?: boolean }>(children)
    ? React.cloneElement(children, { filled: true })
    : children

  return (
    <div
      data-slot="toast-shape-icon"
      className="relative grid size-10 shrink-0 place-items-center"
      style={{ color: ink }}
    >
      <Shape
        name={shape}
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full"
        style={{ fill }}
      />
      <span className="relative grid size-5 place-items-center [&>svg]:size-5 text-inherit">
        {filledIcon}
      </span>
    </div>
  )
}

const Toaster = ({ closeButton = true, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton={closeButton}
      icons={{
        close: (
          <XIcon className="size-4 text-inherit" />
        ),
        success: (
          <ToastShapeIcon
            shape="clover8"
            fill="var(--alert-success-ink)"
            ink="var(--alert-success-fill)"
          >
            <CircleCheckIcon />
          </ToastShapeIcon>
        ),
        info: (
          <ToastShapeIcon
            shape="cookie7"
            fill="var(--alert-info-ink)"
            ink="var(--alert-info-fill)"
          >
            <InfoIcon />
          </ToastShapeIcon>
        ),
        warning: (
          <ToastShapeIcon
            shape="pentagon"
            fill="var(--alert-warning-ink)"
            ink="var(--alert-warning-fill)"
          >
            <TriangleAlertIcon />
          </ToastShapeIcon>
        ),
        error: (
          <ToastShapeIcon
            shape="gem"
            fill="var(--alert-error-fill)"
            ink="var(--alert-error-ink)"
          >
            <OctagonXIcon />
          </ToastShapeIcon>
        ),
        loading: (
          <ToastShapeIcon
            shape="cookie6"
            fill="var(--button-secondary-fill)"
            ink="var(--button-secondary-ink)"
          >
            <Loader2Icon className="animate-spin" />
          </ToastShapeIcon>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--elevation-stroke)",
          "--border-radius": "var(--toast-radius)",
          "--width": "var(--toast-width)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          gap: "var(--toast-gap)",
        },
        classNames: {
          toast:
            "cn-toast rounded-(--toast-radius)! border-(--elevation-stroke)! bg-popover! p-(--toast-padding)! text-popover-foreground! shadow-(--elevation-floating)! font-sans items-center!",
          icon: "size-10! relative! flex! items-center! justify-center! shrink-0! self-center! m-0! mr-(--toast-icon-gap)!",
          content: "flex! flex-col! gap-1! min-w-0! flex-1! py-0! pe-0! m-0! mr-(--toast-content-gap)!",
          title: "font-heading font-semibold text-sm leading-snug text-foreground",
          description: "text-sm text-muted-foreground leading-normal",
          actionButton:
            "rounded-(--toast-inner-radius)! font-medium text-sm! px-(--button-padding-default)! h-(--button-height-default)! bg-foreground! text-background! hover:bg-foreground/90! cursor-pointer! shrink-0! order-1! m-0!",
          cancelButton:
            "rounded-(--toast-inner-radius)! font-medium text-sm! px-(--button-padding-default)! h-(--button-height-default)! bg-muted! text-foreground! hover:bg-muted/80! cursor-pointer! shrink-0! order-1! m-0!",
          closeButton:
            "static! inset-auto! transform-none! order-last! flex! size-(--button-height-default)! shrink-0! items-center! justify-center! rounded-(--toast-inner-radius)! border-0! bg-transparent! text-muted-foreground! hover:bg-muted! hover:text-foreground! cursor-pointer! transition-colors! m-0!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, ToastShapeIcon }
