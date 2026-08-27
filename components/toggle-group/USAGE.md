# Toggle group

Use a toggle group to choose one option from a small mutually exclusive set (single), or to turn several independent options on and off at once (multiple), while every choice stays visible. It ships at one large size.

## CSS

Copy `tokens.css` and `components/toggle-group/toggle-group.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="toggle-group" role="group" aria-label="Text alignment">
  <button class="toggle-group__item" type="button" aria-pressed="true">Left</button>
  <button class="toggle-group__item" type="button" aria-pressed="false">Center</button>
  <button class="toggle-group__item" type="button" aria-pressed="false">Right</button>
</div>
```

Each item is a real `<button type="button">` carrying `aria-pressed`. The pressed segment fills with the brand tint. The host toggles `aria-pressed` in response to clicks and keyboard input; the CSS reflects the state through the `[aria-pressed="true"]` selector.

## Selection type

- **Single**: exactly one item is pressed at a time. Toggling one item off any others. Give the group `role="group"` (or `role="radiogroup"` if it behaves like a radio set) and keep one `aria-pressed="true"`.
- **Multiple**: any number of items may be pressed independently. Use `role="group"` and let each item hold its own `aria-pressed`.

The markup is identical; only the host's toggling logic differs.

## Variants

- **Default**: segmented items sit on a recessed track. This is the base class.
- **Outline**: add `toggle-group--outline` for bordered items joined flush with a single seam, with no track.

```html
<div class="toggle-group toggle-group--outline" role="group" aria-label="Text style">
  <button class="toggle-group__item" type="button" aria-pressed="true">Bold</button>
  <button class="toggle-group__item" type="button" aria-pressed="false">Italic</button>
  <button class="toggle-group__item" type="button" aria-pressed="false">Underline</button>
</div>
```

## Icons

An item may hold an icon, a label, or both. Inline the SVG with `fill="currentColor"`; the component sizes it with `--oneds-component-toggle-group-icon-size`. Give icon-only items an `aria-label`.

```html
<button class="toggle-group__item" type="button" aria-pressed="true" aria-label="Bold">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>
```

## Disabled

Add the `disabled` attribute to an individual item to make it unavailable.

## When not to use

Do not use it for page navigation between peer panels — use tabs. Do not use it to trigger an immediate one-off action — use a button. Do not use it for a long list of options better served by a select or combobox.
