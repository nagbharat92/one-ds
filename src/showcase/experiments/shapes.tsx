import { ShapeBrowser } from "@/components/ui/shape"
import type { ComponentEntry } from "@/showcase/types"

function ShapesExperiment() {
  return (
    <ShapeBrowser />
  )
}

export const shapeDemos: ComponentEntry[] = [{
  slug: "shapes",
  name: "Shapes",
  category: "Experiments",
  surface: "default",
  ownsCanvas: true,
  defaultExampleName: "Shape library",
  codeSource: "complete",
  installCommand: null,
  description: "Symmetric geometry and expressive silhouettes. A shape library and interactive morph study inspired by Material Design.",
  Demo: ShapesExperiment,
  code: `import { Shape } from "@/components/ui/shape"

export function ShapeDemo() {
  return <Shape name="clover4" tone="purple" />
}`,
}]