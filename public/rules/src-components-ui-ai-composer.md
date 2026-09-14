# Rules for src/components/ui/ai-composer.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Growing controls keep a fixed corner radius

geometry.growing-controls | Required | approved | enforcement: Manual review

A growing composer or multiline input must use a fixed radius derived from its resting geometry, not an unbounded pill radius.

Exceptions: Fixed-height single-line buttons and square circular actions may use a pill radius. Uniformly nested controls must still respect the concentric relationship.

Files: src/components/ui/ai-composer.tsx, src/index.css
