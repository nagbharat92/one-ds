# OneDS: portable context digest

Written 2026-09-11 from the repo at `~/Documents/SideProjects/oneds` (branch `main`, HEAD `94f53f1`, clean worktree). This is a working reference for brainstorming without the codebase open. It is a snapshot, not canonical. The canonical sources are `src/design-system/rules.json` (rules), `AGENTS.md` (agent conventions), and `README.md` (implementation record).

---

## 1. What OneDS is

A personal design system built as a React showcase. Surface description: React 19 + Vite + Tailwind v4 + shadcn/ui, 65+ component pages, hash-routed, with Material 3 as the color and icon foundation.

Real description: **a design system whose primary consumer is an agent.** The first approved rule states it directly: *"OneDS is a self-serving library for agents. Refinements must be made once in the owning component or token and propagate to every consumer."*

Three mechanisms carry that intent:

1. **Decisions as data.** `rules.json` is the single source. It generates `public/design-rules.md` (agent-readable) and renders at `#/rules` (human-readable). Each rule carries scope, rationale, exceptions, evidence, implementation paths, and an honest enforcement status.
2. **Proof by measurement.** A built-in inspection toolkit: canvas rulers, computed-style box-model overlays, a deterministic annotation-placement solver. `AGENTS.md`: *"Inspect actual border-box geometry; do not infer compliance from a token name or a screenshot alone."*
3. **A verification budget.** A table capping test effort by change class, with an explicit instruction to stop when scoped checks pass rather than run suites for reassurance.

There is also a personal-practice layer: the AI Chat block's side-panel example is pinned to 360px, annotated in CSS as *"Chrome's kSidePanelDefaultContentWidth."* The system doubles as a rehearsal space for browser and AI surfaces.

---

## 2. Stack and commands

**Stack:** React 19, TypeScript ~6.0, Vite 8, Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (`style: radix-nova`, `baseColor: neutral`, CSS variables), Radix + Base UI primitives, Geist font, Material Symbols Rounded (self-hosted 42KB WOFF2 subset with FILL axis), `@material/material-color-utilities` pinned at 0.3.0, Playwright, oxlint.

**Notable deps:** flubber (shape morphing), recharts, cmdk, react-hook-form v8 beta, zod, next-themes, vaul, embla, react-markdown + remark-gfm/math + katex.

```bash
npm run dev                  # showcase on :5173 (regenerates rules + showcase code first)
npm run build                # tsc -b && vite build
npm run lint                 # oxlint + icon policy tests
npm run rules:generate       # rules.json -> public/design-rules.md (never edit the .md)
npm run test:design-rules    # rule registry + generated markdown + Button token/API contract
npm run test:icons           # icon adapter boundary + glyph mappings
npm run test:color-theme     # 100 seed combos, both modes
npm run test:annotations     # placement regressions (Node 22.6+)
npm run test:showcase-code   # regenerate snippets + typecheck each independently
npm run test:preview-tools   # Playwright desktop/mobile
npm run icons:update-font    # after adding a Material symbol
npm run showcase:code        # regenerate demo snippets only
```

`npm run test:showcase-code` already generates; do not also run `showcase:code`.

---

## 3. Repo map

```
AGENTS.md                       agent conventions (read before UI work)
README.md                       998 lines: spec + changelog + rationale log
components.json                 shadcn config, iconLibrary: material-symbols
PRDs/
  README.md                     review of the briefs; says what is historical vs current
  oneds-phase-2-expressive-system-prd.md   charter (wins conflicts)
  oneds-phase-2a-expression-lab-prd.md     lab as decision surface
  oneds-phase-2b-color-harmonies-prd.md    color (foundation approved; harmonies deferred)
  oneds-phase-2c-form-language-prd.md      shape/scale/type/containment + research + rubric
  oneds-phase-2d-motion-character-prd.md   motion families + Button pilot
  oneds-phase-2e-component-recipes-prd.md  variant vs recipe vs block-specific
  oneds-phase-2f-ai-chat-pilot-prd.md      expression in a real block
  oneds-phase-2g-adoption-governance-prd.md promotion/retirement policy
  oneds-sidebar-design.md                  sidebar spec + 6-step build order
src/
  index.css                     4,927 lines: ALL tokens, heavily commented with rationale
  App.tsx                       showcase shell (sidebar, pages, preview/code tabs)
  design-system/
    rules.json                  canonical rules (22)
    material-foundation.md      role mappings, sources, migration status
    shape-experiment.md         23 silhouettes, flubber morph notes
  components/ui/                ~110 components (the library)
    icon.tsx, icons.tsx, icon-adapters/{active.ts,material.tsx}
    canvas*.tsx, annotation*.tsx, cursor-follower.tsx   (Preview Tools)
    ai-composer.tsx, message*.tsx, response.tsx         (chat surface)
    material-theme.tsx, material-surface.tsx, color-theme.tsx
  showcase/
    registry.tsx, types.ts
    demos/                      one file per category
    experiments/                concentric, expressive, pointer, shapes
scripts/                        generators + node tests
tests/                          7 Playwright specs
public/design-rules.md          GENERATED; never hand-edit
```

**Showcase categories (order):** Blocks, Experiments, Preview Tools, Forms, Selection, Overlays, Navigation, Data Display, Feedback, Layout, Chat, Date, Utilities.

**Blocks:** one, `AI Chat` (plus a 360px Side panel example).
**Experiments:** Expression Lab, Concentric, Pointer, Shapes, Colors.

---

## 4. The 22 rules (20 approved, 2 candidate)

Enforcement reality: **1 automated, 15 partially automated, 6 manual review.**

### Foundations
- `composition.shared-anatomy` (Required) Build everything from OneDS components. Inspect the library first; extend the owning component; if none fits, create a reusable tokenized component + showcase example. Never duplicate styling or behavior at a call site. Plain semantic HTML may carry content inside slots; product data and orchestration stay local.
- `icons.material-symbols` (Required) Material Symbols Rounded is the only approved library. Import named icons from `components/ui/icons.tsx`; only that module imports `icon-adapters/active.ts`. Selected buttons animate the font's FILL axis 0 to 1. No other icon packages, local icon paths, static filled swaps, or runtime providers. Favicons are brand images, not icons. Shapes, charts, annotation connectors, popover arrows are not icons.
- `appearance.no-shadows` (Required) No decorative shadows anywhere, including FABs, cards, menus. Elevation tokens resolve to none. Separate surfaces with color, spacing, shape, boundaries. Focus rings and deliberate boundary rings are exempt.
- `foundations.tokens` (Required, manual) All colors, spacing, dimensions, radii, typography, motion come from named tokens in `src/index.css`. Change the token, not the markup.

### Color
- `color.surface-accent` (Required) Neutral Material surface roles are global. Page/canvas = Surface; cards = Surface container lowest; footers and general controls = Surface container low; navigation and muted = Surface container; popovers/menus = Surface container high; enabled fields and interaction backplates = Surface container highest. Pair with On surface / On surface variant. Outline is for boundaries, never fills.
- `controls.button-colors` (Required) Three variants: Primary (accent purple P40/P80), Secondary (light-purple Secondary container), Tertiary (warm neutral Surface container highest). `default` aliases Tertiary. Primary is reserved for prominent CTAs, ignores `selected`, and is excluded from choice groups. Tertiary selects to light purple; Secondary selects to dark gray-purple. Destructive uses Material Error40/Error80 tint at 10/20/30% light, 20/30/40% dark.

### Controls
- `controls.button-scale` (Required, **fully automated**) Two tiers only: `default` 40px, `expressive` 56px, measured including borders. Icon counterparts `icon` / `icon-expressive` are square. Default = 20px icons + 16px horizontal padding; Expressive = 24px icons + 24px padding. `lg`, `sm`, `xs` are removed, not deprecated.
- `controls.supporting-actions` (Required) Button has no `outline` variant. Tertiary for general and supporting actions including Cancel and anything beside search/select/mixed tools. Ghost for isolated icon-only actions and field-internal affordances. A split layout does not imply primary emphasis. Never infer emphasis from the DOM.

### Geometry and spacing
- `geometry.control-grid` (Required) 4px multiples for authored spacing and control heights, measured on the full border box. Labelled widths stay content-driven; icon-only controls are square.
- `geometry.contextual-button-shapes` (Required) Related controls share a resting shape. Square tabs get square Reset; pill search gets round icon action. Set `ButtonGroup shape="square|round"` explicitly in the composition. Never detect neighbors at runtime.
- `geometry.nested-button-groups` (Required) `--button-group-nested-gap` 12px between nested groups, `--button-group-gap` 4px within. Owned by shared ButtonGroup styling, not local margins.
- `geometry.icon-label-optical-spacing` (Required) "Icon + label" means icon, favicon, or spinner. All use 8px `--graphic-label-gap`. Add 4px `--icon-label-optical-padding` on the label's outer side opposite the graphic, via `IconLabel`. Left icon, right label padding. Text-only and icon-only get nothing; a label flanked on both sides gets nothing.
- `geometry.purpose-based-radii` (Required) By purpose, not size: compact controls and dense tiles 8-12px, standard cards 16px, expressive tiles 24px, large feature surfaces 32px when warranted. Fixed named tokens, never percentage/pill on growing cards. Shape-gallery tiles: 16px unselected, 32px selected, previewed on mouse-down.
- `geometry.concentric-corners` (Required, manual) Inner radius = outer radius minus actual edge-to-edge inset (border + padding), clamped at zero. Assumes uniform nesting; a small object floating inside a larger one does not share the corner center.
- `geometry.growing-controls` (Required, manual) A growing composer or multiline input uses a fixed radius from its resting geometry, never an unbounded pill.

### Typography
- `typography.natural-case` (Required, manual) No uppercase transforms on labels, headings, tags, eyebrows. Hierarchy from size, weight, muted foreground. Genuine acronyms and code identifiers are preserved.
- `typography.role-pairs` (**candidate**, Recommended) Keep size and line height paired; separate heading/body/metadata by role; do not multiply every size when a region becomes expressive.

### Motion
- `motion.speed-tokens` (Required) Named speed and curve tokens with component aliases. Spatial motion may overshoot; color and opacity must not. Button press = 2px down + 3% compression, spatial 350ms `cubic-bezier(0.42, 1.67, 0.21, 0.90)`, effects 150ms `cubic-bezier(0.31, 0.94, 0.34, 1)`. Corners unchanged. Explicit transition properties, never `transition-all`. Never delay a native action. Reduced motion removes the push, keeps the state feedback.

### Composition / showcase
- `composition.card-material` (Required) A framed specimen composes Card and its named parts. A theme surface plus local padding is not a Card.
- `showcase.preview-toolbar` (Required) Canvas-level controls live in `CanvasToolbar` inside `CanvasPreviewFrame`. Edge text gets mirrored 8px optical padding; interior controls do not.
- `showcase.surface-scale` (Required) Two tiers: Default (app-width `PageContent`, roomy canvas minimum) and Large (`surface: "application"`, full width, application height). The old small tier is removed.

### Accessibility
- `accessibility.control-contract` (**candidate**, Recommended) Reuse native/primitive behavior. Visible focus, accessible names and tooltips on icon-only controls, test disabled/loading/reduced-motion. A control's visual size alone is not a compliance claim.

---

## 5. Agent conventions beyond the rules

From `AGENTS.md`:

- Record new durable rules in `rules.json` with scope, exceptions, evidence, implementation paths, honest enforcement status. Implementing an existing rule or tuning a value does **not** require a new rule or edits to README/PRDs/memory.
- Update only documentation the change made inaccurate. Do not duplicate history.
- Regenerate only changed artifacts. Never edit generated markdown.
- Scope Playwright by file and precise test title. `--grep` also matches filenames, so broad terms select whole files.
- Reuse context already read. Do not repeat the same result in updates, docs, and memory.
- Use the already-running dev server and shared browser. Keep build output quiet.
- Preserve unrelated worktree changes. Never commit or deploy unless requested.
- Existing exceptions are not precedents for new work.

---

## 6. Verification budget

| Change | Budget |
| --- | --- |
| Small visual/token adjustment | Typecheck + touched-file lint once, plus one focused rendered check of the affected geometry or state. No full browser suite, no build. |
| Interaction or component API | Relevant behavior tests + typecheck/lint. Include affected consumers for shared API changes; desktop and mobile when responsive layout or input modality is at risk. |
| Documentation or agent instructions only | Diff review + whitespace. No typecheck, build, browser, or rule tests. |
| Canonical design rules | Generate markdown once, run `npm run test:design-rules`. No UI tests unless rendered behavior changes. |
| Broad migration or release validation | Typecheck, full lint, rule and snippet checks, affected browser regressions. Build for release or asset/config changes. |

Governing line: *"Stop when the scoped check and required gates pass. Add another check only for a named, uncovered risk or a concrete failure, not for reassurance."* A shared component filename alone does not make a small change a broad migration.

---

## 7. Phase 2: the design thesis

**North star: soft hardware.** Controls feel substantial and tactile. Color creates charged regions rather than scattered decoration. Shape communicates role, importance, state. Motion gives weight and continuity. Calm infrastructure gives expressive moments room.

**Product thesis:** keep the functional shadcn core as the chassis; add expression as a coordinated system layer; increase expression with abstraction; use contrast rather than uniform enlargement; prototype in real compositions and extract only what repeats.

**The monochrome gate:** the expressive language must work before hue. *"If the interface only becomes expressive after violet, coral, or lime is added, its underlying form language is too weak."*

**Expression gradient (expression peaks at the block, not the primitive):**

| Level | Intended expression |
| --- | --- |
| Quiet infrastructure | Tables, menus, fields, long-form reading, dialog structure stay calm and legible |
| Interactive primitives | Buttons, toggles, tabs, sliders, navigation get tactile feedback and selective tonal treatment |
| Expressive compositions | Control islands, prominent actions, metric tiles, media controls, suggestion tiles can use stronger scale, color, shape |
| Application blocks | Blocks coordinate color zones, hierarchy, asymmetry, motion into a recognizable experience |

**Principles:** importance is a composition (scale and placement first, then color, then motion). Color arrives as a harmony, not per-component hue picking. Shape has meaning. Motion is a response, not idle animation. Density controls energy. Repetition earns abstraction.

**Guardrails:** preserve accessibility, keyboard, focus, contrast, reduced motion. Keep status colors semantically distinct from decorative expression. Everything token-driven. Natural case, no all-caps shortcuts. Concentric radii. No unlimited `tone x shape x size x elevation x motion` matrix. Do not globally restyle primitives before a block proves the direction. Dark mode is an authored expression, not an inversion.

**Later visual hypothesis, "soft electric":** warm paper ground, deep ink or plum, violet as signature, coral/rose supporting, lime/mint/yellow/sky as a rare spark, capsules and circles and rounded-square widgets, one occasional organic silhouette, generous breathing room, gliding selections and physical press feedback. Explicitly hypotheses, not locked.

---

## 8. Workstream state

Intended order: **2a lab → 2c form → 2d motion → 2b color → 2e recipes → 2f chat pilot → 2g governance.** Findings can send work back one step.

| Brief | Question | State |
| --- | --- | --- |
| 2a Expression lab | What surface lets decisions be compared? | **Built.** `#/expression-lab`, Expressive/Original toggle with state preservation across theme changes |
| 2c Form language | Can shape, scale, type, containment create expression without hue? | **Live as experiment.** Concentric (`#/concentric`) and the Expressive treatment. Explicitly scoped, not approved, not a global restyle |
| 2d Motion character | Can forms feel alive without being restless? | **Button-only pilot.** Push + compression using Material's published fast web conversions. Corner morph retained behind `data-press-effect="morph"`, off by default |
| 2b Color harmonies | How does color amplify proven hierarchy? | **Foundation approved 2026-09-07** and rolled out globally (Material website palette, neutral surface roles, button color roles). **Expressive harmonies deferred** |
| 2e Component recipes | Which repeated patterns deserve shared treatment? | Deferred |
| 2f AI chat pilot | Does the language work in a real block? | Deferred. The AI Chat block exists but is not the expressive pilot |
| 2g Adoption and governance | How does the system expand without losing discipline? | Deferred |

**Sequence note worth carrying into any discussion:** color was supposed to come fourth, after form and motion passed their gates. In practice the Material color and surface foundation shipped globally on September 7 while the form language is still a scoped experiment. Defensible, since color had an external authority to borrow from and form does not, but the monochrome quality gate has not actually been run against an approved form language. The system now wears a palette that its own charter said should arrive later.

---

## 9. Decision log: what was tried and rejected

Kept in README and the briefs, useful as precedent:

- **Secondary boundary experiment:** rejected and removed. A hue change must never turn a filled secondary Button into an outline treatment.
- **Fixed-role primary mapping:** rejected. Rose primary-fixed and secondary-container both resolved to `#ffd9dc`, collapsing the hierarchy. Fixed roles stay available but are not the button default.
- **Destructive solid Error fill:** reverted to the original translucent tint ramp.
- **Off/Auto/Custom second-color experiment:** removed.
- **Old tonal-elevation overlays (5/8/11/12/14% primary):** not applied on top of explicit surface roles.
- **Small showcase tier:** removed; Default and Large only.
- **Button `lg`/`sm`/`xs` and `outline`:** removed, not deprecated aliases.
- **`oneds-phase-1-prd.md`:** deleted as obsolete bootstrap; recoverable in git history.
- **Squint test harness:** temporary, browser-only, removed after producing the lab diagnosis.

**Lab diagnosis findings (still the hierarchy problem to solve):** the color portrait becomes an accidental focal point; four checklist rows carry more aggregate mass than their supporting role warrants; Progress and Focus compete to be the primary journey; near-identical card fills, boundaries, and radii flatten importance; repeated rounded containers risk "bubble soup"; progress and compact controls recede beside large text.

---

## 10. Open decisions across the briefs

**Form (2c):** Is squircle geometry foundation-worthy? Is selected-state morphing a signature behavior or an occasional technique? Which importance roles need shared public names? Should prominent controls be default within certain block contexts or always explicit?

**Motion (2d):** Does state-driven shape morphing become a signature? How much overshoot belongs in the character? Are block entrances systemic or product-specific? Which components need speed derived from travel distance rather than a fixed token?

**Color (2b):** Name expressive contexts by role, mood, or family? Is the signature deep plum, vivid violet, or a relationship between both? Which spark family is distinctive enough to keep? Is a supporting family always available or block-specific? Which neutral ink accompanies each harmony without duplicating tokens?

**Recipes (2e):** Is "prominent action" a Button importance role or a higher-level recipe? Are expressive tile and metric tile one pattern or two? Does control island belong under toolbar, button group, or a new composition? Which stateful-mark behaviors are generic? Are expressive recipes opt-in everywhere or inherited within an expressive block context?

**Chat pilot (2f):** Is the empty-state mark reusable or chat-specific? Do suggestion tiles deserve a recipe? Should an expressive block context automatically retone compatible primitives? How much personality goes in the selected history item versus the composer? Does streaming expression live in the assistant mark, the send/stop control, or both?

**Governance (2g):** When may an expressive context retone descendants? Which treatments become defaults? How do products introduce their own harmony without breaking the grammar? Do expression budgets need enforceable tooling or stay review guidance? Which block follows chat, at a different density?

---

## 11. The sidebar spec (the one concrete roadmap in the repo)

Three orthogonal axes replace shadcn's conflated `variant`/`collapsible`: **form** (what shape it is), **placement** (how it relates to content), **collapse** (how much is showing, six states). Five state layers: shell, region/section, row, collection, session.

Build order:
1. Shell completeness: split the three axes, all six collapse states, resize handle + width persistence + snap, peek with overlay flip, no-flash restore, multi-instance provider with named ids and `side="end"`.
2. Row completeness: meta/two-line, rename, dot vs count, automatic collapsed tooltip, states as data attributes.
3. Collection machinery: section config menu, bucket labels, show-more, search/filter, empty/error/load-more.
4. Structure: tree with indent guides, dock rail, sidebar tabs, pane.
5. Manipulation: drag reorder/reparent/drop-into, keyboard move mode.
6. Blocks: eight Tier-3 recipes as showcase examples.

*"After steps 1-5 the component surface is closed: every sidebar in the research becomes a composition, not a new feature."*

Research base: shadcn, ChatGPT, Claude, Notion, Arc/Dia, VS Code, Slack, Linear, Figma. Anti-patterns include a "collapsed" state that keeps 200px instead of a rail, icon-only rows without accessible names, hover-only row actions on touch, a button nested inside a row button, animating `width` on thousands of rows, persisting the active row instead of deriving it from the route, one global open flag with two sidebars, unguided nesting past level 3, one empty illustration reused for empty/no-results/error.

Status caveat from `PRDs/README.md`: historical architecture reference. Its inventory is not the current API or an approved backlog.

---

## 12. The evaluation rubric (2c)

Use these when judging any expressive proposal:

1. Three-second test: is current progress and next action identifiable immediately?
2. Squint test: does hierarchy survive when text and detail disappear?
3. Silhouette test: are circles, capsules, tiles, and surfaces used consistently by role?
4. Theme-preservation test: is hierarchy created without replacing the palette or imagery?
5. Balance test: does asymmetry feel energetic but stable?
6. Containment test: can any nested box be removed without losing comprehension?
7. Target test: are primary and touch actions comfortably acquired?
8. Keyboard test: does focus follow the complete apparent control?
9. Responsive test: do proximity and grouping survive stacking?
10. Emotional test: modern, tactile, creative, friendly, without noisy, ornamental, or childish?

Research grounding: Material 3 Expressive (46 studies, 18,000+ participants, key elements found up to 4x faster; benefit came from coordinated size/shape/placement/typography/containment, not color alone; breaking familiar layouts or removing labels reduced usability). NN/g (roughly three visible size levels, no more than one or two dominant objects; proximity often beats decoration). Apple HIG (44x44pt minimum, surrounding separation, explicit press state).

---

## 13. Honest read: tensions to brainstorm against

1. **The corpus is outgrowing the system.** 998-line README mixing spec, changelog, and rationale; 47KB of rules.json for 22 rules; 9.7KB of AGENTS.md that substantially restates rules.json in prose. Three artifacts decaying at different rates. An agent burns context on history it must then ignore. A thin entry point plus a dated decision log would cost an afternoon.
2. **Six rules enforced by "manual review" are the load-bearing ones:** concentric corners, growing controls, token discipline, natural case. These fail as a 2px gap swell, not a type error. The measurement instrument already exists. The gap between having a ruler and the ruler failing the build is where this becomes self-enforcing or stays a documented intention.
3. **The sequence inverted** (see section 8). Worth deciding deliberately whether the monochrome gate still stands or has been superseded.
4. **One block.** The charter says expression peaks at the block level and that patterns must repeat in more than one context before becoming API. With exactly one block (AI Chat), nothing can yet repeat. 2e cannot honestly run until a second block exists at a different density.
5. **Expression Lab has no verdict.** The charter's decision discipline asks each workstream to record what was tested, what felt recognizably OneDS, what was too generic, what stays local, what is ready to promote. The lab exists and the experiments run, but no written verdict closes 2c.

---

## 14. Working mode

**Brainstorm in chat, execute in VS Code.** When a discussion produces a decision, the handoff to a coding agent should carry:

- Which rule it implements, tunes, or proposes (`rules.json` id), and whether it needs a new rule at all. Implementing an existing rule does not.
- The owning component file, since rule 1 forbids page-level recreation.
- The token names to add or change in `src/index.css`.
- Which verification row applies, and the single focused check that would expose the defect.
- Whether it is approved work or a scoped experiment. Experiments live under `src/showcase/experiments/` and must not restyle the library.

Useful opening instruction for a VS Code agent: *"Read AGENTS.md and public/design-rules.md first. This is a [small visual change / component API change / rule change]; use that verification row only."*
