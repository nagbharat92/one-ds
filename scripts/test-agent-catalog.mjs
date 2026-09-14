import assert from "node:assert/strict"
import fs from "node:fs"
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import path from "node:path"
import test from "node:test"
import { pathToFileURL } from "node:url"
import os from "node:os"

const root = process.cwd()
const dataPath = path.join(root, "src", "showcase", "agent-catalog-data.ts")
const generatedFactsPath = path.join(root, "public", "agent-catalog-generated.json")
const manifestPath = path.join(root, "public", "agent-catalog.json")
const extractPath = path.join(root, "scripts", "agent-catalog-extract.mjs")

async function loadData() {
  const source = fs.readFileSync(dataPath, "utf8")
  const expression = source
    .replace(/^export const agentCatalogEntriesData = /, "")
    .replace(/\s+as const\s*$/, "")
  return Function(`"use strict"; return (${expression})`)()
}

async function loadExtractor() {
  return import(pathToFileURL(extractPath).href)
}

async function loadGeneratedFacts() {
  return JSON.parse(fs.readFileSync(generatedFactsPath, "utf8"))
}

function createFixtureRoot() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "oneds-agent-catalog-"))
  fs.cpSync(path.join(root, "src"), path.join(fixtureRoot, "src"), { recursive: true })
  fs.cpSync(path.join(root, "scripts"), path.join(fixtureRoot, "scripts"), { recursive: true })
  fs.cpSync(path.join(root, "public"), path.join(fixtureRoot, "public"), { recursive: true })
  fs.copyFileSync(path.join(root, "tsconfig.app.json"), path.join(fixtureRoot, "tsconfig.app.json"))
  fs.copyFileSync(path.join(root, "package.json"), path.join(fixtureRoot, "package.json"))
  fs.symlinkSync(path.join(root, "node_modules"), path.join(fixtureRoot, "node_modules"), "dir")
  return fixtureRoot
}

function hashTree(dir) {
  const hash = createHash("sha256")
  function walk(current, prefix) {
    for (const name of fs.readdirSync(current).sort()) {
      const full = path.join(current, name)
      const rel = `${prefix}${name}`
      if (fs.statSync(full).isDirectory()) {
        hash.update(`dir:${rel}`)
        walk(full, `${rel}/`)
      } else {
        hash.update(`file:${rel}`)
        hash.update(fs.readFileSync(full))
      }
    }
  }
  walk(dir, "")
  return hash.digest("hex")
}

function runCli(fixtureRoot, args) {
  try {
    const stdout = execFileSync("node", ["scripts/agent-catalog-cli.mjs", ...args], {
      cwd: fixtureRoot,
      encoding: "utf8",
    })
    return { code: 0, stdout, stderr: "" }
  } catch (error) {
    return {
      code: error.status ?? 1,
      stdout: error.stdout?.toString() ?? "",
      stderr: error.stderr?.toString() ?? "",
    }
  }
}

function fingerprintFor(api) {
  return `sha256:${createHash("sha256").update(JSON.stringify(api)).digest("hex")}`
}

test("Button extraction exposes owned props and defaults", async () => {
  const { extractButtonApi } = await loadExtractor()
  const button = extractButtonApi(root)

  assert.equal(button.exportName, "Button")
  assert.match(button.paramTypeText, /variant\?/)
  assert.match(button.paramTypeText, /primaryColor\?/)
  assert.match(button.paramTypeText, /tooltipSide\?/)

  const names = button.props.map((prop) => prop.name)
  assert.deepEqual(names.sort(), ["asChild", "primaryColor", "selected", "size", "tooltip", "tooltipSide", "variant"])

  const byName = Object.fromEntries(button.props.map((prop) => [prop.name, prop]))
  assert.deepEqual(byName.variant.choices.sort(), ["default", "destructive", "ghost", "link", "primary", "secondary", "tertiary"])
  assert.deepEqual(byName.size.choices.sort(), ["default", "expressive", "icon", "icon-expressive"])
  assert.deepEqual(byName.primaryColor.choices.sort(), ["pink", "purple"])
  assert.equal(byName.variant.defaultValue, '"tertiary"')
  assert.equal(byName.primaryColor.defaultValue, '"purple"')
  assert.equal(byName.size.defaultValue, '"default"')
})

test("generated Button facts match the extractor", async () => {
  const { extractButtonApi, extractCardApi, extractResponseApi } = await loadExtractor()
  const generatedFacts = await loadGeneratedFacts()
  const button = extractButtonApi(root)
  const card = extractCardApi(root)
  const response = extractResponseApi(root)

  assert.deepEqual(generatedFacts.button.props, button.props.map((prop) => prop.name))
  assert.deepEqual(generatedFacts.card.props, card.props.map((prop) => prop.name))
  assert.deepEqual(generatedFacts.response.props, response.props.map((prop) => prop.name))
  assert.equal(generatedFacts.button.fingerprint, fingerprintFor(generatedFacts.button.api))
  assert.equal(generatedFacts.card.fingerprint, fingerprintFor(generatedFacts.card.api))
  assert.equal(generatedFacts.response.fingerprint, fingerprintFor(generatedFacts.response.api))
  assert.deepEqual(generatedFacts.button.api.map((prop) => prop.name), generatedFacts.button.props)
  assert.deepEqual(generatedFacts.card.api.map((prop) => prop.name), generatedFacts.card.props)
  assert.deepEqual(generatedFacts.response.api.map((prop) => prop.name), generatedFacts.response.props)
  assert.equal(generatedFacts.button.api.find((prop) => prop.name === "variant").default, "tertiary")
  assert.equal(generatedFacts.button.api.find((prop) => prop.name === "primaryColor").default, "purple")
  assert.deepEqual(generatedFacts.button.api.find((prop) => prop.name === "variant").choices, ["default", "tertiary", "primary", "secondary", "ghost", "destructive", "link"])
  assert.deepEqual(generatedFacts.card.api.find((prop) => prop.name === "size").choices, ["default", "sm", "expressive"])
  assert.deepEqual(generatedFacts.response.api.find((prop) => prop.name === "streaming").choices, [false, true])
})

test("public agent catalog manifest matches the runtime catalog entries", async () => {
  const agentCatalogEntriesData = await loadData()
  const generatedFacts = await loadGeneratedFacts()
  const actual = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  const expected = agentCatalogEntriesData.map((entry) =>
    entry.slug === "button"
      ? { ...entry, props: [...generatedFacts.button.props], api: [...generatedFacts.button.api], fingerprint: generatedFacts.button.fingerprint }
      : entry.slug === "card"
        ? { ...entry, props: [...generatedFacts.card.props], api: [...generatedFacts.card.api], fingerprint: generatedFacts.card.fingerprint }
        : entry.slug === "response"
          ? { ...entry, props: [...generatedFacts.response.props], api: [...generatedFacts.response.api], fingerprint: generatedFacts.response.fingerprint }
      : entry,
  )

  assert.deepEqual(actual, {
    title: "OneDS agent catalog",
    description: "Compact retrieval index for the first pilot components.",
    components: expected,
  })
})

test("fixture source drift is caught by the CLI check without writing files", async () => {
  const fixtureRoot = createFixtureRoot()
  try {
    const { extractButtonApi, normalizeApiRecord } = await loadExtractor()
    const generatedFacts = await loadGeneratedFacts()
    const fixtureButtonPath = path.join(fixtureRoot, "src", "components", "ui", "button.tsx")
    const originalSource = fs.readFileSync(fixtureButtonPath, "utf8")

    // Control: an untouched copy extracts exactly the committed API.
    const controlApi = extractButtonApi(fixtureRoot).props.map(normalizeApiRecord)
    assert.deepEqual(controlApi, generatedFacts.button.api)
    assert.equal(fingerprintFor(controlApi), generatedFacts.button.fingerprint)

    // The untouched copy is byte-fresh, so the real CLI check passes.
    const before = runCli(fixtureRoot, ["check"])
    assert.equal(before.code, 0, before.stderr)
    assert.match(before.stdout, /Catalog is fresh/)

    // Mutate exactly one default and confirm nothing else moved.
    assert.equal(originalSource.split('variant = "tertiary"').length - 1, 1)
    const mutatedSource = originalSource.replace('variant = "tertiary"', 'variant = "primary"')
    assert.equal(mutatedSource.split('variant = "primary"').length - 1, 1)
    assert.equal(mutatedSource.split('variant = "tertiary"').length - 1, 0)
    fs.writeFileSync(fixtureButtonPath, mutatedSource, "utf8")

    const mutatedApi = extractButtonApi(fixtureRoot).props.map(normalizeApiRecord)
    const variant = mutatedApi.find((prop) => prop.name === "variant")
    assert.equal(variant.default, "primary")
    assert.deepEqual(
      mutatedApi.map((prop) => prop.name),
      controlApi.map((prop) => prop.name),
    )
    assert.deepEqual(variant.choices, controlApi.find((prop) => prop.name === "variant").choices)

    // The stale artifacts on disk must now fail the real CLI check.
    const publicDir = path.join(fixtureRoot, "public")
    const hashBefore = hashTree(publicDir)
    const after = runCli(fixtureRoot, ["check"])
    assert.notEqual(after.code, 0)
    assert.match(`${after.stdout}${after.stderr}`, /npm run catalog:generate/)
    assert.equal(hashTree(publicDir), hashBefore, "check must not write files")
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true })
  }
})

test("choices are truthful: broad types are not enumerated", async () => {
  const generatedFacts = await loadGeneratedFacts()
  const tooltip = generatedFacts.button.api.find((prop) => prop.name === "tooltip")
  assert.equal(tooltip.choices, null)
  const tooltipSide = generatedFacts.button.api.find((prop) => prop.name === "tooltipSide")
  assert.deepEqual(tooltipSide.choices, ["top", "right", "bottom", "left"])
  const selected = generatedFacts.button.api.find((prop) => prop.name === "selected")
  assert.deepEqual(selected.choices, [false, true])
})

test("example command returns real, non-empty source for every slug", async () => {
  for (const slug of ["button", "card", "response"]) {
    const result = runCli(root, ["example", slug])
    assert.equal(result.code, 0, result.stderr)
    assert.match(result.stdout, /Default example for/)
    assert.ok(result.stdout.split("\n").slice(1).join("\n").trim().length > 40, `${slug} example is empty`)
  }
  const unknown = runCli(root, ["example", "nope"])
  assert.notEqual(unknown.code, 0)
})

test("show command surfaces authored usage guidance", () => {
  const result = runCli(root, ["show", "button"])
  assert.equal(result.code, 0, result.stderr)
  assert.match(result.stdout, /description: Tertiary is the neutral default/)
  assert.match(result.stdout, /usage: Use size="icon" for a standard icon-only button/)
})

test("authored data reader rejects non-literal expressions", async () => {
  const { readAuthoredData } = await loadExtractor()
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "oneds-authored-"))
  try {
    const dir = path.join(fixtureRoot, "src", "showcase")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "agent-catalog-data.ts"),
      'export const agentCatalogEntriesData = [{ slug: "x", route: ["a"].join("") }] as const\n',
      "utf8",
    )
    assert.throws(() => readAuthoredData(fixtureRoot), /only JSON literals/)
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true })
  }
})
