import type { ComponentEntry } from "@/showcase/types"
import { ExpressionLabCanvas } from "@/components/expression-lab-preview"
import { ExpressiveWorkbench } from "@/showcase/experiments/expressive"

function ExpressionLab() {
  return (
    <ExpressiveWorkbench>
      {({
        mode,
        scenario,
        scenarioVersion,
        markCustom,
        applyScenario,
      }) => (
        <ExpressionLabCanvas
          key={scenarioVersion}
          mode={mode}
          scenario={scenario}
          onInteraction={markCustom}
          onScenarioChange={applyScenario}
        />
      )}
    </ExpressiveWorkbench>
  )
}

export const experimentDemos: ComponentEntry[] = [
  {
    slug: "expression-lab",
    name: "Expression Lab",
    description:
      "A neutral, interactive application surface for testing OneDS color, form, scale and motion decisions in context.",
    category: "Experiments",
    installCommand: null,
    Demo: ExpressionLab,
    code: `import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs } from "@/components/ui/tabs"

export function ExpressionLab() {
  return (
    <section className="expression-lab">
      {/* Keep this application composition stable. */}
      <Card data-lab-region="prominent-action" />
      <Card data-lab-region="media-control" />
      <Card data-lab-region="experiment-checklist" />
      <Card data-lab-region="control-island" />
      <Button>Start session</Button>
      <Slider aria-label="Session length" />
      <Tabs>{/* Today and weekly views */}</Tabs>
    </section>
  )
}`,
  },
]
