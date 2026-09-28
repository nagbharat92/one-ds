# Rules for src/components/ui/tooltip.tsx

Generated from src/design-system/rules.json. Do not edit directly.

2 scoped rules. Read _always.md as well.

### Tooltips are arrowless inverse pills

geometry.tooltip-shape | Required | approved | enforcement: Automated

Render TooltipContent as an inverse rounded pill without a directional arrow or beak. Use the fixed --radius-xl corner, which equals half the resting single-line height, and preserve --tooltip-gap between the trigger and surface. Keep the radius fixed when content wraps rather than applying an unbounded pill radius.

Exceptions: Coachmarks are larger teaching surfaces with their own anchored arrow geometry and are not tooltips. Consumer className may adjust layout, but should not restore an arrow or unbounded radius.

Tokens: `--radius-xl`, `--tooltip-gap`

Files: src/components/ui/tooltip.tsx, src/index.css

### Edge tooltips open inward

geometry.tooltip-placement | Required | approved | enforcement: Automated

Keep the plain Button tooltip default directly above and centered. When a control is pinned to a viewport edge, its owning composition sets the preferred side toward the viewport interior instead of relying on collision fallback to choose another axis. The floating NavigationPaneTrigger maps a start-edge navigation pane to right and an end-edge navigation pane to left. Radix collision avoidance remains enabled as the fallback when the preferred side cannot fit.

Exceptions: Material plain tooltips in app bars appear below their controls and should opt into that side in the app-bar composition. Rich tooltips default bottom-right and are a separate component role. The inward mapping is a OneDS contextual extension; Material specifies above as the ordinary plain-tooltip default, not a universal right-side default.

Tokens: `--tooltip-gap`

Files: src/components/ui/tooltip.tsx, src/components/ui/button.tsx, src/components/ui/navigation-pane.tsx
