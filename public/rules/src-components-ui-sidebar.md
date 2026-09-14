# Rules for src/components/ui/sidebar.tsx

Generated from src/design-system/rules.json. Do not edit directly.

2 scoped rules. Read _always.md as well.

### List Items use shared full and compact anatomy

composition.list-item | Required | approved | enforcement: Partially automated

Build list rows from Item and its named parts; do not restyle Item geometry or interaction states in consumers. Standard Items use a 26px outer radius, 16px inset, and 10px nested radius. Use the compact prop for intentional title-only rows: compact Items are 40px high with a 20px outer radius and 6px inset; their 28px media and action hosts use a 14px radius and 16px graphic. A direct 32px edit field in a compact Item uses a 4px inset and 16px radius, preserving the 40px row and concentric geometry. ItemActions hosted automatically applies compact geometry and owns its opaque truncation fade. Pair a selectable row with ItemPrimaryAction and keep ItemActions hosted as its sibling, never nest one button inside another. Use ItemMedia variant=icon for the circular media host, variant=image for the 44px image with the standard 10px inner radius, and ItemActionSlot for a mirrored transparent trailing graphic host. The muted variant is the selected Item state and uses the shared Secondary purple fill and paired ink. Interactive list rows use the same state-layer color and hover, focus, and pressed opacity tokens as Ghost Button. Resolve those layers over each row's actual resting host so default, outline, selected, and hosted rows preserve their base surface and hosted action masks match the visible row fill. Sidebar menu and submenu rows consume the same Item state composites. Product navigation without Sidebar-specific icon, collapse, or tooltip behavior composes Item compact with ItemContent and ItemTitle directly. Item has no generic size axis; compact is the only alternate composition.

Exceptions: Avatar and circular icon media are centered fixed circles, so they are floating graphics rather than uniformly inset rounded surfaces; the concentric corner equation applies to the Item boundary and nested corner-aligned surfaces. A descriptive hosted Item grows with its description and preserves the 16px text inset below it. ItemGroup controls spacing between peer rows, and product data or selection orchestration remains local.

Tokens: `--item-radius`, `--item-padding`, `--item-inner-radius`, `--item-min-height`, `--item-host-surface`, `--item-stroke`, `--item-compact-height`, `--item-compact-inset`, `--item-compact-radius`, `--item-compact-media-host-size`, `--item-compact-media-host-radius`, `--item-compact-field-inset`, `--item-compact-field-radius`, `--item-media-host-size`, `--item-media-host-radius`, `--item-media-graphic-size`, `--item-image-size`, `--item-hosted-action-fade-size`, `--button-secondary-fill`, `--button-secondary-ink`, `--state-layer-color`, `--state-layer-hover-opacity`, `--state-layer-focus-opacity`, `--state-layer-pressed-opacity`

Files: src/components/ui/item.tsx, src/components/ui/sidebar.tsx, src/App.tsx, src/index.css, src/showcase/demos/data.tsx, src/showcase/demos/blocks.tsx, src/showcase/demos/elevation.tsx, src/showcase/demos/persona.tsx, tests/list-item.spec.ts

### Edge tooltips open inward

geometry.tooltip-placement | Required | approved | enforcement: Automated

Keep the plain Button tooltip default directly above and centered. When a control is pinned to a viewport edge, its owning composition sets the preferred side toward the viewport interior instead of relying on collision fallback to choose another axis. The floating SidebarTrigger maps a start-edge sidebar to right and an end-edge sidebar to left. Radix collision avoidance remains enabled as the fallback when the preferred side cannot fit.

Exceptions: Material plain tooltips in app bars appear below their controls and should opt into that side in the app-bar composition. Rich tooltips default bottom-right and are a separate component role. The inward mapping is a OneDS contextual extension; Material specifies above as the ordinary plain-tooltip default, not a universal right-side default.

Tokens: `--tooltip-gap`

Files: src/components/ui/tooltip.tsx, src/components/ui/button.tsx, src/components/ui/sidebar.tsx
