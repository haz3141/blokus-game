# Cornerfall

Cornerfall is an original multiplayer polyomino strategy game inspired by classic corner-placement board play, built as a mobile-first installable PWA. It supports quick room creation, link sharing, reconnect after refresh, authoritative turn validation, and a presentational 3D board that stays touch-friendly on phones.

## What’s Included

- instant room creation at `/` and room play at `/play/:roomId`
- 2-player duel mode on a `14x14` board
- 4-player classic mode on a `20x20` board
- Cloudflare Worker + Durable Object room authority with WebSocket sync
- shared TypeScript rules engine and wire protocol
- installable PWA shell with offline support for static routes
- mobile smoke coverage for create, join, play, and reconnect

## Repo Layout

- `apps/web`: React, Vite, React Router, Zustand, React Three Fiber, PWA shell
- `apps/server`: Cloudflare Worker and Durable Object room service
- `packages/game-core`: deterministic rules engine, scoring, and move validation
- `packages/protocol`: shared runtime-validated messages and room snapshots
- `docs`: plan, decisions, rules, tooling, and deployment notes

## Local Development

```bash
pnpm install
pnpm dev
```

That starts:

- the Worker locally on `http://127.0.0.1:8787`
- the web app on `http://127.0.0.1:5173`

You can also run them separately:

```bash
pnpm --filter @cornerfall/server dev
pnpm --filter @cornerfall/web dev
```

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
pnpm test:e2e
```

## Environment

No secrets are required for the MVP. `apps/web` can point at a different backend with:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8787
```

See `.env.example` for the expected shape.

## Architecture Notes

- The Worker is authoritative for room state and all committed turns.
- The client can preview placements locally, but every move is revalidated on the server.
- Durable Objects broadcast canonical snapshots with a monotonic `revision`.
- The renderer is presentational only; rules logic lives in `packages/game-core`.
- The app avoids trademarked names, assets, logos, and copied physical-game branding.

## Deployment

See [docs/deployment.md](/Users/hazael/Code/blokus-game/docs/deployment.md) for Cloudflare deployment steps.

## Additional Docs

- [docs/plan.md](/Users/hazael/Code/blokus-game/docs/plan.md)
- [docs/decisions.md](/Users/hazael/Code/blokus-game/docs/decisions.md)
- [docs/game-rules.md](/Users/hazael/Code/blokus-game/docs/game-rules.md)
- [docs/tooling.md](/Users/hazael/Code/blokus-game/docs/tooling.md)
