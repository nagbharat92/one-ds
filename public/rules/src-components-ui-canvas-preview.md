# Rules for src/components/ui/canvas-preview.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Preview controls belong in a toolbar

showcase.preview-toolbar | Required | approved | enforcement: Partially automated

House canvas-level tuning and display controls in CanvasToolbar, composed from the shared Toolbar and its named parts. Place it in CanvasPreviewFrame controls above the canvas. Horizontal toolbars use inline ToolbarTitle and control pairs inside ToolbarGroup, centered on the same row; keep each pair together when groups wrap. Use ToolbarSpacer for trailing actions. Text at the outer edges receives mirrored8px optical padding: inline-start for leading ToolbarTitle text and inline-end for trailing ToolbarTitle text, including text at the edge of the first or last ToolbarGroup. Only edge text gets this correction; interior text, buttons, icons, inputs, and other controls retain their own spacing. Use --toolbar-edge-text-padding through the shared title part, not local padding. Do not stack form labels above controls, override alignment to items-end, or substitute a loose Cluster, locally styled row, or individual floating controls for the toolbar surface.

Exceptions: Product controls inside the specimen remain in their product composition. The showcase shell's Preview/Code and reset actions remain owned by the shell. Existing component-owned canvas anatomy may retain its embedded CanvasToolbar.

Tokens: `--radius-lg`, `--spacing`, `--toolbar-edge-text-padding`, `--toolbar-title-padding-start`, `--toolbar-title-padding-end`

Files: src/components/ui/canvas.tsx, src/components/ui/canvas-preview.tsx, src/components/ui/toolbar.tsx, src/showcase/experiments/pointer.tsx
