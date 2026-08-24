# Search field

Use a search field to capture a query that searches or filters content.

## CSS

Copy `tokens.css` and `components/search-field/search-field.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<label for="site-search">Search</label>
<span class="search-field">
  <input class="search-field__input" id="site-search" type="search" placeholder="Search items">
</span>
```

Keep a programmatic label even when the visual design omits visible label text. Use the native search input type so platforms expose appropriate behavior.