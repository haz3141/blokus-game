# Cornerfall Decisions

## 2026-03-09

### Use a pnpm TypeScript workspace

- Decision: build the MVP as a `pnpm` monorepo with `apps/web`, `apps/server`, `packages/game-core`, and `packages/protocol`.
- Rationale: this keeps the rules engine, transport contracts, and app surfaces isolated while remaining simple.
- Consequences: root tooling must support multiple packages cleanly.

### Use Cloudflare Worker + Durable Object multiplayer

- Decision: room state lives in a single Durable Object per room and is synchronized over WebSockets.
- Rationale: the game is turn-based, low-fanout, and benefits from a single authoritative room actor.
- Consequences: the local test harness must cover Durable Object session and reconnection behavior.

### Keep the 3D layer presentational

- Decision: the renderer will visualize canonical state and local previews, but move legality will remain in shared headless logic.
- Rationale: this prevents client/server drift and keeps rendering code maintainable.
- Consequences: rules utilities must expose enough information for previews without moving validation into the scene.

### Configure repo-scoped Codex skills

- Decision: create repo-local skills for milestone orchestration, rules review, Worker rooms, mobile PWA QA, R3F board work, and release readiness.
- Rationale: these workflows are specific enough to be useful across future work on this repo without polluting global skills.
- Consequences: the skill content and metadata should be maintained when tooling or architecture changes materially.
