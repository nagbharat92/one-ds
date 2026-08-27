# Slider

Use a slider to pick a value, or a pair of values, from a continuous range by dragging a thumb along a track.

## CSS

Copy `tokens.css` and `components/slider/slider.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Variants

- **Basic** — one thumb selecting a single value from `min` to `max` (`.slider`).
- **Label** — a label and current value above the track (`.slider-field`), when the control needs naming or the exact value matters.
- **Range** — two thumbs selecting a lower and upper bound over a shared track (`.slider--range`).

## Markup

Basic:

```html
<div class="slider">
  <input class="slider__input" type="range" min="0" max="100" value="40" aria-label="Volume" />
</div>
```

Range:

```html
<div class="slider slider--range">
  <span class="slider__track" aria-hidden="true"></span>
  <span class="slider__fill" aria-hidden="true"></span>
  <input class="slider__input" type="range" min="0" max="100" value="25" aria-label="Minimum price" />
  <input class="slider__input" type="range" min="0" max="100" value="75" aria-label="Maximum price" />
</div>
```

The control is a native `<input type="range">`, so keyboard operation (arrows, Home/End, Page Up/Down), focus, and the accessibility role come for free. Give every input an `aria-label` or `aria-labelledby`; in the range variant label the two thumbs separately.

## Value

The filled track is driven by local custom properties, because CSS cannot read an input's value:

- **Basic** — `--slider-value` (a unitless number from 0 to 100) on the `.slider` element paints the WebKit fill.
- **Range** — `--slider-min` and `--slider-max` on the `.slider--range` element position the `.slider__fill` band.

Set them at runtime with an inline style or script whenever a thumb moves, and keep `aria-valuenow` in sync. The example `.slider--value-*` and `.slider--range-*` classes exist only for static documentation.

The range variant overlaps two inputs and only makes each thumb interactive. That is enough for a static or lightly-scripted control; a production range slider still needs a small script to update the fill, to keep `aria-valuenow` current, and to stop the two thumbs from crossing.

Use a slider for a value where the approximate position matters more than an exact figure. When an exact number is required, use a number [input](../input/USAGE.md) instead; for an on/off choice use a checkbox or radio. Host a slider in a [field](../field/USAGE.md) to attach a label, description, or error.
