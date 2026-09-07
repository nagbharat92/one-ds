# Product brief review

Reviewed 2026-09-07 against the current expressive-design discussion. These documents preserve design intent, not proof that a treatment has been approved or successfully implemented.

## Current direction

- Keep the shadcn behavioral foundation while exploring a deliberately authored Expressive style.
- Compare stable Original and Expressive treatments. Concentric is a geometry experiment, not a universal application-scale algorithm.
- Work through component families in representative compositions. Specify anatomy, proportions, insets, text roles, states, and responsive behavior before extracting shared rules.
- Evaluate visual coherence separately from functional tests and token measurements. Passing those tests does not establish design approval.
- No replacement Material library, final palette, or global rollout has been approved.

## Retained documents

| Document | Use | Caveat |
| --- | --- | --- |
| [Expressive system charter](oneds-phase-2-expressive-system-prd.md) | Intent, hierarchy, accessibility, and promotion guardrails | Palette and sequencing are hypotheses; primitive expressiveness is not limited to the original rollout order. |
| [Expression lab](oneds-phase-2a-expression-lab-prd.md) | Controlled comparisons and visual evaluation questions | The lab exists. Its old audit and fixed-bento requirements are historical, not a mandate to preserve a failing composition. |
| [Form language](oneds-phase-2c-form-language-prd.md) | Component anatomy, shape roles, research links, and evaluation rubric | Implementation inventory and reported results describe an earlier prototype. Do not recreate its removed wrappers or treat it as approved. |
| [Color harmonies](oneds-phase-2b-color-harmonies-prd.md) | Semantic color relationships and accessibility checks | Deferred. Warm neutrals and violet/coral are unapproved candidates, not the brand direction. |
| [Motion character](oneds-phase-2d-motion-character-prd.md) | Response, continuity, interruption, and reduced-motion requirements | Reference for a later pass; not permission to add animation now. |
| [Component recipes](oneds-phase-2e-component-recipes-prd.md) | Deciding component versus composition ownership; avoiding variant explosion | Useful now as an extraction guide. A complete color and motion system is not a prerequisite for testing an action or selection family. |
| [AI chat pilot](oneds-phase-2f-ai-chat-pilot-prd.md) | Workflow-specific states, composer behavior, and reading comfort | Deferred validation context; not an instruction to redesign chat now. |
| [Adoption and governance](oneds-phase-2g-adoption-governance-prd.md) | Promotion/retirement criteria and distinguishing visual from mechanical quality | Deferred rollout policy. The default-versus-opt-in choice remains provisional. |
| [Sidebar design](oneds-sidebar-design.md) | Region ownership, navigation versus collections, shell states, and accessibility | Historical architecture reference. Its proposed inventory is not the current API or an approved backlog. |

## Removed

`oneds-phase-1-prd.md`: obsolete bootstrap instructions for an empty repository. The running React/Vite/shadcn showcase and the root README replace its operational purpose. The document remains recoverable in Git history.

## Before implementation

Use the retained briefs for relevant requirements and research, but reconcile them with current user decisions and code. Revisit specific contradictions when their component family is selected; do not execute the old seven-workstream plan wholesale. Original/Expressive visual comparison, representative content, keyboard behavior, and narrow layouts must all inform approval.