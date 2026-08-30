# OneDS

A clean React + Vite + Tailwind + [shadcn/ui](https://ui.shadcn.com) foundation with a
component showcase site. This is the Phase 1 baseline: standard shadcn defaults,
no custom theming yet.

## Stack

- **React 19** + **TypeScript** (Vite)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** — Radix-based components, Nova preset, `neutral` base color, CSS variables, Lucide icons, Geist font
- **shadcn MCP** wired into VS Code for adding components on demand

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Showcase site

`npm run dev` serves the component showcase, modeled on shadcn's docs site:

- **Sidebar** grouped by category, listing all installed components.
- **One page per component** (hash-routed, e.g. `#/dialog`).
- Each page stacks every named variation as its own live preview.
- Every example includes Preview/Code controls, Reset, and an in-page index.
- Preview and Code share one stable height; long snippets scroll inside the panel.
- Demo links and forms simulate actions without leaving or reloading the showcase.

The showcase is driven by category demo files under
[src/showcase/demos](src/showcase/demos), aggregated in
[src/showcase/registry.tsx](src/showcase/registry.tsx). To add a component to the
showcase, add an entry (with a `Demo` render function and its `code` string) to the
relevant category file — the sidebar and pages update automatically. Variant code
is generated from its `Demo` function before development and production builds;
an explicit `code` string overrides the generated snippet when a curated example
is more useful.

## Adding a component

### Via the shadcn MCP (VS Code)

The MCP server is configured in [`.vscode/mcp.json`](.vscode/mcp.json):

```json
{
  "servers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}
```

1. Open `.vscode/mcp.json` in VS Code and click **Start** above the `shadcn` server
   (or run **MCP: List Servers** → Start).
2. In Copilot Chat (agent mode), ask in natural language, e.g.:
   - "Show me all available components in the shadcn registry"
   - "Add the `popover` and `hover-card` components to my project"
   - "Build a login form using shadcn components"
3. The agent installs the component(s) into `src/components/ui/` via the shadcn registry.

After adding a component, expose it in the showcase by adding an entry to the
matching file under [src/showcase/demos](src/showcase/demos).

### Via the CLI

```bash
npx shadcn@latest add <component>   # e.g. npx shadcn@latest add popover
```

## Project structure

```
src/
  components/
    ui/              # shadcn components (generated)
    code-block.tsx   # code viewer with copy button
    mode-toggle.tsx  # light/dark theme toggle
  showcase/
    generated-example-code.ts # generated source for variant Code views
    types.ts         # shared ComponentEntry type + category order
    registry.tsx     # aggregates all demo files into the registry
    demos/           # one file per category (forms, overlays, data, ...)
  hooks/             # generated hooks (use-mobile)
  lib/utils.ts       # cn() helper
  App.tsx            # showcase layout (sidebar + component pages)
  main.tsx           # providers (theme, tooltip, toaster)
  index.css          # Tailwind + shadcn theme tokens
scripts/
  generate-showcase-code.mjs # extracts variant source from TSX demos
components.json      # shadcn config
.vscode/mcp.json     # shadcn MCP server
```

## Installed components

The showcase contains 65 component pages, including the complete installed
shadcn/ui catalog plus Data Table, Date Picker, Questionnaire, and Typography
compositions. They are grouped into Forms, Selection, Overlays, Navigation,
Data Display, Feedback, Layout, Chat, Date, and Utilities.
