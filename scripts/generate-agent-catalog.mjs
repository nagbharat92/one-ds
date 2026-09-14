import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const root = process.cwd()
const generatedFactsPath = path.join(root, "src", "showcase", "agent-catalog-generated.ts")
const generatedFactsJsonPath = path.join(root, "public", "agent-catalog-generated.json")
const dataJsonPath = path.join(root, "public", "agent-catalog-data.json")
const outputPath = path.join(root, "public", "agent-catalog.json")

const { buildCatalog, serializeFactsModule } = await import(pathToFileURL(path.join(root, "scripts", "agent-catalog-extract.mjs")).href)
const { collectShowcaseCode } = await import(pathToFileURL(path.join(root, "scripts", "generate-showcase-code.mjs")).href)

const { facts, data, manifest } = buildCatalog(root, collectShowcaseCode(root))

fs.writeFileSync(generatedFactsPath, serializeFactsModule(facts))
fs.writeFileSync(generatedFactsJsonPath, `${JSON.stringify(facts, null, 2)}\n`)
fs.writeFileSync(dataJsonPath, `${JSON.stringify(data, null, 2)}\n`)
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Generated agent catalog manifest with ${manifest.components.length} components.`)
