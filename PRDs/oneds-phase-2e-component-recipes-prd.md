# OneDS phase 2e — expressive component recipes

Status: working product brief, not an implementation specification.

Parent intent: [Phase 2 expressive system charter](oneds-phase-2-expressive-system-prd.md).

Depends on: [Color harmonies](oneds-phase-2b-color-harmonies-prd.md), [Form language](oneds-phase-2c-form-language-prd.md), and [Motion character](oneds-phase-2d-motion-character-prd.md).

## Goal

Turn proven expressive relationships into a small set of repeatable UI recipes without burdening every primitive with a combinatorial variant API.

A recipe is more opinionated than a token and less product-specific than a complete block.

## Why recipes

Primitives answer “what control is this?” Expressive UI also needs to answer “what role does this object play in the composition?”

For example, a prominent action is not just a larger button. It combines importance, spacing, icon proportion, shape, color role, and pressed behavior. Encoding that relationship once is more coherent than repeatedly styling each ingredient at block call sites.

## Initial candidate recipes

### Prominent action

A substantial labelled action for the primary decision in a spacious region. It may use a strong harmony, generous breathing room, a deliberate icon proportion, and tactile press behavior.

It should never become the default for dense forms or dialog footers.

### Tonal action

A lower-emphasis action using a soft container and readable colored foreground. It supports the dominant action without reverting every secondary control to neutral grey.

### Circular action

A singular icon action for transport, creation, sending, or another unmistakable command. It must have a concise accessible name and should not be used for unfamiliar commands that need persistent labels.

### Control island

A compact composition of related tools or destinations on one shared surface. Selection can travel within it; one tool may temporarily expand. The island owns grouping, padding, and shape relationships while its controls retain their behavior.

### Expressive tile

A rounded-square or softly shaped object for a metric, shortcut, suggestion, or status. It pairs one focal value or icon with restrained supporting content. It is not a generic replacement for every card.

### Stateful mark

A small memorable object that can represent rest, processing, listening, success, or another system state through controlled color, shape, or motion. It is not a decorative logo stamped onto every surface.

## Candidate component touchpoints

The first recipes are likely to draw from:

- Button and icon button.
- Tabs, toggle, and selection controls.
- Toolbar and button groups.
- Card and item compositions.
- Empty state and suggestion actions.
- Progress, spinner, and status feedback.

Inputs, tables, menus, and dialog structure should remain mostly quiet unless a real use case proves otherwise.

## Variant, recipe, or block-specific?

Use this decision test:

### Make it a component variant when

- It changes one component’s durable semantic role.
- The same role appears in multiple unrelated contexts.
- The combination remains understandable without neighboring components.

### Make it a recipe when

- Multiple foundations or primitives must be coordinated.
- The relationship repeats across products or blocks.
- Consumers should not have to reconstruct the geometry and hierarchy manually.

### Keep it block-specific when

- Its meaning depends on one product workflow.
- It coordinates unique content or state.
- A shared abstraction would expose implementation details rather than a reusable concept.

Two convincing contexts are a useful minimum before promoting an experiment into shared API.

## API restraint

The expressive foundation may internally understand harmony, importance, shape, depth, and motion, but a recipe should expose only combinations that have product meaning.

Avoid APIs that let consumers freely combine every axis. Such freedom moves design decisions to call sites and makes the system less coherent.

Prefer names that describe intent—such as prominent, tonal, or control island—over names that merely describe appearance.

## Scope

- Select a small first set from the candidate recipes.
- Recreate the successful lab objects using those recipes.
- Use at least one recipe in a second context before considering it stable.
- Confirm that calm component defaults continue to work.
- Document where each recipe should and should not appear.

## Non-goals

- Adding expressive variants to the whole library.
- Rebuilding primitive behavior.
- Creating a universal widget component.
- Exposing raw hue selection at every call site.
- Treating a one-off visual experiment as a reusable API.
- Replacing block composition with oversized components.

## Done enough to learn

This chunk is complete when:

- A small set of recipes can reproduce the strongest lab examples.
- Each recipe has a clear compositional purpose and an explicit restraint.
- At least one recipe has worked in two meaningful contexts.
- Existing primitive defaults remain calm and compatible.
- Consumers do not need to coordinate low-level color, radius, spacing, and motion manually for the accepted patterns.
- The public surface remains narrow rather than becoming a matrix of visual controls.
- Rejected abstractions are recorded so they are not immediately reinvented.

## Open decisions

- Whether prominent action is a button importance role or a higher-level recipe.
- Whether expressive tile and metric tile are one adaptable pattern or distinct compositions.
- Whether control island belongs under toolbar, button group, or a new composition.
- Which stateful-mark behaviors are generic enough to share.
- Whether expressive recipes are opt-in everywhere or inherited within an expressive block context.
