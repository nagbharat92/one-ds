import assert from "node:assert/strict"
import fs from "node:fs/promises"
import ts from "typescript"

const adapter = "src/components/ui/icon-adapters/material.tsx"
const source = ts.createSourceFile(adapter, await fs.readFile(adapter, "utf8"), 99, true, ts.ScriptKind.TSX)
const symbols = new Set()
const visit = node => {
  if (ts.isCallExpression(node) && node.expression.getText(source) === "createGlyph" && ts.isStringLiteral(node.arguments[0])) symbols.add(node.arguments[0].text)
  ts.forEachChild(node, visit)
}
visit(source)
const names = [...symbols].sort()
const fetchChecked = async url => {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36" } })
  assert.ok(response.ok, `${response.status}: ${url}`)
  return response
}
const codepointsURL = "https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsRounded%5BFILL,GRAD,opsz,wght%5D.codepoints"
const codepoints = new Map((await (await fetchChecked(codepointsURL)).text()).trim().split("\n").map(line => line.trim().split(/\s+/)))
for (const name of names) assert.ok(codepoints.has(name), `Unknown Material symbol: ${name}`)
const cssURL = new URL("https://fonts.googleapis.com/css2")
cssURL.searchParams.set("family", "Material Symbols Rounded:opsz,wght,FILL,GRAD@20..48,400,0..1,0")
cssURL.searchParams.set("icon_names", names.join(","))
cssURL.searchParams.set("display", "block")
const css = await (await fetchChecked(cssURL)).text()
const fontURL = css.match(/src:\s*url\(([^)]+)\)/)?.[1]
assert.ok(fontURL?.startsWith("https://fonts.gstatic.com/"), "Missing official font URL")
const font = Buffer.from(await (await fetchChecked(fontURL)).arrayBuffer())
assert.equal(font.toString("ascii", 0, 4), "wOF2", "Expected WOFF2")
await fs.mkdir("src/assets/icons", { recursive: true })
await fs.writeFile("src/assets/icons/material-symbols-rounded.woff2", font)
await fs.writeFile("src/assets/icons/material-symbols.json", JSON.stringify({ source: cssURL.href, symbols: Object.fromEntries(names.map(name => [name, codepoints.get(name)])) }, null, 2) + "\n")
await fs.writeFile("src/assets/icons/LICENSE.txt", await (await fetchChecked("https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE")).text())
console.log(`Downloaded ${names.length} Material Symbols with variable FILL and optical size (${font.length} bytes).`)