import type { ComponentEntry } from "@/showcase/types"
import { Canvas } from "@/components/ui/canvas"
import { CanvasPreviewFrame } from "@/components/ui/canvas-preview"
import { MaterialColorRoles } from "@/components/ui/color-theme"
import { MaterialTheme } from "@/components/ui/material-theme"
import { ExpressionLabPreview } from "@/components/expression-lab-preview"
import { Stack } from "@/components/ui/stack"

function ColorThemeDemo() {
  return (
    <CanvasPreviewFrame>
      <MaterialTheme className="@container/color-preview w-full">
        <Stack gap="lg">
          <Canvas layout="application" background="plain" className="p-0">
            <ExpressionLabPreview />
          </Canvas>
          <MaterialColorRoles />
        </Stack>
      </MaterialTheme>
    </CanvasPreviewFrame>
  )
}

export const colorDemos: ComponentEntry[] = [
  {
    slug: "colors",
    name: "Colors",
    description:
      "Material website color roles: Surface and its container levels, Primary, Secondary, Tertiary, and their paired on-colors. Neutral surfaces are shared across the site and components; this preview also applies the website's accent roles.",
    category: "Experiments",
    surface: "default",
    installCommand: null,
    Demo: ColorThemeDemo,
    defaultExampleName: "Material website",
    ownsCanvas: true,
    codeSource: "complete",
    code: "",
  },
]