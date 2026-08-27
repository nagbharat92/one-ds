import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const configPath = process.argv[2]
	? path.resolve(process.cwd(), process.argv[2])
	: path.join(scriptDirectory, "config.json");
const configDirectory = path.dirname(configPath);
const config = JSON.parse(await readFile(configPath, "utf8"));

function configuredFile(value, name) {
	if (typeof value !== "string" || !value) {
		throw new Error(`${name} must be a path string.`);
	}

	return path.resolve(configDirectory, value);
}

function configuredPaths(value, name) {
	if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || !entry)) {
		throw new Error(`${name} must be an array of path strings.`);
	}

	return value.map((entry) => path.resolve(configDirectory, entry));
}

async function collectFiles(entryPath, extension) {
	const entryStats = await stat(entryPath);

	if (!entryStats.isDirectory()) {
		return entryPath.endsWith(extension) ? [entryPath] : [];
	}

	const entries = await readdir(entryPath, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => collectFiles(path.join(entryPath, entry.name), extension)),
	);

	return files.flat();
}

async function collectConfiguredFiles(paths, extension) {
	const files = await Promise.all(paths.map((entryPath) => collectFiles(entryPath, extension)));

	return [...new Set(files.flat())].sort();
}

function displayPath(filePath) {
	return path.relative(configDirectory, filePath) || path.basename(filePath);
}

function stripComments(css) {
	return css.replaceAll(/\/\*[\s\S]*?\*\//g, "");
}

const generatedTokensPath = configuredFile(config.generatedTokens, "generatedTokens");
const componentsPath = configuredFile(config.components, "components");
const manifestPath = configuredFile(config.manifest, "manifest");
const tokenPagePath = configuredFile(config.tokenPage, "tokenPage");
const authoredCssPaths = configuredPaths(config.authoredCss, "authoredCss");
const htmlPaths = configuredPaths(config.html, "html");
const authoredCssFiles = (await collectConfiguredFiles(authoredCssPaths, ".css")).filter(
	(filePath) => filePath !== generatedTokensPath,
);
const htmlFiles = await collectConfiguredFiles(htmlPaths, ".html");
const generatedTokens = await readFile(generatedTokensPath, "utf8");
const definedTokens = new Set(
	[...generatedTokens.matchAll(/(--oneds-[a-z0-9-]+)\s*:/g)].map((match) => match[1]),
);
const violations = [];
const usedTokens = new Set();
const scrollWrapperClasses = new Set();
const forbiddenCssPatterns = [
	[/#[0-9a-f]{3,8}\b/gi, "literal hex color"],
	[/\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lch|lab)\(\s*[\d.]/gi, "literal color function"],
	[/\b\d+(?:\.\d+)?(?:px|rem|em|ms)\b/gi, "literal dimension or duration"],
	[/\b(?!100(?:vh|vw)\b)\d+(?:\.\d+)?(?:vh|vw|ch)\b/gi, "literal viewport or measure value"],
	[/text-transform\s*:\s*uppercase/gi, "uppercase text transform"],
];

for (const cssFile of authoredCssFiles) {
	const css = await readFile(cssFile, "utf8");

	for (const [pattern, label] of forbiddenCssPatterns) {
		const matches = [...css.matchAll(pattern)].map((match) => match[0]);

		if (matches.length) {
			violations.push(
				`${displayPath(cssFile)} contains ${label}: ${[...new Set(matches)].join(", ")}`,
			);
		}
	}

	// The primitive ladder is private; only rhythm, inset, and component tokens may resolve against it.
	if (cssFile.startsWith(`${componentsPath}${path.sep}`)) {
		const primitives = [
			...new Set([...css.matchAll(/var\(\s*(--oneds-reference-space-[a-z0-9]+)/g)].map((match) => match[1])),
		];

		if (primitives.length) {
			violations.push(
				`${displayPath(cssFile)} references private spacing primitives: ${primitives.join(", ")}. Use --oneds-rhythm-* or --oneds-inset-*.`,
			);
		}
	}

	for (const match of css.matchAll(/var\(\s*(--oneds-[a-z0-9-]+)/g)) {
		usedTokens.add(match[1]);
	}

	for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		if (!/overflow(?:-x)?\s*:\s*auto/.test(body)) continue;

		for (const [, className] of selector.matchAll(/\.([a-z0-9_-]+)/gi)) scrollWrapperClasses.add(className);
	}

	// Line-height tokens resolve to a px length, so they inherit unchanged. A rule that
	// resizes text without restating its line height keeps the ancestor's leading.
	for (const [, selector, body] of stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		const rule = selector.trim().replaceAll(/\s+/g, " ");

		if (rule.startsWith("@")) continue;
		if (!/(?:^|[;\s])font-size\s*:/.test(body)) continue;
		if (/(?:^|[;\s])(?:line-height|font)\s*:/.test(body)) continue;

		violations.push(`${displayPath(cssFile)} sets font-size on "${rule}" without a paired line-height.`);
	}
}

for (const match of generatedTokens.matchAll(/var\(\s*(--oneds-[a-z0-9-]+)/g)) {
	usedTokens.add(match[1]);
}

const missingTokens = [...usedTokens].filter((tokenName) => !definedTokens.has(tokenName)).sort();

if (missingTokens.length) {
	violations.push(`Undefined OneDS tokens: ${missingTokens.join(", ")}`);
}

// Color, typography, and font tokens are documented on their own pages.
const belongsOnTokenPage = (tokenName) => !tokenName.startsWith("--oneds-color-")
	&& !tokenName.startsWith("--oneds-semantic-typography-")
	&& !tokenName.startsWith("--oneds-reference-font-");
const tokenPage = await readFile(tokenPagePath, "utf8");
const tokenPageRows = new Set(
	[...tokenPage.matchAll(/data-token="(--oneds-[a-z0-9-]+)"/g)].map((match) => match[1]),
);
const undocumentedTokens = [...definedTokens].filter(
	(tokenName) => belongsOnTokenPage(tokenName) && !tokenPageRows.has(tokenName),
).sort();
const strayTokenRows = [...tokenPageRows].filter((tokenName) => !definedTokens.has(tokenName)).sort();

if (undocumentedTokens.length) {
	violations.push(
		`Tokens with no ${displayPath(tokenPagePath)} row: ${undocumentedTokens.join(", ")}`,
	);
}

if (strayTokenRows.length) {
	violations.push(
		`${displayPath(tokenPagePath)} documents tokens that do not exist: ${strayTokenRows.join(", ")}`,
	);
}

for (const htmlFile of htmlFiles) {
	const html = await readFile(htmlFile, "utf8");

	if (/\sstyle\s*=/i.test(html)) {
		violations.push(`${displayPath(htmlFile)} contains an inline style attribute.`);
	}

	// An icon set beside a label must let the label carry text-trim so the icon centres on the
	// letters, not the font's leading. Flag a leading icon directly followed by an unwrapped label:
	// bare text, or a single-text span that lacks the text-trim class.
	if (htmlFile.startsWith(`${componentsPath}${path.sep}`)) {
		const bareLabel = [...html.matchAll(/<\/svg>\s*[A-Za-z0-9]/g)].length;
		const untrimmedSpan = [
			...html.matchAll(/<\/svg>\s*<span\b(?![^>]*\btext-trim\b)[^>]*>[^<]+<\/span>/g),
		].length;
		const untrimmed = bareLabel + untrimmedSpan;

		if (untrimmed) {
			violations.push(
				`${displayPath(htmlFile)} pairs a leading icon with ${untrimmed} untrimmed label${untrimmed === 1 ? "" : "s"}. Wrap each label in <span class="text-trim"> so the icon centres on the letters, not the font's leading.`,
			);
		}
	}

	const wrappers = [...html.matchAll(/<\w+[^>]*\sclass="([^"]*)"/g)];
	const unwrapped = [...html.matchAll(/<table[\s>]/g)].filter((table) => {
		const wrapper = wrappers.findLast((candidate) => candidate.index < table.index);

		return !wrapper?.[1].split(/\s+/).some((className) => scrollWrapperClasses.has(className));
	});

	if (unwrapped.length) {
		violations.push(
			`${displayPath(htmlFile)} has ${unwrapped.length} table${unwrapped.length === 1 ? "" : "s"} whose nearest wrapper does not scroll. Wrap each in .data-table__scroll inside a .card.`,
		);
	}
}

const componentDirectories = (await readdir(componentsPath, { withFileTypes: true }))
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name)
	.sort();

for (const componentName of componentDirectories) {
	const componentPath = path.join(componentsPath, componentName);
	const componentFiles = new Set(await readdir(componentPath));
	const requiredFiles = [`${componentName}.css`, `${componentName}.html`, "USAGE.md"];
	const missingFiles = requiredFiles.filter((fileName) => !componentFiles.has(fileName));

	if (missingFiles.length) {
		violations.push(
			`${displayPath(componentPath)} is missing required files: ${missingFiles.join(", ")}`,
		);
	}
}

const manifest = await readFile(manifestPath, "utf8");
const manifestRows = new Map();

for (const line of manifest.split("\n")) {
	const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());

	if (
		cells.length === 4 &&
		/^[a-z0-9-]+$/.test(cells[0]) &&
		(cells[3] === "built" || cells[3] === "not built")
	) {
		manifestRows.set(cells[0], cells[3]);
	}
}

const componentNames = new Set(componentDirectories);

for (const componentName of componentDirectories) {
	const status = manifestRows.get(componentName);

	if (status === undefined) {
		violations.push(`${displayPath(componentsPath)}/${componentName} has no manifest row.`);
	} else if (status !== "built") {
		violations.push(`${displayPath(componentsPath)}/${componentName} is marked "${status}".`);
	}
}

for (const [componentName, status] of manifestRows) {
	if (status === "built" && !componentNames.has(componentName)) {
		violations.push(`${displayPath(manifestPath)} marks ${componentName} built without a directory.`);
	}
}

if (violations.length) {
	console.error(`OneDS checks failed with ${violations.length} violation${violations.length === 1 ? "" : "s"}:`);

	for (const violation of violations) {
		console.error(`- ${violation}`);
	}

	process.exitCode = 1;
} else {
	console.log(
		`OneDS checks passed for ${authoredCssFiles.length} authored CSS file${authoredCssFiles.length === 1 ? "" : "s"}, ${htmlFiles.length} HTML file${htmlFiles.length === 1 ? "" : "s"}, ${definedTokens.size} generated tokens, ${usedTokens.size} token references, and ${componentDirectories.length} component package${componentDirectories.length === 1 ? "" : "s"}.`,
	);
}