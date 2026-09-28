# Rules for src/components/ui/badge.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Badges use source-ready inline geometry

geometry.badge-scale | Required | approved | enforcement: Partially automated

Badge uses one expressive inline baseline: 28px fixed height, a 14px/21px label, 16px icon, favicon, or spinner, and the shared 8px graphic-to-label gap. Its 14px outer radius is half the fixed height; inline padding is derived from that radius minus the 4px base spacing so text clears the curved ends. Badge automatically applies IconLabel to ordinary labels, including labels inside asChild links, and adds the shared 4px optical correction opposite a graphic. Use Badge asChild with Favicon for linked source citations so the same component serves labels, statuses, and AI source references. Keep Kbd on its separate compact 20px/12px keyboard-hint geometry.

Exceptions: AvatarBadge and presence dots are status indicators, not text badges. Inline numeric footnote marks remain owned by Response; linked source pills and source lists use Badge. Badge stays single-line; use a List Item or Card when source metadata needs multiple lines. Kbd must not inherit Badge sizing changes.

Tokens: `--badge-height`, `--badge-radius`, `--badge-padding-inline`, `--badge-font-size`, `--badge-line-height`, `--badge-graphic-size`, `--badge-gap`, `--graphic-label-gap`, `--icon-label-optical-padding`

Files: src/components/ui/badge.tsx, src/components/ui/kbd.tsx, src/components/ui/favicon.tsx, src/components/ui/icon-label.tsx, src/styles/icon.css, src/styles/tokens.css, src/index.css, src/showcase/demos/data.tsx, tests/design-rules.spec.ts
