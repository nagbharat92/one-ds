# Radio

Use a radio to choose one option from a small, mutually exclusive set that is visible at once.

## CSS

Copy `tokens.css` and `components/radio/radio.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<label class="radio">
  <input class="radio__input" type="radio" name="plan" checked>
  <span class="radio__circle" aria-hidden="true"></span>
  <span class="radio__body"><span class="radio__label">Starter</span></span>
</label>
```

The `<label>` wraps a real `<input type="radio">`, so the whole row is clickable and every native behaviour — arrow-key selection within a group, focus, form submission, and the checked state — is preserved. The input is transparent and sits over `radio__circle`, which is the visible control; the circle reflects state through the input's `:checked`, `:focus-visible`, and `:disabled` sibling selectors. Mark the circle `aria-hidden="true"` because the input already carries the accessible role.

## Group

Radios that share a `name` attribute form one mutually exclusive group. Wrap them in a [field set](../field/USAGE.md) to give the group a legend and a single consistent rhythm:

```html
<fieldset class="field-set">
  <legend class="field-set__legend">Plan</legend>
  <div class="field-group">
    <label class="radio">…</label>
    <label class="radio">…</label>
  </div>
</fieldset>
```

## Description

Add a `radio__description` after the label inside `radio__body` for supporting detail:

```html
<span class="radio__body">
  <span class="radio__label">Starter</span>
  <span class="radio__description">For individuals getting started.</span>
</span>
```

## Disabled

Add the `disabled` attribute to the input. The circle and body dim, and the pointer changes to `not-allowed`.

## When not to use

Do not use it to toggle a single independent option — reach for a [checkbox](../checkbox/USAGE.md). Do not use it for a long list of choices or one that benefits from search — use a [combobox](../combobox/USAGE.md). To make each option a large selectable tile with a title and description, use a [choice card](../field/USAGE.md).
