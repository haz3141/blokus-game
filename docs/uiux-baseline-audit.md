# Cornerfall UI/UX Baseline Audit

Date: 2026-03-09

## Current UI Architecture

- The web app has two routed screens: `/` in [`apps/web/src/routes/HomePage.tsx`](/Users/hazael/Code/blokus-game/apps/web/src/routes/HomePage.tsx) and `/play/:roomId` in [`apps/web/src/routes/PlayRoomPage.tsx`](/Users/hazael/Code/blokus-game/apps/web/src/routes/PlayRoomPage.tsx).
- Visible UI is mostly page-local JSX with shared class names.
- Styling is concentrated in [`apps/web/src/index.css`](/Users/hazael/Code/blokus-game/apps/web/src/index.css) with a dark-only visual language and a single desktop breakpoint.
- The 3D board is already isolated behind [`apps/web/src/features/game-3d/GameScene.tsx`](/Users/hazael/Code/blokus-game/apps/web/src/features/game-3d/GameScene.tsx), which keeps rendering separate from rules logic.

## Screen Inventory

- Home
  - name field
  - player-count segmented control
  - create-room CTA
  - optional install CTA
  - inline error state
- Room flow in one route component
  - join state
  - connecting state
  - lobby state
  - active game state
  - results state
- Not found

## Component Inventory

- Existing reusable UI is limited to the board scene, connection/install hooks, and the Zustand game UI store.
- There is no primitive layer for cards, buttons, badges, dialogs, fields, headers, or shared empty/loading/error states.
- The highest-value extraction targets are the top bar, room status, lobby invite card, seat selector, turn indicator, piece tray, action cluster, scoreboard, and results panel.

## Before-State Observations

### Strengths

- MVP flow is coherent and fast: create room, share URL, join, start, place, reconnect.
- The board stays touch-safe through the DOM overlay grid.
- Reconnect and offline-shell messaging already exist.
- The current visual style is serviceable and legible on phones.

### Pain Points

- Desktop layouts underuse available width and leave too much empty space around high-priority actions.
- Home has only a single centered card, so the hierarchy between room creation, joining, and install/PWA messaging is weak.
- Lobby duplicates seat information across the roster and seat selector, which increases scanning cost.
- Invite/share is present but visually too secondary for the primary collaboration task in the lobby.
- The active-game side tray is a long vertical stack, so turn state, piece selection, actions, and scores compete rather than form a command center.
- Camera mode has no selected-state affordance.
- Piece selection is text-heavy and does not communicate hierarchy beyond a simple active fill.
- Results are too thin for a finished-state screen and do not give the outcome or next actions enough emphasis.
- Focus-visible treatment is inconsistent outside the board overlay.

## Desktop-First Recommendations

- Introduce a design token layer and semantic status colors before page refactors.
- Extract shared UI primitives and game-specific wrappers instead of continuing with route-local styling.
- Refactor the room route into smaller state-specific views while preserving the route and test contract.
- Rebalance the active-game layout so the board remains dominant and the right-hand side becomes a concise command surface.
- Add documentation and isolated UI review in Storybook plus desktop E2E coverage alongside the existing mobile smoke flow.

## Baseline Assets

- Baseline screenshots will be captured during the implementation pass if the local dev stack remains deterministic under Playwright.
- If capture is flaky, this audit remains the source-of-truth baseline and the final report will note the reason screenshots were omitted.
