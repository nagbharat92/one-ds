# Badge

Use a badge to label, categorize, or annotate an adjacent element with a small, non-interactive marker.

## CSS

Copy `tokens.css` and `components/badge/badge.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<span class="badge">Badge</span>
```

A badge is usually a `<span>`. It may be an `<a>` when it links somewhere, in which case the focus ring applies automatically.

## Variants

One per badge:

- Default: use `badge`. A filled brand marker for the primary emphasis.
- Secondary: use `badge badge--secondary`. A filled neutral marker for lower emphasis.
- Destructive: use `badge badge--destructive`. A filled status marker for errors or removals.
- Outline: use `badge badge--outline`. A bordered marker that recedes into the surface.

## Icon

Place an SVG icon before the label and mark it `aria-hidden="true"`; the `gap` spaces them. The icon is sized by `--oneds-component-badge-icon-size` (12px). Fetch the asset drawn on the matching grid. Wrap the label in `<span class="text-trim">` so the icon centres on the letters, not the font's leading; when a leading icon is present the badge tucks its leading padding to `--oneds-component-badge-icon-padding-inline-start` (4px) so the icon sits snug, and keeps the trailing padding at the base inline value (`--oneds-component-badge-icon-label-padding-inline-end`, 8px) so the icon and label read as centred rather than shifted toward the text.
