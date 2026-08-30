# OneDS Phase 1 PRD: Token Layer as the Root

## Prompt to use with this PRD (VS Code, Opus 4.8)

Paste this PRD into the agent, then use this as your instruction:

> Read this PRD in full before doing anything. This is Phase 1 of a larger migration. Do NOT start editing yet. First, read the actual current state of this repo: how tokens are generated and what format they output, how those tokens currently reach components, and whether the four-parameter generative theme is already cleanly parameterized. Report back what you found and where it differs from the assumptions in this PRD. Then propose a concrete plan for the "done-when" checklist below, flag anything in the PRD that does not fit the real code, and wait for my confirmation before writing any code. Work in one pass on the token layer only. Do not touch components in this phase.

Rationale: this phase depends on facts we have not confirmed yet. The prompt forces the agent to ground itself in the real code and surface conflicts before building, so you are not handing it a spec built on guesses.

---

## Goal

Make the OneDS tokens the single source of truth for the entire system, restructured so one token definition feeds both a Tailwind preset and shadcn's CSS variables, without flattening the generative theme into static values.

Everything downstream (bulk shadcn import, special components, the showcase site, the agent-legibility layer) inherits its look from this layer. Until this exists and is correct, every later phase is building on sand. This is the keystone.

## Why this is first

The token-to-shadcn-variable mapping is what makes bulk-importing shadcn pay off. Import components before this mapping exists and they arrive wearing shadcn's default look, forcing per-component hand-editing later. Do the mapping first and every imported component inherits the OneDS look for free. Order is load-bearing: tokens before components.

## Scope

In scope:
- Restructure tokens so they are the root layer everything reads from.
- Name tokens by intent, not appearance (`--color-danger` not `--color-red`, `--surface-raised` not `--gray-100`, `--space-comfortable` not `--space-4`).
- Produce a mapping from OneDS tokens to shadcn's expected CSS variables (`--background`, `--foreground`, `--accent`, `--muted`, `--border`, `--ring`, radius, etc.).
- Produce (or shape the tokens to produce) a Tailwind preset driven by the same token source.
- Preserve the four-parameter generative theme (`accentHue`, `groundOffset`, `groundLightness`, `chromaScale`) as a live computation, not a frozen snapshot of values.

Out of scope for this phase:
- Any component work (shadcn import, special components) — that is Phase 2 and 3.
- The showcase site — Phase 4.
- The manifest, recipes, layout rules — Phase 5.
- The extension shell — Phase 6.

## Requirements

### 1. Tokens as the single root

There is one place where a design decision lives. A color, spacing step, radius, or type-ramp step is defined once. Both the Tailwind preset and the shadcn variables read from that one place. No value is defined twice.

### 2. Semantic-by-intent naming

Token names describe purpose, not appearance. An agent (and you) should be able to pick a token by meaning. Establish the intent vocabulary as part of this phase; the names outlive the values.

REQUIRED examples: `--color-danger`, `--color-accent`, `--surface-raised`, `--surface-sunken`, `--space-comfortable`, `--text-muted`.
FORBIDDEN as public token names: `--color-red`, `--gray-100`, `--space-4` (appearance-based names). Underlying scale steps may exist internally, but the exposed vocabulary is intent-based.

### 3. Generative theme survives as computation

The four-parameter OKLCH theme must remain a function of `accentHue`, `groundOffset`, `groundLightness`, `chromaScale`. Changing a parameter must recompute the token set. This is the piece most at risk of being flattened during migration, and it is the piece carrying the design taste no library provides. Protect it deliberately: confirm that the Tailwind preset and shadcn mapping consume the *computed* tokens, not hardcoded outputs.

### 4. Feeds Tailwind and shadcn from one source

- Tailwind preset: Tailwind is configured so its palette, spacing, radius, and type scale come from OneDS tokens, replacing Tailwind's defaults. Class names resolve to OneDS values.
- shadcn variables: the CSS custom properties shadcn reads are mapped to OneDS tokens, so any shadcn component imported later inherits the OneDS look with no per-component editing.
- Both are driven by the same token definitions. Change a token once, both faces update.

### 5. Light/dark theming preserved

`light-dark()` theming continues to work through the token layer. Both Tailwind and shadcn faces respect it.

## Done when

- [ ] There is a single token source; no design value is defined in more than one place.
- [ ] Exposed token names are intent-based; appearance-based names are not part of the public vocabulary.
- [ ] The four-parameter generative theme still computes the token set live; changing a parameter recomputes, nothing is frozen.
- [ ] A Tailwind preset exists and is driven by the token source; a sample Tailwind class resolves to a OneDS value.
- [ ] A OneDS-token-to-shadcn-variable mapping exists; shadcn's expected variables all resolve to OneDS tokens.
- [ ] Light and dark both work through the token layer across both faces.
- [ ] A short written note in the repo documents the token vocabulary and the shadcn mapping, so the next phase (and an agent) can read what exists.

## Constraints

- One pass, token layer only. No component changes in this phase.
- Do not flatten the generative theme to static values under any circumstances.
- Do not invent token names outside the intent-based vocabulary established here.
- Read the real repo state and reconcile against this PRD before writing code; where they conflict, surface the conflict rather than silently following either one.

## Open questions to resolve during the grounding step

- Current token output format: is it already shaped to feed a Tailwind preset, or does it need restructuring?
- Is the generative theme already cleanly parameterized, or is it partly hardcoded today?
- Which exact shadcn variables need mapping, given the components you plan to import in Phase 2?
- Does the existing `light-dark()` setup carry cleanly into the Tailwind preset, or does Tailwind's dark-mode model need reconciling with it?
