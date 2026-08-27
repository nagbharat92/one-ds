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

Emphasis, one per button:

- Primary: use `button`. The filled brand action; shadcn calls this the default.
- Secondary: use `button button--secondary`. A filled neutral action for the second-most-important choice.
- Outline: use `button button--outline`. A bordered, transparent-filled action that recedes below secondary.
- Ghost: use `button button--quiet`. No border or fill until hover; for low-emphasis and icon-only controls.
- Destructive: use `button button--danger` for destructive actions.
- Link: use `button button--link`. Reads as a text link but behaves as a button; underlines on hover.

Content, combine with any emphasis:

- Label only: text inside `button` (the default).
- Icon and label: place an SVG icon before the label and mark it `aria-hidden="true"`; the `gap` spaces them. Wrap the label in `<span class="text-trim">` so the icon centres on the letters, not on the font's leading. The button adds a larger trailing padding (`--oneds-component-button-icon-label-padding-inline-end`, 16px) so the leading icon does not make the content look shifted toward the right edge.
- Icon only: add `button--icon`, include one SVG icon, and provide an accessible name with `aria-label`.
- Spinner: place a `<span class="button__spinner" aria-hidden="true"></span>` before the label, add `aria-busy="true"`, and set `disabled` while the action is in flight.

## Parameters

Combine any of these with any variant.

- Rounded: add `button--pill` only when the pill shape communicates the control's role.
- Full width: add `button--block` when the action should fill its container.
- Disabled: use the native `disabled` attribute.

## Groups

- Button group: wrap two or more buttons in `<div class="button-group" role="group" aria-label="…">`. They sit flush, share the outer corners, and collapse the seam between them. Use one emphasis across the group.
- Split button: a button group whose last member is an icon-only `button--icon` holding a `chevron-down` icon, pairing a default action with its alternatives.
