import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const root = process.cwd()
const manifestPath = path.join(root, "public", "agent-catalog.json")
const factsPath = path.join(root, "public", "agent-catalog-generated.json")
const factsModulePath = path.join(root, "src", "showcase", "agent-catalog-generated.ts")
const dataPath = path.join(root, "public", "agent-catalog-data.json")
const extractPath = path.join(root, "scripts", "agent-catalog-extract.mjs")

function loadManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"))
}

async function loadData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"))
}

async function loadExtractor() {
  return import(pathToFileURL(extractPath).href)
}

function formatEntry(entry) {
  const apiLines = entry.api.map((prop) => {
    const defaultText = prop.default === null ? "none" : JSON.stringify(prop.default)
    const choicesText = prop.choices?.length ? prop.choices.map((choice) => JSON.stringify(choice)).join(", ") : "not enumerated"
    return `  ${prop.name} · required=${prop.required ? "yes" : "no"} · default=${defaultText} · choices=${choicesText} · type=${prop.type} · line=${prop.sourceLine}`
  })

  return [
    `${entry.slug}: ${entry.name}`,
    `  description: ${entry.description}`,
    `  usage: ${entry.readFirst}`,
    `  fingerprint: ${entry.fingerprint}`,
    `  default example: ${entry.defaultExampleName}`,
    `  route: ${entry.route}`,
    `  props: ${entry.props.join(", ")}`,
    ...apiLines,
  ].join("\n")
}

async function listCommand() {
  const { components } = loadManifest()
  for (const entry of components) {
    console.log(`${entry.slug}\t${entry.fingerprint}\t${entry.props.length} props`)
  }
}

async function showCommand(slug) {
  const { components } = loadManifest()
  const entry = components.find((item) => item.slug === slug)
  if (!entry) throw new Error(`Unknown catalog slug: ${slug}`)
  console.log(formatEntry(entry))
}

async function exampleCommand(slug) {
  const { components } = loadManifest()
  const entry = components.find((item) => item.slug === slug)
  if (!entry) throw new Error(`Unknown catalog slug: ${slug}`)
  const data = await loadData()
  const source = data.find((item) => item.slug === slug)
  const code = source?.code
  if (!code) {
    throw new Error(`No retrievable example for ${slug}. Run npm run catalog:generate`)
  }
  console.log(`Default example for ${entry.name}: ${entry.defaultExampleName}`)
  console.log(code)
}

async function checkCommand() {
  const { buildCatalog, serializeFactsModule } = await loadExtractor()
  const { collectShowcaseCode } = await import(pathToFileURL(path.join(root, "scripts", "generate-showcase-code.mjs")).href)
  const { facts, data, manifest } = buildCatalog(root, collectShowcaseCode(root))

  const owned = [
    [manifestPath, `${JSON.stringify(manifest, null, 2)}\n`],
    [factsPath, `${JSON.stringify(facts, null, 2)}\n`],
    [factsModulePath, serializeFactsModule(facts)],
    [dataPath, `${JSON.stringify(data, null, 2)}\n`],
  ]

  for (const [filePath, expected] of owned) {
    const actual = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null
    if (actual !== expected) {
      throw new Error(
        `Catalog artifact out of sync: ${path.relative(root, filePath)}. Run npm run catalog:generate`,
      )
    }
  }

  console.log(`Catalog is fresh (${manifest.components.length} components).`)
}

async function main() {
  const [command, arg] = process.argv.slice(2)

  if (!command || command === "help") {
    console.log("Usage: node scripts/agent-catalog-cli.mjs <list|show|example|check> [slug]")
    process.exitCode = 1
    return
  }

  if (command === "list") {
    await listCommand()
    return
  }

  if (command === "show") {
    if (!arg) throw new Error("show requires a slug")
    await showCommand(arg)
    return
  }

  if (command === "example") {
    if (!arg) throw new Error("example requires a slug")
    await exampleCommand(arg)
    return
  }

  if (command === "check") {
    await checkCommand()
    return
  }

  throw new Error(`Unknown command: ${command}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})