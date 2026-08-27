// The single source of the theme derivation rules. Imported by scripts/build-tokens.mjs to emit
// tokens.css and by site/theme-preview.js to retheme the page live. Keep it free of Node APIs.

const darkGroundLightness = 0.2;
const chromaCeiling = 0.15;
const lightnessCeiling = 0.985;
const taperAbove = 0.95;
const taperBelow = 0.25;
const taperFactor = 0.7;
const gamutHeadroom = 0.95;
const surfaceChroma = { base: 0.012, anchor: 0.945, slope: 0.5, floor: 0.005, ceiling: 0.08 };
const surfaceHeadroomSpan = 0.04;
const quietBackground = { floor: 0.7, span: 0.245, minimum: 0.35, chromaCap: 3 };
const expressionChroma = { fillMultiplier: 6, fillCeiling: 0.075 };
const interactionLightnessStep = { hover: 0.03, pressed: 0.06 };
const transparentInteractionAlpha = {
	hover: { light: 0.04, dark: 0.03 },
	pressed: { light: 0.08, dark: 0.06 },
};

export const themeParameterRanges = {
	accentHue: [0, 360],
	groundOffset: [-180, 180],
	groundLightness: [0.88, lightnessCeiling],
	chromaScale: [0, 1.5],
};

const chromaBases = {
	backgroundQuiet: 0.015,
	backgroundLoud: 0.02,
	strokeQuiet: 0.018,
	strokeLoud: 0.022,
	inkPrimary: 0.03,
	inkMuted: 0.022,
	onloud: 0.008,
	brand: 0.11,
	brandSoft: 0.06,
	brandSubtle: 0.035,
	brandStrokeSubtle: 0.045,
	expressionInk: 0.045,
	expressionStroke: 0.055,
};

// These sit on the ground hue, so they scale with the ground the same way the surface base does.
const groundScaledChroma = new Set(["backgroundQuiet", "backgroundLoud", "strokeQuiet", "strokeLoud"]);

function clamp(value, minimum, maximum) {
	return Math.max(minimum, Math.min(maximum, value));
}

function round(value, digits) {
	return Number.parseFloat(value.toFixed(digits));
}

const fromGround = (offset) => (groundLightness) => groundLightness + offset;
const atLightness = (lightness) => () => lightness;

// Positive surface offsets compress as the ground approaches the lightness ceiling.
const surfaceStep = (offset) => (groundLightness) => groundLightness + offset * (offset > 0
	? Math.min(1, (lightnessCeiling - groundLightness) / surfaceHeadroomSpan)
	: 1);

// Quiet backgrounds close on the ground as it darkens, keeping room for the foreground ramp below them.
const quietBackgroundStep = (offset) => (groundLightness) => groundLightness - offset * clamp(
	(groundLightness - quietBackground.floor) / quietBackground.span,
	quietBackground.minimum,
	1,
);

// interaction is the light-mode direction of the hover and pressed lightness shift; dark mode
// negates it, 0 holds the resting value, and null emits no interaction tokens at all.
const neutralAndBrandSpec = [
	{ path: "color.surface.neutral.farther", light: surfaceStep(-0.025), dark: surfaceStep(-0.025), chroma: "surface", hue: "ground", interaction: -1 },
	{ path: "color.surface.neutral.far", light: surfaceStep(0), dark: surfaceStep(0), chroma: "surface", hue: "ground", interaction: -1 },
	{ path: "color.surface.neutral.near", light: surfaceStep(0.02), dark: surfaceStep(0.02), chroma: "surface", hue: "ground", interaction: -1 },
	{ path: "color.surface.neutral.nearer", light: surfaceStep(0.038), dark: surfaceStep(0.038), chroma: "surface", hue: "ground", interaction: -1 },
	{ path: "color.surface.neutral.translucent", light: surfaceStep(-0.025), dark: surfaceStep(-0.025), chroma: "surface", hue: "ground", interaction: -1, alpha: 0.5 },

	{ path: "color.background.neutral.heavy", light: atLightness(0.22), dark: atLightness(0.94), chroma: "backgroundLoud", hue: "ground", interaction: 1 },
	{ path: "color.background.neutral.loud", light: atLightness(0.55), dark: atLightness(0.6), chroma: "backgroundLoud", hue: "ground", interaction: 1 },
	{ path: "color.background.neutral.soft", light: quietBackgroundStep(0.06), dark: fromGround(0.1), chroma: "backgroundQuiet", hue: "ground", interaction: -1 },
	{ path: "color.background.neutral.subtle", light: quietBackgroundStep(0.03), dark: fromGround(0.06), chroma: "backgroundQuiet", hue: "ground", interaction: -1 },
	{ path: "color.background.neutral.transparent", light: atLightness(0.22), dark: atLightness(0.94), chroma: "backgroundLoud", hue: "ground", interaction: -1, alpha: 0 },
	{ path: "color.background.neutral.disabled", light: quietBackgroundStep(0.02), dark: fromGround(0.04), chroma: "backgroundQuiet", hue: "ground", interaction: null },

	{ path: "color.background.brand.heavy", light: atLightness(0.42), dark: atLightness(0.72), chroma: "brand", hue: "accent", interaction: 1 },
	{ path: "color.background.brand.loud", light: atLightness(0.52), dark: atLightness(0.66), chroma: "brand", hue: "accent", interaction: 1 },
	{ path: "color.background.brand.soft", light: atLightness(0.9), dark: atLightness(0.32), chroma: "brandSoft", hue: "accent", interaction: -1 },
	{ path: "color.background.brand.subtle", light: atLightness(0.95), dark: atLightness(0.26), chroma: "brandSubtle", hue: "accent", interaction: -1 },

	// The scrim stays ink-dark in both schemes; a light scrim would brighten the page it is meant to recede.
	{ path: "color.background.overlay", light: atLightness(0.22), dark: atLightness(0.22), chroma: "inkPrimary", hue: "accent", interaction: null, alpha: { light: 0.36, dark: 0.62 } },

	{ path: "color.stroke.neutral.heavy", light: atLightness(0.22), dark: atLightness(0.87), chroma: "strokeLoud", hue: "ground", interaction: 1 },
	{ path: "color.stroke.neutral.loud", light: atLightness(0.55), dark: atLightness(0.6), chroma: "strokeLoud", hue: "ground", interaction: 1 },
	{ path: "color.stroke.neutral.soft", light: atLightness(0.68), dark: atLightness(0.45), chroma: "strokeQuiet", hue: "ground", interaction: -1 },
	{ path: "color.stroke.neutral.subtle", light: fromGround(-0.1), dark: fromGround(0.14), chroma: "strokeQuiet", hue: "ground", interaction: -1 },
	{ path: "color.stroke.neutral.transparent", light: atLightness(0.22), dark: atLightness(0.87), chroma: "strokeLoud", hue: "ground", interaction: -1, alpha: 0 },
	{ path: "color.stroke.neutral.onloud", light: atLightness(0.98), dark: atLightness(0.2), chroma: "onloud", hue: "ground", interaction: 0 },

	{ path: "color.stroke.brand.loud", light: atLightness(0.52), dark: atLightness(0.66), chroma: "brand", hue: "accent", interaction: 1 },
	{ path: "color.stroke.brand.soft", light: atLightness(0.72), dark: atLightness(0.52), chroma: "brand", hue: "accent", interaction: -1 },
	{ path: "color.stroke.brand.subtle", light: atLightness(0.88), dark: atLightness(0.36), chroma: "brandStrokeSubtle", hue: "accent", interaction: -1 },

	{ path: "color.stroke.focus.outer", light: atLightness(0.52), dark: atLightness(0.66), chroma: "brand", hue: "accent", interaction: null },
	{ path: "color.stroke.focus.inner", light: atLightness(0.98), dark: atLightness(0.2), chroma: "onloud", hue: "accent", interaction: null },

	{ path: "color.foreground.neutral.primary", light: atLightness(0.22), dark: atLightness(0.94), chroma: "inkPrimary", hue: "accent", interaction: -1 },
	{ path: "color.foreground.neutral.secondary", light: atLightness(0.33), dark: atLightness(0.81), chroma: "inkMuted", hue: "accent", interaction: -1 },
	{ path: "color.foreground.neutral.tertiary", light: atLightness(0.44), dark: atLightness(0.68), chroma: "inkMuted", hue: "accent", interaction: -1 },
	{ path: "color.foreground.neutral.onloud", light: atLightness(0.98), dark: atLightness(0.2), chroma: "onloud", hue: "accent", interaction: 0 },
	{ path: "color.foreground.neutral.disabled", light: atLightness(0.7), dark: atLightness(0.5), chroma: "inkMuted", hue: "accent", interaction: null },

	{ path: "color.foreground.brand.primary", light: atLightness(0.48), dark: atLightness(0.76), chroma: "brand", hue: "accent", interaction: -1 },
	{ path: "color.foreground.brand.onloud", light: atLightness(0.98), dark: atLightness(0.2), chroma: "onloud", hue: "accent", interaction: 0 },
];

export const expressionHues = [
	["gray", 0], ["navy", 250], ["blue", 230], ["green", 150], ["lime", 130],
	["yellow", 95], ["pumpkin", 55], ["red", 25], ["pink", 350], ["purple", 305],
];

// Hue comes from the palette; lightness and chroma come from the theme, so a block stays the
// same hue but tracks the ground and shares the system's saturation ceiling. The offsets mirror
// between schemes: a block sits below a light ground and above a dark one.
function expressionSpec([name, hue]) {
	const shared = { hue, achromatic: name === "gray", interaction: null };

	return [
		{ path: `color.background.expression.${name}.subtle`, light: fromGround(-0.055), dark: fromGround(0.055), chroma: "expressionFill", ...shared },
		{ path: `color.background.expression.${name}.soft`, light: fromGround(-0.1), dark: fromGround(0.1), chroma: "expressionFill", ...shared },
		{ path: `color.stroke.expression.${name}`, light: fromGround(-0.14), dark: fromGround(0.14), chroma: "expressionStroke", ...shared },
		{ path: `color.foreground.expression.${name}`, light: atLightness(0.28), dark: atLightness(0.9), chroma: "expressionInk", ...shared },
	];
}

const colorTokenSpec = [...neutralAndBrandSpec, ...expressionHues.flatMap(expressionSpec)];

export function normalizeTheme(parameters) {
	const theme = {};

	for (const [name, [minimum, maximum]] of Object.entries(themeParameterRanges)) {
		const value = parameters[name];

		if (typeof value !== "number" || Number.isNaN(value)) {
			throw new Error(`Theme parameter ${name} must be a number.`);
		}

		if (value < minimum || value > maximum) {
			throw new Error(`Theme parameter ${name} must be between ${minimum} and ${maximum}, got ${value}.`);
		}

		theme[name] = value;
	}

	theme.groundHue = ((theme.accentHue + theme.groundOffset) % 360 + 360) % 360;

	return theme;
}

function inSrgbGamut(lightness, chroma, hue) {
	const radians = (hue * Math.PI) / 180;
	const axisA = chroma * Math.cos(radians);
	const axisB = chroma * Math.sin(radians);
	const long = (lightness + 0.3963377774 * axisA + 0.2158037573 * axisB) ** 3;
	const medium = (lightness - 0.1055613458 * axisA - 0.0638541728 * axisB) ** 3;
	const short = (lightness - 0.0894841775 * axisA - 1.291485548 * axisB) ** 3;

	return [
		4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
		-1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
		-0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
	].every((channel) => channel >= -1e-6 && channel <= 1 + 1e-6);
}

function maxSrgbChroma(lightness, hue) {
	let reachable = 0;
	let unreachable = 0.4;

	if (inSrgbGamut(lightness, unreachable, hue)) return unreachable;

	for (let step = 0; step < 24; step += 1) {
		const middle = (reachable + unreachable) / 2;

		if (inSrgbGamut(lightness, middle, hue)) reachable = middle;
		else unreachable = middle;
	}

	return reachable;
}

function baseChroma(key, groundLightness) {
	const surfaceBase = clamp(
		surfaceChroma.base + (surfaceChroma.anchor - groundLightness) * surfaceChroma.slope,
		surfaceChroma.floor,
		surfaceChroma.ceiling,
	);

	if (key === "surface") return surfaceBase;

	if (key === "expressionFill") {
		return Math.min(surfaceBase * expressionChroma.fillMultiplier, expressionChroma.fillCeiling);
	}

	if (!groundScaledChroma.has(key)) return chromaBases[key];

	const multiplier = surfaceBase / surfaceChroma.base;

	return chromaBases[key] * (key === "backgroundQuiet" ? Math.min(multiplier, quietBackground.chromaCap) : multiplier);
}

function resolveChroma(spec, theme, lightness, hue) {
	const scaled = Math.min(baseChroma(spec.chroma, theme.groundLightness) * theme.chromaScale, chromaCeiling);
	const tapered = lightness > taperAbove || lightness < taperBelow ? scaled * taperFactor : scaled;
	// The surface floor is applied after the taper, or a near-white ground loses its tint entirely.
	const floored = spec.chroma === "surface"
		? Math.max(tapered, surfaceChroma.floor * theme.chromaScale)
		: tapered;

	return Math.min(floored, maxSrgbChroma(lightness, hue) * gamutHeadroom);
}

function themeColor(spec, theme, scheme, lightnessOverride) {
	const ground = scheme === "light" ? theme.groundLightness : darkGroundLightness;
	const lightness = clamp(lightnessOverride ?? spec[scheme](ground), 0, lightnessCeiling);
	const hue = typeof spec.hue === "number"
		? spec.hue
		: (spec.hue === "ground" ? theme.groundHue : theme.accentHue);

	return {
		lightness,
		chroma: spec.achromatic ? 0 : resolveChroma(spec, theme, lightness, hue),
		hue,
		alpha: typeof spec.alpha === "object" ? spec.alpha[scheme] : spec.alpha ?? 1,
	};
}

function interactionColor(spec, theme, scheme, state) {
	const resting = themeColor(spec, theme, scheme);

	if (spec.interaction === 0) return resting;

	if (resting.alpha === 0) {
		return { ...resting, alpha: transparentInteractionAlpha[state][scheme] };
	}

	const direction = scheme === "light" ? spec.interaction : -spec.interaction;

	return themeColor(spec, theme, scheme, resting.lightness + direction * interactionLightnessStep[state]);
}

export function formatOklch({ lightness, chroma, hue, alpha }) {
	const components = `${round(lightness, 3)} ${round(chroma, 4)} ${round(hue, 1)}`;

	return alpha >= 1 ? `oklch(${components})` : `oklch(${components} / ${round(alpha * 100, 2)}%)`;
}

export function variableName(tokenPath) {
	return `--oneds-${tokenPath
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replaceAll(".", "-")
		.toLowerCase()}`;
}

export function resolveColorTokens(theme) {
	return colorTokenSpec.map((spec) => ({
		path: spec.path,
		light: themeColor(spec, theme, "light"),
		dark: themeColor(spec, theme, "dark"),
	}));
}

export function resolveInteractionColorTokens(theme) {
	return colorTokenSpec.flatMap((spec) => {
		if (spec.interaction === null) return [];

		return ["hover", "pressed"].map((state) => ({
			path: `${spec.path}.${state}`,
			light: interactionColor(spec, theme, "light", state),
			dark: interactionColor(spec, theme, "dark", state),
		}));
	});
}

export function generatedEntries(resolved) {
	return resolved.map(({ path: tokenPath, light, dark }) => [
		tokenPath,
		{ light: formatOklch(light), dark: formatOklch(dark) },
	]);
}

// The exact `--name: light-dark(light, dark)` pairs the build writes into tokens.css, so the live
// preview and the generated stylesheet cannot drift.
export function themeCustomProperties(parameters) {
	const theme = normalizeTheme(parameters);

	return [
		...generatedEntries(resolveColorTokens(theme)),
		...generatedEntries(resolveInteractionColorTokens(theme)),
	].map(([tokenPath, value]) => [variableName(tokenPath), `light-dark(${value.light}, ${value.dark})`]);
}
