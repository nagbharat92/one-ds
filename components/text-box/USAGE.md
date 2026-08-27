# Text box

Use a text box to present read-only prose in a bounded surface.

## CSS

Copy `tokens.css` and `components/text-box/text-box.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

Read-only prose:

```html
<div class="text-box">
  <p class="text-box__content">Read-only prose that benefits from a distinct surface.</p>
</div>
```

Use a textarea when the reader needs to type multi-line text, an input for a single-line value, a code block for preformatted code, commands, or prompts, or the AI composer for an assistant prompt.