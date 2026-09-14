# Rules for src/showcase/demos/forms.tsx

Generated from src/design-system/rules.json. Do not edit directly.

3 scoped rules. Read _always.md as well.

### Default to neutral supporting actions

controls.supporting-actions | Required | approved | enforcement: Partially automated

Button has no outline variant. Use neutral Tertiary for general actions and labelled supporting actions such as Cancel, including buttons beside search, select/dropdown, and mixed tools. Omitted variants use Tertiary. Button groups, including split actions, normally use Tertiary or Secondary. A split layout does not imply primary emphasis: use Primary only when the action is explicitly a prominent CTA. Use ghost for isolated icon-only actions/groups or field-internal affordances. Never infer emphasis by inspecting the DOM.

Exceptions: Primary and destructive intent, links, and persistent selected states retain their semantic treatment. Embedded field affordances such as clear or reveal may remain ghost because the field already supplies a shared container. An outer card border alone is not a neighboring outlined control. An isolated icon-only menu trigger may be ghost; opening its menu does not change the trigger's resting variant. Input, select, Badge, Toggle, and other non-Button outline variants are unaffected.

Tokens: `--button-tertiary-fill`, `--button-tertiary-ink`, `--state-layer-hover`, `--state-layer-pressed`

Files: src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/pagination.tsx, src/showcase/demos/forms.tsx, src/showcase/demos/layout.tsx, src/App.tsx

### Separate nested button groups visibly

geometry.nested-button-groups | Required | approved | enforcement: Partially automated

Nested ButtonGroups use a larger gap between child groups than between buttons within each group. Use --button-group-nested-gap (12px) between nested groups and --button-group-gap (4px) within each group, in either orientation. Keep the distinction in the shared ButtonGroup styling, not local demo margins. Preserve each child group's connected corner anatomy and selected-state behavior.

Exceptions: Standalone groups retain the inner gap. Wrapping and scrolling containers may manage available space but must not collapse the visible group boundary.

Tokens: `--button-group-gap`, `--button-group-nested-gap`

Files: src/index.css, src/components/ui/button-group.tsx, src/showcase/demos/forms.tsx

### Icon labels include a tokenized optical correction

geometry.icon-label-optical-spacing | Required | approved | enforcement: Partially automated

Icon + label means any of three graphic types: an icon, favicon, or loading spinner with visible text. All three use the same 8px graphic-to-label gap from --graphic-label-gap, including expressive contexts. --button-gap aliases that shared token. Add 4 CSS pixels of padding on the label's outer side opposite the graphic using IconLabel and --icon-label-optical-padding. Icon on the left means label padding on the right; icon on the right means label padding on the left. Optical padding must not increase the 8px gap. Button handles ordinary text, numeric text, simple text spans, and asChild link content. Other compositions reuse the same label part; do not create icon-only exceptions to this terminology.

Exceptions: Text-only and icon-only controls receive no correction. A label flanked by graphics on both sides has no free outer edge, so it receives no asymmetric correction. Logical padding follows normal inline order in right-to-left layouts; do not visually reorder the graphic and label with CSS. Preserve base padding, icon size, height, and gap. Rich custom labels expose IconLabel explicitly; custom graphic wrappers expose data-icon or data-slot=spinner. Other existing component families are not automatically restyled by this Button migration.

Tokens: `--icon-label-optical-padding`, `--graphic-label-gap`, `--button-gap`

Files: src/components/ui/icon-label.tsx, src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/index.css, src/showcase/demos/forms.tsx
