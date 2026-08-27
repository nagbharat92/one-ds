# Tooltip

Use a tooltip to reveal a short, plain-text label for a control when the pointer rests on it or the trigger receives keyboard focus.

## CSS

Copy `tokens.css` and `components/tooltip/tooltip.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="tooltip">
  <button class="tooltip__trigger" type="button" aria-describedby="save-tip">Save</button>
  <span class="tooltip__content tooltip__content--top text-trim" id="save-tip" role="tooltip">
    <span class="tooltip__arrow" aria-hidden="true"></span>
    Save your changes
  </span>
</div>
```

The shell is pure CSS: the label shows while the pointer is over the `tooltip` and while the trigger holds keyboard focus, so it opens with no script. The content never takes pointer events, so it cannot be hovered and adds no flicker. Keep the content to one short phrase; a tooltip is a label, not a container for rich content or controls.

## Placement

Set the side the label opens on with one placement modifier on `tooltip__content`. Every side centres the label on the trigger and points the arrow back at it.

- `tooltip__content--top` — above the trigger (default).
- `tooltip__content--bottom` — below the trigger.
- `tooltip__content--right` — to the right of the trigger.
- `tooltip__content--left` — to the left of the trigger.

## Parts

- `tooltip__trigger` — the element the label describes; give it `aria-describedby` pointing at the content `id`.
- `tooltip__content` — the dark label surface, `role="tooltip"`, one short phrase.
- `tooltip__arrow` — the pointer back to the trigger; keep it as the first child and `aria-hidden`.

## Behaviour to wire in production

The pure-CSS shell covers hover, focus, placement, and the entrance transition. A tooltip is supplementary by design, so its label must never be the only place important information lives, and it must not hold interactive content. For richer behaviour — a short open delay, dismissal on `Escape`, or coordinated groups — add script and keep the `aria-describedby` relationship in place.

## When not to use

Do not use it for essential information a person must not miss, for content that needs a response before continuing, or on touch devices where there is no hover — use a visible label, a dialog, or an inline description instead. Reach for a hover card when the floating content is rich rather than a single phrase.
