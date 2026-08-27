# Popover

Use a popover to reveal rich content or a small set of controls in a floating panel anchored to a trigger the person clicks.

## CSS

Copy `tokens.css` and `components/popover/popover.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<details class="popover">
  <summary class="popover__trigger">
    Open settings
    <svg class="popover__caret" aria-hidden="true"><use href="fluent-icons.svg#chevron-down-16-regular"></use></svg>
  </summary>
  <div class="popover__panel">
    <div class="popover__header">
      <p class="popover__title">Dimensions</p>
      <p class="popover__description">Set the size for the selected layer.</p>
    </div>
    <label for="popover-width">Width</label>
    <input class="input" id="popover-width" type="text" value="100%">
  </div>
</details>
```

The shell is a native `<details>` disclosure: the panel opens when the `popover__trigger` summary is clicked and closes when it is clicked again, with no script. The panel stacks its children with a single group rhythm, so drop whatever content or controls belong there. The caret rotates while the popover is open.

## Placement

The panel opens below the trigger, aligned to its leading edge, by default. Add one modifier to `popover__panel` to change where it opens.

- `popover__panel--end` — align the panel's trailing edge to the trigger.
- `popover__panel--top` — open the panel above the trigger.
- `popover__panel--static` — render the panel in flow rather than as an overlay, for inline documentation.

## Content parts

- `popover__header` — an optional title-and-description block stacked with group rhythm.
- `popover__title` — the panel heading, body-large semibold.
- `popover__description` — the supporting sentence, body-medium secondary.
- `popover__caret` — the chevron in the trigger; keep it as the last child and `aria-hidden`.

## Behaviour to wire in production

The pure-CSS shell covers click-to-open, the caret, and the entrance transition. A production popover also needs script to close on an outside click or the Escape key, to return focus to the trigger on close, and to expose the relationship with `aria-expanded`/`aria-controls` on the trigger. Manage focus into the panel when it holds interactive controls.

## When not to use

Do not use it for a blocking decision that must be answered before continuing — use a dialog. Do not use it for a list of commands — use a menu. Do not use it for supplementary detail that should appear on hover — use a hover card.
