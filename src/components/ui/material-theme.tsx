import type { ComponentProps } from "react"

import { ColorTheme } from "@/components/ui/color-theme"

function MaterialTheme({ children, ...props }: Omit<ComponentProps<typeof ColorTheme>,
  "theme" | "hue" | "scale" | "materialScheme" | "contrast" | "accentButtons" | "darkCardSurface"
>) {
  return (
    <ColorTheme {...props} scale="website" accentButtons darkCardSurface="lowest">
      {children}
    </ColorTheme>
  )
}

export { MaterialTheme }