---
name: polyomino-rules-review
description: Use this skill when reviewing or implementing polyomino placement rules, move validation, transforms, scoring, serialization, or deterministic tests in the shared game engine.
---

# Polyomino Rules Review

Use this skill for `packages/game-core` work and for reviewing any move-related server behavior that depends on rules correctness.

## Review Priorities

1. Determinism: the same input state and action must always produce the same result.
2. Canonical transforms: rotations and flips must be deduplicated per piece.
3. Legality: bounds, overlap, first-corner coverage, corner-touch requirement, and same-color edge-touch prohibition must all be enforced.
4. Turn flow: turn advancement, pass legality, endgame detection, and scoring must remain consistent.
5. Serialization: wire shapes and hashes must depend on canonical ordering only.

## Implementation Rules

- Keep rendering concerns out of the rules package.
- Keep transport/session identity out of the rules package.
- Prefer pure functions and immutable state transitions.
- Use machine-readable failure codes instead of ad hoc strings.

## Test Checklist

- unique transform counts per piece
- legal and illegal opening moves
- later move corner-touch versus edge-touch cases
- pass rejection when legal moves exist
- endgame with consecutive passes
- scoring including completion bonus
- serialization and hash stability
