---
name: r3f-board-scene
description: Use this skill when implementing or reviewing the React Three Fiber board scene, camera presets, piece rendering, preview overlays, or touch picking for gameplay presentation.
---

# R3F Board Scene

Use this skill for `apps/web/src/features/game-3d` work.

## Guardrails

- Keep the scene presentational only.
- Do not move rules, transforms, or legality logic into Three code.
- Prefer deterministic camera presets over freeform controls.
- Ensure every canvas action has a DOM equivalent elsewhere in the UI.

## Scene Structure

- `GameScene` root
- `BoardGrid`
- `PlacedPieces`
- `ActivePiecePreview`
- `CameraRig`
- touch-picking helpers in `lib/`

## Interaction Rules

- primary flow is piece selection in the HUD, not drag placement
- board taps update a preview candidate
- camera modes are `topDown` and `angled`
- visual state must clearly distinguish legal and illegal preview states
- keep draw calls low and reuse geometry/materials where possible
