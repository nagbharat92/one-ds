# Avatar

Use an avatar to represent a person or entity with a small, bounded image. It shows a photo when one is available and falls back to initials when it is not.

## CSS

Copy `tokens.css` and `components/avatar/avatar.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<!-- Image with an initials fallback behind it -->
<div class="avatar"><img class="avatar__image" src="/people/jordan.jpg" alt="Jordan Ito"><span class="avatar__fallback" aria-hidden="true">JI</span></div>

<!-- Initials only -->
<div class="avatar"><span class="avatar__fallback">BN</span></div>
```

The `avatar__fallback` sits behind `avatar__image`, so if the photo never loads the initials remain visible. When no `avatar__image` is present the fallback is the only content; drop `aria-hidden` from it in that case so the initials are announced.

## Anatomy

- `avatar` — the circular, overflow-clipped surface. Fixed square size; the pill radius makes it a circle.
- `avatar__image` — the photo. It covers the surface with `object-fit: cover` and never distorts.
- `avatar__fallback` — the initials shown when there is no photo, or behind a photo that fails to load.

## Variants

- **Brand** (`avatar--brand`): tints the initials fallback with the brand family instead of neutral.

## Dropdown trigger

shadcn's avatar is static — it has no interactive states. `avatar--button` turns the avatar into a real `<button>` that carries hover, pressed, and focus feedback, so it can act as the trigger for an account menu or other dropdown.

```html
<button class="avatar avatar--button" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu">
  <span class="avatar__fallback">BN</span>
</button>
```

- **Hover** darkens the avatar with the neutral transparent hover layer, clipped to the circle.
- **Pressed** deepens that layer and scales the avatar down slightly for a tactile press.
- **Focus** draws the standard focus ring around the circle.
- Set `aria-haspopup="menu"` and toggle `aria-expanded` from host code that opens and closes the menu. Pair it with the [menu](../menu/USAGE.md) component for the popover itself.
- Add `disabled` to dim the trigger and block interaction.
