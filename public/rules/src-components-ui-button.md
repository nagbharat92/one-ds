# Rules for src/components/ui/button.tsx

Generated from src/design-system/rules.json. Do not edit directly.

7 scoped rules. Read _always.md as well.

### Paired Card actions end with Secondary

composition.card-footer-actions | Required | approved | enforcement: Manual review

When CardFooter contains exactly two peer actions, place the lower-priority action first and the higher-priority action second in DOM order. The higher-priority action uses Secondary; the lower-priority action uses Tertiary/default, or Ghost for a dismissive action. In a horizontal footer, end alignment places Secondary at the inline end, which is the right in left-to-right interfaces. In a vertical footer, Secondary sits at the block end, which is the bottom. Never use CSS order to create this hierarchy because keyboard and reading order must match the visual order.

Exceptions: Single-action footers and mixed groups with three or more actions or a separate icon utility are outside the paired-action contract. A destructive action retains its destructive semantic variant but still occupies the final emphasized position.

Tokens: `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--card-footer-gap`

Files: src/components/ui/card.tsx, src/components/ui/button.tsx, src/showcase/demos/data.tsx, src/showcase/demos/annotation.tsx, src/showcase/demos/persona.tsx, src/showcase/experiments/concentric.tsx, src/components/expression-lab-preview.tsx

### Button colors use dedicated paired tokens

controls.button-colors | Required | approved | enforcement: Partially automated

Expose Primary (primary), Secondary (secondary), and Tertiary/Neutral (tertiary). General buttons default to Tertiary; default aliases tertiary. Primary supports primaryColor purple or pink; omitted primaryColor defaults to purple. Purple uses baseline P40/P80 with On primary, while Pink uses the website Tertiary container/On tertiary container pair. Reserve both Primary colors exclusively for prominent calls to action, never selection; Primary ignores the selected prop and ButtonGroupChoiceItem excludes Primary. Secondary uses light-purple Secondary container/On secondary container at rest and dark gray-purple Secondary/On secondary when selected. Tertiary uses warm neutral Surface container highest/On surface variant at rest and the light-purple Secondary container/On secondary container pair when selected. These two selection levels use the shared Button tokens in standalone and grouped controls; do not switch variants to Primary to indicate selection. Selection remains caller-controlled with native accessibility semantics. Standalone square12px/16px corners at40px/56px become20px/28px round when selected; connected groups keep soft inner corners and round selected items without shifting neighbors. Selected button icons animate Material Symbols' variable FILL axis from outlined to filled without changing viewport geometry. Preserve sizes, press behavior, motion tokens, reduced motion, destructive tints/text/focus, and Ghost/link treatments. Neutral Tertiary is an emphasis level, not Material's pink tertiary accent; explicit Primary pink is the deliberate exception.

Exceptions: Explicit custom/generated themes retain their Purple Filled mappings; explicit Pink retains the canonical website pink pair. Destructive text and its translucent treatment are unchanged from the original design; no new contrast certification is claimed. Other text, focus, Ghost, link and Tonal treatments stay unchanged. Disabled buttons keep50% opacity and native semantics. The baseline Filled palette is distinct from the website palette used by other consumers.

Tokens: `--button-primary-fill`, `--button-primary-ink`, `--button-primary-state-ink`, `--button-primary-pink-fill`, `--button-primary-pink-ink`, `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--button-tertiary-hover`, `--button-tertiary-pressed`, `--button-link-ink`, `--button-primary-hover`, `--button-primary-pressed`, `--button-secondary-hover`, `--button-secondary-pressed`

Files: src/index.css, src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/color-theme.tsx, tests/color-theme.spec.ts, tests/design-rules.spec.ts, src/design-system/material-foundation.md

### Alerts use semantic tonal roles

feedback.alert-semantics | Required | approved | enforcement: Partially automated

Alert is an expressive tonal feedback surface with neutral, info, success, warning, and error variants. It composes flat Elevation and the shared --elevation-stroke; semantic roles override fill and ink, never elevation. Neutral uses the Material Surface family, info uses the Secondary pair, and error derives from Material Error. Success and warning are explicit OneDS semantic extensions derived from existing status sources, not additions to the Material role table. Every semantic fill is opaque; status tones mix their source over --alert-container-base rather than transparent because the same fill token is reused as visible glyph ink. AlertIcon composes the shared Shape component as a56px accent behind a24px Material icon rendered on the filled FILL axis; the glyph ink always equals that Alert's own surface fill. Generic warning uses TriangleAlertIcon and generic error uses AlertCircleIcon, while product-specific callouts may deliberately choose another semantic glyph. Each semantic tone has a stable default shape with more than four sides, and callers may deliberately override it. The shape has16px leading inset and16px visual separation from the text block. AlertTitle composes Text lead at medium weight; AlertDescription composes muted Text label. The fixed44px Alert radius derives from its88px resting height, not an unbounded pill radius. Primary expressive56px action Buttons sit at the far right. At28rem they align to the top-right with16px inset; at20rem they stack at bottom-right. Their28px radius plus16px inset equals the44px Alert radius, preserving concentric corners. Default aliases neutral and destructive aliases error for compatibility, but new code uses semantic names. Visual severity does not choose live-region urgency; use live independently according to when and how urgently the message appears.

Exceptions: AlertDialog, toast, Badge, presence, chart, and brand palettes retain their own component contracts. Product-specific callouts may add a semantic mapping only through Alert-owned tokens and an approved API extension. Legacy default and destructive values remain aliases for compatibility, not preferred vocabulary. An Alert may omit AlertIcon, AlertTitle, or AlertAction when the content does not need them. Long or localized content increases height while retaining the fixed44px radius; never replace it with an unbounded pill radius.

Tokens: `--elevation-flat`, `--elevation-stroke`, `--alert-padding-inline`, `--alert-padding-block`, `--alert-content-gap`, `--alert-graphic-gap`, `--alert-graphic-gap-offset`, `--alert-action-gap`, `--alert-accent-size`, `--alert-accent-icon-size`, `--alert-accent-fill`, `--alert-accent-ink`, `--alert-container-base`, `--alert-resting-height`, `--alert-radius`, `--alert-layout-content-columns`, `--alert-layout-icon-columns`, `--alert-layout-action-columns`, `--alert-layout-icon-action-columns`, `--alert-neutral-fill`, `--alert-neutral-ink`, `--alert-info-fill`, `--alert-info-ink`, `--alert-success-source`, `--alert-success-fill`, `--alert-success-ink`, `--alert-warning-source`, `--alert-warning-fill`, `--alert-warning-ink`, `--alert-error-source`, `--alert-error-fill`, `--alert-error-ink`, `--text-lead-size`, `--text-lead-leading`, `--text-label-size`, `--text-label-leading`, `--button-height-expressive`, `--material-icon-fill-selected`, `--material-icon-triangle-optical-offset-y`

Files: src/index.css, src/components/ui/alert.tsx, src/components/ui/shape.tsx, src/components/ui/text.tsx, src/components/ui/button.tsx, src/components/ui/response.tsx, src/components/ui/icon-adapters/material.tsx, src/showcase/demos/feedback.tsx, tests/color-theme.spec.ts

### Buttons have two size tiers

controls.button-scale | Required | approved | enforcement: Automated

Default is 40px and Expressive is 56px, measured including borders. Use size=default or expressive. The icon and icon-expressive counterparts have matching square dimensions. Default uses 20px icons and 16px horizontal padding; Expressive uses 24px icons and 24px horizontal padding. Labelled widths remain content-driven. Large, small, and extra-small sizes are removed, not deprecated aliases.

Exceptions: Specialized compositions such as calendar cells, toolbars, and experimental surfaces may currently override Button geometry. These are migration candidates, not alternate public Button sizes; do not copy their overrides into new standalone buttons.

Tokens: `--button-height-default`, `--button-height-expressive`, `--button-icon-default`, `--button-icon-expressive`, `--button-padding-default`, `--button-padding-expressive`

Files: src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/components/ui/input-group.tsx

### Default to neutral supporting actions

controls.supporting-actions | Required | approved | enforcement: Partially automated

Button has no outline variant. Use neutral Tertiary for general actions and labelled supporting actions such as Cancel, including buttons beside search, select/dropdown, and mixed tools. Omitted variants use Tertiary. Button groups, including split actions, normally use Tertiary or Secondary. A split layout does not imply primary emphasis: use Primary only when the action is explicitly a prominent CTA. Use ghost for isolated icon-only actions/groups or field-internal affordances. Never infer emphasis by inspecting the DOM.

Exceptions: Primary and destructive intent, links, and persistent selected states retain their semantic treatment. Embedded field affordances such as clear or reveal may remain ghost because the field already supplies a shared container. An outer card border alone is not a neighboring outlined control. An isolated icon-only menu trigger may be ghost; opening its menu does not change the trigger's resting variant. Input, select, Badge, Toggle, and other non-Button outline variants are unaffected.

Tokens: `--button-tertiary-fill`, `--button-tertiary-ink`, `--state-layer-hover`, `--state-layer-pressed`

Files: src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/pagination.tsx, src/showcase/demos/forms.tsx, src/showcase/demos/layout.tsx, src/App.tsx

### Icon labels include a tokenized optical correction

geometry.icon-label-optical-spacing | Required | approved | enforcement: Partially automated

Icon + label means any of three graphic types: an icon, favicon, or loading spinner with visible text. All three use the same 8px graphic-to-label gap from --graphic-label-gap, including expressive contexts. --button-gap aliases that shared token. Add 4 CSS pixels of padding on the label's outer side opposite the graphic using IconLabel and --icon-label-optical-padding. Icon on the left means label padding on the right; icon on the right means label padding on the left. Optical padding must not increase the 8px gap. Button handles ordinary text, numeric text, simple text spans, and asChild link content. Other compositions reuse the same label part; do not create icon-only exceptions to this terminology.

Exceptions: Text-only and icon-only controls receive no correction. A label flanked by graphics on both sides has no free outer edge, so it receives no asymmetric correction. Logical padding follows normal inline order in right-to-left layouts; do not visually reorder the graphic and label with CSS. Preserve base padding, icon size, height, and gap. Rich custom labels expose IconLabel explicitly; custom graphic wrappers expose data-icon or data-slot=spinner. Other existing component families are not automatically restyled by this Button migration.

Tokens: `--icon-label-optical-padding`, `--graphic-label-gap`, `--button-gap`

Files: src/components/ui/icon-label.tsx, src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/index.css, src/showcase/demos/forms.tsx

### Edge tooltips open inward

geometry.tooltip-placement | Required | approved | enforcement: Automated

Keep the plain Button tooltip default directly above and centered. When a control is pinned to a viewport edge, its owning composition sets the preferred side toward the viewport interior instead of relying on collision fallback to choose another axis. The floating SidebarTrigger maps a start-edge sidebar to right and an end-edge sidebar to left. Radix collision avoidance remains enabled as the fallback when the preferred side cannot fit.

Exceptions: Material plain tooltips in app bars appear below their controls and should opt into that side in the app-bar composition. Rich tooltips default bottom-right and are a separate component role. The inward mapping is a OneDS contextual extension; Material specifies above as the ordinary plain-tooltip default, not a universal right-side default.

Tokens: `--tooltip-gap`

Files: src/components/ui/tooltip.tsx, src/components/ui/button.tsx, src/components/ui/sidebar.tsx
