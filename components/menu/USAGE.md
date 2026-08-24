# Menu

Use a menu to present a contextual list of commands or choices from a trigger.

## CSS

Copy `tokens.css` and `components/menu/menu.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="menu" role="menu" aria-label="Conversation options">
  <button class="menu__item" type="button" role="menuitem" aria-current="true">
    <span class="menu__label">Current conversation</span>
  </button>
  <button class="menu__item menu__item--danger" type="button" role="menuitem">
    <span class="menu__label">Remove conversation</span>
  </button>
</div>
```

Host JavaScript must connect the menu to a trigger, manage `aria-expanded`, move focus into the menu, support Arrow Up, Arrow Down, Home, End, Escape, and Tab, dismiss on outside interaction, and restore focus when appropriate.