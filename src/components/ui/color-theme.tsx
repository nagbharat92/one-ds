import * as React from "react"
import { Slot } from "radix-ui"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { createColorTheme, materialColorRoles, nearestMaterialToneStop, readColorThemeRecipe, readMaterialWebsiteTheme, toneOfHex, tonalScaleFromHueChroma, tonalScaleFromSeed, type ColorThemeRecipe, type ColorThemeSeeds } from "@/lib/color-theme"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { CheckIcon, CopyIcon } from "@/components/ui/icons"
import { Chip, ChipIcon, ChipLabel } from "@/components/ui/chip"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Stack } from "@/components/ui/stack"
import { MaterialSurface, type MaterialSurfaceRole } from "@/components/ui/material-surface"
import { Text } from "@/components/ui/text"

type ColorThemeScale = "current" | "website"
type DarkCardSurface = "lowest" | "low"
const ColorThemeContext = React.createContext<{
  variables?: React.CSSProperties
  appliedVariables?: React.CSSProperties
  accentButtons?: boolean
  scale?: ColorThemeScale
  darkCardSurface?: DarkCardSurface
}>({})

type ThemeTokens = {
  websiteThemes: Record<"light" | "dark", Record<`--md-sys-color-${string}`, string>>
  recipe: ColorThemeRecipe
}
const tokenSnapshots = new WeakMap<Document, ThemeTokens>()
const subscribeToTokens = () => () => {}

function readThemeTokens(): ThemeTokens {
  const source = document
  let snapshot = tokenSnapshots.get(source)
  if (!snapshot) {
    const tokens = getComputedStyle(source.documentElement)
    const readToken = (name: string) => tokens.getPropertyValue(name)
    snapshot = {
      websiteThemes: {
        light: readMaterialWebsiteTheme(readToken, "light"),
        dark: readMaterialWebsiteTheme(readToken, "dark"),
      },
      recipe: readColorThemeRecipe(readToken),
    }
    tokenSnapshots.set(source, snapshot)
  }
  return snapshot
}

function websiteAccentVariables(variables: React.CSSProperties | undefined, mode: "light" | "dark") {
  return Object.fromEntries(Object.keys(variables ?? {})
    .filter(name => /^--md-sys-color-(on-)?(primary|secondary|tertiary)(-|$)/.test(name))
    .map(name => [name, `var(--theme-website-${name.replace("--md-sys-color-", "")}-${mode})`]))
}

// Same accent-role subset as websiteAccentVariables, but forwards the literal generated hex
// instead of a --theme-website-*-<mode> reference, since a caller-supplied role map (e.g. a
// previewed hue family) has no backing website token to point at. Surface and outline roles are
// forwarded too, so a previewed theme recolors its neutrals rather than keeping the site's.
function literalRoleVariables(variables: React.CSSProperties | undefined) {
  return Object.fromEntries(Object.entries((variables ?? {}) as Record<string, string>)
    .filter(([name]) => name.startsWith("--md-sys-color-")))
}

function ColorTheme({ theme, scale, darkCardSurface, accentButtons, overrideRoles, asChild = false, className, style, children, ...props }:
  React.ComponentProps<"div"> & { theme?: ColorThemeSeeds; scale?: ColorThemeScale; darkCardSurface?: DarkCardSurface; accentButtons?: boolean; overrideRoles?: Record<string, string>; asChild?: boolean }) {
  const { resolvedTheme } = useTheme()
  const inherited = React.useContext(ColorThemeContext)
  const useAccentButtons = accentButtons ?? inherited.accentButtons ?? true
  const activeScale = scale ?? inherited.scale ?? "current"
  const activeDarkCardSurface = darkCardSurface ?? inherited.darkCardSurface ?? "lowest"
  const tokens = React.useSyncExternalStore(subscribeToTokens, readThemeTokens, () => null)
  const variables = activeScale === "website"
    ? (overrideRoles ?? tokens?.websiteThemes[resolvedTheme === "dark" ? "dark" : "light"]) as React.CSSProperties | undefined
    : theme && tokens
    ? createColorTheme(theme, tokens.recipe)[resolvedTheme === "dark" ? "dark" : "light"] as React.CSSProperties
    : inherited.variables
  const Comp = asChild ? Slot.Root : "div"
  const appliedVariables = activeScale === "website"
    ? (overrideRoles ? literalRoleVariables(variables) : websiteAccentVariables(variables, resolvedTheme === "dark" ? "dark" : "light"))
    : variables
  return (
    <ColorThemeContext.Provider value={{ variables, appliedVariables, accentButtons: useAccentButtons, scale: activeScale, darkCardSurface: activeDarkCardSurface }}>
      <Comp
        {...(!asChild ? { "data-slot": "color-theme" } : {})}
        data-color-theme={variables && activeScale === "current" ? "custom" : undefined}
        data-color-scale={activeScale}
        data-dark-card-surface={activeDarkCardSurface}
        data-accent-buttons={useAccentButtons}
        className={cn("color-theme", className)}
        style={{ ...appliedVariables, ...style }}
        {...props}
      >
        {children}
      </Comp>
    </ColorThemeContext.Provider>
  )
}

function ColorThemePortal({ asChild = true, className, style, ...props }:
  React.ComponentProps<"div"> & { asChild?: boolean }) {
  const { appliedVariables, accentButtons, scale, darkCardSurface } = React.useContext(ColorThemeContext)
  const Comp = asChild ? Slot.Root : "div"
  return <Comp
    data-color-theme={appliedVariables && scale === "current" ? "custom" : undefined}
    data-color-scale={scale}
    data-dark-card-surface={darkCardSurface}
    data-accent-buttons={accentButtons}
    className={cn("color-theme", className)}
    style={{ ...appliedVariables, ...style }}
    {...props}
  />
}

function ColorThemeSurface({ level = "canvas", asChild = false, className, ...props }:
  React.ComponentProps<"div"> & { level?: "canvas" | "lowest" | "low" | "container" | "high" | "highest" | "default" | "navigation"; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return <Comp data-slot="color-theme-surface" data-level={level} className={cn("color-theme-surface", className)} {...props} />
}

function materialRoleLabel(role: string) {
  const label = role.replaceAll("-", " ")
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function MaterialColorPair({ fill, foreground }: { fill: string; foreground: string }) {
  return (
    <span className="material-color-pair" data-role={fill} style={{
      "--material-pair-fill": `var(--md-sys-color-${fill})`,
      "--material-pair-ink": `var(--md-sys-color-${foreground})`,
    } as React.CSSProperties}>{materialRoleLabel(foreground)}</span>
  )
}

// Resolves ANY computed CSS color (hex, oklch(), color-mix(), etc.) to a #rrggbb hex by
// actually rendering it: modern browsers can echo oklch()/color-mix() back unconverted from
// both getComputedStyle and canvas fillStyle, but rendered pixel data is always plain sRGB bytes.
function resolveCssColorToHex(token: string): string {
  const probe = document.createElement("span")
  probe.style.display = "none"
  probe.style.color = `var(${token})`
  document.body.appendChild(probe)
  const specified = getComputedStyle(probe).color
  document.body.removeChild(probe)
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D context unavailable for color resolution")
  ctx.fillStyle = specified
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  const toHex = (component: number) => component.toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// The status colors (Alert, Presence) are semantic constants: they read from the real tokens and
// never move, regardless of which theme family is previewed below.
const statusScaleSources: { label: string; token: string; used: string[] }[] = [
  { label: "Green", token: "--presence-available-light", used: [
    "--presence-available-light", "--presence-available-dark",
  ] },
  { label: "Amber", token: "--presence-away-light", used: [
    "--presence-away-light", "--presence-away-dark",
  ] },
  { label: "Red", token: "--md-ref-palette-error40", used: [
    "--md-ref-palette-error40", "--md-ref-palette-error80",
  ] },
  { label: "Crimson", token: "--destructive-light", used: [
    "--destructive-light", "--destructive-dark",
  ] },
]

// Theme families are hypothetical brand hues, generated with the exact same logic as the real
// Purple family: one seed hue, a secondary +20° away, a tertiary -15° away, each stepped down in
// chroma, plus a neutral at the same hue crushed to near-zero chroma. Family 0 (Purple) reproduces
// the site's real tokens almost exactly; the rest are untested alternates for exploring theming.
type ThemeFamily = { label: string; seedHue: number; rowLabels: { primary: string; secondary: string; tertiary: string; neutral: string } }
const themeFamilies: ThemeFamily[] = [
  { label: "Purple", seedHue: 299, rowLabels: { primary: "Purple", secondary: "Pink", tertiary: "Violet", neutral: "Plum grey" } },
  { label: "Blue", seedHue: 239, rowLabels: { primary: "Blue", secondary: "Indigo", tertiary: "Azure", neutral: "Slate grey" } },
  { label: "Teal", seedHue: 179, rowLabels: { primary: "Teal", secondary: "Cyan", tertiary: "Seafoam", neutral: "Mist grey" } },
  { label: "Emerald", seedHue: 119, rowLabels: { primary: "Emerald", secondary: "Jade", tertiary: "Moss", neutral: "Sage grey" } },
  { label: "Gold", seedHue: 59, rowLabels: { primary: "Gold", secondary: "Lime", tertiary: "Copper", neutral: "Sand grey" } },
  { label: "Rose", seedHue: 359, rowLabels: { primary: "Rose", secondary: "Coral", tertiary: "Mauve", neutral: "Ash grey" } },
]

// A family's tone-40 primary swatch, used both as its toolbar preview dot and as the HCT seed
// handed to createMaterialColorTheme to generate a full previewable Material role map.
function familySeedHex(family: ThemeFamily): string {
  return tonalScaleFromHueChroma(family.seedHue, 48).find(step => step.tone === 40)!.hex
}

function familyRows(family: ThemeFamily) {
  const wrapHue = (hue: number) => ((hue % 360) + 360) % 360
  return [
    { label: family.rowLabels.primary, hue: wrapHue(family.seedHue), chroma: 48, usedTones: [40, 80] },
    { label: family.rowLabels.secondary, hue: wrapHue(family.seedHue + 20), chroma: 24, usedTones: [30, 90] },
    { label: family.rowLabels.tertiary, hue: wrapHue(family.seedHue - 15), chroma: 17, usedTones: [40, 70] },
    { label: family.rowLabels.neutral, hue: wrapHue(family.seedHue), chroma: 9, usedTones: [20, 30, 80, 90] },
  ] as const
}

type TonalScaleRow = { label: string; steps: { tone: number; hex: string }[]; usedTones: Set<number> }

// Reuses the real Button instead of a hand-rolled colored circle/chip: asChild'd down to a plain
// <span> (no click handler, no focusability), fill swapped to the tone's own color via the
// existing --material-tonal-sample custom property, hover/press neutralized so it stays inert.
// Shared by the tone-scale row (mostly unselected chiclets, a couple "used" pills) and each role's
// spectrum marker (always the selected pill) so both read as the same control.
function MaterialToneSwatch({ tone, hex, used, title, className }: {
  tone: number
  hex: string
  used: boolean
  title: string
  className?: string
}) {
  // Material's own on-color convention: a dark checkmark on lighter swatches, a light one on
  // darker swatches — no stroke/outline trick, just the plain fill that already reads clearly.
  const ink = tone < 50 ? "white" : "black"
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      selected={used}
      title={title}
      className={cn("material-tonal-swatch", className)}
      style={{
        "--material-tonal-sample": hex,
        "--material-tonal-swatch-ink": ink,
        "--state-layer-hover": "transparent",
        "--state-layer-pressed": "transparent",
      } as React.CSSProperties}
    >
      <span>{used && <CheckIcon aria-hidden="true" className="material-tonal-swatch__check" />}</span>
    </Button>
  )
}

// ButtonGroup provides the connected-corner CSS for the mostly-unselected chiclets; the two-or-so
// "used" tones round into a full pill for free via the shared Button selected-state rule.
function MaterialToneScale({ steps, usedTones, usedLabel }: {
  steps: TonalScaleRow["steps"]
  usedTones: Set<number>
  usedLabel: string
}) {
  return (
    <div className="material-tonal-scale__body">
      <ButtonGroup shape="round" aria-hidden="true" className="material-tonal-scale__row w-full">
        {steps.map(({ tone, hex }) => {
          const used = usedTones.has(tone)
          return (
            <MaterialToneSwatch
              key={tone}
              tone={tone}
              hex={hex}
              used={used}
              title={`Tone ${tone}: ${hex}${used ? ` — ${usedLabel}` : ""}`}
              className="material-tonal-scale__step grow basis-0"
            />
          )
        })}
      </ButtonGroup>
      <div className="material-tonal-scale__tones">
        {steps.map(({ tone }) => (
          <span key={tone} className="material-tonal-scale__tone">{tone}</span>
        ))}
      </div>
    </div>
  )
}

function MaterialTonalScaleRow({ scale, referenceOnly }: { scale: TonalScaleRow; referenceOnly: boolean }) {
  return (
    <div className="material-tonal-scale">
      <span className="material-tonal-scale__label">{scale.label}</span>
      <MaterialToneScale
        steps={scale.steps}
        usedTones={scale.usedTones}
        usedLabel={referenceOnly ? "reference tone" : "used in the design system"}
      />
    </div>
  )
}

function MaterialTonalScales({ className, familyIndex = 0 }: { className?: string; familyIndex?: number }) {
  const [statusScales] = React.useState<TonalScaleRow[]>(() => {
    const resolveTone = (token: string) => nearestMaterialToneStop(toneOfHex(resolveCssColorToHex(token)))
    return statusScaleSources.map(({ label, token, used }) => ({
      label, steps: tonalScaleFromSeed(resolveCssColorToHex(token)),
      usedTones: new Set(used.map(resolveTone)),
    }))
  })
  const family = themeFamilies[familyIndex]
  const [primaryScale, secondaryScale, tertiaryScale, neutralScale] = React.useMemo(() => familyRows(family).map(row => ({
    label: row.label,
    steps: tonalScaleFromHueChroma(row.hue, row.chroma),
    usedTones: new Set<number>(row.usedTones),
  })), [family])
  const referenceOnly = familyIndex !== 0
  return (
    <Stack gap="md" data-slot="material-tonal-scales" className={cn(className)}>
      <Stack gap="xs">
        <p className="text-sm font-medium text-muted-foreground">Neutral</p>
        <MaterialTonalScaleRow scale={neutralScale} referenceOnly={referenceOnly} />
      </Stack>
      <Stack gap="xs">
        <p className="text-sm font-medium text-muted-foreground">Brand</p>
        <MaterialTonalScaleRow scale={primaryScale} referenceOnly={referenceOnly} />
        <MaterialTonalScaleRow scale={secondaryScale} referenceOnly={referenceOnly} />
        <MaterialTonalScaleRow scale={tertiaryScale} referenceOnly={referenceOnly} />
      </Stack>
      <Stack gap="xs">
        <p className="text-sm font-medium text-muted-foreground">Status</p>
        {statusScales.map(scale => <MaterialTonalScaleRow key={scale.label} scale={scale} referenceOnly={false} />)}
      </Stack>
    </Stack>
  )
}

type MaterialRoleEntry = {
  name: string
  label: string
  token: string
  hex: string
  tone: number
}

type MaterialRoleGroupDefinition = {
  label: string
  palette: string
  seedRole: string
  roles: readonly string[]
}

const materialRoleGroupDefinitions: readonly MaterialRoleGroupDefinition[] = [
  {
    label: "Backgrounds",
    palette: "Neutral palette",
    seedRole: "on-background",
    roles: ["background", "on-background"],
  },
  {
    label: "Surfaces",
    palette: "Neutral palette",
    seedRole: "on-surface",
    roles: [
      "surface", "surface-dim", "surface-bright", "surface-container-lowest",
      "surface-container-low", "surface-container", "surface-container-high",
      "surface-container-highest", "on-surface", "inverse-surface", "inverse-on-surface",
    ],
  },
  {
    label: "Surface variants and outlines",
    palette: "Neutral variant palette",
    seedRole: "on-surface-variant",
    roles: ["surface-variant", "on-surface-variant", "outline", "outline-variant"],
  },
  {
    label: "Surface effects",
    palette: "Neutral effects palette",
    seedRole: "shadow",
    roles: ["shadow", "scrim"],
  },
  {
    label: "Primary",
    palette: "Primary palette",
    seedRole: "primary",
    roles: [
      "surface-tint", "primary", "on-primary", "primary-container", "on-primary-container",
      "inverse-primary", "primary-fixed", "primary-fixed-dim", "on-primary-fixed",
      "on-primary-fixed-variant",
    ],
  },
  {
    label: "Secondary",
    palette: "Secondary palette",
    seedRole: "secondary",
    roles: [
      "secondary", "on-secondary", "secondary-container", "on-secondary-container",
      "secondary-fixed", "secondary-fixed-dim", "on-secondary-fixed", "on-secondary-fixed-variant",
    ],
  },
  {
    label: "Tertiary",
    palette: "Tertiary palette",
    seedRole: "tertiary",
    roles: [
      "tertiary", "on-tertiary", "tertiary-container", "on-tertiary-container",
      "tertiary-fixed", "tertiary-fixed-dim", "on-tertiary-fixed", "on-tertiary-fixed-variant",
    ],
  },
  {
    label: "Error",
    palette: "Error palette",
    seedRole: "error",
    roles: ["error", "on-error", "error-container", "on-error-container"],
  },
]

function MaterialTokenChip({ entry, copied, onCopy }: {
  entry: MaterialRoleEntry
  copied: boolean
  onCopy: (token: string) => Promise<void>
}) {
  return (
    <Chip
      variant="outline"
      size="xs"
      className="max-w-full font-mono"
      aria-label={copied ? `${entry.token} copied` : `Copy ${entry.token}`}
      title={copied ? `${entry.token} copied` : `Copy ${entry.token}`}
      data-token={entry.token}
      onClick={() => void onCopy(entry.token)}
    >
      <ChipIcon>{copied ? <CheckIcon /> : <CopyIcon />}</ChipIcon>
      <ChipLabel>{entry.token}</ChipLabel>
    </Chip>
  )
}

function MaterialRoleSpectrum({ definition, entries, copiedToken, onCopy }: {
  definition: MaterialRoleGroupDefinition
  entries: MaterialRoleEntry[]
  copiedToken: string | null
  onCopy: (token: string) => Promise<void>
}) {
  const seed = entries.find(entry => entry.name === definition.seedRole) ?? entries[0]
  const steps = tonalScaleFromSeed(seed.hex)
  const usedTones = new Set(entries.map(entry => entry.tone))
  return (
    <Card size="sm" className="material-role-spectrum" data-role-group={definition.label}>
      <div className="material-role-spectrum__sticky">
        <CardHeader>
          <CardTitle asChild><h3>{definition.label}</h3></CardTitle>
          <CardDescription>{definition.palette}</CardDescription>
        </CardHeader>
        <div className="material-role-spectrum__scale">
          <MaterialToneScale steps={steps} usedTones={usedTones} usedLabel="used by this role group" />
        </div>
      </div>
      <CardContent grouped>
        <div className="material-role-spectrum__roles">
          {entries.map(entry => (
            <div key={entry.name} className="material-role-spectrum__entry" data-role={entry.name}>
              <div className="material-role-spectrum__meta">
                <div className="material-role-spectrum__identity">
                  <Text variant="label" asChild><span>{entry.label}</span></Text>
                  <Text variant="metadata" tone="muted" asChild><code>{entry.hex} / tone {entry.tone}</code></Text>
                </div>
                <MaterialTokenChip entry={entry} copied={copiedToken === entry.token} onCopy={onCopy} />
              </div>
              <div className="material-role-spectrum__track" aria-hidden="true">
                {steps.map(step => (
                  <span key={step.tone} className="material-role-spectrum__cell">
                    {step.tone === entry.tone ? (
                      <MaterialToneSwatch
                        tone={entry.tone}
                        hex={entry.hex}
                        used
                        title={`${entry.label}: ${entry.hex}, tone ${entry.tone}`}
                        className="material-role-spectrum__marker"
                      />
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MaterialRoleSpectra({ entries }: { entries: MaterialRoleEntry[] }) {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null)
  const entriesByName = new Map(entries.map(entry => [entry.name, entry]))
  const groups = materialRoleGroupDefinitions.map(definition => ({
    definition,
    entries: definition.roles.flatMap(role => entriesByName.get(role) ?? []),
  })).filter(group => group.entries.length > 0)

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
      setCopiedToken(token)
    } catch {
      setCopiedToken(null)
    }
  }

  return (
    <Stack gap="md" data-slot="material-color-roles">
      <Text variant="label" tone="muted">Material website roles</Text>
      {groups.map(group => (
        <MaterialRoleSpectrum
          key={group.definition.label}
          definition={group.definition}
          entries={group.entries}
          copiedToken={copiedToken}
          onCopy={copyToken}
        />
      ))}
      <span className="sr-only" aria-live="polite">{copiedToken ? `${copiedToken} copied` : ""}</span>
    </Stack>
  )
}

function MaterialColorRoles() {
  const { variables, scale } = React.useContext(ColorThemeContext)
  if (scale === "current" || !variables) return null
  const value = (role: string) => variables[`--md-sys-color-${role}` as keyof React.CSSProperties]
  const roles = materialColorRoles.flatMap(role => {
    const name = role.name.replaceAll("_", "-")
    const token = `--md-sys-color-${name}`
    const rawValue = value(name)
    if (!rawValue) return []
    const hex = String(rawValue)
    return [{ name, label: materialRoleLabel(name), token, hex, tone: nearestMaterialToneStop(toneOfHex(hex)) }]
  })
  return (
    <Stack gap="lg">
    <Table data-slot="material-surface-roles">
      <TableCaption className="caption-top text-start">Surface roles</TableCaption>
      <TableHeader>
        <TableRow><TableHead>Surface</TableHead><TableHead>On surface</TableHead><TableHead className="whitespace-normal">On surface variant</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {(["surface", "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"] satisfies MaterialSurfaceRole[]).filter(role => value(role)).map(role => (
          <TableRow key={role}>
            <TableCell className="whitespace-normal">{materialRoleLabel(role)}</TableCell>
            <TableCell><MaterialSurface surface={role} className="rounded-md p-2" data-role={role}>On surface</MaterialSurface></TableCell>
            <TableCell><MaterialSurface surface={role} content="on-surface-variant" className="rounded-md p-2" data-role={role}>On surface variant</MaterialSurface></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Table data-slot="material-color-families">
      <TableCaption className="caption-top text-start">Accent roles</TableCaption>
      <TableHeader>
        <TableRow><TableHead>Family</TableHead><TableHead>Color / on color</TableHead><TableHead>Container / on container</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {["primary", "secondary", "tertiary", "error"].filter(family => value(family) || value(`${family}-container`)).map(family => (
          <TableRow key={family}>
            <TableCell>{materialRoleLabel(family)}</TableCell>
            {["", "-container"].map(suffix => (
              <TableCell key={suffix}>
                {value(`${family}${suffix}`) && value(`on-${family}${suffix}`)
                  ? <MaterialColorPair fill={`${family}${suffix}`} foreground={`on-${family}${suffix}`} />
                  : "Not specified"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <MaterialRoleSpectra entries={roles} />
    </Stack>
  )

}

export { ColorTheme, ColorThemePortal, ColorThemeSurface, MaterialColorRoles, MaterialTonalScales, themeFamilies, familySeedHex }
export type { ColorThemeScale, DarkCardSurface, ThemeFamily }