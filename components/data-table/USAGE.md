# Data table

Use a data table to present structured records for scanning and comparison across columns.

## CSS

Copy `tokens.css`, `components/card/card.css`, and `components/data-table/data-table.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<div class="card card--compact">
  <div class="data-table__scroll">
    <table class="data-table">
      <caption>Release status</caption>
      <thead>
        <tr>
          <th scope="col">Version</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Current</td>
          <td>Available</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

Every table must be inside a `card`. Include a concise caption and use row and column header scopes where appropriate.

## Variants

- Default: use `data-table`.
- Compact: use `data-table data-table--compact` when rows contain short reference values.