import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { completeDemoSource } from "./showcase-code-source.mjs"

const root = process.cwd()
const sourceDirectories = ["demos", "experiments"].map(directory => path.join(root, "src", "showcase", directory))
const outputPath = path.join(root, "src", "showcase", "generated-example-code.ts")

function propertyName(property) {
  if (!property.name) return null
  if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) {
    return property.name.text
  }
  return null
}

function findProperty(object, name) {
  return object.properties.find((property) => propertyName(property) === name)
}

function unwrap(expression) {
  let current = expression
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression
  }
  return current
}

function stringValue(property) {
  if (!property || !ts.isPropertyAssignment(property)) return null
  const value = unwrap(property.initializer)
  return ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)
    ? value.text
    : null
}

function declarationSource(name, declarations, sourceFile) {
  const declaration = declarations.get(name)
  if (!declaration) return null

  if (ts.isFunctionDeclaration(declaration)) {
    return declaration.getText(sourceFile)
  }

  if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
    return `const ${name} = ${declaration.initializer.getText(sourceFile)}`
  }

  return null
}

function demoSource(expression, declarations, sourceFile) {
  const demo = unwrap(expression)

  if (ts.isIdentifier(demo)) {
    return declarationSource(demo.text, declarations, sourceFile)
  }

  if (ts.isFunctionExpression(demo)) {
    return demo.getText(sourceFile)
  }

  if (ts.isArrowFunction(demo)) {
    const body = unwrap(demo.body)
    if (
      ts.isJsxSelfClosingElement(body) &&
      ts.isIdentifier(body.tagName) &&
      body.attributes.properties.length === 0
    ) {
      const referenced = declarationSource(
        body.tagName.text,
        declarations,
        sourceFile,
      )
      if (referenced) return referenced
    }
    return `const Demo = ${demo.getText(sourceFile)}`
  }

  return demo.getText(sourceFile)
}

const files = sourceDirectories
  .flatMap(directory => fs.readdirSync(directory).filter(file => file.endsWith(".tsx")).map(file => path.join(directory, file)))
  .sort()

const generated = new Map()
const program = ts.createProgram(files, {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.Latest,
  noResolve: true,
  noLib: true,
})
const checker = program.getTypeChecker()

for (const file of files) {
  const filePath = file
  const sourceFile = program.getSourceFile(filePath)
  const declarations = new Map()

  function collectDeclarations(node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      declarations.set(node.name.text, node)
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      declarations.set(node.name.text, node)
    }
    ts.forEachChild(node, collectDeclarations)
  }
  collectDeclarations(sourceFile)

  function collectComponents(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const slug = stringValue(findProperty(node, "slug"))
      const examplesProperty = findProperty(node, "examples")
      const complete = stringValue(findProperty(node, "category")) === "Preview Tools" || stringValue(findProperty(node, "codeSource")) === "complete"
      if (slug && complete) {
        const demoProperty = findProperty(node, "Demo")
        if (!demoProperty || !ts.isPropertyAssignment(demoProperty)) throw new Error(`${file}: ${slug} needs an explicit Demo`)
        const key = `${slug}:${stringValue(findProperty(node, "defaultExampleName")) ?? "Default"}`
        if (generated.has(key)) throw new Error(`Duplicate showcase example key: ${key}`)
        generated.set(key, completeDemoSource(unwrap(demoProperty.initializer), sourceFile, checker, root))
      }

      if (
        slug &&
        examplesProperty &&
        ts.isPropertyAssignment(examplesProperty)
      ) {
        const examples = unwrap(examplesProperty.initializer)
        if (!ts.isArrayLiteralExpression(examples)) {
          throw new Error(`${file}: ${slug} examples must be an array literal`)
        }

        for (const element of examples.elements) {
          const example = unwrap(element)
          if (!ts.isObjectLiteralExpression(example)) continue

          const name = stringValue(findProperty(example, "name"))
          const demoProperty = findProperty(example, "Demo")
          if (!name || !demoProperty || !ts.isPropertyAssignment(demoProperty)) {
            throw new Error(`${file}: ${slug} has an example without name or Demo`)
          }

          const key = `${slug}:${name}`
          if (generated.has(key)) {
            throw new Error(`Duplicate showcase example key: ${key}`)
          }

          const code = complete
            ? completeDemoSource(unwrap(demoProperty.initializer), sourceFile, checker, root)
            : demoSource(demoProperty.initializer, declarations, sourceFile)
          if (!code?.trim()) {
            throw new Error(`Could not extract showcase code for ${key}`)
          }
          generated.set(key, code)
        }
      }
    }
    ts.forEachChild(node, collectComponents)
  }
  collectComponents(sourceFile)
}

const entries = [...generated.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([key, code]) => `  ${JSON.stringify(key)}: ${JSON.stringify(code)},`)
  .join("\n")

const output = `// Generated by scripts/generate-showcase-code.mjs. Do not edit.\nexport const generatedExampleCode: Readonly<Record<string, string>> = {\n${entries}\n}\n`

fs.writeFileSync(outputPath, output)
console.log(`Generated source for ${generated.size} showcase variants.`)