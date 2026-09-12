import * as React from "react"
import { Slot } from "radix-ui"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { ButtonGroupChoice, ButtonGroupChoiceItem } from "@/components/ui/button-group"
import { createColorTheme, createMaterialColorTheme, materialColorRoles, readColorThemeRecipe, readMaterialWebsiteTheme, type ColorThemeSeeds, type MaterialSchemeName, type MaterialContrast } from "@/lib/color-theme"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Stack } from "@/components/ui/stack"
import { MaterialSurface, type MaterialSurfaceRole } from "@/components/ui/material-surface"

type SurfaceHue = "warm" | "rose" | "green" | "blue" | "lilac"
type ColorThemeScale = "current" | "material" | "website"
type DarkCardSurface = "lowest" | "low"
const surfaceHues: { value: SurfaceHue; label: string }[] = [
  { value: "warm", label: "Warm grey" },
  { value: "rose", label: "Rose grey" },
  { value: "green", label: "Green grey" },
  { value: "blue", label: "Blue grey" },
  { value: "lilac", label: "Lilac grey" },
]
const ColorThemeContext = React.createContext<{
  variables?: React.CSSProperties
  hue?: SurfaceHue
  accentButtons?: boolean
  scale?: ColorThemeScale
  darkCardSurface?: DarkCardSurface
  materialScheme?: MaterialSchemeName
  contrast?: MaterialContrast
}>({})

function websiteAccentVariables(variables: React.CSSProperties | undefined, mode: "light" | "dark") {
  return Object.fromEntries(Object.keys(variables ?? {})
    .filter(name => /^--md-sys-color-(on-)?(primary|secondary|tertiary)(-|$)/.test(name))
    .map(name => [name, `var(--theme-website-${name.replace("--md-sys-color-", "")}-${mode})`]))
}

function ColorTheme({ theme, hue, scale, darkCardSurface, materialScheme, contrast, accentButtons, asChild = false, className, style, children, ...props }:
  React.ComponentProps<"div"> & { theme?: ColorThemeSeeds; hue?: SurfaceHue; scale?: ColorThemeScale; darkCardSurface?: DarkCardSurface; materialScheme?: MaterialSchemeName; contrast?: MaterialContrast; accentButtons?: boolean; asChild?: boolean }) {
  const { resolvedTheme } = useTheme()
  const inherited = React.useContext(ColorThemeContext)
  const useAccentButtons = accentButtons ?? inherited.accentButtons ?? true
  const activeScale = scale ?? inherited.scale ?? "current"
  const activeDarkCardSurface = darkCardSurface ?? inherited.darkCardSurface ?? "lowest"
  const activeScheme = materialScheme ?? inherited.materialScheme ?? "tonal-spot"
  const activeContrast = contrast ?? inherited.contrast ?? 0
  const [websiteThemes] = React.useState(() => {
    const tokens = getComputedStyle(document.documentElement)
    return {
      light: readMaterialWebsiteTheme(name => tokens.getPropertyValue(name), "light"),
      dark: readMaterialWebsiteTheme(name => tokens.getPropertyValue(name), "dark"),
    }
  })
  const [materialSeeds] = React.useState(() => {
    const tokens = getComputedStyle(document.documentElement)
    return Object.fromEntries(surfaceHues.map(({ value }) => [value,
      tokens.getPropertyValue(`--theme-material-seed-${value}`).trim(),
    ])) as Record<SurfaceHue, string>
  })
  const [recipe] = React.useState(() => {
    const tokens = getComputedStyle(document.documentElement)
    return readColorThemeRecipe((name) => tokens.getPropertyValue(name))
  })
  const activeHue = activeScale === "website" ? undefined : hue ?? (theme ? undefined : inherited.hue)
  const variables = activeScale === "website"
    ? websiteThemes[resolvedTheme === "dark" ? "dark" : "light"] as React.CSSProperties
    : activeScale === "material" && activeHue
    ? createMaterialColorTheme(materialSeeds[activeHue], resolvedTheme === "dark" ? "dark" : "light",
      activeScheme, activeContrast,
    ) as React.CSSProperties
    : activeHue ? undefined : theme
    ? createColorTheme(theme, recipe)[resolvedTheme === "dark" ? "dark" : "light"] as React.CSSProperties
    : inherited.variables
  const Comp = asChild ? Slot.Root : "div"
  const appliedVariables = activeScale === "website"
    ? websiteAccentVariables(variables, resolvedTheme === "dark" ? "dark" : "light")
    : variables
  return (
    <ColorThemeContext.Provider value={{ variables, hue: activeHue, accentButtons: useAccentButtons, scale: activeScale, darkCardSurface: activeDarkCardSurface, materialScheme: activeScheme, contrast: activeContrast }}>
      <Comp
        {...(!asChild ? { "data-slot": "color-theme" } : {})}
        data-color-theme={variables && activeScale === "current" ? "custom" : undefined}
        data-color-scale={activeScale}
        data-dark-card-surface={activeDarkCardSurface}
        data-material-scheme={activeScale === "website" ? undefined : activeScheme}
        data-material-contrast={activeScale === "website" ? undefined : activeContrast}
        data-surface-hue={activeHue}
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
  const { resolvedTheme } = useTheme()
  const { variables, hue, accentButtons, scale, darkCardSurface, materialScheme, contrast } = React.useContext(ColorThemeContext)
  const Comp = asChild ? Slot.Root : "div"
  const appliedVariables = scale === "website"
    ? websiteAccentVariables(variables, resolvedTheme === "dark" ? "dark" : "light")
    : variables
  return <Comp
    data-color-theme={variables && scale === "current" ? "custom" : undefined}
    data-color-scale={scale}
    data-dark-card-surface={darkCardSurface}
    data-material-scheme={scale === "website" ? undefined : materialScheme}
    data-material-contrast={scale === "website" ? undefined : contrast}
    data-surface-hue={hue}
    data-accent-buttons={accentButtons}
    className={cn("color-theme", className)}
    style={{ ...appliedVariables, ...style }}
    {...props}
  />
}

function ColorThemeSwatches({ value, onValueChange, label = "Surface hue", disabled = false }: {
  value: SurfaceHue
  onValueChange: (value: SurfaceHue) => void
  label?: string
  disabled?: boolean
}) {
  return (
      <ButtonGroupChoice value={value} onValueChange={(next) => {
        if (surfaceHues.some(hue => hue.value === next)) onValueChange(next as SurfaceHue)
      }} disabled={disabled} aria-label={label}>
        {surfaceHues.map(hue => (
              <ButtonGroupChoiceItem key={hue.value} variant="secondary" value={hue.value} aria-label={hue.label} tooltip={hue.label} className="color-theme-swatch px-(--space-xs)" data-surface-hue={hue.value}>
                <span className="color-theme-swatch__color" aria-hidden="true" />
              </ButtonGroupChoiceItem>
        ))}
      </ButtonGroupChoice>
  )
}

function ColorSeedInput({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return <input data-slot="color-seed-input" type="color" className={cn("color-seed-input", className)} {...props} />
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

function MaterialColorRoles() {
  const { variables, scale } = React.useContext(ColorThemeContext)
  if (scale === "current" || !variables) return null
  const value = (role: string) => variables[`--md-sys-color-${role}` as keyof React.CSSProperties]
  const roles = materialColorRoles.filter(role => value(role.name.replaceAll("_", "-")))
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
    <Table data-slot="material-color-roles">
      <TableCaption className="caption-top text-start">{scale === "website" ? "Material website roles" : "Material color roles"}</TableCaption>
      <TableHeader>
        <TableRow><TableHead>Sample</TableHead><TableHead>Role</TableHead><TableHead>Value</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {roles.map(role => {
          const name = role.name.replaceAll("_", "-")
          const token = `--md-sys-color-${name}`
          return (
            <TableRow key={name}>
              <TableCell>
                <span aria-hidden="true" className="material-role-swatch" style={{ "--material-role-sample": `var(${token})` } as React.CSSProperties} />
              </TableCell>
              <TableCell className="whitespace-normal">{materialRoleLabel(name)}<code className="block text-xs text-muted-foreground wrap-anywhere">{token}</code></TableCell>
              <TableCell><code>{variables[token as keyof React.CSSProperties]}</code></TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
    </Stack>
  )

}

export { ColorTheme, ColorThemePortal, ColorSeedInput, ColorThemeSurface, ColorThemeSwatches, MaterialColorRoles }
export type { SurfaceHue, ColorThemeScale, DarkCardSurface }