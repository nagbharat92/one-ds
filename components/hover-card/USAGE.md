# Hover card

Use a hover card to reveal supplementary detail about a link or element when the pointer rests on it or the trigger receives focus.

## CSS

Copy `tokens.css` and `components/hover-card/hover-card.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="hover-card">
  <a class="hover-card__trigger" href="#" role="button" aria-describedby="oneds-card">@oneds</a>
  <div class="hover-card__content hover-card__content--bottom" id="oneds-card" role="tooltip">
    <span class="hover-card__arrow" aria-hidden="true"></span>
    <p class="hover-card__title">OneDS</p>
    <p class="hover-card__text">A token-first design system.</p>
    <p class="hover-card__meta">Joined August 2026</p>
  </div>
</div>
```

The shell is pure CSS: the content shows while the pointer is over the `hover-card` (trigger, bridge, or content) and while any child holds keyboard focus, so it opens with no script. An invisible bridge spans the gap between the trigger and the content so moving the pointer into the card never closes it. The content stacks its children with a single group rhythm; put whatever detail belongs there.

## Placement

Set the side the card opens on with one placement modifier on `hover-card__content`. Every side centres the card on the trigger and points the arrow back at it.

- `hover-card__content--bottom` — below the trigger (default).
- `hover-card__content--top` — above the trigger.
- `hover-card__content--right` — to the right of the trigger.
- `hover-card__content--left` — to the left of the trigger.

## Content parts

- `hover-card__title` — the primary label, body-large semibold.
- `hover-card__text` — the supporting sentence, body-medium secondary.
- `hover-card__meta` — a compact metadata row, body-small secondary.
- `hover-card__arrow` — the pointer back to the trigger; keep it as the first child and `aria-hidden`.

## Behaviour to wire in production

The pure-CSS shell covers hover, focus, placement, and the entrance transition. A hover card is supplementary by design, so its content must never be the only place important information lives. If the card holds interactive controls, add script to keep it open on a short close delay and to manage focus, and expose the relationship with `aria-describedby` on the trigger.

## When not to use

Do not use it for essential information a person must not miss, for content that needs a response before continuing, or on touch devices where there is no hover — use inline text, a dialog, or a tap-triggered popover instead.
