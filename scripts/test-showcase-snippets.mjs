import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import ts from "typescript"

test("Preview Tools, Toolbar, and Button snippets compile as separate modules against the design system", () => {
  const root = process.cwd()
  const generatedPath = path.join(root, "src/showcase/generated-example-code.ts")
  const source = ts.createSourceFile(generatedPath, fs.readFileSync(generatedPath, "utf8"), ts.ScriptTarget.Latest, true)
  const declaration = source.statements.find(ts.isVariableStatement).declarationList.declarations[0]
  const snippets = new Map(declaration.initializer.properties.map(property => [property.name.text, property.initializer.text]))
  const keys = ["concentric:Space and Shape", "concentric:Type and Controls", "concentric:Vertical Card", "concentric:Edit Project", "annotation:Default", "annotation:Dimensions", "annotation:Corners", "canvas:Default", "cursor-follower:Default",
    "toolbar:Default", "toolbar:Variants", "toolbar:Text formatting", "toolbar:Vertical", "toolbar:With title",
    "button:Default", "button:Sizes", "button:Icon Only", "button:With Icon", "button:Favicon", "button:Favicon Sizes", "button:Rounded", "button:Loading", "button:As Child",
    "text:Default", "table-of-contents:Default", "button:Icon Tools", "button:Mixed Tools", "button:Optical Spacing", "icon-label:Default"]
  const virtualFiles = new Map(keys.map(key => {
    const snippet = snippets.get(key)
    assert.ok(snippet, `Missing generated example: ${key}`)
    assert.match(snippet, /export (function|const) /, `Missing exported demo: ${key}`)
    assert.doesNotMatch(snippet, /generatedExampleCode|@\/showcase\//, `Example depends on showcase internals: ${key}`)
    return [path.join(root, "src/__snippet_checks__", `${key.replaceAll(":", "-")}.tsx`), snippet]
  }))
  assert.match(snippets.get("annotation:Dimensions"), /const dimensionTargets: AnnotationMeasurementTarget\[\]/)
  assert.match(snippets.get("annotation:Dimensions"), /function AnnotationDimensionsSpecimen/)
  assert.match(snippets.get("cursor-follower:Default"), /ButtonGroupChoice/)
  assert.match(snippets.get("canvas:Default"), /Upgrade to Pro/)
  assert.match(snippets.get("toolbar:Default"), /function ToolbarPreview/)
  assert.match(snippets.get("toolbar:Variants"), /const toolbarVariantMeasurementTargets/)
  assert.match(snippets.get("toolbar:Vertical"), /orientation="vertical"/)
  for (const key of keys.filter(key => key.startsWith("button:") && !key.endsWith("Tools"))) {
    assert.match(snippets.get(key), /expressive/, `Missing expressive size: ${key}`)
  }
  assert.match(snippets.get("button:Loading"), /function ButtonLoadingDemo/)
  assert.match(snippets.get("button:Mixed Tools"), /function ButtonToolsDemo/)

  const configPath = path.join(root, "tsconfig.app.json")
  const config = ts.readConfigFile(configPath, ts.sys.readFile)
  assert.equal(config.error, undefined)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const options = { ...parsed.options, noEmit: true }
  delete options.tsBuildInfoFile
  const host = ts.createCompilerHost(options)
  const originalGetSourceFile = host.getSourceFile.bind(host)
  const originalFileExists = host.fileExists.bind(host)
  const originalReadFile = host.readFile.bind(host)
  host.fileExists = filename => virtualFiles.has(filename) || originalFileExists(filename)
  host.readFile = filename => virtualFiles.get(filename) ?? originalReadFile(filename)
  host.getSourceFile = (filename, languageVersion, onError, shouldCreateNewSourceFile) => virtualFiles.has(filename)
    ? ts.createSourceFile(filename, virtualFiles.get(filename), languageVersion, true, ts.ScriptKind.TSX)
    : originalGetSourceFile(filename, languageVersion, onError, shouldCreateNewSourceFile)
  const program = ts.createProgram([...virtualFiles.keys()], options, host)
  const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)]
  const report = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: filename => filename,
    getCurrentDirectory: () => root,
    getNewLine: () => "\n",
  })
  assert.equal(diagnostics.length, 0, report)
})