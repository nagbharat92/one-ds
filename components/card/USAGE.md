# Card

Use a card to group closely related content and actions within one bounded surface.

## CSS

Copy `tokens.css` and `components/card/card.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<article class="card" aria-labelledby="card-title">
  <header class="card__header">
    <h2 class="card__title" id="card-title">Card title</h2>
    <p class="card__description">A concise description of the grouped content.</p>
  </header>
  <div class="card__body">
    <p class="card__text">Card content belongs here.</p>
  </div>
  <footer class="card__footer">
    <p class="card__text">Optional supporting information or actions belong here.</p>
  </footer>
</article>
```

Keep the `aria-labelledby` value synchronized with the title's `id`. The header, description, body, and footer are optional; omit regions the content does not need.

## Variants

- Default: use `card`.
- Compact: use `card card--compact` for reduced token-defined spacing.
- Flat: use `card card--flat` to remove the token-defined shadow.
- Compact and flat: use `card card--compact card--flat` when both variants apply.
