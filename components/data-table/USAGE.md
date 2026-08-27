# Data table

Use a data table to present structured records for scanning and comparison across columns.

## CSS

Copy `tokens.css`, `components/card/card.css`, and `components/data-table/data-table.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<div class="card">
  <div class="data-table__scroll">
    <table class="data-table">
      <caption>Component library status</caption>
      <thead>
        <tr>
          <th scope="col">Component</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Button</th>
          <td>Stable</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

Every table must be inside a `card`, wrapped in `data-table__scroll` so it owns its horizontal overflow.

## Header treatment

The header sits on a filled grey band with semibold, secondary-grey labels; data cells stay in primary ink on the plain surface. Use each header role for what it names:

- `caption`: titles the table. Without it, the column header row reads as the title; with it, the column header row reads as a sub-header beneath the caption.
- `th scope="col"` in `thead`: labels each column.
- `th scope="row"` as the first cell of a body row: identifies each record so a screen reader announces it alongside every value.

## Rows

Each body row is a backplate with a full interaction ramp, in both its unselected and selected forms:

- **Unselected** — rest is transparent; hover takes a light neutral overlay. A selectable row carries `aria-selected` (use `"false"` when it is not selected), which also gives it a pressed step; a plain, non-selectable row only hovers.
- **Selected** — set `aria-selected="true"` to rest on the filled band; hover and pressed step it darker in the same rhythm. Selection is app state, not a static style: pair each row with a leading checkbox cell and toggle `aria-selected` on the row as the box changes (add `"true"` when checked, `"false"` when unchecked).
- **Disabled** — set `aria-disabled="true"` to rest on the disabled step, dim the ink, and take no hover or pressed state. It combines with `aria-selected` for a selected-but-inert row; disable the row's checkbox too.

Each step resolves through the `--data-table-row-*` custom properties, so a selected row only has to swap the four values, not restate the rules.

## Wide tables

The `data-table__scroll` wrapper owns the horizontal overflow, so a table with many columns scrolls sideways inside its card instead of stretching the page. By default cells wrap; add `data-table--nowrap` to keep every cell on one line so the table scrolls rather than wrapping its text.

```html
<div class="data-table__scroll">
  <table class="data-table data-table--nowrap">…</table>
</div>
```

## Footer

Add a `tfoot` for a summary or totals row. It sits on the same filled band as the header, separated from the body by a hairline, with semibold text.

```html
<tfoot>
  <tr>
    <th scope="row">Total</th>
    <td>4 components</td>
  </tr>
</tfoot>
```