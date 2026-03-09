# Cornerfall

Cornerfall is an original multiplayer polyomino strategy game inspired by classic corner-placement tabletop design, built as a mobile-first installable web app.

## MVP Stack

- `apps/web`: React, TypeScript, Vite, React Three Fiber, Zustand, PWA shell
- `apps/server`: Cloudflare Worker, Durable Objects, WebSockets
- `packages/game-core`: deterministic rules engine and scoring
- `packages/protocol`: shared wire protocol and runtime validation

## Principles

- original branding and art direction
- server-authoritative multiplayer state
- touch-first mobile UX
- 3D presentation without rules logic in the renderer
- small, atomic conventional commits

## Planned Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm test:e2e
```

## Status

The repo is being bootstrapped as a production-quality MVP. See `docs/plan.md` for the active milestone list and `docs/decisions.md` for architectural decisions.
