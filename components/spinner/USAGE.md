# Spinner

Use the spinner as an inline busy indicator inside a control while a short action is in flight.

## Sizes

The spinner ships across the icon size ramp. The default `.spinner` is 16px — the size that sits inside a control. Add a modifier for a different size:

- `.spinner--xs` — 12px
- `.spinner` — 16px (default)
- `.spinner--md` — 20px
- `.spinner--lg` — 24px
- `.spinner--xl` — 28px
- `.spinner--2xl` — 32px

## Colour

The ring is drawn in `currentColor`, so it inherits the colour of whatever it sits in — white on a primary button, brand on a link. Set the surrounding text colour to recolour it; there is no colour variant.

## In a button

Drop a bare `.spinner` into a `button--icon` to show a busy state with no label; it inherits the button's text colour, so it reads correctly on primary, secondary, outline, and destructive buttons. Add `aria-busy="true"` and an `aria-label`, and set `disabled` while the action is in flight.

```html
<button class="button button--icon" type="button" aria-busy="true" aria-label="Saving" disabled>
  <span class="spinner" aria-hidden="true"></span>
</button>
```

With a label, place the spinner before the text; the button steps its trailing padding up a rung to re-centre the pair, the same as a leading icon.

## Motion

The spinner rides a subtle full-circle rail (`--oneds-component-spinner-track-opacity`) so it always reads as spinning in a track. The bright arc is bounded by two points that ride the *same* eased orbit — slow over the top, fast through the bottom — with the tail delayed behind the head. Because both edges follow one path on one clock, the arc stretches on the fast descent and contracts on the slow climb entirely on its own, with no separate length animation to drift out of sync. `prefers-reduced-motion` stops the animation.

## CSS

Copy `tokens.css` and `components/spinner/spinner.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<span class="spinner" role="status" aria-label="Loading"></span>
```

Give the spinner a nearby visible label or an `aria-label` so its purpose is announced. Inside a busy button, place it before the label, add `aria-busy="true"` to the button, and remove it when the action completes.
