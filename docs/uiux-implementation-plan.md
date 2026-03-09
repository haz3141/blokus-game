# Cornerfall UI/UX Implementation Plan

Date: 2026-03-09

## Current UI Architecture

- App surface: [`apps/web/src/routes/HomePage.tsx`](/Users/hazael/Code/blokus-game/apps/web/src/routes/HomePage.tsx), [`apps/web/src/routes/PlayRoomPage.tsx`](/Users/hazael/Code/blokus-game/apps/web/src/routes/PlayRoomPage.tsx), and the shared board renderer in [`apps/web/src/features/game-3d/GameScene.tsx`](/Users/hazael/Code/blokus-game/apps/web/src/features/game-3d/GameScene.tsx).
- Current styling: one CSS entrypoint in [`apps/web/src/index.css`](/Users/hazael/Code/blokus-game/apps/web/src/index.css) with a small set of root variables and global class clusters.
- Route states: join, connecting, lobby, active game, and results all live inside one room page component.

## Screen Inventory

- Home / create room
- Join room
- Room lobby
- In-game HUD
- Results
- Not found

## Component Inventory

- Existing shared logic:
  - `useInstallPrompt`
  - `useRoomConnection`
  - `useGameUiStore`
  - `GameScene`
- Planned reusable UI layer:
  - app shell and page header
  - panels, side panels, cards, badges, fields
  - room status and player badges
  - turn indicator and scoreboard
  - piece tray and action cluster
  - empty/loading/error states
  - results summary and confirm dialog

## UX Pain Points

- Weak desktop information hierarchy on home and lobby.
- Duplicate room/seat information in the lobby.
- Invite/share actions need stronger emphasis.
- Active-game HUD is vertically stacked instead of intentionally grouped for desktop play.
- Turn state, local-player context, and action readiness need stronger persistent placement.
- Results do not feel like a finished state.
- Interaction-state styling is inconsistent and under-documented.

## Prioritized Backlog

### Milestone 1: Audit and planning

- Add the baseline audit.
- Record the implementation plan and acceptance criteria.
- Update the living project docs with the post-MVP UI direction.

### Milestone 2: Design system foundation

- Introduce a tokenized style architecture in `apps/web/src/styles`.
- Add semantic tokens for surfaces, text, status, and game-state colors.
- Add Tailwind v4 plus shadcn foundation configured for CSS variables.
- Add a small token bridge for Three scene colors.

### Milestone 3: Primitive and app-specific components

- Add the minimum shadcn primitive set needed for the refactor.
- Build shared game UI wrappers for headers, panels, badges, room status, piece tray, and results.
- Normalize hover, selected, disabled, loading, focus-visible, and error states.

### Milestone 4: Desktop-first route refactor

- Refactor home for clearer create/join hierarchy.
- Refactor lobby for clearer player/seat/share flow.
- Refactor active game for better board-to-command balance and denser desktop information design.
- Refactor results for stronger outcome hierarchy and clearer next actions.

### Milestone 5: Docs and quality gates

- Add Storybook with Autodocs and addon-a11y.
- Add design-system documentation and stories for shared components.
- Extend Playwright coverage to desktop without regressing the current mobile smoke path.

## Acceptance Criteria

### Milestone 1

- `docs/uiux-baseline-audit.md` and `docs/uiux-implementation-plan.md` exist and are current.
- `docs/plan.md` and `docs/decisions.md` reflect the UI refresh direction.

### Milestone 2

- Shared tokens exist and are consumed by web UI styles.
- No new hard-coded route-level color values are introduced.
- Game scene colors are sourced from token-backed constants.

### Milestone 3

- Shared primitives and game UI wrappers exist under `apps/web/src/components`.
- Keyboard-visible focus is consistent across interactive controls.
- Shared components own the common interaction states instead of route-local styling.

### Milestone 4

- Desktop layouts materially improve information density and hierarchy for home, lobby, game, and results.
- Mobile layouts remain usable and touch-safe.
- Gameplay logic, networking, and server-authoritative validation remain unchanged.

### Milestone 5

- Storybook runs for the web package.
- Shared primitives and app-level UI have stories.
- Desktop and mobile Playwright flows both pass.
- Repo lint, typecheck, test, and build commands pass before completion.
