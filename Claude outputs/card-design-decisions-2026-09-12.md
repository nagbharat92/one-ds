# Card design decisions — 2026-09-12

High-level decisions from the card system work. This is a decision record, not a
spec: canonical, enforceable rules live in `src/design-system/rules.json` and the
generated `public/design-rules.md`. Token values below reflect the current state
after this session.

## 1. Depth: flat base, no shadow

- Cards are the flat tier of the three-level elevation system: **surface tone +
  hairline outline, no cast shadow**.
- Card composes the shared `Elevation` contract (`level="flat"`, `data-elevation="flat"`),
  it does not recreate the recipe locally.
- Depth belongs to overlays (raised/floating), never to a resting card.

## 2. Shape: only the Card carries corners

- Corner radius is a Card-owned semantic token `--card-radius` (currently
  `--radius-4xl` = **26px**), not a raw utility on the markup.
- Only the outer Card is rounded. Header, content, and footer are square; they do
  not restate the radius.
- Concentric rule still governs anything genuinely nested (e.g. the code copy
  button derives its radius from the Card radius minus its inset and border).

## 3. Surface color: one card surface

- The whole card — body, header, and footer — uses the **same `--card` surface**.
  Footers no longer borrow the sidebar/navigation tone and no longer use a
  reduced blend.
- No invented footer-fill or strength tokens. Separation comes from the divider,
  not from a second fill.
- Headers are transparent over the card surface.

## 4. Dividers are contextual, not decorative

- A divider appears **only where scrolling content needs a persistent boundary**
  (the edge-to-edge scroll example, opted in via `CardHeader divider` /
  `CardFooter divider`).
- Non-scrolling headers and footers have **no divider**.
- Every divider uses the shared `--card-stroke` (same color as the outer hairline).

## 5. Code card: content plus a floating action

- The code card has **no header and no title**.
- The copy action floats at the top-right, positioned from a tokenized inset with
  a concentric radius (Card radius − inset − border), on a tokenized stacking
  layer above the scroll region.
- It is a **tertiary** button and copies via the Clipboard API with a native
  fallback.
- A single-line code card **snaps to a minimum height** so the button has equal
  top/bottom breathing room.

## 6. Footer action hierarchy

- When a footer has exactly two peer actions, the **more important action is
  `Secondary` and comes last in DOM order** — right in a row, bottom in a column.
- The supporting action is Tertiary/default, or Ghost when dismissive.
- Order is expressed in the DOM (keyboard/reading order), never via CSS `order`.
- Paired actions sit **8px** apart.

## 7. Spacing as grouping (Gestalt + Material Expressive)

- Spacing communicates relationships; it is a hierarchy, not a uniform enlargement.
- Current expressive rhythm:
  - **8px** between strongly related items (labels, values, metadata, paired actions).
  - **24px** between distinct content groups and between major regions
    (header → content → footer). This is the `--card-spacing` / region gap for the
    expressive size.
  - **24px** card inset (top and inline).
- The card boundary + divider (only when scrolling) provide common region and
  connectedness; we avoid extra nested containers when space alone communicates
  grouping.
- The standard showcase cards adopt the expressive size so this rhythm is
  consistent across specimens.
- History: the rhythm was trialed at 32px, then retuned to **24px**.

## 8. Footer padding

- Non-scroll footers: **8px top**, **24px** inline and bottom (tight to the
  content above, roomy around the actions).
- Scrolling (divided) footer: **24px** top, matching the region rhythm, with the
  divider carrying separation.

## 9. Edge-to-edge content

- Edge-to-edge scroll content **cancels the outer region gap** so the scroll box
  meets the header and footer, while the scroller keeps **24px internal padding**
  on all sides.
- The scroll starts directly beneath the header (no stray gap).

## 10. Responsiveness

- Paired footer actions use a responsive layout: a right-aligned row on wider
  widths, a full-width stacked column when compact, preserving the Secondary-last
  order.
- Header title + action use `CardAction` so the action is optically centered on
  the title row, with a compact fallback that drops below the title.

## 11. Compose the library, tokenize everything

- Cards are built only from Card and its named parts (`CardHeader`,
  `CardHeaderContent`, `CardHeaderAside`, `CardAction`, `CardContent`,
  `CardMedia`, `CardFooter`, etc.), never re-styled locally.
- Every value is a named token. No raw hex, magic numbers, arbitrary bracket
  values, or inline styles. Reuse the existing scale; do not invent parallel
  tokens (the footer-fill/strength tokens were removed for this reason).

## 12. Measurement / annotations

- Card anatomy and spacing are documented with the existing annotation
  measurement system (semantic captions on measured regions), available on the
  Rich Content preview and off by default.

---

## Candidate rules to write

Some already exist as approved rules (noted); the rest are proposals for review.
Naming follows the `section.kebab-id` convention in `rules.json`.

1. **`appearance.card-flat-elevation`** — Cards are the flat elevation tier
   (tone + `--card-stroke` hairline, no shadow) and compose the shared `Elevation`
   flat level. *(Largely covered by the existing `appearance.elevation` rule; could
   be a card-scoped clarification.)*

2. **`geometry.card-radius`** — Corner radius is the Card-owned `--card-radius`
   token; only the outer Card is rounded; nested parts stay square and derive any
   radius via the concentric rule. *(New; complements `geometry.concentric-corners`
   and `geometry.purpose-based-radii`.)*

3. **`color.card-single-surface`** — Body, header, and footer share the `--card`
   surface; no separate footer fill or blend tokens; headers are transparent.
   *(New; partially reflected in the updated `color.surface-accent` and
   `composition.card-material`.)*

4. **`composition.card-contextual-dividers`** — Dividers appear only where
   scrolling content needs a boundary, are opt-in on `CardHeader`/`CardFooter`,
   and use `--card-stroke`. *(New; currently folded into `composition.card-material`.)*

5. **`composition.code-card-floating-action`** — Code cards omit header/title and
   float a tertiary copy button at the top-right with a concentric radius,
   tokenized inset/stacking, min-height snap, and a clipboard fallback. *(New.)*

6. **`composition.card-footer-actions`** — Two-action footers: Secondary is the
   important action and comes last (right/bottom), DOM order not CSS order.
   *(Exists — approved.)*

7. **`composition.card-spacing-rhythm`** — Grouping hierarchy: 8px related, 24px
   groups/regions, 24px inset; edge-to-edge cancels the region gap with 24px
   internal scroll padding. *(Exists — approved; already retuned to 24px.)*

8. **`composition.card-footer-padding`** — Non-scroll footers use 8px top with
   24px inline/bottom; scrolling (divided) footers use 24px top. *(New, or a clause
   inside `composition.card-spacing-rhythm`.)*

9. **`composition.card-responsive-actions`** — Footer actions are a right-aligned
   row when wide and a full-width stacked column when compact, preserving
   Secondary-last order; header action uses `CardAction` for optical title
   alignment. *(New.)*

10. **`composition.card-material`** — Framed specimens compose Card and its named
    parts; Card owns fill, boundary, radius, clipping, and spacing through tokens.
    *(Exists — approved; already updated with divider/footer-surface clauses.)*

11. **`foundations.card-tokenization`** — Cards reuse the named spacing/radius/
    color scale and never introduce parallel tokens for one-off effects.
    *(Covered by the existing `foundations.tokens` rule; could add a card note.)*
