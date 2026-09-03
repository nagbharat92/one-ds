# OneDS phase 2g — adoption and governance

Status: working product brief, not an implementation specification.

Parent intent: [Phase 2 expressive system charter](oneds-phase-2-expressive-system-prd.md).

Depends on: findings from the [AI chat pilot](oneds-phase-2f-ai-chat-pilot-prd.md).

## Goal

Turn successful experiments into a durable system while preventing expressive options from becoming visual entropy.

This is not a library-wide reskin. It is the point where OneDS decides what becomes foundational, what remains an opt-in recipe, and what was only useful inside one block.

## Adoption thesis

Roll expression outward from proven compositions:

1. Application blocks and feature moments.
2. Strong expressive recipes.
3. Moderate interactive primitives where the behavior genuinely repeats.
4. Quiet infrastructure only when a clear product need exists.

The rollout should move from high-context to low-context, not from the component directory alphabetically.

## Expression inventory

Classify major system areas by their intended energy:

- **Quiet:** reading, forms, tables, menus, utility dialogs.
- **Moderate:** navigation, tabs, toggles, sliders, ordinary actions.
- **Strong:** feature cards, empty states, metrics, primary destinations, media controls.
- **Maximum:** a block’s singular hero moment or active system state.

This inventory is a design constraint. A quiet area may still use excellent shape and motion; it simply should not compete for attention.

## Promotion review

For every experimental treatment, decide:

### Promote to foundation

Use when the relationship applies broadly and should be centrally tokenized, such as a harmony role, importance role, or motion behavior.

### Promote to recipe

Use when multiple ingredients form a repeatable compositional role, such as a prominent action or control island.

### Keep block-specific

Use when meaning depends on the chat workflow or another particular application context.

### Retire

Use when the treatment is decorative, inaccessible, difficult to compose, visually generic, or unsupported by a second use case.

Retiring an experiment is a successful outcome when it prevents weak ideas from becoming permanent API.

## Default policy

The initial policy should favor **opt-in expression with calm defaults**.

A treatment should become a new default only when:

- It improves the component in both quiet and expressive contexts.
- It does not reduce density, clarity, or compatibility.
- It has been validated in more than one block or workflow.
- It works in both themes and all relevant states.

Block and recipe contexts may provide stronger inherited styling, but inheritance must remain predictable and should not silently alter semantics.

## Documentation needs

The system should explain:

- The phase 2 north star and Soft electric thesis.
- The accepted harmonies and how a region chooses one.
- The shape grammar and importance roles.
- The motion families and stillness rules.
- The expression budget for common component categories.
- Each recipe’s intended and discouraged uses.
- Examples of calm infrastructure inside expressive blocks.
- Rejected patterns and why they were rejected.

Documentation should teach composition decisions, not merely enumerate props.

## Quality checks

Adoption should preserve:

- Keyboard behavior and logical focus order.
- Visible focus in every accepted harmony.
- Text, icon, and meaningful non-text contrast.
- Reduced-motion equivalence.
- Stable layout during state transformation.
- Clear status semantics.
- Light and dark hierarchy.
- Token ownership and centralized adjustment.
- Concentric nested geometry.
- Natural-case typography.

Visual review should also ask whether a result feels coherent, ownable, and appropriately restrained. Mechanical validity alone is not enough.

## Scope

- Review all lab and pilot treatments.
- Establish the expression inventory.
- Promote, localize, or retire each treatment.
- Define the initial default-versus-opt-in policy.
- Document accepted recipes and foundations.
- Select the next one or two blocks for adoption.

## Non-goals

- Applying expression to every component in one sweep.
- Preserving every experiment for backward compatibility.
- Measuring system maturity by number of variants.
- Allowing product teams to bypass harmony and importance roles with arbitrary values.
- Freezing the expressive language before it has appeared in multiple blocks.

## Done enough to learn

This chunk is complete when:

- Every pilot treatment has a promotion, local, or retire decision.
- Major component categories have an expression budget.
- Calm defaults and opt-in expressive recipes have a clear relationship.
- Accepted foundations and recipes are documented by intent.
- The next adoption blocks are chosen for distinct learning value.
- No accepted API exposes an unnecessary combinatorial matrix.
- The original phase 2 intent can still be traced from the charter through the implemented block.

## Open decisions

- When an expressive context may safely retone descendant components.
- Which treatments should eventually become OneDS defaults.
- How products can introduce their own harmony without breaking the shared grammar.
- Whether expression budgets need enforceable tooling or remain review guidance.
- Which block should follow chat to test a different information density and interaction model.
