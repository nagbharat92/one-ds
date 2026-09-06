import assert from "node:assert/strict"
import test from "node:test"
import ts from "typescript"
import { completeDemoSource } from "./showcase-code-source.mjs"

function extract(source) {
  const filename = "/project/src/showcase/demos/fixture.tsx"
  const options = { jsx: ts.JsxEmit.ReactJSX, noLib: true, noResolve: true }
  const host = ts.createCompilerHost(options)
  host.getSourceFile = (name, version) => name === filename ? ts.createSourceFile(name, source, version, true, ts.ScriptKind.TSX) : undefined
  const program = ts.createProgram([filename], options, host)
  const file = program.getSourceFile(filename)
  const entry = file.statements.find(statement => ts.isVariableStatement(statement) && statement.declarationList.declarations[0].name.getText(file) === "entry")
  const expression = entry.declarationList.declarations[0].initializer.properties[0].initializer
  return completeDemoSource(expression, file, program.getTypeChecker(), "/project")
}

test("includes transitive helpers, typed constants, and only used imports", () => {
  const code = extract(`
    import { useState, useEffect } from "react"
    import type { Target } from "@/components/ui/measurements"
    import { Card } from "@/components/ui/card"
    const targets: Target[] = []
    const unrelated = 123
    function Specimen() { const [saved] = useState(false); return <Card>{saved ? targets.length : 0}</Card> }
    function Preview() { return <Specimen /> }
    const entry = { Demo: Preview }
  `)
  assert.match(code, /import \{ useState \} from "react"/)
  assert.match(code, /import type \{ Target \}/)
  assert.match(code, /const targets: Target\[\]/)
  assert.match(code, /function Specimen/)
  assert.match(code, /export function Preview/)
  assert.doesNotMatch(code, /useEffect|unrelated|const entry/)
})

test("respects local shadowing and follows shorthand references", () => {
  const code = extract(`
    const label = "kept"
    const count = 99
    function Preview() { const count = 1; const item = { label }; return <span>{item.label}{count}</span> }
    const entry = { Demo: Preview }
  `)
  assert.match(code, /const label = "kept"/)
  assert.doesNotMatch(code, /99/)
})

test("preserves aliases and side-effect imports and relocates local assets", () => {
  const code = extract(`
    import * as React from "react"
    import { Card as Surface, CardTitle } from "@/components/ui/card"
    import image from "../../assets/example.png"
    import "../../index.css"
    const Preview = () => { const [value] = React.useState(image); return <Surface>{value}</Surface> }
    const entry = { Demo: Preview }
  `)
  assert.match(code, /import \* as React/)
  assert.match(code, /Card as Surface/)
  assert.doesNotMatch(code, /CardTitle/)
  assert.match(code, /"@\/assets\/example.png"/)
  assert.match(code, /"@\/index.css"/)
  assert.match(code, /export const Preview/)
})

test("handles inline demos and recursive helpers without duplicating declarations", () => {
  const code = extract(`
    function recurse(value: number): number { return value ? recurse(value - 1) : 0 }
    const entry = { Demo: () => <span>{recurse(2)}</span> }
  `)
  assert.equal(code.match(/function recurse/g).length, 1)
  assert.match(code, /export const Demo/)
})