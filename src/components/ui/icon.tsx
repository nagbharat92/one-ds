import * as React from "react"

import { cn } from "@/lib/utils"

const iconSizes = [8, 12, 14, 16, 20, 24, 28, 32] as const
type IconSize = (typeof iconSizes)[number]
type IconBoxSize = IconSize | 40 | 48 | 56
type IconGlyph = React.ComponentType<Omit<React.ComponentProps<"svg">, "strokeWidth">>
type IconProps = Omit<React.ComponentProps<"svg">, "children" | "color" | "width" | "height" | "strokeWidth" | "style" | "viewBox"> & {
  icon: IconGlyph
  size?: IconSize | "auto"
  label?: string
  filled?: boolean
}

function Icon({ icon: Glyph, size = 20, label, filled, className, ...props }: IconProps) {
  const meaningful = Boolean(label || props["aria-label"] || props["aria-labelledby"] || props.role === "status")
  return (
    <Glyph
      data-slot="icon"
      data-size={size}
      data-filled={filled}
      className={cn("oneds-icon shrink-0", size !== "auto" && "size-(--icon-size)", className)}
      role={meaningful ? "img" : undefined}
      aria-label={label}
      aria-hidden={meaningful ? undefined : true}
      focusable="false"
      {...props}
    />
  )
}

function createIcon(icon: IconGlyph) {
  return function SystemIcon({ size = "auto", ...props }: Omit<IconProps, "icon" | "size"> & { size?: IconSize | "auto" }) {
    return <Icon icon={icon} size={size} {...props} />
  }
}

function IconBox({ size = 40, className, ...props }: React.ComponentProps<"span"> & { size?: IconBoxSize }) {
  return <span {...props} data-slot="icon-box" data-icon data-size={size} className={cn("oneds-icon-box", className)} />
}

export { Icon, IconBox, iconSizes, createIcon }
export type { IconSize, IconBoxSize, IconProps, IconGlyph }