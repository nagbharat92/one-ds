# Toolbar

Use a toolbar to group compact controls that operate on the current view or content.

## CSS

Copy `tokens.css`, `components/toolbar/toolbar.css`, and the CSS for each contained control verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<div class="toolbar" role="toolbar" aria-label="Editor actions">
  <button class="button button--quiet" type="button">Undo</button>
  <button class="button button--quiet" type="button">Redo</button>
</div>
```

Give each toolbar an accessible name. Keep controls related to one task and preserve a predictable keyboard order.