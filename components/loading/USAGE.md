# Loading

Use the loading indicator while an active operation has not completed.

## CSS

Copy `tokens.css` and `components/loading/loading.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<span class="loading" role="status" aria-label="Loading"></span>
```

Provide nearby visible status text when the operation is not obvious from context. Remove the indicator when work completes; do not leave it visible for empty or error states.