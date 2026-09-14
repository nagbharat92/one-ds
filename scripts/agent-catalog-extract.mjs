import fs from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"
import ts from "typescript"
import { pathToFileURL } from "node:url"

function readWorkspaceConfig(root) {
  const configPath = path.join(root, "tsconfig.app.json")
  const result = ts.readConfigFile(configPath, ts.sys.readFile)
  if (result.error) throw new Error(ts.flattenDiagnosticMessageText(result.error.messageText, "\n"))

  const parsed = ts.parseJsonConfigFileContent(result.config, ts.sys, root)
  return parsed
}

function createWorkspaceProgram(root, rootNames) {
  const parsed = readWorkspaceConfig(root)
  const options = {
    ...parsed.options,
    noEmit: true,
    rootDir: parsed.options.rootDir ?? path.join(root, "src"),
  }
  return ts.createProgram({ rootNames, options })
}

function loadSourceFile(program, filePath) {
  const sourceFile = program.getSourceFile(filePath)
  if (!sourceFile) throw new Error(`Missing source file: ${filePath}`)
  return sourceFile
}

function unwrap(expression) {
  let current = expression
  while (
    current &&
    (ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isNonNullExpression(current))
  ) {
    current = current.expression
  }
  return current
}

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

function findVariableDeclaration(sourceFile, name) {
  let found = null
  function visit(node) {
    if (found) return
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) {
      found = node
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}

function objectKeys(objectLiteral) {
  return objectLiteral.properties
    .map((property) => propertyName(property))
    .filter(Boolean)
}

function lineOf(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
}

function textOf(node, sourceFile) {
  return node.getText(sourceFile)
}

function typeText(checker, node, sourceFile) {
  return checker.typeToString(checker.getTypeAtLocation(node), node, ts.TypeFormatFlags.NoTruncation)
}

function literalChoicesFromType(checker, node) {
  const type = ts.isTypeNode(node)
    ? checker.getTypeFromTypeNode(node)
    : checker.getTypeAtLocation(node)
  const values = type.isUnion() ? type.types : [type]
  const choices = []
  for (const member of values) {
    if ((member.flags & ts.TypeFlags.StringLiteral) !== 0) {
      choices.push(member.value)
    } else if ((member.flags & ts.TypeFlags.NumberLiteral) !== 0) {
      choices.push(member.value)
    } else if ((member.flags & ts.TypeFlags.BooleanLiteral) !== 0) {
      choices.push(member.intrinsicName === "true")
    } else if ((member.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) !== 0) {
      // Optionality markers are not choices, but they do not make the set open.
      continue
    } else {
      // Any broad member (string, ReactNode, objects, …) means the choice set is
      // not finite: advertising a partial enumeration would be misleading.
      return null
    }
  }
  return choices.length > 0 ? [...new Set(choices)] : null
}

function extractComponentExport(program, checker, sourceFile, exportName) {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) throw new Error(`No module symbol for ${sourceFile.fileName}`)
  const exports = checker.getExportsOfModule(moduleSymbol)
  const exportedSymbol = exports.find((candidate) => candidate.getName() === exportName)
  if (!exportedSymbol) throw new Error(`Missing export ${exportName} in ${sourceFile.fileName}`)

  const symbol = exportedSymbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(exportedSymbol)
    : exportedSymbol
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
  if (!declaration) throw new Error(`Missing declaration for ${exportName}`)

  if (ts.isFunctionDeclaration(declaration) || ts.isFunctionExpression(declaration) || ts.isArrowFunction(declaration)) {
    const signature = checker.getSignaturesOfType(checker.getTypeOfSymbolAtLocation(symbol, declaration), ts.SignatureKind.Call)[0]
    const params = declaration.parameters
    const firstParam = params[0]
    const firstParamType = firstParam ? checker.getTypeAtLocation(firstParam) : null

    return {
      symbol,
      declaration,
      signature,
      firstParam,
      firstParamType,
    }
  }

  throw new Error(`Unsupported export shape for ${exportName}`)
}

function extractButtonApi(root) {
  const filePath = path.join(root, "src", "components", "ui", "button.tsx")
  const program = createWorkspaceProgram(root, [filePath])
  const checker = program.getTypeChecker()
  const sourceFile = loadSourceFile(program, filePath)
  const { declaration, firstParam, firstParamType } = extractComponentExport(program, checker, sourceFile, "Button")
  const buttonVariantsDeclaration = findVariableDeclaration(sourceFile, "buttonVariants")
  const buttonVariantChoices = new Map()

  if (buttonVariantsDeclaration?.initializer && ts.isCallExpression(unwrap(buttonVariantsDeclaration.initializer))) {
    const call = unwrap(buttonVariantsDeclaration.initializer)
    const config = call.arguments[1]
    if (config && ts.isObjectLiteralExpression(unwrap(config))) {
      const variantsProperty = findProperty(unwrap(config), "variants")
      if (variantsProperty && ts.isPropertyAssignment(variantsProperty) && ts.isObjectLiteralExpression(unwrap(variantsProperty.initializer))) {
        const variantsObject = unwrap(variantsProperty.initializer)
        for (const property of variantsObject.properties) {
          if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name)) continue
          const name = propertyName(property)
          const value = unwrap(property.initializer)
          if (ts.isObjectLiteralExpression(value)) {
            buttonVariantChoices.set(name, objectKeys(value))
          }
        }
      }
    }
  }

  if (!firstParam || !firstParamType) throw new Error("Button first parameter missing")

  const paramTypeText = typeText(checker, firstParam, sourceFile)
  const propNames = new Set()
  const records = []

  function addRecord(record) {
    records.push(record)
    propNames.add(record.name)
  }

  for (const member of checker.getPropertiesOfType(firstParamType)) {
    const declarations = member.getDeclarations() ?? []
    const declarationNode = declarations[0]
    if (!declarationNode) continue
    const typeNode = declarationNode.type ?? declarationNode
    const isOptional = Boolean(member.flags & ts.SymbolFlags.Optional)
    const name = member.getName()

    if (name === "variant" || name === "size" || name === "primaryColor" || name === "selected" || name === "asChild" || name === "tooltip" || name === "tooltipSide") {
      const choices = buttonVariantChoices.get(name) ?? (declarationNode.type ? literalChoicesFromType(checker, declarationNode.type) : literalChoicesFromType(checker, declarationNode))
      addRecord({
        name,
        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(member, declarationNode), declarationNode, ts.TypeFormatFlags.NoTruncation),
        required: !isOptional,
        choices,
        defaultValue: null,
        source: {
          file: path.relative(root, sourceFile.fileName),
          symbol: "Button",
          line: lineOf(sourceFile, declarationNode),
        },
        status: "owned",
      })
    }
  }

  const defaults = []
  if (ts.isFunctionDeclaration(declaration) || ts.isFunctionExpression(declaration) || ts.isArrowFunction(declaration)) {
    const param = declaration.parameters[0]
    if (param && ts.isObjectBindingPattern(param.name)) {
      for (const element of param.name.elements) {
        const name = element.name.getText(sourceFile)
        if (!propNames.has(name)) continue
        const defaultValue = element.initializer ? textOf(unwrap(element.initializer), sourceFile) : null
        defaults.push({ name, defaultValue, line: lineOf(sourceFile, element) })
      }
    }
  }

  const defaultByName = new Map(defaults.map((item) => [item.name, item]))
  const enrichedRecords = records.map((record) => ({
    ...record,
    defaultValue: defaultByName.get(record.name)?.defaultValue ?? null,
  }))

  return {
    exportName: "Button",
    sourceFile: path.relative(root, sourceFile.fileName),
    paramTypeText,
    props: enrichedRecords,
  }
}

function extractSimpleApi(root, fileRelativePath, exportName, propNames) {
  const filePath = path.join(root, fileRelativePath)
  const program = createWorkspaceProgram(root, [filePath])
  const checker = program.getTypeChecker()
  const sourceFile = loadSourceFile(program, filePath)
  const { declaration, firstParam, firstParamType } = extractComponentExport(program, checker, sourceFile, exportName)
  if (!firstParam || !firstParamType) throw new Error(`${exportName} first parameter missing`)

  const props = []
  for (const member of checker.getPropertiesOfType(firstParamType)) {
    const name = member.getName()
    if (!propNames.includes(name)) continue
    const declarations = member.getDeclarations() ?? []
    const declarationNode = declarations[0]
    if (!declarationNode) continue
    const typeNode = declarationNode.type ?? declarationNode
    props.push({
      name,
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(member, declarationNode), declarationNode, ts.TypeFormatFlags.NoTruncation),
      required: !Boolean(member.flags & ts.SymbolFlags.Optional),
      choices: declarationNode.type ? literalChoicesFromType(checker, declarationNode.type) : literalChoicesFromType(checker, typeNode),
      defaultValue: null,
      source: {
        file: path.relative(root, sourceFile.fileName),
        symbol: exportName,
        line: lineOf(sourceFile, declarationNode),
      },
      status: "owned",
    })
  }

  const defaults = []
  if (ts.isFunctionDeclaration(declaration) || ts.isFunctionExpression(declaration) || ts.isArrowFunction(declaration)) {
    const param = declaration.parameters[0]
    if (param && ts.isObjectBindingPattern(param.name)) {
      for (const element of param.name.elements) {
        const name = element.name.getText(sourceFile)
        if (!propNames.includes(name)) continue
        const defaultValue = element.initializer ? textOf(unwrap(element.initializer), sourceFile) : null
        defaults.push({ name, defaultValue })
      }
    }
  }

  const defaultByName = new Map(defaults.map((item) => [item.name, item]))
  return {
    exportName,
    sourceFile: path.relative(root, sourceFile.fileName),
    props: props.map((record) => ({
      ...record,
      defaultValue: defaultByName.get(record.name)?.defaultValue ?? null,
    })),
  }
}

function extractCardApi(root) {
  return extractSimpleApi(root, "src/components/ui/card.tsx", "Card", ["size", "variant", "hang"])
}

function extractResponseApi(root) {
  return extractSimpleApi(root, "src/components/ui/response.tsx", "Response", ["streaming"])
}

// Shared normalization so the generator, the CLI check, and the tests build
// identical API records and fingerprints from one place.
function literalValue(text) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function normalizeApiRecord(record) {
  return {
    name: record.name,
    type: record.type,
    required: record.required,
    choices: record.choices,
    default: record.defaultValue === null ? null : literalValue(record.defaultValue),
    sourceLine: record.source.line,
    status: record.status,
  }
}

function fingerprintApi(api) {
  return `sha256:${createHash("sha256").update(JSON.stringify(api)).digest("hex")}`
}

function buildGeneratedFacts(root) {
  const extractors = {
    button: extractButtonApi,
    card: extractCardApi,
    response: extractResponseApi,
  }
  const facts = {}
  for (const [slug, extract] of Object.entries(extractors)) {
    const api = extract(root).props.map(normalizeApiRecord)
    facts[slug] = { api, props: api.map((record) => record.name), fingerprint: fingerprintApi(api) }
  }
  return facts
}

// A bounded literal reader for the authored catalog data: it accepts only JSON
// value nodes so authored metadata can never smuggle executable expressions.
function literalFromNode(node) {
  const current = unwrap(node)
  if (ts.isStringLiteral(current) || ts.isNoSubstitutionTemplateLiteral(current)) {
    return current.text
  }
  if (ts.isNumericLiteral(current)) {
    return Number(current.text)
  }
  if (ts.isPrefixUnaryExpression(current) && current.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(current.operand)) {
    return -Number(current.operand.text)
  }
  if (current.kind === ts.SyntaxKind.TrueKeyword) return true
  if (current.kind === ts.SyntaxKind.FalseKeyword) return false
  if (current.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isArrayLiteralExpression(current)) {
    return current.elements.map((element) => literalFromNode(element))
  }
  if (ts.isObjectLiteralExpression(current)) {
    const result = {}
    for (const property of current.properties) {
      if (!ts.isPropertyAssignment(property)) {
        throw new Error("Authored catalog data allows only plain property assignments")
      }
      const name = propertyName(property)
      if (name === null) throw new Error("Authored catalog data property names must be identifiers or strings")
      result[name] = literalFromNode(property.initializer)
    }
    return result
  }
  throw new Error(`Authored catalog data allows only JSON literals, saw ${ts.SyntaxKind[current.kind]}`)
}

function readAuthoredData(root) {
  const filePath = path.join(root, "src", "showcase", "agent-catalog-data.ts")
  const sourceText = fs.readFileSync(filePath, "utf8")
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true)
  const declaration = findVariableDeclaration(sourceFile, "agentCatalogEntriesData")
  if (!declaration?.initializer) throw new Error("Missing agentCatalogEntriesData in authored catalog data")
  const value = literalFromNode(declaration.initializer)
  if (!Array.isArray(value)) throw new Error("agentCatalogEntriesData must be an array")
  return value
}

function buildCatalog(root, exampleCode) {
  const facts = buildGeneratedFacts(root)
  const authored = readAuthoredData(root)
  const data = authored.map((entry) => {
    const key = `${entry.slug}:${entry.defaultExampleName}`
    const code = exampleCode.get(key)
    if (!code) {
      throw new Error(`Missing showcase example ${key}. Check defaultExampleName in agent-catalog-data.ts`)
    }
    return { ...entry, code }
  })
  const components = authored.map((entry) => {
    const generated = facts[entry.slug]
    return generated
      ? { ...entry, props: [...generated.props], api: [...generated.api], fingerprint: generated.fingerprint }
      : entry
  })
  const manifest = {
    title: "OneDS agent catalog",
    description: "Compact retrieval index for the first pilot components.",
    components,
  }
  return { facts, data, manifest }
}

function serializeFactsModule(facts) {
  return `export const agentCatalogGeneratedFacts = ${JSON.stringify(facts, null, 2)} as const\n`
}

export {
  buildCatalog,
  buildGeneratedFacts,
  createWorkspaceProgram,
  extractCardApi,
  extractButtonApi,
  extractComponentExport,
  extractResponseApi,
  fingerprintApi,
  findProperty,
  normalizeApiRecord,
  propertyName,
  readAuthoredData,
  readWorkspaceConfig,
  serializeFactsModule,
  unwrap,
}

if (import.meta.url === pathToFileUrl(process.argv[1] ?? "")) {
  const root = process.cwd()
  const result = {
    button: extractButtonApi(root),
    card: extractCardApi(root),
    response: extractResponseApi(root),
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

function pathToFileUrl(filePath) {
  return pathToFileURL(path.resolve(filePath)).href
}