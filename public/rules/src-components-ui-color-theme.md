# Rules for src/components/ui/color-theme.tsx

Generated from src/design-system/rules.json. Do not edit directly.

2 scoped rules. Read _always.md as well.

### Cards use the shared card material

composition.card-material | Required | approved | enforcement: Partially automated

A framed card specimen must compose Card and its named parts. Let Card own its fill, boundary, radius, clipping, and internal spacing through the shared tokens. Add a CardFooter divider only where scrolling content needs a persistent boundary; that divider uses the same --card-stroke alias as the outer hairline. Non-scrolling Card footers have no divider. A theme surface plus local padding is not a substitute for a Card. Apply light/dark or color themes without replacing the card's material anatomy.

Exceptions: True unframed page bands may use ColorThemeSurface. Canvas and Toolbar retain their own surface components and must not be wrapped in decorative Cards. Cards need not contain every optional named part; CardContent alone is valid for a content-only specimen.

Tokens: `--card`, `--card-foreground`, `--card-spacing`, `--card-radius`, `--card-stroke`

Files: src/components/ui/card.tsx, src/components/ui/color-theme.tsx, src/index.css, src/showcase/experiments/pointer.tsx

### Button colors use dedicated paired tokens

controls.button-colors | Required | approved | enforcement: Partially automated

Expose Primary (primary), Secondary (secondary), and Tertiary/Neutral (tertiary). General buttons default to Tertiary; default aliases tertiary. Primary supports primaryColor purple or pink; omitted primaryColor defaults to purple. Purple uses baseline P40/P80 with On primary, while Pink uses the website Tertiary container/On tertiary container pair. Reserve both Primary colors exclusively for prominent calls to action, never selection; Primary ignores the selected prop and ButtonGroupChoiceItem excludes Primary. Secondary uses light-purple Secondary container/On secondary container at rest and dark gray-purple Secondary/On secondary when selected. Tertiary uses warm neutral Surface container highest/On surface variant at rest and the light-purple Secondary container/On secondary container pair when selected. These two selection levels use the shared Button tokens in standalone and grouped controls; do not switch variants to Primary to indicate selection. Selection remains caller-controlled with native accessibility semantics. Standalone square12px/16px corners at40px/56px become20px/28px round when selected; connected groups keep soft inner corners and round selected items without shifting neighbors. Selected button icons animate Material Symbols' variable FILL axis from outlined to filled without changing viewport geometry. Preserve sizes, press behavior, motion tokens, reduced motion, destructive tints/text/focus, and Ghost/link treatments. Neutral Tertiary is an emphasis level, not Material's pink tertiary accent; explicit Primary pink is the deliberate exception.

Exceptions: Explicit custom/generated themes retain their Purple Filled mappings; explicit Pink retains the canonical website pink pair. Destructive text and its translucent treatment are unchanged from the original design; no new contrast certification is claimed. Other text, focus, Ghost, link and Tonal treatments stay unchanged. Disabled buttons keep50% opacity and native semantics. The baseline Filled palette is distinct from the website palette used by other consumers.

Tokens: `--button-primary-fill`, `--button-primary-ink`, `--button-primary-state-ink`, `--button-primary-pink-fill`, `--button-primary-pink-ink`, `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--button-tertiary-hover`, `--button-tertiary-pressed`, `--button-link-ink`, `--button-primary-hover`, `--button-primary-pressed`, `--button-secondary-hover`, `--button-secondary-pressed`

Files: src/index.css, src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/color-theme.tsx, tests/color-theme.spec.ts, tests/design-rules.spec.ts, src/design-system/material-foundation.md
