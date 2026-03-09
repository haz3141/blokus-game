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

### Use a dark-first tabletop studio design direction for the post-MVP UI pass

- Decision: the UI refresh will follow a dark-first tabletop studio direction with tactile surfaces, restrained warm accents, and clearer board-vs-meta separation.
- Rationale: this direction improves readability and desktop hierarchy without losing the current game-first tone or mobile survivability.
- Consequences: home, lobby, game HUD, and results should all share the same tokenized surface model and typographic hierarchy.

### Adopt a token-first design system with shadcn primitives in the web app

- Decision: add Tailwind v4 and shadcn/ui in `apps/web`, while keeping CSS variables as the design-token source of truth.
- Rationale: the app needs a reusable primitive layer, but tokens must remain repo-owned so the board scene, shared components, and app layouts stay coherent.
- Consequences: web tooling gains `components.json`, path aliases, Tailwind integration, and a `src/components` layer; route-level UI should migrate off ad hoc class clusters.

### Add Storybook docs plus accessibility review for shared UI

- Decision: add Storybook with Autodocs and `addon-a11y`, but defer the heavier Storybook interaction-test stack.
- Rationale: the repo needs isolated UI review and documentation without turning the refactor into a tooling-heavy rewrite.
- Consequences: shared primitives and game UI wrappers should carry stories, and Playwright remains the main end-to-end interaction safety net.
