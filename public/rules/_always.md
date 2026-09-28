# Rules that always apply

Generated from src/design-system/rules.json. Do not edit directly.

14 cross-cutting rules. Read this for every UI change, then read the
slice for the file you are editing. Full rationale, decision history and
enforcement detail live in ../design-rules.md; you do not need them to comply.

### Build everything from OneDS components

composition.shared-anatomy | Required | approved | enforcement: Partially automated

This is the first authoring rule: every interface must use OneDS components and their named parts. Inspect the library before building. Extend the owning component when a capability is missing; if no suitable component exists, create a reusable tokenized component in the library, document it in the showcase, and consume it. Never duplicate component styling or interaction behavior at a page call site.

Exceptions: Plain semantic HTML may carry content inside component slots. Product-specific data and orchestration stay in the page. Neither exception permits a local replacement for a shared visual or interactive pattern. Do not create empty wrappers that add no reusable responsibility.

Tokens: `--text-body-size`, `--text-body-leading`, `--toc-width`, `--toc-sticky-inset`

Files: src/showcase/design-rules-page.tsx, src/components/ui/text.tsx, src/components/ui/table-of-contents.tsx, src/components/ui/accordion.tsx, AGENTS.md

### Always use Material Symbols through shared components

icons.material-symbols | Required | approved | enforcement: Partially automated

Material Symbols Rounded is the only approved system icon library. All consumers and showcases import named icons from src/components/ui/icons.tsx. Only that public module imports icon-adapters/active.ts, which statically selects material.tsx. The adapter renders an official self-hosted variable font inside the existing SVG viewport. Icon owns library-independent sizing and accessibility; IconBox is optional square layout, not a hit target. No other icon packages, locally drawn icons, static filled swaps, or runtime library providers are allowed. Selected Buttons automatically animate the native FILL axis from 0 to 1 using tokenized Button effect timing. Do not simulate selection with CSS path fill or stroke weight. Intrinsically asymmetric glyph artwork may receive an adapter-owned, tokenized optical correction without changing its SVG viewport; the warning triangle is lifted2px to center its visual mass. Reduced motion applies the filled state immediately. Preserve native activation, accessible names, refs, and host geometry. Named sizes remain 8, 12, 14, 16, 20, 24, 28, and 32px; legacy sizes below 20 use optical size 20. Extend the adapter and public module for missing glyphs, then run npm run icons:update-font. The checked-in subset and manifest must cover every symbol; no network font dependency at runtime or build time. Generated examples follow the same rules.

Exceptions: Favicons remain brand images because Material does not supply brand logos. Shape artwork, charts, annotation connectors, and coachmark arrows are geometric content, not system icons. Spinner retains animation ownership with a Material glyph. Material symbols with identical outline/filled artwork retain that canonical shape; selection still has paired button color and shape feedback. Font glyph ink differs from its SVG viewport.

Tokens: `--icon-size-8`, `--icon-size-12`, `--icon-size-14`, `--icon-size-16`, `--icon-size-20`, `--icon-size-24`, `--icon-size-28`, `--icon-size-32`, `--icon-box-size-40`, `--icon-box-size-48`, `--icon-box-size-56`, `--material-icon-font-family`, `--material-icon-weight`, `--material-icon-optical-size`, `--material-icon-fill-default`, `--material-icon-fill-selected`, `--material-icon-fill-speed`, `--material-icon-fill-curve`, `--material-icon-triangle-optical-offset-y`

Files: src/components/ui/icon.tsx, src/components/ui/icons.tsx, src/components/ui/icon-adapters/active.ts, src/components/ui/icon-preview.tsx, src/index.css, src/styles/icon.css, src/showcase/demos/icons.tsx, scripts/test-icons.mjs, tests/design-rules.spec.ts, components.json, AGENTS.md, src/components/ui/icon-adapters/material.tsx, src/assets/icons/material-symbols.json, scripts/update-material-symbols.mjs, tests/material-icons.spec.ts

### Elevation is tone, a hairline, and a subtle shadow

appearance.elevation | Required | approved | enforcement: Manual

Elevation is expressed on three independent axes, each owned by one token so it tunes in a single place. TONE comes from the Material surface role, never from the elevation level: floating overlays (dialogs, menus, popovers, toasts) use the white card tone via --popover set to --surface-default, while structural panels such as navigation panes stay tonal. OUTLINE is a hairline shared by every elevated surface through --elevation-stroke (the foreground at 6 percent); it is always present and provides separation. SHADOW is a subtle, soft, neutral two-layer cast, a tight ambient contact (--elevation-ambient) plus a wider key (--elevation-key), that adds depth only at raised and floating; flat carries no shadow. Three levels: flat is tone plus outline, raised is a small lift, floating is a larger soft halo. Assign floating to transient and modal overlays and raised to lifted structural surfaces; cards and panels stay flat. Never couple tone to the elevation level, reintroduce a heavy or single-blur shadow, tint the shadow, or hardcode a ring color instead of --elevation-stroke. The generic --shadow-* scale stays none, so decorative shadows outside the elevation system remain disallowed.

Exceptions: Tooltips remain inverse arrowless pills and carry no cast shadow. Interaction state layers are a separate system, a warm --state-layer-color tint at the Material 8/10/10/16 percent opacities, not spatial elevation. Focus rings and deliberate boundary rings that happen to use box-shadow are indicators, not decorative elevation. --elevation-flat is a transparent no-op rather than the none keyword so it composes with a ring without voiding the whole box-shadow list. Sonner hardcodes its own shadow, so the toast overrides it with an important utility.

Tokens: `--elevation-flat`, `--elevation-raised`, `--elevation-floating`, `--elevation-ambient`, `--elevation-key`, `--elevation-stroke`, `--popover`, `--surface-default`, `--state-layer-color`

Files: src/index.css, src/styles/card.css, src/components/ui/elevation.tsx, src/components/ui/card.tsx, src/components/ui/dialog.tsx, src/components/ui/alert-dialog.tsx, src/components/ui/drawer.tsx, src/components/ui/sonner.tsx, src/components/ui/popover.tsx, src/components/ui/dropdown-menu.tsx

### Design values come from named tokens

foundations.tokens | Required | approved | enforcement: Manual review

Use named design tokens for colors, spacing, dimensions, radii, typography, and motion. Reuse the existing scale; change the token source instead of scattering values through markup.

Exceptions: Runtime measurements may bridge values into CSS custom properties where declarative layout cannot express the behavior. ColorTheme may bridge validated seed colors into generated role variables and expose them in role inspectors. Material's pinned API owns its scheme algorithms; OneDS seeds, component mappings, and legacy tone/chroma policy remain in the shared token sheets under src/styles/. Neither exception permits authored design literals in page markup.

Tokens: `--spacing`, `--button-height-default`

Files: src/index.css, src/styles/tokens.css, src/styles/foundation-theme.css, src/styles/button.css, src/components/ui/button.tsx

### Use Material surface and paired color roles

color.surface-accent | Required | approved | enforcement: Partially automated

Neutral Material surface roles apply globally across the site and components. Keep palette values in --theme-website-<role>-light/dark tokens; :root/.dark provide canonical --md-sys-color-* roles and existing OneDS aliases. MaterialTheme must not shadow global neutral values with inline copies. Pages and canvases share --page-fill: Surface in light mode and Surface container low in dark mode; --canvas-background always aliases --page-fill. Cards use Surface container lowest, and Card footers reuse the host Card background directly; the shared divider provides separation. General controls use Surface container low. Navigation and muted regions use Surface container, and popovers/menus use Surface container high. Enabled field rest, hover, and focus fills use translucent On surface tints over their host surface; keyboard focus keeps its purple outline rather than replacing the fill with an accent. Pair content with On surface/On surface variant and use Outline for boundaries, not fills. Disabled fields use Surface container with existing disabled opacity. Default supporting actions remain neutral; website action/selection accents stay scoped through MaterialTheme, including the pastel search-button pair. State tokens retain Material's 0.08/0.10/0.10/0.16 values. Changes belong in shared components or the central adapter, never local surface literals. Do not add older primary-tint elevation overlays; preserve shadow geometry.

Exceptions: The website preset has25 mapped roles;15 neutral roles are global. Website background becomes Surface, surface-0..4 become lowest..highest, and surface-variant supplies Outline variant as explicit adapter choices. Missing strong tertiary/fixed/error roles are not invented. Explicit legacy custom/generated themes remain separate opt-ins. Primary accents outside website scopes, status/presence/category/chart palettes, brand assets, and shadow geometry retain their policies. Transparent surfaces and state layers remain composited. Dialog/drawer scrims keep their existing black10% appearance through --overlay-scrim. Role-pair contrast does not certify every component state or boundary.

Tokens: `--page-fill`, `--canvas-background`, `--surface-canvas`, `--surface-lowest`, `--surface-low`, `--surface-container`, `--surface-default`, `--surface-high`, `--surface-highest`, `--surface-navigation`, `--surface-ink`, `--surface-muted-ink`, `--surface-outline`, `--surface-input-outline`, `--action-primary`, `--action-on-primary`, `--action-secondary`, `--action-on-secondary`, `--card`, `--field-fill`, `--field-placeholder-ink`, `--navigation-pane-selected-fill`, `--navigation-pane-selected-ink`

Files: src/index.css, src/styles/field.css, src/styles/tokens.css, src/lib/color-theme.ts, src/components/ui/color-theme.tsx, src/components/ui/material-theme.tsx, src/components/ui/material-surface.tsx, src/components/ui/page.tsx, src/components/ui/canvas.tsx, src/design-system/material-foundation.md, src/App.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/field.tsx, src/components/ui/input.tsx, src/components/ui/textarea.tsx, src/components/ui/select.tsx, src/components/ui/navigation-pane.tsx, src/showcase/demos/colors.tsx, scripts/test-color-theme.mjs, tests/color-theme.spec.ts

### Primary and secondary are opt-in, never a default

color.accent-restraint | Required | approved | enforcement: Manual review

Default to Tertiary/neutral roles for every surface, control, and field. Do not use Primary or Secondary color roles unless the composition explicitly calls for that emphasis, or the owning component already ships them as its own documented treatment. Primary Button colors purple and pink are both reserved for prominent calls to action; purple remains the default and pink requires explicit primaryColor. Secondary's light purple is reserved for deliberate emphasis and the shared selected state. The system carries exactly three purple tones, defined once as --purple-strong (Primary P40/P80), --purple-soft (Secondary container) and --purple-deep (selected Secondary), each with a paired ink. Every purple consumer aliases one of them: Primary purple buttons, links, and the focus ring all take --purple-strong, so no second purple accent can drift alongside the first. Primary pink reuses the separate website Tertiary container pair and does not alter the purple ladder. Field fills stay in their warm neutral state family through rest, hover, and focus; --field-focus-fill aliases --field-hover-fill while --ring alone carries purple focus emphasis. Choose emphasis deliberately in the composition and state it; never reach for an accent to make a surface look finished, and never infer it from surrounding markup.

Exceptions: Components that own an accent as part of their definition keep it: Primary buttons in either explicit color, the shared selected state, links, destructive intent, focus rings, status/presence/category/chart palettes, and brand assets. Explicitly themed scopes, generated themes, and experiments may set their own accents within their own scope. A caller may still opt into Primary or Secondary when the composition genuinely needs that emphasis.

Tokens: `--purple-strong`, `--purple-strong-ink`, `--purple-soft`, `--purple-soft-ink`, `--purple-deep`, `--purple-deep-ink`, `--ring`, `--button-primary-fill`, `--button-primary-pink-fill`, `--button-primary-pink-ink`, `--button-secondary-fill`, `--button-link-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--field-fill`, `--field-ink`, `--field-placeholder-ink`, `--field-focus-fill`, `--field-focus-ink`, `--field-hover-fill`, `--field-pressed-fill`

Files: src/index.css, src/styles/field.css, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/textarea.tsx, src/components/ui/select.tsx, src/components/ui/native-select.tsx, src/components/ui/input-group.tsx, src/components/ui/combobox.tsx

### Spacing and control geometry follow the 4px grid

geometry.control-grid | Required | approved | enforcement: Partially automated

Use multiples of 4 CSS pixels for authored spacing and control heights. Measure the complete border box, including padding and borders. Labelled control widths remain content-driven; icon-only controls are square.

Exceptions: Borders, focus strokes, optical corrections, typography, and derived concentric radii have their own tokens. Content-driven widths, wrapping heights, and continuous experimental geometry need not be multiples of four.

Tokens: `--spacing`, `--button-gap`

Files: src/index.css, src/components/ui/button.tsx

### Nested rounded surfaces share a corner center

geometry.concentric-corners | Required | approved | enforcement: Manual review

Concentric corners are non-negotiable for UI. For every uniformly nested rounded surface, derive the inner radius from the actual outer radius minus the actual edge-to-edge inset. If the inset contains a border, subtract that border and the padding. Clamp at zero. Verify the equation independently for each host; matching inner radii across differently shaped hosts is not evidence of concentric geometry.

Exceptions: The relationship assumes aligned, uniformly inset surfaces. A small object floating in the middle of a larger surface does not share its corner center. Rings and shadows consume no layout space.

Tokens: `--radius-lg`, `--radius-xl`, `--field-radius`, `--field-search-radius`, `--field-action-inset`, `--field-action-radius`

Files: src/showcase/experiments/concentric.tsx, src/index.css, src/components/ui/button.tsx, src/components/ui/input.tsx

### Text stays in its natural case

typography.natural-case | Required | approved | enforcement: Manual review

Do not transform labels, headings, tags, or eyebrows to uppercase. Establish hierarchy through size, weight, and muted foreground tokens, not all-caps text and wide tracking.

Exceptions: Preserve genuine acronyms, proper product names, and code identifiers. Do not rewrite them merely to avoid capital letters.

Tokens: `--font-weight-medium`

Files: src/components/ui/card.tsx, src/components/ui/page-header.tsx

### Text never leaves orphans or widows

typography.no-orphans-widows | Required | approved | enforcement: Manual review

Compose and generate text so no paragraph ends in an orphan (a single word or very short fragment alone on the last line) and no heading breaks with a widow. This is a layout and composition responsibility handled through the shared roles, not by hand-inserting line breaks. Body and supporting copy inherit text-wrap: pretty from the base body style; the Text title, heading, and subheading roles use text-wrap: balance so short display lines stay even. Choose a role rather than forcing breaks; reach for a non-breaking space only for genuinely inseparable pairs.

Exceptions: Code, preformatted text, and single-line controls keep their own wrapping. text-wrap: balance applies only to short blocks per the browser line limit. Where a browser lacks pretty or balance, text falls back to normal wrapping with no layout break.

Tokens: `--text-body-size`, `--text-body-leading`, `--text-title-size`, `--text-heading-size`, `--text-subheading-size`

Files: src/index.css, src/components/ui/text.tsx, src/showcase/demos/reference.tsx

### Motion uses named speed and easing tokens

motion.speed-tokens | Required | approved | enforcement: Partially automated

Use named speed and curve tokens, with component aliases for their role. Separate spatial motion from effects: movement may use spring overshoot; color and opacity must not overshoot. Default Button feedback is a 2px downward push and 3% compression using --button-press-distance and --button-press-scale, followed by a spring-like return. Corners remain unchanged. The pilot uses Material Expressive's published fast web conversions: spatial 350ms cubic-bezier(0.42, 1.67, 0.21, 0.90), effects 150ms cubic-bezier(0.31, 0.94, 0.34, 1). Button owns explicit transition properties, not transition-all. Native actions are never delayed. Reduced motion removes the push while preserving state feedback.

Exceptions: This is a Button-only CSS spring approximation, not a velocity-preserving physics engine or a global migration. Joined ButtonGroups and link Buttons use effects only; FABs and navigation pane triggers retain their own motion. Layout dimensions stay fixed, but the visual button and its hit-tested bounds move slightly during the push. The earlier corner morph remains behind explicit data-press-effect=morph for future compositions, using the retained 8px/12px pressed-radius tokens instead of a push. It is not the default. CSS retargets interruptions without preserving spring velocity. Intent delays and loading timers are separate from motion speeds.

Tokens: `--motion-spatial-fast-speed`, `--motion-spatial-fast-curve`, `--motion-effects-fast-speed`, `--motion-effects-fast-curve`, `--button-spatial-speed`, `--button-spatial-curve`, `--button-effects-speed`, `--button-effects-curve`, `--button-press-distance`, `--button-press-scale`, `--button-pressed-radius-default`, `--button-pressed-radius-expressive`

Files: src/index.css, src/components/ui/button.tsx, PRDs/oneds-phase-2d-motion-character-prd.md, tests/button-motion.spec.ts

### Typography is defined by role, not blanket scaling

typography.role-pairs | Recommended | candidate | enforcement: Manual review

Keep size and line height paired. Separate headings, body, and metadata by role; avoid multiplying every text size when a region becomes expressive.

Exceptions: The lab's medium-scale 20/16/14px hierarchy is a reference for equivalent roles, not an approved universal replacement for all component typography.

Tokens: `--expressive-title-size`, `--expressive-body-size`, `--expressive-caption-size`

Files: README.md, src/showcase/experiments/expressive.css

### Every control keeps its interaction contract

accessibility.control-contract | Recommended | candidate | enforcement: Manual review

Reuse native or established primitive behavior. Keep keyboard focus visible, give icon-only controls an accessible name and tooltip, and test disabled, loading, and reduced-motion states.

Exceptions: Disabled controls may suppress hover tooltips. Touch target requirements are contextual: a visual control's size alone is not a claim of universal accessibility compliance.

Tokens: `--ring`

Files: src/components/ui/button.tsx, src/components/ui/tooltip.tsx

### Containers must not clip focus indicators

accessibility.unclipped-indicators | Required | approved | enforcement: Partially automated

A container that scrolls or clips must not cut off a child's focus or selection ring. Remember that overflow-x-auto forces the cross axis to clip too, so an outward box-shadow ring is silently cut on the other axis. Reserve ring clearance, keep overflow visible, or render the child's ring inset so it paints inside the clip box. In grouped controls such as ButtonGroup, inset every direct child's ring generically rather than per child type, so a new child kind (input, InputGroup, select, combobox) cannot reintroduce clipping.

Exceptions: Popovers, menus, and other floating surfaces intentionally clip their own content and already place focus rings inside. A deliberately inset indicator is already safe. Non-interactive decorative overflow that hosts no focusable child is unaffected.

Tokens: `--ring`

Files: src/components/ui/button-group.tsx
