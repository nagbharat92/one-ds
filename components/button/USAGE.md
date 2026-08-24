# Button

Use a button to trigger an immediate action or state change.

## CSS

Copy `tokens.css` and `components/button/button.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<button class="button" type="button">Primary action</button>
```

Use `type="button"` unless the button intentionally submits a form. Give icon-only buttons an accessible name.

## Variants

- Primary: use `button`.
- Secondary: use `button button--secondary`.
- Quiet: use `button button--quiet`.
- Danger: use `button button--danger` for destructive actions.
- Pill: add `button--pill` only when the pill shape communicates the control's role.
- Block: add `button--block` when the action should fill its container.
- Disabled: use the native `disabled` attribute.