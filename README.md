# OneDS

OneDS is a small, dependency-free design system built with plain HTML and CSS. It provides a shared token vocabulary, reusable component packages, an agent-readable manifest, automated rule checks, and a static reference catalog.

The project is designed to be linked into consuming repositories. Applications reuse matching OneDS components verbatim and keep project-specific patterns local until they are ready to become shared components.

## What is included

- Design tokens for color, typography, spacing, shape, sizing, motion, opacity, elevation, and component geometry.
- Light and dark semantic themes selected with `data-oneds-theme`.
- Accessible HTML and token-only CSS component packages.
- A manifest that records each component's purpose, usage boundary, and build status.
- A checker that catches literal design values, undefined tokens, incomplete packages, manifest drift, and inline style attributes.
- A static documentation catalog covering setup, colors, typography, tokens, themes, components, and generation rules.

OneDS has no runtime dependencies and no application build step.

## Project structure

```text
components/                 Component CSS, HTML, and usage guidance
site/                       Static reference catalog
tokens/oneds.tokens.json    Token source of truth
tokens.css                  Generated CSS custom properties
MANIFEST.md                 Component inventory and usage boundaries
RULES.md                    Generation rules enforced by the project
AGENT_PROTOCOL.md           Instructions for consuming-project agents
scripts/build-tokens.mjs    Token generator
scripts/check.mjs           Repository and consumer-project checker
```

## Browse the catalog

Serve the repository root with any static file server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/site/index.html`.

The catalog links the real token and component stylesheets, so its examples always render from the library it documents.

## Deploy to VibeHub

OneDS is configured for its persistent Microsoft VibeHub project in `vibehub.json`. The API key remains outside Git in `~/.env.vibehub`.

Live catalog: https://vibehub.microsoft.com/app/one-ds/

Deploy a new version with:

```sh
set -a
source ~/.env.vibehub
set +a
node scripts/deploy-vibehub.mjs
```

The deployment script runs the OneDS checker, stages the catalog at the archive root, rewrites its local parent-relative stylesheet links for hosting, uploads a new version through the VibeHub API, and reports the live URL and version ID.

Use `node scripts/deploy-vibehub.mjs --dry-run` to validate packaging without making a network request. The `--create` option is reserved for the intentional first deployment and refuses to run after a project ID has been configured.

## Use OneDS in another project

From the root of a consuming project, create a symlink to the local checkout:

```sh
ln -s ~/Documents/SideProjects/oneds oneds
```

Add the symlink to the consuming project's `.gitignore`:

```gitignore
/oneds
```

Install the agent protocol and create a place for project-specific patterns:

```sh
mkdir -p .github src/_local
cp oneds/AGENT_PROTOCOL.md .github/copilot-instructions.md
```

Before writing UI, read `oneds/MANIFEST.md`. Copy a matching package from `oneds/components/<name>/` verbatim. If no component matches, build the pattern in `src/_local/` and mark it with an `ONEDS-CANDIDATE` comment.

## Work with tokens

`tokens/oneds.tokens.json` is the token source of truth. After changing it, regenerate the CSS:

```sh
node scripts/build-tokens.mjs
```

Do not edit `tokens.css` directly.

## Add a component

Each component package has exactly three files:

```text
components/<name>/<name>.css
components/<name>/<name>.html
components/<name>/USAGE.md
```

Use only defined `--oneds-` tokens for visual values. In the same change, update the component's status in `MANIFEST.md` to `built`.

## Run checks

Validate OneDS itself:

```sh
node scripts/check.mjs
```

To validate a consuming project, pass its checker configuration:

```sh
node path/to/oneds/scripts/check.mjs path/to/config.json
```

The configuration defines `generatedTokens`, `components`, `manifest`, `authoredCss`, and `html` paths. Paths are resolved relative to the configuration file and may point to individual files or directories.
