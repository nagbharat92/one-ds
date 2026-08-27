# Menu

Use a menu to present a contextual list of commands or choices from a trigger. One menu composes every capability — labels, icons, shortcuts, submenus, checkbox and radio items, and a destructive action — so there is a single component to learn rather than a variant per feature.

## CSS

Copy `tokens.css` and `components/menu/menu.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Parts

- `.menu` — the surface (`role="menu"`). A submenu panel is another `.menu`.
- `.menu__item` — a command (`role="menuitem"`), or a toggle (`role="menuitemcheckbox"` / `role="menuitemradio"` with `aria-checked`).
- `.menu__heading` — a non-interactive section label.
- `.menu__separator` — a full-bleed rule (`<hr>`) between sections.
- `.menu__group` — wraps a related set; give a radio set `role="group"` and label it with the heading via `aria-labelledby`.
- `.menu__icon` — a leading 16px glyph. `.menu__item--danger .menu__icon` inherits the danger color.
- `.menu__shortcut` — a trailing keyboard hint; the label's flex pushes it to the end.
- `.menu__indicator` — a fixed 16px slot on checkbox/radio items. It holds a `.menu__check` (checkmark) or a `.menu__dot` (radio), shown when the item's `aria-checked="true"`.
- `.menu__submenu` / `.menu__submenu-panel` — a trigger row that reveals a nested menu on hover or focus.
- `.menu__item--danger` — a destructive command.

Because the leading icon and the indicator are both 16px, labels stay aligned whether an item leads with an icon or a checkmark.

## Markup

```html
<div class="menu" role="menu" aria-label="Account">
  <p class="menu__heading">My account</p>
  <button class="menu__item" type="button" role="menuitem">
    <svg class="menu__icon" aria-hidden="true"><use href="fluent-icons.svg#person-16-regular"></use></svg>
    <span class="menu__label text-trim">Profile</span>
    <span class="menu__shortcut">⇧⌘P</span>
  </button>
  <hr class="menu__separator">
  <button class="menu__item" type="button" role="menuitemcheckbox" aria-checked="true">
    <span class="menu__indicator" aria-hidden="true"><svg class="menu__check" viewBox="0 0 16 16"><use href="fluent-icons.svg#checkmark-16-regular"></use></svg></span>
    <span class="menu__label text-trim">Word wrap</span>
  </button>
  <p class="menu__heading" id="line-numbers">Line numbers</p>
  <div class="menu__group" role="group" aria-labelledby="line-numbers">
    <button class="menu__item" type="button" role="menuitemradio" aria-checked="true">
      <span class="menu__indicator" aria-hidden="true"><span class="menu__dot"></span></span>
      <span class="menu__label text-trim">On</span>
    </button>
  </div>
  <hr class="menu__separator">
  <button class="menu__item menu__item--danger" type="button" role="menuitem">
    <svg class="menu__icon" aria-hidden="true"><use href="fluent-icons.svg#arrow-exit-16-regular"></use></svg>
    <span class="menu__label text-trim">Log out</span>
  </button>
</div>
```

A submenu nests one menu inside another:

```html
<div class="menu__submenu">
  <button class="menu__item" type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">
    <span class="menu__label text-trim">Invite people</span>
    <svg class="menu__caret" aria-hidden="true"><use href="fluent-icons.svg#chevron-right-16-regular"></use></svg>
  </button>
  <div class="menu menu__submenu-panel" role="menu" aria-label="Invite people">
    <button class="menu__item" type="button" role="menuitem"><span class="menu__label text-trim">Email invite</span></button>
  </div>
</div>
```

Checkbox and radio items may also carry a `.menu__icon` after the indicator.

## Behavior

The pointer path for the submenu flyout is CSS-only (`:hover` / `:focus-within`). Everything else needs host JavaScript: connect the menu to a trigger, manage `aria-expanded`, move focus into the menu, toggle `aria-checked`, support Arrow Up, Arrow Down, Arrow Right/Left for submenus, Home, End, Escape, and Tab, dismiss on outside interaction, and restore focus when appropriate.

## When not to use

Do not use it for persistent navigation or complex form content.
