# Stack

Use a stack to lay out children in a single column with one deliberate rhythm between them.

## CSS

Copy `tokens.css` and `components/stack/stack.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Choosing the rhythm

The modifier names the relationship between the children, not a distance.

| Class | Use it when the children are | Gap |
| --- | --- | --- |
| `stack--tight` | parts fused into one object | 4px |
| `stack--group` | a thing and its own annotation | 8px |
| `stack--items` | repeated equals in one set | 12px |
| `stack` | distinct siblings in one region | 16px |
| `stack--section` | a header and the content it introduces | 24px |
| `stack--block` | page-level blocks | 40px |
| `stack--page` | whole chapters of a long page | 64px |

A stack's gap must stay smaller than the inset of the surface containing it, so nesting reads as nesting. A `.card` at `--oneds-inset-default` holds a `stack--items` comfortably; it does not hold a `stack--section`.

## Markup

```html
<div class="stack stack--section">
  <p>Each child is separated by the stack's rhythm.</p>
  <p>No child sets its own outer margin.</p>
</div>
```

The stack owns every gap. Do not add margin to a child to adjust spacing; either change the stack's rhythm or nest another stack.
