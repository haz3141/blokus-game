---
name: milestone-orchestrator
description: Use this skill when a repo task needs milestone planning, ownership splits, commit boundaries, or checkpoint coordination across multiple agents. It is especially useful for greenfield builds, large feature slices, and multi-package work.
---

# Milestone Orchestrator

Use this skill when the task spans multiple subsystems and needs an execution order that leaves the repo in a working state after each milestone.

## Workflow

1. Ground in the current repo state before assigning work.
2. Break the task into milestones that can each end with passing checks.
3. Assign each milestone a single owner or a disjoint set of child-agent write paths.
4. Define the verification command for each milestone before implementation starts.
5. Define atomic conventional commit boundaries before the first edit.

## Milestone Rules

- Each milestone should be shippable or at least internally coherent.
- Do not mix root-tooling edits, backend protocol changes, and UI polish in one commit unless they are inseparable.
- Update `docs/plan.md` at milestone start and milestone finish.
- Record architectural decisions in `docs/decisions.md` when they affect future implementation choices.

## Ownership Rules

- Prefer child agents only when write paths can stay disjoint.
- If two agents need the same files, keep one owner and let the parent integrate.
- Require each child agent to report changed files, commands run, check results, and integration notes.

## Checkpoint Template

- Goal: one sentence outcome
- Files/paths owned: explicit directories
- Checks: exact commands
- Commit: exact conventional commit message
- Integration notes: assumptions or cross-package contracts
