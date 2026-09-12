# Foundation spacing audit — gaps / paddings / spaces / borders

> **Status: IMPLEMENTED (2026-09-12).** The `--space-*` scale below was added to
> [index.css](../src/index.css) and rolled out across the **entire** component library:
> ~90 named spacing tokens now reference the scale, and the raw `gap-N`/`px-N` utilities
> in 51 `src/components/ui` files were migrated to `*-(--space-*)` (337 usages). Off-grid
> control values were snapped (6→8, 10→12) per Option A; the ladder was extended with
> `--space-3xl` (64px). Deliberately left literal: `Stack`/`Cluster`/`Section` gap
> **variant APIs** (they are the scale's public prop interface), off-ladder layout values
> (`gap-10`/`gap-y-10`=40px, `lg:px-10`=40px, `p-0.75`=3px), optical corrections
> (`pr-2.5`/`pr-2`/`mt-0.5`), hit-area insets (`after:-inset-*`), `data-inset:pl-7` (28px),
> and negative/positional utilities. Verified: `tsc`, `oxlint` (all of `src/components/ui`),
> `vite build`, and `git diff --check` all clean. The audit below is the original analysis
> that drove the change.

Date: 2026-09-12 · Scope: the **Foundations** components and their recently-tweaked
composites — `button, input, textarea, label, checkbox, radio-group, switch, slider,
badge, kbd, avatar, icon, icon-label, text, separator, aspect-ratio, skeleton, spinner,
progress, elevation, swap, drag-handle` plus `accordion, tabs, toggle, select,
native-select, sidebar` — their showcase demo pages, and the tokens in
[index.css](../src/index.css).

## Headline verdict

**Nothing is truly hard-coded.** There are **zero** literal `px`/`rem`/`em` spacing
values, and **zero** inline `style={{ padding/gap/margin }}` in the component files or
their demo pages. Every gap, pad, margin and inset ultimately resolves to the Tailwind
v4 base token `--spacing` (0.25rem = **4px grid**), and every radius to `--radius`
(0.625rem = 10px) scale. The only inline `style` uses are legitimate JS-driven CSS-var
writers (slider stop position, sidebar width vars).

So the real question isn't "tokenized vs hard-coded" — it's **"named semantic scale vs
raw grid step."** Today the foundations run **two parallel spacing systems** for the
same job:

- **System A — named component tokens** (`--field-gap`, `--card-spacing`,
  `--graphic-label-gap`, `--ai-composer-gap`, …). ~200 of these exist in
  [index.css](../src/index.css), each defined as `calc(var(--spacing) * N)`.
- **System B — raw Tailwind numeric utilities** (`gap-1`, `gap-2`, `px-2.5`, `py-2.5`,
  `px-3`, `pr-8`, …) written straight into the component class strings.

The same intent is expressed both ways in different components, which is exactly the
"repeatable scale" problem you flagged. Example: an **8px "related items" gap** appears
as `gap-2` (label, tabs, button-group, select-item), as `--graphic-label-gap` (button),
and as `--card-header-gap` / `--card-footer-gap` (card) — three spellings, one value.

## The distinct spacing steps actually in use (foundations)

Grid = multiple of the 4px `--spacing` base. "½-step" = an off-grid 2px value.

| px | grid ×4 | Half? | Where it shows up (raw utility · named token) | Intent |
|---:|:---:|:---:|---|---|
| 0 | 0 | | `gap-0` `p-0` `pt-0 pb-0` (button-group, button-icon, tabs-line, native-select) | flush |
| 2 | 0.5 | ½ | `p-0.5` (switch track) · `--button-press-distance` `--tabs-padding` `--tooltip-arrow-offset` `--ai-chat-history-action/item-gap` | hairline inset |
| 4 | 1 | | `gap-1` `px-1` `p-1` `-mx-1 my-1` (badge, kbd, toggle, tabs-line, select) · `--button-group-gap` `--message-actions-gap` `--ai-chat-action-gap` `--response-caret-gap` `--card-header-aside-content-gap` | tight cluster |
| 6 | 1.5 | ½ | `gap-1.5` `px-1.5` `pl-1.5` (select item/value) · `--response-list-gap` | menu item pad/gap |
| 8 | 2 | | `gap-2` `-space-x-2` `after:-inset-y-2` (label, tabs, button-group, select, avatar, checkbox/radio/switch hit-area) · `--graphic-label-gap` `--card-header-gap` `--card-footer-gap` `--checkbox/switch/radio-group-label-gap` `--fab-extended-gap` `--field-group-gap` | related items / icon-label |
| 10 | 2.5 | ½ | `py-2.5` `pb-2.5` (accordion), `px-2.5` (toggle) · `--choice-card-padding` | control inset (odd one out) |
| 12 | 3 | | `px-3` `after:-inset-x-3` (tabs, checkbox/radio/switch hit-area) · `--checkbox-group-gap` `--switch-group-gap` `--ai-composer-tool-padding-inline` `--card-header-aside-gap`(24?) | control inline pad / comfortable gap |
| 16 | 4 | | `px-4` `py-4` `pb-4` `mb-4` (button-group label, accordion-lg) · `--card-content-group-gap` `--ai-chat-history-padding` `--code-block-padding-*` | section / content-group |
| 24 | 6 | | `--card-spacing-default` `--response-heading-gap` `--card-header-aside-gap` `--sidebar-resize-handle-inset` | card spacing / block |
| 32 | 8 | | `pr-8` (select check reservation) · `--item-hosted-action-fade-size`(=8) `--drag-handle-active-length` | large block / reserved slot |

Larger steps (40/44/48/56/64…) exist only as **sizes/widths** in tokens
(`--sidebar-width`, `--fab-size-*`, `--ai-composer-*`), not as gaps — out of scope for a
gap/pad scale.

## Inconsistencies worth fixing

1. **Same value, three mechanisms.** 8px and 4px each appear as a raw utility in some
   components and as a named token in others (see headline example). Pick one path per
   value so a future retune is one edit.
2. **Off-grid ½-steps.** The 2px, 6px and especially **10px** values are the only ones
   not on the clean 4px grid:
   - `10px`: accordion trigger `py-2.5`, accordion content `pb-2.5`, toggle `px-2.5`,
     `--choice-card-padding`. This sits between the 8px and 12px steps — decide whether
     these snap to **8** or **12**, or keep 10 as an explicit, named step if intentional.
   - `6px`: only the Select menu-item padding/gap (`gap-1.5`/`px-1.5`). Menus are a
     shadcn convention; fine to keep, but it should be a named `--menu-item-*` token
     rather than a bare `gap-1.5` so it's discoverable.
   - `2px`: legitimate hairline (switch pad, indicator thickness, press distance).
3. **Two `ring-[3px]` arbitrary brackets** (badge line 13, item line 37) duplicate the
   scale utility `ring-3` used everywhere else (button, checkbox, switch). Swap to
   `ring-3` for consistency — the only arbitrary-bracket "spacing-ish" values in the set.
4. **`translate-x-[calc(100%-4px)]`** (switch knob travel) bakes a raw `4px`. It equals
   `p-0.5 * 2` — could reference the track-pad token instead of a literal.

## Borders & radii (quick pass — both clean)

- **Border widths:** uniformly **1px** (`border`, `border-b`, `border-t`, `ring-1`
  elevation stroke) plus **3px** focus rings (`ring-3`) and a couple of **2px** accents
  (avatar `ring-2`, slider `outline-2`). Consistent; no arbitrary widths. These ride
  Tailwind's fixed border/ring scale rather than named tokens — acceptable, but a
  `--focus-ring-width` / `--border-width` token pair would let you retune globally.
- **Radii:** `rounded-sm|md|lg|xl|3xl|full|xs` + tokenized `rounded-(--field-radius)`,
  `rounded-(--button-round-radius)`, etc. All on the `--radius` scale. Consistent.

## Proposed reusable semantic space scale (the tokens you'd add)

Define once in `:root` in [index.css](../src/index.css), all `calc(var(--spacing) * N)`
so they stay on the grid. Names describe **intent**, so call sites read as relationships,
not numbers. This is the "scale used repeatedly" you asked for.

| Token | Value | grid ×4 | Replaces today's… | Use for |
|---|---:|:---:|---|---|
| `--space-none` | 0 | 0 | `gap-0` `p-0` | flush / reset |
| `--space-hairline` | 2px | 0.5 | `p-0.5`, press/indicator insets | switch pad, thin insets |
| `--space-2xs` | 4px | 1 | `gap-1`, `--message-actions-gap`, `--button-group-gap`, `--ai-chat-action-gap` | tight cluster (icon groups, kbd, badge, action rows) |
| `--space-xs` | 8px | 2 | `gap-2`, `--graphic-label-gap`, `--card-header-gap`, `--card-footer-gap`, `*-label-gap` | icon↔label, related items |
| `--space-sm` | 12px | 3 | `px-3`, `--checkbox-group-gap`, `--ai-composer-tool-padding-inline` | control inline padding, comfortable gap |
| `--space-md` | 16px | 4 | `px-4`/`py-4`, `--card-content-group-gap`, `--code-block-padding-*` | content-group / section inset |
| `--space-lg` | 24px | 6 | `--card-spacing-default`, `--response-heading-gap` | card spacing / block gap |
| `--space-xl` | 32px | 8 | `pr-8` reservation, large gaps | block separation |
| `--space-2xl` | 48px | 12 | page gutters (already `--page-*`) | page / hero rhythm |

**Decision needed on the 6px and 10px "in-between" steps.** Two clean options:

- **Option A — 8-step ladder (recommended):** drop 6px and 10px. Snap Select menu items
  6→8, snap accordion/toggle/choice-card 10→**12** (`--space-sm`). Gives one tidy
  ×2-ish ladder (2·4·8·12·16·24·32·48) that's trivial to remember and reuse.
- **Option B — keep them as named exceptions:** add `--space-cozy: 6px` (menus) and/or
  `--space-snug: 10px` (compact controls) so the off-grid values are at least explicit
  and consistent, not incidental `-1.5`/`-2.5` utilities.

## Suggested rollout (if/when you want the refactor)

1. Add the `--space-*` tokens above to `:root`.
2. Alias the ~200 existing per-component tokens to the new scale
   (`--card-header-gap: var(--space-xs)` etc.) — no call-site churn, immediate
   single-source retune, and it reveals any value that *doesn't* map cleanly.
3. Migrate the raw `gap-N`/`px-N` utilities in the foundation components to
   `gap-(--space-*)` / `px-(--space-*)`, deciding the 6/10px question per Option A or B.
4. Swap the two `ring-[3px]` → `ring-3` and the switch `calc(100%-4px)` → a token.

No code changed by this audit — it's a report for your review.
