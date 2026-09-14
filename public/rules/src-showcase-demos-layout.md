# Rules for src/showcase/demos/layout.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Default to neutral supporting actions

controls.supporting-actions | Required | approved | enforcement: Partially automated

Button has no outline variant. Use neutral Tertiary for general actions and labelled supporting actions such as Cancel, including buttons beside search, select/dropdown, and mixed tools. Omitted variants use Tertiary. Button groups, including split actions, normally use Tertiary or Secondary. A split layout does not imply primary emphasis: use Primary only when the action is explicitly a prominent CTA. Use ghost for isolated icon-only actions/groups or field-internal affordances. Never infer emphasis by inspecting the DOM.

Exceptions: Primary and destructive intent, links, and persistent selected states retain their semantic treatment. Embedded field affordances such as clear or reveal may remain ghost because the field already supplies a shared container. An outer card border alone is not a neighboring outlined control. An isolated icon-only menu trigger may be ghost; opening its menu does not change the trigger's resting variant. Input, select, Badge, Toggle, and other non-Button outline variants are unaffected.

Tokens: `--button-tertiary-fill`, `--button-tertiary-ink`, `--state-layer-hover`, `--state-layer-pressed`

Files: src/components/ui/button.tsx, src/components/ui/button-group.tsx, src/components/ui/pagination.tsx, src/showcase/demos/forms.tsx, src/showcase/demos/layout.tsx, src/App.tsx
