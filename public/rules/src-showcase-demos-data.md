# Rules for src/showcase/demos/data.tsx

Generated from src/design-system/rules.json. Do not edit directly.

5 scoped rules. Read _always.md as well.

### List Items use shared full and compact anatomy

composition.list-item | Required | approved | enforcement: Partially automated

Build list rows from Item and its named parts; do not restyle Item geometry or interaction states in consumers. Standard Items use a 26px outer radius, 16px inset, and 10px nested radius. Use the compact prop for intentional title-only rows: compact Items are 40px high with a 20px outer radius and 6px inset; their 28px media and action hosts use a 14px radius and 16px graphic. A direct 32px edit field in a compact Item uses a 4px inset and 16px radius, preserving the 40px row and concentric geometry. ItemTitle fades overflowing text at its trailing edge instead of an ellipsis. ItemActions hosted automatically applies compact geometry and sits on an opaque host-matched background. Its action fades in on fine-pointer hover, remains keyboard-focusable and appears on focus, and stays visible on coarse/touch input. Pair a selectable row with ItemPrimaryAction and keep ItemActions hosted as its sibling, never nest one button inside another. Use ItemMedia variant=icon for the circular media host, variant=image for the 44px image with the standard 10px inner radius, and ItemActionSlot for a mirrored transparent trailing graphic host. The muted variant is the selected Item state and uses the shared Secondary purple fill and paired ink. Interactive list rows use the same state-layer color and hover, focus, and pressed opacity tokens as Ghost Button. Resolve those layers over each row's actual resting host so default, outline, selected, and hosted rows preserve their base surface and hosted action masks match the visible row fill. Navigation pane menu and submenu rows consume the same Item state composites. Product navigation without NavigationPane-specific icon, collapse, or tooltip behavior composes Item compact with ItemContent and ItemTitle directly. Item has no generic size axis; compact is the only alternate composition.

Exceptions: Avatar and circular icon media are centered fixed circles, so they are floating graphics rather than uniformly inset rounded surfaces; the concentric corner equation applies to the Item boundary and nested corner-aligned surfaces. A descriptive hosted Item grows with its description and preserves the 16px text inset below it. ItemGroup controls spacing between peer rows, and product data or selection orchestration remains local.

Tokens: `--item-radius`, `--item-padding`, `--item-inner-radius`, `--item-min-height`, `--item-host-surface`, `--item-stroke`, `--item-title-fade-size`, `--item-compact-height`, `--item-compact-inset`, `--item-compact-radius`, `--item-compact-media-host-size`, `--item-compact-media-host-radius`, `--item-compact-field-inset`, `--item-compact-field-radius`, `--item-media-host-size`, `--item-media-host-radius`, `--item-media-graphic-size`, `--item-image-size`, `--button-secondary-fill`, `--button-secondary-ink`, `--state-layer-color`, `--state-layer-hover-opacity`, `--state-layer-focus-opacity`, `--state-layer-pressed-opacity`

Files: src/components/ui/item.tsx, src/components/ui/navigation-pane.tsx, src/styles/item-foundation.css, src/styles/item.css, src/styles/item-hosted.css, src/App.tsx, src/index.css, src/showcase/demos/data.tsx, src/showcase/demos/blocks.tsx, src/showcase/demos/elevation.tsx, src/showcase/demos/persona.tsx, tests/list-item.spec.ts

### Paired Card actions end with Secondary

composition.card-footer-actions | Required | approved | enforcement: Manual review

When CardFooter contains exactly two peer actions, place the lower-priority action first and the higher-priority action second in DOM order. The higher-priority action uses Secondary; the lower-priority action uses Tertiary/default, or Ghost for a dismissive action. In a horizontal footer, end alignment places Secondary at the inline end, which is the right in left-to-right interfaces. In a vertical footer, Secondary sits at the block end, which is the bottom. Never use CSS order to create this hierarchy because keyboard and reading order must match the visual order.

Exceptions: Single-action footers and mixed groups with three or more actions or a separate icon utility are outside the paired-action contract. A destructive action retains its destructive semantic variant but still occupies the final emphasized position.

Tokens: `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--card-footer-gap`

Files: src/components/ui/card.tsx, src/components/ui/button.tsx, src/showcase/demos/data.tsx, src/showcase/demos/annotation.tsx, src/showcase/demos/persona.tsx, src/showcase/experiments/concentric.tsx, src/components/expression-lab-preview.tsx

### Card spacing communicates grouping

composition.card-spacing-rhythm | Required | approved | enforcement: Partially automated

Construct standard expressive Cards as a sequence of clear regions. Treat CardHeader as one chunk, leave24px before CardContent, and leave24px before CardFooter. Non-scrolling footers omit the divider and use8px top padding with24px inline and bottom padding. A footer after scrolling content uses the shared divider and24px top padding. The same24px token supplies the Card's top and inline insets. Keep strongly related labels, values, controls, and metadata at --card-group-gap (8px); paired footer actions also stay8px apart. Distinct groups inside CardContent use24px. Use boundaries only where scrolling requires persistent separation; otherwise proximity and open space communicate grouping. Repeated rows and peer elements use consistent alignment, sizing, and spacing so similarity remains meaningful.

Exceptions: Small Cards retain compact12px spacing. Code Cards keep their specialized compact geometry. Edge-to-edge scrolling content cancels the external region gap so its box meets the header and footer, while the scroller retains24px internal padding on every side. Edge-to-edge media may replace the outer inset at its edge while the24px region gap resumes between media and text.

Tokens: `--card-spacing`, `--card-spacing-expressive`, `--card-region-gap`, `--card-group-gap`, `--card-content-group-gap`, `--card-footer-gap`, `--space-xs`

Files: src/index.css, src/styles/card.css, src/styles/tokens.css, src/components/ui/card.tsx, src/showcase/demos/data.tsx

### Badges use source-ready inline geometry

geometry.badge-scale | Required | approved | enforcement: Partially automated

Badge uses one expressive inline baseline: 28px fixed height, a 14px/21px label, 16px icon, favicon, or spinner, and the shared 8px graphic-to-label gap. Its 14px outer radius is half the fixed height; inline padding is derived from that radius minus the 4px base spacing so text clears the curved ends. Badge automatically applies IconLabel to ordinary labels, including labels inside asChild links, and adds the shared 4px optical correction opposite a graphic. Use Badge asChild with Favicon for linked source citations so the same component serves labels, statuses, and AI source references. Keep Kbd on its separate compact 20px/12px keyboard-hint geometry.

Exceptions: AvatarBadge and presence dots are status indicators, not text badges. Inline numeric footnote marks remain owned by Response; linked source pills and source lists use Badge. Badge stays single-line; use a List Item or Card when source metadata needs multiple lines. Kbd must not inherit Badge sizing changes.

Tokens: `--badge-height`, `--badge-radius`, `--badge-padding-inline`, `--badge-font-size`, `--badge-line-height`, `--badge-graphic-size`, `--badge-gap`, `--graphic-label-gap`, `--icon-label-optical-padding`

Files: src/components/ui/badge.tsx, src/components/ui/kbd.tsx, src/components/ui/favicon.tsx, src/components/ui/icon-label.tsx, src/styles/icon.css, src/styles/tokens.css, src/index.css, src/showcase/demos/data.tsx, tests/design-rules.spec.ts

### Card actions adapt without changing order

composition.card-responsive-actions | Recommended | candidate | enforcement: Manual review

Paired footer actions render as a right-aligned row on wider widths and a full-width stacked column when compact, preserving the Secondary-last order without CSS order. A header action uses CardAction so its label optically centers on the title row, dropping below the title only in the compact fallback.

Exceptions: Single-action footers and three-or-more-action groups are outside the paired-action layout. A card may keep a full-width primary action.

Tokens: `--card-footer-gap`

Files: src/components/ui/card.tsx, src/showcase/demos/data.tsx
