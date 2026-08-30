# Input

Use an input to capture one line of user-entered text or data.

## CSS

Copy `tokens.css` and `components/input/input.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<input class="input" id="display-name" type="text" placeholder="Enter a name" aria-label="Display name">
```

Always provide a programmatic label. To pair the control with a visible label, description, or error message, wrap it in a [field](../field/USAGE.md) — the input is the control, the field supplies the surrounding label and help:

```html
<div class="field">
  <label class="field__label" for="display-name">Display name</label>
  <input class="input" id="display-name" type="text" placeholder="Enter a name">
  <p class="field__description">Shown on your public profile.</p>
</div>
```

Choose the native input type that matches the expected data and expose validation errors in associated text.

## States

- Disabled: set the native `disabled` attribute to dim the control.
- Invalid: set `aria-invalid="true"` to turn the border and focus ring to the danger colour. Show the message with a [field](../field/USAGE.md)'s `field__error`.

## Variants

- `input`: the base single-line control.
- `input-group`: joins the input flush with a trailing action button — a search or subscribe control. The button is sized to match the input height.

```html
<div class="input-group">
  <input class="input" id="subscribe-email" type="email" placeholder="name@company.com" aria-label="Email address">
  <button class="button button--primary" type="button">Subscribe</button>
</div>
```

An `input-group` also needs `components/button/button.css`.

