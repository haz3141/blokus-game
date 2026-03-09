---
name: r3f-board-scene
description: Use when implementing or reviewing a React Three Fiber board scene for a turn-based strategy game, especially touch-first board picking, stable camera presets, preview overlays, and presentational 3D architecture.
---

# R3F Board Scene

Use this skill for board-game scenes where the 3D layer visualizes canonical state but does not own rule logic.

## Scene Boundaries

- Rendering code may derive meshes, highlights, and previews from plain state.
- Rule legality, transform normalization, and authoritative move application stay outside the scene.
- Every canvas action should have a DOM equivalent for accessibility and fallback input.

## Implementation Guidance

- Prefer a stable scene root with separate subtrees for grid, placed pieces, previews, and camera rig.
- Use deterministic camera presets before adding free orbit controls.
- Optimize for tap-first interactions, not drag-heavy manipulation.
- Reuse geometry and materials, and keep draw calls low enough for mid-range mobile devices.

## Review Checklist

- No rules logic has leaked into Three helpers.
- Preview state maps exactly to canonical move payloads.
- Camera movement does not interfere with touch picking.
- HUD controls and canvas controls stay in sync.
