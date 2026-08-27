# Alert

Use an alert to call out a short, important message with an icon, a title, and supporting detail inside a bounded surface.

## CSS

Copy `tokens.css` and `components/alert/alert.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="alert" role="alert">
  <svg class="alert__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="…" fill="currentColor"></path></svg>
  <div class="alert__title">Heads up</div>
  <div class="alert__content">Your changes are saved automatically as you work.</div>
</div>
```

The status icons use the filled `info`, `error-circle`, `warning`, and `checkmark-circle` glyphs from the project sprite at the 16 grid. The icon is optional: omit `alert__icon` and the layout collapses to a single column. The title is also optional when the message is a single line.

## Anatomy

- `alert` — the bounded surface. It lays the icon, title, and content out on a grid.
- `alert__icon` — the leading status glyph, centered on the title line.
- `alert__title` — the short headline.
- `alert__content` — the supporting sentence.

## Variants

- **Neutral** (default): a quiet informational callout.
- `alert--danger` — an error or blocking problem.
- `alert--warning` — a caution the reader should weigh.
- `alert--success` — a completed or positive outcome.

## Accessibility

`role="alert"` announces the message assertively, which suits an error or a state change. For a passive, always-present note, drop the role or use `role="status"` so it is not announced urgently.

## When not to use

Do not use it for a single inline sentence of status that belongs beside a field — reach for `inline-message`. Do not use it for content that requires a response before continuing — use `dialog`.
