import { argbFromHex, DynamicColor, Hct, hexFromArgb, MaterialDynamicColors, SchemeExpressive, SchemeTonalSpot, SchemeVibrant, TonalPalette } from "@material/material-color-utilities"

const materialSchemes = {
  "tonal-spot": SchemeTonalSpot,
  vibrant: SchemeVibrant,
  expressive: SchemeExpressive,
}
export type MaterialSchemeName = keyof typeof materialSchemes
export type MaterialContrast = 0 | 0.5 | 1

export const materialWebsiteRoleNames = [
  "background", "on-background", "surface", "on-surface",
  "surface-container-lowest", "surface-container-low", "surface-container",
  "surface-container-high", "surface-container-highest", "surface-variant",
  "on-surface-variant", "inverse-surface", "inverse-on-surface",
  "primary", "on-primary", "primary-container", "on-primary-container",
  "secondary", "on-secondary", "secondary-container", "on-secondary-container",
  "tertiary-container", "on-tertiary-container", "outline", "outline-variant",
] as const

export function readMaterialWebsiteTheme(readToken: (name: string) => string, mode: ColorThemeMode): Record<`--md-sys-color-${string}`, string> {
  return Object.fromEntries(materialWebsiteRoleNames.map(role => {
    const token = `--theme-website-${role}-${mode}`
    const value = readToken(token).trim()
    if (!/^#[\da-f]{6}$/i.test(value)) throw new Error(`Invalid Material website token: ${token}`)
    return [`--md-sys-color-${role}`, value]
  }))
}

export const materialColorRoles = Object.values(MaterialDynamicColors)
  .filter((role): role is DynamicColor => role instanceof DynamicColor && !role.name.endsWith("palette_key_color"))

export function createMaterialColorTheme(seed: string, mode: ColorThemeMode, schemeName: MaterialSchemeName = "tonal-spot", contrast: MaterialContrast = 0): Record<`--md-sys-color-${string}`, string> {
  if (!/^#[\da-f]{6}$/i.test(seed)) throw new Error("Material seed must be a six-digit hex color")
  const Scheme = materialSchemes[schemeName]
  if (!Scheme || ![0, 0.5, 1].includes(contrast)) throw new Error("Unsupported Material scheme or contrast")
  const scheme = new Scheme(Hct.fromInt(argbFromHex(seed)), mode === "dark", contrast)
  return Object.fromEntries(materialColorRoles.map(role => [
    `--md-sys-color-${role.name.replaceAll("_", "-")}`, hexFromArgb(role.getArgb(scheme)),
  ]))
}

export type ColorThemeSeeds = { surface: string; accent?: string }
export type ColorThemeMode = "light" | "dark"

export const colorThemeToneNames = [
  "canvas", "low", "default", "high", "ink", "muted-ink", "outline",
  "input-outline", "primary", "on-primary", "secondary", "on-secondary",
] as const

type ToneName = typeof colorThemeToneNames[number]
export type ColorThemeRecipe = {
  surfaceChroma: number
  accentChroma: number
  secondaryChroma: number
  light: Record<ToneName, number>
  dark: Record<ToneName, number>
}

export function readColorThemeRecipe(readToken: (name: string) => string): ColorThemeRecipe {
  const readNumber = (name: string) => {
    const raw = readToken(name).trim()
    const value = Number(raw)
    if (!raw || !Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(`Invalid color theme token: ${name}`)
    }
    return value
  }
  const readTones = (mode: ColorThemeMode) => Object.fromEntries(
    colorThemeToneNames.map((name) => [name, readNumber(`--theme-tone-${name}-${mode}`)]),
  ) as Record<ToneName, number>
  return {
    surfaceChroma: readNumber("--theme-surface-chroma"),
    accentChroma: readNumber("--theme-accent-chroma"),
    secondaryChroma: readNumber("--theme-secondary-chroma"),
    light: readTones("light"),
    dark: readTones("dark"),
  }
}

export function createColorTheme(
  seeds: ColorThemeSeeds,
  recipe: ColorThemeRecipe,
): Record<ColorThemeMode, Record<`--${string}`, string>> {
  const parseSeed = (value: string) => {
    if (!/^#[\da-f]{6}$/i.test(value)) {
      throw new Error("Color theme seeds must be six-digit hex colors")
    }
    return Hct.fromInt(argbFromHex(value))
  }
  const surfaceSeed = parseSeed(seeds.surface)
  const accentSeed = parseSeed(seeds.accent ?? seeds.surface)
  const surface = TonalPalette.fromHueAndChroma(
    surfaceSeed.hue, Math.min(surfaceSeed.chroma, recipe.surfaceChroma),
  )
  const accent = TonalPalette.fromHueAndChroma(
    accentSeed.hue, Math.min(accentSeed.chroma, recipe.accentChroma),
  )
  const secondary = TonalPalette.fromHueAndChroma(
    accentSeed.hue, Math.min(accentSeed.chroma, recipe.secondaryChroma),
  )
  const resolve = (mode: ColorThemeMode) => {
    const tones = recipe[mode]
    const surfaceColor = (name: ToneName) => hexFromArgb(surface.tone(tones[name]))
    const accentColor = (name: ToneName) => hexFromArgb(accent.tone(tones[name]))
    return {
      "--surface-canvas": surfaceColor("canvas"),
      "--surface-low": surfaceColor("low"),
      "--surface-default": surfaceColor("default"),
      "--surface-high": surfaceColor("high"),
      "--surface-ink": surfaceColor("ink"),
      "--surface-muted-ink": surfaceColor("muted-ink"),
      "--surface-outline": surfaceColor("outline"),
      "--surface-input-outline": surfaceColor("input-outline"),
      "--action-primary": accentColor("primary"),
      "--action-on-primary": accentColor("on-primary"),
      "--action-secondary": hexFromArgb(secondary.tone(tones.secondary)),
      "--action-on-secondary": hexFromArgb(secondary.tone(tones["on-secondary"])),
    }
  }
  return { light: resolve("light"), dark: resolve("dark") }
}