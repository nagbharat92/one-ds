# OneDS

**Website:** https://nagbharat92.github.io/one-ds/

OneDS is a React and TypeScript design system with an interactive component
showcase. It brings reusable UI components, shared design tokens, and documented
rules together in one place. The showcase lets you try component variants and
inspect their example code, including opt-in visual experiments.

## How it works

- `src/components/ui/` contains the components; `src/styles/` and `src/index.css`
  provide shared styles and tokens.
- `src/showcase/demos/` defines the examples. `src/App.tsx` displays them as
  hash-routed pages (such as `#/button`), and build scripts generate their Code
  views.
- `src/design-system/rules.json` is the source of design rules. See `AGENTS.md`
  for how to apply them. `consumer-package/` is a separate, unpublished local
  pilot for trying the components in another app.

## Run locally

```sh
npm ci
npm run dev
```

Run `npm run build` to type-check and build the site, then `npm run preview` to
inspect the production build. The [GitHub Pages workflow](.github/workflows/deploy-pages.yml)
deploys the showcase from `main` (not the consumer package). In the repository's
**Settings → Pages**, choose **GitHub Actions** as the source before pushing.
