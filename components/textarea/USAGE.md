# Textarea

Use a textarea to let the reader type multi-line text — notes, a message, a description. It is the multi-line sibling of the single-line input.

## CSS

Copy `tokens.css` and `components/textarea/textarea.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<textarea class="textarea" rows="3" placeholder="Type your notes here" aria-label="Notes"></textarea>
```

Always give the control an accessible name — an associated `<label>` (see the field component) or an `aria-label`.

## Variants

- `textarea--fixed` — holds the resting height: no resize grabber and no growth as the reader types.

## Parameters

Set these on the `<textarea>` to turn behaviours on or off:

- `rows` — the resting number of visible lines.
- `placeholder` — hint text shown while the field is empty.
- `disabled` — makes the field non-editable.
- `maxlength` — caps the number of characters.
- `aria-invalid="true"` — marks the value as failing validation; the border turns to the danger colour and keeps it through the focus ring.

## Behaviour

Where the browser supports `field-sizing: content`, the field grows with its content up to its max height and then scrolls — no manual resize needed. Where it is not supported, the field starts at its resting height and shows a resize grabber the reader can drag taller. `textarea--fixed` turns both behaviours off.

## Composition

Wrap the control in the field component to attach a label, help text, and error message. The control keeps its `textarea` class; the field supplies the surrounding structure.

Use an input for a single-line value, a text box for read-only prose in a bounded surface, a code block for preformatted code or commands, or the AI composer for an assistant prompt.
