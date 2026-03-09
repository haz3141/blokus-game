# Post-UI Follow-up Audit

Date: 2026-03-09

## Confirmed issues

- `apps/web` is the correct shadcn workspace, but repo-root shadcn usage is easy to get wrong without `-c apps/web` or a wrapper command.
- The production web build still emits a large single-chunk warning:
  - `dist/assets/index-*.js` is about `1,384.52 kB` minified and `396.13 kB` gzip.
- Storybook still emits a non-fatal warning before a successful build:
  - `unable to find package.json for radix-ui`
- Shared UI coverage is good but not complete for mature stateful components such as `RoomStatus`, `TurnIndicator`, `PieceTray`, and `ResultsPanel`.

## Suspected issues

- The main bundle is inflated primarily by the 3D stack and route eagerness:
  - `three`
  - `@react-three/fiber`
  - the active-game route importing `GameView` and `GameScene` up front
- A smaller but still meaningful share of client weight comes from schema parsing pulled into the landing flow via `@cornerfall/protocol`.
- The Storybook warning appears to be package metadata lookup against `radix-ui/package.json`, not a broken install. The package itself resolves and the build succeeds.

## Changes to make

- Keep `apps/web/components.json` as the only authoritative shadcn config.
- Add a repo-root wrapper command so shadcn usage is unambiguous from the monorepo root.
- Document the workspace rule in tooling and design-system docs.
- Add a bundle-analysis workflow that uses the existing Vite sourcemaps instead of adding a new heavy analyzer dependency.
- Lazy-load route surfaces and the active `GameView` so the landing flow, join flow, and lobby stop eagerly pulling the full 3D stack.
- Document the Storybook `radix-ui` metadata warning with exact reproduction and deferral criteria.
- Expand story coverage and stricter a11y expectations for mature shared shell and game UI components.
- Add one keyboard-oriented desktop smoke path to the existing Playwright coverage.

## Implemented in this follow-up

- Added `pnpm shadcn:web ...` and documented the repo rule that shadcn remains scoped to `apps/web`.
- Added `pnpm --filter @cornerfall/web bundle:analyze` plus a sourcemap-backed report script.
- Split the app into route-level chunks and split the active board path again so:
  - the shared bootstrap chunk is about `335.46 kB` minified instead of `1,384.52 kB`
  - `HomePage` is about `10.35 kB`
  - `PlayRoomPage` is about `98.58 kB`
  - `GameView` is about `38.98 kB`
  - the heavy 3D dependency is isolated behind the active-game path
- Replaced the landing page's runtime dependency on protocol schema parsing with a lightweight shape guard.
- Added stricter state coverage for mature shared shell and game UI stories.
- Added explicit documentation for the Storybook `radix-ui` metadata warning.

## Changes intentionally deferred

- Rewriting the app from the `radix-ui` umbrella package to many direct `@radix-ui/*` imports.
- Large manual chunk maps or a blanket `chunkSizeWarningLimit` increase without first-party evidence.
- Visual snapshot baselines for the canvas-backed game flow. The current stack is better served by behavior-level smoke coverage unless the rendering path is stabilized further.
- Eliminating the remaining `three-vendor` warning entirely. After route splitting and targeted manual chunking, the remaining warning is isolated to an optional async chunk of about `718.40 kB` minified and `187.39 kB` gzip that only loads for the active 3D board.
