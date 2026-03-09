---
name: release-readiness
description: Use this skill before shipping a milestone or demo build to verify checks, docs, deployment notes, smoke coverage, and final integration readiness.
---

# Release Readiness

Use this skill near the end of a milestone or before final delivery.

## Required Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e` when the smoke suite exists

## Repo Readiness Checklist

- docs updated for repo, tooling, workflow, or architecture changes
- `docs/plan.md` reflects actual milestone status
- `docs/decisions.md` records material decisions
- README has accurate local run commands
- deployment steps match the current repo layout
- no placeholder TODO graveyard remains in shipped files

## Delivery Notes

- summarize real constraints and cut scope explicitly
- mention any unverified paths
- report commands run and results, not just intent
