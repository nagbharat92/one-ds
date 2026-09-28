import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import test from "node:test"
import { argbFromHex, Contrast, Hct, lstarFromArgb, hexFromArgb, SchemeExpressive, SchemeTonalSpot, SchemeVibrant } from "@material/material-color-utilities"
import { createColorTheme, createMaterialColorTheme, materialColorRoles, readColorThemeRecipe, readMaterialWebsiteTheme } from "../src/lib/color-theme.ts"

const css = ["../src/styles/tokens.css", "../src/styles/color-theme.css"]
  .map(path => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n")
const recipe = readColorThemeRecipe((name) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1] ?? "")
const ratio = (foreground, background) => Contrast.ratioOfTones(
  lstarFromArgb(argbFromHex(foreground)), lstarFromArgb(argbFromHex(background)),
)
const seeds = ["#000000", "#ffffff", "#808080", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#c881a5"]

test("component surfaces do not bypass shared roles with legacy dark fills or literal neutral utilities", () => {
  const directory = new URL("../src/components/ui/", import.meta.url)
  for (const filename of readdirSync(directory).filter(name => /\.tsx?$/.test(name))) {
    const source = readFileSync(new URL(filename, directory), "utf8")
    assert.doesNotMatch(source, /\bdark:bg-input\//, filename)
    assert.doesNotMatch(source, /\bbg-(white|black|gray-\d+|slate-\d+|zinc-\d+|neutral-\d+)\b/, filename)
  }
})

test("Material state aliases use the documented opacity values", () => {
  for (const [state, opacity] of [["hover", 0.08], ["focus", 0.10], ["pressed", 0.10], ["dragged", 0.16]]) {
    const token = `--md-sys-state-${state}-state-layer-opacity`
    assert.equal(Number(css.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1]), opacity)
    assert.ok(css.includes(`--state-layer-${state}-opacity: calc(var(${token}) * 100%);`))
  }
})

test("Material website preset preserves verified reference colors and paired contrast", () => {
  const readToken = name => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1] ?? ""
  for (const mode of ["light", "dark"]) {
    const roles = readMaterialWebsiteTheme(readToken, mode)
    assert.equal(Object.keys(roles).length, 25)
    assert.equal(roles["--md-sys-color-primary"], mode === "light" ? "#6442d6" : "#9f86ff")
    assert.equal(roles["--md-sys-color-secondary-container"], mode === "light" ? "#dcdaf5" : "#45455a")
    assert.equal(roles["--md-sys-color-tertiary-container"], mode === "light" ? "#f1d3f9" : "#553f5d")
    assert.equal(roles["--md-sys-color-surface"], mode === "light" ? "#fefbff" : "#141314")
    assert.equal(roles["--md-sys-color-tertiary"], undefined)
    assert.ok(ratio(roles["--md-sys-color-on-surface-variant"], roles["--md-sys-color-tertiary-container"]) >= 4.5)
    for (const family of ["primary", "primary-container", "secondary", "secondary-container", "tertiary-container"]) {
      assert.ok(ratio(roles[`--md-sys-color-${family}`], roles[`--md-sys-color-on-${family}`]) >= 4.5)
    }
    for (const surface of ["surface", "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"]) {
      for (const foreground of ["on-surface", "on-surface-variant"]) {
        assert.ok(ratio(roles[`--md-sys-color-${foreground}`], roles[`--md-sys-color-${surface}`]) >= 4.5)
      }
    }
  }
  assert.throws(() => readMaterialWebsiteTheme(() => "", "light"), /Invalid Material website token/)
})

test("Material website preset normalizes minified hex tokens", () => {
  for (const mode of ["light", "dark"]) {
    for (const [token, expected] of [[" #fff ", "#ffffff"], ["#ABC", "#aabbcc"], ["#123456", "#123456"]]) {
      const roles = readMaterialWebsiteTheme(() => token, mode)
      assert.ok(Object.values(roles).every(value => value === expected))
    }
    for (const token of ["", "#12", "#ggg", "#ffff", "#ffffff00"]) {
      assert.throws(() => readMaterialWebsiteTheme(() => token, mode), /Invalid Material website token/)
    }
  }
})

test("all official roles match Material APIs across schemes, contrast levels, seeds, and modes", () => {
  for (const seed of seeds) {
    for (const mode of ["light", "dark"]) {
      for (const [name, Scheme] of Object.entries({"tonal-spot": SchemeTonalSpot, vibrant: SchemeVibrant, expressive: SchemeExpressive})) {
        for (const contrast of [0, 0.5, 1]) {
          const generated = createMaterialColorTheme(seed, mode, name, contrast)
          const scheme = new Scheme(Hct.fromInt(argbFromHex(seed)), mode === "dark", contrast)
          assert.equal(Object.keys(generated).length, 49)
          for (const role of materialColorRoles) {
            assert.equal(generated[`--md-sys-color-${role.name.replaceAll("_", "-")}`], hexFromArgb(role.getArgb(scheme)))
          }
          for (const family of ["primary", "secondary", "tertiary", "error"]) {
            for (const suffix of ["", "-container"]) {
              assert.ok(ratio(generated[`--md-sys-color-${family}${suffix}`], generated[`--md-sys-color-on-${family}${suffix}`]) >= 4.5)
            }
          }
        }
      }
    }
  }
  assert.throws(() => createMaterialColorTheme("#8b3343", "light", "invalid"), /Unsupported/)
})

test("Material roles provide paired contrast, white light cards, and fixed accents across modes", () => {
  for (const seed of seeds) {
    const light = createMaterialColorTheme(seed, "light")
    const dark = createMaterialColorTheme(seed, "dark")
    assert.equal(light["--md-sys-color-surface-container-lowest"], "#ffffff")
    for (const role of ["primary-fixed", "primary-fixed-dim", "on-primary-fixed"]) {
      assert.equal(light[`--md-sys-color-${role}`], dark[`--md-sys-color-${role}`])
    }
    for (const roles of [light, dark]) {
      for (const surface of ["surface", "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"]) {
        for (const foreground of ["on-surface", "on-surface-variant", "primary"]) {
          assert.ok(ratio(roles[`--md-sys-color-${foreground}`], roles[`--md-sys-color-${surface}`]) >= 4.5)
        }
      }
      for (const [fill, ink] of [["primary", "on-primary"], ["primary-fixed", "on-primary-fixed"], ["primary-fixed-dim", "on-primary-fixed"], ["secondary", "on-secondary"]]) {
        assert.ok(ratio(roles[`--md-sys-color-${ink}`], roles[`--md-sys-color-${fill}`]) >= 4.5)
      }
    }
  }
  assert.throws(() => createMaterialColorTheme("invalid", "light"), /six-digit hex/)
})

test("two independent seeds produce ordered surfaces and accessible paired roles", () => {
  for (const surface of seeds) {
    for (const accent of seeds) {
      const themes = createColorTheme({ surface, accent }, recipe)
      for (const mode of ["light", "dark"]) {
        const roles = themes[mode]
        const surfaces = ["canvas", "low", "default", "high"].map((name) => roles[`--surface-${name}`])
        const tones = surfaces.map((color) => lstarFromArgb(argbFromHex(color)))
        assert.ok(tones.every((tone, index) => !index || (mode === "light" ? tone < tones[index - 1] : tone > tones[index - 1])))
        for (const background of surfaces) {
          for (const foreground of ["--surface-ink", "--surface-muted-ink", "--action-primary"]) {
            assert.ok(ratio(roles[foreground], background) >= 4.5, `${surface}/${accent}/${mode}/${foreground}`)
          }
          assert.ok(ratio(roles["--surface-input-outline"], background) >= 3)
        }
        for (const family of ["primary", "secondary"]) {
          assert.ok(ratio(roles[`--action-on-${family}`], roles[`--action-${family}`]) >= 4.5)
        }
      }
    }
  }
})

test("accent changes cannot recolor surfaces and surface changes cannot recolor explicit accents", () => {
  const initial = createColorTheme({ surface: "#c881a5", accent: "#6750a4" }, recipe)
  const changedAccent = createColorTheme({ surface: "#c881a5", accent: "#006b60" }, recipe)
  const changedSurface = createColorTheme({ surface: "#006b60", accent: "#6750a4" }, recipe)
  for (const mode of ["light", "dark"]) {
    for (const name of Object.keys(initial[mode])) {
      if (name.startsWith("--surface-")) assert.equal(initial[mode][name], changedAccent[mode][name])
      else assert.equal(initial[mode][name], changedSurface[mode][name])
    }
    assert.notEqual(initial[mode]["--action-primary"], changedAccent[mode]["--action-primary"])
  }
})

test("one seed supplies both families and invalid inputs are rejected", () => {
  assert.deepEqual(createColorTheme({ surface: "#006b60" }, recipe), createColorTheme({ surface: "#006b60", accent: "#006b60" }, recipe))
  for (const surface of ["", "red", "#fff", "#invalid", "#ffffff00"]) {
    assert.throws(() => createColorTheme({ surface }, recipe), /six-digit hex/)
  }
  assert.throws(() => readColorThemeRecipe(() => ""), /Invalid color theme token/)
})

test("single-color surfaces stay near-neutral and supporting fills separate from cards", () => {
  assert.equal(recipe.surfaceChroma, 4)
  for (const surface of seeds) {
    const theme = createColorTheme({ surface }, recipe)
    for (const mode of ["light", "dark"]) {
      const roles = theme[mode]
      for (const name of ["canvas", "low", "default", "high"]) {
        const color = Hct.fromInt(argbFromHex(roles[`--surface-${name}`]))
        assert.ok(color.chroma < 6, `${surface}/${mode}/${name}: ${color.chroma}`)
      }
      assert.ok(ratio(roles["--action-secondary"], roles["--surface-default"]) >= 1.4)
    }
  }
})