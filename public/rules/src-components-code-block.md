# Rules for src/components/code-block.tsx

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Code cards float a single copy action

composition.code-card-floating-action | Recommended | candidate | enforcement: Manual review

The code card omits header and title and floats a tertiary copy action at the top-right, positioned from a tokenized inset with a concentric radius (card radius minus inset and border) on a tokenized stacking layer above the scroll region. A single-line code card snaps to a minimum height so the action has equal top and bottom breathing room, and copy falls back to a native command when the async clipboard is unavailable.

Exceptions: Rich response code blocks may hide line numbers; the floating action and geometry are unchanged.

Tokens: `--card-radius`, `--code-block-copy-inset`, `--code-block-copy-radius`, `--code-block-copy-layer`, `--code-block-min-height`, `--code-block-boundary-width`

Files: src/components/code-block.tsx, src/components/ui/card.tsx, src/index.css
