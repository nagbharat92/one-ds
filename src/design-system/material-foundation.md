# Material foundation

## Sources and scope

Surface rollout approved September 7, 2026: neutral surface colors, paired
foregrounds, and boundaries now apply globally through shared tokens. Accent
schemes, component geometry, motion, and shadow geometry remain separate.

| Layer | Authority | Implementation |
| --- | --- | --- |
| System color vocabulary and foreground pairs | [Material Web color](https://material-web.dev/theming/color/) | Canonical `--md-sys-color-*` variables |
| Website palette | [Material website](https://m3.material.io/styles/color/resources) and [its inspected stylesheet](https://m3.material.io/static/angular/styles.4c2805e602edc472.css) | `--theme-website-<role>-light/dark` in [index.css](../index.css), read by [color-theme.ts](../lib/color-theme.ts) |
| Interaction state layers | [Material state layers](https://m3.material.io/foundations/interaction/states/state-layers) | `--md-sys-state-*-state-layer-opacity` in [index.css](../index.css) |
| Generated schemes, retained but not selected | [Material Color Utilities guide](https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md) | Pinned package 0.3.0; no custom palette generation for this migration |
| Shadow elevation | Existing OneDS tokens, not represented as Material specifications | `--elevation-flat/raised/floating` unchanged |

The website has a custom palette. Its values must not be described as the stock
Tonal Spot or Expressive output. Current support is the 25 verified/mapped roles,
not a claim that every Material role or component has been migrated.

## Components

`MaterialTheme` in [material-theme.tsx](../components/ui/material-theme.tsx)
selects the verified website palette and compatibility adapter. It follows the
existing appearance provider. It has no hue, contrast, scheme, or neutral-button
controls. `asChild` preserves the child's component slot and avoids a layout
wrapper. Existing `ColorThemePortal` carries its context into portaled content;
Sidebar already applies this bridge to its mobile Drawer.

Neutral roles come from :root/.dark rather than local inline copies. MaterialTheme
and ColorThemePortal apply only the website's accent-role overrides, so changes
to a shared neutral source reach ordinary components, themed regions, and portals.

`MaterialSurface` in [material-surface.tsx](../components/ui/material-surface.tsx)
selects Surface or one of the five Surface container levels, with On surface or
On surface variant. It now works globally, without requiring MaterialTheme. It applies only fill and content
color: it does not invent padding, corners, shadow, elevation, or interactions.
The Colors role inspector retains the explicit role/foreground samples.
Card remains separate; all Card consumers now receive the same shared surface colors.

```tsx
import { MaterialTheme } from "@/components/ui/material-theme"
import { MaterialSurface } from "@/components/ui/material-surface"

export function ThemedRegion() {
  return (
    <MaterialTheme>
      <MaterialSurface surface="surface-container-low" content="on-surface">
        Project activity
      </MaterialSurface>
    </MaterialTheme>
  )
}
```

## Compatibility and component mapping

Existing OneDS components retain their public APIs. Neutral semantic aliases map
to Material roles globally; authored palette values have one source in index.css.
Edit `--theme-website-<role>-light/dark` to change a surface everywhere, including
the page and native body portals. Components must not use border tokens as fills.
These component assignments are explicit OneDS choices,
not new Material specification values.

| Consumer | Fill | Content |
| --- | --- | --- |
| Page and Canvas | Surface (light); Surface container low (dark), through `--page-fill` | On surface |
| Card | Surface container lowest | On surface |
| Card footer | Surface container low | On surface |
| Enabled field rest fill (Input, Textarea, Select, NativeSelect, InputGroup, Combobox chips, OTP, Questionnaire input/choices) | Translucent On surface tint over the host surface | On surface (value); On surface variant for placeholders and affordances |
| Disabled field fill | Surface container | Existing disabled opacity retained |
| Navigation surface | Surface container | On surface |
| General interaction backplate | Surface container highest | On surface |
| Default supporting Button | Secondary container | On secondary container |
| Default tab indicator and general control surface | Surface container low | On surface |
| Slider thumb | Surface container lowest | Existing ring role |
| Website selected navigation and filled tabs | Secondary container | On secondary container |
| Primary Button (explicit) | Baseline Primary P40/P80 | On primary |
| Secondary Button (explicit) | Secondary container | On secondary container |
| Tertiary Button (default) | Surface container highest | On surface variant |
| Link Button | Transparent | Website Primary |
| Popover/menu | Surface container high | On surface |

Primary uses baseline P40/P80 with the existing On primary text pair.
Secondary retains Secondary container/On secondary container. Tertiary uses
the warm neutral Surface container highest/On surface variant pair. Public variants are
`primary`, `secondary`, and `tertiary`; omitted variants and `default` use Tertiary.
Choose Primary or Secondary only when emphasis is needed. Pink Tertiary container is reserved for later selective
FAB treatment; no FAB-specific implementation is included in this change.

## Button color tuning

Adopted comparison: **Destructive** now uses Material Error40/Error80 as its
background tint source globally. The old destructive background palette and
`destructivePalette` option are removed. `--button-destructive-color` references
`--button-material-error`; existing10/20/30% light and20/30/40% dark tint states
remain. Text and focus colors are unchanged. Primary, Secondary, and Tertiary
are distinct treatments; `default` now aliases neutral Tertiary, not Primary.

### Selected state

All named icons inside selected Buttons animate Material Symbols Rounded's
variable FILL axis from 0 (outlined) to 1 (filled). This interpolates the real
font outlines, not opacity between assets or CSS path fill. `ButtonSelectionIcon`
remains a decorative slot, inheriting foreground and host sizing; the Button
retains the accessible name. Timing uses `--material-icon-fill-speed` and
`--material-icon-fill-curve`, mapped to Button effect tokens. Reduced motion
removes interpolation, not the filled state. The local subset font preserves
FILL 0..1 and optical size 20..48 at weight 400. Some simple symbols have identical
outlined and filled forms. Source: https://developers.google.com/fonts/docs/material_symbols.

`Button selected={boolean}` is controlled by its caller's `onClick`; it does not
invent a second selection store. It exposes `aria-pressed`, and disabled Buttons
retain native disabled semantics. Use selection on Secondary or Tertiary. Primary
is reserved for prominent calls to action and ignores `selected`; choice-group
items exclude Primary. Omit selected for an ordinary action Button.

[Material Button specs](https://m3.material.io/components/buttons/specs) specify
round-to-square selection by default, and square-to-round when the starting
shape is square. OneDS uses the latter, as requested. Selection-enabled buttons
start at12px corners for40px buttons and16px for56px buttons (Material small and
medium square measurements); selected radius is half the tier height20px/28px.
The existing Button size tiers are preserved. The radius transition uses existing
spatial tokens; reduced motion removes interpolation, not the persistent shape.
Ordinary buttons and their push feedback are unchanged. Connected-group neighbor
resizing and Material's transient press morph are not part of this addition.

Tertiary selection colors: unselected Surface container highest/On surface variant;
selected Secondary container/On secondary container, the light-purple Secondary
button pair. Secondary: unselected Secondary container/
On secondary container, selected Secondary/On secondary. Color tokens are
component-owned, including `--button-selected-secondary-fill/ink`. This OneDS
hierarchy gives Secondary stronger selection emphasis and Tertiary quieter emphasis;
neither uses the Primary CTA palette for selection.
The showcase keeps labels stable and includes mouse/keyboard, icon, and disabled
examples. Width and height remain unchanged during selection.

### Earlier color decisions

The notes below record superseded trials; the adopted tint above is authoritative.

Latest decision: the user rejected solid Error backgrounds for Destructive.
Restore the earlier translucent red treatment through named opacity tokens:
light rest/hover/press10%/20%/30%, dark20%/30%/40%, mixed with transparent in
OKLab using the existing destructive color. Filled baseline P40/P80 remains.
Text colors are unchanged. This supersedes the Destructive fill described below.

Background-only correction, September 8: Filled now uses Material Web v0.192
baseline P40 `#6750a4` in light mode and P80 `#d0bcff` in dark mode. Destructive
uses Error40 `#b3261e` and Error80 `#f2b8b5`, with opaque tokenized state fills.
Source: [reference palette](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-ref-palette.scss)
and [role mapping](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-color.scss).
These values live in `--md-ref-palette-primary40/primary80/error40/error80` in
index.css; Button aliases consume them. Website palette tokens remain intact
for links and other existing consumers. The former website purple was already
tone40.3 but chroma69.9; baseline P40 is tone40.1/chroma47.9. Tone alone does not
specify saturation.

Only backgrounds changed in this pass. Existing primary, secondary, destructive,
and link text colors and focus colors are preserved. Destructive text is still
the existing red on the new Error fill and is **not contrast-certified**; it
requires the explicitly deferred foreground pass. Tonal backgrounds remain
the existing website Secondary container pair. No new palette is inferred from
the supplied screenshot.

Button colors were adopted globally on September 8, 2026. Tune
`--button-primary-fill`, `--button-primary-ink`, `--button-primary-state-ink`,
`--button-secondary-fill`, `--button-secondary-ink`, and `--button-link-ink` in
index.css. These alias the established website palette in each appearance.
Generic `--primary` and `--secondary` remain separate so button tuning does not
recolor unrelated selection indicators or badges. Explicit custom themes retain
their own mappings.

Filled buttons calculate opaque sRGB hover/pressed mixes locally from their
fill and state foreground, using the existing 8%/10% state tokens. Filled
uses On primary in resting, hover, and pressed states. This supersedes the
earlier pink search-button mapping and its alternate interaction foreground.
Tests cover both sizes and modes, actual mouse/press states, disabled opacity,
source-token propagation, and unchanged generic aliases. Website accent variables
now reference CSS source tokens rather than applying cached hex copies.
Ghost/destructive styles, focus indicators, disabled semantics, dimensions,
corners, and motion are unchanged. Disabled buttons retain the existing 50%
opacity; disabled-label contrast is not certified as enabled-label contrast.

Website `background` maps to Surface, `surface-0..4` to the five container levels,
and `surface-variant` to the Outline variant fallback. These are adapter choices.
Strong tertiary, fixed families, surface dim/bright, and error system roles not
verified from this website preset remain unsupported. Do not generate substitutes
to make the role table appear complete. Existing status/chart/brand consumers
keep their palettes until their own migration. Alert is one deliberate extension:
its Success and Warning roles derive from OneDS presence status sources, while
Neutral, Info, and Error use supported Material-informed roles. These Alert roles
are component tokens, not additions to the Material role table.

## States and elevation

Material specifies a single state layer derived from the content color, between
container and content: hover 0.08, focus 0.10, pressed 0.10, dragged 0.16.
Legacy percentage tokens alias these canonical numeric tokens without changing
their values. Navigation uses On surface at 8% opacity; selected
navigation and Button state mixes use their respective foregrounds. Full state
behavior remains subject to component-by-component verification; existing
non-migrated states and interpolation policies are not declared certified.

Surface container roles are explicit color choices. Do not additionally apply
the older 5/8/11/12/14% primary tonal-elevation overlays. Shadows and interaction
layers are independent. This phase deliberately does not replace OneDS shadows
or claim they match Material elevation.

Field hover/pressed colors composite the foreground over their field fill at
the shared state opacity. Disabled fields use a surface role rather than an
outline-color blend. The existing black 10% dialog/drawer scrim is unchanged
visually but now has one `--overlay-scrim` token. Status, charts, images, and
deliberately transparent/state-layer surfaces are not flattened into opaque fills.

## Migration ledger

| Consumer | Status | Verification |
| --- | --- | --- |
| Colors application/role inspector | Adopted | Exact light/dark paints, MaterialSurface pairs, tabs, portals and mobile bounds |
| Site navigation | Adopted | Search/routing, selection, light/dark, desktop collapse/reopen, mobile Drawer |
| Site content chrome and floating reopen control | Surfaces adopted | Shared global background/control tokens |
| Component previews and pages | Neutral surfaces adopted | Live source-token propagation through cards, fields, tabs, diagrams and body-portaled dialogs |
| Global neutral palette | Adopted | :root/.dark role mappings and shared compatibility aliases |
| Button action colors | Adopted globally | Purple Filled, lilac Tonal, purple link, paired states, propagation, favicon and motion regressions |
| Other action/selection palettes and shadow geometry | Unchanged outside existing MaterialTheme scopes | No wholesale selection or shadow migration |

New pages receive neutral surfaces automatically; MaterialTheme remains the
explicit website accent opt-in. Reusable corrections belong to the component
or central token adapter, not page-local CSS. Remove compatibility
aliases only after their last consumer migrates. No dependency, build, commit,
or deployment is required just to opt another bounded consumer into the theme.