# Rules for src/components/ui/card.tsx

Generated from src/design-system/rules.json. Do not edit directly.

9 scoped rules. Read _always.md as well.

### Cards use the shared card material

composition.card-material | Required | approved | enforcement: Partially automated

A framed card specimen must compose Card and its named parts. Let Card own its fill, boundary, radius, clipping, and internal spacing through the shared tokens. Add a CardFooter divider only where scrolling content needs a persistent boundary; that divider uses the same --card-stroke alias as the outer hairline. Non-scrolling Card footers have no divider. A theme surface plus local padding is not a substitute for a Card. Apply light/dark or color themes without replacing the card's material anatomy.

Exceptions: True unframed page bands may use ColorThemeSurface. Canvas and Toolbar retain their own surface components and must not be wrapped in decorative Cards. Cards need not contain every optional named part; CardContent alone is valid for a content-only specimen.

Tokens: `--card`, `--card-foreground`, `--card-spacing`, `--card-radius`, `--card-stroke`

Files: src/components/ui/card.tsx, src/components/ui/color-theme.tsx, src/styles/card.css, src/index.css, src/showcase/experiments/pointer.tsx

### Paired Card actions end with Secondary

composition.card-footer-actions | Required | approved | enforcement: Manual review

When CardFooter contains exactly two peer actions, place the lower-priority action first and the higher-priority action second in DOM order. The higher-priority action uses Secondary; the lower-priority action uses Tertiary/default, or Ghost for a dismissive action. In a horizontal footer, end alignment places Secondary at the inline end, which is the right in left-to-right interfaces. In a vertical footer, Secondary sits at the block end, which is the bottom. Never use CSS order to create this hierarchy because keyboard and reading order must match the visual order.

Exceptions: Single-action footers and mixed groups with three or more actions or a separate icon utility are outside the paired-action contract. A destructive action retains its destructive semantic variant but still occupies the final emphasized position.

Tokens: `--button-secondary-fill`, `--button-secondary-ink`, `--button-tertiary-fill`, `--button-tertiary-ink`, `--card-footer-gap`

Files: src/components/ui/card.tsx, src/components/ui/button.tsx, src/showcase/demos/data.tsx, src/showcase/demos/annotation.tsx, src/showcase/demos/persona.tsx, src/showcase/experiments/concentric.tsx, src/components/expression-lab-preview.tsx

### Card spacing communicates grouping

composition.card-spacing-rhythm | Required | approved | enforcement: Partially automated

Construct standard expressive Cards as a sequence of clear regions. Treat CardHeader as one chunk, leave24px before CardContent, and leave24px before CardFooter. Non-scrolling footers omit the divider and use8px top padding with24px inline and bottom padding. A footer after scrolling content uses the shared divider and24px top padding. The same24px token supplies the Card's top and inline insets. Keep strongly related labels, values, controls, and metadata at --card-group-gap (8px); paired footer actions also stay8px apart. Distinct groups inside CardContent use24px. Use boundaries only where scrolling requires persistent separation; otherwise proximity and open space communicate grouping. Repeated rows and peer elements use consistent alignment, sizing, and spacing so similarity remains meaningful.

Exceptions: Small Cards retain compact12px spacing. Code Cards keep their specialized compact geometry. Edge-to-edge scrolling content cancels the external region gap so its box meets the header and footer, while the scroller retains24px internal padding on every side. Edge-to-edge media may replace the outer inset at its edge while the24px region gap resumes between media and text.

Tokens: `--card-spacing`, `--card-spacing-expressive`, `--card-region-gap`, `--card-group-gap`, `--card-content-group-gap`, `--card-footer-gap`, `--space-xs`

Files: src/index.css, src/styles/card.css, src/styles/tokens.css, src/components/ui/card.tsx, src/showcase/demos/data.tsx

### Cards own their corner radius; only the outer card is rounded

geometry.card-radius | Recommended | candidate | enforcement: Manual review

A card's corner radius is the Card-owned --card-radius token, not a raw utility on the markup. Only the outer Card is rounded; CardHeader, CardContent, and CardFooter stay square and never restate the radius. Anything genuinely nested inside a card derives its radius from the concentric equation (outer radius minus the actual inset and border), as the code copy button does.

Exceptions: Media that fills a card edge follows the card's top or bottom corners. Purpose-based radii still choose the token value; this rule governs ownership and nesting, not the specific step.

Tokens: `--card-radius`, `--radius-4xl`

Files: src/components/ui/card.tsx, src/styles/card.css, src/index.css

### A card presents one surface

color.card-single-surface | Recommended | candidate | enforcement: Manual review

Body, header, and footer of a card all use the --card surface. Cards do not introduce a separate footer fill or a blended tone, and headers are transparent over the card surface. Where separation is needed, the shared --card-stroke divider provides it rather than a second fill.

Exceptions: Edge-to-edge media supplies its own imagery. Color themes may retint --card, but the header, body, and footer still resolve to the same value.

Tokens: `--card`, `--card-foreground`, `--card-stroke`

Files: src/components/ui/card.tsx, src/styles/card.css, src/index.css

### Card dividers are opt-in and only for scrolling boundaries

composition.card-contextual-dividers | Recommended | candidate | enforcement: Manual review

Card dividers are opt-in through CardHeader divider and CardFooter divider, and appear only where scrolling content needs a persistent boundary. Non-scrolling headers and footers omit the divider. Every divider uses the shared --card-stroke, matching the outer hairline.

Exceptions: The code card and other specialized surfaces keep their own boundary treatment. Product cards may opt in per composition when their content scrolls.

Tokens: `--card-stroke`

Files: src/components/ui/card.tsx

### Code cards float a single copy action

composition.code-card-floating-action | Recommended | candidate | enforcement: Manual review

The code card omits header and title and floats a tertiary copy action at the top-right, positioned from a tokenized inset with a concentric radius (card radius minus inset and border) on a tokenized stacking layer above the scroll region. A single-line code card snaps to a minimum height so the action has equal top and bottom breathing room, and copy falls back to a native command when the async clipboard is unavailable.

Exceptions: Rich response code blocks may hide line numbers; the floating action and geometry are unchanged.

Tokens: `--card-radius`, `--code-block-copy-inset`, `--code-block-copy-radius`, `--code-block-copy-layer`, `--code-block-min-height`, `--code-block-boundary-width`

Files: src/components/code-block.tsx, src/components/ui/card.tsx, src/index.css

### Footer padding tightens above the actions

composition.card-footer-padding | Recommended | candidate | enforcement: Manual review

A non-scrolling card footer uses 8px top padding with 24px inline and bottom padding, so the actions sit close to the content above while keeping a roomy action zone. A divided footer after scrolling content uses 24px top padding to match the region rhythm.

Exceptions: Small and default card sizes keep their own compact spacing. Code cards are exempt.

Tokens: `--card-spacing`, `--card-footer-gap`, `--space-xs`

Files: src/components/ui/card.tsx, src/index.css

### Card actions adapt without changing order

composition.card-responsive-actions | Recommended | candidate | enforcement: Manual review

Paired footer actions render as a right-aligned row on wider widths and a full-width stacked column when compact, preserving the Secondary-last order without CSS order. A header action uses CardAction so its label optically centers on the title row, dropping below the title only in the compact fallback.

Exceptions: Single-action footers and three-or-more-action groups are outside the paired-action layout. A card may keep a full-width primary action.

Tokens: `--card-footer-gap`

Files: src/components/ui/card.tsx, src/showcase/demos/data.tsx
