# OneDS generative theme system

## What this is

Today OneDS ships one fixed palette. Every color is a literal value in a token file, and every project that uses OneDS looks the same until someone hand-edits it.

This replaces that with a generator. A theme is four numbers. The build script turns those four numbers into the full neutral and brand token set, in light and dark. Change one number and the entire palette moves together.

The target look is a family of references that share one construction: the ground is not white, it is the theme hue desaturated almost to nothing. The ink is not black, it is the theme hue at low lightness. The accent is the same hue at mid lightness with a chroma ceiling that keeps it from going loud. Because all three come from one hue, the page reads as one material rather than as a gray page with colored parts stuck on it.

## Why OKLCH

HSL lightness is not perceptual. Yellow at 50% lightness is far brighter than blue at 50%. A generator built on HSL would need per-hue correction tables, and the promise of one dial producing a coherent theme would break at exactly the hues in the reference set.

OKLCH is perceptually uniform: the same L value looks equally light at every hue. It is a native CSS color function with full browser support, and needs no preprocessor or library.

Cost: the values are not readable at a glance. You cannot picture `oklch(0.58 0.11 45)`. The color documentation page becomes the only way to see what a value is, which makes it more important rather than less.

---

## 1. Theme parameters

A theme is defined by four numbers.

| Parameter | Range | Default | What it does |
| --- | --- | --- | --- |
| `accentHue` | 0 to 360 | 45 | The hue that drives the ink and the accent |
| `groundOffset` | -180 to 180 | 45 | Degrees the ground hue sits from the accent hue |
| `groundLightness` | 0.80 to 0.98 | 0.945 | OKLCH L of the page canvas in light mode |
| `chromaScale` | 0 to 1.5 | 1.0 | Multiplier on every chroma value in the system |

Two derived values:

```
groundHue = (accentHue + groundOffset) mod 360
darkGroundLightness = 0.20   (fixed for now, may become a fifth parameter later)
```

Notes on each:

**accentHue** is the input everything else hangs off. The ink and the accent both use it directly.

**groundOffset** at 0 gives a monochrome theme where ground, ink, and accent are all one hue. Small offsets (30 to 60) give the Anthropic-style result where the ground is a warm neutral living near the accent rather than a tinted version of it. Large offsets (150 to 215) give the two-hue compositions. Start with small offsets; large offsets are the case most likely to produce something ugly and should be validated last.

**groundLightness** is the switch between the two modes. High values (0.93 to 0.97) read as tinted white: the ground looks like paper. Mid values (0.85 to 0.90) read as a color: the ground looks lilac, sage, or pink. Nothing else in the system changes between these two modes.

**chromaScale** at 0 produces pure gray neutrals with a gray accent, which is the plain neutral theme. At 1.0 it produces the reference look. Above 1.2 it starts to leave the pastel family. This is the guard rail that keeps the system from producing loud output.

---

## 2. The lightness ramp

Every token gets a fixed OKLCH L value or a fixed offset from `groundLightness`. These are the numbers to review after first output.

### Surface

Surfaces step relative to the ground, not toward white. This matters: on a lilac ground at 0.88, a white card would break the tint and read as an unstyled box.

| Token | Light L | Dark L |
| --- | --- | --- |
| `surface-neutral-farther` | ground − 0.045 | ground − 0.02 |
| `surface-neutral-far` | ground − 0.020 | ground |
| `surface-neutral-near` | ground + 0.010 | ground + 0.025 |
| `surface-neutral-nearer` | ground + 0.030 | ground + 0.045 |

Clamp light-mode L at 0.985. Never reach pure white, because pure white in a tinted theme is the one value that visibly does not belong.

In light mode the ramp goes lighter as it comes nearer. In dark mode it does the same, which is why the dark base is low and the steps are positive in both.

### Foreground

Solid values, not alpha. Alpha black composited over a tinted ground produces mud rather than the chosen dark warm color that makes the reference set work.

| Token | Light L | Dark L |
| --- | --- | --- |
| `foreground-neutral-primary` | 0.22 | 0.94 |
| `foreground-neutral-secondary` | 0.44 | 0.76 |
| `foreground-neutral-tertiary` | 0.58 | 0.63 |
| `foreground-neutral-disabled` | 0.70 | 0.50 |
| `foreground-neutral-onloud` | 0.98 | 0.20 |

### Background neutral

| Token | Light L | Dark L |
| --- | --- | --- |
| `background-neutral-heavy` | 0.22 | 0.94 |
| `background-neutral-loud` | 0.55 | 0.60 |
| `background-neutral-soft` | ground − 0.06 | ground + 0.10 |
| `background-neutral-subtle` | ground − 0.03 | ground + 0.06 |
| `background-neutral-disabled` | ground − 0.02 | ground + 0.04 |

`background-neutral-transparent` keeps the heavy value at zero alpha, as today.

### Stroke neutral

| Token | Light L | Dark L |
| --- | --- | --- |
| `stroke-neutral-heavy` | 0.22 | 0.87 |
| `stroke-neutral-loud` | 0.55 | 0.60 |
| `stroke-neutral-soft` | 0.68 | 0.45 |
| `stroke-neutral-subtle` | ground − 0.10 | ground + 0.14 |
| `stroke-neutral-onloud` | 0.98 | 0.20 |

### Brand

| Token | Light L | Dark L |
| --- | --- | --- |
| `background-brand-heavy` | 0.42 | 0.72 |
| `background-brand-loud` | 0.58 | 0.66 |
| `background-brand-soft` | 0.90 | 0.32 |
| `background-brand-subtle` | 0.95 | 0.26 |
| `foreground-brand-primary` | 0.48 | 0.76 |
| `foreground-brand-onloud` | 0.98 | 0.20 |
| `stroke-brand-loud` | 0.58 | 0.66 |
| `stroke-brand-soft` | 0.72 | 0.52 |
| `stroke-brand-subtle` | 0.88 | 0.36 |

---

## 3. The chroma rule

Chroma is what keeps this pastel instead of loud. Each role has a base chroma, multiplied by `chromaScale`.

| Role | Base chroma |
| --- | --- |
| Surface (all steps) | 0.012 |
| Background neutral soft, subtle, disabled | 0.015 |
| Background neutral heavy, loud | 0.020 |
| Stroke neutral subtle, soft | 0.018 |
| Stroke neutral heavy, loud | 0.022 |
| Foreground neutral primary | 0.030 |
| Foreground neutral secondary, tertiary | 0.022 |
| Foreground and stroke onloud | 0.008 |
| Brand, all roles | 0.110 |

Two constraints on top:

**Hard ceiling.** Clamp all chroma at 0.15 after scaling. Above that the system leaves the reference family regardless of what `chromaScale` says.

**Lightness taper.** At L above 0.95 or below 0.25, multiply chroma by 0.7. Extreme lightness values hold less chroma before looking artificial, and this keeps the very pale surfaces reading as tinted paper rather than as a colored wash.

The subtlety the ground needs comes from that 0.012 base. At `chromaScale` 1.0 a cream ground carries almost no measurable color and still reads unmistakably warm. If first output looks too colored at the ground, lower this number before touching anything else.

---

## 4. Hue assignment

| Role | Hue |
| --- | --- |
| Surface, all steps | `groundHue` |
| Background neutral | `groundHue` |
| Stroke neutral | `groundHue` |
| Foreground neutral | `accentHue` |
| Brand, all roles | `accentHue` |

The ink follows the accent, not the ground. This is deliberate and it is where the reference look comes from. Frank's ink is a green-black against a cream ground; the ink belongs to the accent family, not the paper.

At `groundOffset` 0 this distinction collapses and everything is one hue, which is correct for the monochrome case.

---

## 5. What stays fixed

Danger, warning, and success keep their current imported literal values in both themes.

Status has to read as status regardless of theme. A danger color derived from a green theme hue would be green, and a green error message is not an error message. These are the one family where consistency across themes matters more than coherence within a theme.

Also unchanged: the token names, the four categories, the modifier scale, `light-dark()`, MANIFEST.md, AGENT_PROTOCOL.md, and the checker's existing rules. This changes how values are produced, not what they are called.

---

## 6. Worked examples

The generator is correct when these four inputs produce these three themes. Check output against them before migrating anything.

### Warm paper

```
accentHue: 45
groundOffset: 45
groundLightness: 0.945
chromaScale: 1.0
```

Expect a cream ground near `oklch(0.945 0.012 90)`, a warm near-black ink near `oklch(0.22 0.03 45)`, and a terracotta accent near `oklch(0.58 0.11 45)`. The ground should read as warm paper, not as a tinted white, and the tint should be barely perceptible in isolation while obviously warm next to pure white.

### Lilac

```
accentHue: 300
groundOffset: 0
groundLightness: 0.88
chromaScale: 1.0
```

Expect a pale lilac ground near `oklch(0.88 0.045 300)`. Note the ground chroma rises here even though `chromaScale` is unchanged: the lightness taper stops applying below 0.95. Cards should step to a lighter lilac, never to white.

### Plain neutral

```
accentHue: 0
groundOffset: 0
groundLightness: 0.945
chromaScale: 0
```

Expect pure grays throughout, close to the values currently in the system. This is the proof that the generator can reproduce where OneDS is today.

### Deferred: two-hue

```
accentHue: 150
groundOffset: 215
groundLightness: 0.93
chromaScale: 1.0
```

Pale pink ground, deep green ink and accent. Build the generator so this works, but validate it last. Large offsets are where the system is most likely to produce something that hurts to look at, and a bad result here should not cast doubt on the mechanism.

---

## 7. Build changes

**`scripts/build-tokens.mjs`** takes theme parameters as input, applies sections 2 through 4, and emits `tokens.css` with `light-dark()` pairs, exactly as it does now. The output format does not change.

**`tokens/theme.json`** holds the four parameters for the default theme. This is the file a person edits to retheme.

**`scripts/check.mjs`** currently detects literal colors by hex and rgb patterns. Add `oklch()` to that detection, or the no-literal-colors rule silently stops being enforced.

**Per-project theming** works by each project shipping its own `theme.json` and running the build, or by overriding the generated tokens in a project stylesheet loaded after `tokens.css`. Decide which after the generator works; do not design for both now.

---

## 8. Acceptance

1. The three worked examples produce output matching their descriptions.
2. `chromaScale: 0` reproduces the current neutral values within a small tolerance.
3. No surface token reaches pure white or pure black in any theme.
4. Every foreground and background pair in the same family clears WCAG AA at every `groundLightness` in range.
5. All twelve components render correctly in all three themes, light and dark.
6. `check.mjs` passes and rejects a literal `oklch()` value in a component file.

---

## Open questions

**Dark mode ground lightness** is fixed at 0.20. It probably wants to be a fifth parameter, but adding it before seeing output is speculation.

**Chroma in dark mode** may need its own scale. Dark surfaces hold chroma differently than light ones and the current spec applies the same base values to both. This is the most likely place the first output will look wrong.

**The lightness taper thresholds** at 0.95 and 0.25 are estimates. They control how subtle the palest surfaces read, which is the thing most worth adjusting by eye.
