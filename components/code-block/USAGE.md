# Code block

Use a code block to present preformatted code, commands, or prompts that users may need to inspect or copy.

## CSS

Copy `tokens.css` and `components/code-block/code-block.css` verbatim into the output HTML's inline `<style>` block. When the code block includes an action, also copy `components/button/button.css`. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<pre class="code-block" tabindex="0"><code>npm run build</code></pre>
```

Add `code-block--wrap` for long commands or prompts that should wrap. Add `code-block--surface` for the theme-aware surface treatment.

Prompt blocks include `code-block__header`, an appropriately leveled heading with `code-block__title`, and an optional `code-block__action`. Keep the copy action in the header, give it an accessible name, and use `code-block__content` for the preformatted body. The content always uses the system monospace family.