# OneDS phase 2c — expressive form language

Status: working product brief, not an implementation specification.

Review 2026-09-07: retained for anatomy, shape principles, research links, and visual evaluation. The region plan and "Implemented workbench" section are historical: paths, wrappers, treatment names, and reported verification results are not a current implementation inventory or visual approval. See the [current review](README.md) before using this as a build brief.

Parent intent: [Phase 2 expressive system charter](oneds-phase-2-expressive-system-prd.md).

Depends on: [Expression lab](oneds-phase-2a-expression-lab-prd.md).

## Goal

Define how shape, scale, spacing, icon proportion, and typography work together to communicate role and importance.

“Chunky” should describe a coherent physical presence—not simply a larger height or more corner radius.

## Research synthesis

### Expressive design can improve utility

Material 3 Expressive is based on 46 studies with more than 18,000 participants. Google reports that well-applied expressive screens helped participants find key interface elements up to four times faster. Larger actions, stronger containment, and clearer contrast also reduced age-related differences in visual fixation time.

The result supports expression as a usability tool, not just an aesthetic layer. It also supports a form-first approach: Material identifies shape, size, placement, typography, motion, and containment as independent expressive tactics alongside color.

### Familiarity remains a constraint

Google’s unsuccessful concepts are equally important. Replacing familiar list structures with scattered artwork reduced usability, and removing text labels from actions made them harder to understand. Expression must strengthen learned interaction patterns rather than compete with them.

OneDS therefore keeps:

- Familiar labelled primary actions.
- Predictable lists for homogeneous, scannable content.
- Stable targets through state changes.
- Existing semantic control behavior and keyboard interaction.

### Hierarchy needs restraint

Nielsen Norman Group recommends using roughly three visibly different size levels and no more than one or two large dominant objects in a composition. Scale, placement, value contrast, proximity, and common region should agree on the same reading order.

Asymmetrical balance can create energy, but visual weight still needs to feel distributed. The existing 7/5 and reversed 5/7 bento structure is a strong basis because it creates movement without abandoning a stable grid.

### Proximity before containment

Proximity can overpower similarity of color or shape when people decide what belongs together. A visible boundary creates an even stronger common region, but excessive cards, borders, and nested rounded surfaces add processing cost and can create false visual stopping points.

The bento cards are justified because they hold heterogeneous dashboard content. Inside those cards, whitespace and proximity should be preferred before another enclosure. Choice cards remain bounded because the entire surface is interactive.

### Controls must remain generous and responsive

Apple’s button guidance describes style as the relationship of size, shape, and role; it recommends a prominent treatment for the most likely action, a hit region of at least 44 × 44 points, surrounding separation, and an explicit press state. Nielsen Norman Group similarly connects target size to faster, more accurate acquisition through Fitts’ law.

The experiment should use generous targets for prominent controls while preserving compact but sufficient targets for quiet infrastructure.

### Typography is part of hierarchy

Material’s expressive type system adds emphasized counterparts to its baseline roles rather than replacing the whole type system. Emphasis is applied selectively to key information and actions.

OneDS should first test its existing typeface through scale, weight, leading, and placement. A second typeface is not justified until those tools have been exhausted.

## Current lab diagnosis

The neutral lab already provides a stable grid, real interactions, a tokenized layout, and identifiable regions. A temporary browser-only squint test revealed the weaknesses the first experiment must address:

1. The color portrait is the only photographic and chromatic object, so it becomes an accidental focal point.
2. Four repeated checklist rows create more aggregate visual mass than their supporting role warrants.
3. Experiment progress and the Focus timer compete to become the primary journey.
4. Nearly identical card fills, boundaries, and radii flatten differences in importance.
5. Repeated rounded containers risk a “bubble soup” effect.
6. Progress and compact controls recede too far beside the large text.

These findings do not invalidate the approved bento layout. They define the hierarchy problem the experiment must solve inside it.

## Art direction: Theme-native Soft Hardware

The first experiment should feel:

- Tactile and substantial.
- Confident and editorial.
- Friendly without becoming childish.
- Playful through proportion and silhouette.
- Precise enough to preserve trust and utility.
- Dynamic as a still image before motion is added.

The screen keeps the existing OneDS theme intact, including its surface, content, accent, and imagery decisions. Color is held constant rather than removed, allowing shape, scale, typography, containment, and hierarchy to be evaluated without a palette change masking the result.

## Intended hierarchy in the lab

| Level | Region | Intended reading |
|---|---|---|
| Hero | Experiment progress and next action | The core journey; noticed first. |
| Prominent | Focus session and transport control | Important and tactile, but subordinate to the experiment journey. |
| Standard | Plan, observation, navigation, and experiment lens | Calm, predictable, and scannable support. |

The wider system may retain four semantic importance roles, but this screen should expose only three visibly different levels. No more than two objects should read as dominant at once.

## Shape grammar

The initial grammar to test is:

| Shape | Intended role |
|---|---|
| Circle | Singular icon action, transport control, status mark, or compact focal control. |
| Capsule | Labelled action, selection, filter, or short compact control. |
| Soft rounded rectangle | Field, menu, ordinary surface, or information-rich control. |
| Rounded square or squircle | Widget, tool tile, metric, shortcut, or app-like object. |
| Organic or scalloped shape | One focal mark, special state, celebratory object, or brand moment. |

Shape should make an object easier to understand or remember. Organic silhouettes should be rare enough to retain meaning.

Essential controls keep familiar silhouettes and visible labels. Organic geometry belongs on a metric, status, crop, or identity mark—not on a critical action whose affordance must be immediate.

## Shape as state

A living system can use controlled shape change to preserve continuity:

- A quiet rounded square can broaden into a capsule when selected and labelled.
- A circular action can expand to reveal status text.
- A selected surface can travel between choices rather than disappear and reappear.
- A compact control island can grow when a tool becomes active.

Shape change should clarify state. It should not make stable targets difficult to track.

## Concentric geometry

Nested rounded objects continue to share a visual center. Outer radius, inner radius, border, and gap must be considered as one relationship.

A fixed-size circle or capsule can use fully rounded geometry. A container that can grow vertically should use a fixed resting radius so it becomes a rounded rectangle instead of a stadium.

## Importance scale

Scale should be based on communicative importance, not generic clothing sizes:

- **Standard:** everyday infrastructure and dense workflows.
- **Comfortable:** touch-friendly actions with slightly more presence.
- **Prominent:** the main action or destination within a region.
- **Hero:** a block-level focal object such as a transport control, metric, or major state.

Not every component receives every importance role. Hero belongs primarily to compositions and blocks.

On the Expression Lab screen, standard, prominent, and hero are enough. Comfortable remains available as a system role but does not need to appear simply to demonstrate the scale.

## What makes a control feel substantial

A substantial control combines:

- A larger, stable hit area.
- Deliberate inline breathing room.
- An icon proportioned to the control rather than inherited incidentally.
- A strong but simple silhouette.
- A clear pressed response.
- Enough surrounding whitespace to preserve contrast.

Increasing only the height tends to produce a stretched standard button, not an expressive object.

## Typography

The existing typeface should be tested before introducing another one. Expression can come from:

- Large focal numerals and values.
- Short, weighty action labels.
- Tighter leading at display scale.
- Strong contrast between focal content and supporting metadata.
- Deliberate alignment between icon and text bands.
- Natural-case labels throughout.

A display typeface becomes a separate decision only if scale, weight, proportion, and composition cannot create sufficient character.

## Density and composition

Scale only reads when the composition supports it.

- Focal objects need open space.
- Dense tables and menus should not inherit hero metrics.
- A block should mix one or two substantial objects with quieter supporting controls.
- Repetition of equally large rounded objects removes hierarchy and can make the interface feel toy-like.
- Asymmetry can create energy, but reading order and alignment must stay clear.

## Region plan for the first experiment

### Header

- Keep the application identity and horizon controls quiet.
- Replace the chromatic portrait with initials or a monochrome treatment.
- Use the identity mark as the one candidate for an unusual silhouette.
- Do not let header controls compete with the application task.

### Hero

- Make progress and the next experiment action the primary journey.
- Give the completion metric a strong rounded-square or squircle form.
- Use a substantial labelled capsule for the primary action.
- Integrate progress as a meaningful structural band rather than a hairline utility.
- Reduce competition from greeting copy while preserving its warmth.
- Reserve the darkest, highest-contrast action treatment for one control.

### Focus controller

- Use one large circular play or pause control.
- Keep adjustment actions smaller and circular.
- Treat the timer as prominent display information, not a second hero headline.
- Preserve identical target geometry between play and pause.

### Experiment plan

- Keep rows uniform and restrained for fast scanning.
- Do not give each task a novel shape.
- Communicate checked state with control state, neutral value, and weight rather than shape alone.
- Reduce the group’s aggregate visual mass relative to the hero.

### Observation

- Keep it a quiet working surface.
- Avoid adding another nested container around the field.
- Preserve familiar field and action geometry.

### Experiment lens

- Treat related choices as one compact control island.
- Use one shared container with a clearly differentiated selected item.
- Avoid making every option an independently outlined pill.

## Containment rules

- Keep the five major bento regions because they contain genuinely different tasks.
- Prefer proximity and whitespace within each region before adding another boundary.
- Keep choice-card boundaries because the complete card is the control.
- Do not combine border, shadow, and tonal fill unless each communicates a distinct layer.
- Let one focal tile break the surrounding shape language; keep utility surfaces conventional.

## Implementation boundary

The first implementation is an experiment, not an immediate expansion of every public component API.

- Preserve a reversible Original versus Form comparison within the same theme.
- Scope provisional values to the Expression Lab under deliberately named experimental tokens.
- Componentize local compositions such as the prominent action, focus controller, control island, and stateful mark from existing OneDS primitives.
- Do not build a broad shape library or expose unrestricted `importance × shape × depth × motion` combinations.
- Do not globally change primitive defaults during the first pass.
- Promote a treatment into shared component API only after it succeeds in at least two meaningful contexts.

This follows the phase charter: repetition earns abstraction.

## Implemented workbench — September 2026

The first Theme-native Soft Hardware experiment is now implemented in the Expression Lab as a reversible, session-scoped design instrument.

### Console

The console sits outside the tested application canvas and provides:

- An Original / Form connected button group that switches authored treatments without changing viewport geometry or theme.
- A Clean / Squint / Silhouette connected button group for direct visual evaluation.
- Wide and Compact preview modes.
- Rest, Active, Complete, and derived Custom application states.
- Reset and Hide tools commands, with a persistent recovery control.

Preview size, application state, reset, and hide commands live in one overflow menu so the primary toolbar remains a single row at the application-preview width.

### Authored treatment

The Form treatment is intentionally authored rather than exposed as a style editor. Each region has a fixed semantic recipe composed from:

- Importance: Standard, Prominent, Hero.
- Shape: context-filtered Soft, Square, Capsule, Circle, or Squircle.
- Scale: Standard, Large, Focal stepped stops.
- Density: Compact, Balanced, Spacious.
- Typography: Baseline, Emphasized, Display.
- Containment: None, Boundary, Raised, or Filled.

Scale changes coupled geometry rather than independent pixel values. Region targeting, freeform Tune controls, and invalid role/shape combinations are not exposed in the interface. Future recipe changes are made deliberately in the experiment source and evaluated against Original.

### Architecture

- `src/showcase/experiments/monochrome-form.tsx` owns the experiment provider, two connected comparison groups, utility menu, evaluation tools, fixed regional settings, and composed recipe wrappers.
- `src/showcase/demos/experiments.tsx` keeps the product state and composes the six tested regions.
- Experimental values and selectors live in a dedicated late `experiment` cascade layer in `src/index.css`.
- Every form treatment is gated by `.expression-lab[data-experiment="monochrome-form"]`; design-system defaults remain unchanged.
- Recipe wrappers preserve the underlying component `data-slot` contracts and add separate `data-form-part` roles.
- The shared Slider now forwards single-thumb accessible names and value text, with explicit arrays available for range sliders.

### Default treatment

- Hero: Hero importance, squircle, focal scale, balanced density, display typography, raised containment.
- Focus: Prominent importance, circular focal transport control, balanced density, emphasized typography, filled containment.
- Plan: Standard, compact, uncontained, uniform choice-card rows.
- Observation and Assistant: Standard boundary treatments.
- Control island: Compact capsule grouping with one selected surface.
- The experiment inherits the existing light/dark theme and imagery without color overrides.

### Verified behavior

- Original and Form preserve identical tested viewport dimensions and theme colors.
- Original returns to the existing 32px action and 14px card radius; Form applies the 52px prominent action, 68px transport action, 30px hero radius, and 12px progress track.
- Complete state yields 100% progress, all plan items checked, Focus ready, and Observation saved.
- Compact mode has no horizontal overflow.
- Clean, Squint, and Silhouette activate directly and clean up without a portal or inspector.
- The two connected groups fit the application toolbar without horizontal overflow at the full preview width.
- Dark mode inherits the same semantic theme tokens as Original.

The authored treatment remains provisional. Promotion to shared component APIs still requires a second meaningful application context.

## Scope

- Build one reversible Theme-native Soft Hardware treatment against the existing baseline.
- Validate the core shape grammar in the lab.
- Define the importance roles conceptually.
- Test icon proportion and label padding at expressive scale.
- Test focal typography on the primary journey and one action-oriented object.
- Validate static form before adding new expressive motion.
- Run light, dark, responsive, keyboard, and increased-contrast checks.

## Non-goals

- Giving every component a shape selector.
- Creating a large independent size matrix.
- Replacing the typeface immediately.
- Applying organic clipping to content-heavy surfaces.
- Making every card a widget.
- Treating maximal roundness as the definition of friendliness.
- Adding hue to repair hierarchy.
- Adding new ambient or shape-morph motion in the static-form experiment.
- Replacing familiar labels with icons for novelty.

## Done enough to learn

This chunk is complete when:

- Each accepted shape has a clear role and at least one convincing example.
- Standard, comfortable, prominent, and hero can be distinguished by purpose.
- The lab itself uses no more than three visibly distinct importance levels.
- The prominent action feels intentionally substantial rather than scaled up.
- The primary journey establishes a useful focal-type treatment without a redundant status object.
- Organic shape has a documented usage limit.
- Nested shapes follow the concentric rule.
- Dense UI remains clearly calmer than focal UI.
- The team can identify which form treatments belong to primitives, recipes, and blocks.
- The next action and current progress are understood within a three-second review.
- A squint test reads hero first, Focus second, and supporting regions third.
- The same hierarchy survives the existing theme, dark mode, and responsive stacking.
- Essential controls retain labels, generous targets, visible focus, press feedback, and stable geometry.
- Baseline and experiment can be compared without changing content or behavior.

## Evaluation rubric

1. **Three-second test:** Can someone identify the current progress and next action immediately?
2. **Squint test:** Does the intended hierarchy remain when text and detail disappear?
3. **Silhouette test:** Are circles, capsules, tiles, and content surfaces used consistently by role?
4. **Theme-preservation test:** Is hierarchy created without replacing the established palette or imagery?
5. **Balance test:** Does the asymmetric layout feel energetic but stable?
6. **Containment test:** Can any nested box be removed without losing comprehension?
7. **Target test:** Are primary and touch-oriented actions comfortably acquired?
8. **Keyboard test:** Does focus follow the complete apparent control?
9. **Responsive test:** Do proximity and grouping relationships survive stacking?
10. **Emotional test:** Does the result feel modern, tactile, creative, and friendly without feeling noisy, ornamental, or childish?

The experiment does not propose a new color direction until these checks pass.

## Open decisions

- Whether squircle geometry is important enough to become a foundation.
- Whether selected-state morphing is a signature behavior or an occasional technique.
- Which importance roles need shared names in public APIs.
- Whether prominent controls should be default within certain block contexts or always explicitly chosen.

## Research sources

- [Google Design — Better, Easier, Emotional UX](https://design.google/library/expressive-material-design-google-research)
- [Material 3 — Start building with Material 3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)
- [Material 3 — What does your UI say to your users?](https://m3.material.io/blog/testing-material-3)
- [Material 3 — Buttons](https://m3.material.io/components/buttons/overview)
- [Material 3 — Button groups](https://m3.material.io/components/button-groups/overview)
- [Material 3 — Typography](https://m3.material.io/styles/typography/overview)
- [Material 3 — Motion physics system](https://m3.material.io/styles/motion/overview)
- [Nielsen Norman Group — Visual hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)
- [Nielsen Norman Group — Five principles of visual design](https://www.nngroup.com/articles/principles-visual-design/)
- [Nielsen Norman Group — Proximity principle](https://www.nngroup.com/articles/gestalt-proximity/)
- [Nielsen Norman Group — Common region](https://www.nngroup.com/articles/common-region/)
- [Nielsen Norman Group — Touch targets](https://www.nngroup.com/articles/touch-target-size/)
- [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
