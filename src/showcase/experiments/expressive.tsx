import * as React from "react"
import "./expressive.css"
import {
  MoreHorizontalIcon,
  RotateCcwIcon,
  XIcon,
} from "@/components/ui/icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
} from "@/components/ui/toolbar"

import type { FormExperimentMode, LabScenario } from "@/components/expression-lab-preview"
export type { FormExperimentMode, LabScenario } from "@/components/expression-lab-preview"
export type FormEvaluation = "none" | "squint" | "silhouette"
export type FormPreviewSize = "wide" | "compact"

type ExperimentToolbarProps = {
  mode: FormExperimentMode
  previewSize: FormPreviewSize
  scenario: LabScenario
  evaluation: FormEvaluation
  onModeChange: (mode: FormExperimentMode) => void
  onPreviewSizeChange: (size: FormPreviewSize) => void
  onScenarioChange: (scenario: Exclude<LabScenario, "custom">) => void
  onEvaluationChange: (evaluation: FormEvaluation) => void
  onReset: () => void
  onHide: () => void
}

function ExperimentToolbar({
  mode,
  previewSize,
  scenario,
  evaluation,
  onModeChange,
  onPreviewSizeChange,
  onScenarioChange,
  onEvaluationChange,
  onReset,
  onHide,
}: ExperimentToolbarProps) {
  return (
    <Toolbar
      className="form-experiment__toolbar no-scrollbar flex-nowrap overflow-x-auto [--tb-inner:var(--radius-lg)]"
      aria-label="Experiment tools"
    >
      <ToolbarGroup>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) onModeChange(value as FormExperimentMode)
          }}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Design treatment"
          className="form-experiment__button-group"
        >
          <ToggleGroupItem value="baseline">Original</ToggleGroupItem>
          <ToggleGroupItem value="expressive">Expressive</ToggleGroupItem>
        </ToggleGroup>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToggleGroup
          type="single"
          value={evaluation}
          onValueChange={(value) => {
            if (value) onEvaluationChange(value as FormEvaluation)
          }}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Evaluation view"
          className="form-experiment__button-group"
        >
          <ToggleGroupItem value="none">Clean</ToggleGroupItem>
          <ToggleGroupItem value="squint">Squint</ToggleGroupItem>
          <ToggleGroupItem value="silhouette">Silhouette</ToggleGroupItem>
        </ToggleGroup>
      </ToolbarGroup>

      <ToolbarSpacer />

      <ToolbarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="More experiment tools"
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Experiment tools</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Preview size</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={previewSize}
                  onValueChange={(value) =>
                    onPreviewSizeChange(value as FormPreviewSize)
                  }
                >
                  <DropdownMenuRadioItem value="wide">
                    Wide
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="compact">
                    Compact
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Application state</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={scenario}
                  onValueChange={(value) => {
                    if (value !== "custom") {
                      onScenarioChange(
                        value as Exclude<LabScenario, "custom">,
                      )
                    }
                  }}
                >
                  <DropdownMenuRadioItem value="rest">
                    Rest
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="active">
                    Active
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="complete">
                    Complete
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="custom" disabled>
                    Custom
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onReset}>
              <RotateCcwIcon />
              Reset experiment
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onHide}>
              <XIcon />
              Hide tools
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolbarGroup>
    </Toolbar>
  )
}

export type FormWorkbenchRenderState = {
  mode: FormExperimentMode
  scenario: LabScenario
  scenarioVersion: number
  markCustom: () => void
  applyScenario: (scenario: Exclude<LabScenario, "custom">) => void
}

export function ExpressiveWorkbench({
  children,
}: {
  children: (state: FormWorkbenchRenderState) => React.ReactNode
}) {
  const [mode, setMode] = React.useState<FormExperimentMode>("expressive")
  const [previewSize, setPreviewSize] =
    React.useState<FormPreviewSize>("wide")
  const [scenario, setScenario] = React.useState<LabScenario>("active")
  const [scenarioVersion, setScenarioVersion] = React.useState(0)
  const [evaluation, setEvaluation] =
    React.useState<FormEvaluation>("none")
  const [toolsHidden, setToolsHidden] = React.useState(false)

  const markCustom = React.useCallback(() => {
    setScenario("custom")
  }, [])

  const applyScenario = React.useCallback(
    (nextScenario: Exclude<LabScenario, "custom">) => {
      setScenario(nextScenario)
      setScenarioVersion((version) => version + 1)
    },
    [],
  )

  const reset = () => {
    setMode("expressive")
    setPreviewSize("wide")
    setEvaluation("none")
    setToolsHidden(false)
    applyScenario("active")
  }

  return (
    <section
      className="form-experiment"
      data-tools-hidden={toolsHidden}
      aria-label="Expressive theme experiment"
    >
      {toolsHidden ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="form-experiment__reveal"
          aria-label="Show experiment tools"
          onClick={() => setToolsHidden(false)}
        >
          <MoreHorizontalIcon />
        </Button>
      ) : (
        <ExperimentToolbar
          mode={mode}
          previewSize={previewSize}
          scenario={scenario}
          evaluation={evaluation}
          onModeChange={setMode}
          onPreviewSizeChange={setPreviewSize}
          onScenarioChange={applyScenario}
          onEvaluationChange={setEvaluation}
          onReset={reset}
          onHide={() => setToolsHidden(true)}
        />
      )}

      <div
        className="form-experiment__viewport"
        data-preview-size={previewSize}
        data-evaluation={evaluation}
      >
        {children({
          mode,
          scenario,
          scenarioVersion,
          markCustom,
          applyScenario,
        })}
      </div>
    </section>
  )
}
