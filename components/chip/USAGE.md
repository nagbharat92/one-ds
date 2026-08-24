# Chip

Use a chip for a compact label, selection, filter, or removable value.

## CSS

Copy `tokens.css` and `components/chip/chip.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<span class="chip">Filter label</span>
```

Use a semantic `button` instead of `span` when the chip is interactive.

## Variants

- Static: use `chip`.
- Interactive: use `chip chip--interactive` on a button.
- Selected: add `chip--selected` and expose the selection state with the appropriate ARIA attribute.