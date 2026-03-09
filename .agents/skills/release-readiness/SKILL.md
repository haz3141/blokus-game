---
name: release-readiness
description: Use when preparing a repository for delivery by checking docs, commands, tests, deployment notes, verification evidence, and unresolved risks.
---

# Release Readiness

Use this skill at the end of a substantial task to verify that the repo is coherent, documented, and demo-ready.

## Final Pass

- Run the repo’s required lint, typecheck, test, and build commands.
- Run any smoke or E2E coverage that materially validates the shipped flow.
- Confirm setup and run instructions work from a fresh clone perspective.
- Update architecture, deployment, tooling, and product docs when behavior changed.
- Record any cut scope or residual risk explicitly instead of leaving silent gaps.

## Output Expectations

- Summarize what was built.
- List exact commands required to run locally.
- State what was verified versus what remains assumed.
- Call out any environment constraints, optional follow-ups, or known limitations.
