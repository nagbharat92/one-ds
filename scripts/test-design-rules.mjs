import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import ts from "typescript"

const rules = JSON.parse(fs.readFileSync("src/design-system/rules.json", "utf8"))

test("optical label correction is shared, tokenized, and explicitly directional", () => {
  const css = fs.readFileSync("src/index.css", "utf8")
  assert.ok(css.includes("--space-2xs: var(--spacing);"))
  assert.ok(css.includes("--space-xs: calc(var(--spacing) * 2);"))
  assert.ok(css.includes("--icon-label-optical-padding: var(--space-2xs);"))
  assert.ok(css.includes("--graphic-label-gap: var(--space-xs);"))
  assert.ok(css.includes("--button-gap: var(--graphic-label-gap);"))
  assert.ok(css.includes("padding-inline-start: var(--icon-label-optical-padding);"))
  assert.ok(css.includes("padding-inline-end: var(--icon-label-optical-padding);"))
  assert.ok(css.includes('[data-slot="spinner"]'))
  const button = fs.readFileSync("src/components/ui/button.tsx", "utf8")
  assert.match(button, /withIconLabels/)
  assert.match(button, /data-icon-label-host/)
  const badge = fs.readFileSync("src/components/ui/badge.tsx", "utf8")
  assert.match(badge, /withIconLabels/)
  assert.match(badge, /data-icon-label-host/)
  const rule = rules.rules.find(rule => rule.id === "geometry.icon-label-optical-spacing")
  assert.equal(rule.status, "approved")
  assert.match(rule.rule, /opposite the graphic/)
  assert.match(rule.rule, /loading spinner/)
})

test("Button has no outline variant or stale outline markup in published examples", () => {
  const source = ts.createSourceFile("button.tsx", fs.readFileSync("src/components/ui/button.tsx", "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let variants
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === "variant" && ts.isObjectLiteralExpression(node.initializer)) variants = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(source)
  assert.deepEqual(variants.properties.map(property => property.name.text), ["default", "tertiary", "primary", "secondary", "ghost", "destructive", "link"])
  const variantValues = Object.fromEntries(variants.properties.map(property => [property.name.text, property.initializer.text]))
  assert.equal(variantValues.default, variantValues.tertiary)
  assert.match(source.text, /const selection = variant === "primary" \? undefined : selected/)
  const choice = fs.readFileSync("src/components/ui/button-group.tsx", "utf8")
  assert.match(choice, /variant\?: "default" \| "secondary" \| "tertiary"/)
  assert.match(source.text, /defaultVariants:\s*\{\s*variant: "tertiary"/)
  assert.match(source.text, /variant = "tertiary"/)
  for (const filename of ts.sys.readDirectory("src", [".tsx"])) {
    assert.doesNotMatch(fs.readFileSync(filename, "utf8"), /<Button\b[^>]*\bvariant="outline"/s, filename)
  }
  assert.equal(rules.rules.find(rule => rule.id === "controls.supporting-actions").status, "approved")
})

test("Primary Button keeps purple by default and exposes an explicit pink color", () => {
  const button = fs.readFileSync("src/components/ui/button.tsx", "utf8")
  const css = fs.readFileSync("src/index.css", "utf8")
  const showcase = fs.readFileSync("src/showcase/demos/forms.tsx", "utf8")
  assert.match(button, /type ButtonPrimaryColor = "purple" \| "pink"/)
  assert.match(button, /primaryColor = "purple"/)
  assert.match(button, /data-primary-color=\{variant === "primary" \? primaryColor : undefined\}/)
  for (const token of ["--button-primary-pink-fill", "--button-primary-pink-ink"]) assert.ok(css.includes(`${token}:`), token)
  assert.match(css, /data-primary-color="pink"/)
  assert.match(showcase, /primaryColor="pink">Primary pink/)
  const rule = rules.rules.find(rule => rule.id === "controls.button-colors")
  assert.equal(rule.status, "approved")
  assert.match(rule.rule, /primaryColor purple or pink/)
})

test("showcase exposes two surface tiers with compact ordinary previews", () => {
  const source = fs.readFileSync("src/showcase/types.ts", "utf8")
  assert.match(source, /surface\?: "default" \| "application"/)
  const app = fs.readFileSync("src/App.tsx", "utf8")
  assert.match(app, /default: "app"/)
  assert.match(app, /default: "center"/)
  assert.match(app, /layout = "center"/)
  assert.doesNotMatch(app, /component: "docs"|medium: "app"/)
  const styles = fs.readFileSync("src/index.css", "utf8")
  assert.match(styles, /--showcase-preview-min-height: calc\(var\(--spacing\) \* 50\)/)
  assert.match(styles, /--canvas-min-height: var\(--showcase-preview-min-height\)/)
  const rule = rules.rules.find(rule => rule.id === "showcase.surface-scale")
  assert.equal(rule.status, "approved")
})

test("List Item owns full and compact geometry plus the shared list state ladder", () => {
  const item = fs.readFileSync("src/components/ui/item.tsx", "utf8")
  assert.match(item, /compact\?: boolean/)
  assert.match(item, /data-compact=\{compact \? "" : undefined\}/)
  assert.match(item, /function ItemPrimaryAction/)
  assert.match(item, /function ItemActionSlot/)
  assert.doesNotMatch(item, /data-size=\{size\}|group-data-\[size=(?:xs|sm)\]\/item/)

  const legacySizeConsumers = []
  for (const filename of ts.sys.readDirectory("src", [".tsx"]).filter(filename => !filename.endsWith("generated-example-code.ts"))) {
    const source = ts.createSourceFile(filename, fs.readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    function visit(node) {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === "Item") {
        if (node.attributes.properties.some(property => property.name?.getText(source) === "size")) legacySizeConsumers.push(filename)
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
  assert.deepEqual(legacySizeConsumers, [])

  const css = fs.readFileSync("src/index.css", "utf8")
  for (const token of ["--item-radius", "--item-padding", "--item-inner-radius", "--item-host-surface", "--item-compact-height", "--item-compact-radius", "--item-media-host-size", "--item-image-size", "--state-layer-color", "--state-layer-hover-opacity", "--state-layer-focus-opacity", "--state-layer-pressed-opacity"]) {
    assert.ok(css.includes(`${token}:`), token)
  }
  assert.match(css, /--item-default-hover-surface: color-mix\(/)
  assert.match(css, /--item-muted-hover-surface: color-mix\(/)
  assert.match(css, /--item-default-hover-surface: color-mix\([\s\S]*?var\(--state-layer-color\) var\(--state-layer-hover-opacity\)/)
  assert.match(css, /--item-default-focus-surface: color-mix\([\s\S]*?var\(--state-layer-color\) var\(--state-layer-focus-opacity\)/)
  assert.match(css, /--item-default-pressed-surface: color-mix\([\s\S]*?var\(--state-layer-color\) var\(--state-layer-pressed-opacity\)/)
  assert.match(css, /--item-muted-surface: var\(--button-secondary-fill\)/)
  assert.match(css, /--item-muted-ink: var\(--button-secondary-ink\)/)
  assert.doesNotMatch(css, /--list-row-(?:state-ink|hover-opacity|focus-opacity|pressed-opacity)/)
  assert.match(css, /@layer item/)
  assert.doesNotMatch(css, /data-showcase-slug="list-item"|--list-item-|list-item-(?:compact|media|action|select)/)
  const sidebar = fs.readFileSync("src/components/ui/sidebar.tsx", "utf8")
  assert.match(sidebar, /hover:bg-\(--item-default-hover-surface\)/)
  assert.match(sidebar, /active:bg-\(--item-default-pressed-surface\)/)
  const app = fs.readFileSync("src/App.tsx", "utf8")
  assert.match(app, /<Item\s+compact\s+asChild/)
  assert.match(app, /<ItemContent>[\s\S]*<ItemTitle>\{component\.name\}<\/ItemTitle>/)
  assert.equal(rules.rules.find(rule => rule.id === "composition.list-item").status, "approved")
})

test("tooltips use fixed arrowless pill geometry", () => {
  const tooltip = fs.readFileSync("src/components/ui/tooltip.tsx", "utf8")
  assert.match(tooltip, /rounded-xl/)
  assert.match(tooltip, /data-\[side=top\]:mb-\(--tooltip-gap\)/)
  assert.doesNotMatch(tooltip, /TooltipPrimitive\.Arrow|tooltip-arrow/)
  const styles = fs.readFileSync("src/index.css", "utf8")
  assert.match(styles, /--tooltip-gap: var\(--space-2xs\)/)
  assert.doesNotMatch(styles, /tooltip-arrow/)
  const button = fs.readFileSync("src/components/ui/button.tsx", "utf8")
  assert.match(button, /tooltipSide = "top"/)
  const sidebar = fs.readFileSync("src/components/ui/sidebar.tsx", "utf8")
  assert.match(sidebar, /tooltipSide=\{side === "start" \? "right" : "left"\}/)
  for (const id of ["geometry.tooltip-shape", "geometry.tooltip-placement"]) {
    assert.equal(rules.rules.find(rule => rule.id === id).status, "approved")
  }
})

test("rules carry explicit approval, evidence, exceptions, and valid implementation paths", () => {
  assert.equal(rules.version, 1)
  const ids = new Set()
  for (const rule of rules.rules) {
    assert.ok(!ids.has(rule.id), `Duplicate ID: ${rule.id}`)
    ids.add(rule.id)
    assert.match(rule.id, /^[a-z-]+\.[a-z-]+$/)
    assert.ok(["approved", "candidate"].includes(rule.status))
    assert.ok(["Required", "Recommended", "Experimental"].includes(rule.level))
    for (const field of ["title", "section", "rule", "why", "exceptions", "evidence"]) assert.ok(rule[field]?.trim(), `${rule.id}: ${field}`)
    assert.ok(rule.enforcement.kind && rule.enforcement.detail)
    for (const file of rule.implementation) assert.ok(fs.existsSync(file), `Missing implementation: ${file}`)
  }
  assert.equal(rules.rules.find(rule => rule.id === "controls.button-scale").status, "approved")
  assert.ok(rules.rules.some(rule => rule.status === "candidate"))
  assert.equal(rules.rules[0].id, "composition.shared-anatomy")
  assert.equal(rules.rules[0].status, "approved")
  assert.equal(rules.rules[0].level, "Required")
})

test("Rules page delegates reusable visuals and interactions to library components", () => {
  const page = fs.readFileSync("src/showcase/design-rules-page.tsx", "utf8")
  const source = ts.createSourceFile("rules-page.tsx", page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const violations = []
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source)
      if (["details", "summary", "button", "nav"].includes(tag)) violations.push(tag)
      if (/^[a-z]/.test(tag) && node.attributes.properties.some(property => property.name?.getText(source) === "className")) violations.push(`Styled native element: ${tag}`)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  assert.deepEqual(violations, [])
  for (const component of ["Text", "Section", "Stack", "Cluster", "TableOfContents", "Accordion", "Empty"]) assert.ok(page.includes(`<${component}`))
})

test("Button exposes only two paired size tiers and binds them to the approved grid tokens", () => {
  const button = fs.readFileSync("src/components/ui/button.tsx", "utf8")
  const source = ts.createSourceFile("button.tsx", button, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let sizes
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === "size" && ts.isObjectLiteralExpression(node.initializer)) sizes = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(source)
  const entries = new Map(sizes.properties.map(property => [property.name.text, property.initializer.text]))
  assert.deepEqual([...entries.keys()], ["default", "expressive", "icon", "icon-expressive"])
  const css = fs.readFileSync("src/index.css", "utf8")
  for (const [size, role, steps] of [["default", "default", 10], ["expressive", "expressive", 14]]) {
    const token = `--button-height-${role}`
    assert.ok(css.includes(`${token}: calc(var(--spacing) * ${steps});`))
    assert.ok(entries.get(size).includes(`h-(${token})`))
    assert.ok(entries.get(size === "default" ? "icon" : `icon-${size}`).includes(`size-(${token})`))
  }
  const wrapper = fs.readFileSync("src/components/ui/input-group.tsx", "utf8")
  assert.doesNotMatch(css, /--button-(height|icon|padding)-large/)
  assert.doesNotMatch(wrapper, /inputGroupButtonVariants/)
})