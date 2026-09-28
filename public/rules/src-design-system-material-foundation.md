# Rules for src/design-system/material-foundation.md

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Button colors use dedicated paired tokens

controls.button-colors | Required | approved | enforcement: Partially automated

Expose Primary (primary), Secondary (secondary), and Tertiary/Neutral (tertiary). General buttons default to Tertiary; default aliases tertiary. Primary supports primaryColor purple or pink; omitted primaryColor defaults to purple. Purple uses baseline P40/P80 with On primary, while Pink uses the website Tertiary container/On tertiary container pair. Reserve both Primary colors exclusively for prominent calls to action, never selection; Primary ignores the selected prop and ButtonGroupChoiceItem excludes Primary. Secondary uses light-purple Secondary container/On secondary container at rest and dark gray-purple Secondary/On secondary when selected. Tertiary uses warm neutral Surface container highest/On surface variant at rest and the light-purple Secondary container/On secondary container pair when selected. These two selection levels use the shared Button tokens in standalone and grouped controls; do not switch variants to Primary to indicate selection. Selection remains caller-controlled with native accessibility semantics. Standalone square12px/16px corners at40px/56px become20px/28px round when selected; connected groups keep soft inner corners and round selected items without shifting neighbors. Selected button icons animate Material Symbols' variable FILL axis from outlined to filled without changing viewport geometry. Preserve sizes, press behavior, motion tokens, reduced motion, destructive tints/focus, and Ghost treatment. Destructive Button text uses a theme-specific --button-destructive-ink that stays legible through the translucent Error hover and pressed ramps. Link keeps 90% of its ink when pressed rather than dropping to 70%. Neutral Tertiary is an emphasis level, not Material's pink tertiary accent; explicit Primary pink is the deliberate exception.

Exceptions: Explicit custom/generated themes retain their Purple Filled mappings; explicit Pink retains the canonical website pink pair. Destructive Button ink is tuned for the tested light/dark neutral surfaces and the full rest/hover/pressed tint ramp; non-neutral host surfaces still need contextual evaluation. Other text, focus, Ghost and Tonal treatments stay unchanged. Disabled buttons keep50% opacity and native semantics. The baseline Filled palette is distinct from the website palette used by other consumers.

Tokens: `--button-primary-fill`, `--button-primary-ink`, `--button-primary-state-ink`, `--button-primary-pink-fill`, `--button-primary-pink-ink`, `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--button-tertiary-hover`, `--button-tertiary-pressed`, `--button-destructive-ink`, `--button-link-ink`, `--button-primary-hover`, `--button-primary-pressed`, `--button-secondary-hover`, `--button-secondary-pressed`

Files: src/index.css, src/styles/button.css, src/styles/tokens.css, src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/color-theme.tsx, tests/color-theme.spec.ts, tests/design-rules.spec.ts, src/design-system/material-foundation.md
