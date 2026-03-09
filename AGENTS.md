# AGENTS.md

This file defines Codex operating rules for this repository.

## Core Rules

- Keep diffs minimal and production-grade.
- Do not introduce extra dependencies unless explicitly required.
- Use `pnpm` only for package operations.
- Use `pnpm dlx` instead of `npx` for one-off package commands.
- Prefer TypeScript everywhere.
- Keep architecture modular and simple.
- Prefer child agents for clearly parallelizable work.
- Update the relevant docs in the same task as any repo, tooling, or workflow change.
- Maintain living `docs/plan.md` and `docs/decisions.md`.
- Run lint, typecheck, tests, and build before each completion checkpoint.
- Keep mobile UX first.
- Preserve legal safety by avoiding trademarked branding, logos, packaging, copied copy, and copied art.
- Keep multiplayer turn validation server-authoritative.
- Keep the 3D layer presentational; rules truth belongs in shared headless packages and the server.
- Do not add app-specific screens or starter-only boilerplate outside the agreed Cornerfall MVP scope.
- Prefer lightweight dependencies and avoid overengineering.
- When the user requests audit-only or approval-gated work, stay non-mutating until they approve implementation.

## Framework Note

- The global preference for Server Components does not apply in this repo because the app uses a Vite + React client architecture with a Cloudflare Worker backend.

## Git + Branching

- Use short-lived branches from `main`:
  - `feat/<topic>`
  - `fix/<topic>`
  - `chore/<topic>`
  - `docs/<topic>`
  - `refactor/<topic>`
- Keep history clean and focused; prefer rebase-based integration.

## Commits

- Use atomic commits, one logical unit per commit.
- Use Conventional Commits format: `type(scope): summary`.
- Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`.
- Preferred scopes in this repo: `repo`, `core`, `protocol`, `server`, `web`, `render`, `pwa`, `docs`, `codex`.

## Required Checks Before Finishing

Run both commands and ensure they pass:

```bash
pnpm lint
pnpm typecheck
```

For milestone checkpoints in this repo, also run:

```bash
pnpm test
pnpm build
```

## Required Completion Report

When Codex finishes a task, include:

1. Files changed.
2. Commands run.
3. Results for lint/typecheck/build (when build is requested).
