import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import vm from "node:vm"
import test from "node:test"
import ts from "typescript"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`])
const adapterPath = "src/components/ui/icon-adapters/material.tsx"
const geometricOwners = new Set([adapterPath, "src/components/ui/annotation.tsx", "src/components/ui/coachmark.tsx", "src/components/ui/shape.tsx"])
const forbidden = /hugeicons|lucide|phosphor|@tabler\/icons|@heroicons|@radix-ui\/react-icons|@fluentui\/react-icons|@remixicon|iconoir|react-icons\/|@mui\/icons-material/i

function checkSource(filename, text) {
  assert.doesNotMatch(text, forbidden, `${filename}: only the Material Symbols adapter is allowed`)
  const source = ts.createSourceFile(filename, text, 99, true, ts.ScriptKind.TSX)
  const visit = node => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const moduleName = node.moduleSpecifier?.text ?? ""
      if (moduleName.includes("icon-adapters/")) {
        assert.equal(filename, "src/components/ui/icons.tsx", "Consumers must use public named icons")
        assert.equal(moduleName, "@/components/ui/icon-adapters/active", "Public icons must use the active adapter")
      }
      if (moduleName.includes("assets/icons/")) assert.equal(filename, adapterPath, "Font data belongs in the adapter")
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source)
      if (tag === "svg") assert.ok(geometricOwners.has(filename), `${filename}: use Icon, not local SVG artwork`)
      if (tag === "text") assert.ok(geometricOwners.has(filename), "Use named Material icons")
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}

test("all site icons and snippets use the Material Symbols boundary", () => {
  const dependencies = JSON.parse(fs.readFileSync("package.json", "utf8"))
  assert.doesNotMatch(JSON.stringify({ ...dependencies.dependencies, ...dependencies.devDependencies }), forbidden)
  assert.equal(JSON.parse(fs.readFileSync("components.json", "utf8")).iconLibrary, "material-symbols")
  assert.equal(fs.readFileSync("src/components/ui/icon-adapters/active.ts", "utf8").trim(), 'export * from "./material"')
  for (const file of walk("src").filter(file => /\.tsx?$/.test(file))) checkSource(file, fs.readFileSync(file, "utf8"))
  const generated = ts.createSourceFile("snippets.ts", fs.readFileSync("src/showcase/generated-example-code.ts", "utf8"), 99, true)
  const snippets = generated.statements.find(ts.isVariableStatement).declarationList.declarations[0].initializer.properties
  for (const snippet of snippets) checkSource(`snippet:${snippet.name.text}`, snippet.initializer.text)
})

test("icon policy rejects other packages and local SVGs", () => {
  for (const text of [
    'import { Search } from "lucide-react"',
    'import { SearchIcon } from "@mui/icons-material"',
    'import { SearchIcon } from "@/components/ui/icon-adapters/active"',
    'export const LocalIcon = () => <svg><path d="M0 0" /></svg>',
  ]) assert.throws(() => checkSource("src/example.tsx", text))
})

test("Material mappings are covered by the local variable font subset", () => {
  const source = ts.createSourceFile("material.tsx", fs.readFileSync(adapterPath, "utf8"), 99, true, ts.ScriptKind.TSX)
  const manifest = JSON.parse(fs.readFileSync("src/assets/icons/material-symbols.json", "utf8"))
  const font = fs.readFileSync("src/assets/icons/material-symbols-rounded.woff2")
  assert.equal(font.toString("ascii", 0, 4), "wOF2")
  assert.match(new URL(manifest.source).searchParams.get("family"), /FILL.*0\.\.1/)
  const definitions = new Map()
  for (const statement of source.statements) {
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) definitions.set(declaration.name.text, declaration.initializer)
  }
  const resolve = name => {
    const definition = definitions.get(name)
    return ts.isIdentifier(definition) ? resolve(definition.text) : definition.arguments[0].text
  }
  const symbols = [...new Set([...definitions.keys()].map(resolve))].sort()
  assert.deepEqual(symbols, Object.keys(manifest.symbols).sort(), "Run npm run icons:update-font when adding glyphs")
  for (const codepoint of Object.values(manifest.symbols)) assert.match(codepoint, /^[a-f0-9]+$/i)
  for (const [name, expected] of Object.entries({
    RefreshIcon: "refresh", RefreshCwIcon: "refresh", RotateCcwIcon: "refresh", RotateCwIcon: "refresh",
    MoonIcon: "dark_mode", PencilIcon: "edit", PencilLineIcon: "edit", EditIcon: "edit",
    EyeIcon: "visibility", ViewIcon: "visibility", BookmarkIcon: "bookmark",
    PaperclipIcon: "attach_file", AttachmentIcon: "attach_file",
    GlobeIcon: "language", InternetIcon: "language",
    PanelLeftIcon: "dock_to_right", SortIcon: "sort",
  })) assert.equal(resolve(name), expected, name)
})

function loadIcons(replacement) {
  const require = createRequire(import.meta.url)
  const cache = new Map()
  const dependencies = new Set()
  const load = filename => {
    if (replacement && filename === path.resolve("src/components/ui/icon-adapters/active.ts")) return replacement
    if (filename.endsWith(".json")) return JSON.parse(fs.readFileSync(filename, "utf8"))
    if (cache.has(filename)) return cache.get(filename).exports
    const module = { exports: {} }
    cache.set(filename, module)
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    }).outputText
    const importModule = specifier => {
      dependencies.add(specifier)
      if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return require(specifier)
      const base = specifier.startsWith("@/") ? path.resolve("src", specifier.slice(2)) : path.resolve(path.dirname(filename), specifier)
      const resolved = [base, `${base}.ts`, `${base}.tsx`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
      assert.ok(resolved, `Missing module ${specifier}`)
      return load(resolved)
    }
    new vm.Script(`(function(require, module, exports) { ${code}\n })`, { filename }).runInThisContext()(importModule, module, module.exports)
    return module.exports
  }
  return { icons: load(path.resolve("src/components/ui/icons.tsx")), dependencies }
}

test("public icons preserve semantics with Material and an alternate SVG adapter", () => {
  const current = loadIcons()
  function TestGlyph(props) {
    return createElement("svg", { ...props, viewBox: "0 0 16 16", "data-test-adapter": true }, createElement("circle", { cx: 8, cy: 8, r: 6 }))
  }
  const alternate = loadIcons(Object.fromEntries(Object.keys(current.icons).map(name => [name, TestGlyph])))
  assert.ok(current.dependencies.has("@/assets/icons/material-symbols.json"))
  assert.ok(!alternate.dependencies.has("@/assets/icons/material-symbols.json"))
  for (const library of [current.icons, alternate.icons]) {
    for (const Icon of Object.values(library)) {
      const markup = renderToStaticMarkup(createElement(Icon, { size: 24, label: "Action" }))
      assert.equal((markup.match(/<svg\b/g) ?? []).length, 1)
      assert.match(markup, /data-size="24"/)
      assert.match(markup, /aria-label="Action"/)
      assert.match(markup, /role="img"/)
      assert.doesNotMatch(markup.match(/<svg\b[^>]*>/)[0], /aria-hidden="true"/)
    }
    const decorative = renderToStaticMarkup(createElement(library.SearchIcon))
    assert.match(renderToStaticMarkup(createElement(library.SearchIcon, { filled: true })), /data-filled="true"/)
    assert.match(renderToStaticMarkup(createElement(library.SearchIcon, { filled: false })), /data-filled="false"/)
    assert.match(decorative, /aria-hidden="true"/)
    assert.match(decorative, /data-size="auto"/)
    const status = renderToStaticMarkup(createElement(library.LoaderIcon, { role: "status", "aria-label": "Loading", "data-slot": "spinner" }))
    assert.match(status, /role="status"/)
    assert.match(status, /data-slot="spinner"/)
    assert.doesNotMatch(status.match(/<svg\b[^>]*>/)[0], /aria-hidden="true"/)
  }
  assert.match(renderToStaticMarkup(createElement(alternate.icons.SearchIcon)), /viewBox="0 0 16 16"/)
})