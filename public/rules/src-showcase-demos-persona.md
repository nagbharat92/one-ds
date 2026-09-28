# Rules for src/showcase/demos/persona.tsx

Generated from src/design-system/rules.json. Do not edit directly.

2 scoped rules. Read _always.md as well.

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
