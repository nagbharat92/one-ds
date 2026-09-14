# Rules for src/components/expression-lab-preview.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Paired Card actions end with Secondary

composition.card-footer-actions | Required | approved | enforcement: Manual review

When CardFooter contains exactly two peer actions, place the lower-priority action first and the higher-priority action second in DOM order. The higher-priority action uses Secondary; the lower-priority action uses Tertiary/default, or Ghost for a dismissive action. In a horizontal footer, end alignment places Secondary at the inline end, which is the right in left-to-right interfaces. In a vertical footer, Secondary sits at the block end, which is the bottom. Never use CSS order to create this hierarchy because keyboard and reading order must match the visual order.

Exceptions: Single-action footers and mixed groups with three or more actions or a separate icon utility are outside the paired-action contract. A destructive action retains its destructive semantic variant but still occupies the final emphasized position.

Tokens: `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--card-footer-gap`

Files: src/components/ui/card.tsx, src/components/ui/button.tsx, src/showcase/demos/data.tsx, src/showcase/demos/annotation.tsx, src/showcase/demos/persona.tsx, src/showcase/experiments/concentric.tsx, src/components/expression-lab-preview.tsx
