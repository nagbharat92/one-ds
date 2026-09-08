import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MaterialSurface } from "@/components/ui/material-surface"
import { cn } from "@/lib/utils"

type SurfaceDiagramVariant = "workspace" | "content" | "overlay"

function DiagramShape({ kind, tone = "secondary", className }: {
  kind: "icon" | "field" | "media"
  tone?: "primary" | "secondary"
  className?: string
}) {
  return <span className={cn("surface-diagram__shape", className)} data-kind={kind} data-tone={tone} />
}

function DiagramAction({ primary = false }: { primary?: boolean }) {
  return (
    <span className="surface-diagram__action" data-primary={primary} />
  )
}

function DiagramCard() {
  return (
    <Card className="surface-diagram__card">
      <CardContent className="surface-diagram__copy" />
      <CardFooter className="surface-diagram__actions">
        <DiagramAction />
        <DiagramAction primary />
      </CardFooter>
    </Card>
  )
}

function DiagramWorkspace() {
  return (
    <MaterialSurface surface="surface-container" className="surface-diagram__workspace">
      <div className="surface-diagram__navigation">
        <DiagramShape kind="icon" tone="primary" />
        <span className="surface-diagram__selected" />
        <DiagramShape kind="icon" className="surface-diagram__account" />
      </div>
      <MaterialSurface className="surface-diagram__main">
        <div className="surface-diagram__header" />
        <div className="surface-diagram__body">
          <DiagramShape kind="field" />
          <div className="surface-diagram__columns"><DiagramCard /><DiagramCard /></div>
        </div>
      </MaterialSurface>
    </MaterialSurface>
  )
}

function SurfaceDiagram({ variant = "workspace", className }: {
  variant?: SurfaceDiagramVariant
  className?: string
}) {
  const labels: Record<SurfaceDiagramVariant, string> = {
    workspace: "Workspace silhouette with neutral navigation, a lilac selection, white or dark cards, and purple filled actions",
    content: "Content silhouette with surface containers, a higher-container field, and secondary and primary action surfaces",
    overlay: "Floating surface silhouette above a workspace, contrasting surface container high with the underlying surface levels",
  }
  return (
    <div role="img" aria-label={labels[variant]} data-slot="surface-diagram" data-variant={variant} className={cn("surface-diagram", className)}>
      <div className="surface-diagram__scene" aria-hidden="true" inert>
        {variant === "content" ? (
          <MaterialSurface surface="surface-container-low" className="surface-diagram__content">
            <MaterialSurface surface="surface-container-highest" className="surface-diagram__media">
              <DiagramShape kind="media" tone="secondary" />
              <DiagramShape kind="icon" tone="primary" />
            </MaterialSurface>
            <MaterialSurface surface="surface-container-lowest" className="surface-diagram__detail">
              <DiagramShape kind="field" />
              <div className="surface-diagram__actions"><DiagramAction /><DiagramAction primary /></div>
            </MaterialSurface>
          </MaterialSurface>
        ) : (
          <>
            <DiagramWorkspace />
            {variant === "overlay" && (
              <MaterialSurface surface="surface-container-high" className="surface-diagram__overlay">
                <div className="surface-diagram__header" />
                <DiagramShape kind="field" />
                <div className="surface-diagram__actions"><DiagramAction /><DiagramAction primary /></div>
              </MaterialSurface>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { SurfaceDiagram }
export type { SurfaceDiagramVariant }