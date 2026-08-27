# Switch

Use a switch to toggle a single independent option on or off, applying the change immediately.

## CSS

Copy `tokens.css` and `components/switch/switch.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<label class="switch">
  <input class="switch__input" type="checkbox" role="switch" checked>
  <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
  <span class="switch__body"><span class="switch__label">Airplane mode</span></span>
</label>
```

The `<label>` wraps a real `<input type="checkbox">` carrying `role="switch"`, so the whole row is clickable and every native behaviour — focus, form submission, and the on/off state — is preserved. The input is transparent and sits over `switch__track`, which is the visible control; the track and thumb reflect state through the input's `:checked`, `:focus-visible`, and `:disabled` sibling selectors. Mark the track `aria-hidden="true"` because the input already carries the accessible role.

## Description

Add a `switch__description` after the label inside `switch__body` for supporting detail:

```html
<span class="switch__body">
  <span class="switch__label">Marketing emails</span>
  <span class="switch__description">Receive product news and offers.</span>
</span>
```

## Choice card

Add `switch--card` to the label to present the option as a selectable tile. The tile hosts the switch at its trailing edge and tints when on:

```html
<label class="switch switch--card">
  <input class="switch__input" type="checkbox" role="switch" checked>
  <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
  <span class="switch__body">
    <span class="switch__label">Marketing emails</span>
    <span class="switch__description">Receive product news and offers.</span>
  </span>
</label>
```

## Disabled

Add the `disabled` attribute to the input. The track and body dim, and the pointer changes to `not-allowed`.

## Invalid

Add `aria-invalid="true"` to the input. The track boundary turns to the danger colour, and the focus ring follows.

## When not to use

Do not use it to choose one option from a mutually exclusive set — reach for a [radio](../radio/USAGE.md). Do not use it when the change should not apply until a form is submitted; use a [checkbox](../checkbox/USAGE.md) so the pending state reads as a selection rather than a live setting.
