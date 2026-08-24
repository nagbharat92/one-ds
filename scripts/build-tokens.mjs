import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const tokenFile = path.join(repositoryRoot, "tokens/oneds.tokens.json");
const outputFile = path.join(repositoryRoot, "tokens.css");

function flattenTokens(value, prefix = [], output = new Map()) {
	for (const [key, child] of Object.entries(value)) {
		const tokenPath = [...prefix, key];

		if (child && typeof child === "object" && "$value" in child) {
			output.set(tokenPath.join("."), String(child.$value));
			continue;
		}

		flattenTokens(child, tokenPath, output);
	}

	return output;
}

function variableName(tokenPath) {
	const semanticPath = tokenPath.replace(/^semantic\.(light|dark)\./, "semantic.");

	return `--oneds-${semanticPath
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replaceAll(".", "-")
		.toLowerCase()}`;
}

function referenceValue(value) {
	return value.replaceAll(/\{([^}]+)\}/g, (_, tokenPath) => `var(${variableName(tokenPath)})`);
}

function resolvedValue(tokens, tokenPath, stack = []) {
	if (stack.includes(tokenPath)) {
		throw new Error(`Circular token alias: ${[...stack, tokenPath].join(" -> ")}`);
	}

	const value = tokens.get(tokenPath);

	if (value === undefined) {
		throw new Error(`Unknown token alias: ${tokenPath}`);
	}

	return value.replaceAll(/\{([^}]+)\}/g, (_, aliasPath) =>
		resolvedValue(tokens, aliasPath, [...stack, tokenPath]),
	);
}

function declarations(tokens, indentation = "\t") {
	return [...tokens]
		.map(([tokenPath, value]) => `${indentation}${variableName(tokenPath)}: ${referenceValue(value)};`)
		.join("\n");
}

function selectTokens(tokens, prefixes) {
	return [...tokens].filter(([tokenPath]) =>
		prefixes.some((prefix) => tokenPath === prefix || tokenPath.startsWith(`${prefix}.`)),
	);
}

function createTokenCss(tokens) {
	const sharedTokens = selectTokens(tokens, ["reference", "component"]);
	const lightTokens = selectTokens(tokens, ["semantic.light"]);
	const darkTokens = selectTokens(tokens, ["semantic.dark"]);

	return `/* Generated from tokens/oneds.tokens.json. Do not edit. */
:root, [data-oneds-theme="light"] {
${declarations(sharedTokens)}
${declarations(lightTokens)}
	color-scheme: var(--oneds-semantic-color-scheme);
}

@media (prefers-color-scheme: dark) {
	:root:not([data-oneds-theme]) {
${declarations(darkTokens, "\t\t")}
		color-scheme: var(--oneds-semantic-color-scheme);
	}
}

[data-oneds-theme="dark"] {
${declarations(darkTokens)}
	color-scheme: var(--oneds-semantic-color-scheme);
}
`;
}

const tokenSource = await readFile(tokenFile, "utf8");
const tokenDocument = JSON.parse(tokenSource);

if ("application" in tokenDocument) {
	throw new Error("OneDS token source must not contain an application scope.");
}

const tokens = flattenTokens(tokenDocument);

for (const tokenPath of tokens.keys()) {
	resolvedValue(tokens, tokenPath);
}

await writeFile(outputFile, createTokenCss(tokens));

console.log(`Built ${tokens.size} OneDS tokens in tokens.css.`);