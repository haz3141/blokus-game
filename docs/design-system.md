# Cornerfall Design System

## Direction

Cornerfall uses a dark tabletop studio direction: slate-heavy surfaces, restrained amber emphasis, and compact information density that still reads cleanly on mobile. The board should remain the visual anchor, while room metadata and actions live in quieter side panels.

## Token Model

- Foundation tokens live in [`apps/web/src/styles/tokens.css`](/Users/hazael/Code/blokus-game/apps/web/src/styles/tokens.css).
- Theme mappings live in [`apps/web/src/styles/theme.css`](/Users/hazael/Code/blokus-game/apps/web/src/styles/theme.css).
- Tailwind and shadcn consume those tokens through [`apps/web/src/index.css`](/Users/hazael/Code/blokus-game/apps/web/src/index.css).

### Core token groups

- Typography: `--font-body`, `--font-display`, `--font-code`, plus the `--text-*` scale.
- Spacing: `--space-1` through `--space-16`.
- Shape: `--radius-sm` through `--radius-2xl` and `--radius-pill`.
- Elevation and motion: `--shadow-*`, `--motion-*`, `--ease-*`.
- Layout: `--container-*` and `--bp-*`.

### Semantic tokens

- Surfaces: `--color-bg-app`, `--color-bg-panel`, `--color-bg-panel-strong`, `--color-bg-panel-elevated`.
- Borders and text: `--color-border-subtle`, `--color-border-strong`, `--color-text`, `--color-text-muted`, `--color-focus-ring`.
- Status: `--color-accent`, `--color-success`, `--color-warning`, `--color-danger`, `--color-info`.
- Game states: `--player-1` to `--player-4`, `--state-turn-active`, `--state-move-valid`, `--state-move-invalid`, `--state-connection-*`.

## Component Rules

- Use shadcn primitives for buttons, cards, fields, overlays, and menus.
- Compose app-level game UI from primitives instead of route-local class clusters.
- Keep one dominant action per panel or state.
- Prefer badges, small summaries, and separators over large blocks of explanatory copy in active gameplay.
- Preserve visible focus styles on every interactive element.

## Layout Rules

- Desktop: board-first composition with side panels for room status, turn state, piece selection, and actions.
- Mobile: preserve large tap targets, readable labels, and safe stacking order for live-room controls.
- Results: promote winner, score summary, and next actions above secondary notes.

## Color and Status Use

- Amber is for the primary action and active-turn emphasis, not for every highlight.
- Player colors are identity accents only. Do not use them as general-purpose UI chrome.
- Error, warning, and success states must keep iconography or text labels; color alone is not enough.

## Motion

- Use short, functional transitions only.
- Prefer opacity, elevation, and subtle translation over large animated shifts.
- Respect reduced-motion preferences.

## Storybook

- Run `pnpm --filter @cornerfall/web storybook` for local component review.
- Run `pnpm --filter @cornerfall/web storybook:build` as the static docs verification step.
- Stories should cover default, disabled, loading, selected, and error states where they are meaningful.
