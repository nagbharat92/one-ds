---
name: deploy-oneds
description: "Deploy or publish the OneDS documentation site to its existing Microsoft VibeHub project. Use when the user says deploy, publish, release, push live, update VibeHub, or host OneDS."
---

# Deploy OneDS

Deploy the static catalog to the project configured in `vibehub.json`.

## Procedure

1. Read `vibehub.json` and confirm `projectId` is present.
2. Confirm `~/.env.vibehub` exists and contains `VIBEHUB_API_KEY`. Never print or commit the key.
3. Check the key expiry comments and warn if expiry is within seven days.
4. Run `set -a; source ~/.env.vibehub; set +a; node scripts/deploy-vibehub.mjs`.
5. Verify the response has `isNewProject: false` for every routine deployment.
6. Open the configured URL and verify the catalog loads.
7. Report the URL and `versionId`.

Never pass `--create` after the initial project has been created. A missing project ID is a blocker because omitting it would create a duplicate project.