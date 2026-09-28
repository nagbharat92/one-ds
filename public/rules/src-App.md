# Rules for src/App.tsx

Generated from src/design-system/rules.json. Do not edit directly.

4 scoped rules. Read _always.md as well.

### List Items use shared full and compact anatomy

composition.list-item | Required | approved | enforcement: Partially automated

Build list rows from Item and its named parts; do not restyle Item geometry or interaction states in consumers. Standard Items use a 26px outer radius, 16px inset, and 10px nested radius. Use the compact prop for intentional title-only rows: compact Items are 40px high with a 20px outer radius and 6px inset; their 28px media and action hosts use a 14px radius and 16px graphic. A direct 32px edit field in a compact Item uses a 4px inset and 16px radius, preserving the 40px row and concentric geometry. ItemTitle fades overflowing text at its trailing edge instead of an ellipsis. ItemActions hosted automatically applies compact geometry and sits on an opaque host-matched background. Its action fades in on fine-pointer hover, remains keyboard-focusable and appears on focus, and stays visible on coarse/touch input. Pair a selectable row with ItemPrimaryAction and keep ItemActions hosted as its sibling, never nest one button inside another. Use ItemMedia variant=icon for the circular media host, variant=image for the 44px image with the standard 10px inner radius, and ItemActionSlot for a mirrored transparent trailing graphic host. The muted variant is the selected Item state and uses the shared Secondary purple fill and paired ink. Interactive list rows use the same state-layer color and hover, focus, and pressed opacity tokens as Ghost Button. Resolve those layers over each row's actual resting host so default, outline, selected, and hosted rows preserve their base surface and hosted action masks match the visible row fill. Navigation pane menu and submenu rows consume the same Item state composites. Product navigation without NavigationPane-specific icon, collapse, or tooltip behavior composes Item compact with ItemContent and ItemTitle directly. Item has no generic size axis; compact is the only alternate composition.

Exceptions: Avatar and circular icon media are centered fixed circles, so they are floating graphics rather than uniformly inset rounded surfaces; the concentric corner equation applies to the Item boundary and nested corner-aligned surfaces. A descriptive hosted Item grows with its description and preserves the 16px text inset below it. ItemGroup controls spacing between peer rows, and product data or selection orchestration remains local.

Tokens: `--item-radius`, `--item-padding`, `--item-inner-radius`, `--item-min-height`, `--item-host-surface`, `--item-stroke`, `--item-title-fade-size`, `--item-compact-height`, `--item-compact-inset`, `--item-compact-radius`, `--item-compact-media-host-size`, `--item-compact-media-host-radius`, `--item-compact-field-inset`, `--item-compact-field-radius`, `--item-media-host-size`, `--item-media-host-radius`, `--item-media-graphic-size`, `--item-image-size`, `--button-secondary-fill`, `--button-secondary-ink`, `--state-layer-color`, `--state-layer-hover-opacity`, `--state-layer-focus-opacity`, `--state-layer-pressed-opacity`

Files: src/components/ui/item.tsx, src/components/ui/navigation-pane.tsx, src/styles/item-foundation.css, src/styles/item.css, src/styles/item-hosted.css, src/App.tsx, src/index.css, src/showcase/demos/data.tsx, src/showcase/demos/blocks.tsx, src/showcase/demos/elevation.tsx, src/showcase/demos/persona.tsx, tests/list-item.spec.ts

### Default to neutral supporting actions

controls.supporting-actions | Required | approved | enforcement: Partially automated

Button has no outline variant. Use neutral Tertiary for general actions and labelled supporting actions such as Cancel, including buttons beside search, select/dropdown, and mixed tools. Omitted variants use Tertiary. Button groups, including split actions, normally use Tertiary or Secondary. A split layout does not imply primary emphasis: use Primary only when the action is explicitly a prominent CTA. Use ghost for isolated icon-only actions/groups or field-internal affordances. Never infer emphasis by inspecting the DOM.

Exceptions: Primary and destructive intent, links, and persistent selected states retain their semantic treatment. Embedded field affordances such as clear or reveal may remain ghost because the field already supplies a shared container. An outer card border alone is not a neighboring outlined control. An isolated icon-only menu trigger may be ghost; opening its menu does not change the trigger's resting variant. Input, select, Badge, Toggle, and other non-Button outline variants are unaffected.

Tokens: `--button-tertiary-fill`, `--button-tertiary-ink`, `--state-layer-hover`, `--state-layer-pressed`

Files: src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/pagination.tsx, src/showcase/demos/forms.tsx, src/showcase/demos/layout.tsx, src/App.tsx

### Match neighboring control shapes

geometry.contextual-button-shapes | Required | approved | enforcement: Partially automated

Choose a consistent resting shape for related controls. When a group or nested group uses soft-square controls, accompanying actions also use soft-square buttons, such as Reset beside square Preview/Code tabs. Beside a pill-shaped search field, use a round icon action. Set ButtonGroup shape=square or shape=round explicitly in the owning composition; unspecified nested groups inherit the outer shape. Square means the tokenized soft corner, not sharp zero-radius corners. Do not detect neighboring appearance at runtime.

Exceptions: Selected buttons retain their deliberate rounded state as selection feedback. An explicitly configured child group may override its inherited resting shape. This rule does not resize tabs, fields, or buttons or change their color emphasis.

Tokens: `--button-group-outer-radius`, `--button-group-inner-radius`, `--button-round-radius`

Files: src/components/ui/button-group.tsx, src/index.css, src/App.tsx

### Showcase previews have Default and Large tiers

showcase.surface-scale | Required | approved | enforcement: Partially automated

Use the Default showcase tier for component pages with the shared app-width PageContent. Ordinary preview canvases have the tokenized 200px minimum and grow with in-flow content. Reserve the roomy viewport canvas minimum for examples that explicitly need spatial room. Large uses the application tier with full-width PageContent and the existing application-height canvas.

Exceptions: Canvas alignment layouts such as start and wide retain their alignment with the ordinary minimum. Explicit viewport examples keep the viewport minimum. Examples that own their canvas retain their component-defined anatomy and content-driven height. This rule governs the showcase shell, not the dimensions of demonstrated components or general-purpose PageContent variants.

Tokens: `--showcase-preview-min-height`, `--canvas-viewport-height`, `--showcase-block-preview-height`

Files: src/App.tsx, src/showcase/types.ts, src/components/ui/page.tsx, src/components/ui/canvas.tsx, src/index.css
