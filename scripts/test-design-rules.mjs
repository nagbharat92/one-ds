import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import ts from "typescript"

const rules = JSON.parse(fs.readFileSync("src/design-system/rules.json", "utf8"))

test("optical label correction is shared, tokenized, and explicitly directional", () => {
  const css = fs.readFileSync("src/index.css", "utf8")
  assert.ok(css.includes("--icon-label-optical-padding: var(--spacing);"))
  assert.ok(css.includes("--graphic-label-gap: calc(var(--spacing) * 2);"))
  assert.ok(css.includes("--button-gap: var(--graphic-label-gap);"))
  assert.ok(css.includes("padding-inline-start: var(--icon-label-optical-padding);"))
  assert.ok(css.includes("padding-inline-end: var(--icon-label-optical-padding);"))
  assert.ok(css.includes('[data-slot="spinner"]'))
  const button = fs.readFileSync("src/components/ui/button.tsx", "utf8")
  assert.match(button, /withIconLabels/)
  assert.match(button, /data-icon-label-host/)
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
  assert.deepEqual(variants.properties.map(property => property.name.text), ["default", "secondary", "ghost", "destructive", "link"])
  for (const filename of ts.sys.readDirectory("src", [".tsx"])) {
    assert.doesNotMatch(fs.readFileSync(filename, "utf8"), /<Button\b[^>]*\bvariant="outline"/s, filename)
  }
  assert.equal(rules.rules.find(rule => rule.id === "controls.supporting-actions").status, "approved")
})

test("showcase exposes only default and application surface tiers", () => {
  const source = fs.readFileSync("src/showcase/types.ts", "utf8")
  assert.match(source, /surface\?: "default" \| "application"/)
  const app = fs.readFileSync("src/App.tsx", "utf8")
  assert.match(app, /default: "app"/)
  assert.match(app, /default: "viewport"/)
  assert.match(app, /layout = "viewport"/)
  assert.doesNotMatch(app, /component: "docs"|medium: "app"/)
  const rule = rules.rules.find(rule => rule.id === "showcase.surface-scale")
  assert.equal(rule.status, "approved")
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