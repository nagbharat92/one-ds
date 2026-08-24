# Input

Use an input to capture one line of user-entered text or data.

## CSS

Copy `tokens.css` and `components/input/input.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<label for="display-name">Display name</label>
<input class="input" id="display-name" type="text" placeholder="Enter a name">
```

Always provide a programmatic label. Choose the native input type that matches the expected data and expose validation errors in associated text.