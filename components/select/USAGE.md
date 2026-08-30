# Select

Use a select to choose one value from a compact dropdown list of options presented in a popover.

## CSS

Copy `tokens.css` and `components/select/select.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<details class="select">
  <summary class="select__trigger">
    <span class="select__value">Apple</span>
    <svg class="select__chevron" aria-hidden="true"><use href="fluent-icons.svg#chevron-down-16-regular"></use></svg>
  </summary>
  <div class="select__panel">
    <div class="select__list" role="listbox" aria-label="Fruit">
      <button class="select__option" type="button" role="option" aria-selected="true">
        <span class="select__option-label">Apple</span>
        <svg class="select__option-check" aria-hidden="true"><use href="fluent-icons.svg#checkmark-16-regular"></use></svg>
      </button>
    </div>
  </div>
</details>
```

The shell is a native `<details>`/`<summary>` disclosure, so the popover opens and closes without any script. The `select__value` shows the current selection; add `select__value--placeholder` and prompt copy when nothing is chosen. The selected option carries `aria-selected="true"`, which reveals its trailing `select__option-check`.

## Behaviour to wire in production

The static markup demonstrates structure and every visual state. Copy `components/select/select.js` and load it once with `<script src="…/select.js" defer></script>` to make the demo behave: choosing an option updates `aria-selected`, moves the check, writes the label into the trigger, and closes the popover; an outside click or Escape dismisses an open select, and opening one closes the others so only a single popover shows at a time. Production selects layered on top of this still want roving `aria-activedescendant` focus between options, typeahead, and `role="combobox"`/`aria-expanded` on the trigger; keep the class names and reflect state through the same attributes.

## Basic

One `select__value` and a list of single-select options. Choosing an option closes the popover and updates the trigger.

## Groups

Wrap related options in `select__group` blocks, each led by a `select__group-label`. A hairline separates adjacent groups.

## Scrollable

The panel caps its height at `--oneds-component-select-panel-max-height` and the list scrolls past that. No modifier is needed — a long option list scrolls inside the panel automatically.

## Disabled

Add `select--disabled` to the root to dim the trigger and block interaction. Disable a single option with the `disabled` attribute on its `select__option` button.

## Invalid

Add `select--invalid` to the root to colour the trigger border and its value text with the danger stroke and keep that colour through the focus ring. Set `aria-invalid="true"` on the trigger, then host the select in a `field` so the label reddens and a `field__error` explains what to fix; point the trigger's `aria-describedby` at that message.

## When not to use

Do not use it for a searchable set, which suits a combobox, or for a short, fixed set that reads better as a visible radio group or segmented control.
