# Pagination

Use pagination to move through a sequence of pages when a dataset is split across many of them.

## CSS

Copy `tokens.css` and `components/pagination/pagination.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<nav class="pagination" aria-label="Pagination">
  <ul class="pagination__list">
    <li class="pagination__item">
      <a class="pagination__link pagination__link--nav" href="?page=4" rel="prev" aria-label="Go to previous page">
        <svg class="pagination__icon pagination__icon--prev" viewBox="0 0 16 16">…chevron…</svg>
        <span>Previous</span>
      </a>
    </li>
    <li class="pagination__item"><a class="pagination__link" href="?page=1" aria-label="Go to page 1">1</a></li>
    <li class="pagination__item"><span class="pagination__ellipsis" role="img" aria-label="More pages">…</span></li>
    <li class="pagination__item"><a class="pagination__link pagination__link--active" href="?page=5" aria-current="page" aria-label="Page 5">5</a></li>
    <li class="pagination__item"><span class="pagination__ellipsis" role="img" aria-label="More pages">…</span></li>
    <li class="pagination__item"><a class="pagination__link" href="?page=20" aria-label="Go to page 20">20</a></li>
    <li class="pagination__item">
      <a class="pagination__link pagination__link--nav" href="?page=6" rel="next" aria-label="Go to next page">
        <span>Next</span>
        <svg class="pagination__icon" viewBox="0 0 16 16">…chevron…</svg>
      </a>
    </li>
  </ul>
</nav>
```

Wrap the control in a `<nav>` with an accessible name and lay the pages out in an unordered list. Each page is a `pagination__link`; give it an `aria-label` that names the destination page.

## Current page

Mark the current page's link with `pagination__link--active` and `aria-current="page"`. It stays a link so people can re-request the page.

## Previous and Next

The first and last items are `pagination__link--nav` links carrying a chevron and a label. Set `rel="prev"` / `rel="next"` and an `aria-label`. The Previous chevron reuses the shared `chevron-right-16-regular` symbol rotated with `pagination__icon--prev`, so no extra icon is needed.

## Many pages

When there are more pages than fit, drop the middle numbers and keep the first page, a window around the current page, and the last page, separating the gaps with a `pagination__ellipsis`. The ellipsis is static: it signals omitted pages and is not a control.

## Disabled ends

At the first or last page, mark the unavailable Previous or Next link with `aria-disabled="true"`. It dims and stops responding to the pointer while staying in the tab order for assistive technology.

## Sizing

Numbered links are square (`--oneds-component-pagination-item-size`, 32px) and expand only for wider content; Previous and Next add `--oneds-component-pagination-nav-padding-inline` for their labels. Numbers use tabular figures so the row does not shift as pages change.
