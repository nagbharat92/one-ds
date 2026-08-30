# Rule building for agents

A report on how OneDS should express its rules now that agents, not people, are the primary consumer — what to take from shadcn, what new rules to write, and how the rules page should be built.

No code was written for this report.

---

## 1. Where we actually stand

### 1.1 The agent-facing surface today

| Artifact | Purpose | Machine-readable? |
| --- | --- | --- |
| `AGENT_PROTOCOL.md` | The entry contract. 6 lines. | No — prose |
| `MANIFEST.md` | 57 rows: component, purpose, when not to use, status | Partly — a fixed 4-column table, parsed by `check.mjs` |
| `RULES.md` | 41 rules (32 Required, 9 Forbidden) | No — prose bullets |
| `components/<name>/USAGE.md` | Per-component guidance, 51 files | No — free-form headings |
| `components/<name>/<name>.html` | Canonical markup | Yes, implicitly |
| `components/<name>/<name>.css` | Token-only CSS | Yes, implicitly |
| `tokens.css` | 646 generated custom properties | Yes |
| `tokens/theme.json` | 4 numbers that generate the palette | Yes |
| `scripts/check.mjs` | The enforcement layer | Yes — this is the only real contract |
| `site/*.html` | Human catalog, 8 pages | No |
| Setup prompt on `site/index.html` | Bootstraps `.github/instructions/oneds.instructions.md` | No |

51 component packages, all `built`, 6 marked `not built` in the manifest as future roles.

### 1.2 What `check.mjs` enforces right now

Thirteen distinct checks. This is the real, non-negotiable part of OneDS:

1. No literal hex colour in authored CSS
2. No literal colour function (`rgb`, `oklch`, …) in authored CSS
3. No literal `px` / `rem` / `em` / `ms`
4. No literal `vh` / `vw` / `ch` (except `100vh` / `100vw`)
5. No `text-transform: uppercase`
6. No `--oneds-reference-space-*` inside `components/**`
7. No undefined `--oneds-` token referenced anywhere
8. No rule that sets `font-size` without a paired `line-height`
9. Every non-colour, non-typography token has a `data-token` row on `site/tokens.html`
10. No stray `data-token` row naming a token that does not exist
11. No inline `style=` attribute in any HTML
12. Every `<table>`'s nearest class-bearing wrapper sets `overflow-x: auto`
13. Every component directory has all three files, has a manifest row, and that row says `built`

### 1.3 The gap, stated plainly

**41 rules exist. 13 are enforced. The other 28 are advice.**

And the enforcement that exists is almost entirely about *values* — hex, px, token names. Almost none of it is about *structure*: composition, dependencies, ARIA, state, motion, or the shape of a component package. Those are exactly the things an agent gets wrong.

Three concrete symptoms already visible in the repo:

- **The rules page is already stale.** `site/rules.html` has 23 cards across 5 sections for 41 rules. Two of those cards still teach "Put every `<table>` inside a card" and "Never present a table outside a card" — the rule that was *superseded* by the table-surface rule in `RULES.md` ("give every `<table>` a bounded surface that owns its horizontal overflow"). The page and the source disagree, and nothing catches it. This is the same failure mode that hit `site/tokens.html` three times and was fixed by making the page generated.
- **`USAGE.md` has no schema.** Across 51 files: `## Markup` appears 49 times, `## CSS` 49, `## When not to use` only 21, `## Variants` 19, `## Accessibility` only 6. The same concept is spelled three ways — `## Behaviour to wire in production` (6), `## Behaviour` (4), `## Behavior and accessibility` (2). An agent cannot reliably answer "what ARIA does this component need?" because two thirds of packages never say.
- **Dependencies between components exist but are invisible.** `date-picker` composes `calendar`. `alert-dialog` reuses the `.dialog` shell. `drawer` and `input-group` need `button.css`. `switch--card` reuses `--oneds-component-choice-card-*`. `select` and `date-picker` reuse `--oneds-component-field-*`. Every one of those relationships lives only in a sentence in a `USAGE.md`. An agent that copies `date-picker.css` alone ships a broken component, and the checker says everything passed.

---

## 2. What shadcn gives us

shadcn's insight is not its components. It is that **the design system is distributed as machine-readable data with a resolver in front of it**, and the prose is a by-product. OneDS is the mirror image: excellent prose plus a value linter, with no data layer and no resolver.

### 2.1 The primitives, and their OneDS translation

| shadcn primitive | What it does | OneDS equivalent to build | Value |
| --- | --- | --- | --- |
| `registry.json` — `name`, `homepage`, `items`, `include` | One index of everything installable | `registry.json` at repo root, generated from `MANIFEST.md` + `components/` + `tokens.css` | High |
| `registry-item.json` — `name`, `title`, `description`, `type`, `files[]`, `registryDependencies`, `cssVars`, `css`, `docs`, `categories`, `meta` | Per-item install contract | `components/<name>/component.json` | High |
| `registryDependencies` | Dependency resolution — install X, get its closure | `dependsOn` per component, enforced by the checker | **Highest** |
| `type: registry:base` — "use for entire design systems" | An item that *is* a system | OneDS itself is one `registry:base` item: `tokens.css` + fonts + baseline | Medium |
| `files[].target` with `@ui/`, `@components/` placeholders | Where the file lands in the consumer | OneDS targets: inline `<style>` for output, `src/_local/` for candidates | Medium |
| `cssVars` / `css` | Item-scoped variables and rules | The `component.<name>.*` token group — already exists, just isn't linked to its component in data | High |
| `docs` | A message shown at install time | The "when not to use" line plus a11y and JS caveats | High |
| `categories` | Grouping for browse and search | The page-build-phase taxonomy: layout / content / control / input / status / overlay / navigation | Medium |
| `meta` | Arbitrary key/value | `requiresJs`, `nativeElement`, `a11yRoles`, `browserSupport`, `supersedes` | Medium |
| MCP server — browse, search, view, install, namespaces | The agent gets *tools*, not just files | An `llms.txt` + a JSON index first; an MCP server later | High (later) |
| CLI `view` / `search` / `docs` / `info` | Inspect before installing | `node scripts/oneds.mjs view <name>` | Medium |
| Post-install audit checklist | The agent verifies its own output | `check.mjs` already does this for consumers — nothing tells the agent to run it | **Highest** |
| Blocks (`registry:block`) — login-01, dashboard-01, sidebar-07 | Multi-component worked compositions | `recipes/` — OneDS has **zero** compositions today | **Highest** |
| `components.json` | The consuming project's own config | `scripts/config.json` exists for the checker; promote it to the project contract | Medium |
| `$schema` JSON Schema | Validation of the data layer | Schemas for `registry.json`, `component.json`, `oneds.rules.json` | Medium |
| Versioning — `#v1.2.0`, commit SHA pinning | Reproducibility | The Git submodule already pins; surface the SHA in generated output | Medium |
| Preset codes, theme editor, `apply --only theme` | Shareable theming | `tokens/theme.json` + the live preview + Copy theme.json — **OneDS is already ahead here** | Done |
| "Copy Page" markdown / raw docs | Docs the model reads as text | Our `.md` sources exist but are not indexed for agents | High |

### 2.2 What NOT to take

The user preference for robust-simple applies. These are shadcn solutions to problems OneDS does not have, and adopting them would be a regression:

- npm dependency installation. OneDS is dependency-free and must stay that way.
- Tailwind, `cn()`, class-variance-authority, `@theme inline`.
- React / TSX / RSC, `registry:hook`, `registry:page`.
- Multiple styles (`new-york` vs `default`). OneDS has one voice.
- Per-component spacing variables like `--card-spacing`. This was explicitly rejected during the card work in favour of static rhythm tokens; do not reintroduce it through the back door.
- A CLI that writes files into the consumer's project. The copy-verbatim model is deliberate and auditable.

### 2.3 The one-sentence version

> Take shadcn's **data layer** (registry, per-item contract, dependency closure), its **compositions** (blocks), and its **verify step** (audit checklist). Leave its **runtime** (npm, Tailwind, React) alone.

---

## 3. The proposed model: rules as data

The recommendation is to do to `RULES.md` and `site/rules.html` exactly what was already done to tokens: **make the prose a build output, not a source.**

### 3.1 Layer 1 — `rules/oneds.rules.json`

One rule, one object:

| Field | Meaning |
| --- | --- |
| `id` | Stable identifier, e.g. `token-no-literals`, `compose-declare-dependency` |
| `kind` | `required` or `forbidden` |
| `scope` | `routing`, `composition`, `token`, `layout`, `typography`, `colour`, `icon`, `motion`, `interaction`, `accessibility`, `output`, `process` |
| `appliesTo` | `library`, `consumer`, or `both` — a rule about `src/_local/` is not a rule about `components/` |
| `core` | `true` for the short normative set injected into agent instructions |
| `statement` | The one-sentence normative form |
| `rationale` | Why, including the measurement where one exists |
| `violation` / `correction` | The paired snippets already on the rules page |
| `enforcement` | `{ automated: true, check: "css-literal-dimension" }` or `{ automated: false, reason: "…" }` |
| `since` / `supersedes` | So a replaced rule is recorded, not silently dropped |

Then:

- `scripts/build-rules.mjs` generates `RULES.md` and rewrites the `data-rule` cards on `site/rules.html`, the same way `build-tokens.mjs` rewrites `data-token` rows.
- `check.mjs` reports the rule `id` in every violation message, so an agent that hits a violation can look up the statement, rationale, and correction.
- Two new checks close the loop:
  - every rule with `enforcement.automated: true` maps to a real check id, and every check id maps to a rule;
  - every rule has a `data-rule` card on the rules page, and no card names a rule that does not exist.

That last pair makes the drift discovered in section 1.3 structurally impossible.

### 3.2 Layer 2 — `components/<name>/component.json`

The shadcn registry item, adapted. Per component:

```
name, title, category, status
purpose, whenNotToUse          (lifted from MANIFEST.md — manifest becomes generated too)
files[]                        (css, html, usage, optional js)
tokens[]                       (--oneds-component-<name>-* it defines)
reusesTokens[]                 (shared tokens it reads, e.g. --oneds-component-field-height)
dependsOn[]                    (other component packages required to render correctly)
parts[]                        (the BEM class inventory)
variants[] / parameters[]      (the emphasis-vs-modifier taxonomy already used in button/USAGE.md)
requiresJs, nativeElement
a11y { role, requiredAria[], focusPattern, hostMustImplement[] }
supports[]                     (@supports features and their fallback)
```

`registry.json` at the root aggregates all 51. New enforceable checks fall out immediately:

- **Dependency closure**: if a component's CSS references a class it does not define, that class's owner must appear in `dependsOn`. This catches the `date-picker` → `calendar` case automatically.
- **No class collision**: two components must not define the same root class. This is the exact bug that was caught by hand during the input-vs-field reconciliation.
- **Token ownership**: `--oneds-component-<name>-*` may only be defined for a component that exists, and a component that reuses another's token must declare `reusesTokens`.
- **Part inventory**: generated HTML may only use classes that appear in some component's `parts[]` or are declared `ONEDS-CANDIDATE`.

`MANIFEST.md` and the per-component sections of `USAGE.md` become generated from this, which fixes the heading-vocabulary chaos measured in 1.3 without rewriting 51 files by hand.

### 3.3 Layer 3 — the agent runtime contract

`AGENT_PROTOCOL.md` today stops at "copy it". It never says *verify*. The protocol should become a numbered loop:

1. **Route** — read `registry.json`; does a component own this pattern?
2. **Resolve** — take the dependency closure, not the single file.
3. **Copy** — verbatim, into an inline `<style>` block.
4. **Compose** — use `recipes/` if one matches the page shape.
5. **Verify** — run `node oneds/scripts/check.mjs .oneds/config.json`. Do not report done before it passes.
6. **Report** — list what was copied, what was built local, and every token gap found.

Step 5 is the single highest-leverage addition in this whole report. The checker already supports a consumer config; nothing currently instructs an agent to use it.

---

## 4. New rules to add

Grouped by the scope taxonomy from 3.1. Each is marked **[auto]** if it can be mechanically enforced, **[review]** if it cannot. Rules marked **(learned)** are ones the project already discovered and applied but never wrote down.

### A. Composition and dependencies — new category, biggest gap

| # | Rule | Enforce |
| --- | --- | --- |
| A1 | A component that composes another declares the dependency and its CSS is copied with it. *(learned: date-picker → calendar)* | [auto] |
| A2 | Never redefine a class another component owns. When two packages want the same name, one is renamed or deleted — no aliases. *(learned: input vs field)* | [auto] |
| A3 | A component that extends another wins by its own specificity, never by stylesheet load order. *(learned: `.alert-dialog--small` lost to `.dialog`; the fix was `.alert-dialog.alert-dialog--small`)* | [review] |
| A4 | One role, one component. When two components overlap, consolidate — rename or remove, do not keep both. *(learned: divider → separator, text-box → textarea, card--warning → alert)* | [review] |
| A5 | A container component hosts a control; it never replaces it. *(learned: field is the host, input is the control)* | [review] |
| A6 | Prefer a modifier on a shared shell over a second shell. *(learned: alert-dialog reuses the dialog shell rather than shipping a second modal engine)* | [review] |
| A7 | Reuse a shared token before adding a new one; never duplicate a sibling's dimension under a new name. *(learned: date-picker and select reuse `--oneds-component-field-*`)* | [auto] |

### B. Interaction and state

| # | Rule | Enforce |
| --- | --- | --- |
| B1 | A live control is demonstrated live. Never fake hover, focus, or pressed with a static tile. *(learned: state tiles removed from button, avatar, menu)* | [review] |
| B2 | State is carried by ARIA where ARIA exists — `aria-pressed`, `aria-selected`, `aria-current`, `aria-expanded`, `aria-invalid`, `aria-checked` — and CSS styles off the attribute, not a modifier class. | [auto] |
| B3 | Disabled uses the native attribute on a native control. A `--disabled` modifier with `pointer-events: none` is only for shells with no native control. | [auto] |
| B4 | Selection language is uniform: selected fill is `background-brand-subtle` with `foreground-brand-primary` ink. | [review] |

### C. Progressive enhancement and JavaScript — new category

| # | Rule | Enforce |
| --- | --- | --- |
| C1 | Use the native element that already has the behaviour: `<details>`/`<summary>` for disclosure, `<dialog>` + `showModal()` for modality, `<input type="range">` for a slider, `<select>` for a compact choice. Do not ship a JS engine the platform already provides. | [review] |
| C2 | If JS is required it is one dependency-free, event-delegated `<name>.js`, and the component still renders without it. | [auto] |
| C3 | A component that needs host JS states exactly what the host must implement — keyboard, focus management, `aria-expanded`, filtering. Vague "needs JS in production" is not compliant. | [auto] |
| C4 | Progressive CSS features go inside `@supports` with a stated fallback: `field-sizing: content`, `interpolate-size: allow-keywords`, `text-box: trim-both`. | [auto] |
| C5 | Zero editor diagnostics. `@starting-style` and `forced-color-adjust` are excluded because they trip the baseline linter; use keyframes and system colours instead. *(learned twice)* | [auto] |
| C6 | Local CSS custom properties that are not theme values must not be named `--oneds-*`. *(learned: `--progress-value`, `--slider-value`, `--tabs-active`, `--daySize` — the checker reads an `--oneds-` name as an undefined token)* | [auto] |

### D. Motion

| # | Rule | Enforce |
| --- | --- | --- |
| D1 | Every animation and transition ships a `prefers-reduced-motion` block that caps both `transition-duration` and `animation-duration`. | [auto] |
| D2 | Entrance is a keyframe; exit is a transition with `overlay` and `display` set to `allow-discrete`, degrading to an instant close. | [review] |
| D3 | All durations, easings, distances, and press scales come from motion tokens. | [auto] |

### E. Accessibility — currently only one icon rule covers this

| # | Rule | Enforce |
| --- | --- | --- |
| E1 | Every interactive component declares its required ARIA and ships it in `<name>.html`. | [auto] |
| E2 | Focus is always visible. The house pattern is the two-part ring: `outline` in `stroke-focus-outer` plus an inset `box-shadow` in `stroke-focus-inner`. A component that already uses `box-shadow` for its own boundary takes the single-outline fork and records why. *(learned: switch)* | [auto] |
| E3 | Any element given `tabindex="0"` for scrolling gets a focus ring. *(learned: `pre.code-block` fell through to the browser's default orange ring)* | [auto] |
| E4 | Never build a visually-hidden helper. Literal `1px` is forbidden, so a hidden label is expressed as `role="img"` with `aria-label`. *(learned: breadcrumb and pagination ellipsis)* | [auto] |
| E5 | Status is never carried by colour or an icon alone. The status stays in text. | [review] |
| E6 | Any boundary that must be perceived clears 3:1 against the surface behind it. **A `-subtle` fill or `-subtle` stroke is not a valid boundary on `surface-neutral-nearer`** — measured at 1.05:1 and 1.36:1, both invisible. *(learned: the dialog status tile)* | [review] |
| E7 | `foreground-neutral-tertiary` is never used below 24px, or below 18.66px bold. Small supporting text takes `secondary`. *(already in RULES.md as a role statement; should become explicit and testable)* | [auto] |

### F. Tokens — extending the existing set

| # | Rule | Enforce |
| --- | --- | --- |
| F1 | Every new component token gets a `site/tokens.html` row in the same change. *(already enforced by the checker but never written as a rule — pair them)* | [auto] |
| F2 | Concentric radius: an outer radius equals the inner radius plus the gap. *(a standing preference, applied throughout, absent from RULES.md)* | [review] |
| F3 | Never use `radius-pill` on a container that grows. Use a fixed radius equal to half the resting height. | [review] |
| F4 | A token that falls out of use is deleted with its row, unless it is deliberately retained as documented vocabulary. *(learned: `dialog.iconTileSize`)* | [review] |
| F5 | A component names its token group as the camelCase of its directory; verify the generated variable name before writing CSS, because the generator only splits lowercase-to-uppercase. *(learned: `paragraphXSmall` emits `paragraph-xsmall`)* | [auto] |

### G. Documentation and demos — currently entirely tribal knowledge

| # | Rule | Enforce |
| --- | --- | --- |
| G1 | A section on the components page **shows**; it does not **document**. The shape is exactly: canvas stage, then a "When not to use" alert, then a code block. Nothing else. *(learned: the ai-composer section had become the page's outlier)* | [auto] |
| G2 | Sections are alphabetical by slug, with a separator between every pair. | [auto] |
| G3 | Adding a component is one change with six parts: package files, tokens, token-page rows, manifest row, stylesheet link plus TOC entry plus section, and a passing checker run. | [auto] |
| G4 | The specimen is the key. A specimen labels itself with the thing it demonstrates rather than repeating a dummy sentence. *(learned: typography page)* | [review] |
| G5 | `USAGE.md` follows a fixed heading schema. Free-form headings are the reason two thirds of packages never state their accessibility contract. | [auto] |

### H. Output and the consuming project

| # | Rule | Enforce |
| --- | --- | --- |
| H1 | Copy the dependency closure, not the single file. | [auto] |
| H2 | Run the checker before reporting done. A change is not complete until `check.mjs` passes against the project config. | [auto] |
| H3 | When a token is missing, stop, report the gap, and record it as `ONEDS-CANDIDATE` naming the value that was needed. *(extends the existing "never invent a value" rule with the reporting half)* | [review] |
| H4 | Record the OneDS commit SHA in the generated instructions so version drift is detectable. | [auto] |

### I. Naming

| # | Rule | Enforce |
| --- | --- | --- |
| I1 | BEM only: `block`, `block__element`, `block--modifier`. No third level. | [auto] |
| I2 | A component's root class equals its directory name, unless that name is already owned — then it is namespaced and the reason is recorded. *(learned: `.app-sidebar` vs the docs chrome's `.sidebar`)* | [auto] |
| I3 | The taxonomy is fixed: **variants** are mutually exclusive identity (emphasis, content shape); **parameters** are combinable modifiers. Every component's docs use those two words. *(learned: the button taxonomy)* | [auto] |

### J. Process and anti-drift

| # | Rule | Enforce |
| --- | --- | --- |
| J1 | A generated file is never hand-edited. Any page whose values are generated carries `data-*` keys and is rewritten by the build. This now extends to the rules page. | [auto] |
| J2 | After a build rewrites a file, verify with a terminal search, not the editor's index. *(learned: the editor index served stale content for `tokens.html`, `MANIFEST.md`, and `components.html` and caused real damage)* | [review] |
| J3 | Do not repair violations belonging to a concurrent effort. Report them and leave them. | [review] |

**Totals: 41 rules today, 42 proposed additions.** Of the additions, roughly 27 are mechanically enforceable.

### 4.1 A warning about rule count

Eighty-three long prose rules will not fit in an agent's working attention, and a rule an agent skips is worse than no rule because it creates false confidence. The mitigation is the `core` flag in 3.1:

- **`rules/core.md`** — generated, roughly 12 to 15 short imperative lines, the always-applicable normative set. This is what gets injected into `.github/instructions/oneds.instructions.md`.
- **`RULES.md`** — generated, the full long-form set with rationale and measurements, read on demand and cited by id when the checker fires.

shadcn's own agent instructions are short for the same reason. The long rules earn their place by being *retrievable*, not by being *resident*.

---

## 5. The rules page

The next page to build. Design proposal:

**Source.** Generated from `rules/oneds.rules.json` by `build-rules.mjs`, mirroring how `tokens.html` is rewritten. Every card carries `data-rule="<id>"`. Checker enforces full coverage in both directions.

**Structure.** Replace the five ad-hoc sections with the twelve scopes from 3.1: Routing, Composition, Tokens, Layout and rhythm, Typography, Colour and contrast, Icons, Motion, Interaction and state, Accessibility, Output, Process.

**The card.** Keep the violation-and-correction two-column grid — it is the strongest thing on the page today. Add to each card:

- a copy button for the rule id, reusing `token-copy.js` broadened to `button[data-rule]`;
- a status badge: `Checked` when the checker enforces it, `Reviewed` when it does not;
- a scope badge;
- the rationale, including the measurement where one exists — the contrast numbers and the AA boundaries are the most persuasive content OneDS has and they currently live only in memory.

**New sections at the top.**

- *For agents* — the copyable protocol from 3.3, the `check.mjs` command, and links to `oneds.rules.json`, `registry.json`, and `llms.txt`.
- *Coverage* — a data table: total rules, automated count, and the check-id-to-rule mapping. This makes the enforcement gap a visible, shrinking number rather than an invisible one.

**Filtering.** Chips or a toggle group by scope, plus a toggle for "checked only". Both components already exist.

**What to delete.** The two stale table cards described in 1.3, and the "Put every table inside a card" framing generally — it was replaced by the table-surface rule.

---

## 6. Sequencing

| Phase | Work | Unlocks |
| --- | --- | --- |
| **0** | `rules/oneds.rules.json`; generate `RULES.md`, `rules/core.md`, and `site/rules.html`; rule ids in every checker message; two coverage checks | The rules page, and structural immunity to the drift already present |
| **1** | `component.json` per package; generated `registry.json`; generated `MANIFEST.md`; `dependsOn` closure check; class-collision check | Agents stop shipping half-copied components |
| **2** | Land the section 4 rules, each one **with its check in the same change** | Enforcement moves from 13 of 41 toward 40 of 83 |
| **3** | `recipes/` — worked compositions: login page, settings page, dashboard shell, list-and-detail, and the empty/loading/loaded triad | The largest remaining gap: every component is a leaf and no artifact shows a whole page |
| **4** | `llms.txt`; `scripts/oneds.mjs view / search / plan / audit`; optional MCP server wrapping the same JSON | Agents query instead of reading eight HTML pages |

Phases 0 and 1 are the prerequisites for everything else, and phase 0 is what the rules page needs anyway.

---

## 7. Risks

- **Ceremony.** Adding a fourth file to every component package is real cost across 51 packages. Mitigation: generate `component.json` from what already exists (CSS class inventory, token prefix, manifest row, USAGE headings) and hand-correct, rather than authoring 51 files.
- **Two sources of truth during migration.** While `RULES.md` is both hand-written and generated, they can disagree. Mitigation: do the switchover in one change, exactly as `tokens.html` was migrated, and verify idempotency across two builds.
- **Over-rotating on shadcn.** The registry and blocks are worth taking. The runtime is not. Every adoption should be checked against "does this add a dependency or a build step?" — if yes, it is out of scope for OneDS.
- **Rule inflation.** Covered in 4.1. The core-versus-full split is not optional; it is the thing that keeps the rule set usable.

---

## 8. Recommendation

Build the rules page from data, not by hand. That single decision delivers the page that is next on the list, fixes drift that has already occurred, and creates the pattern — source JSON, generated prose, generated page, paired checker rule — that phases 1 through 4 all reuse.

Then take three things from shadcn and nothing else: the **dependency closure**, the **worked compositions**, and the **verify step**.
