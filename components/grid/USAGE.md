# Grid

Use a grid to arrange peer content in consistent responsive columns.

## CSS

Copy `tokens.css` and `components/grid/grid.css` verbatim into the output HTML's inline `<style>` block. Copy the CSS for each child component as well. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<div class="grid">
  <article class="card">
    <h2 class="card__title">First item</h2>
  </article>
  <article class="card">
    <h2 class="card__title">Second item</h2>
  </article>
</div>
```

Keep the source order meaningful because the grid collapses naturally as space becomes constrained.