# OneDS phase 2d — motion character

Status: working product brief, not an implementation specification.

Parent intent: [Phase 2 expressive system charter](oneds-phase-2-expressive-system-prd.md).

Depends on: [Expression lab](oneds-phase-2a-expression-lab-prd.md) and [Form language](oneds-phase-2c-form-language-prd.md).

## Goal

Give OneDS a recognizable physical character through responsive, stateful motion while keeping idle interfaces calm.

The desired feeling is alive, not busy: objects respond to touch, selections maintain continuity, and active system states visibly breathe.

The first motion pass remains monochrome. Color is deliberately withheld so response, continuity, mass, interruption, and state clarity can be judged without a second attention signal.

## Motion thesis

Motion should communicate one of four things:

- **Response:** the system received an action.
- **Continuity:** the same object moved or changed state.
- **Hierarchy:** attention should move to a newly important object.
- **Activity:** the system is currently working, listening, streaming, or progressing.

If a motion does none of these, it is likely decorative noise.

## Motion families

### Tactile response

Buttons and tiles can compress slightly, deepen in color, or shift internal content on press. Feedback should begin immediately and settle cleanly.

The control must not move far enough to make the pointer target feel unstable.

### Selection travel

Tabs, segmented choices, navigation states, and tool selectors should prefer one shared surface that travels between destinations. This preserves object permanence and creates a calmer, more physical transition than crossfading separate backgrounds.

Travel should feel speed-based rather than assigning the same time to every distance.

### Transformation

A control can expand, contract, or change shape when its role changes—for example, when a composer gains tools or an icon action reveals a label.

The container and its contents should transform as one object. Avoid a sequence where content disappears, layout jumps, and a new surface then fades in.

### Arrival

Related content may enter in a short coordinated sequence when a block first appears or changes mode. Arrival establishes reading order; it should not replay constantly during ordinary navigation.

### Active-state motion

Listening, recording, streaming, loading, and live presence may use repeating motion because the state itself is ongoing. The motion should stop when the state stops.

Idle decorative pulsing is outside the initial direction.

## Mass and scale

Motion should imply mass:

- Small icons respond quickly.
- Compact controls glide briskly.
- Large surfaces move more deliberately.
- Long-distance travel takes longer than short-distance travel while preserving a similar perceived speed.
- Entrances decelerate into place; exits may leave more directly.

Large objects should not dart. Small controls should not feel sluggish.

## Token model

OneDS already uses speed and easing tokens. This work should extend that model rather than introduce raw times at call sites.

- Choose tokens by how a change should read.
- Reuse a small easing family for related behaviors.
- Create component aliases only when they express durable intent.
- Keep intent delays separate from transition speed.
- Avoid per-component one-off curves that cannot be recognized elsewhere.

## Material research and Button pilot (September 7, 2026)

### Current guidance, not legacy defaults

Material's [motion physics overview](https://m3.material.io/styles/motion/overview/how-it-works)
introduces the spring-based M3 Expressive system (May 2025). Its spatial springs
apply to position, rotation, size, and rounded corners; effects springs apply to
color and opacity and must not overshoot. Both families have fast, default, and
slow speeds. Buttons and switches use fast; partial-screen surfaces use default;
full-screen changes use slow. Expressive is bouncier; Standard has minimal bounce.
Native springs use stiffness, damping, and initial velocity, and support continuous
retargeting. A longer duration alone does not create a spring.

The requested [easing and duration guidance](https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration)
now explicitly labels that system as legacy and no longer maintained for
Expressive components. Its 500ms emphasized in-place, 400ms enter, and 200ms exit
defaults describe transitions, not a blanket button feedback recipe. Older
standard curves remain useful fallbacks, not a substitute for expressive springs.

The [transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns)
still use legacy easing/duration pending migration to physics. Container transform
communicates a persistent object's expansion; forward/backward communicates
hierarchy; lateral communicates peers; top-level uses fade-through for unrelated
destinations; enter/exit explains origin; skeletons stabilize loading. These
patterns should be chosen by meaning when those components are migrated, not
attached to ordinary Button clicks.

### Exact published web conversion

Material's [cross-platform specs](https://m3.material.io/styles/motion/overview/specs)
recommend springs when available, or approximating curves for animations without
gesture or interruption requirements. The published Expressive conversions are:

| Role | Cubic-bezier | Speed value | Pilot adoption |
| --- | --- | --- | --- |
| Fast spatial | (0.42, 1.67, 0.21, 0.90) | 350ms | Button push; reserved shape morph |
| Default spatial | (0.38, 1.21, 0.22, 1.00) | 500ms | Deferred |
| Slow spatial | (0.39, 1.29, 0.35, 0.98) | 650ms | Deferred |
| Fast effects | (0.31, 0.94, 0.34, 1.00) | 150ms | Button colors and opacity |
| Default effects | (0.34, 0.80, 0.34, 1.00) | 200ms | Deferred |
| Slow effects | (0.34, 0.88, 0.34, 1.00) | 300ms | Deferred |

Only the two consumed roles are implemented. Their values live in `src/index.css`
as `--motion-spatial-fast-speed/curve` and `--motion-effects-fast-speed/curve`.
Button references them through `--button-spatial-speed/curve` and
`--button-effects-speed/curve`. Existing speed/ease tokens remain unchanged for
other families. To tune the pilot, change these tokens, not page classes or event
timers. This is the official Expressive curve, not a custom "gentle" spring preset.

### What Button does

**Latest user decision:** reserve corner morphing for future compositions. Default
feedback is now a poppy push: `--button-press-distance` is 2px downward and
`--button-press-scale` is 0.97, with a spring-like return using the same spatial
curve. Corners and layout dimensions remain unchanged. Transformed visual and
hit-tested bounds move slightly; this is not a claim of a fixed hit box. Joined
groups and links remain effects-only. Reduced motion removes the push.

The [Button specs](https://m3.material.io/components/buttons/specs) describe
pressed shape morphing: round and square variants approach the same pressed
shape for a size. OneDS keeps its approved resting geometry and uses 8px pressed
corners for 40px controls and 12px for 56px controls. These size mappings follow
Material's small/medium pressed-corner values but are an adaptation to OneDS's
two-tier sizing. This implementation and its tokens are retained behind
`data-press-effect="morph"`, never applied by default or combined with the push.

- The shared Button owns the transitions, including icon, favicon, spinner,
	and `asChild` cases. The Motion canvas is a working consumer, not a local animation.
- Replaces `transition-all` and the former generic 1px nudge with a tokenized
	push/compression. There is no layout shift, ambient bounce, or hover enlargement.
- Push (or explicitly opted-in shape) uses the spatial curve in both directions; state colors
	and opacity use the bounded effects curve. Focus ring appearance stays immediate.
- Rounded Buttons use a finite resting radius equal to half their tier height,
	avoiding interpolation from an effectively infinite pill radius.
- Joined ButtonGroups retain their corner geometry and get effects only. Link
	Buttons have effects only. FAB and sidebar-trigger motion is not migrated.
- Disabled controls cannot trigger spatial feedback. Reduced motion removes
	both push and morph; existing timing keeps color feedback near-instant.
- CSS uses native `:active`; actions fire on the native event, never after an
	animation finishes. A quick re-press retargets from the current visual state
	without a JS queue, but CSS easing does not preserve spring velocity.

### Deliberate limits and next decision

This is a spring-shaped CSS pilot, not a physical spring simulation. It cannot
carry velocity through interruptions like Compose's springs, and browser radius
clamping can reduce the visible overshoot near a full pill. If gesture-following,
velocity continuity, or a custom damping/stiffness editor becomes necessary, use
an established spring engine and preserve the same spatial/effects role split.
Do not invent unused physics tokens that the renderer does not consume.

The focused browser tests sample the actual CSS transition, prove spatial
overshoot, check fixed layout dimensions, rapid presses, keyboard/touch behavior, joined
corners, token overrides, and reduced-motion behavior. Later adoption in other
components requires its own role mapping and approval; it is not a global reskin.

## Choreography principles

- Prefer simultaneous container-and-content change over staged disappearance and reflow.
- Let one prominent object move at a time within a small region.
- Preserve stable text and reading surfaces when a nearby control animates.
- Use opacity as support, not as a substitute for spatial continuity.
- Keep state changes interruptible; rapid input should not queue a long animation sequence.
- Avoid layout measurement when a robust declarative transformation can express the same behavior.

## Reduced motion

Reduced-motion treatment should preserve state clarity while removing unnecessary travel, scale, and repeating activity.

A reduced-motion user should still receive:

- Immediate pressed-state confirmation.
- A clear selected destination.
- Visible active or loading status.
- No loss of content or focus context.

## Scope

- Define the small motion family above.
- Apply it to representative lab objects.
- Test tactile press, selection travel, one transformation, and one active state.
- Compare small-control and large-surface motion character.
- Validate interruption and reduced-motion behavior.
- Preserve the approved monochrome hierarchy while motion is introduced.

## Non-goals

- Animating every state change.
- Adding ambient movement to resting pages.
- Physics simulation for its own sake.
- A unique curve for every component.
- Long cinematic transitions between application screens.
- Motion that delays access to content or controls.
- Introducing the expressive color harmonies during the first motion comparison.

## Done enough to learn

This chunk is complete when:

- The lab demonstrates a coherent response, travel, transformation, arrival, and active-state vocabulary.
- Large and small objects feel appropriately different in mass.
- Selection movement preserves constant perceived speed across distance.
- Pressed feedback feels physical without destabilizing the target.
- Active motion stops with the active state.
- Reduced-motion behavior remains clear and complete.
- No accepted behavior depends on scattered raw timing values.
- The team can name where motion adds meaning and where stillness is preferable.

## Open decisions

- Whether state-driven shape morphing becomes a signature OneDS behavior.
- How much overshoot, if any, belongs in the motion character.
- Whether block entrances should be part of the system or remain product-specific.
- Which components need speed derived from travel distance rather than a fixed transition token.
