# OneDS Expressiveness — Philosophy & Working Patterns

_Context for any agent picking up Material Expressive work in OneDS. Read this to
understand **what expressiveness means here, how we decide, and the patterns we've
already validated** — so you extend the system instead of reinventing or diluting it._

This is a philosophy and decision digest, not a rule file. The canonical, enforceable
rules live in [src/design-system/rules.json](../src/design-system/rules.json) and its
generated slices under [public/rules/](../public/rules/). When this document and a rule
disagree, the rule wins. When you need a value, read the slice; when you need to know
_why_ and _how to think_, read this.

---

## 1. North star: "soft hardware"

> OneDS should feel like **soft hardware**. Controls feel substantial and tactile.
> Color creates charged regions rather than scattered decoration. Shape communicates
> role, importance, and state. Motion gives objects weight and continuity. Calm
> infrastructure gives expressive moments room to breathe.

Everything below is downstream of that sentence. If a proposed change makes the whole
screen louder, it's probably wrong. If it makes one decisive object feel more physical
while the surrounding infrastructure stays quiet, it's probably right.

### The product thesis (five moves)

1. **Keep the functional shadcn core as the chassis.** Accessibility, keyboard
   behavior, composability are non-negotiable and come for free from the primitives.
   Expression is a layer _on top_, never a replacement.
2. **Add expression as a coordinated system**, not per-component flourishes. Color,
   shape, importance, typography, depth, and motion move together or not at all.
3. **Increase expression with abstraction.** Primitives stay dependable and calm;
   compositions become distinctive; application blocks carry the strongest personality.
4. **Use contrast, not uniform enlargement.** A chunky focal action only reads as focal
   because everything around it is restrained. Enlarging everything cancels the effect.
5. **Prototype in real compositions.** Explore in the lab, validate inside a real block,
   and only extract a shared pattern once it has repeated in more than one context.

---

## 2. The expression gradient (the single most important idea)

**Expression peaks at the block level, not the primitive level.** Decide how much
personality something gets by _where it sits_ on this gradient:

| Level | Expression | What it looks like |
| --- | --- | --- |
| **Quiet infrastructure** | Minimal | Tables, menus, form fields, dialog structure, long-form reading. Calm, legible, default styling. |
| **Interactive primitives** | Tactile only | Buttons, toggles, tabs, sliders, nav. Press feedback + selective tonal states. Personality through _response_, not decoration. |
| **Expressive compositions** | Strong | Control islands, prominent actions, metric tiles, media controls, suggestion tiles. Larger scale, tonal container pairs, squircle/tile geometry. |
| **Application blocks** | Fullest | Blocks orchestrate color zones, hierarchy, asymmetry, and motion into a recognizable experience. |

Practical consequence: **do not globally restyle every primitive** to chase
expressiveness. Push the personality up into compositions and blocks. A dense table row
should stay boring on purpose.

---

## 3. Core principles (how to reason about a change)

- **Importance is a composition.** Communicate importance first through **scale and
  placement**, then **color**, and last **motion**. _Do not ask saturation alone to
  carry hierarchy._
- **Color arrives as a harmony.** A region adopts a curated relationship — ground,
  strong fill, soft container, readable foregrounds, interaction states — as a set.
  Components never independently pick unrelated hues. Neutral roles are global; accent
  roles are scoped deliberately.
- **Shape has meaning.** Each geometry signals a role (see §5). Shape is never random
  decoration.
- **Motion is a response.** The interface feels alive because it _responds, transforms,
  and maintains continuity_ — not because things move while idle. _Mass implies scale:
  small icons respond quickly; large surfaces move deliberately._
- **Density controls energy.** Dense information gets quieter treatment. Strong
  expression belongs around decisive actions, focused values, navigation moments,
  active system states, and spacious blocks.
- **Repetition earns abstraction.** A successful experiment is not automatically a new
  variant. A pattern must recur in more than one meaningful context before it becomes
  shared API. Defaults stay unchanged until a real block proves the direction.

---

## 4. Motion character

**Motion must communicate one of four things — Response, Continuity, Hierarchy, or
Activity. Anything else is decorative noise and should be cut.**

### The five motion families

1. **Tactile response** — compression / deepen / content shift on press. Immediate,
   settles cleanly.
2. **Selection travel** — a shared surface travels between destinations, preserving
   object permanence (feels physical, not like a cross-fade).
3. **Transformation** — expand / contract / shape change when an object's role changes;
   container and contents move as one.
4. **Arrival** — related content enters in a short, coordinated sequence that
   establishes reading order.
5. **Active-state motion** — listening / recording / streaming. Repeats _because the
   state is ongoing_ and stops the instant the state stops.

### The two adopted Material Expressive curves

We converted the published Material 3 Expressive motion to two working roles. Use these;
do not invent per-component one-off curves.

| Role | Curve | Speed | Applies to |
| --- | --- | --- | --- |
| **Spatial fast** | `cubic-bezier(0.42, 1.67, 0.21, 0.90)` | 350ms | Spatial change: push, reserved shape morph |
| **Effects fast** | `cubic-bezier(0.31, 0.94, 0.34, 1)` | 150ms | Color and opacity |

Split rationale: **spatial motion springs; effects motion is bounded.** Position/scale
get the overshooting spatial curve so movement feels physical; color/opacity get the
tighter effects curve so tint changes never feel sluggish or bouncy.

### Button press feedback (validated pilot)

- **2px downward push** + **3% compression** (`scale: 0.97`), spring-like return on the
  spatial curve.
- **Corners and layout dimensions stay put.** Color/opacity ride the effects curve.
- **Corner morph** (8px→pressed radius) is retained but **off by default**, gated behind
  `data-press-effect="morph"`. Push+compression won over morph as the default because it
  reads as tactile without disturbing layout geometry.
- **Reduced motion removes the push but preserves state feedback** — you still see the
  press register, just without spatial travel.

### Icon FILL animation

- Material Symbols **FILL axis animates 0→1 on selected state** using the effects speed
  and curve. This is the signature "the icon fills in as you select it" moment.
- **Reduced motion applies the filled state immediately** (no interpolation).

### Token discipline (required)

- Never write raw milliseconds at a call site. Use named speed + easing tokens, aliased
  per component to express durable intent.
- Keep _intent delays_ (e.g. stagger) separate from _transition speed_.
- **Speed means velocity, not a relabeled fixed duration.** For spatial travel, prefer
  deriving duration from distance × a tokenized velocity where it matters (e.g. the FAB
  shape morph), and remember easing still changes instantaneous velocity. Do not
  broad-migrate unrelated components to velocity timing without approval.

Named speed scale: `--speed-swift: 160ms`, `--speed-brisk: 240ms`,
`--speed-gentle: 300ms`, `--speed-slow: 450ms`, `--speed-pulse: 1000ms`.

---

## 5. Form language & shape

**The monochrome gate is the first quality bar:** _if the interface only becomes
expressive after violet/coral/lime is added, its form language is too weak._ Prove
expression in greyscale first; color is amplification, not the source.

### Shape grammar (geometry → role)

| Shape | Role |
| --- | --- |
| **Circle** | Singular icon action, transport control, status mark, compact focal control |
| **Capsule** | Labelled action, selection, filter, short compact control |
| **Soft rounded rectangle** | Field, menu, ordinary surface, information-rich control |
| **Rounded square / squircle** | Widget, tool tile, metric, shortcut, app-like object |
| **Organic / scalloped** | One focal mark, special/celebratory state, brand moment — rare |

### What makes a control feel "substantial"

Larger stable hit area (44×44pt min), deliberate inline breathing room, icon
proportioned to the control (not inherited incidentally), a strong-but-simple
silhouette, a clear pressed response, and surrounding whitespace to preserve contrast.

### Importance / size scale

- **Standard** — everyday infrastructure, dense workflows.
- **Comfortable** — touch-friendly, slightly more presence.
- **Prominent** — the main action within a region.
- **Hero** — a block-level focal object (transport control, metric).

Button tiers (canonical): **Default** = 40px height / 20px icon / 16px horizontal
padding. **Expressive** = 56px height / 24px icon / 24px horizontal padding. The old
`lg`/`sm`/`xs` tiers were **removed** — reach for the two-tier system plus composition,
not a size zoo.

### Concentric corners (required, non-negotiable, apply even when unasked)

When a rounded element nests inside another with a uniform gap:
**inner radius = outer radius − edge-to-edge inset** (border + padding), clamped at 0.
Curves then share a center and the gap stays even around the corner. Independent radii
make the gap swell or pinch around the corner. This is a standing default for _every_
radius you choose — cards, buckets, tiles, buttons-in-pills, focus rings.

Two caveats the rule specifically calls out, because they're the failure modes:

- **Verify the equation independently for every host.** Compute it from the _actual_
  painted outer radius minus the _actual_ inset. Matching inner radii across
  differently-shaped hosts is **not** evidence of concentric geometry.
- **Only aligned, uniformly-inset surfaces qualify.** A small object floating in the
  middle of a larger surface does _not_ share its corner center. Rings and shadows
  consume no layout space, so they don't enter the equation.

Enforcement is **manual review** — it fails as a subtle gap swell, not a type error, so
inspect the real border-box geometry, don't infer compliance from a token name.
(Concave/inward fillets can't be done with `border-radius`; use an SVG path or a mask.)

The same equation is the source of several component rules, each verified per host:
Card owns `--card-radius` (26px) with square inner parts and a concentrically-derived
copy-button radius; Alert pairs a 28px inner radius + 16px inset = 44px outer; Menu rows
use a concentric inner radius and only the chunk's first/last rows round the outer edge;
Item derives compact inner radii from its inset. A related rule — **growing controls
keep a fixed radius** (never `radius-pill` on a box that grows) — still respects the
concentric relationship for anything nested inside.

---

## 6. Color harmonies

Color is delivered as **roles in a harmony**, never as components picking hues.

- **Global neutral surface ladder** (Material roles): Surface, Surface container
  lowest / low / container / high / highest, with paired foregrounds (On surface, On
  surface variant, Outline) defined once, globally.
- **Three button color roles** (distinct from the raw palette):
  - **Primary (accent)** — reserved for prominent CTAs. Ignores `selected`.
  - **Secondary (emphasis)** — soft container pair.
  - **Tertiary (default)** — warm neutral surface.
- **Selection coloring** is caller-controlled via native `aria-pressed`. Selected
  tertiary/secondary move to the light-purple container pair; the icon FILL animates in.
- **Status colors stay semantically separate from decorative expression.** Destructive
  uses a **translucent Error tint** (10/20/30% light, 20/30/40% dark), not a solid slab.
- **Dark mode is authored, not auto-inverted** — treat it as the same system expressed
  in a second key.

The website's own palette is a custom analogous set (violet signature, light-purple and
pink-purple containers) — not a stock Material Tonal Spot. When adding accent, join the
existing harmony rather than introducing an unrelated hue.

---

## 7. Spacing & rhythm

**Spacing communicates relationships; it is a hierarchy, not uniform enlargement.**
Semantic scale, all on a 4px grid:

| Token | Value | Intent |
| --- | --- | --- |
| `--space-hairline` | 2px | Hairline inset / press distance |
| `--space-2xs` | 4px | Tight cluster |
| `--space-xs` | 8px | Related items (icon↔label) |
| `--space-sm` | 12px | Control inline padding |
| `--space-md` | 16px | Content group / section |
| `--space-lg` | 24px | Card spacing / block |
| `--space-xl` | 32px | Block separation |
| `--space-2xl` | 48px | Page gutters |
| `--space-3xl` | 64px | Full-page margins |

Expressive card rhythm: **8px** between strongly related items, **24px** between distinct
groups and major regions, **24px** card inset. Edge-to-edge scroll content cancels the
outer region gap while the scroll box keeps 24px internal padding.

---

## 8. Non-negotiable guardrails

- Preserve accessibility, keyboard behavior, focus clarity, contrast, and reduced-motion
  behavior. Focus must follow the complete apparent control.
- Keep every visual value **token-driven and centrally adjustable** — no hardcoded hex,
  magic numbers, arbitrary bracket values, or inline styles.
- Keep status colors distinct from decorative expression colors.
- Preserve **natural-case typography** — never all-caps, never the uppercase +
  wide-tracking "overline" shortcut. Use size/weight/muted-grey for label hierarchy.
- Continue the concentric-radius rule for nested rounded objects.
- **Do not** ship an unbounded `tone × shape × size × elevation × motion` variant matrix.
- **Do not** globally restyle every primitive before a real block proves the direction.

---

## 9. Evaluation rubric (judge a proposal before building)

1. **Three-second test** — is current progress and the next action obvious immediately?
2. **Squint test** — does hierarchy survive when text and detail disappear?
3. **Silhouette test** — are circles/capsules/tiles/surfaces used consistently by role?
4. **Theme-preservation test** — is hierarchy created without swapping palette/imagery?
5. **Balance test** — does asymmetry feel energetic but stable?
6. **Containment test** — can any nested box be removed without losing comprehension?
7. **Target test** — are primary/touch actions comfortably acquired (44×44pt+)?
8. **Keyboard test** — does focus follow the whole apparent control?
9. **Responsive test** — do proximity and grouping survive stacking?
10. **Emotional test** — modern, tactile, creative, friendly — without noisy,
    ornamental, or childish?

Grounding: Material 3 Expressive research (coordinated size/shape/placement/typography/
containment surfaces key elements far faster than color alone), Nielsen Norman (few
visible hierarchy levels; proximity beats decoration), Apple HIG (44×44pt min,
surrounding separation, explicit press state).

---

## 10. Decision discipline & open tensions

**How we work:** explore in the Expression Lab (`#/expression-lab`, reversible
Original/Expressive toggle) → validate inside a real block → extract a shared pattern
only after it repeats. Candidate rules are proposals; do not promote one to approved
without user sign-off. Existing exceptions are not precedents.

**Honest tensions still open (don't pretend these are settled):**

1. The monochrome quality gate hasn't been formally closed against the approved form
   language — color shipped globally before form passed full review.
2. Several load-bearing rules (concentric corners, growing-control radius, token
   discipline, natural case) are **manual-review** — they fail as a 2px swell, not a
   type error. Verify them by eye, not just by typecheck.
3. Only one real block exists, so most patterns haven't repeated enough to justify API
   promotion. Resist premature abstraction.

---

## 11. Concrete implementation reference

Motion tokens live in [src/index.css](../src/index.css):

```css
/* Material 3 Expressive spatial + effects roles */
--motion-spatial-fast-speed: 350ms;
--motion-spatial-fast-curve: cubic-bezier(0.42, 1.67, 0.21, 0.90);
--motion-effects-fast-speed: 150ms;
--motion-effects-fast-curve: cubic-bezier(0.31, 0.94, 0.34, 1);

/* Button aliases (express intent, don't hardcode) */
--button-spatial-speed: var(--motion-spatial-fast-speed);
--button-spatial-curve: var(--motion-spatial-fast-curve);
--button-effects-speed: var(--motion-effects-fast-speed);
--button-effects-curve: var(--motion-effects-fast-curve);

/* Press feedback */
--button-press-distance: 2px;
--button-press-scale: 0.97;
--button-pressed-radius-default: 8px;      /* morph, off by default */
--button-pressed-radius-expressive: 12px;  /* morph, off by default */

/* Icon FILL animation */
--material-icon-fill-speed: var(--button-effects-speed);
--material-icon-fill-curve: var(--button-effects-curve);
--material-icon-fill-default: 0;
--material-icon-fill-selected: 1;
```

Button transition chain — spatial props on the spatial curve, effects props on the
effects curve:

```css
transition:
  border-radius var(--button-spatial-speed) var(--button-spatial-curve),
  translate     var(--button-spatial-speed) var(--button-spatial-curve),
  scale         var(--button-spatial-speed) var(--button-spatial-curve),
  background-color var(--button-effects-speed) var(--button-effects-curve),
  color            var(--button-effects-speed) var(--button-effects-curve),
  border-color     var(--button-effects-speed) var(--button-effects-curve),
  opacity          var(--button-effects-speed) var(--button-effects-curve);
```

**Where to look next:** button rule slice
[public/rules/src-components-ui-button.md](../public/rules/src-components-ui-button.md),
cross-cutting [public/rules/_always.md](../public/rules/_always.md), and the Phase 2
PRDs in [PRDs/](../PRDs/) (`2` charter, `2a` lab, `2b` color, `2c` form, `2d` motion,
`2e` recipes). Canonical rules: [src/design-system/rules.json](../src/design-system/rules.json)
— never edit the generated Markdown; regenerate with `npm run rules:generate`.
