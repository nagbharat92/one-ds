# Accordion

Use an accordion to stack titled sections that each reveal a passage of content in place. It is a group of disclosures that share one vertical rhythm.

## CSS

Copy `tokens.css` and `components/accordion/accordion.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="accordion">
  <details class="accordion__item" open>
    <summary class="accordion__trigger"><span class="accordion__title">What are your shipping options?</span><svg class="accordion__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z" fill="currentColor"></path></svg></summary>
    <div class="accordion__content">We offer standard, express, and overnight shipping.</div>
  </details>
  <details class="accordion__item">
    <summary class="accordion__trigger"><span class="accordion__title">What is your return policy?</span><svg class="accordion__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z" fill="currentColor"></path></svg></summary>
    <div class="accordion__content">Return any unused item within 30 days for a full refund.</div>
  </details>
</div>
```

Each section is a native `<details>` with its title in the `<summary>`. The browser supplies the expand and collapse behavior, the `Enter` and `Space` keys, focus, and the open state — no script is required. Add `open` to the item that should start expanded.

## Anatomy

- `accordion` — the group wrapper that draws the shared top and bottom rules.
- `accordion__item` — one `<details>` section. Reads as expanded while it carries the `open` attribute.
- `accordion__trigger` — the `<summary>` header row: title on the left, indicator chevron on the right.
- `accordion__title` — the section label. It gains an underline on hover.
- `accordion__icon` — the chevron; it rotates a quarter turn to point down while the item is open.
- `accordion__content` — the revealed passage.

## Parameters

- **Multiple open** (default): each item toggles independently, so any number can be open at once.
- **Single open**: add the same `name` to every `<details>` (for example `name="faq"`). The browser then keeps only one item open at a time. Where `details[name]` is unsupported the group falls back to multiple-open, so it degrades safely.
- **Disabled**: add `accordion__item--disabled` to a section to dim it and block toggling. Host code that must keep a truly inert section closed should also prevent the `toggle` on that item.

## States

`accordion__trigger` covers rest, hover (title underlined), focus-visible (two-part ring), and open (chevron rotated). Collapse and reveal are instant by design; the chevron rotation is the only animation, and it is suppressed under reduced-motion.

## When not to use

Do not use it to conceal information required to complete the current task, and do not stack a single section where a plain disclosure is enough.
