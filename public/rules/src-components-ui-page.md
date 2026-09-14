# Rules for src/components/ui/page.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Showcase previews have Default and Large tiers

showcase.surface-scale | Required | approved | enforcement: Partially automated

Use the Default showcase tier for component pages with the shared app-width PageContent. Ordinary preview canvases have the tokenized 200px minimum and grow with in-flow content. Reserve the roomy viewport canvas minimum for examples that explicitly need spatial room. Large uses the application tier with full-width PageContent and the existing application-height canvas.

Exceptions: Canvas alignment layouts such as start and wide retain their alignment with the ordinary minimum. Explicit viewport examples keep the viewport minimum. Examples that own their canvas retain their component-defined anatomy and content-driven height. This rule governs the showcase shell, not the dimensions of demonstrated components or general-purpose PageContent variants.

Tokens: `--showcase-preview-min-height`, `--canvas-viewport-height`, `--showcase-block-preview-height`

Files: src/App.tsx, src/showcase/types.ts, src/components/ui/page.tsx, src/components/ui/canvas.tsx, src/index.css
