# Tooling Notes

## Codex

- Global multi-agent support is enabled in `~/.codex/config.toml`.
- The official OpenAI Developer Docs MCP server is configured globally as `openaiDeveloperDocs` and was verified in this session with a docs search.
- A general-purpose docs MCP server was added globally as `context7` using `https://mcp.context7.com/mcp`.
- The repo path was added to `~/.codex/config.toml` as a trusted project.
- Repo-scoped skills were scaffolded under `.agents/skills` using the system `skill-creator` skill.
- Repo-scoped custom skills created for this project:
  - `milestone-orchestrator`
  - `polyomino-rules-review`
  - `cloudflare-room-worker`
  - `pwa-mobile-qa`
  - `r3f-board-scene`
  - `release-readiness`

## Asset Note

- The prompt referenced an attached image for agent metadata, but no task-scoped attachment path was exposed to the repo environment during bootstrap.
- The repo carries `.agents/assets/agent-icon.png` as a fallback metadata asset generated from a simple local SVG mark so metadata resolves cleanly.
- The original prompt attachment could not be resolved automatically, so the generated icon is a fallback rather than a copy of the prompt asset.

## Local Tooling Commands

- install dependencies: `pnpm install`
- run everything locally: `pnpm dev`
- run everything on the local network: `pnpm dev:network`
- run shadcn against the web workspace from the repo root: `pnpm shadcn:web -- <args>`
- run shadcn inside the app workspace directly: `cd apps/web && pnpm dlx shadcn@latest <args>`
- run all quality checks: `pnpm check`
- run the mobile smoke flow: `pnpm test:e2e`

## shadcn Workspace Rule

- This repo is a pnpm monorepo, but the shadcn configuration is intentionally app-local in [`apps/web/components.json`](/Users/hazael/Code/blokus-game/apps/web/components.json).
- Do not add a root `components.json` unless the repo gains a shared UI workspace that is meant to own shadcn primitives.
- When running shadcn from the repo root, always target `apps/web` through `pnpm shadcn:web -- <args>` rather than guessing.
