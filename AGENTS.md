# OneDS Agent Instructions

Before changing component appearance, behavior, or API, consult the applicable
approved rules in [Design Rules](public/design-rules.md). Reuse rules already read
in the current session; do not reread the full generated document. Showcase-only
editorial cleanup that does not change component styling, interaction, layout, or
responsive behavior may rely on the summary in this file. Its canonical source is
[rules.json](src/design-system/rules.json); the showcase at `#/rules` renders the
same data. Candidate rules are proposals: do not promote them without user approval.

## Work Within the System

- Always use Material Symbols Rounded for system icons, without exception for new icon work.
  Import named icons from `src/components/ui/icons.tsx`, including in showcases.
  Glyph mappings and font rendering belong only in
  `src/components/ui/icon-adapters/material.tsx`. `icon-adapters/active.ts` is the
  single build-time adapter selection; only the public named module imports it.
  `Icon` accepts a library-independent React SVG glyph and owns presentation.
  Never add another icon library, local icon paths, or static outline/filled swaps.
  Extend the active adapter and public named module for missing glyphs. A future
  library change requires explicit approval, a compatible adapter, and updated policy
  checks; no runtime provider or multi-library bundle. Keep sizes and font axes in tokens;
  selected buttons animate the font's FILL axis from 0 to 1, not CSS path fill or stroke weight.
  Reduced motion changes the fill immediately. After adding a symbol run
  `npm run icons:update-font` to refresh the checked-in official WOFF2 subset and
  manifest; builds and browsers must never fetch Google Fonts at runtime. Favicons remain brand
  images; shapes, charts, annotation connectors, and popover arrows are not icons.
  Run `npm run test:icons` for icon changes; generated examples follow the same rule.
- First and most important: build every interface from OneDS components under `src/components/ui`
  and their named parts. Never recreate their styling or behavior locally in a page.
- Inspect the library first. Extend the owning component for a missing capability; if no suitable
  component exists, create a reusable tokenized component, add its showcase example, and use it.
- Plain semantic content is allowed inside component slots. Keep product data and orchestration
  local, but all reusable appearance and interactions must be owned by library components.
- Keep design values in `src/index.css` tokens, not arbitrary markup values or inline styles.
- Showcase pages have Default (`surface: "default"`) and Large (`surface: "application"`)
  tiers only. Standard pages use the app-width column and a content-driven canvas with a
  tokenized 200px minimum. Reserve the roomy viewport layout for examples that explicitly
  need it; preserve component-owned canvas anatomy and existing large application previews.
- Button has two tiers: `default` (40px) and `expressive` (56px).
  Icon counterparts are `icon` and `icon-expressive`, with matching square geometry.
  Do not use retired `lg`, `sm`, `xs`, or their icon counterparts on Button.
- Button has no `outline` variant. Use `ghost` for isolated icon-only actions/groups;
  use `tertiary` (the neutral default) for general and supporting actions, including beside
  search, dropdown/select, or mixed controls. Choose `primary` for strong purple emphasis
  and `secondary` for light-purple emphasis only when needed. `default` aliases `tertiary`.
  Preserve destructive, link, and selected-state intent. Field-internal affordances may stay ghost.
  Choose explicitly in the composition; do not infer the variant by inspecting the DOM.
- Reserve Primary for prominent calls to action, never selection. Secondary selects from
  light purple to dark gray-purple; Tertiary selects from neutral to the Secondary light-purple
  fill. Use the shared `selected` state and paired text, shape, and icon feedback, including
  inside ButtonGroupChoice. Do not simulate selection by switching the variant to Primary.
- Follow the 4px spacing/control grid, natural-case typography, fixed radii for
  growing inputs, and motion-token conventions in the full rules.
- Concentric corners are non-negotiable. For every uniformly nested rounded UI,
  derive the inner radius from the actual outer radius minus the actual edge-to-edge
  inset, including border and padding where present, and clamp at zero. Verify this
  equation independently for each host; matching inner radii across differently
  shaped hosts is not evidence of concentric geometry.
- "Icon + label" always includes icons, favicons, and loading spinners. All three use
  `--graphic-label-gap` (8px), including expressive contexts; `--button-gap` aliases it.
  These combinations use `IconLabel` and `--icon-label-optical-padding`
  for a 4px correction opposite the graphic: left icon -> right label padding, right
  icon -> left label padding. Keep Button's icon-label gap at 8px. Button handles ordinary labels automatically;
  rich custom labels and new component families must compose the shared part explicitly.
  Do not add local padding or apply the correction to text-only/icon-only controls.
- Favicon owns brand-specific theme adaptation. GitHub is monochrome and adapts to
  light/dark and primary-button surfaces automatically; do not invert all brand favicons locally.
- Button motion uses separate `--button-spatial-*` and `--button-effects-*` speed/curve
  tokens mapped to Material Expressive fast web conversions. Never spring color/opacity,
  delay actions for animation, or restore `transition-all`. This is a Button-only CSS
  spring approximation; do not retheme other component motion without approval.
- Button press feedback is a tokenized push/compression, not corner morphing.
  Keep the radius-morph implementation reserved behind `data-press-effect="morph"`;
  default buttons retain their corners. Reduced motion removes spatial feedback.
- Preserve native/primitive accessibility and existing interactions. Inspect actual border-box
  geometry; do not infer compliance from a token name or a screenshot alone.
- Existing exceptions are not precedents for new work. Migrate legacy geometry deliberately;
  do not broadly resize unrelated component families without approval.

## Change and Verify

- Record new, durable design rules in `src/design-system/rules.json`, including scope,
  exceptions, evidence, implementation paths, and honest enforcement status. Implementing an
  existing rule or tuning a value does not require a new rule or edits to README, PRDs, and
  memory. Update only documentation made inaccurate by the change; avoid duplicating history.
- Before editing, choose the applicable row below, the cheapest check that could expose the
  defect, and the required gates. Treat this as the default verification ceiling, not a starting
  checklist. For mixed changes, combine only applicable gates and deduplicate shared checks.
- Fast path for a trivial, self-evident change (one known token or class in one or two files,
  no API, layout, or interaction shift): skip broad context-gathering and memory review, make the
  edit directly with a uniquely anchored patch, then run typecheck and touched-file lint together
  once. Do the browser check only when the change can alter rendered output, and cap it at one
  focused rendered check. When a rendered check on the shared hidden tab reads a frozen or
  mid-transition value, finish the CSSTransition before measuring instead of re-probing. Stop when
  those pass; do not rerun overlapping suites for reassurance.

| Change | Verification budget |
| --- | --- |
| Showcase-only editorial cleanup | For demo JSX, run touched-file lint and `npm run test:showcase-code` once. For copy or metadata only, review the diff and check whitespace. Skip workspace typecheck and browser checks unless component styling, API, layout, interaction, or responsive behavior changes. |
| Small visual/token adjustment | Typecheck and touched-file lint once, plus one focused rendered check of the affected geometry or state. No full browser suite or build. |
| Interaction or component API | Relevant behavior tests and typecheck/lint. Include affected consumers for shared API changes; desktop and mobile when responsive layout or input modality is at risk. |
| Documentation or agent instructions only | Review the diff and check whitespace. No typecheck, build, browser, or unrelated rule tests. |
| Canonical design rules | Generate Markdown once and run `npm run test:design-rules`. Do not run UI tests unless rendered behavior also changes. |
| Broad migration or release validation | Typecheck, full lint, rule and snippet checks, and affected browser regressions. Build for release validation or bundling/asset/configuration changes; keep output quiet. |

- Stop when the scoped check and required gates pass. Add another check only for a named,
  uncovered risk or a concrete failure, not for reassurance. A shared component filename alone
  does not make a small change a broad migration. Do not run full suites by default.
- For a small visual change, use one representative viewport. Add another viewport or input
  modality only when responsive layout or input behavior is affected. Check both appearance
  modes when their colors change, within the same focused check where practical.
- After the first substantive edit, run the cheapest focused check that can expose a defect.
  Reuse that successful result at close-out; do not run it again inside a larger suite merely
  for reassurance. Rerun only checks invalidated by subsequent edits or a concrete failure:
  test-only edits do not invalidate an application typecheck; docs-only edits do not invalidate
  UI checks. Do not repeat typecheck/lint at close-out if their checked source is unchanged.
- Regenerate only changed artifacts. For rule changes use `npm run rules:generate`;
  never edit generated Markdown. For demo changes use `npm run showcase:code` OR
  `npm run test:showcase-code` (which already generates code), not both.
- Run snippet compilation when demo code, component APIs used by snippets, or the generator
  changes. CSS-only component tweaks do not require regenerating or compiling unchanged demos.
- Scope Playwright by file and a precise test title. Its `--grep` also matches filenames:
  broad terms such as `toolbar` can accidentally select an entire file. Do not change worker
  counts just to accelerate a small task; reduce the test selection first.
- Prefer one rendered measurement/interaction check for small changes. Add at most one
  screenshot when appearance cannot be judged from that check; do not take one automatically.
- Keep progress updates brief and outcome-focused; avoid narrating each successful command.
- Reuse context already read in the current task unless the file changed or a specific detail
  is missing. Do not create a memory entry for every small tweak or repeat the same result in
  progress updates, documentation, and memory.
- Use the already-shared browser and running dev server when available. Do not switch focus
  or open a second page unnecessarily. Keep production build output quiet.
- Preserve unrelated worktree changes; never commit or deploy unless requested.