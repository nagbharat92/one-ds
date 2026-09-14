# Rules for src/showcase/demos/reference.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Edge text in a control row gets optical padding

geometry.edge-text-optical-padding | Required | approved | enforcement: Partially automated

When a padded container's leading or trailing child is a bare text run rather than a control, that text receives an extra inline inset so it matches the optical padding of the controls beside it. A container's base padding is tuned for dense, self-contained controls; sparse letterforms at that same inset read as crowded, and on a rounded corner the arc pulls the visual edge inward. Opt in with data-optical-edges on the container and wrap the edge text in EdgeText (data-slot=edge-text); the first EdgeText gains padding-inline-start and the last gains padding-inline-end from --optical-edge-text-padding (8px). Interior text, controls, and non-edge text are untouched. The correction is opt-in, never automatic, so ordinary paragraphs, labels, and descriptions are never inset. Toolbar composes this through ToolbarTitle, and --toolbar-edge-text-padding aliases the shared token. TableRow opts in structurally and overrides the correction to 16px through --table-edge-optical-padding. TableHead and TableCell wrap bare text and text-only spans; because render abstractions such as TanStack can hide primitive body text from the cell component, first and last cells without a detectable EdgeText receive the equivalent --table-edge-cell-padding fallback. Edge controls remain unwrapped but move with their host cell; interior cells remain unchanged.

Exceptions: This is the fixed correction for text mixed with controls. A pure-text pill, badge, or chip instead uses radius-derived inline padding so text clears the curve; a container may override --optical-edge-text-padding to its corner radius for that case. Table is the approved structural exception: its pill rows use a 16px override and shift complete first/last cell content when the renderer prevents text classification. The correction is inline only, for horizontal rows; block-edge text is not covered. Text flanked by controls on both sides still receives the inset on whichever edge it occupies.

Tokens: `--optical-edge-text-padding`, `--table-edge-optical-padding`, `--table-edge-cell-padding`, `--toolbar-edge-text-padding`, `--toolbar-title-padding-start`, `--toolbar-title-padding-end`

Files: src/components/ui/edge-text.tsx, src/components/ui/toolbar.tsx, src/components/ui/table.tsx, src/index.css, src/showcase/demos/reference.tsx, tests/table.spec.ts
