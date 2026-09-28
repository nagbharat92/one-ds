# Rules for src/styles/tokens.css

Generated from src/design-system/rules.json. Do not edit directly.

5 scoped rules. Read _always.md as well.

### Card spacing communicates grouping

composition.card-spacing-rhythm | Required | approved | enforcement: Partially automated

Construct standard expressive Cards as a sequence of clear regions. Treat CardHeader as one chunk, leave24px before CardContent, and leave24px before CardFooter. Non-scrolling footers omit the divider and use8px top padding with24px inline and bottom padding. A footer after scrolling content uses the shared divider and24px top padding. The same24px token supplies the Card's top and inline insets. Keep strongly related labels, values, controls, and metadata at --card-group-gap (8px); paired footer actions also stay8px apart. Distinct groups inside CardContent use24px. Use boundaries only where scrolling requires persistent separation; otherwise proximity and open space communicate grouping. Repeated rows and peer elements use consistent alignment, sizing, and spacing so similarity remains meaningful.

Exceptions: Small Cards retain compact12px spacing. Code Cards keep their specialized compact geometry. Edge-to-edge scrolling content cancels the external region gap so its box meets the header and footer, while the scroller retains24px internal padding on every side. Edge-to-edge media may replace the outer inset at its edge while the24px region gap resumes between media and text.

Tokens: `--card-spacing`, `--card-spacing-expressive`, `--card-region-gap`, `--card-group-gap`, `--card-content-group-gap`, `--card-footer-gap`, `--space-xs`

Files: src/index.css, src/styles/card.css, src/styles/tokens.css, src/components/ui/card.tsx, src/showcase/demos/data.tsx

### Button colors use dedicated paired tokens

controls.button-colors | Required | approved | enforcement: Partially automated

Expose Primary (primary), Secondary (secondary), and Tertiary/Neutral (tertiary). General buttons default to Tertiary; default aliases tertiary. Primary supports primaryColor purple or pink; omitted primaryColor defaults to purple. Purple uses baseline P40/P80 with On primary, while Pink uses the website Tertiary container/On tertiary container pair. Reserve both Primary colors exclusively for prominent calls to action, never selection; Primary ignores the selected prop and ButtonGroupChoiceItem excludes Primary. Secondary uses light-purple Secondary container/On secondary container at rest and dark gray-purple Secondary/On secondary when selected. Tertiary uses warm neutral Surface container highest/On surface variant at rest and the light-purple Secondary container/On secondary container pair when selected. These two selection levels use the shared Button tokens in standalone and grouped controls; do not switch variants to Primary to indicate selection. Selection remains caller-controlled with native accessibility semantics. Standalone square12px/16px corners at40px/56px become20px/28px round when selected; connected groups keep soft inner corners and round selected items without shifting neighbors. Selected button icons animate Material Symbols' variable FILL axis from outlined to filled without changing viewport geometry. Preserve sizes, press behavior, motion tokens, reduced motion, destructive tints/focus, and Ghost treatment. Destructive Button text uses a theme-specific --button-destructive-ink that stays legible through the translucent Error hover and pressed ramps. Link keeps 90% of its ink when pressed rather than dropping to 70%. Neutral Tertiary is an emphasis level, not Material's pink tertiary accent; explicit Primary pink is the deliberate exception.

Exceptions: Explicit custom/generated themes retain their Purple Filled mappings; explicit Pink retains the canonical website pink pair. Destructive Button ink is tuned for the tested light/dark neutral surfaces and the full rest/hover/pressed tint ramp; non-neutral host surfaces still need contextual evaluation. Other text, focus, Ghost and Tonal treatments stay unchanged. Disabled buttons keep50% opacity and native semantics. The baseline Filled palette is distinct from the website palette used by other consumers.

Tokens: `--button-primary-fill`, `--button-primary-ink`, `--button-primary-state-ink`, `--button-primary-pink-fill`, `--button-primary-pink-ink`, `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--button-tertiary-hover`, `--button-tertiary-pressed`, `--button-destructive-ink`, `--button-link-ink`, `--button-primary-hover`, `--button-primary-pressed`, `--button-secondary-hover`, `--button-secondary-pressed`

Files: src/index.css, src/styles/button.css, src/styles/tokens.css, src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/color-theme.tsx, tests/color-theme.spec.ts, tests/design-rules.spec.ts, src/design-system/material-foundation.md

### Buttons have two size tiers

controls.button-scale | Required | approved | enforcement: Automated

Default is 40px and Expressive is 56px, measured including borders. Use size=default or expressive. The icon and icon-expressive counterparts have matching square dimensions. Default uses 20px icons and 16px horizontal padding; Expressive uses 24px icons and 24px horizontal padding. Labelled widths remain content-driven. Large, small, and extra-small sizes are removed, not deprecated aliases.

Exceptions: Specialized compositions such as calendar cells, toolbars, and experimental surfaces may currently override Button geometry. These are migration candidates, not alternate public Button sizes; do not copy their overrides into new standalone buttons.

Tokens: `--button-height-default`, `--button-height-expressive`, `--button-icon-default`, `--button-icon-expressive`, `--button-padding-default`, `--button-padding-expressive`

Files: src/styles/tokens.css, src/styles/button.css, src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/components/ui/input-group.tsx

### Badges use source-ready inline geometry

geometry.badge-scale | Required | approved | enforcement: Partially automated

Badge uses one expressive inline baseline: 28px fixed height, a 14px/21px label, 16px icon, favicon, or spinner, and the shared 8px graphic-to-label gap. Its 14px outer radius is half the fixed height; inline padding is derived from that radius minus the 4px base spacing so text clears the curved ends. Badge automatically applies IconLabel to ordinary labels, including labels inside asChild links, and adds the shared 4px optical correction opposite a graphic. Use Badge asChild with Favicon for linked source citations so the same component serves labels, statuses, and AI source references. Keep Kbd on its separate compact 20px/12px keyboard-hint geometry.

Exceptions: AvatarBadge and presence dots are status indicators, not text badges. Inline numeric footnote marks remain owned by Response; linked source pills and source lists use Badge. Badge stays single-line; use a List Item or Card when source metadata needs multiple lines. Kbd must not inherit Badge sizing changes.

Tokens: `--badge-height`, `--badge-radius`, `--badge-padding-inline`, `--badge-font-size`, `--badge-line-height`, `--badge-graphic-size`, `--badge-gap`, `--graphic-label-gap`, `--icon-label-optical-padding`

Files: src/components/ui/badge.tsx, src/components/ui/kbd.tsx, src/components/ui/favicon.tsx, src/components/ui/icon-label.tsx, src/styles/icon.css, src/styles/tokens.css, src/index.css, src/showcase/demos/data.tsx, tests/design-rules.spec.ts

### Icon labels include a tokenized optical correction

geometry.icon-label-optical-spacing | Required | approved | enforcement: Partially automated

Icon + label means any of three graphic types: an icon, favicon, or loading spinner with visible text. All three use the same 8px graphic-to-label gap from --graphic-label-gap, including expressive contexts. --button-gap aliases that shared token. Add 4 CSS pixels of padding on the label's outer side opposite the graphic using IconLabel and --icon-label-optical-padding. Icon on the left means label padding on the right; icon on the right means label padding on the left. Optical padding must not increase the 8px gap. Button handles ordinary text, numeric text, simple text spans, and asChild link content. Other compositions reuse the same label part; do not create icon-only exceptions to this terminology.

Exceptions: Text-only and icon-only controls receive no correction. A label flanked by graphics on both sides has no free outer edge, so it receives no asymmetric correction. Logical padding follows normal inline order in right-to-left layouts; do not visually reorder the graphic and label with CSS. Preserve base padding, icon size, height, and gap. Rich custom labels expose IconLabel explicitly; custom graphic wrappers expose data-icon or data-slot=spinner. Other existing component families are not automatically restyled by this Button migration.

Tokens: `--icon-label-optical-padding`, `--graphic-label-gap`, `--button-gap`

Files: src/components/ui/icon-label.tsx, src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/styles/button.css, src/styles/tokens.css, src/index.css, src/showcase/demos/forms.tsx
