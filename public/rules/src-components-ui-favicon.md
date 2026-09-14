# Rules for src/components/ui/favicon.tsx

Generated from src/design-system/rules.json. Do not edit directly.

3 scoped rules. Read _always.md as well.

### Buttons have two size tiers

controls.button-scale | Required | approved | enforcement: Automated

Default is 40px and Expressive is 56px, measured including borders. Use size=default or expressive. The icon and icon-expressive counterparts have matching square dimensions. Default uses 20px icons and 16px horizontal padding; Expressive uses 24px icons and 24px horizontal padding. Labelled widths remain content-driven. Large, small, and extra-small sizes are removed, not deprecated aliases.

Exceptions: Specialized compositions such as calendar cells, toolbars, and experimental surfaces may currently override Button geometry. These are migration candidates, not alternate public Button sizes; do not copy their overrides into new standalone buttons.

Tokens: `--button-height-default`, `--button-height-expressive`, `--button-icon-default`, `--button-icon-expressive`, `--button-padding-default`, `--button-padding-expressive`

Files: src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/components/ui/input-group.tsx

### Badges use source-ready inline geometry

geometry.badge-scale | Required | approved | enforcement: Partially automated

Badge uses one expressive inline baseline: 28px fixed height, a 14px/21px label, 16px icon, favicon, or spinner, and the shared 8px graphic-to-label gap. Its 14px outer radius is half the fixed height; inline padding is derived from that radius minus the 4px base spacing so text clears the curved ends. Badge automatically applies IconLabel to ordinary labels, including labels inside asChild links, and adds the shared 4px optical correction opposite a graphic. Use Badge asChild with Favicon for linked source citations so the same component serves labels, statuses, and AI source references. Keep Kbd on its separate compact 20px/12px keyboard-hint geometry.

Exceptions: AvatarBadge and presence dots are status indicators, not text badges. Inline numeric footnote marks remain owned by Response; linked source pills and source lists use Badge. Badge stays single-line; use a List Item or Card when source metadata needs multiple lines. Kbd must not inherit Badge sizing changes.

Tokens: `--badge-height`, `--badge-radius`, `--badge-padding-inline`, `--badge-font-size`, `--badge-line-height`, `--badge-graphic-size`, `--badge-gap`, `--graphic-label-gap`, `--icon-label-optical-padding`

Files: src/components/ui/badge.tsx, src/components/ui/kbd.tsx, src/components/ui/favicon.tsx, src/components/ui/icon-label.tsx, src/index.css, src/showcase/demos/data.tsx, tests/design-rules.spec.ts

### Icon labels include a tokenized optical correction

geometry.icon-label-optical-spacing | Required | approved | enforcement: Partially automated

Icon + label means any of three graphic types: an icon, favicon, or loading spinner with visible text. All three use the same 8px graphic-to-label gap from --graphic-label-gap, including expressive contexts. --button-gap aliases that shared token. Add 4 CSS pixels of padding on the label's outer side opposite the graphic using IconLabel and --icon-label-optical-padding. Icon on the left means label padding on the right; icon on the right means label padding on the left. Optical padding must not increase the 8px gap. Button handles ordinary text, numeric text, simple text spans, and asChild link content. Other compositions reuse the same label part; do not create icon-only exceptions to this terminology.

Exceptions: Text-only and icon-only controls receive no correction. A label flanked by graphics on both sides has no free outer edge, so it receives no asymmetric correction. Logical padding follows normal inline order in right-to-left layouts; do not visually reorder the graphic and label with CSS. Preserve base padding, icon size, height, and gap. Rich custom labels expose IconLabel explicitly; custom graphic wrappers expose data-icon or data-slot=spinner. Other existing component families are not automatically restyled by this Button migration.

Tokens: `--icon-label-optical-padding`, `--graphic-label-gap`, `--button-gap`

Files: src/components/ui/icon-label.tsx, src/components/ui/button.tsx, src/components/ui/favicon.tsx, src/index.css, src/showcase/demos/forms.tsx
