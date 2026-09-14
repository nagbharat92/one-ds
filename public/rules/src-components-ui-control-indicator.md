# Rules for src/components/ui/control-indicator.ts

Generated from src/design-system/rules.json. Do not edit directly.

1 scoped rule. Read _always.md as well.

### Choice indicators move from outline to fill

controls.choice-indicator-colors | Required | approved | enforcement: Partially automated

Checkbox and RadioGroupItem use the Tertiary pair as a tokenized 3px inset outline over a transparent interior while unchecked, matching the stroke width of Input and Textarea focus rings. Hover may strengthen that Tertiary outline but must not fill an unchecked indicator. Checked indicators retain the existing selected-Secondary border, fill, ink, and hover treatment. Selection changes fade fill, ink, border, and inset outline with the Material icon fill speed and curve; Checkbox and Radio also keep their primitive marks mounted and fade mark opacity on the same timing. Reduced motion applies the final state immediately. Preserve focus rings, invalid rings, disabled opacity, geometry, and native or primitive state semantics.

Exceptions: Native task-list checkboxes inside rendered response content are browser controls and do not use the shared indicator. Switch has its own track-and-thumb selection model. Invalid indicators may suppress the purple outline so the destructive ring remains the sole boundary cue.

Tokens: `--tertiary-fill`, `--tertiary-ink`, `--control-outline-width`, `--control-outline`, `--control-hover-outline`, `--control-outline-shadow`, `--control-hover-outline-shadow`, `--control-outline-clear-shadow`, `--button-selected-secondary-fill`, `--button-selected-secondary-ink`, `--control-checked-hover-fill`, `--material-icon-fill-speed`, `--material-icon-fill-curve`

Files: src/index.css, src/components/ui/control-indicator.ts, src/components/ui/checkbox.tsx, src/components/ui/radio-group.tsx
