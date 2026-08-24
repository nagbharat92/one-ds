# Inline message

Use an inline message for contextual status or feedback within the current flow.

## CSS

Copy `tokens.css` and `components/inline-message/inline-message.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="inline-message inline-message--danger" role="alert">
  <span>The item could not be saved.</span>
</div>
```

Use `role="alert"` only for urgent information that should be announced immediately. For nonurgent updates, use an appropriate status role or no live-region role.

## Variants

Danger: use `inline-message inline-message--danger` for errors requiring attention.