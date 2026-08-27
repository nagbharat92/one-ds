import { themeCustomProperties, themeParameterRanges } from "../scripts/theme-engine.mjs";

const form = document.querySelector("[data-theme-preview]");

if (form) {
	const parameters = ["accentHue", "groundOffset", "groundLightness", "chromaScale"];
	const hueNames = [
		["Red", 25], ["Orange", 55], ["Yellow", 95], ["Lime", 130], ["Green", 155],
		["Teal", 195], ["Blue", 230], ["Navy", 262], ["Purple", 305], ["Pink", 350],
	];
	// Highest matching threshold wins, so keep these in descending order.
	const paperLightnessNames = [
		[0.975, "Almost white"], [0.96, "Barely tinted"], [0.94, "Tinted"], [0.91, "Soft colour"], [0, "Coloured"],
	];
	// At zero strength the paper is grey, so the tint wording would be untrue.
	const paperGreyNames = [
		[0.975, "Almost white"], [0.96, "Off white"], [0.94, "Light grey"], [0.91, "Soft grey"], [0, "Grey"],
	];
	const strengthNames = [[1.2, "Strong"], [0.8, "Normal"], [0.01, "Soft"], [0, "None"]];
	const inputs = new Map(parameters.map((name) => [name, form.querySelector(`[data-parameter="${name}"]`)]));
	const outputs = new Map(parameters
		.map((name) => [name, form.querySelector(`[data-parameter-value="${name}"]`)])
		.filter(([, element]) => element));
	const paperChoices = [...form.querySelectorAll("[data-paper-choice]")];
	const status = form.querySelector("[data-preview-status]");
	const copyControl = form.querySelector("[data-copy-theme]");
	const resetControl = form.querySelector("[data-reset-theme]");
	const copyLabel = copyControl ? copyControl.textContent : "";
	const applied = [];

	function hueName(hue) {
		let closest = hueNames[0];
		let shortest = Number.POSITIVE_INFINITY;

		for (const entry of hueNames) {
			const around = (((hue - entry[1]) % 360) + 360) % 360;
			const distance = Math.min(around, 360 - around);

			if (distance < shortest) {
				shortest = distance;
				closest = entry;
			}
		}

		return closest[0];
	}

	function describe(table, value) {
		return (table.find(([threshold]) => value >= threshold) ?? table.at(-1))[1];
	}

	function paperLightness(theme) {
		return describe(theme.chromaScale === 0 ? paperGreyNames : paperLightnessNames, theme.groundLightness);
	}

	function paperName(offset) {
		const choice = paperChoices.find((control) => Number(control.dataset.paperChoice) === offset);

		return choice ? choice.textContent.toLowerCase() : `${offset} degrees from the accent`;
	}

	function currentTheme() {
		return Object.fromEntries(parameters.map((name) => [name, Number(inputs.get(name).value)]));
	}

	function themeJson(theme) {
		const lines = parameters.map((name) => `\t"${name}": ${theme[name]}`);

		return `{\n${lines.join(",\n")}\n}\n`;
	}

	function apply() {
		const theme = currentTheme();
		const root = document.documentElement;

		outputs.get("accentHue").textContent = hueName(theme.accentHue);
		outputs.get("groundLightness").textContent = paperLightness(theme);
		outputs.get("chromaScale").textContent = describe(strengthNames, theme.chromaScale);

		for (const control of paperChoices) {
			control.setAttribute("aria-pressed", String(Number(control.dataset.paperChoice) === theme.groundOffset));
		}

		for (const name of applied) root.style.removeProperty(name);
		applied.length = 0;

		for (const [name, value] of themeCustomProperties(theme)) {
			root.style.setProperty(name, value);
			applied.push(name);
		}

		if (status) {
			const colour = theme.chromaScale === 0 ? "No colour" : `${hueName(theme.accentHue)} accent`;
			const paper = `${paperName(theme.groundOffset)} paper, ${paperLightness(theme).toLowerCase()}`;

			status.textContent = `${colour} on ${paper}. ${applied.length} tokens applied.`;
		}
	}

	for (const name of parameters) {
		const input = inputs.get(name);

		if (input.type === "range") {
			const [minimum, maximum] = themeParameterRanges[name];

			input.min = String(minimum);
			input.max = String(maximum);
			input.addEventListener("input", apply);
		}
	}

	for (const control of paperChoices) {
		control.addEventListener("click", () => {
			inputs.get("groundOffset").value = control.dataset.paperChoice;
			apply();
		});
	}

	// The documented ranges come from the engine so the table cannot drift from the sliders.
	for (const cell of document.querySelectorAll("[data-parameter-range]")) {
		const range = themeParameterRanges[cell.dataset.parameterRange];

		if (range) cell.textContent = `${range[0]} to ${range[1]}`;
	}

	if (resetControl) {
		resetControl.addEventListener("click", () => {
			for (const name of parameters) {
				const input = inputs.get(name);

				input.value = input.defaultValue;
			}

			apply();
		});
	}

	if (copyControl) {
		copyControl.addEventListener("click", async () => {
			const text = themeJson(currentTheme());

			try {
				await navigator.clipboard.writeText(text);
				copyControl.textContent = "Copied";
			} catch {
				copyControl.textContent = "Copy failed";
			}

			setTimeout(() => {
				copyControl.textContent = copyLabel;
			}, 1600);
		});
	}

	// Controls are inert markup until the module runs, so the page still renders from tokens.css.
	form.hidden = false;
	apply();
}
