# Page header

Use a page header to introduce the current page with its title, context, and primary actions.

## CSS

Copy `tokens.css` and `components/page-header/page-header.css` verbatim into the output HTML's inline `<style>` block. Copy the CSS for any actions as well. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<header class="page-header">
  <div class="page-header__content">
    <h1 class="page-header__title">Page title</h1>
    <p class="page-header__description">A concise description of the page's purpose.</p>
  </div>
  <div class="page-header__actions">
    <button class="button" type="button">Primary action</button>
  </div>
</header>
```

Use one page header per page. The description and actions are optional; omit either region when it has no content.