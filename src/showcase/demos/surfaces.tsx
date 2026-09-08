import type { ComponentEntry } from "@/showcase/types"
import { MaterialTheme } from "@/components/ui/material-theme"
import { SurfaceDiagram } from "@/components/ui/surface-diagram"

function WorkspaceSurfacesDemo() {
  return <MaterialTheme className="w-full"><SurfaceDiagram /></MaterialTheme>
}

function ContentSurfacesDemo() {
  return <MaterialTheme className="w-full"><SurfaceDiagram variant="content" /></MaterialTheme>
}

function FloatingSurfacesDemo() {
  return <MaterialTheme className="w-full"><SurfaceDiagram variant="overlay" /></MaterialTheme>
}

export const surfaceDemos: ComponentEntry[] = [
  {
    slug: "surfaces",
    name: "Surfaces",
    category: "Layout",
    surface: "default",
    installCommand: null,
    description:
      "UI silhouettes show Material surface relationships in context: neutral navigation, content surfaces, cards, tonal actions, and floating panels. Shapes use the actual light and dark theme roles, without product details or interactive controls.",
    Demo: WorkspaceSurfacesDemo,
    defaultExampleName: "Workspace",
    codeSource: "complete",
    code: "",
    examples: [
      {
        name: "Content and controls",
        description: "Surface container low surrounds lowest and highest surfaces, with secondary and primary action containers.",
        Demo: ContentSurfacesDemo,
      },
      {
        name: "Floating surface",
        description: "Surface container high sits above the same workspace. Shadow is composed separately from surface color.",
        Demo: FloatingSurfacesDemo,
      },
    ],
  },
]