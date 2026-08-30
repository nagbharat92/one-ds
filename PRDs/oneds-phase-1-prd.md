# OneDS Rebuild — Phase 1 PRD: Fresh shadcn + Tailwind + React Foundation

## Prompt to use with this PRD (VS Code, Opus 4.8)

Paste this PRD into the agent, then use this as your instruction:

> Read this PRD in full before doing anything. Phase 0 (deleting the old system and pushing a clean slate) is already done. Your job in Phase 1 is to stand up a fresh React + Tailwind + shadcn project from scratch, wire up the shadcn MCP so you can add components on demand, install a starter set of components, and build a component showcase site modeled on shadcn's own docs site. Before writing code, read the current empty repo state, confirm what's there, and give me a short plan for the done-when checklist below. Then proceed in one pass. Ask me before installing anything with a heavy footprint or making a structural choice not specified here.

---

## Goal

A clean, working React + Tailwind + shadcn foundation, with the shadcn MCP connected so components can be pulled in on demand, and a component showcase site (modeled on shadcn's own site) where every component can be seen and controlled in one place.

This is deliberately simple. No custom theme engine, no bespoke token vocabulary, no migration of old components. Just a standard, well-structured shadcn system that works and that we build on later.

## Scope

In scope:
- Fresh React project (Vite).
- Tailwind installed and configured.
- shadcn initialized (real CLI).
- shadcn MCP connected in VS Code so the agent can add components on demand.
- A starter set of shadcn components installed.
- A component showcase site modeled on shadcn's docs site layout: sidebar navigation, a page per component, live preview plus code.

Out of scope (later phases):
- The generative OKLCH theme.
- Custom token vocabulary.
- Extension shell / CRXJS.
- Any port of the old 51 components.

## Requirements

### 1. Fresh React + Vite project
Standard Vite React + TypeScript setup. Clean folder structure. Nothing carried over from the old system.

### 2. Tailwind
Tailwind installed and working, configured for shadcn (the shadcn init expects a specific Tailwind setup — follow shadcn's official requirements, don't improvise).

### 3. shadcn initialized
Run the real shadcn init. Accept sensible defaults for now (default style, default base color, CSS variables enabled). We customize the theme in a later phase, not now.

### 4. shadcn MCP connected
Set up the shadcn MCP server in VS Code's `mcp.json` so the agent can add and query shadcn components on demand rather than hand-writing them. Confirm the connection works by having the agent use it to add at least one component.

### 5. Starter component set
Install a practical starter set via the MCP or CLI: button, input, dialog, dropdown-menu, select, card, tabs, tooltip, and a few more the agent judges core. Not the whole catalog — the common ones.

### 6. Component showcase site
Build a showcase site modeled on shadcn's own docs site:
- Sidebar navigation listing components.
- A page per component.
- Each page shows a live rendered preview and the code.
- Clean, navigable, so you can see and control every component in one place.

Model the layout on shadcn's site rather than designing from scratch. shadcn's site is open source; reference its structure.

## Done when

- [ ] Fresh Vite React + TypeScript project runs with `npm run dev`.
- [ ] Tailwind is installed and working.
- [ ] shadcn is initialized with CSS variables enabled.
- [ ] The shadcn MCP is connected in VS Code and confirmed working by adding a component through it.
- [ ] A starter set of shadcn components is installed and renders.
- [ ] A showcase site exists with sidebar nav, one page per component, and live preview plus code per component.
- [ ] A short README documents how to run the project and how to add a new component via the MCP.

## Constraints

- Keep it simple. Standard shadcn defaults. No custom theming this phase.
- Use the real shadcn CLI and MCP, not agent-approximated components.
- One pass. Ask before any heavy or non-obvious structural choice.
- Do not rebuild or reference anything from the deleted old system.

## Notes for the agent

- shadcn has an official MCP; find its current setup instructions and wire it into `mcp.json` per its docs.
- shadcn's docs site is open source — use its component-page and sidebar structure as the model for the showcase rather than inventing a layout.
- Default base color and style are fine; we reskin later.
