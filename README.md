# OneDS

A clean React + Vite + Tailwind + [shadcn/ui](https://ui.shadcn.com) foundation with a
component showcase site. This is the Phase 1 baseline: standard shadcn defaults,
no custom theming yet.

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

`npm run dev` serves the component showcase, modeled on shadcn's docs site:

- **Sidebar** grouped by category, listing all installed components.
- **One page per component** (hash-routed, e.g. `#/dialog`).
- Each page stacks every named variation as its own live preview.
- Every example includes Preview/Code controls, Reset, and an in-page index.
- Preview and Code share one stable height; long snippets scroll inside the panel.
- Demo links and forms simulate actions without leaving or reloading the showcase.

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
