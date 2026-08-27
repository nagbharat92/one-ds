# Checkbox

Use a checkbox to toggle one independent option on or off.

## CSS

Copy `tokens.css` and `components/checkbox/checkbox.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<label class="checkbox">
  <input class="checkbox__input" type="checkbox">
  <span class="checkbox__box" aria-hidden="true">
    <svg class="checkbox__check" viewBox="0 0 16 16"><use href="fluent-icons.svg#checkmark-16-regular"></use></svg>
  </span>
  <span class="checkbox__body"><span class="checkbox__label">Accept terms and conditions</span></span>
</label>
```

The `<label>` wraps a real `<input type="checkbox">`, so the whole row is clickable and every native behaviour — keyboard toggle, focus, form submission, and the checked state — is preserved. The input is transparent and sits over `checkbox__box`, which is the visible control; the box reflects state through the input's `:checked`, `:indeterminate`, `:focus-visible`, and `:disabled` sibling selectors. Mark the box `aria-hidden="true"` because the input already carries the accessible role.

## Description

Add a `checkbox__description` after the label inside `checkbox__body` for supporting detail:

```html
<span class="checkbox__body">
  <span class="checkbox__label">Enable notifications</span>
  <span class="checkbox__description">Send me product updates and occasional announcements.</span>
</span>
```

## Disabled

Add the `disabled` attribute to the input. The box and body dim, and the pointer changes to `not-allowed`.

## Indeterminate

Set the input's `indeterminate` property in script (`checkbox.indeterminate = true`). The box fills and shows a dash instead of a check. Use it for a parent that governs a partially selected group, such as a table's select-all control.

## Group

Wrap related checkboxes in a [field set](../field/USAGE.md) to give them a legend and a single consistent rhythm:

```html
<fieldset class="field-set">
  <legend class="field-set__legend">Notifications</legend>
  <div class="field-group">
    <label class="checkbox">…</label>
    <label class="checkbox">…</label>
  </div>
</fieldset>
```

The `<legend>` gives the set an accessible name, and the `field-group` stacks the checkboxes.

## Table

Place a checkbox in a leading `<td>`/`<th>` to select rows. The header cell holds a select-all checkbox that becomes `indeterminate` when only some rows are selected. Keep the icon and input markup identical to any other checkbox.

## When not to use

Do not use it for mutually exclusive choices or to trigger an immediate action. For one choice among several, use a radio group; for an instant action, use a button.
