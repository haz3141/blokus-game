---
name: polyomino-rules-review
description: Use when reviewing or implementing polyomino board-game rules such as transforms, move legality, corner-touch constraints, edge-touch prohibition, passing, scoring, serialization, and endgame detection.
---

# Polyomino Rules Review

Use this skill for rule engines and authoritative move validation in corner-placement polyomino games.

## Review Checklist

- Piece catalog is complete and represented independently from rendering.
- Rotation and flip transforms are normalized and duplicate transforms are removed.
- Placement validation checks bounds, overlap, first-turn corner coverage, own-color corner contact, and own-color edge-contact rejection.
- Turn flow handles place, pass, blocked players, and end-of-game deterministically.
- Scoring is derived only from canonical state and piece inventory.
- Serialization is stable enough for hashing, snapshots, and backend/client agreement.

## Implementation Guidance

- Keep the rules package pure and runtime-agnostic.
- Prefer immutable apply functions that return the next canonical state.
- Expose machine-readable rejection codes for UI and server use.
- Treat client-side legality helpers as advisory only; backend application remains the source of truth.

## Test Expectations

- Add deterministic fixtures for 2-player and 4-player starts.
- Cover transform counts for asymmetric and symmetric pieces.
- Verify legal and illegal placement matrices.
- Verify pass legality, turn advancement, scoring, and endgame.
- Add round-trip serialization or hash-stability tests when canonical wire state changes.
