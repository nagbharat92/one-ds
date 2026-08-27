# Cluster

Use a cluster to lay out children in a wrapping row with one deliberate rhythm between them.

## CSS

Copy `tokens.css` and `components/cluster/cluster.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Choosing the rhythm

The modifier names the relationship between the children, not a distance.

| Class | Use it when the children are | Gap |
| --- | --- | --- |
| `cluster--tight` | parts fused into one object, such as an icon and its label | 4px |
| `cluster--group` | one control and its companion, such as a confirm and cancel pair | 8px |
| `cluster` | repeated equals in one set, such as filter chips | 12px |
| `cluster--component` | distinct siblings that each stand alone | 16px |
| `cluster--section` | separate regions sharing one row | 24px |

Alignment modifiers `cluster--between`, `cluster--end`, and `cluster--baseline` change distribution only; they never change the gap.

## Markup

```html
<div class="cluster cluster--group">
  <button class="button" type="button">Save</button>
  <button class="button button--outline" type="button">Cancel</button>
</div>
```

The cluster owns every gap. Do not add margin to a child to adjust spacing; change the cluster's rhythm instead.
