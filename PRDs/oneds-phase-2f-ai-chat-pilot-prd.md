# OneDS phase 2f — expressive AI chat pilot

Status: working product brief, not an implementation specification.

Parent intent: [Phase 2 expressive system charter](oneds-phase-2-expressive-system-prd.md).

Depends on: the first accepted [Component recipes](oneds-phase-2e-component-recipes-prd.md).

## Goal

Apply the emerging expressive language to the existing AI chat block and determine whether it improves a real workflow rather than only isolated showcase objects.

The chat pilot should feel recognizably playful and alive while preserving the calm, readable transcript and dependable composer behavior.

## Product hypothesis

Expression should follow the energy of the task:

- Empty chat can be welcoming and exploratory.
- Choosing a suggestion can feel decisive.
- Composing and tool activation can feel tactile.
- Sending and streaming can visibly become active.
- Reading a settled conversation should become calm again.

The block should not remain at maximum expression throughout the entire session.

## Expression map

### Calm regions

- Message text and long-form reading.
- Conversation metadata.
- Secondary sidebar structure.
- Menus and utility actions.
- Dense history lists outside the selected item.

### Moderate regions

- Selected conversation surface.
- Active composer tools.
- Search and navigation state.
- Feedback actions after a response.

### Strong regions

- Empty-state greeting or mark.
- Suggested next actions.
- Primary send or stop control.
- The currently active assistant state.

The complete block can carry strong expression, but only a few elements should carry it at the same moment.

## State narrative

### Empty

The block can introduce the signature harmony, a memorable mark, and a small set of spacious suggestion tiles. This is the most expressive resting state because there is little content competing for attention.

### Exploring

Hovering or selecting a suggestion should reveal hierarchy through shape, tonal change, and tactile response. The remaining suggestions stay quieter.

### Composing

The composer becomes the focal object. Active tools may join into a small control island or expand within the composer without causing layout jitter.

### Submitting

The send action should transform clearly into the relevant in-progress or stop state. The transition should preserve object identity rather than swapping unrelated controls abruptly.

### Streaming

A stateful mark or restrained progress behavior can indicate activity. The transcript itself remains stable and readable.

### Settled

Once the response is complete, ambient activity stops and the expressive emphasis recedes. The content becomes the focus again.

## Color approach

The block should choose one dominant harmony, most likely the signature family. A supporting or spark family may appear in one high-value moment, such as a primary suggestion or active state.

The chat must not assign a different decorative hue to every conversation, tool, suggestion, and message unless color carries real product meaning.

## Shape approach

Candidate uses include:

- A rounded-square or organic empty-state mark.
- Tonal suggestion tiles.
- A substantial circular send/stop action.
- A moving selected surface in history or tools.
- A composer that transforms as one concentric object when it gains attachments or tools.

Message bubbles and transcript containers should not become shape experiments at the cost of reading comfort.

## Motion approach

- Keep the existing content travel and streaming behavior coherent with the new motion character.
- Add tactile response to suggestions and primary controls.
- Use shared-surface travel for selection where appropriate.
- Stop repeating movement when streaming stops.
- Keep reduced-motion behavior functionally complete.
- Avoid simultaneous animation in the sidebar, transcript, composer, and header.

## Scope

- Apply the first accepted harmony and recipes to the existing block.
- Address the empty, composing, submitting, streaming, and settled states.
- Keep current chat capabilities intact.
- Compare the expressive block against the current neutral baseline.
- Validate both themes and reduced motion.

## Non-goals

- Redesigning the chat information architecture.
- Rewriting conversation behavior.
- Adding decorative avatars to every assistant response.
- Coloring every message bubble.
- Making history navigation as expressive as the main task.
- Treating the pilot as approval to globally change all component defaults.

## Done enough to learn

This chunk is complete when:

- The block has a clear visual-energy arc from empty to active to settled.
- The transcript remains the calmest major content region.
- The dominant action and active system state are immediately understandable.
- At least two expressive recipes work in a real workflow.
- No more than a small number of elements compete as focal objects at once.
- Existing keyboard, focus, responsive, streaming, and history behavior remains intact.
- Light, dark, and reduced-motion experiences preserve the same hierarchy.
- A comparison can identify which changes should become shared system patterns and which should remain chat-specific.

## Open decisions

- Whether the empty-state mark is a reusable stateful mark or unique to chat.
- Whether suggestion tiles deserve a shared recipe.
- Whether an expressive block context should automatically retone compatible primitives.
- How much personality belongs in the selected history item versus the composer.
- Whether streaming expression should live in the assistant mark, the send/stop control, or both.
