# Skeleton

Use skeleton to hold the shape of content that is still loading, so the layout stays stable and the wait feels shorter.

## CSS

Copy `tokens.css` and `components/skeleton/skeleton.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Variants

- **Block** (`.skeleton--block`) — a wide 16:9 placeholder for an image, thumbnail, or media area.
- **Heading** (`.skeleton--heading`) — a taller line for a title.
- **Text** (`.skeleton--text`) — a body-line placeholder with rounded ends. Add `.skeleton--short` for the last line of a paragraph.
- **Circle** (`.skeleton--circle`) — a round placeholder for an avatar or icon.

Wrap a set of placeholders in `.skeleton-group` to stack them with the standard gap.

## Markup

```html
<div class="skeleton-group" role="status" aria-busy="true" aria-label="Loading">
  <div class="skeleton skeleton--block"></div>
  <div class="skeleton skeleton--heading"></div>
  <div class="skeleton skeleton--text"></div>
  <div class="skeleton skeleton--text skeleton--short"></div>
</div>
```

## Behaviour

The skeleton pulses on its own with CSS; no script is required. Announce the loading state on a container with `role="status"` and `aria-busy="true"` rather than on each placeholder, and replace the whole group with the real content once it arrives. Under `prefers-reduced-motion` the pulse is removed.

Use a skeleton only while content is loading and its shape is known. When no content exists at all, use the empty state; when an operation has measurable progress, use progress; for a brief indeterminate wait with no layout to preserve, use the spinner.
