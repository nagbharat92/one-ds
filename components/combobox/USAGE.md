# Combobox

Use a combobox to pick one or more values from a searchable list presented in a popover.

## CSS

Copy `tokens.css` and `components/combobox/combobox.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<details class="combobox">
  <summary class="combobox__trigger">
    <span class="combobox__value">Next.js</span>
    <svg class="combobox__chevron" aria-hidden="true"><use href="fluent-icons.svg#chevron-down-16-regular"></use></svg>
  </summary>
  <div class="combobox__panel">
    <div class="combobox__search">
      <svg class="combobox__search-icon" aria-hidden="true"><use href="fluent-icons.svg#search-16-regular"></use></svg>
      <input class="combobox__search-input" type="text" placeholder="Search framework…" aria-label="Search framework">
    </div>
    <div class="combobox__list" role="listbox" aria-label="Framework">
      <button class="combobox__option" type="button" role="option" aria-selected="true">
        <span class="combobox__option-label">Next.js</span>
        <svg class="combobox__option-check" aria-hidden="true"><use href="fluent-icons.svg#checkmark-16-regular"></use></svg>
      </button>
    </div>
  </div>
</details>
```

The shell is a native `<details>`/`<summary>` disclosure, so the popover opens, closes, and traps no focus without any script. The `combobox__value` shows the current selection; add `combobox__value--placeholder` and prompt copy when nothing is chosen. The selected option carries `aria-selected="true"`, which reveals its trailing `combobox__option-check`.

## Behaviour to wire in production

The static markup demonstrates structure and every visual state. A production combobox still needs script for: filtering the list as the query changes, updating `aria-selected` and the trigger value on choice, roving `aria-activedescendant` focus between options, and `role="combobox"` with `aria-expanded` on the trigger. Keep the class names and reflect state through the same attributes.

## Basic

One `combobox__value` and a list of single-select options. Choosing an option closes the popover and updates the trigger.

## Multiple

Add `combobox--multiple` and replace `combobox__value` with a `combobox__tags` row of `combobox__tag` chips, each with a `combobox__tag-remove` button. Every chosen option keeps `aria-selected="true"` and its check; the popover stays open across choices.

```html
<summary class="combobox__trigger">
  <span class="combobox__tags">
    <span class="combobox__tag">React <button class="combobox__tag-remove" type="button" aria-label="Remove React"><svg aria-hidden="true"><use href="fluent-icons.svg#dismiss-16-regular"></use></svg></button></span>
  </span>
  <svg class="combobox__chevron" aria-hidden="true"><use href="fluent-icons.svg#chevron-down-16-regular"></use></svg>
</summary>
```

## Clear button

Add a `combobox__clear` button before the chevron to reset the selection. Show it only when there is a value.

```html
<button class="combobox__clear" type="button" aria-label="Clear selection"><svg aria-hidden="true"><use href="fluent-icons.svg#dismiss-16-regular"></use></svg></button>
```

## Groups

Wrap related options in `combobox__group` blocks, each led by a `combobox__group-label`. A hairline separates adjacent groups.

## Disabled

Add `combobox--disabled` to the root to dim the trigger and block interaction. Disable a single option with the `disabled` attribute on its `combobox__option` button.

## When not to use

Do not use it when a short, fixed set of choices fits a visible radio group or segmented control, or when free text entry — not selection — is the goal.
