# Empty state

Use an empty state to explain why expected content is absent and offer an appropriate next step.

## CSS

Copy `tokens.css` and `components/empty-state/empty-state.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<section class="empty-state" aria-labelledby="empty-state-title">
  <h2 class="empty-state__title" id="empty-state-title">No results</h2>
  <p class="empty-state__description">Try changing your search or filters.</p>
</section>
```

An optional decorative or status icon may use `empty-state__icon`. Keep required recovery instructions in text.