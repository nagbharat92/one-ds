import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

/* Skips the three generate-* scripts when none of their inputs changed since
 * the last successful run, so `npm run dev` starts instantly on a warm tree.
 * The generators derive purely from src/ and scripts/, so a fingerprint over
 * those inputs is sufficient; any source edit invalidates the cache and forces
 * a regenerate. Generated files are excluded so a run never invalidates itself. */

const root = process.cwd()
const cacheFile = path.join(root, "node_modules", ".cache", "oneds-generate.json")

// Inputs the generators read. Generated outputs under these roots are excluded.
const inputRoots = ["src", "scripts"]
const excluded = new Set(
  [
    "src/showcase/generated-example-code.ts",
    "src/showcase/agent-catalog-generated.ts",
  ].map(rel => path.join(root, rel)),
)

// Key outputs whose absence must force a regenerate even on a cache hit.
const requiredOutputs = [
  "src/showcase/generated-example-code.ts",
  "public/agent-catalog.json",
  "public/design-rules.md",
].map(rel => path.join(root, rel))

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (!excluded.has(full)) files.push(full)
  }
  return files
}

function fingerprint() {
  const hash = createHash("sha1")
  for (const rootName of inputRoots) {
    const dir = path.join(root, rootName)
    if (!fs.existsSync(dir)) continue
    for (const file of walk(dir).sort()) {
      const stat = fs.statSync(file)
      hash.update(`${path.relative(root, file)}:${stat.size}:${stat.mtimeMs}\n`)
    }
  }
  return hash.digest("hex")
}

const current = fingerprint()
const outputsPresent = requiredOutputs.every(fs.existsSync)
const cached = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")).fingerprint : null

if (cached === current && outputsPresent) {
  console.log("Generated artifacts up to date — skipping regeneration.")
  process.exit(0)
}

execFileSync("node", ["scripts/generate-design-rules.mjs"], { stdio: "inherit" })
execFileSync("node", ["scripts/generate-showcase-code.mjs"], { stdio: "inherit" })
execFileSync("node", ["--experimental-strip-types", "scripts/generate-agent-catalog.mjs"], { stdio: "inherit" })

// Fingerprint again after generation so the cache reflects any inputs the
// generators themselves rewrote in place (kept out of the excluded set).
fs.mkdirSync(path.dirname(cacheFile), { recursive: true })
fs.writeFileSync(cacheFile, `${JSON.stringify({ fingerprint: fingerprint() }, null, 2)}\n`)
