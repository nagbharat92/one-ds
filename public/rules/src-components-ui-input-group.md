# Rules for src/components/ui/input-group.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Buttons have two size tiers

controls.button-scale | Required | approved | enforcement: Automated

Default is 40px and Expressive is 56px, measured including borders. Use size=default or expressive. The icon and icon-expressive counterparts have matching square dimensions. Default uses 20px icons and 16px horizontal padding; Expressive uses 24px icons and 24px horizontal padding. Labelled widths remain content-driven. Large, small, and extra-small sizes are removed, not deprecated aliases.

Exceptions: Specialized compositions such as calendar cells, toolbars, and experimental surfaces may currently override Button geometry. These are migration candidates, not alternate public Button sizes; do not copy their overrides into new standalone buttons.

Tokens: `--button-height-default`, `--button-height-expressive`, `--button-icon-default`, `--button-icon-expressive`, `--button-padding-default`, `--button-padding-expressive`

Files: src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/components/ui/input-group.tsx
