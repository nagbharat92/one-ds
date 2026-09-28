import * as React from "react"
import { useTheme } from "next-themes"
import type { ComponentEntry } from "@/showcase/types"
import { Canvas, CanvasToolbar } from "@/components/ui/canvas"
import { CanvasPreviewFrame } from "@/components/ui/canvas-preview"
import { ButtonGroupChoice, ButtonGroupChoiceItem } from "@/components/ui/button-group"
import { ToolbarTitle } from "@/components/ui/toolbar"
import { ColorTheme, MaterialColorRoles, MaterialTonalScales, familySeedHex, themeFamilies } from "@/components/ui/color-theme"
import { MaterialTheme } from "@/components/ui/material-theme"
import { ExpressionLabPreview } from "@/components/expression-lab-preview"
import { Stack } from "@/components/ui/stack"
import { createMaterialColorTheme, materialWebsiteRoleNames, readMaterialWebsiteTheme, tonalScaleFromHueChroma } from "@/lib/color-theme"

const neutralWebsiteRoleNames = materialWebsiteRoleNames.filter(role => !/^(primary|secondary|tertiary)/.test(role))

function neutralWebsiteRoleOverrides(roles: Record<`--md-sys-color-${string}`, string>) {
  return Object.fromEntries(
    neutralWebsiteRoleNames.map(role => [`--md-sys-color-${role}`, roles[`--md-sys-color-${role}`]]),
  ) as Record<`--md-sys-color-${string}`, string>
}

function ColorThemeDemo() {
  const [familyIndex, setFamilyIndex] = React.useState(0)
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === "dark" ? "dark" : "light"
  // The toggle owns the urgent familyIndex so its shape/checkmark paints immediately. The heavy
  // preview (whole ExpressionLabPreview tree + 49-role table + swatch grid) reads a deferred copy,
  // so React commits the toggle first and repaints the preview in a separate non-blocking pass.
  const deferredIndex = React.useDeferredValue(familyIndex)
  const [websiteThemes] = React.useState(() => {
    const tokens = getComputedStyle(document.documentElement)
    return {
      light: readMaterialWebsiteTheme(name => tokens.getPropertyValue(name), "light"),
      dark: readMaterialWebsiteTheme(name => tokens.getPropertyValue(name), "dark"),
    }
  })
  const family = themeFamilies[deferredIndex]
  const accentRoles = React.useMemo(() => createMaterialColorTheme(familySeedHex(family), mode), [family, mode])
  const overrideRoles = React.useMemo(
    () => ({
      ...accentRoles,
      ...neutralWebsiteRoleOverrides(websiteThemes[mode]),
    }),
    [accentRoles, mode, websiteThemes],
  )
  // Button's Primary fill and --purple-strong are pinned to the selected family tone tokens,
  // while the neutral surface roles stay fixed so the preview only changes hue, not contrast.
  const previewStyle = React.useMemo(() => {
    const ramp = tonalScaleFromHueChroma(family.seedHue, 48)
    const tone40 = ramp.find(step => step.tone === 40)!.hex
    const tone80 = ramp.find(step => step.tone === 80)!.hex
    return {
      "--md-ref-palette-primary40": tone40,
      "--md-ref-palette-primary80": tone80,
      "--purple-strong": mode === "dark" ? tone80 : tone40,
      "--purple-strong-ink": overrideRoles["--md-sys-color-on-primary"],
    } as React.CSSProperties
  }, [family, mode, overrideRoles])
  // Memoized on the DEFERRED value only: during the urgent toggle-paint pass these deps are
  // unchanged, so React reuses the cached elements and skips re-rendering the heavy subtrees.
  const scalesElement = React.useMemo(
    () => <MaterialTonalScales familyIndex={deferredIndex} className="mb-(--space-2xl)" />,
    [deferredIndex],
  )
  // Frozen once: this whole app mockup NEVER re-renders on a theme switch. Colors are CSS custom
  // properties, so they reach it purely through the cascade from the ColorTheme wrapper's inline
  // style below — a theme change is a browser style recompute, not a React re-render of this tree.
  // That removes the long main-thread block that was stuttering the toggle's corner transition.
  const frozenPreviewBody = React.useMemo(
    () => (
      <Canvas layout="application" background="plain">
        <ExpressionLabPreview />
      </Canvas>
    ),
    [],
  )
  const previewElement = React.useMemo(
    () => (
      <ColorTheme scale="website" accentButtons overrideRoles={overrideRoles} style={previewStyle}>
        <Stack gap="lg">
          {frozenPreviewBody}
          <MaterialColorRoles />
        </Stack>
      </ColorTheme>
    ),
    [overrideRoles, previewStyle, frozenPreviewBody],
  )
  return (
    <MaterialTheme className="@container/color-preview w-full">
      <Stack gap="lg">
        {scalesElement}
        <CanvasPreviewFrame controls={
          <CanvasToolbar aria-label="Theme family">
            <ToolbarTitle>Theme family</ToolbarTitle>
            <ButtonGroupChoice value={String(familyIndex)} onValueChange={(next) => setFamilyIndex(Number(next))} aria-label="Theme family" className="material-family-choice">
              {themeFamilies.map((candidate, index) => (
                <ButtonGroupChoiceItem key={candidate.label} variant="secondary" value={String(index)} aria-label={candidate.label} tooltip={candidate.label} className="px-(--space-xs)">
                  <span
                    className="material-family-swatch"
                    aria-hidden="true"
                    style={{ "--material-family-sample": familySeedHex(candidate) } as React.CSSProperties}
                  />
                </ButtonGroupChoiceItem>
              ))}
            </ButtonGroupChoice>
          </CanvasToolbar>
        }>
          {previewElement}
        </CanvasPreviewFrame>
      </Stack>
    </MaterialTheme>
  )
}

export const colorDemos: ComponentEntry[] = [
  {
    slug: "colors",
    name: "Colors",
    description:
      "Material website color roles: Surface and its container levels, Primary, Secondary, Tertiary, and their paired on-colors. Neutral surfaces are shared across the site and components; this preview also applies the website's accent roles.",
    category: "Experiments",
    surface: "default",
    installCommand: null,
    Demo: ColorThemeDemo,
    defaultExampleName: "Material website",
    ownsCanvas: true,
    codeSource: "complete",
    code: "",
  },
]