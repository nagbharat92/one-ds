# OneDS phase 2 — expressive system charter

Status: working product brief, not an implementation specification.

Review 2026-09-07: retained for intent and guardrails. Read the [current review](README.md) before implementation. Palette, rollout sequence, and expression-level assignments below are provisional; current user decisions take precedence. This charter is not approval of the existing Expressive prototype.

## Purpose

Phase 1 established a dependable shadcn foundation and a showcase for inspecting components. OneDS is now beginning to compose those components into application-scale blocks.

Phase 2 explores how that foundation can become more expressive without losing its functional integrity. The aim is not to decorate every primitive. It is to create a coherent language for playful, living, breathing interfaces that can scale from a button to a complete application block.

This document is the canonical statement of intent for the phase. The smaller phase 2 briefs inherit it. If a later brief conflicts with this charter, the charter wins until the conflict is discussed and this document is intentionally revised.

## North star

OneDS should feel like **soft hardware**:

- Controls feel substantial and tactile.
- Color creates charged regions rather than scattered decoration.
- Shape communicates role, importance, and state.
- Motion gives objects weight and continuity.
- Calm infrastructure gives expressive moments room to breathe.

The desired result is more expressive than merely functional, but never less usable.

## Product thesis

1. **Keep the functional core.** Existing shadcn anatomy, accessibility, behavior, and composability remain the chassis.
2. **Add expression as a system layer.** Color harmony, shape, importance, typography, depth, and motion must work together.
3. **Increase expression with abstraction.** Primitives stay dependable; compositions become distinctive; blocks carry the strongest personality.
4. **Use contrast, not uniform enlargement.** A chunky focal action only feels important when nearby infrastructure is quieter.
5. **Prototype in real compositions.** Explore first, validate in a block, and extract reusable patterns only after they repeat.

## First design gate: Monochrome Soft Hardware

The expressive language must work before hue is introduced. The first experiment therefore uses only the neutral value system to establish hierarchy through scale, placement, shape, typography, spacing, and containment.

This is a quality gate, not a permanent rejection of color. If the interface only becomes expressive after violet, coral, or lime is added, its underlying form language is too weak.

The monochrome direction should feel:

- Tactile and substantial.
- Confident and editorial.
- Friendly without becoming toy-like.
- Playful through proportion and silhouette.
- Precise enough to preserve trust and utility.

Color can amplify this language only after the hierarchy survives a grayscale, squint, and silhouette review.

## Later visual thesis: Soft electric

The first direction to test is **Soft electric**:

- A warm paper-like ground.
- Deep ink or plum for strong contrast.
- Violet as the likely signature family.
- Coral or rose as a supporting family.
- Lime, mint, yellow, or sky as a sparingly used spark.
- Capsules, circles, and rounded-square widgets as the core geometry.
- An occasional scallop, squircle, or organic silhouette for one focal object.
- Generous breathing room around substantial controls.
- Gliding selections, physical press feedback, and stateful transformation.

These are hypotheses, not locked palette or geometry decisions. The expression lab exists to test them.

## Expression gradient

| System level | Intended expression |
|---|---|
| Quiet infrastructure | Tables, menus, form fields, long-form reading, and dialog structure remain calm and highly legible. |
| Interactive primitives | Buttons, toggles, tabs, sliders, and navigation gain tactile feedback and selective tonal treatments. |
| Expressive compositions | Control islands, prominent actions, metric tiles, media controls, and suggestion tiles can use stronger scale, color, and shape. |
| Application blocks | Blocks coordinate color zones, hierarchy, asymmetry, and motion into a recognizable experience. |

Expression should peak at the block level, not at the primitive level.

## Principles

### Importance is a composition

Communicate importance first through scale and placement, then through color, and finally through motion. Do not ask saturation alone to carry hierarchy.

### Color arrives as a harmony

A region chooses a curated relationship of ground, strong fill, soft container, readable foregrounds, and interaction states. Components should not independently pick unrelated hues.

### Shape has meaning

Circles, capsules, rounded rectangles, widget shapes, and organic forms each need a recognizable role. Shape is not random decoration.

### Motion is a response

The interface becomes alive because it responds, transforms, and maintains continuity—not because everything moves while idle.

### Density controls energy

Dense information receives quieter treatment. Strong expression belongs around decisive actions, focused values, navigation moments, active system states, and spacious blocks.

### Repetition earns abstraction

A successful experiment is not automatically a new component variant. A pattern should repeat in more than one meaningful context before it becomes shared API.

## Guardrails

- Preserve accessibility, keyboard behavior, focus clarity, contrast, and reduced-motion behavior.
- Keep status colors semantically distinct from decorative expression colors.
- Keep all visual values token-driven and centrally adjustable.
- Preserve natural-case typography; do not use all-caps overline styling as a shortcut to hierarchy.
- Continue the concentric-radius rule for nested rounded objects.
- Do not use an unlimited `tone × shape × size × elevation × motion` variant matrix.
- Do not globally restyle every primitive before a real block proves the direction.
- Do not turn reading surfaces, menus, tables, or forms into visual focal points without a product reason.
- Treat dark mode as an authored expression of the same system, not an automatic inversion afterthought.

## Workstream map

| Brief | Question it answers | Dependency |
|---|---|---|
| [2a — Expression lab](oneds-phase-2a-expression-lab-prd.md) | What controlled application surface will let OneDS compare design decisions? | This charter |
| [2c — Form language](oneds-phase-2c-form-language-prd.md) | Can shape, scale, typography, and containment create expression without hue? | Neutral lab baseline |
| [2d — Motion character](oneds-phase-2d-motion-character-prd.md) | Can the monochrome forms feel alive without becoming restless? | Approved form language |
| [2b — Color harmonies](oneds-phase-2b-color-harmonies-prd.md) | How does color amplify the hierarchy already proven in monochrome? | Approved form and motion findings |
| [2e — Component recipes](oneds-phase-2e-component-recipes-prd.md) | Which repeated expressive patterns deserve shared treatment? | Color, form, and motion |
| [2f — AI chat pilot](oneds-phase-2f-ai-chat-pilot-prd.md) | Does the language work in a real application block? | First component recipes |
| [2g — Adoption and governance](oneds-phase-2g-adoption-governance-prd.md) | How does the system expand without losing discipline? | Pilot findings |

The lettered document names remain stable, but the execution order is intentionally **2a → 2c → 2d → 2b → 2e → 2f → 2g**. Findings can send the work back one step. Each brief should leave the product in a coherent state even if the next brief starts on another day.

## Decision discipline

Each workstream should finish by recording:

- What was tested.
- What felt recognizably OneDS.
- What was too generic, too decorative, or too noisy.
- What remains a local experiment.
- What is ready to become a shared foundation or recipe.

When a hypothesis changes, update this charter or the relevant brief rather than allowing implementation details to silently redefine the direction.

## Success for phase 2

Phase 2 is successful when:

- OneDS has a recognizable expressive thesis rather than a collection of colorful variants.
- A small set of color harmonies, shape roles, importance roles, and motion behaviors work together.
- At least one real application block feels playful and alive while its content remains clear.
- Reusable recipes emerge from demonstrated needs rather than speculative API design.
- Existing functional components still work as a calm foundation.
- The system explains where expression belongs and where restraint is the better design choice.

## Out of scope for now

- A complete re-theme of every component.
- A final brand identity or exhaustive palette.
- A universal organic-shape generator.
- Decorative animation added for novelty.
- A second typeface before the current type system has been tested at expressive scale.
- Locking exact implementation APIs before the lab and pilot provide evidence.
