import { execFileSync, spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const siteDirectory = path.join(repositoryRoot, "site");
const configPath = path.join(repositoryRoot, "vibehub.json");
const endpoint = "https://vibehub.microsoft.com/api/external/push";
const projectEnvironmentVariable = "VIBEHUB_PROJECT_ONEDS";
const createProject = process.argv.includes("--create");
const dryRun = process.argv.includes("--dry-run");

const config = JSON.parse(await readFile(configPath, "utf8"));
const environmentProjectId = process.env[projectEnvironmentVariable] || "";

if (config.projectId && environmentProjectId && config.projectId !== environmentProjectId) {
	throw new Error(
		`Project ID mismatch: vibehub.json and ${projectEnvironmentVariable} identify different projects.`,
	);
}

const projectId = config.projectId || environmentProjectId;

if (!projectId && !createProject && !dryRun) {
	throw new Error(
		`No OneDS VibeHub project ID is configured. Use --create only for the intentional first deployment.`,
	);
}

if (projectId && createProject) {
	throw new Error("OneDS already has a VibeHub project ID; refusing to create a duplicate.");
}

if (!dryRun && !process.env.VIBEHUB_API_KEY) {
	throw new Error("VIBEHUB_API_KEY is not set. Source ~/.env.vibehub before deploying.");
}

execFileSync(process.execPath, [path.join(scriptDirectory, "check.mjs")], {
	cwd: repositoryRoot,
	stdio: "inherit",
});

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "oneds-vibehub-"));
const stagingDirectory = path.join(temporaryDirectory, "site");
const archivePath = path.join(temporaryDirectory, "oneds.zip");

try {
	await cp(siteDirectory, stagingDirectory, { recursive: true });
	await cp(path.join(repositoryRoot, "components"), path.join(stagingDirectory, "components"), {
		recursive: true,
	});
	await cp(path.join(repositoryRoot, "tokens.css"), path.join(stagingDirectory, "tokens.css"));

	const siteEntries = await readdir(stagingDirectory, { withFileTypes: true });
	const htmlFiles = siteEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".html"));

	for (const htmlFile of htmlFiles) {
		const htmlPath = path.join(stagingDirectory, htmlFile.name);
		const source = await readFile(htmlPath, "utf8");
		const deployed = source
			.replaceAll('href="../tokens.css"', 'href="tokens.css"')
			.replaceAll('href="../components/', 'href="components/');

		if (/\b(?:href|src)="\.\.\//.test(deployed)) {
			throw new Error(`${htmlFile.name} still contains a parent-relative runtime URL.`);
		}

		await writeFile(htmlPath, deployed);
	}

	const archiveProcess = spawnSync("zip", ["-qr", archivePath, ".", "-x", ".*", "__MACOSX/*"], {
		cwd: stagingDirectory,
		stdio: "inherit",
	});

	if (archiveProcess.error) {
		throw archiveProcess.error;
	}

	if (archiveProcess.status !== 0) {
		throw new Error(`zip exited with status ${archiveProcess.status}.`);
	}

	if (dryRun) {
		console.log(`VibeHub package validated with ${htmlFiles.length} HTML pages at archive root.`);
	}

	if (!dryRun) {
		const form = new FormData();
		const archiveData = await readFile(archivePath);
		form.append("file", new Blob([archiveData], { type: "application/zip" }), "oneds.zip");
		form.append("description", config.description);
		form.append("tags", config.tags);

		if (projectId) {
			form.append("projectId", projectId);
		} else {
			form.append("name", config.name);
			form.append("slug", config.slug);
			form.append("isPrivate", String(config.isPrivate));
			form.append("xrayEnabled", String(config.xrayEnabled));
		}

		const response = await fetch(endpoint, {
			method: "POST",
			headers: { "X-API-Key": process.env.VIBEHUB_API_KEY },
			body: form,
		});
		const responseText = await response.text();
		let result;

		try {
			result = JSON.parse(responseText);
		} catch {
			throw new Error(`VibeHub returned HTTP ${response.status} with a non-JSON response.`);
		}

		if (!response.ok) {
			throw new Error(`VibeHub returned HTTP ${response.status}: ${result.error || "upload failed"}`);
		}

		const expectedNewProject = !projectId;

		if (Boolean(result.isNewProject) !== expectedNewProject) {
			throw new Error(
				`Unexpected deployment result: isNewProject was ${String(result.isNewProject)}.`,
			);
		}

		console.log(
			JSON.stringify(
				{
					id: result.id,
					url: config.url || result.url,
					canonicalUrl: result.url,
					slug: result.slug || config.slug,
					versionId: result.versionId,
					isNewProject: result.isNewProject,
				},
				null,
				2,
			),
		);
	}
} finally {
	await rm(temporaryDirectory, { recursive: true, force: true });
}