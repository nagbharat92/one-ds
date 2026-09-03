# OneDS phase 2a — expression lab

Status: working product brief, not an implementation specification.

Parent intent: [Phase 2 expressive system charter](oneds-phase-2-expressive-system-prd.md).

## Goal

Create one controlled place to discover what “Soft electric” means in actual OneDS interface objects before changing production defaults.

The lab is a decision surface, not a component catalog. It should let color, shape, scale, typography, and motion be judged together rather than as isolated token tables.

## Why this comes first

Designing foundations in the abstract creates polished scales that may not compose into a compelling interface. The lab reverses that process: begin with representative UI moments, compare a few coherent directions, then formalize only the relationships that survive.

## Home in the showcase

The lab lives in a top-level **Experiments** section, separate from both Blocks and Components. Its first page is **Expression Lab**: one coherent mini-application composed from current OneDS components inside the same full-width, application-height canvas used by Blocks.

The initial page is intentionally a neutral control condition. Its application structure, content, and interactions stay stable while an experiment changes one relationship at a time. This makes comparisons meaningful and prevents the lab from becoming another disconnected specimen gallery.

The baseline includes a progress hero, a focus controller, an experiment checklist, and an observation-capture area. These regions provide durable homes for testing prominent actions, selection, control islands, metrics, active states, and eventual color and shape treatments.

## Research gate

The first experiment is grounded in Material 3 Expressive research, established visual-design principles, and accessibility guidance rather than reference-image imitation.

The main findings are:

- Material’s research across 46 studies and more than 18,000 participants found that successful expressive screens made key elements discoverable up to four times faster.
- The benefit came from coordinated size, shape, placement, typography, and containment as well as color.
- Breaking familiar layouts or removing action labels reduced usability even when a concept looked more novel.
- Scale should be limited and intentional: roughly three visible levels, with no more than one or two dominant objects.
- Proximity often groups more effectively than decoration; common-region boundaries are powerful and become clutter when overused.
- A prominent control needs a generous hit region, surrounding space, a visible press state, and a familiar role.
- Expression should be evaluated as hierarchy, utility, and style rather than as visual novelty alone.

The detailed synthesis, citations, art direction, and acceptance rubric live in [the Form Language brief](oneds-phase-2c-form-language-prd.md).

## Baseline audit

A temporary browser-only squint test was applied to the current lab and then removed. It revealed:

- The color photograph became an accidental focal point and invalidated a truly monochrome comparison.
- Four repeated checklist rows created more aggregate visual mass than their supporting role warranted.
- Progress and Focus each competed to be the primary journey.
- Identical white cards, boundaries, and radii flattened differences in importance.
- Nested rounded containers risked turning the interface into a collection of bubbles.
- Progress and compact controls receded too far beside large text.

These are experiment inputs, not a request to change the approved bento layout. The composition remains fixed while its internal hierarchy changes.

## Core hypothesis

OneDS will feel expressive when a calm ground holds a small number of substantial, strongly shaped objects with decisive hierarchy and tactile state changes.

The personality should first come from contrast in form, scale, value, placement, and surrounding calm—not from making every object bright, large, or animated. Color is introduced only after that proposition succeeds.

## Representative objects

The first lab should contain a compact set that exposes the system’s major needs:

1. A prominent labelled action.
2. A circular icon action.
3. A small multi-option selection with a moving selection surface.
4. A compact control island or tool dock.
5. A metric or status tile with a large focal value.
6. A media control with transport actions and progress.
7. A stateful mark that can be still, active, or processing.

These objects are deliberately varied. If the visual language only works on buttons, it is not yet a system.

## Comparison sequence

### First comparison: form without hue

Compare the same application in two reversible modes:

- The existing neutral baseline.
- Monochrome Soft Hardware.

Both modes keep the same content, behavior, application frame, bento geometry, and responsive order. Only hierarchy, shape, scale, typography, spacing, and necessary neutral value contrast may change.

### Later comparison: color harmonies

Show the same objects through a small number of coordinated treatments:

- The existing neutral baseline.
- A signature violet/plum harmony.
- A supporting coral/rose harmony.
- One candidate spark pairing, such as violet with lime or coral with sky.

All experimental values should still come from named provisional lab tokens in one place. The lab must not scatter one-off values through markup.

## Questions to answer

### Hierarchy

- Which object is noticed first without relying only on saturation?
- Does the prominent action feel substantial or merely oversized?
- Is there enough calm space around focal controls?

### Color

- Does the signature family feel ownable rather than generically “Material purple”?
- Which supporting and spark family creates energy without becoming childish?
- Do whole tonal regions feel better than isolated colored controls?

### Shape

- Which geometry feels native to OneDS: capsule, rounded square, squircle, scallop, or another form?
- How many expressive shapes can coexist before the interface becomes noisy?
- Can selected or active state be communicated through a shape transition?

### Typography

- Can the existing typeface create enough personality through scale, weight, and compact leading?
- Where do large numerals or short labels add character?

### Motion

- Which state changes benefit from glide, compression, expansion, or a brief arrival sequence?
- Where does motion distract from understanding?

## Scope

- One isolated showcase or experimental route.
- Light-theme exploration plus a dark-theme sanity pass.
- Real interactive states for the objects that need motion judgment.
- A reversible baseline-versus-experiment comparison rather than an untraceable restyle.
- Provisional foundations that can be changed cheaply.
- A first static-form pass with no new expressive motion and no chromatic palette.

## Non-goals

- Changing existing component defaults.
- Finalizing token names or public APIs.
- Demonstrating every component.
- Building a production dashboard.
- Perfecting every responsive breakpoint.
- Adding decorative illustration to compensate for a weak UI language.
- Adding color to repair weak hierarchy.

## Done enough to learn

This chunk is complete when:

- The representative objects can first be compared in the neutral baseline and Monochrome Soft Hardware mode.
- The lab makes one clear focal hierarchy rather than seven equally loud specimens.
- The intended order remains clear under blur, grayscale, and responsive stacking.
- The primary action and current state remain obvious without hue.
- The screen uses no more than three visibly different importance levels and no more than two dominant objects.
- Essential controls retain labels, generous targets, clear focus, and familiar interaction patterns.
- The preferred form language is recorded before color or new motion is introduced.
- Later, the approved form can be compared in at least two coherent harmonies.
- The preferred signature, supporting, and spark candidates are recorded.
- The preferred core shape family and the acceptable use of organic shape are recorded.
- At least one press, one selection glide, and one active-state behavior can be judged.
- The team can clearly name what to keep, change, and discard.
- No production component default had to change to conduct the experiment.

## Expected handoff

The lab should produce evidence for the color, form, and motion briefs. It should not itself become the final token system. Screens or objects that fail should remain visible long enough to record why, then be removed rather than quietly becoming permanent examples.
