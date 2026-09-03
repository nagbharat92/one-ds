# OneDS phase 2b — expressive color harmonies

Status: working product brief, not an implementation specification.

Parent intent: [Phase 2 expressive system charter](oneds-phase-2-expressive-system-prd.md).

Depends on: an approved [Monochrome Form Language](oneds-phase-2c-form-language-prd.md) and the first [Motion Character](oneds-phase-2d-motion-character-prd.md) findings.

## Goal

Turn the strongest lab color direction into a small set of curated harmonies that can color an entire UI region coherently.

The goal is not a larger swatch collection. It is a reliable relationship between grounds, containers, foregrounds, interactions, and neighboring accent families.

Color enters only after the same application has established a clear hierarchy through monochrome form and motion. It may reinforce that hierarchy; it may not repair or replace it.

## Starting hypothesis

The warm neutral ground remains OneDS’s stabilizing canvas. Expressive color is introduced through three roles:

- **Signature:** likely violet or plum; the most recognizable OneDS family.
- **Supporting:** likely coral or rose; a warmer counterpoint.
- **Spark:** one high-energy family such as lime, mint, yellow, or sky; used sparingly.

The exact hues remain open until the lab comparison is complete.

The approved Monochrome Soft Hardware treatment is the control. Layout, content, semantic roles, shape grammar, target geometry, and motion remain fixed while harmony changes. If adding color reverses the established reading order, the harmony is unsuccessful.

## Color model

Each expressive family should be able to provide a coherent set of roles:

- Strong fill.
- Foreground on the strong fill.
- Soft tonal container.
- Foreground on the tonal container.
- Optional boundary or focus-adjacent treatment.
- Hover, pressed, selected, and disabled behavior where interaction requires it.

These are semantic relationships. Consumers should ask for a role within a harmony rather than reach directly for an arbitrary swatch.

## Harmony over isolated color

A block or region should choose a dominant harmony. Descendants then use coordinated roles from that context.

This is preferable to giving every primitive an unrestricted color prop because it:

- Keeps neighboring objects related.
- Allows a complete theme adjustment from one place.
- Makes light and dark treatments intentional.
- Prevents the interface from becoming a rainbow of equally important controls.

Individual components may still need explicit emphasis, but region-level color should be the primary design tool.

## Candidate pairing recipes

The lab should help select a small number of combinations, such as:

- Signature strong fill on a pale signature container.
- Deep plum with a violet container.
- Violet with a small lime or mint spark.
- Coral with a restrained sky counterpoint.
- Near-black with a warm yellow focal object.

A composition normally gets one dominant family and, at most, one spark. More families require a clear data or semantic reason.

## Semantic boundaries

Decorative expression and product meaning must not collapse into one another.

- Error and destructive colors remain reserved for danger.
- Warning, success, and presence retain their own meanings.
- The signature family must not accidentally imply selection in every context.
- A spark color cannot become a second primary action color simply because it is visually exciting.
- Data visualization colors remain distinguishable from interface emphasis roles.

## Light and dark themes

Dark mode should preserve the same emotional relationship, not mechanically invert every light value.

Questions to resolve include:

- Does the warm ground remain perceptibly warm in dark mode?
- Are expressive containers luminous enough to feel alive without glowing?
- Should the signature strong fill become lighter, more chromatic, or both?
- Which spark families remain comfortable against a dark canvas?
- Can the same hierarchy be read without relying on shadow?

## Accessibility expectations

Every accepted harmony should be checked for:

- Text and icon contrast on strong and soft fills.
- Non-text contrast for meaningful boundaries and controls.
- Focus visibility.
- Interaction-state differentiation that does not rely on color alone.
- Legibility in both themes.
- Reasonable behavior under increased contrast and forced-colors modes.

Accessibility checks determine whether a pairing is usable; they do not, by themselves, determine whether it is expressive or coherent.

## Scope

- Formalize only the harmonies that survived the lab.
- Establish role relationships and interaction behavior.
- Apply them to the representative lab objects.
- Test one region-level color context.
- Record light and dark intent.

## Non-goals

- Allowing any component to take any palette color.
- Recoloring every existing component.
- Replacing semantic status families.
- Finalizing a complete data-visualization palette.
- Solving brand illustration or marketing art direction.
- Using saturation to rescue an action or state that was unclear in monochrome.
- Changing shape, size, typography, and color simultaneously during comparison.

## Done enough to learn

This chunk is complete when:

- One signature, one supporting, and one spark candidate have clear roles.
- At least two approved harmony recipes work across the representative objects.
- Strong, soft, on-color, and interaction relationships are defined conceptually.
- Light and dark versions preserve hierarchy and mood.
- Status colors remain semantically separate.
- The system can color a whole region without per-child arbitrary color choices.
- Rejected combinations and the reasons for rejecting them are recorded.

## Open decisions

- Whether expressive contexts should be named by role, mood, or family.
- Whether the default signature is deep plum, vivid violet, or a relationship between both.
- Which spark family is distinctive enough to keep.
- Whether a supporting family is always available or only used by particular blocks.
- Which neutral ink should accompany each harmony without creating excessive token duplication.
