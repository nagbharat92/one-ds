# OneDS

A clean React + Vite + Tailwind + [shadcn/ui](https://ui.shadcn.com) foundation with a
component showcase site. The default palette is preserved alongside an opt-in,
single-color theme experiment.

## Stack

- **React 19** + **TypeScript** (Vite)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** — Radix-based components, Nova preset, `neutral` base color, CSS variables, Lucide icons, Geist font
- **shadcn MCP** wired into VS Code for adding components on demand

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Showcase site

### Design rules for people and agents

Open `#/rules` from the sidebar's Reference section for approved conventions,
searchable candidate rules, implementation links, and live Button measurements.
[src/design-system/rules.json](src/design-system/rules.json) is the canonical source;
the page reads it directly and `npm run rules:generate` produces the
[agent-readable reference](public/design-rules.md). [AGENTS.md](AGENTS.md) directs
agents to read that reference before UI work. Keep candidates distinct from approvals.

The first approved rule is **build everything from OneDS components**. Extend the
owning component or add a reusable library component before using a missing pattern;
do not recreate it in page markup. Semantic content and product data may remain local.
The Rules page composes Section, Stack, Cluster, Accordion, Empty, Alert, and the
existing controls. It contains no locally styled native elements or raw disclosures.

[Text](src/components/ui/text.tsx) owns body, label, metadata, and code roles through
`--text-body-*`, `--text-label-*`, `--text-metadata-*`, and `--text-code-*` tokens.
Its initial body scale preserves the existing 14px reading size for a separate
typography decision. `asChild` preserves semantic paragraphs, terms, definitions,
links, or code while applying the shared role. See `#/text`.

[TableOfContents](src/components/ui/table-of-contents.tsx) composes with
TableOfContentsLayout and TableOfContentsContent. Pass unique target IDs and labels;
the component scrolls and focuses the target without replacing a hash-routed page.
The desktop rail uses CSS sticky positioning and a bounded overflow area, while
the narrow layout wraps above the content. Geometry lives in `--toc-*` tokens.
Keep the layout inside the intended page scroller and avoid an intervening clipping
ancestor. See `#/table-of-contents`. Current-section scroll tracking is not included.

Buttons now expose only Default (`default`) and Expressive (`expressive`):
40 and 56 CSS pixels including borders. Icon counterparts (`icon`,
`icon-expressive`) use matching square dimensions. Large, small, and extra-small
Button sizes have been removed; existing consumers use Default. Default now uses
the former Large proportions: 20px icons and 16px horizontal padding.
Button, Favicon, and InputGroupButton share the scale. Existing specialized
composition overrides are not a blanket certification of the entire library.

Button no longer exposes `outline`. Isolated icon-only actions and groups use
`ghost`; supporting actions beside search, selects/dropdowns, or mixed tools use
`tertiary` for neutral visual weight. Labelled supporting actions also use
Tertiary. This is a local composition decision, not a page-wide theme or runtime
DOM heuristic. Primary, destructive, link, and persistent selected-state intent
remain unchanged; field-internal affordances may stay ghost. Non-Button outline
variants and field borders remain supported. See Button's working **Icon Tools**
and **Mixed Tools** examples, and rule `controls.supporting-actions`.

FABs expose `primary`, `secondary`, and `tertiary`, with Tertiary as the default.
Primary uses the pink Tertiary container/On tertiary container theme pair;
Secondary and Tertiary share Button's palettes. The old `surface` variant aliases Tertiary.
Primary is for a prominent CTA; FABs do not expose selection. Their 56px and 72px
sizes use softer 20px and 28px corners, with no shadows and opaque
interaction fills. Tune the pink theme pair, shared button color tokens, and `--fab-radius-*` tokens.

### Material color roles

**Button colors** have three types: accent-purple `primary`, light-purple
`secondary`, and warm-neutral `tertiary`. General buttons default to Tertiary;
`default` is a compatibility alias for Tertiary. Choose Primary or Secondary
explicitly when emphasis is needed. Tune the `--button-primary-*`,
`--button-secondary-*`, `--button-tertiary-*`, and `--button-link-ink` tokens in
[src/index.css](src/index.css). Filled hover/pressed states use their paired
foregrounds at 8%/10%. Tertiary uses Surface container highest/On surface variant;
its name describes emphasis, not Material's tertiary accent palette. Pink is reserved
for Primary FABs, not the default Button treatment.
Generic selection colors, ghost/destructive treatments, and Button geometry
and motion are unchanged. See [Button color tuning](src/design-system/material-foundation.md#button-color-tuning).

Latest background-only pass: Filled uses published Material baseline P40/P80
(`#6750a4` / `#d0bcff`). Destructive's solid Error fill was reverted: its
original red tint is 10%/20%/30% for rest/hover/press in light mode and
20%/30%/40% in dark mode, controlled by `--button-destructive-*-opacity`.
Text colors are deliberately unchanged, including destructive text; its contrast
is pending the foreground pass. Tonal, links, surfaces, and focus colors stay as-is.

**Destructive** now uses the selected Material Error40/Error80 tint everywhere,
with the same light10/20/30% and dark20/30/40% ramp. The original palette and
`destructivePalette` comparison option are removed; text/focus colors stay unchanged.

**Selected** is a controlled Button state: pass `selected={selected}` and update
it in `onClick`. Use `ButtonSelectionIcon` with a fill-compatible icon to switch
from outlined to filled when selected without changing its size or position.
Button emits `aria-pressed` and swaps square unselected corners to
round selected corners, following Material's square-start configuration. The
Selected showcase demonstrates Tertiary, Secondary, icon-only, and disabled
buttons at both sizes. Tertiary selects from neutral to light purple; Secondary
selects from light purple to dark gray-purple, with their paired foregrounds.
Primary is reserved for prominent calls to action and ignores `selected`;
choice-group items accept only Secondary, Tertiary, or its `default` alias.
Ordinary Buttons retain their existing shapes. Selection changes use spatial
motion tokens and respect reduced motion; labels and dimensions remain stable.

**Layout > Surfaces** (`#/surfaces`) shows shape-only UI diagrams: Workspace,
Content and controls, and Floating surface. The reusable `SurfaceDiagram`
composes MaterialSurface and real Card parts to show colors in context, without
product text or live controls. All shapes follow the current light/dark theme.
MaterialSurface still owns only color; Card keeps its distinct content anatomy.

The reusable [Material foundation](src/design-system/material-foundation.md)
records official sources, supported roles, compatibility mappings, and migration
status. Neutral surfaces now apply across the site and components without a
wrapper. Edit the shared `--theme-website-<role>-light/dark` tokens in
[src/index.css](src/index.css) to update pages, cards, fields, menus, and portals
together. `MaterialSurface` consumes those global roles directly. MaterialTheme
remains an opt-in for the website's action accents; shadow geometry is unchanged.

Open **Experiments > Colors** (`#/colors`) for the **Material website** example.
This demo now focuses exclusively on the website palette. Generated Material,
Current, hue swatches, contrast options, neutral-action opt-out, and the unrelated
legacy color galleries are no longer shown. Use the site's appearance control
for light/dark. Other theme APIs remain available internally; migration proceeds
through shared global surface roles, with action accents still explicitly scoped.

Use Material vocabulary: **Surface**, **Surface container lowest/low/high/highest**,
**On surface**, **On surface variant**, **Primary**, **Secondary**, **Tertiary**,
their **container** roles, and their paired **on-colors**. Surface container is
also a distinct middle level. The inspector shows these pairs with readable
labels and the canonical `--md-sys-color-*` token names.

Selected tabs and navigation use **Secondary container / On secondary container**;
the tab track uses **Surface container low**. Filled buttons use **Primary /
On primary** vocabulary: the background-only baseline correction uses
`#6750a4` light / `#d0bcff` dark while retaining existing text colors
`#ffffff` light / `#1a0056` dark until the foreground pass.
Tonal buttons keep **Secondary container / On secondary container**.
This supersedes using the website's pink search control for every main action;
the pink Tertiary container palette is used for Primary FABs instead.
`--button-primary-fill` and `--button-primary-ink` own the Filled mapping. Existing OneDS motion
and state-layer behavior remain unchanged. Cards remain **Surface container lowest**, including white cards
in light mode. The diagram's old elevation overlays (5/8/11/12/14% primary) are
not applied on top of these explicit surface roles. Shadows remain separate.

Website navigation hover uses an 8% **On surface** state layer over the existing
surface, not a swap to the raised content background. It darkens light-mode
navigation and lightens dark-mode navigation. The inset Sidebar honors
`--sidebar-hover-fill` when supplied; other themes retain their existing fallback.
Persistent selection keeps its separate Secondary container pair. Interaction
state layers are distinct from the older tonal-elevation overlays above.

The preview imports `ExpressionLabPreview` from the existing
[Expression Lab composition](src/components/expression-lab-preview.tsx), replacing the
single release-note card. It includes the inset Sidebar, focus session, checklist,
observations, lens controls, and assistant chat in a bounded application canvas.
Its baseline form treatment keeps color comparisons independent of expressive
geometry. Notes, selection, and chat state survive light/dark changes; Quick actions >
Reset lab resets application state. Dropdown menus
inherit the selected theme through ColorThemePortal.

#### Retained theme APIs

These APIs are retained for other consumers, not exposed by the Colors demo.
[ColorTheme](src/components/ui/color-theme.tsx) accepts `hue="warm|rose|green|blue|lilac"`.
Pass `scale="material"` for the comparison scale; omitted scale inherits the
enclosing scope or defaults to `current`. Scale, hue, and accent-button state
travel through ColorThemePortal without remounting product content.
`ColorThemeSwatches` composes `ButtonGroupChoice` and `ButtonGroupChoiceItem`,
reusing their persistent checkmark, non-clearing single selection, and keyboard
navigation. Choice items accept `tooltip` and delegate it to Button internally;
do not wrap them in an external TooltipTrigger that can overwrite selection state.
Hue selection takes precedence over the older `theme` seed API, which remains
available for experimental consumers but is not used by Colors. Omit both to
inherit the enclosing theme (the existing default when
there is no custom ancestor). Wrap an application or a region; `asChild` avoids
adding a wrapper. Color selection does not imply changing shape, size, or motion.

#### Material website preset

The reference is the Material documentation site's **custom palette**, not a
stock SchemeExpressive result. Verified from its live `mio-root` and
`mio-root.dark-mode` CSS on September 7, 2026:

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#fefbff` | `#141314` |
| Navigation surface (surface-2) | `#f2ecee` | `#211f21` |
| Primary | `#6442d6` | `#9f86ff` |
| Secondary container | `#dcdaf5` | `#45455a` |
| Tertiary container | `#f1d3f9` | `#553f5d` |

This is an analogous relationship, not complementary or triadic: measured HCT
hues are approximately primary 295, secondary 284, and tertiary container 319.
Chroma establishes emphasis (about 70, 17, and 24 respectively), while neutral
surface-2 has chroma about 2. Selected tabs use secondary container; the tab bar
and table headers use surface-1. The pale button illustration is a raster image
and stays pale in dark mode; it is not a live dark-theme component.

`ColorTheme scale="website"` reads 25 mapped roles from `--theme-website-*`
tokens in the [token source](src/index.css). Website background maps to surface;
its surface-0 through surface-4 map to the existing lowest-through-highest
container ladder. Its surface-variant supplies OneDS's outline-variant fallback.
These are explicit OneDS adapter choices, not claims about the website's modern
surface-container naming. Unspecified roles, including strong tertiary and
fixed families, are not invented or borrowed from a generator. The inspector
shows only available roles and marks missing family pairs as Not specified.
Semantic statuses, brand colors, shadows, and scrims retain existing mappings.

Source: [reference page](https://m3.material.io/components/button-groups/overview)
and its [published stylesheet](https://m3.material.io/static/angular/styles.4c2805e602edc472.css).
The preset's **neutral surface roles are global**. Colors and site navigation
also opt into its accent roles through MaterialTheme. Existing primary-action
colors elsewhere, status palettes, and shadow geometry are not changed by the
surface rollout.

#### Generated Material scale

`createMaterialColorTheme` in the [resolver](src/lib/color-theme.ts) uses the
pinned `@material/material-color-utilities@0.3.0` **SchemeTonalSpot**,
**SchemeVibrant**, or **SchemeExpressive**, and MaterialDynamicColors role
resolution. It exports all 49 system roles under Material Web's canonical
`--md-sys-color-*` names, excluding palette key colors. There are no custom hue
rotations or tertiary overrides. The scheme and contrast Selects call the
published constructors with Standard (`0`), Medium (`0.5`), or High (`1`).
These are the pinned package algorithms, not the latest 2025 Expressive algorithm.
Reference seeds live in `--theme-material-seed-*` in `src/index.css`;
they preserve the existing five hue families, converted through sRGB/HCT rather
than treating OKLCH hue angles as HCT angles. Library role algorithms own their
reference tones; OneDS owns the component mapping below.

The reference tones below describe standard contrast; increased contrast is
resolved by Material's API, not by applying these tones as constants.

| OneDS use | Material role | Light / dark reference tone |
| --- | --- | --- |
| Canvas and content panel | Surface | 98 / 6 |
| Cards | Surface container lowest | 100 / 4 |
| Card footer | Surface container low | 96 / 10 |
| Enabled text fields | Surface container highest | 90 / 22 |
| Other control surfaces | Surface container low | 96 / 10 |
| Inset navigation backdrop and muted areas | Surface container | 94 / 12 |
| Popovers | Surface container high | 92 / 17 |
| Neutral interaction backplates | Surface container highest | 90 / 22 |
| Primary button fill / ink | Primary / on primary | 40 / 100 light; 80 / 20 dark |
| Primary text, icons, and focus | Primary | 40 / 80 |
| Supporting button fill / ink | Secondary container / on secondary container | Resolved role pair |
| Feature highlight fill / ink | Tertiary container / on tertiary container | Resolved role pair |

`ColorThemeSurface` exposes `canvas`, `lowest`, `low`, `container`, `high`, and
`highest`, plus the existing `default` (card-default) and `navigation` aliases.
Material maps each ladder name directly to its matching role; `high` no longer
means the middle `container`. Current may intentionally share colors between
levels. These roles express visual hierarchy, not automatic shadow elevation.

**Lowest** is the user's selected dark-card treatment (tone 4). The comparison
control is removed from Colors; light cards remain white. The existing optional
`darkCardSurface` API remains available, but Colors explicitly uses `lowest`.

CardFooter owns `--card-footer-fill`, resolving to `--theme-card-footer-fill`
when supplied, otherwise its original 50% muted blend. Input owns `--field-fill`,
resolving to `--theme-field-fill`, otherwise its original control fill in light
mode and input/30 blend in dark mode. Material supplies opaque surface roles for
these enabled fills; field outlines and disabled-state styling remain separate.
These fallbacks preserve existing consumers outside the experiment.

SidebarMenuButton keeps neutral hover feedback separate from persistent
selection. Material's `--sidebar-selected-fill` / `--sidebar-selected-ink` pair
uses secondary container / on secondary container even inside an inset Sidebar;
selected hover/press layers use that same paired ink. The panel itself remains
transparent over its shared backdrop. Without these selection tokens, the
existing sidebar-accent treatment remains the fallback.

For the retained generated scale (not the website demo), `--button-primary-fill`
and `--button-primary-ink` map to ordinary primary
and on primary. The earlier fixed-fill mapping was rejected: rose primary fixed
and secondary container both resolved to #ffd9dc, collapsing the hierarchy.
Fixed roles remain available in the resolver for future explicit uses, not as
the primary-button default. `--primary` remains readable as text on the canvas.
Default Button aliases preserve existing styling elsewhere. Button state layers
use the paired ink at existing hover/press opacities. GitHub monochrome favicons
use light ink on light-mode primary buttons and dark ink on dark-mode primary
buttons. No geometry or motion changes.

#### Official schemes and role families

Material generates primary, secondary, tertiary, neutral, neutral-variant, and
error palettes together. Each accent family has its own strong and container
roles with paired foregrounds. OneDS's secondary Button consumes **secondary
container**, not Material's distinct **secondary** role. Neither is an alias
for tertiary. The previous Off/Auto/Custom second-color experiment is removed.

`ColorTheme materialScheme="tonal-spot|vibrant|expressive" contrast={0|0.5|1}`
inherits through context and ColorThemePortal. Current disables these controls.
Tonal spot is restrained; Vibrant emphasizes chroma; the pinned Expressive
scheme rotates primary away from the source and coordinates the other families.
Changing a scheme can change the whole palette, including neutral surfaces.

`MaterialColorRoles` shows paired primary/secondary/tertiary/error samples and
all 49 generated roles with their actual values, including fixed, inverse,
surface, outline, shadow, and scrim roles. The family inspector remains below
the application preview; the old Team preview badge specimen is removed.
No custom harmonization is applied.

Sources: [creating a scheme](https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md),
[contrast guidance](https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/refining_contrast.md),
[Material Web color tokens](https://material-web.dev/theming/color/), and
[role semantics](https://m3.material.io/styles/color/roles).

Material roles are mapped, not copied wholesale: the inset Sidebar retains its
transparent panel/raised content anatomy, Card retains its footer band, and
status, presence, categorical badges, charts, scrims, and shadows remain on their
existing independent palettes. Their Material roles are exported for inspection,
but those consumers are not migrated. Contrast selection is experiment-local;
there is no global preference or component-library replacement.
Tonal secondary and tertiary fills have readable labels but can have low boundary
contrast against light surfaces; this experiment is not a claim that every control boundary meets
3:1. Do not propagate the mapping without reviewing the actual compositions.

#### Earlier seed API

The deferred seed resolver uses Material Color Utilities 0.3.0 for HCT
and gamut-aware tonal palettes, with an explicitly OneDS-specific policy. It does
not use Material's full dynamic-scheme preset. The package is pinned because 0.4.0
has an extensionless import in its public barrel that fails under native Node ESM.
All tone/chroma policy and the initial comparison seeds live in `src/index.css`;
user-provided seeds are runtime inputs, never authored page color literals.
The client-side theme scope follows `next-themes`. The following HCT policy
belongs only to the older seed API, not the Current or Material comparison:
Surface HCT chroma is capped at 4; supporting-action chroma at 12, below the
primary-action cap of 48. Light surface tones are 99/98/97/94, keeping large
areas nearly neutral. Supporting fills use tones 82 (light) and 38 (dark), with
paired foregrounds at 20 and 98. The 1.4:1 supporting-fill/card separation check
is a visual regression threshold, not a WCAG control-boundary certification.

| Role | Existing component mapping |
| --- | --- |
| `--surface-canvas` | Background / ground |
| `--surface-low` | Popovers and custom-theme control surfaces |
| `--surface-default` | Cards |
| `--surface-high` | Muted containers and custom-theme navigation |
| `--surface-ink`, `--surface-muted-ink` | Main and supporting text |
| `--surface-outline`, `--surface-input-outline` | Decorative and meaningful boundaries |
| `--action-primary`, `--action-on-primary` | Primary actions and their foreground |
| `--action-secondary`, `--action-on-secondary` | Tonal supporting actions and their foreground |

`ColorThemeSurface` exposes canvas/low/default/high/navigation treatments for new
compositions. Existing Card and Sidebar consumers keep their component APIs.
The old `--accent` token is still a neutral interaction backplate, not the accent
seed. Navigation selection uses the tonal action pair in a custom theme.
Button hover/press colors blend with the matching foreground in custom themes;
the default preset retains its previous state colors.

In Current, primary accents use `--theme-primary-*` and `--theme-on-primary*` tokens, mapped
to the existing primary/action roles. Hover and pressed colors mix with the
paired foreground at existing state opacities. The same hue reaches scoped
portals; there is no second hue or global application recolor. Focus rings and
secondary actions remain on their existing roles for separate review.

The secondary boundary experiment was rejected and removed. Hue changes must
never turn a filled secondary Button into an outline treatment. Hue scopes
in Current retain the existing secondary fill and state-layer formulas. Cards and popovers
retain their existing material colors: white in light mode, their existing dark
surface in dark mode. The grey canvas/backplates alone shift hue, at the original
OKLCH chroma of 0.003; do not increase chroma to make the swatches more dramatic.

The Colors specimen uses the inset Sidebar and SidebarInset: navigation sits
on the shared layer-zero backdrop and the content is raised with an 8px inset.
The content heading and desktop toggle are omitted; a mobile-only trigger
preserves access to the native Drawer. Sidebar owns the
ColorThemePortal bridge for its mobile content, so scoped color follows it.

Wrap scoped portaled content in `ColorThemePortal`, inside its ColorTheme context:

```tsx
<ColorTheme hue="green" scale="material">
  <Popover>
    <PopoverTrigger asChild><Button variant="secondary">Details</Button></PopoverTrigger>
    <ColorThemePortal>
      <PopoverContent>Project details</PopoverContent>
    </ColorThemePortal>
  </Popover>
</ColorTheme>
```

The bridge applies variables to the actual portaled content without changing its
slot, focus handling, or placement. Nested custom scopes may use different seeds.
Automatic migration of all portals, persistence/export, image extraction, and
increased-contrast generation are not included in this first slice. Status,
presence, categorical badge colors, and chart series retain their own palettes.

`npm run test:color-theme` checks 100 seed combinations in both modes for ordered
surfaces, text contrast, input-boundary contrast, and independent families.
`tests/color-theme.spec.ts` checks all five hue swatches on desktop/mobile in
both modes, including unchanged cards, same-hue primary pairs with 4.5:1 text
contrast at rest/hover/press, the neutral Warm baseline, transparent
secondary borders, draft state, inset Sidebar, and portal inheritance.
These checks cover the pilot, not every possible component/background combination.

### Button motion

Button's **Motion** example previews a poppy push: 2px downward and 3% compression,
using the official fast spatial web conversion (350ms spring-shaped curve), while
colors and opacity use fast effects (150ms, no overshoot). All values are tokens
in `src/index.css`, consumed through Button-specific aliases. Corners and layout
dimensions remain unchanged; only the painted button moves and compresses slightly.
Reduced motion disables the push. The earlier corner morph and radius tokens are
retained behind `data-press-effect="morph"` for future compositions, not enabled by default.
This is a CSS approximation, not a velocity-preserving physics engine. See the
[motion research and decisions](PRDs/oneds-phase-2d-motion-character-prd.md#material-research-and-button-pilot-september-7-2026).
Other component motion remains unchanged pending deliberate adoption.

### Optical spacing for icon labels

[IconLabel](src/components/ui/icon-label.tsx) owns the optical correction for text
paired with an icon, favicon, or loading spinner: `--icon-label-optical-padding`
adds 4px on the label's outer edge opposite the graphic. A left icon adds right
label padding; a right icon adds left label padding. Button's gap remains 8px
(`--graphic-label-gap`, aliased by `--button-gap`) in both sizes and expressive contexts.
"Icon + label" always means icons, favicons, and loaders alike. Parents composing
IconLabel with any of these graphics inherit the shared gap rather than a local spacing choice.
Logical sides mirror in right-to-left layouts.
Labels flanked by graphics on both sides get no asymmetric correction.

Favicon adapts GitHub's monochrome mark automatically for light/dark themes and
primary Button surfaces, using shared filter tokens. Colored brand favicons retain
their original colors. Consumers must not apply blanket `dark:invert` styling.

Button wraps ordinary labels automatically, including plain text spans and `asChild`
links, and enables the correction only beside an icon, favicon, spinner, or `data-icon`
wrapper. Loading examples use the shared Spinner, which follows Button's icon-size
tokens. Text-only and icon-only controls retain their original geometry.
For a rich custom label, compose IconLabel explicitly; use it in new icon-label
components too. Do not recreate this as page-level `pr-1` overrides or modify the
base Button padding/gap. See `#/icon-label` and Button's **Optical Spacing** example.

The general principle is **optical alignment/optical correction**. Material documents
[optical corrections in iconography](https://m2.material.io/design/iconography/system-icons.html#system-icon-metrics)
and [asymmetric padding in its older button specs](https://m2.material.io/components/buttons#specs).
Those sources support the principle; the specific 4px mirrored outer correction is our own.

Run `npm run test:design-rules` to validate the rule registry, generated Markdown,
and Button token/API contract. The `design rules` Playwright tests verify the live
page, size parity, and responsive examples.

Verification is risk-based; the [Change and Verify policy](AGENTS.md#change-and-verify)
defines the budget. Small visual changes get typecheck, touched-file lint, and one
focused rendered check, not a full test run. Documentation-only changes need only
diff review and whitespace validation. Broader checks are reserved for shared
behavior/API migrations and release validation. Reuse passing results unless later
edits affect them, and do not regenerate showcase code separately when running
`test:showcase-code`, which already performs that step.

`npm run dev` serves the component showcase, modeled on shadcn's docs site:

- **Sidebar** grouped by category, listing all installed components.
- **One page per component** (hash-routed, e.g. `#/dialog`).
- Each page stacks every named variation as its own live preview.
- Every example includes Preview/Code controls, Reset, and an in-page index.
- Preview and Code share one stable height; long snippets scroll inside the panel.
- Demo links and forms simulate actions without leaving or reloading the showcase.

Showcase sizing has two tiers. **Default** (`surface: "default"`) uses the shared
`PageContent` app-width column, matching Concentric, and the roomy
`--canvas-viewport-height` minimum. All former small component pages now use it,
including named examples. Explicit `start` and `wide` canvas layouts retain their
alignment but share this minimum. **Large** (`surface: "application"`) retains the
full-width page and application-height preview used by AI Chat and other application
specimens. Blocks and Experiments infer Large unless they explicitly choose Default.
Component-owned canvases retain their own anatomy and content-driven dimensions.
The reusable PageContent and Canvas APIs outside the showcase remain unchanged.

The showcase is driven by category demo files under
[src/showcase/demos](src/showcase/demos), aggregated in
[src/showcase/registry.tsx](src/showcase/registry.tsx). To add a component to the
showcase, add an entry (with a `Demo` render function and its `code` string) to the
relevant category file — the sidebar and pages update automatically. Variant code
is generated from its `Demo` function before development and production builds;
an explicit `code` string overrides the generated snippet when a curated example
is more useful.

Preview Tools use complete source extraction for both Default and named examples:
the generator includes referenced local helpers, typed constants, and only the
imports they use, then exports the demo component. Default entries reference
`generatedExampleCode["slug:Default"]` instead of a separate handwritten version.
Canvas Grid inherits Canvas's complete example because both render the same demo.
Other categories retain their existing extraction/curated-code behavior unless
an entry opts in with `codeSource: "complete"`. Toolbar is the first component-page
pilot using this option.

These are reusable TSX modules within a OneDS-configured app, not standalone
bundles: they expect the shared components, installed packages, `@/` alias, and
global styles/tokens from `src/index.css`. Local imports under `src` are rewritten
to the alias so moving a snippet to another page does not break relative paths.
Run `npm run test:showcase-code` to regenerate snippets, test dependency extraction,
and typecheck each Preview Tools and Toolbar snippet independently against the real components.

### Preview Tools

Plain labeled selection controls use `CheckboxGroupItem`, `RadioGroupOption`,
and `SwitchGroupItem`. Their text wrappers have token-based 12px right padding,
including the last option, with an 8px control-to-text gap. Horizontal groups
have zero column gap; vertical row spacing remains independently configurable.
These labeled components also work for standalone options (radio options still
require a `RadioGroup`). Choice cards, description fields, and table selectors
retain their specialized compositions rather than receiving this label padding.

The sidebar's **Preview Tools** section contains **Canvas**, **Canvas Grid**, **Cursor Follower**, and **Annotations**,
separate from application components. All showcase previews use
[Canvas](src/components/ui/canvas.tsx); preview surfaces are no longer a Card variant.

- `Canvas` owns the surface: `layout` selects center, start, wide, viewport, or
  application sizing; `background` selects grid or plain and defaults to plain.
  Decorative dots require an explicit `background="grid"`.
- The Canvas page pilots content-driven sizing: use the default layout with
  `CanvasContent` directly inside `Canvas`, without a workbench minimum. Height
  is the larger of `--canvas-min-height` and content height plus padding and borders.
  External toolbar and footnote heights are not part of that calculation.
- Set `annotationSpace` when a specimen supports callouts. It reserves
  `--canvas-annotation-padding-block` above and below the content regardless of
  annotation visibility, so toggling annotations does not resize the canvas.
  Other previews retain their existing sizing until this pilot is rolled out.
- Place `CanvasGrid` directly inside `Canvas` for optional measurement rulers.
  It defaults to inactive; pass `active` to enable it. Keep it mounted and toggle
  `active` to preserve the specimen's layout. Its top
  and left rulers overlay the existing canvas padding without adding space or
  shifting the specimen. Annotation placement excludes those ruler bands even
  while the grid is hidden, so labels stay stable too. The line grid replaces
  the decorative dots. Grid lines, ruler labels, and coordinates
  use the specimen's top-left as zero (`CanvasContent`, or an explicit
  `data-canvas-origin` target). Space before that origin has negative coordinates.
  Without a target, zero falls back to the drawable area's top-left after the
  ruler bands. Measurements are CSS pixels, not device pixels.
- Measurement tokens use `--canvas-measure-*` in the shared stylesheet. Fine lines
  follow `--spacing`, major lines appear every five units, and labels every ten
  units to avoid crowding. Cursor crosshair, ruler ticks, and the cursor-following
  coordinate readout use `--canvas-measure-accent`, which defaults to `var(--primary)`.
  The readout uses `CursorFollower`, offset from the pointer and flipped inward at
  the canvas edges. `CanvasGrid followerVariant="surface|accent"` selects
  its appearance; both are compact and Surface is the default.
  `followerContent` optionally renders a custom ornament using the same snapped,
  specimen-relative coordinates, without creating a second follower.
  The overlay is pointer-transparent and hidden from assistive technology; touch
  interaction does not show a persistent hover marker. Crosshair, guides, ruler
  markers, and readout snap together to the nearest visible grid intersection,
  using `--canvas-measure-step` and the specimen origin, including negative values.
  This snaps only the measurement cursor, not content or native click targets.
  While the crosshair is visible, the native cursor is hidden over the canvas
  and its descendants. Over interactive annotation callouts, the central crosshair
  yields to the native hand pointer; guides and coordinates remain available.
  `--canvas-measure-cursor-layer` places cursor graphics above annotations and
  the coordinate follower. Faint full-span guides use `--canvas-measure-guide-color`;
  ruler markers and the crosshair keep the stronger measurement accent.
- `CursorFollower` is reusable without CanvasGrid. Place it directly inside any
  positioned host. An optional `position` supplies controlled local coordinates
  (`null` hides it); omit it for ordinary pointer tracking. CanvasGrid uses this
  to keep the ornament anchored to its snapped crosshair. It also works in any
  positioned host, with content or a render function receiving local CSS-pixel
  `{ x, y }` coordinates. `active` controls visibility/tracking; its content must
  be decorative and non-interactive, never essential information or controls.
- `--cursor-follower-*` tokens own offset, edge clearance, padding, radius, shadow,
  typography, and colors. Both variants use compact padding, a pill radius, and
  raised shadow. Surface uses a bordered popover and is the default everywhere;
  Accent uses primary/on-primary only when explicitly selected.
  Origin tokens default to zero. CanvasGrid uses ruler offsets for the follower's
  hover boundary and placement, then offsets its displayed coordinates to the
  specimen origin. The component is
  pointer-transparent, hidden from assistive technology, and has no motion lag.
- `CanvasWorkbench` keeps `CanvasContent` centered with balanced space above and
  below, and can accommodate an internal `CanvasToolbar` where needed.
- `CanvasFooter` is an optional centered footnote placed after `Canvas`, outside
  the preview surface. It owns its top spacing and muted footnote typography.
  Do not place it inside `CanvasWorkbench`.
- Put annotation targets and `AnnotationCallouts` inside `CanvasContent` so their
  geometry shares one positioned container. Toolbar and footer are marked as
  annotation obstacles automatically.
- Surface, grid, sizing, and region spacing use the `--canvas-*` tokens in
  [src/index.css](src/index.css). Application preview height is overridden by the
  showcase shell; Canvas itself does not depend on showcase layout tokens.

Demo click/submit interception, scroll boundaries, Reset, and Preview/Code tabs
remain showcase behavior rather than part of the reusable Canvas component.
Set `ownsCanvas: true` on an entry or example when its demo composes its own
`Canvas` with external toolbar or footer siblings. The showcase still supplies
the sandbox behavior without adding a second preview surface.

Every example uses the shared inline section header, with Preview/Code icon tabs
and Reset beside its title. Standard examples receive a separate Grid toolbar
and Canvas centrally in `App.tsx`; Grid starts off. Their existing layout,
background, scroll boundary, link interception, and form handling remain intact.
No annotation targets or measurement regions are created automatically.
Examples with `ownsCanvas: true` keep their own shared/custom toolbar and canvas
composition without a second wrapper surface. Existing header metadata can still
provide descriptions; it is no longer required to opt into the shared header.
The Annotations page also uses this base for Default, Dimensions, and Corners:
inline headers, external Grid/Annotations controls, one content-driven canvas,
and an external footnote. This page explicitly enables grid and annotations; they retain their
reserved space when hidden, and reset together. These controls belong to every
annotation example, not to a separate Toggle variant. Default mixes numbered
markers, named chips, and numbered chips across six distinct targets.

Shared preview composition lives in `src/components/ui/canvas-preview.tsx`:
- `CanvasPreview` owns the Grid/Annotations toggle state, toolbar, canvas, content,
  and optional footer. `children` receives `{ grid, annotations }`;
  `footnote` accepts content or a function receiving the same state.
  `defaultGrid` and `defaultAnnotations` both default to false. Opt in with
  `<CanvasPreview name="Example" annotationsAvailable defaultGrid defaultAnnotations>` or enable just
  one with its corresponding prop. These defaults seed the toggle state and Reset
  restores them. Ordinary component pages, including Toolbar, need no flags to
  start with both off. Use
  `contentClassName` for specimen width and `className` for the outer wrapper.
  A constant footnote remains visible when annotations are hidden; use a function
  for conditional legend or status content. Remounting the preview resets toggles.
  `annotationsAvailable` defaults to false: omit it for Grid-only controls and no
  annotation space reservation. Set it only when the preview contains authored
  callouts or measurement regions. `defaultAnnotations` sets initial visibility,
  not availability. Standard pages do not show an inactive Annotations checkbox.
- `CanvasPreviewControls` exposes the same toolbar independently, controlled by
  `grid`, `annotations`, `onGridChange`, and `onAnnotationsChange`; its optional
  children slot holds additional controls. Custom layouts can use
  `annotationsAvailable` to expose the optional annotation toggle, and
  `useCanvasPreviewState({ defaultGrid, defaultAnnotations })`, which shares the
  same off-by-default contract and returns both values and their setters.
- `AnnotationLegend` renders the semantic color circles and labels, with an
  optional ordered `kinds` subset. It can be composed in any footer.
- `AnnotationRegion` owns an accessible filled button with `target`, `kind`,
  `label`, `active`, and `selected`. Use normal button handlers such as `onClick`
  to coordinate selection with `AnnotationCallouts`. Hidden regions are disabled;
  positioning remains supplied through `className` by the specimen.

Page opt-ins are explicit, not inferred from routes: Annotations, Cursor Follower,
and Concentric enable both; Canvas and Canvas Grid enable only grid. The standalone
`CanvasGrid`, `AnnotationLayer`, `AnnotationCallouts`, `AnnotationMeasurements`,
and `AnnotationRegion` also require `active` to opt in. `CursorFollower` itself
remains active by default because it is a separate pointer ornament, not a grid
or annotation visibility control.

Annotation primitives and `AnnotationCallouts` accept `kind`: `bounds` (default,
blue), `padding` (green), `border` (yellow), `margin` (orange), or `gap` (purple).
Set it on a layer to inherit the role, or on an individual primitive or callout
item to override it. A callout's connector, corner arc, label, focus ring, and
hover/selected bounds share its role. Colors, translucent fills, and interaction
states resolve through `--annotation-*` tokens in light and dark themes; no
consumer-supplied color values are needed. These hues follow box-model inspection
conventions, with a separate role for gap rather than treating it as margin.

Annotation styling is owned by `--annotation-*` tokens in `src/index.css`:
- The five `--annotation-*-color` roles and `--annotation-highlight-foreground`
  have independent light/dark values, not aliases to badge or primary colors.
  Shared neutral surfaces still use the global background/foreground tokens.
- Fill opacity tokens cover resting, hover/focus, selected, and pressed states;
  `--annotation-dim-opacity` controls inactive callouts during inspection.
- `--annotation-layer` is shared by callouts and automatically measured regions.
  Reveal/transition durations and easing alias the existing motion system.
- Label, marker, dot, focus, hit-area, and legend tokens own their visual sizing.
  Spacing, typography, radius, and shadow values reuse the existing design scales.
  Structural zero/full-size positioning and runtime measurement coordinates are
  layout behavior, not additional theme values.

Plain `AnnotationCallouts` show authored labels and selected bounds without size
readouts. Explicitly set `showDimensions` to expand a selected label into a two-line chip: the original
caption or number above the target's live width × height in CSS pixels. Values
use the same measured border box as the dotted outline, displayed to at most two
decimal places without snapping to the grid. Expanded chips participate in label
placement, retain keyboard focus, and collapse on Escape, outside click, or
selection of another callout. Numbered markers return to circles when deselected.
`AnnotationMeasurements` opts into these readouts internally. Generic page
rollout and ordinary authored anatomy/corner annotations do not enable them.

Dimensions uses all five colors across actual padding, margins, borders, gaps,
and title bounds on the shared Card, CardHeader, and CardFooter components.
`AnnotationMeasurements` generates overlays from computed styles and live element
bounds, including the footer's fractional rendered border width. The demo marks
four targets and requests their measurement kinds; it supplies no region sizes
or positioning classes.
A colored-dot legend identifies each role. Interactive fills use shared resting,
hover/focus, pressed, and selected opacity tokens; the grid restores the hand
pointer over these regions. Its filled regions are accessible buttons; no leaders or labels
appear until a region is selected. `AnnotationRegion` composes `AnnotationBand`
with its button, visibility, selected state, and keyboard focus treatment,
while `AnnotationCallouts visibility="selected"` uses `selectedId` and
`onSelectionChange` to coordinate the selected region. Escape, outside clicks,
hiding annotations, and Reset clear the callout. The default `visibility="all"`
preserves persistent labels in anatomy and corner demos.

Corners demonstrates card, standard button,
fully rounded pill, and circular icon-button arcs using the rendered geometry.
`ToolbarTitle` provides the shared title container and typography. Its left inset
comes from `--toolbar-title-padding-start`; both preview-control toolbars and the
With title specimen use it, so title styling changes propagate automatically.

Toolbar is the first component-page adoption of the shared inspection system.
All five examples use `CanvasPreview`, `AnnotationLegend`, and
`AnnotationMeasurements`, plus inline Preview/Code/Reset headers. The page declares
targets only; it does not duplicate measurement, selection, or token logic.
Padding and borders are measured on each toolbar, gaps within action groups, and
bounds on the static title. Flexible spacers and separator margins are not
misreported as CSS gaps. Other component pages receive the shared headers and
Grid-only chrome without measurement configuration or changes to their specimens.

Run `npm run test:preview-tools` for headless desktop/mobile preview regressions.
Install the browser once with `npx playwright install chromium`, or use installed
Chrome with `PREVIEW_TEST_CHANNEL=chrome npm run test:preview-tools`.
The runner starts and stops a dedicated Vite server on port 5185; set
`PREVIEW_TEST_BASE_URL` to use an existing test server instead. Coverage includes
selection, keyboard focus, visibility toggles, Reset, live token changes, access
to the existing controls, and complete code tabs. The existing Toolbar demo
actions remain illustrative; this pilot does not add filtering or editing logic.
Rollout checks also cover ordinary, overlay, table, scrolling, resizable, sidebar,
page, and carousel examples, and enforce separate annotation/measurement opt-ins.

### Automatic measurement

Place `AnnotationMeasurements` alongside the specimen inside `CanvasContent`.
Mark source elements with `data-measure="name"` and pass a `targets` array of
`{ target: "name", label: "Name", kinds: ["padding", "border", "margin", "gap", "bounds"] }`.
Request only the kinds relevant to each target; names must be unique within the
content container. Keep one measurement instance per specimen so its generated
callouts share placement and selection. Preserve an outer `data-annotate` target
to reserve the whole specimen from callout placement.

- Padding, borders, and positive margins are read from computed physical-side
  values. Padding begins inside the border; margins extend outside the border
  box. Zero-size regions are omitted. Margin fills represent computed margin
  extents, not a guarantee of empty space after margin collapsing or overlap.
- Gap measurement supports adjacent in-flow children in a single flex row/column
  or single grid row/column, including reversed order. It uses their actual
  separation and shared cross-axis span, checking against the resolved CSS gap
  with `--annotation-measurement-tolerance`. It does not mistake distributed
  alignment space for gap. Multi-line/wrapped layouts, unresolved percentage
  gaps, and separations that include extra margins are omitted and reported.
- Sources and their gap children are observed for resizing; DOM, class/style,
  font-load, scroll, and resize changes refresh the geometry. Replaced targets
  are observed again. A region that disappears also clears its selection.
- Box-model fills require a single block or inline-block box. Bounds can measure
  inline text's bounding rectangle. Individually transformed targets are omitted;
  axis-aligned scaling of the containing preview is normalized to local CSS pixels.
- `onMeasurementIssues` receives unsupported or missing-target messages; an
  accessible status reports these while annotations are active. Negative margins
  are reported but not painted as positive-width regions.
- `AnnotationRegion` remains available for deliberately authored/custom regions.
  Generated inline coordinates are runtime measurements, not fixed styling values;
  their colors and interaction styling still use the shared annotation tokens.

### Annotation placement

`AnnotationCallouts` measures the rendered label dimensions and keeps one
occupancy map for numbered markers, chips, and corner callouts. The specimen's
outer annotated bounds, controls, labels, canvas rulers, and explicit
`data-annotate-avoid` regions are protected from label overlap. Use one
`AnnotationCallouts` instance per specimen so all its labels are coordinated.

- `side` identifies the preferred target edge or a specific corner. For ordinary
  edge callouts, the dot and connector move to the highlighted edge facing the
  label's final placement. The target element stays the same. Corner callouts
  keep their specific arc and use that corner's computed radius.
- Edge anchor dots and hover/selected outline centerlines sit on the target's
  measured border box, without extra padding or grid snapping. Inline targets
  use their own bounding rectangle, not their parent container's bounds.
  Dotted bounds are always rectangular; separate corner arcs show curvature.
  Hover bounds and connectors share one SVG dotted stroke, controlled
  by `--annotation-line-width`, `--annotation-line-dash`, and
  `--annotation-line-gap`. `--annotation-anchor-radius` controls the anchor dot;
  `--annotation-outline-inset` controls the callout button's focus-ring offset.
- `placement` optionally prefers a label side independently of the initial `side`.
  Otherwise an edge prefers its own side. Automatic corner labels compare the
  two adjacent sides using label size, boundaries, occupied space, and connector
  cost. Top-left considers top/left; top-right top/right; bottom-left bottom/left;
  bottom-right bottom/right. The corner arc and anchor do not move with the label.
  Room preference is capped so a huge empty region cannot justify an unnecessarily
  long connector. Equal scores use a deterministic side order.
- `allowedSides` lists additional alternatives. Omit it to consider every side
  for edge labels or the adjacent pair for automatic corner labels;
  use `locked: true` to prohibit side changes for deliberately authored diagrams.
- Target alignment is preferred, then labels shift or change sides as needed.
  The old `markerAlign` field remains compatible but no longer creates fixed stacks.
- Callouts are native buttons with `aria-pressed`. Hover or keyboard focus previews
  a target; clicking or pressing Enter/Space selects it and retains its bounds
  while the pointer measures elsewhere. Hovering another callout adds its preview
  without hiding the selected bounds. Selecting another transfers selection;
  clicking outside the callouts or pressing Escape clears it. Clicking the same
  callout keeps it selected. Hiding annotations clears selection and makes the
  layer inert. Highlight and press colors use `--annotation-highlight-*` and
  `--annotation-pressed-background`; selection never changes label geometry.
- `--annotation-*` tokens in the shared stylesheet own clearance, label distance,
  boundary inset, connector rounding, and corner/outline geometry.
- `--annotation-boundary-inset` reserves 24px on every side, beyond any ruler
  bands. `--annotation-label-distance-min` and `--annotation-label-distance-max`
  constrain the outward specimen-edge-to-label-edge gap to 16–64px. These are
  not total connector lengths: an anchor inside a specimen may need a longer
  route to reach an external label. Labels compress that gap or change sides
  before violating boundary clearance. Collision clearance remains independent.
- Canvas annotation padding derives from the ruler, boundary inset, minimum
  gap, and `--annotation-label-reserve`, with equal top/bottom space. This adds
  breathing room without forcing a minimum width that would overflow mobile.
- Reserve space with `Canvas annotationSpace`; hidden annotations retain that
  space. The annotation demos now follow this content-driven layout contract.
- If the available space is insufficient, the solver omits only the labels that
  cannot fit, sets `data-layout-status="insufficient-space"`, and announces the
  count through a visually hidden status. `onLayoutOverflow(ids)` lets the host
  show a legend or request more canvas space; an empty list means all labels fit.
  It does not silently draw overlapping labels or grow the host in a feedback loop.

Layout is deterministic, with penalties for moving away from the preferred
side and for connector crossings through protected regions. This is a bounded
placement heuristic, not a guarantee of globally optimal or crossing-free routes.
Targets and labels are remeasured on resizing, content/attribute changes, and
completed transitions; it does not run a continuous animation loop.

Run `npm run test:annotations` for the placement regression tests (Node 22.6+
with built-in experimental TypeScript stripping).

## Adding a component

### Expression Lab expressive treatment

Expression Lab applies the refined Concentric medium-scale vocabulary only in Expressive mode. Original retains its existing component styles. The `--expressive-*` role tokens are defined in `src/index.css`; `src/showcase/experiments/expressive.css` binds them to the app's components. Most role values alias the corresponding Concentric tokens so the two experiments share a source of truth.

- Main titles use 20px/28px bold, body and action labels 16px/24px, metadata and helper text at least 14px/20px. Main text pairs use 8px gaps; profile text pairs use 4px.
- Cards, content regions, and field groups use 24px spacing; related actions and avatar/text pairs use 12px. Existing Card anatomy and footer bands are retained. Columns and choice cards wrap to the available width.
- Labelled actions are 56px high with 16px vertical and 24px horizontal padding. Outline strokes paint inside without changing layout. Icon controls and navigation rows use 48px targets with 24px glyphs. Collapsed navigation avatars remain small enough for their rail.
- Inputs and select triggers use 48px height, 4px vertical/16px horizontal padding, and fixed 12px corners. Textareas use uniform 16px padding and the shared `ResizableTextarea` inset diagonal grip (drag or Arrow Up/Down, Home for minimum). Original mode uses the native Textarea.
- Avatars use 40px expanded slots. Badges stay subordinate at 14px; checkbox and switch indicators scale independently from action buttons. Composer tools remain compact 48px controls, not 56px labelled actions.
- Application dropdowns, the Category select, and the mobile navigation drawer explicitly carry `data-expression` through portals. Menu rows use 48px minimum height and 4px/16px padding, with 8px surface inset and concentric row/surface radii. Experiment controls outside the app are not themed.

Browser regressions cover Expressive/Original switching with state preservation, compact and mobile layouts, dark mode, portaled controls, note editing/resizing/saving, session controls, and chat submission. This is still a scoped experiment, not a global restyle of OneDS.

### Concentric experiment vocabulary

The previews separate three independent rules:

Padding has a 12px minimum. Sliders start and reset at radius 24 (12px padding), with magnetic padding stops at 20/24/28px.

- **Continuous geometry:** every slider value changes spacing and corners, including between magnetic stops. Vertical Card and Edit Project share actual padding and major section gaps of 20/24/28px at the corresponding stops. The form's field-group gap follows the same value.
- **Stepped scale:** typography, media, icons, and control sizes stay normal below 24px padding, medium from 24px to under 28px, and large from 28px.
- **Fixed relationships:** title/description pairing retains its component-owned rhythm. Action gaps stay 8px except in the medium-scale button trial, where they are fixed at 12px.

Shared geometry tokens in `src/index.css` define `--concentric-surface-inset` and `--concentric-section-gap` from the continuous padding value. Both Card-based specimens use these roles, without adding different component offsets to their spacing. Corners retain **component default + offset**, clamped at zero: Card radius starts at `--radius-xl` and control radius at `--radius-lg`. Portaled menus receive the same driver and scale so their geometry does not freeze between stops.

Changing the driver does not mutate global components. Card and Field still own the composition, normal typography, surfaces, and tight relationship gaps; padding and section spacing are intentional experiment overrides. Browser regressions verify the shared spacing at stops and intermediate values, and compare the remaining normal styles against the Card page.

### Concentric typography reference

The approved medium-scale reference (24px padding) applies to equivalent roles across every Concentric specimen, including horizontal compositions, vertical cards, and forms. It is not a global component change or a requirement to use identical sizes at every scale.

| Role | Font size | Line height | Weight | Emphasis |
| --- | --- | --- | --- | --- |
| Main title | 20px | 28px | 700 | Primary foreground |
| Main description | 16px | 24px | 400 | Muted foreground |
| Button label | 16px | 24px | 500 | Button variant foreground |

The title is 1.25 times the reading size. Actions share the reading size and use weight and surface treatment for emphasis. At medium scale, pair two 14px text roles with a 4px gap; larger main title/description pairs use an 8px gap consistently across horizontal, vertical, and form specimens. These are gaps between line boxes, in addition to their line heights.

Medium action-button trial: 16px labels with a 24px line box and 16px top/bottom padding produce a 56px button. Left/right padding follows the shared surface inset (24px at the medium stop), matching the Card-based dialog/form padding and changing continuously with it. The gap between buttons is fixed at 12px. The outline is painted inside without consuming layout space; focus rings remain available. This applies to specimen action rows only, not inputs, menus, icon triggers, or preview controls. Normal and large buttons remain unchanged pending comparison, so this trial is intentionally not a finalized monotonic size ramp.

Medium-scale rule: specimen text must be at least 14px. Supporting roles use 14px/20px; weight and color establish hierarchy without smaller text. This applies to all medium-scale specimens and their menus, not the preview rulers or measurement labels.

| Role | Font size | Line height | Weight | Emphasis |
| --- | --- | --- | --- | --- |
| Status badge | 14px | 20px | 500 | Badge variant foreground |
| Profile name | 14px | 20px | 500 | Primary foreground |
| Profile description or recency | 14px | 20px | 400 | Muted foreground |

The medium hierarchy is 20 / 16 / 14px. A status badge remains quieter than a button label. Profile names use medium weight and primary foreground; descriptions use regular weight and muted foreground. Normal and large scale definitions are unchanged.

At medium scale, the profile avatar is 40px square with a fixed 12px avatar-to-text gap. Its two 20px text lines plus the 4px pairing gap make a 44px text block. The row centers the avatar and text vertically; badge spacing is independent.

Edit Project uses the same medium rules: 20/16px heading pair with an 8px gap, 24px surface/section spacing at the snap point, 14/20px helper and error text, and the medium action buttons above. The Notifications label/helper pair uses an 8px gap (16px label, 14px helper), with 12px between that text block and the switch.

Medium fields: text inputs and select triggers have an explicit 48px height with 4px top/bottom and 16px left/right padding. The 24px text line remains vertically centered; height is independent of padding plus line height. Textareas use uniform 16px padding on all sides, with a three-line minimum rather than a fixed single-line height. Select and project-menu rows use a 48px minimum height and 4px/16px insets; select rows reserve additional space for the checkmark. Menu surfaces use 8px padding. Medium action buttons remain 56px high.

Concentric text inputs, textareas, and select triggers use a fixed 12px field radius (`--concentric-field-radius`), independent of scale and the corner-radius slider. Textareas use equal padding on all four sides at each scale. The preview's resize handle is inset 4px from the bottom and end edges, derived from the corner radius; dragging or Arrow Up/Down resizes vertically and Home restores the minimum height. Example Reset clears manual sizing. Buttons and popup surfaces retain their separate shape rules.

### Button group choices

`ButtonGroupChoice` and `ButtonGroupChoiceItem` in
[src/components/ui/button-group.tsx](src/components/ui/button-group.tsx) provide
immediate single selection using the existing ButtonGroup layout and outline
Button styling. No new surface, color, or shape treatment is applied on selection;
button widths include the checkmark and gap in both states. Unselected labels
are centered; selection animates the label aside while fading in the checkmark.
The icon and label then center as a unit. Motion uses `--button-group-choice-*`
tokens and is disabled for reduced-motion preferences.

Supply `value` with `onValueChange` for controlled use, or `defaultValue` for
uncontrolled use. The initial value must match a non-empty item value. Clicking
the selected item cannot clear the selection. Give the group an accessible label;
Radix supplies radio semantics and roving keyboard focus, including disabled items.
Regular ButtonGroup and ToggleGroup behavior is unchanged.

### Via the shadcn MCP (VS Code)

The MCP server is configured in [`.vscode/mcp.json`](.vscode/mcp.json):

```json
{
  "servers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}
```

1. Open `.vscode/mcp.json` in VS Code and click **Start** above the `shadcn` server
   (or run **MCP: List Servers** → Start).
2. In Copilot Chat (agent mode), ask in natural language, e.g.:
   - "Show me all available components in the shadcn registry"
   - "Add the `popover` and `hover-card` components to my project"
   - "Build a login form using shadcn components"
3. The agent installs the component(s) into `src/components/ui/` via the shadcn registry.

After adding a component, expose it in the showcase by adding an entry to the
matching file under [src/showcase/demos](src/showcase/demos).

### Via the CLI

```bash
npx shadcn@latest add <component>   # e.g. npx shadcn@latest add popover
```

## Project structure

```
src/
  components/
    ui/              # shadcn components (generated)
    code-block.tsx   # code viewer with copy button
    mode-toggle.tsx  # light/dark theme toggle
  showcase/
    generated-example-code.ts # generated source for variant Code views
    types.ts         # shared ComponentEntry type + category order
    registry.tsx     # aggregates all demo files into the registry
    demos/           # one file per category (forms, overlays, data, ...)
  hooks/             # generated hooks (use-mobile)
  lib/utils.ts       # cn() helper
  App.tsx            # showcase layout (sidebar + component pages)
  main.tsx           # providers (theme, tooltip, toaster)
  index.css          # Tailwind + shadcn theme tokens
scripts/
  generate-showcase-code.mjs # extracts variant source from TSX demos
components.json      # shadcn config
.vscode/mcp.json     # shadcn MCP server
```

## Installed components

The showcase contains 65 component pages, including the complete installed
shadcn/ui catalog plus Data Table, Date Picker, Questionnaire, and Typography
compositions. They are grouped into Forms, Selection, Overlays, Navigation,
Data Display, Feedback, Layout, Chat, Date, and Utilities.
