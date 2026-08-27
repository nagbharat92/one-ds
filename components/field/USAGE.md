# Field

Use a field to host a control and attach its label, description, and error message. The field is the host — it does not replace the control it wraps. Put an [input](../input/USAGE.md), a [textarea](../text-box/USAGE.md), a select, or a slider inside it; group related fields with a field set; and turn an option into a large selectable tile with a choice card.

## CSS

Copy `tokens.css` and `components/field/field.css` verbatim into the output HTML's inline `<style>` block. Also copy the CSS of whichever control you host inside the field. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="field">
  <label class="field__label" for="email">Email</label>
  <input class="input" id="email" type="email" placeholder="you@example.com" aria-describedby="email-help">
  <span class="field__description" id="email-help">We only use it to send receipts.</span>
</div>
```

- `field` — the grid that stacks the label, control, description, and error with one consistent rhythm.
- `field__label` — a `<label>` whose `for` names the control's `id`.
- `field__header` — a row inside the field that lets a helper link (for example, "Forgot password?") sit opposite the label.
- `field__description` — supporting detail. Point the control's `aria-describedby` at its `id`.
- `field__error` — a validation message. Give it `role="alert"` and reference it from `aria-describedby` while it is present.
- `field--required` — marks the label with a trailing asterisk. Pair it with the control's native `required` attribute.

A field with a disabled control dims its label automatically.

The control keeps its own class (`input`, `textarea`, and so on). The field only supplies the surrounding label, help, and error.

## What a field hosts

| Control | Class | Status |
| --- | --- | --- |
| Input | `input` | built |
| Textarea | `textarea` | built |
| Checkbox | `checkbox` (self-labelling; group with a field set) | built |
| Radio | `radio` (self-labelling; group with a field set) | built |
| Select | — | not built |
| Slider | — | not built |
| Switch | — | not built |

Checkboxes, radios, and switches carry their own label, so they do not need a `field__label`; place them directly in a `field-group` and give the group a legend with a field set.

## Field set and field group

A field set is a `<fieldset>` that gives a group of fields or controls one legend and rhythm. A field group is the inner stack.

```html
<fieldset class="field-set">
  <legend class="field-set__legend">Notifications</legend>
  <span class="field-set__description">Choose how we reach you.</span>
  <div class="field-group">
    <label class="checkbox">…</label>
    <label class="checkbox">…</label>
  </div>
</fieldset>
```

Use a field group on its own to stack several labelled fields down a form. Add `field-group--grid` to lay the fields out in two columns; give a field `field--full` to span both columns.

```html
<div class="field-group field-group--grid">
  <div class="field">
    <label class="field__label" for="first">First name</label>
    <input class="input" id="first" type="text">
  </div>
  <div class="field">
    <label class="field__label" for="last">Last name</label>
    <input class="input" id="last" type="text">
  </div>
  <div class="field field--full">
    <label class="field__label" for="email">Email</label>
    <input class="input" id="email" type="email">
  </div>
</div>
```

## Choice card

A choice card turns an option into a large selectable tile with a title and optional description. Wrap a radio for a single choice, or a checkbox for several.

```html
<fieldset class="field-set">
  <legend class="field-set__legend">Plan</legend>
  <div class="field-group">
    <label class="choice-card">
      <input class="choice-card__input" type="radio" name="plan" checked>
      <span class="choice-card__body">
        <span class="choice-card__title">Starter</span>
        <span class="choice-card__description">For individuals getting started.</span>
      </span>
      <span class="choice-card__indicator" aria-hidden="true"></span>
    </label>
  </div>
</fieldset>
```

The whole tile is the label, so clicking anywhere selects it. The card highlights and the indicator fills through the input's `:checked` state. For multiple selection, swap `type="radio"` for `type="checkbox"`.

## When not to use

Do not wrap a checkbox, radio, or switch in a second `field__label` — those controls already carry their own label; group them with a field set instead. Do not use a choice card for a plain list of options that a radio group or combobox presents more compactly.
