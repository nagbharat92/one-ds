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
    <p class="card__text">Optional status or metadata</p>
    <div class="cluster cluster--group">
      <button class="button button--outline" type="button">Cancel</button>
      <button class="button" type="button">Save</button>
    </div>
  </footer>
</article>
```

Keep the `aria-labelledby` value synchronized with the title's `id`. The header, description, body, and footer are optional; omit regions the content does not need. Footer actions use the button and cluster components — a secondary (cancel) button and a primary action are both optional.

## Composition

Compose richer cards from these optional parts:

- `card__media`: an image that bleeds to the card edge above the header. Place it as the first child; its top corners stay concentric with the card. Give the `<img>` intrinsic `width`/`height` so it reserves space before it loads.
- `card__eyebrow`: a leading row for a badge or label above the title, inside `card__header`.
- `card__action`: a trailing link or badge pinned to the header's top-right, beside the title.
- Form fields: compose a card form from the [field](../field/USAGE.md) component (`field`, `field__label`, `field__description`, `field__error`), not card-specific classes.
- `card__scroll`: an edge-to-edge scroll region (terms, changelog) framed by a rule above and below. Add `tabindex="0"`, `role="region"`, and an `aria-label` so it is keyboard-scrollable and named.
- `card__footer--stack`: a stacked, full-width action footer (auth buttons, a single call to action) with no top rule. Combine with `button--block` buttons.

## Variants

- Default: use `card` — a filled surface with a soft shadow that lifts off the page; the most common card.
- Subtle: use `card card--subtle` — flat, stroke-only, no lift, for when a card should recede or when many cards on one screen would make shadows noisy.
- Canvas: use `card card--canvas` — a recessed, dotted stage for framing a live preview or example rather than reading content.
- Compact: use `card card--compact` — reduced token-defined spacing; combine with any type.
