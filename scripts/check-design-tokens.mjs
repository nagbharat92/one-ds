/**
 * Enforces rule foundations.tokens: design values come from named tokens.
 *
 * Static scan of authored source for values that should live in the shared
 * token sheets under src/styles/.
 * Runs in milliseconds, needs no browser, and reports file:line with the match.
 *
 * Existing violations live in design-token-allowlist.json with a reason each.
 * The allowlist is a ratchet, not an escape hatch: an entry that no longer
 * matches is itself an error, so fixing a violation forces removing its line
 * and the list can only shrink.
 */
import fs from "node:fs"

const root = new URL("..", import.meta.url)
const allowlistPath = new URL("design-token-allowlist.json", import.meta.url)

// Foundation and Button token sheets own their literals.
// Generated files are not authored, so their contents are not a design decision.
const SKIP = [/^src\/index\.css$/, /^src\/styles\/(?:tokens|showcase-tokens|button|field)\.css$/, /generated-example-code\.ts$/, /^src\/assets\//]

const PATTERNS = [
  {
    id: "colour-literal",
    // Word-anchored deliberately: an unanchored rgba?\( also matches getArgb(
    // and hexFromArgb(, which produced seven false positives on the first pass.
    re: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/g,
    hint: "use a --md-sys-color-* role or an existing colour token",
  },
  {
    id: "raw-unit",
    // Tailwind arbitrary value carrying a raw dimension, e.g. ring-[3px].
    // Arbitrary values that reference a variable, and data-[...] selectors,
    // do not match and are not violations.
    re: /[a-z-]+\[[0-9]+(?:\.[0-9]+)?(?:px|rem|em|vh|vw)\]/g,
    hint: "add a token in src/styles/tokens.css and reference it, e.g. ring-(--focus-ring-width)",
  },
  {
    id: "inline-dimension",
    re: /style=\{\{[^}]*?[0-9]+(?:px|rem)\b/g,
    hint: "bridge a token instead of a literal dimension",
  },
]

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(new URL(dir + "/", root), { withFileTypes: true })) {
    const rel = dir + "/" + entry.name
    if (entry.isDirectory()) walk(rel, out)
    else if (/\.(ts|tsx|css)$/.test(entry.name)) out.push(rel)
  }
  return out
}

const allowlist = fs.existsSync(allowlistPath)
  ? JSON.parse(fs.readFileSync(allowlistPath, "utf8"))
  : {}

const found = new Map()

for (const file of walk("src")) {
  if (SKIP.some(re => re.test(file))) continue
  const lines = fs.readFileSync(new URL(file, root), "utf8").split("\n")
  for (const { id, re, hint } of PATTERNS) {
    lines.forEach((line, index) => {
      if (line.trimStart().startsWith("//")) return
      for (const match of line.matchAll(re)) {
        const key = file + " " + match[0]
        if (!found.has(key)) found.set(key, { file, match: match[0], id, hint, lines: [] })
        found.get(key).lines.push(index + 1)
      }
    })
  }
}

const violations = []
const stale = []

for (const entry of found.values()) {
  const allowed = allowlist[entry.file]?.[entry.match]
  if (!allowed) {
    violations.push(entry)
  } else if (allowed.count !== entry.lines.length) {
    violations.push({ ...entry, note: "allowlisted " + allowed.count + ", found " + entry.lines.length })
  }
}

for (const [file, matches] of Object.entries(allowlist)) {
  for (const match of Object.keys(matches)) {
    if (!found.has(file + " " + match)) stale.push({ file, match })
  }
}

if (process.argv.includes("--list")) {
  const grouped = {}
  for (const entry of found.values()) {
    grouped[entry.file] ??= {}
    grouped[entry.file][entry.match] = { count: entry.lines.length, reason: "TODO" }
  }
  console.log(JSON.stringify(grouped, null, 2))
  process.exit(0)
}

if (violations.length) {
  console.error("")
  console.error("foundations.tokens: " + violations.length + " value(s) not from a token")
  console.error("")
  for (const v of violations) {
    console.error("  " + v.file + ":" + v.lines.join(",") + "  " + v.match + (v.note ? "  (" + v.note + ")" : ""))
    console.error("    " + v.hint)
  }
  console.error("")
  console.error("Fix it, or add it to scripts/design-token-allowlist.json with a reason.")
  console.error("")
}

if (stale.length) {
  console.error("Allowlist has " + stale.length + " entry/entries that no longer match. Remove them:")
  console.error("")
  for (const s of stale) console.error("  " + s.file + "  " + s.match)
  console.error("")
}

if (violations.length || stale.length) process.exitCode = 1
else console.log("foundations.tokens: clean (" + found.size + " allowlisted, 0 new).")
