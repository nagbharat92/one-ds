# Separator

Use a separator to mark a thematic break between siblings in a stack, or between groups of controls in a row.

## CSS

Copy `tokens.css` and `components/separator/separator.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Clearance

A separator carries no external space. The clearance on both sides comes from the gap of the container it is dropped into, so a separated boundary is always `gap + rule + gap` and is symmetric by construction. Never add margin or padding to a separator to make room for it; change the container's rhythm instead.

Because the cost is twice the container gap, a separator belongs at component scale. At `--oneds-rhythm-block` a separated boundary is 81px, which is a chapter break rather than a section break.

## Markup

A horizontal break between blocks uses `<hr>`, which is already exposed as a separator:

```html
<div class="stack stack--items">
  <p>Content above the break.</p>
  <hr class="separator">
  <p>Content below the break.</p>
</div>
```

A vertical break between groups of controls needs an explicit role and orientation:

```html
<div class="toolbar" role="toolbar" aria-label="Editor actions">
  <button class="button button--quiet" type="button">Undo</button>
  <div class="separator separator--vertical" role="separator" aria-orientation="vertical"></div>
  <button class="button button--quiet" type="button">Redo</button>
</div>
```

A labelled marker centres a short caption between two rules — for a date break in a feed or a "compacted" marker in a running log. The rules fill the space left by the label:

```html
<div class="separator-marker" role="separator">
  <span class="separator-marker__label">Today</span>
</div>
```

Use a separator only where space alone cannot carry the separation. Where a bounded surface already draws an edge, that edge is the separator and a rule beside it competes with it.
