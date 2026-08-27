import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const configPath = process.argv[2]
	? path.resolve(process.cwd(), process.argv[2])
	: path.join(scriptDirectory, "config.json");
const configDirectory = path.dirname(configPath);
const config = JSON.parse(await readFile(configPath, "utf8"));

const generatedTokensPath = path.resolve(configDirectory, config.generatedTokens);
const authoredCssPaths = config.authoredCss.map((entry) => path.resolve(configDirectory, entry));
const repositoryRoot = path.resolve(scriptDirectory, "..");

/** The approved primitive ladder. Every resolved spacing value must land on one of these. */
const ladder = [2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 96];

const spacingProperties = new Set([
	"gap",
	"row-gap",
	"column-gap",
	"padding",
	"padding-block",
	"padding-block-start",
	"padding-block-end",
	"padding-inline",
	"padding-inline-start",
	"padding-inline-end",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
	"margin",
	"margin-block",
	"margin-block-start",
	"margin-block-end",
	"margin-inline",
	"margin-inline-start",
	"margin-inline-end",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"scroll-margin",
	"scroll-margin-top",
	"scroll-margin-bottom",
	"scroll-margin-block",
	"scroll-margin-block-start",
	"scroll-padding",
	"scroll-padding-block",
	"inset",
	"inset-block",
	"inset-inline",
	"top",
	"right",
	"bottom",
	"left",
]);

/** Specimen bars on the token page render a token as their own width; that is documentation, not layout. */
const specimenSelector = /^\.(space|rhythm|inset)-[a-z0-9-]+$/;

async function collectFiles(entryPath, extension) {
	const entryStats = await stat(entryPath);

	if (entryStats.isFile()) {
		return entryPath.endsWith(extension) ? [entryPath] : [];
	}

	const entries = await readdir(entryPath, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => collectFiles(path.join(entryPath, entry.name), extension)),
	);

	return files.flat();
}

function displayPath(filePath) {
	return path.relative(repositoryRoot, filePath);
}

/** Strips comments so declarations inside them are never counted. */
function stripComments(css) {
	return css.replaceAll(/\/\*[\s\S]*?\*\//g, "");
}

function tokenTable(generatedCss) {
	const table = new Map();

	for (const match of stripComments(generatedCss).matchAll(/(--oneds-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
		table.set(match[1], match[2].trim());
	}

	return table;
}

/** Follows var() aliases to a final px number. Returns null for anything that is not a plain length. */
function resolvePx(table, value, seen = new Set()) {
	const text = value.trim();
	const direct = /^(-?\d+(?:\.\d+)?)px$/.exec(text);

	if (direct) {
		return Number.parseFloat(direct[1]);
	}

	if (text === "0") {
		return 0;
	}

	const variable = /^var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)$/.exec(text);

	if (!variable) {
		return null;
	}

	const name = variable[1];

	if (seen.has(name)) {
		return null;
	}

	const next = table.get(name);

	return next === undefined ? null : resolvePx(table, next, new Set([...seen, name]));
}

/** Splits a shorthand into components without breaking var(--a, b) commas. */
function splitComponents(value) {
	const parts = [];
	let depth = 0;
	let current = "";

	for (const character of value) {
		if (character === "(") depth += 1;
		if (character === ")") depth -= 1;

		if (depth === 0 && /\s/.test(character)) {
			if (current.trim()) parts.push(current.trim());
			current = "";
			continue;
		}

		current += character;
	}

	if (current.trim()) parts.push(current.trim());

	return parts;
}

function ruleBlocks(css) {
	const blocks = [];

	for (const match of stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		const selector = match[1].trim().replaceAll(/\s+/g, " ");

		if (selector.startsWith("@")) continue;

		blocks.push({ selector, body: match[2] });
	}

	return blocks;
}

function declarationsOf(body) {
	return [...body.matchAll(/([a-z-]+)\s*:\s*([^;]+)(?:;|$)/gi)].map((match) => ({
		property: match[1].trim().toLowerCase(),
		value: match[2].trim(),
	}));
}

const generatedCss = await readFile(generatedTokensPath, "utf8");
const tokens = tokenTable(generatedCss);
const spacingTokenNames = new Set(
	[...tokens.keys()].filter((name) => /^--oneds-(reference-space|rhythm|inset)/.test(name)),
);

const cssFiles = (
	await Promise.all(authoredCssPaths.map((entryPath) => collectFiles(entryPath, ".css")))
)
	.flat()
	.filter((filePath) => filePath !== generatedTokensPath)
	.sort();

const usage = new Map();
const offLadder = [];
const primitiveUses = [];
const miscastTokens = [];
const unresolved = [];

for (const cssFile of cssFiles) {
	const css = await readFile(cssFile, "utf8");
	const blocks = ruleBlocks(css);

	// Component-local custom properties resolve against the token table too.
	const locals = new Map(tokens);

	for (const { body } of blocks) {
		for (const { property, value } of declarationsOf(body)) {
			if (property.startsWith("--")) locals.set(property, value);
		}
	}

	for (const { selector, body } of blocks) {
		if (specimenSelector.test(selector)) continue;

		for (const { property, value } of declarationsOf(body)) {
			if (property.startsWith("--")) continue;

			const isSpacing = spacingProperties.has(property);
			const components = splitComponents(value);

			for (const component of components) {
				const referenced = /var\(\s*(--oneds-[a-z0-9-]+)/.exec(component)?.[1];

				if (referenced && spacingTokenNames.has(referenced) && !isSpacing) {
					miscastTokens.push(`${displayPath(cssFile)}  ${selector} { ${property}: … ${referenced} }`);
				}

				if (!isSpacing) continue;

				if (referenced?.startsWith("--oneds-reference-space")) {
					primitiveUses.push(`${displayPath(cssFile)}  ${selector} { ${property} } → ${referenced}`);
				}

				const px = resolvePx(locals, component);

				if (px === null) {
					if (
						component !== "auto" &&
						!component.endsWith("%") &&
						!component.startsWith("calc(") &&
						!component.startsWith("minmax(")
					) {
						unresolved.push(`${displayPath(cssFile)}  ${selector} { ${property}: ${component} }`);
					}

					continue;
				}

				if (px === 0) continue;

				const key = px;

				if (!usage.has(key)) usage.set(key, { count: 0, sites: [] });

				const entry = usage.get(key);
				entry.count += 1;

				if (entry.sites.length < 6) {
					entry.sites.push(`${displayPath(cssFile)} ${selector}`);
				}

				if (!ladder.includes(px)) {
					offLadder.push(`${displayPath(cssFile)}  ${selector} { ${property}: ${component} } → ${px}px`);
				}
			}
		}
	}
}

const lines = [];
const total = [...usage.values()].reduce((sum, entry) => sum + entry.count, 0);

lines.push(`Rhythm audit — ${cssFiles.length} authored stylesheets, ${total} resolved spacing values.`);
lines.push("");
lines.push("Value histogram");

for (const [px, entry] of [...usage.entries()].sort((a, b) => a[0] - b[0])) {
	const flag = ladder.includes(px) ? " " : "!";
	lines.push(`${flag} ${String(px).padStart(4)}px  x${String(entry.count).padStart(4)}   ${entry.sites.slice(0, 3).join("  ·  ")}`);
}

const sections = [
	["Off-ladder values", offLadder],
	["Spacing tokens used in non-spacing properties", miscastTokens],
	["Direct primitive references (should use rhythm/inset)", primitiveUses],
	["Unresolved spacing values", unresolved],
];

for (const [title, entries] of sections) {
	lines.push("");
	lines.push(`${title}: ${entries.length}`);

	for (const entry of [...new Set(entries)].slice(0, 40)) {
		lines.push(`  ${entry}`);
	}

	if (new Set(entries).size > 40) {
		lines.push(`  … ${new Set(entries).size - 40} more`);
	}
}

console.log(lines.join("\n"));
