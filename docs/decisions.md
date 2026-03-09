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

### Support only 2-player and 4-player rooms in the MVP

- Decision: expose only duel and classic room sizes in the shipped product.
- Rationale: the request requires 2-player and 4-player configurations, and limiting the surface area keeps the rules, UI, and room validation aligned.
- Consequences: room creation, protocol schemas, and deployment docs all assume `2 | 4` players.

### Keep the 3D layer presentational

- Decision: the renderer will visualize canonical state and local previews, but move legality will remain in shared headless logic.
- Rationale: this prevents client/server drift and keeps rendering code maintainable.
- Consequences: rules utilities must expose enough information for previews without moving validation into the scene.

### Broadcast full canonical snapshots after every accepted mutation

- Decision: the room actor rebroadcasts full room snapshots rather than incremental patches.
- Rationale: this keeps reconnect behavior simple, makes desync recovery straightforward, and reduces protocol complexity for the MVP.
- Consequences: payloads are larger than a patch stream, but the room fanout and turn cadence are low enough for this to be a reasonable tradeoff.

### Auto-join the room creator on redirect to the lobby

- Decision: after creating a room, the web client redirects to the room URL with a short-lived auto-join instruction for the creator.
- Rationale: this removes friction from the host flow and matches the requirement that room creation and sharing feel immediate.
- Consequences: guests still explicitly join from the shared URL, while refresh-based reconnect continues to rely on stored room sessions.

### Configure repo-scoped Codex skills

- Decision: create repo-local skills for milestone orchestration, rules review, Worker rooms, mobile PWA QA, R3F board work, and release readiness.
- Rationale: these workflows are specific enough to be useful across future work on this repo without polluting global skills.
- Consequences: the skill content and metadata should be maintained when tooling or architecture changes materially.
