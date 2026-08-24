# Section

Use a section to organize a distinct topic or task within the page flow.

## CSS

Copy `tokens.css` and `components/section/section.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<section class="section" aria-labelledby="section-title">
  <header class="section__header">
    <h2 class="section__title" id="section-title">Section title</h2>
    <p class="section__description">A concise introduction to this topic.</p>
  </header>
  <div class="section__body">
    <p>Section content belongs here.</p>
  </div>
</section>
```

Keep the `aria-labelledby` value synchronized with the title's `id`. The description is optional; omit it when the title provides enough context.