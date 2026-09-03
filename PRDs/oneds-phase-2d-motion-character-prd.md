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
