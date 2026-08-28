# Scroll & Entrance System — Implementation Report

A portable, self-contained guide to the two motion systems that give this site
its "premium/Squarespace" feel. Everything here is framework-agnostic (vanilla
JS + CSS custom properties). You can lift each system independently into another
project.

There are **two separate systems** that people often lump together as "the
scroll thing":

| # | System | Where it lives | What it does |
|---|--------|----------------|--------------|
| A | **Smooth ("lazy") scrolling** | [`js/smooth-scroll.js`](../../js/smooth-scroll.js) | Makes the whole page *glide* toward where you scroll instead of tracking the wheel 1:1. The floaty, slightly-lagging feel. |
| B | **Staggered entrance / reveal ("content arriving")** | `@layer` in [`src/input.css`](../../src/input.css) + a tiny bit of [`js/nav.js`](../../js/nav.js) | On every load/refresh, each content block fades in while rising from below, one after another, in a decelerating wave. |

> **Important:** Despite the informal name "lazy loading," **neither system does
> data/network lazy-loading.** There is no `IntersectionObserver`, no
> `loading="lazy"`, no deferred fetching. "Lazy" here refers to the *lazy
> (eased) scroll motion* and the *staggered reveal*. If you actually want
> on-scroll/viewport-triggered loading, see [§4 "Extending to true lazy
> loading"](#4-extending-to-true-lazy-loading-optional).

---

## Table of contents

1. [System A — Smooth ("lazy") scrolling](#1-system-a--smooth-lazy-scrolling)
2. [System B — Staggered entrance / reveal](#2-system-b--staggered-entrance--reveal)
3. [How the two systems cooperate](#3-how-the-two-systems-cooperate)
4. [Extending to true lazy loading (optional)](#4-extending-to-true-lazy-loading-optional)
5. [Porting checklist](#5-porting-checklist)
6. [Appendix — full portable source](#6-appendix--full-portable-source)

---

## 1. System A — Smooth ("lazy") scrolling

### 1.1 The idea

Native scrolling moves the page 1:1 with your wheel. This system instead keeps
**two numbers**:

- `target` — where your input *wants* the page to be.
- `current` — where the page *actually* is right now.

Every animation frame, `current` moves a **fraction** of the remaining distance
toward `target`. That exponential easing is what produces the smooth, floaty,
"catches up to you" feel.

```
each frame:  current += (target - current) * SMOOTHING
             window.scrollTo(0, current)
```

`SMOOTHING` is the single knob (0–1):

| Value | Feel |
|-------|------|
| `0.05` | very floaty / laggy |
| `0.08` | Squarespace-ish (this site's default) |
| `0.15` | subtle |
| `1` | off (instant, native) |

### 1.2 Key mechanics (why it's robust)

**Frame-rate independence.** A naive `current += remaining * 0.08` per frame
moves *twice as fast* on a 120 Hz display as on 60 Hz. The fix normalizes the
lerp to a 60 fps reference using the real elapsed time `dt`:

```js
const t = 1 - Math.pow(1 - SMOOTHING, dt * 60);
current += (target - current) * t;
```

`dt` is capped at `0.05s` so returning to a background tab (where rAF pauses)
doesn't cause one giant jump.

**Requesting frames only when needed.** `ensureRaf()` starts a rAF loop only if
one isn't already running. `tick()` stops the loop (`rafId = null`) the moment
`current === target`, so there's **zero idle CPU** when you're not scrolling.
When `current` gets within `0.5px` of `target` it snaps exactly, ending the loop
cleanly.

**Nested scroll areas are respected.** Before hijacking a wheel event,
`nestedScrollable()` walks up from the event target. If any ancestor is itself
an overflow container that can still scroll in the wheel's direction (e.g. a
scrollable sidebar, a modal, a code block), the event is left to the browser.
Without this, inner scrollers would feel "dead."

**It re-syncs when something else moves the page.** A `scroll` listener compares
`window.scrollY` to `lastSetY` (the last value *we* set). If they differ, the
page was moved by something other than us — scrollbar drag, find-in-page, focus
change, anchor jump, touch — so we adopt that position (`current = target =
scrollY`) and keep smoothing from there instead of yanking back.

**Inputs handled:**
- **Wheel** — converts `deltaMode` lines/pages to pixels; ignores `ctrlKey`
  (pinch-zoom); `preventDefault()` + updates `target`.
- **Keyboard** — Arrow/Page/Space/Home/End, but only when nothing interactive is
  focused (so it never swallows keys meant for inputs, links, buttons).
- **Resize** — re-clamps `target` to the new max scroll.

**Accessibility.** If `prefers-reduced-motion: reduce` is set, the whole system
is disabled (`enable()` is never called) and native scrolling is used. It also
re-applies live when that media query changes.

### 1.3 The `scrollRestoration` companion (in nav.js)

One line elsewhere is part of this system's contract:

```js
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
```

By default browsers restore your previous scroll position on refresh, which
lands you mid-page and fights the top-down entrance animation (System B). Setting
it to `manual` guarantees every load starts at the top. Set this **as early as
possible** (top of your first script) so it takes effect before the browser
restores.

---

## 2. System B — Staggered entrance / reveal

### 2.1 The idea

On every page load, the content column *arrives* rather than merely appearing.
Each block fades in (`opacity 0 → 1`) while rising 200px from below
(`translateY(200px) → 0`). Blocks start one after another, and the gap between
each start **grows slightly**, so the wave **decelerates** — calm and
deliberate, not a mechanical metronome.

This is a **framework-level, zero-markup** system. The motion lives entirely on
shared structural selectors, so every current page — and any page you add later
— animates on load with **no per-element classes and no inline styles**.

### 2.2 The DOM contract

The animation targets this structure (adapt selectors to your own shell):

```html
<aside class="sidebar">…</aside>          <!-- fades in FLAT (no rise) -->
<main class="content">
  <div class="content__col">
    <header class="page-header">…</header> <!-- block 0 -->
    <div class="prose-body">
      <h2>…</h2>   <!-- block 1 -->
      <p>…</p>     <!-- block 2 -->
      <figure>…</figure> <!-- block 3 -->
      …            <!-- block 4, 5, 6, … -->
    </div>
  </div>
</main>
```

- The **sidebar** fades in *without moving* (it is `position: sticky`; moving it
  would break the sticky offset).
- The **header** is block 0; each direct child of `.prose-body` continues the
  sequence 1, 2, 3, … so the header + body read as **one continuous wave**.

### 2.3 The timing math

Each animated element carries a zero-based index `--i`. Its delay is an
**arithmetic series** whose gaps grow by a fixed amount each step:

```
delay(i) = i·base + i·(i−1)/2·growth
```

That's the closed form of "gap before block 1 is `base`, next gap is
`base+growth`, next `base+2·growth`, …" — the growing gap is what makes the wave
decelerate. It's expressed directly in CSS `calc()`:

```css
animation-delay: min(
  var(--i) * var(--stagger-base)
    + var(--i) * (var(--i) - 1) / 2 * var(--stagger-growth),
  var(--stagger-max)
);
```

Three tokens tune the entire feel (edit in one place):

| Token | Default | Effect |
|-------|---------|--------|
| `--stagger-base` | `100ms` | Gap before block 1 starts after block 0. Lower = tighter/overlapping. |
| `--stagger-growth` | `10ms` | How much each subsequent gap grows. Higher = more deceleration; `0` = uniform metronome. |
| `--stagger-max` | `600ms` | **Clamp** on the per-block delay (the `min(...)`). |
| `--ease-arrive` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | Arrival easing. Reaches ~90% in ~400ms; the long tail makes the landing soft. |
| `--duration-arrive` | `1.4s` | Per-block animation length. |

**Why the clamp matters.** A purely growing series builds a very long tail —
block 30 wouldn't even *start* for ~8s. If you scroll fast you'd outrun the wave
and see blank/half-arrived blocks below the fold. Clamping the delay at
`--stagger-max` keeps the full decelerating wave for the first ~6 blocks (the
ones you actually watch above the fold) and lands everything else together, so
the whole page is finished by ~`cap + duration` (~2s) regardless of length.

### 2.4 Auto-numbering with `:nth-child`

Rather than hand-writing `--i` on each element, a block of `:nth-child` rules
assigns the index automatically, so the stagger **scales to any page length with
zero markup**:

```css
.content__col > .page-header            { --i: 0;  }
.content__col > .prose-body > *:nth-child(1)  { --i: 1;  }
.content__col > .prose-body > *:nth-child(2)  { --i: 2;  }
/* … runs to 40 … */
.content__col > .prose-body > *:nth-child(40) { --i: 40; }
```

The table runs to 40 (well beyond the longest page). Anything past 40 falls back
to `--i: 0` (immediate) — harmless, since it would be far below the fold. Extend
the list if pages ever grow longer.

### 2.5 The animation plumbing

```css
@keyframes fade-in-up {          /* content blocks */
  from { opacity: 0; transform: translateY(200px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {             /* flat variant, for the sticky sidebar/shells */
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Shared timing on every animated element */
.sidebar,
.content__col > .page-header,
.content__col > .prose-body > * {
  --i: 0;
  animation-duration: var(--duration-arrive);
  animation-timing-function: var(--ease-arrive);
  animation-fill-mode: both;   /* CRITICAL — see below */
  animation-delay: min(
    var(--i) * var(--stagger-base)
      + var(--i) * (var(--i) - 1) / 2 * var(--stagger-growth),
    var(--stagger-max)
  );
}
```

**`animation-fill-mode: both` is not optional.** It keeps each block hidden and
shifted *during its delay* (the `from` state) and pinned at rest *after* it
finishes (the `to` state). Omit it and blocks flash into view before their turn
and snap at the end.

Also exposed as reusable utility classes so any one-off element can opt in:
`.animate-fade-in-up` and `.animate-fade-in`.

### 2.6 Accessibility

Under `prefers-reduced-motion: reduce`, all of it collapses to `animation:
none` — content appears instantly, no rise, no stagger.

### 2.7 Re-playing the wave (this site's "presentation" mode)

The same engine is reused to *replay* the entrance on demand. When a slide
becomes active, JS force-reflows it and adds a class:

```js
active.classList.remove('presentation-section--replaying');
void active.offsetWidth;                 // force reflow so the animation restarts
active.classList.add('presentation-section--replaying');
```

The CSS gives `.presentation-section--replaying > *` the same fade-in-up +
`:nth-child` indexing (1–10), so re-adding the class re-runs the wave for that
section. The `void active.offsetWidth` reflow is the standard trick to restart a
CSS animation. You only need this if you want to replay the entrance without a
full page reload.

---

## 3. How the two systems cooperate

- **`scrollRestoration = 'manual'`** ensures every load starts at the top, so
  System B's top-down wave always plays from the beginning and System A starts
  from a known position.
- Both **fully disable under `prefers-reduced-motion`**, independently.
- They're otherwise **decoupled** — you can adopt either one alone. System A is
  pure JS; System B is pure CSS (plus the optional replay reflow).
- System A never fights System B: the entrance animation uses `transform`, which
  doesn't change scroll height, so `target`/`current` stay valid throughout.

---

## 4. Extending to true lazy loading (optional)

If by "lazy loading" you meant *deferring work until an element scrolls into
view*, add an `IntersectionObserver` on top of System B. Reveal-on-scroll
version of the entrance:

```js
const io = new IntersectionObserver((entries, obs) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('animate-fade-in-up'); // reuse System B's class
    obs.unobserve(entry.target);                      // one-shot
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
```

For lazy **images**, prefer the platform: `<img loading="lazy" decoding="async">`.
For lazy **data/components**, observe a placeholder and fetch inside the
callback. Keep the `unobserve` so each element only triggers once.

---

## 5. Porting checklist

**System A — smooth scroll**
1. Copy [`js/smooth-scroll.js`](../../js/smooth-scroll.js) and include it once
   per page (`<script src="…/smooth-scroll.js" defer></script>`).
2. Add `history.scrollRestoration = 'manual'` at the very top of your first
   script.
3. If you have custom overflow scrollers, confirm `nestedScrollable()`'s
   `overflowY` check covers them (it handles `auto`/`scroll`).
4. Tune the single `SMOOTHING` constant.

**System B — entrance wave**
1. Copy the `:root` tokens, the two `@keyframes`, the shared-timing rule, the
   keyframe-assignment rules, the `:nth-child` numbering block, and the
   reduced-motion override.
2. Rewrite the selectors (`.content__col`, `.prose-body`, `.page-header`,
   `.sidebar`) to match your shell. The only requirement: a header block + a
   container whose direct children are the animated blocks.
3. Ensure any sticky element uses the **flat** `fade-in` (no `translateY`).
4. Extend the `:nth-child` table if a page has more than 40 top-level blocks.
5. (Optional) Add the replay reflow if you need to re-trigger without reload.

---

## 6. Appendix — full portable source

### 6.1 `smooth-scroll.js` (complete)

```js
/* Smooth ("lazy") scrolling — vanilla, dependency-free.
   Include once per page. THE ONE KNOB is SMOOTHING. */
(function () {
  'use strict';

  const SMOOTHING = 0.08; // fraction of remaining distance covered per 60fps frame

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let current = 0;   // where we've eased to
  let target = 0;    // where input wants the page
  let rafId = null;
  let lastTime = null;
  let lastSetY = -1; // last scrollY we set, to tell our own scrolls apart

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamp = (v) => Math.max(0, Math.min(v, maxScroll()));

  // Let a nested overflow area scroll natively when it still can.
  function nestedScrollable(node, dy) {
    for (let el = node; el && el !== document.body; el = el.parentElement) {
      if (el.nodeType !== 1) continue;
      const oy = getComputedStyle(el).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) {
        const atTop = el.scrollTop <= 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) return true;
      }
    }
    return false;
  }

  function ensureRaf() {
    if (rafId == null) {
      lastTime = null;
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    if (lastTime == null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05); // sec, capped for tab-switches
    lastTime = now;

    // Normalise the lerp to 60fps so the feel is identical on 120Hz+ displays.
    const t = 1 - Math.pow(1 - SMOOTHING, dt * 60);
    current += (target - current) * t;
    if (Math.abs(target - current) < 0.5) current = target;

    window.scrollTo(0, current);
    lastSetY = window.scrollY;

    rafId = current !== target ? requestAnimationFrame(tick) : null;
  }

  function onWheel(e) {
    if (e.ctrlKey) return;                 // pinch-zoom — leave to browser
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;       // lines -> px
    else if (e.deltaMode === 2) dy *= window.innerHeight; // pages -> px
    if (nestedScrollable(e.target, dy)) return;
    e.preventDefault();
    target = clamp(target + dy);
    ensureRaf();
  }

  function onKeydown(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const ae = document.activeElement;      // don't swallow keys meant for inputs
    if (ae && ae !== document.body && ae !== document.documentElement) return;

    const page = window.innerHeight * 0.9;
    const line = 60;
    let delta = null;
    switch (e.key) {
      case 'ArrowDown': delta = line; break;
      case 'ArrowUp': delta = -line; break;
      case 'PageDown': delta = page; break;
      case 'PageUp': delta = -page; break;
      case ' ': delta = e.shiftKey ? -page : page; break;
      case 'Home': e.preventDefault(); target = 0; ensureRaf(); return;
      case 'End': e.preventDefault(); target = maxScroll(); ensureRaf(); return;
      default: return;
    }
    e.preventDefault();
    target = clamp(target + delta);
    ensureRaf();
  }

  // Adopt the position when anything else moves it (scrollbar, find-in-page…).
  function onScroll() {
    if (window.scrollY !== lastSetY) current = target = window.scrollY;
  }
  function onResize() { target = clamp(target); }

  function enable() {
    current = target = window.scrollY || 0;
    lastSetY = window.scrollY;
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }
  function disable() {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  function apply() { disable(); if (!reduceMotion.matches) enable(); }

  document.addEventListener('DOMContentLoaded', apply);
  reduceMotion.addEventListener('change', apply);
})();
```

Plus, at the top of your first script:

```js
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
```

### 6.2 Entrance wave (complete CSS)

```css
:root {
  --stagger-base: 100ms;   /* gap before block 1 starts after block 0 */
  --stagger-growth: 10ms;  /* each subsequent gap grows by this much   */
  --stagger-max: 600ms;    /* clamp so a fast scroll can't outrun it    */
  --ease-arrive: cubic-bezier(0.16, 1, 0.3, 1); /* expo-out */
  --duration-arrive: 1.4s;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(200px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Shared timing for every animated element. */
.animate-fade-in-up,
.animate-fade-in,
.sidebar,
.content__col > .page-header,
.content__col > .prose-body > * {
  --i: 0;
  animation-duration: var(--duration-arrive);
  animation-timing-function: var(--ease-arrive);
  animation-fill-mode: both;          /* keeps blocks hidden during delay */
  animation-delay: min(
    var(--i) * var(--stagger-base)
      + var(--i) * (var(--i) - 1) / 2 * var(--stagger-growth),
    var(--stagger-max)
  );
}

/* Which keyframe each rides. */
.animate-fade-in-up,
.content__col > .page-header,
.content__col > .prose-body > * { animation-name: fade-in-up; }
.animate-fade-in,
.sidebar                        { animation-name: fade-in; } /* flat: sticky, must not shift */

/* Auto-number blocks: header is 0, prose children continue 1..40. */
.content__col > .page-header { --i: 0; }
.content__col > .prose-body > *:nth-child(1)  { --i: 1; }
.content__col > .prose-body > *:nth-child(2)  { --i: 2; }
.content__col > .prose-body > *:nth-child(3)  { --i: 3; }
/* … continue sequentially … */
.content__col > .prose-body > *:nth-child(40) { --i: 40; }

/* Accessibility: no motion. */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-fade-in,
  .sidebar,
  .content__col > .page-header,
  .content__col > .prose-body > * { animation: none; }
}
```

> Generate the 40 `:nth-child` lines with a loop in your build/preprocessor if
> you prefer not to hand-write them.

---

*Source of truth in this repo:* [`js/smooth-scroll.js`](../../js/smooth-scroll.js),
the entrance section of [`src/input.css`](../../src/input.css), and the
`scrollRestoration` line in [`js/nav.js`](../../js/nav.js).
