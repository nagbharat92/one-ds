# Rules for src/components/ui/shape.tsx

Generated from src/design-system/rules.json. Do not edit directly.

2 scoped rules. Read _always.md as well.

### Alerts use semantic tonal roles

feedback.alert-semantics | Required | approved | enforcement: Partially automated

Alert is an expressive tonal feedback surface with neutral, info, success, warning, and error variants. It composes flat Elevation and the shared --elevation-stroke; semantic roles override fill and ink, never elevation. Neutral uses the Material Surface family, info uses the Secondary pair, and error derives from Material Error. Success and warning are explicit OneDS semantic extensions derived from existing status sources, not additions to the Material role table. Every semantic fill is opaque; status tones mix their source over --alert-container-base rather than transparent because the same fill token is reused as visible glyph ink. AlertIcon composes the shared Shape component as a56px accent behind a24px Material icon rendered on the filled FILL axis; the glyph ink always equals that Alert's own surface fill. Generic warning uses TriangleAlertIcon and generic error uses AlertCircleIcon, while product-specific callouts may deliberately choose another semantic glyph. Each semantic tone has a stable default shape with more than four sides, and callers may deliberately override it. The shape has16px leading inset and12px visual separation from the text block. AlertTitle composes Text lead at medium weight; AlertDescription composes muted Text label. The fixed44px Alert radius derives from its88px resting height, not an unbounded pill radius. Primary expressive56px action Buttons sit at the far right. At28rem they align to the top-right with16px inset; at20rem they stack at bottom-right. Their28px radius plus16px inset equals the44px Alert radius, preserving concentric corners. Default aliases neutral and destructive aliases error for compatibility, but new code uses semantic names. Visual severity does not choose live-region urgency; use live independently according to when and how urgently the message appears.

Exceptions: AlertDialog, toast, Badge, presence, chart, and brand palettes retain their own component contracts. Product-specific callouts may add a semantic mapping only through Alert-owned tokens and an approved API extension. Legacy default and destructive values remain aliases for compatibility, not preferred vocabulary. An Alert may omit AlertIcon, AlertTitle, or AlertAction when the content does not need them. Long or localized content increases height while retaining the fixed44px radius; never replace it with an unbounded pill radius.

Tokens: `--elevation-flat`, `--elevation-stroke`, `--alert-padding-inline`, `--alert-padding-block`, `--alert-content-gap`, `--alert-graphic-gap`, `--alert-graphic-gap-offset`, `--alert-action-gap`, `--alert-accent-size`, `--alert-accent-icon-size`, `--alert-accent-fill`, `--alert-accent-ink`, `--alert-container-base`, `--alert-resting-height`, `--alert-radius`, `--alert-layout-content-columns`, `--alert-layout-icon-columns`, `--alert-layout-action-columns`, `--alert-layout-icon-action-columns`, `--alert-neutral-fill`, `--alert-neutral-ink`, `--alert-info-fill`, `--alert-info-ink`, `--alert-success-source`, `--alert-success-fill`, `--alert-success-ink`, `--alert-warning-source`, `--alert-warning-fill`, `--alert-warning-ink`, `--alert-error-source`, `--alert-error-fill`, `--alert-error-ink`, `--text-lead-size`, `--text-lead-leading`, `--text-label-size`, `--text-label-leading`, `--button-height-expressive`, `--material-icon-fill-selected`, `--material-icon-triangle-optical-offset-y`

Files: src/index.css, src/components/ui/alert.tsx, src/components/ui/shape.tsx, src/components/ui/text.tsx, src/components/ui/button.tsx, src/components/ui/response.tsx, src/components/ui/icon-adapters/material.tsx, src/showcase/demos/feedback.tsx, tests/color-theme.spec.ts

### Choose rounding by surface purpose

geometry.purpose-based-radii | Required | approved | enforcement: Partially automated

Choose corner emphasis by purpose, not size alone: compact controls and dense tiles use8-12px, standard cards16px, large visual or expressive tiles24px, and large feature surfaces32px only when deliberately warranted. Use fixed named radius tokens, not percentage or pill rounding on growing cards. Selectable shape-gallery tiles follow the selected-button paradigm: --shape-choice-radius is16px unselected; --shape-choice-selected-radius is32px when selected. Preview32px rounding on mouse-down, commit selection on click, and restore16px when deselected or a press is cancelled. Selection changes both color and shape. Separate the shape area and bottom label with a transparent4px gap rather than a divider, using the ButtonGroup gap and8px inner-corner tokens. Both regions share selection and interaction fills while remaining one accessible control. Nested rounded surfaces retain outer radius minus inset for concentric inner corners.

Exceptions: Apply selectable-tile behavior to the shape gallery for now; a reusable Card selection contract is deferred. Existing Button, FAB, connected-group, and other Card geometry remain unchanged. The radius hierarchy is not authorization for a global card resize.

Tokens: `--radius-visual-tile`, `--shape-choice-radius`, `--shape-choice-selected-radius`, `--shape-choice-padding`, `--shape-choice-section-gap`, `--shape-choice-inner-radius`

Files: src/index.css, src/components/ui/shape.tsx
