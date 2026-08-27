# Breadcrumb

Use a breadcrumb to show the current page's position in the site hierarchy and let people step back up it.

## CSS

Copy `tokens.css` and `components/breadcrumb/breadcrumb.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb__item"><a class="breadcrumb__link" href="/">Home</a></li>
    <li class="breadcrumb__separator" aria-hidden="true"><svg viewBox="0 0 16 16">…chevron…</svg></li>
    <li class="breadcrumb__item"><span class="breadcrumb__page" aria-current="page">Current page</span></li>
  </ol>
</nav>
```

Wrap the trail in a `<nav>` with an accessible name and use an ordered list. Every link is a `breadcrumb__link`; the final, current page is a `breadcrumb__page` with `aria-current="page"` and is not a link.

## Separator

Each separator is its own `breadcrumb__separator` list item, marked `aria-hidden="true"`, holding a chevron icon sized by `--oneds-component-breadcrumb-icon-size` (12px). Use the chevron, not a dot or slash.

## Collapsed

When the trail is long, replace the hidden middle items with a single ellipsis so the first and last levels stay visible:

```html
<li class="breadcrumb__item">
  <span class="breadcrumb__ellipsis" role="img" aria-label="More levels">…</span>
</li>
```

The ellipsis is static: it only signals that levels were omitted. It is not a dropdown trigger.
