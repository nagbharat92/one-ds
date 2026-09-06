import path from "node:path"
import ts from "typescript"

export function completeDemoSource(expression, sourceFile, checker, root) {
  const declarations = new Map()
  const imports = new Map()
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause
      const bindings = clause?.namedBindings
      const names = [clause?.name, ...(bindings && ts.isNamedImports(bindings)
        ? bindings.elements.map(element => element.name)
        : bindings ? [bindings.name] : [])].filter(Boolean)
      for (const name of names) imports.set(checker.getSymbolAtLocation(name), { statement, name })
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) declarations.set(checker.getSymbolAtLocation(declaration.name), { statement, declaration })
      }
    } else if (statement.name && ts.isIdentifier(statement.name)) {
      declarations.set(checker.getSymbolAtLocation(statement.name), { statement, declaration: statement })
    }
  }

  const usedDeclarations = new Set()
  const usedImports = new Set()
  const includeSymbol = (symbol) => {
    if (!symbol) return
    if (imports.has(symbol)) usedImports.add(symbol)
    const entry = declarations.get(symbol)
    if (entry && !usedDeclarations.has(entry.declaration)) {
      usedDeclarations.add(entry.declaration)
      visit(entry.declaration)
    }
  }
  const visit = (node) => {
    if (ts.isIdentifier(node)) includeSymbol(checker.getSymbolAtLocation(node))
    if (ts.isShorthandPropertyAssignment(node)) includeSymbol(checker.getShorthandAssignmentValueSymbol(node))
    ts.forEachChild(node, visit)
  }
  visit(expression)
  const demoSymbol = ts.isIdentifier(expression) ? checker.getSymbolAtLocation(expression) : undefined
  const demoDeclaration = declarations.get(demoSymbol)?.declaration
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const factory = ts.factory
  const exportModifiers = (modifiers) => [
    ...(modifiers ?? []).filter(modifier => modifier.kind !== ts.SyntaxKind.ExportKeyword && modifier.kind !== ts.SyntaxKind.DefaultKeyword),
    factory.createModifier(ts.SyntaxKind.ExportKeyword),
  ]
  const moduleSpecifier = (statement) => {
    const specifier = statement.moduleSpecifier.text
    if (!specifier.startsWith(".")) return statement.moduleSpecifier
    const absolute = path.resolve(path.dirname(sourceFile.fileName), specifier)
    const relative = path.relative(path.join(root, "src"), absolute)
    if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Cannot relocate import outside src: ${specifier}`)
    return factory.createStringLiteral(`@/${relative.split(path.sep).join("/")}`)
  }
  const output = []
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      if (!statement.importClause) {
        output.push(factory.updateImportDeclaration(statement, statement.modifiers, undefined, moduleSpecifier(statement), statement.attributes))
        continue
      }
      const clause = statement.importClause
      const needed = (name) => name && usedImports.has(checker.getSymbolAtLocation(name))
      const defaultName = needed(clause.name) ? clause.name : undefined
      let bindings = clause.namedBindings
      if (bindings && ts.isNamedImports(bindings)) {
        const elements = bindings.elements.filter(element => needed(element.name))
        bindings = elements.length ? factory.updateNamedImports(bindings, elements) : undefined
      } else if (bindings && !needed(bindings.name)) bindings = undefined
      if (!defaultName && !bindings) continue
      output.push(factory.updateImportDeclaration(statement, statement.modifiers,
        factory.updateImportClause(clause, clause.isTypeOnly, defaultName, bindings), moduleSpecifier(statement), statement.attributes))
    } else if (ts.isVariableStatement(statement)) {
      const selected = statement.declarationList.declarations.filter(declaration => usedDeclarations.has(declaration))
      for (const declaration of selected) {
        output.push(factory.updateVariableStatement(statement,
          declaration === demoDeclaration ? exportModifiers(statement.modifiers) : statement.modifiers,
          factory.updateVariableDeclarationList(statement.declarationList, [declaration])))
      }
    } else if (usedDeclarations.has(statement)) {
      output.push(statement === demoDeclaration
        ? factory.replaceModifiers(statement, exportModifiers(statement.modifiers))
        : statement)
    }
  }
  if (!demoDeclaration) {
    output.push(factory.createVariableStatement([factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList([factory.createVariableDeclaration("Demo", undefined, undefined, expression)], ts.NodeFlags.Const)))
  }
  return output.map(node => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)).join("\n\n")
}