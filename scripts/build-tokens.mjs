import { readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
	generatedEntries,
	normalizeTheme,
	resolveColorTokens,
	resolveInteractionColorTokens,
	variableName,
} from "./theme-engine.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const tokenFile = path.join(repositoryRoot, "tokens/oneds.tokens.json");
const themeFile = path.join(repositoryRoot, "tokens/theme.json");
const outputFile = path.join(repositoryRoot, "tokens.css");
const reportFile = path.join(repositoryRoot, "color-tokens.md");
const colorPageFile = path.join(repositoryRoot, "site/color.html");
const tokenPageFile = path.join(repositoryRoot, "site/tokens.html");

const statusFamilies = ["danger", "warning", "success"];

function flattenTokens(value, prefix = [], output = new Map()) {
	for (const [key, child] of Object.entries(value)) {
		const tokenPath = [...prefix, key];

		if (child && typeof child === "object" && "$value" in child) {
			output.set(tokenPath.join("."), child.$value);
			continue;
		}

		flattenTokens(child, tokenPath, output);
	}

	return output;
}

function referenceValue(value) {
	if (typeof value === "object") {
		return `light-dark(${value.light}, ${value.dark})`;
	}

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

	const values = typeof value === "object" ? Object.values(value) : [value];

	return values.map((candidate) => candidate.replaceAll(/\{([^}]+)\}/g, (_, aliasPath) =>
		resolvedValue(tokens, aliasPath, [...stack, tokenPath]),
	));
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

function parseHex(value) {
	const hex = value.slice(1);
	const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
	const alpha = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) : 255;

	return { channels, alpha };
}

function formatHex({ channels, alpha }) {
	const parts = [...channels, ...(alpha === 255 ? [] : [alpha])];

	return `#${parts.map((part) => Math.max(0, Math.min(255, part)).toString(16).padStart(2, "0")).join("")}`;
}

function shiftChannels(color, amount) {
	return { ...color, channels: color.channels.map((channel) => channel + amount) };
}

function linearSrgb(channel) {
	const value = channel / 255;

	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function encodedSrgb(channel) {
	const value = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;

	return Math.round(Math.max(0, Math.min(1, value)) * 255);
}

function oklchToHex({ lightness, chroma, hue, alpha }) {
	const radians = (hue * Math.PI) / 180;
	const axisA = chroma * Math.cos(radians);
	const axisB = chroma * Math.sin(radians);
	const long = (lightness + 0.3963377774 * axisA + 0.2158037573 * axisB) ** 3;
	const medium = (lightness - 0.1055613458 * axisA - 0.0638541728 * axisB) ** 3;
	const short = (lightness - 0.0894841775 * axisA - 1.291485548 * axisB) ** 3;

	return formatHex({
		channels: [
			encodedSrgb(4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short),
			encodedSrgb(-1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short),
			encodedSrgb(-0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short),
		],
		alpha: Math.round((alpha ?? 1) * 255),
	});
}

function shiftOklabLightness(color, amount) {
	const [red, green, blue] = color.channels.map(linearSrgb);
	const linearLight = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
	const linearMedium = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
	const linearShort = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
	const lightness = 0.2104542553 * linearLight + 0.793617785 * linearMedium - 0.0040720468 * linearShort + amount;
	const axisA = 1.9779984951 * linearLight - 2.428592205 * linearMedium + 0.4505937099 * linearShort;
	const axisB = 0.0259040371 * linearLight + 0.7827717662 * linearMedium - 0.808675766 * linearShort;
	const transformedLight = (lightness + 0.3963377774 * axisA + 0.2158037573 * axisB) ** 3;
	const transformedMedium = (lightness - 0.1055613458 * axisA - 0.0638541728 * axisB) ** 3;
	const transformedShort = (lightness - 0.0894841775 * axisA - 1.291485548 * axisB) ** 3;

	return {
		...color,
		channels: [
			encodedSrgb(4.0767416621 * transformedLight - 3.3077115913 * transformedMedium + 0.2309699292 * transformedShort),
			encodedSrgb(-1.2684380046 * transformedLight + 2.6097574011 * transformedMedium - 0.3413193965 * transformedShort),
			encodedSrgb(-0.0041960863 * transformedLight - 0.7034186147 * transformedMedium + 1.707614701 * transformedShort),
		],
	};
}

function deriveStatusInteraction(tokenPath, value, state, scheme) {
	const [, category, , modifier] = tokenPath.split(".");
	const color = parseHex(value);
	const pressed = state === "pressed";

	if (category === "foreground" && modifier === "onloud") return formatHex(color);

	if (category === "stroke" && modifier === "onloud") {
		return scheme === "light" ? formatHex(color) : formatHex(shiftChannels(color, pressed ? -31 : -17));
	}

	const direction = modifier === "loud" ? 1 : -1;
	const lightAmount = pressed ? 0.06 : 0.03;
	let darkAmount = lightAmount;

	if (category === "background" && modifier === "soft") darkAmount = pressed ? 0.09 : 0.045;
	if (category === "background" && modifier === "subtle") darkAmount = pressed ? 0.12 : 0.06;

	return formatHex(shiftOklabLightness(color, direction * (scheme === "light" ? lightAmount : -darkAmount)));
}

function statusInteractionTokens(literalTokens) {
	const prefixes = statusFamilies.flatMap((family) => [
		`color.background.${family}`,
		`color.stroke.${family}`,
		`color.foreground.${family}`,
	]);

	return selectTokens(literalTokens, prefixes).flatMap(([tokenPath, value]) =>
		["hover", "pressed"].map((state) => [`${tokenPath}.${state}`, {
			light: deriveStatusInteraction(tokenPath, value.light, state, "light"),
			dark: deriveStatusInteraction(tokenPath, value.dark, state, "dark"),
		}]),
	);
}

function orderedTokens(literalTokens, generated) {
	const withPrefix = (entries, prefix) => entries.filter(([tokenPath]) => tokenPath.startsWith(prefix));
	const literal = [...literalTokens];

	return new Map([
		...withPrefix(literal, "color.fixed."),
		...withPrefix(generated, "color.surface."),
		...withPrefix(generated, "color.background."),
		...withPrefix(literal, "color.background."),
		...withPrefix(generated, "color.stroke."),
		...withPrefix(literal, "color.stroke."),
		...withPrefix(generated, "color.foreground."),
		...withPrefix(literal, "color.foreground."),
		...withPrefix(literal, "color.shadow"),
		...literal.filter(([tokenPath]) => !tokenPath.startsWith("color.")),
	]);
}

function swatchValues(literalTokens, resolved) {
	const swatchName = (tokenPath) => tokenPath.replace(/^color\./, "").replaceAll(".", "-");
	const swatches = new Map();

	for (const [tokenPath, value] of literalTokens) {
		if (tokenPath.startsWith("color.")) swatches.set(swatchName(tokenPath), value);
	}

	for (const { path: tokenPath, light, dark } of resolved) {
		swatches.set(swatchName(tokenPath), { light: oklchToHex(light), dark: oklchToHex(dark) });
	}

	return swatches;
}

function applySwatchValues(html, swatches) {
	const documented = new Set(
		[...html.matchAll(/data-color-token="([a-z0-9-]+)"/g)].map((match) => match[1]),
	);
	const unknown = [...documented].filter((name) => !swatches.has(name));
	const updated = html.replaceAll(/<tr data-color-token="([a-z0-9-]+)">([\s\S]*?)<\/tr>/g, (row, name, body) => {
		const value = swatches.get(name);

		if (!value) return row;

		let cell = 0;
		const cells = body.replaceAll(/<code>[^<]*<\/code>/g, () => `<code>${cell++ === 0 ? value.light : value.dark}</code>`);

		return `<tr data-color-token="${name}">${cells}</tr>`;
	});

	return { html: updated, unknown, undocumented: [...swatches.keys()].filter((name) => !documented.has(name)) };
}

// Color, typography, and font tokens are documented on their own pages.
function belongsOnTokenPage(tokenPath) {
	return !tokenPath.startsWith("color.")
		&& !tokenPath.startsWith("semantic.typography.")
		&& !tokenPath.startsWith("reference.font.");
}

function tokenPageValues(tokens) {
	const values = new Map();

	for (const tokenPath of tokens.keys()) {
		if (belongsOnTokenPage(tokenPath)) values.set(variableName(tokenPath), resolvedValue(tokens, tokenPath));
	}

	return values;
}

function applyTokenValues(html, values) {
	const documented = new Set(
		[...html.matchAll(/data-token="(--oneds-[a-z0-9-]+)"/g)].map((match) => match[1]),
	);
	const unknown = [...documented].filter((name) => !values.has(name));
	const updated = html.replaceAll(/<tr data-token="(--oneds-[a-z0-9-]+)">([\s\S]*?)<\/tr>/g, (row, name, body) => {
		const [value, ...rest] = values.get(name) ?? [];

		if (value === undefined || rest.length) return row;

		const cells = body.replace(
			/(<td data-token-value>)[\s\S]*?(<\/td>)/,
			`$1${value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}$2`,
		);

		return `<tr data-token="${name}">${cells}</tr>`;
	});

	return { html: updated, unknown, undocumented: [...values.keys()].filter((name) => !documented.has(name)) };
}

function createTokenCss(tokens, interactions) {
	return `/* Generated from tokens/theme.json and tokens/oneds.tokens.json. Do not edit. */
@font-face {
	font-family: "Segoe UI Variable";
	src: url("fonts/SegoeUI-VF.woff2") format("woff2");
	font-weight: 300 700;
	font-style: normal;
	font-display: swap;
}

:root {
	color-scheme: light dark;
${declarations(tokens)}
${declarations(interactions)}
}

[data-theme="light"] {
	color-scheme: light;
}

[data-theme="dark"] {
	color-scheme: dark;
}

body {
	font-family: var(--oneds-reference-font-family-base);
	font-size: var(--oneds-semantic-typography-functional-body-medium-size);
	font-weight: var(--oneds-reference-font-weight-regular);
	line-height: var(--oneds-semantic-typography-functional-body-medium-line-height);
	letter-spacing: var(--oneds-semantic-typography-functional-body-medium-letter-spacing);
	font-optical-sizing: auto;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
}

b,
strong {
	font-weight: var(--oneds-reference-font-weight-semibold);
}

button,
input,
optgroup,
select,
textarea {
	font-family: inherit;
	font-size: var(--oneds-semantic-typography-functional-body-medium-size);
	font-weight: var(--oneds-reference-font-weight-regular);
	line-height: var(--oneds-semantic-typography-functional-body-medium-line-height);
}

/* A font's line box carries more leading above the cap height than below the baseline, so an
   icon centred against a label aligns to that ghost space, not the letters. Trimming the label's
   box to its cap height and alphabetic baseline makes the centre fall on the visible glyphs. Opt
   in with the class on the text element of an icon-and-text pairing; where text-box is unsupported
   the pairing falls back to align-items: center, slightly less precise but never misaligned. */
@supports (text-box: trim-both cap alphabetic) {
	.text-trim {
		text-box: trim-both cap alphabetic;
	}
}
`;
}

function summarizeStatusFit(interactions, report) {
	const reportLines = report.split("\n");
	const comparisons = [];

	for (const [tokenPath, value] of interactions) {
		if (!statusFamilies.some((family) => tokenPath.includes(`.${family}.`))) continue;

		const reportName = variableName(tokenPath).replace("--oneds-", "--gnrc-");
		const reportLine = reportLines.find((line) => line.includes(reportName));
		const actualValues = reportLine ? [...reportLine.matchAll(/`(#[0-9a-f]+)`/g)] : [];

		if (actualValues.length === 2) {
			comparisons.push({
				tokenPath,
				generated: value,
				actual: { light: actualValues[0][1], dark: actualValues[1][1] },
			});
		}
	}

	const exactValues = comparisons.reduce((count, comparison) => count
		+ Number(comparison.generated.light === comparison.actual.light)
		+ Number(comparison.generated.dark === comparison.actual.dark), 0);

	return { comparisons, exactValues, totalValues: comparisons.length * 2 };
}

export async function readTheme(filePath = themeFile) {
	return normalizeTheme(JSON.parse(await readFile(filePath, "utf8")));
}

/* A stale cached stylesheet is indistinguishable from a broken one, so the cache key is the file's own content. */
async function stampStylesheetVersions() {
	const siteDirectory = path.join(repositoryRoot, "site");
	const pages = (await readdir(siteDirectory)).filter((name) => name.endsWith(".html")).sort();
	const digests = new Map();
	const stamped = [];

	for (const page of pages) {
		const pagePath = path.join(siteDirectory, page);
		const html = await readFile(pagePath, "utf8");
		let changed = false;

		const next = await replaceAsync(
			html,
			/(<link rel="stylesheet" href=")([^"?]+\.css)(\?v=[^"]*)?(")/g,
			async (whole, open, href, _version, close) => {
				const target = path.resolve(siteDirectory, href);

				if (!digests.has(target)) {
					digests.set(
						target,
						createHash("sha256").update(await readFile(target)).digest("hex").slice(0, 8),
					);
				}

				const replacement = `${open}${href}?v=${digests.get(target)}${close}`;

				if (replacement !== whole) changed = true;

				return replacement;
			},
		);

		if (changed) {
			await writeFile(pagePath, next);
			stamped.push(page);
		}
	}

	return { pages: pages.length, stamped, stylesheets: digests.size };
}

async function replaceAsync(input, pattern, replacer) {
	const replacements = [];

	input.replace(pattern, (...args) => {
		replacements.push(replacer(...args));

		return "";
	});

	const resolvedReplacements = await Promise.all(replacements);

	return input.replace(pattern, () => resolvedReplacements.shift());
}

export async function buildTokens(theme) {
	const tokenDocument = JSON.parse(await readFile(tokenFile, "utf8"));

	if ("application" in tokenDocument) {
		throw new Error("OneDS token source must not contain an application scope.");
	}

	const resolvedTheme = theme ?? (await readTheme());
	const literalTokens = flattenTokens(tokenDocument);
	const resolved = resolveColorTokens(resolvedTheme);
	const tokens = orderedTokens(literalTokens, generatedEntries(resolved));
	const interactions = [
		...generatedEntries(resolveInteractionColorTokens(resolvedTheme)),
		...statusInteractionTokens(literalTokens),
	];

	for (const tokenPath of tokens.keys()) {
		resolvedValue(tokens, tokenPath);
	}

	return {
		theme: resolvedTheme,
		tokens,
		interactions,
		css: createTokenCss(tokens, interactions),
		swatches: swatchValues(literalTokens, resolved),
		pageValues: tokenPageValues(tokens),
	};
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
	const { theme, tokens, interactions, css, swatches, pageValues } = await buildTokens();

	await writeFile(outputFile, css);

	const colorPage = applySwatchValues(await readFile(colorPageFile, "utf8"), swatches);

	await writeFile(colorPageFile, colorPage.html);

	const tokenPage = applyTokenValues(await readFile(tokenPageFile, "utf8"), pageValues);

	await writeFile(tokenPageFile, tokenPage.html);

	const statusFit = summarizeStatusFit(interactions, await readFile(reportFile, "utf8"));
	const versions = await stampStylesheetVersions();

	console.log(`Built ${tokens.size + interactions.length} OneDS tokens in tokens.css.`);
	console.log(`Theme: accentHue ${theme.accentHue}, groundOffset ${theme.groundOffset} (groundHue ${theme.groundHue}), groundLightness ${theme.groundLightness}, chromaScale ${theme.chromaScale}.`);
	console.log(`Color page: ${swatches.size - colorPage.undocumented.length}/${swatches.size} tokens documented.`);

	if (colorPage.unknown.length) {
		console.log(`- site/color.html rows without a token: ${colorPage.unknown.join(", ")}`);
	}

	if (colorPage.undocumented.length) {
		console.log(`- tokens without a site/color.html row: ${colorPage.undocumented.join(", ")}`);
	}

	console.log(`Token page: ${pageValues.size - tokenPage.undocumented.length}/${pageValues.size} tokens documented.`);

	if (tokenPage.unknown.length) {
		console.log(`- site/tokens.html rows without a token: ${tokenPage.unknown.join(", ")}`);
	}

	if (tokenPage.undocumented.length) {
		console.log(`- tokens without a site/tokens.html row: ${tokenPage.undocumented.join(", ")}`);
	}

	console.log(`Status interaction fit: ${statusFit.exactValues}/${statusFit.totalValues} light/dark values exactly match color-tokens.md.`);
	console.log(`Stylesheet versions: ${versions.stylesheets} files hashed across ${versions.pages} pages${versions.stamped.length ? `, restamped ${versions.stamped.join(", ")}` : ", already current"}.`);

	for (const comparison of statusFit.comparisons) {
		for (const scheme of ["light", "dark"]) {
			if (comparison.generated[scheme] !== comparison.actual[scheme]) {
				console.log(`- ${variableName(comparison.tokenPath)} ${scheme}: generated ${comparison.generated[scheme]}, report ${comparison.actual[scheme]}`);
			}
		}
	}
}
