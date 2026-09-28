# Rules for src/components/ui/button-group.tsx

Generated from src/design-system/rules.json. Do not edit directly.

4 scoped rules. Read _always.md as well.

### Button colors use dedicated paired tokens

controls.button-colors | Required | approved | enforcement: Partially automated

Expose Primary (primary), Secondary (secondary), and Tertiary/Neutral (tertiary). General buttons default to Tertiary; default aliases tertiary. Primary supports primaryColor purple or pink; omitted primaryColor defaults to purple. Purple uses baseline P40/P80 with On primary, while Pink uses the website Tertiary container/On tertiary container pair. Reserve both Primary colors exclusively for prominent calls to action, never selection; Primary ignores the selected prop and ButtonGroupChoiceItem excludes Primary. Secondary uses light-purple Secondary container/On secondary container at rest and dark gray-purple Secondary/On secondary when selected. Tertiary uses warm neutral Surface container highest/On surface variant at rest and the light-purple Secondary container/On secondary container pair when selected. These two selection levels use the shared Button tokens in standalone and grouped controls; do not switch variants to Primary to indicate selection. Selection remains caller-controlled with native accessibility semantics. Standalone square12px/16px corners at40px/56px become20px/28px round when selected; connected groups keep soft inner corners and round selected items without shifting neighbors. Selected button icons animate Material Symbols' variable FILL axis from outlined to filled without changing viewport geometry. Preserve sizes, press behavior, motion tokens, reduced motion, destructive tints/focus, and Ghost treatment. Destructive Button text uses a theme-specific --button-destructive-ink that stays legible through the translucent Error hover and pressed ramps. Link keeps 90% of its ink when pressed rather than dropping to 70%. Neutral Tertiary is an emphasis level, not Material's pink tertiary accent; explicit Primary pink is the deliberate exception.

Exceptions: Explicit custom/generated themes retain their Purple Filled mappings; explicit Pink retains the canonical website pink pair. Destructive Button ink is tuned for the tested light/dark neutral surfaces and the full rest/hover/pressed tint ramp; non-neutral host surfaces still need contextual evaluation. Other text, focus, Ghost and Tonal treatments stay unchanged. Disabled buttons keep50% opacity and native semantics. The baseline Filled palette is distinct from the website palette used by other consumers.

Tokens: `--button-primary-fill`, `--button-primary-ink`, `--button-primary-state-ink`, `--button-primary-pink-fill`, `--button-primary-pink-ink`, `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--button-tertiary-hover`, `--button-tertiary-pressed`, `--button-destructive-ink`, `--button-link-ink`, `--button-primary-hover`, `--button-primary-pressed`, `--button-secondary-hover`, `--button-secondary-pressed`

Files: src/index.css, src/styles/button.css, src/styles/tokens.css, src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/color-theme.tsx, tests/color-theme.spec.ts, tests/design-rules.spec.ts, src/design-system/material-foundation.md

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

### Separate nested button groups visibly

geometry.nested-button-groups | Required | approved | enforcement: Partially automated

Nested ButtonGroups use a larger gap between child groups than between buttons within each group. Use --button-group-nested-gap (12px) between nested groups and --button-group-gap (4px) within each group, in either orientation. Keep the distinction in the shared ButtonGroup styling, not local demo margins. Preserve each child group's connected corner anatomy and selected-state behavior.

Exceptions: Standalone groups retain the inner gap. Wrapping and scrolling containers may manage available space but must not collapse the visible group boundary.

Tokens: `--button-group-gap`, `--button-group-nested-gap`

Files: src/index.css, src/components/ui/button-group.tsx, src/showcase/demos/forms.tsx
