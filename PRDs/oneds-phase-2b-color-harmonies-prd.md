# OneDS phase 2b — expressive color harmonies

Status: working product brief, not an implementation specification.

## Approved foundation: September 7, 2026

### Material comparison (latest)

Selected treatment adopted September 8: Material destructive is now the sole
Destructive background palette, using Error40/Error80 with the existing light
tint ramp. The old option and duplicate comparison are removed; text stays put.
Button gains a controlled selected state (`selected`, caller-managed onClick,
aria-pressed). Following https://m3.material.io/components/buttons/specs, the
square-start configuration becomes round when selected:12->20px for40px,
16->28px for56px. Primary selection switches Surface container to Primary;
Secondary switches Secondary container to Secondary. Existing geometry and
press behavior remain for ordinary Buttons. Tests verify pointer/keyboard
toggle, disabled state, fixed dimensions, paired colors,350ms spatial radius
transition, and reduced motion on desktop/mobile in both modes.

Current experiment: user requests **Primary/Secondary** names and a separate
Material destructive comparison alongside the original, not a replacement.
Button exposes optional `destructivePalette="material"` only affecting
destructive backgrounds. It uses baseline Error40/Error80 at the same existing
light10/20/30% and dark20/30/40% opacity ramp. Text/focus colors are unchanged.
The main Button showcase shows both palettes at both sizes; all old destructive
consumers keep their default. The Material alternative remains a candidate.

Destructive correction: user rejected the solid Error fill and requested its
previous light backgrounds. Restored translucent destructive tint via named
Button opacity tokens: light10/20/30%, dark20/30/40% for rest/hover/press.
Filled baseline P40/P80, Tonal, and text colors remain unchanged. This supersedes
the Destructive Error background decision below.

Latest background-only correction: user requested quieter P40 and Material Error
backgrounds, explicitly deferring text colors. Filled now consumes the published
Material Web v0.192 reference primary40/primary80 (#6750a4/#d0bcff);
Destructive consumes error40/error80 (#b3261e/#f2b8b5). Existing text/focus colors
are untouched; destructive foreground contrast is pending, not certified.
The old website primary #6442d6 is tone40.3/chroma69.9 whereas baseline #6750a4
is tone40.1/chroma47.9: the visual mismatch was saturation, not the tone number.
Tonal and all unrelated palettes remain unchanged. Sources:
https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-ref-palette.scss
and https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-color.scss.

September 8 Button decision: default buttons are now purple **Filled** using
Primary/On primary in both appearances and all filled interaction states.
Secondary remains lilac **Tonal**, using Secondary container/On secondary
container. Public default/secondary APIs are unchanged; the showcase names the
roles Filled/Tonal. Pink is reserved for future selective FAB treatment, which
is deferred. This supersedes the earlier pink main-action mapping below.
Other variants, sizing, corners, and motion stay unchanged.

Global surface rollout: user now explicitly approved all neutral surface colors
across the site and components. The shared website neutral roles are published
at :root/.dark and existing OneDS surface aliases point to them. Pages, canvases,
cards, footer bands, controls, fields, menus, and portals consume that foundation.
MaterialTheme no longer writes inline neutral copies, so the source token is
shared with unwrapped components. Action accent palettes remain scoped separately;
shadow geometry and semantic status palettes are unchanged.

Removed superseded default neutral definitions and migrated the legacy
dark input-border background blends. Fields share fill, disabled, hover, and
pressed tokens; native popup options use Popover roles; slider thumbs use Lowest;
checkbox indicators use Control; existing black10% scrims use --overlay-scrim.
Live propagation tests change one source token and verify multiple components,
global backgrounds, themed diagrams, and body-portaled dialogs in both modes
and viewports. The [foundation ledger](../src/design-system/material-foundation.md)
records the global neutral migration and remaining accent/shadow boundaries.

The user approved the next phase: sourced reusable foundations followed by
consumer-by-consumer site adoption. See the [foundation and migration ledger](../src/design-system/material-foundation.md)
for authoritative Material resources, explicit adapter choices, and current
coverage. MaterialTheme selects the fixed website foundation; MaterialSurface
exposes six supported surface roles and two foreground roles. Canonical state
opacity tokens use Material's published 0.08/0.10/0.10/0.16 values, with existing
percentage tokens retained as aliases. No new palette or elevation algorithm.

Site navigation is the first migrated site consumer, including its mobile
Drawer; the Colors application consumes the same component. Remaining content
chrome, floating reopen control, and component previews keep existing defaults.
Root colors and shadow elevation are unchanged. Browser tests compare an
unmigrated Button specimen's tokens and shadows to the root baseline, and cover
selection, search/routing, desktop collapse/reopen, and mobile navigation in
both appearance modes. Earlier experiment-only scope below is superseded only
for these explicitly adopted consumers.

Search-button correction: the user clarified that the primary-action reference
is the pastel pink search control at the top left, not the website palette's
purple Primary role. Direct inspection at
https://m3.material.io/styles/color/resources confirmed `.section-fab` uses
Tertiary container for fill and On surface variant for resting foreground:
light #f1d3f9 / #4d4256, dark #553f5d / #cbc4cc. The site changes its foreground
to On tertiary container on hover; OneDS retains its existing state-layer and
motion behavior rather than copying the entire FAB interaction.

Website theme primary-action Button aliases now use that exact resting pair.
Canonical Primary remains purple; role names are not falsified to compensate
for choosing the wrong component mapping. Supporting buttons, selected tabs,
surfaces, and other theme variants are unchanged. Monochrome favicons use dark
ink on the pale light-mode action and light ink in dark mode. Focused tests
verify labelled/icon actions in both modes and the reference pair's contrast.

Current scope: the user explicitly requested working only on the Material
website version and using Material color vocabulary. Colors now has one
Material website example; generated/current choices, hue/contrast controls,
Accent buttons opt-out, and unrelated legacy color galleries are removed from
this demo. Retained generator APIs are not deleted or changed.

The inspector uses Surface, Surface container lowest/low/container/high/highest,
On surface, On surface variant, Primary/Secondary/Tertiary, container roles,
and paired on-colors. It shows six surface rows plus accent families and actual
canonical token names. Selected tabs now use Secondary container and On
secondary container, with Surface container low for the track, correcting the
previous neutral selected backplate. This mapping is scoped to website themes.

Keep the verified website palette distinct from the supplied stock scheme tone
diagrams. The diagrams establish role vocabulary and light/dark pairing; they
do not silently replace the website's custom values. Use explicit surface roles,
not the older 5/8/11/12/14% primary elevation overlays on top. Shadows remain
independent. Missing website roles remain unspecified, not guessed from images.
Six desktop/mobile browser cases verify surface/accent paints, tab selection,
role labels and bounds, menus/mobile navigation, and workflow state across modes.

#### Earlier default comparison

The latest reference request supersedes the generated default described below.
Colors now starts/resets to a named **Material website** preset. The user asked
for the screenshot theme as default and an explanation of its relationships;
global-versus-preview scope could not be confirmed, so adoption remains confined
to Colors. Generated Material and Current remain available via a shared Select.

Live source inspection found explicitly authored `--mio-theme-color-*` values
on `mio-root` and `mio-root.dark-mode`, not a stock scheme output. Primary is
purple (#6442d6 light / #9f86ff dark); selection uses secondary container
(#dcdaf5 / #45455a); tertiary container is pink-lilac (#f1d3f9 / #553f5d).
Background is #fefbff / #141314; navigation surface-2 is #f2ecee / #211f21.
HCT hues around 295/284/319 form a related analogous palette. Primary chroma
about 70 contrasts with secondary 17, tertiary container 24, and neutral surface
chroma 2. Tone and paired foregrounds change by mode; this is not inversion.
The static pale illustration is an image and does not participate in theme switching.

Verified values live in index.css --theme-website-*; readMaterialWebsiteTheme
exports 25 roles with no generated fallback. Background maps to surface and
surface-0..4 map to lowest..highest containers. Outline-variant uses the website's
surface-variant as an explicit OneDS adapter choice. Missing strong tertiary,
fixed roles, and semantic error roles are not fabricated. The inspector marks
missing pairs and omits absent tokens; the generated option retains all 49 roles.
Website mode disables seed/scheme/contrast controls; Accent buttons remains live.
Node checks cover exact values and paired contrast. Desktop/mobile browser checks
cover both modes, exact paints, white/Lowest cards, bounds, menus, opt-out, reset,
preserved notes, and removal of stale generated roles on returning to the preset.

Evidence: https://m3.material.io/components/button-groups/overview and
https://m3.material.io/static/angular/styles.4c2805e602edc472.css, inspected September 7, 2026.

Latest revision: user requested direct adoption of Material's documented APIs
instead of incremental custom color rules. The experiment now calls the pinned
Color Utilities 0.3.0 SchemeTonalSpot, SchemeVibrant, and SchemeExpressive
constructors with source HCT, light/dark mode, and contrast 0, 0.5, or 1.
MaterialDynamicColors resolves all 49 system roles to canonical Material Web
`--md-sys-color-*` variables. Palette key colors are not system roles.

Primary, secondary, tertiary, neutral, neutral-variant, and error palettes are
generated together. The manual second-color Off/Auto/Custom API and tertiary
override are removed. Scheme and Contrast use shared Selects. A reusable
MaterialColorRoles inspector shows strong/container foreground pairs for all
four accent/error families plus the full token table.

The user subsequently requested replacing the small card specimen with all of
Expression Lab's preview UI. Colors imports the shared ExpressionLabPreview,
not a copied composition: inset Sidebar, header, focus session, checklist,
observation form, lens controls, and assistant chat. It uses baseline form
geometry in an application-height canvas with its own scrolling. Color controls
and the full role inspector remain outside that application. Theme changes
preserve lab state; Quick actions > Reset lab resets it independently. Existing
dropdowns and the expressive category Select carry ColorThemePortal, while the
Sidebar retains its own mobile bridge. The shared header wraps and Focus card
retains its minimum width on narrow screens. The original lab remains available.

OneDS's adapter uses Primary/On primary for primary actions and Secondary
container/On secondary container for secondary actions and navigation selection.
The distinct Material Secondary role is exported without renaming it. Cards use
Lowest in both modes (white light cards), footer Low, field Highest. Accent
buttons can still opt out to neutral. Existing geometry, motion, and native
interactions remain unchanged; only Colors opts into the mapping.

Initial/reset: Material, Warm, accents on, Tonal spot, Standard contrast. Current
remains available with scheme/contrast controls disabled. Settings inherit
through ColorTheme and ColorThemePortal, including Sidebar's mobile Drawer.
No brand identity, global rollout, or Material Web component replacement is implied.
Status/data/brand consumers and existing shadows/scrims retain their palettes
even though all Material roles are available for inspection.

Version limit: these are the published 0.3.0 algorithms, not the latest 2025
Expressive specification. Its Expressive scheme rotates primary hue away from
the source. Scheme changes can legitimately change neutral surfaces too.
The package pin avoids 0.4.0's native Node ESM import failure in this toolchain.

Verification: exact API parity for all 49 roles across ten extreme seeds, both
modes, all three schemes and all three contrast levels, plus paired text
contrast. Browser coverage exercises every scheme/contrast option, role values,
portal inheritance, both appearance modes, desktop/mobile bounds, action hierarchy,
white/Lowest cards, surface mappings, draft state, and outer-theme isolation.
The imported lab also has focused workflow coverage for focus, completion,
notes, category, switch, chat tools, navigation, and independent reset, plus
regressions for the original Expression Lab in desktop/mobile layouts.
Boundary contrast and all library consumers are not certified by these checks.

Sources: [creating a scheme](https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md),
[contrast guidance](https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/refining_contrast.md),
[Material Web tokens](https://material-web.dev/theming/color/), and
[role semantics](https://m3.material.io/styles/color/roles).

### Earlier implementation history

The following notes are superseded where they describe fixed primary buttons,
standard-only Tonal Spot, or the dark-card comparison control.

Surface-contract follow-up: Material now exposes the complete named neutral
surface ladder. High maps to Material high rather than the middle container;
muted/navigation keep their container mapping. CardFooter uses opaque low and
enabled Input uses opaque highest, each through a component-owned fill variable
with unchanged legacy fallbacks. SidebarMenuButton persistent selection uses an
explicit secondary-container/on-secondary-container pair, separate from hover
and unaffected by the inset panel's transparent surface override.

Dark cards compares Lowest and Low using the shared ButtonGroup. Lowest remains
default/reset; Low changes only the dark Material card fill, not light cards,
geometry, or the draft. The choice is disabled in Current and travels through
the theme context/portal bridge. No decision to change global card defaults.
Focused desktop/mobile checks cover actual field/footer fills, matching ladder
roles, paired navigation states, both dark-card choices, contrast, and legacy
Current fill parity. Disabled-field behavior is unchanged by this enabled-fill
mapping pass.

User approved recalibrating the complete UI color relationship inside this
experiment before deciding on wider adoption. The shared Current/Material
ButtonGroup defaults to Material; Current preserves the previously approved
palette. Five pastel swatches and Accent buttons remain. Reset restores
Material/Warm/accents enabled without resetting the draft.

Material uses the pinned Color Utilities 0.3.0 SchemeTonalSpot at standard
contrast, resolving actual MaterialDynamicColors roles instead of the earlier
hand-authored tone/chroma recipe. This is not the latest 2025 Expressive algorithm.
Named reference seeds remain in index.css, with the same hue families. Mapping:
surface -> canvas/content; container lowest -> cards (white light mode);
container low -> controls; container -> navigation backdrop/muted;
container high -> popovers; container highest -> neutral interaction;
on surface/variant -> text; outline/variant -> meaningful/decorative boundaries.
Primary fixed/on primary fixed -> light action buttons in both modes, while
ordinary primary remains a readable text/icon/focus role. Secondary stays filled
using the secondary container pair; no added outline. The accents checkbox turns
primary actions neutral without removing tonal surfaces or secondary fills.

ColorTheme's opt-in scale and portal bridge own the mapping. Only Colors adopts
it; global defaults, geometry, motion, status, chart and brand palettes stay put.
This keeps the earlier white light-card requirement while testing tonal grounds.
Fixed-fill boundaries may have low contrast on light grounds, so label contrast
is not claimed as a full control-boundary accessibility certification.

Verification: resolver pairs across seeds; desktop/mobile all five hues in both
modes; fixed accent equality; actual role paint; 4.5:1 text/state pairs; unchanged
outer theme; Current parity; drawer/popover inheritance; draft state and bounds.
One desktop screenshot reviewed. Broader rollout remains deferred.

### Previous steps

Accent buttons can now be disabled independently of the surface hue using the
shared Checkbox in the Colors toolbar. It defaults on; off restores the neutral
primary/action pairs for the current appearance mode. Reset returns to Warm grey
with accents enabled. The option propagates to scoped portaled content.

Next approved step: the four colored swatches now also supply the same hue to
primary action fills and their paired foregrounds. Warm grey now uses its own
warm hue as well; only unchecking Accent buttons restores the neutral baseline.
Surface tint, card material, secondary fills,
focus rings, and geometry stay unchanged. Primary hover/pressed tokens use
the paired foreground and existing state opacities; all four hue pairs pass
4.5:1 text contrast at rest/hover/press in light and dark rendered checks.
This supersedes only the neutral-primary constraint in the hue-only step below;
it does not introduce an independent second accent color.

Latest correction, superseding the seed-generation pilot below: Colors now
changes ONLY the existing warm-grey hue. Five swatches (Warm, Rose, Green, Blue,
Lilac grey) replace the native picker and Default/One color modes. Warm grey is
the initial/reset state. Baseline lightness, chroma, neutral primary actions,
white light-mode cards, and filled secondary buttons remain unchanged. Dark
mode retains its existing card material. The secondary border experiment is
removed. The previous HCT seed resolver remains available but is not the path
used by this experiment. No independent action color is exposed.

The notes below describe the earlier pilot, not requirements for hue swatches.

The surface/accent model supersedes the fixed signature/supporting/spark starting
hypothesis below. OneDS now has a default-preserving role foundation and an opt-in
single-color comparison at `#/colors`. It starts from the existing Default palette.
One seed generates the almost-white canvas, restrained surfaces, navigation,
ink, boundaries, and coordinated action pairs. An independent second accent
input remains in the resolver but is deferred from the experiment until the
single-color foundation is approved. Dark mode reverses surface lightness
direction, not roles.

Implementation: `src/lib/color-theme.ts`, `src/components/ui/color-theme.tsx`, and
the `--theme-*`, `--surface-*`, and `--action-*` policy in `src/index.css`.
Material Color Utilities supplies HCT/tonal palettes; the tone/chroma policy is
OneDS-specific. This is not a wholesale Material component or preset migration.

Existing component tokens remain compatible aliases. Default appearance, geometry,
and motion are preserved. Custom themes remain scoped to the comparison until
adopted explicitly. Portals use the shared ColorThemePortal bridge. The pilot
tests seed independence, light/dark contrast, default restoration, Button states,
responsive bounds, and preserved draft state. It does not certify every consumer.

User correction: the first pink/purple comparison was premature, the surfaces
were too saturated, and the supporting fill lacked visual separation. The
experiment now exposes Default / One color and one swatch. Surface chroma is
capped at 4, light surface tones are 99/98/97/94, and supporting actions use a
same-hue chroma cap of 12 with deeper fills. Tests measure fill/card separation
as well as label contrast. The default palette itself remains unchanged.

Follow-up: the user clarified the reference is the inset Sidebar/SidebarInset,
with a shared layer-zero backdrop and raised content, not the docked placement.
The specimen uses that composition and its
native mobile Drawer, not an inline navigation approximation. Sidebar bridges
the scoped theme into its mobile content. Secondary Buttons in generated themes
keep their tonal fill and gain a tokenized paired-foreground boundary. Rendered
tests require 3:1 boundary contrast against the fill and composited Card footer,
plus 4.5:1 label contrast. The earlier 1.4:1 fill separation check alone was not
sufficient to evaluate the control boundary. Default Button styling is unchanged.

No permanent signature hue is selected. Increased contrast, image
extraction, theme persistence/export, and automatic portal migration remain future
work. Status and data palettes remain independent.

Sources: [Color roles](https://m3.material.io/styles/color/roles),
[Dynamic color](https://m3.material.io/styles/color/dynamic/choosing-a-source),
[Custom input families](https://m3.material.io/styles/color/advanced/adjust-existing-colors).

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
