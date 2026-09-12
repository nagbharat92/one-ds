# OneDS delta — 2026-09-10

Companion to `oneds-context.md`. The digest is the stable snapshot; this is the running log of execution decisions to carry back into brainstorming.

**Repo state:** `HEAD 94f53f1`, worktree clean. This is the same commit the digest was written against, so the digest is still accurate. Nothing below changes it — this is the *why* behind the work that produced `94f53f1`, plus the paths that were tried and abandoned.

---

## 1. Icon system: Lucide → Hugeicons → Material Symbols, in one session

- Lucide rejected (disliked glyphs). Built an icon showcase page first — SVG box, size scale, annotations — before migrating anything.
- Adopted **Hugeicons** free rounded-stroke, swept all ~130 exports across the site, wrote a rule requiring it.
- Then asked whether libraries could be swapped at will. Answer shipped as a **build-time adapter**, not a runtime provider: `icon-adapters/active.ts` is the single selection point and `icons.tsx` is the only public module that imports it. No runtime switching, no multi-library bundle.
- Immediately swapped again to **Material Symbols Rounded** and deleted Hugeicons entirely. Self-hosted 42KB WOFF2 subset (122 symbols, FILL 0–1, opsz 20–48, wght 400), checked into the repo; builds and browsers never fetch Google Fonts at runtime. `npm run icons:update-font` refreshes the subset and manifest.
- Selected state animates the font's **FILL axis 0 → 1**. Not a static outline/filled icon swap, not CSS path fill or stroke weight. Reduced motion sets the fill immediately.
- Review corrections: the side-panel icon must **not** be filled by default (fill only when selected or explicitly requested); the FAB uses the smaller icon size so it matches the expanded sidebar rather than growing on collapse; sort icon for sort.
- Four footer brand logos use `Favicon`, not icons — Material has no brand set.

## 2. FAB `expressive` variant + sidebar trigger motion

- New `variant="expressive"` on Fab: large size only, a silhouette from the shared shape library rendered behind the icon, transparent background.
- Shape set is **4-, 6-, and 7-sided cookies**. The originally proposed 2-sided was dropped in favour of 4. Default is `cookie6`.
- The sidebar floating trigger picks a **random shape from that set every time the sidebar collapses**.
- Motion, tuned live and then tokenized:
  - **half turn** (`spin-turns: 0.5` — 180°, not a full rotation)
  - velocity-derived duration (`spin-velocity: 240`, `growth-velocity: 32`)
  - scale **0.8 → 1**
  - settle curve `cubic-bezier(0.22, 0, 0.1, 1)`
  - fade-in **delayed** so rotation and growth begin before opacity does, so the start of the animation is never visible
  - faster fade-out (`--speed-swift`)
- **Tried and reverted:** parking the FAB on top of the sidebar's own panel-toggle button so the two would read as the same control.
- **Tried and reverted:** forcing every FAB SVG to 14px inside 24px boxes.
- Committed, pushed, deployed to VibeHub as `94f53f1`.

---

## Open questions worth a decision

1. **Is the random per-collapse silhouette a signature behavior or a novelty?** It is currently sidebar-specific, has no rule backing it, and is the only place in the system where shape is non-deterministic.
2. **Is Material Symbols final?** The adapter makes a future swap cheap, but the rule requires explicit approval plus updated policy checks for any change. Worth closing rather than leaving implicitly provisional.
3. The five tensions in digest §13 — corpus outgrowing the system, six load-bearing manual-review rules, the inverted color-before-form sequence, only one block, no Expression Lab verdict — are all still open and untouched by this work.

---

## Handoff contract (digest §14, unchanged)

A decision coming back for execution should carry:

- the `rules.json` id it implements, tunes, or proposes — or an explicit "no new rule"
- the owning component file
- the token names to add or change in `src/index.css`
- which verification row applies, and the single focused check that would expose the defect
- whether it is approved work or a scoped experiment
