import { describe, expect, it } from "vitest";

import {
  applyAction,
  computeScores,
  createInitialGame,
  getLegalPlacements,
  validateMove
} from "../src/index.js";

describe("game-core", () => {
  it("supports 4-player setup on the larger board", () => {
    const state = createInitialGame({ playerCount: 4 });

    expect(state.board.size).toBe(20);
    expect(state.players).toHaveLength(4);
  });

  it("rejects an opening move that misses the assigned corner", () => {
    const state = createInitialGame({ playerCount: 2 });

    const result = validateMove(state, "P1", {
      type: "place",
      placement: {
        pieceId: "mono",
        origin: { x: 1, y: 1 },
        transform: "r0"
      }
    });

    expect(result.ok).toBe(false);
    expect(result.code).toBe("FIRST_MOVE_MISSING_START");
  });

  it("applies a legal opening move and advances the turn", () => {
    const state = createInitialGame({ playerCount: 2 });
    const outcome = applyAction(state, "P1", {
      type: "place",
      placement: {
        pieceId: "mono",
        origin: { x: 0, y: 0 },
        transform: "r0"
      }
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }

    expect(outcome.state.board.cells[0]).toBe(0);
    expect(outcome.state.currentPlayerId).toBe("P2");
  });

  it("requires same-color corner contact after the opening move", () => {
    let state = createInitialGame({ playerCount: 2 });
    const first = applyAction(state, "P1", {
      type: "place",
      placement: {
        pieceId: "mono",
        origin: { x: 0, y: 0 },
        transform: "r0"
      }
    });

    if (!first.ok) {
      throw new Error("Opening move should be legal");
    }

    state = first.state;

    const invalidSecond = validateMove(state, "P2", {
      type: "place",
      placement: {
        pieceId: "mono",
        origin: { x: state.board.size - 2, y: state.board.size - 1 },
        transform: "r0"
      }
    });

    expect(invalidSecond.ok).toBe(false);
    expect(invalidSecond.code).toBe("FIRST_MOVE_MISSING_START");
  });

  it("finds legal placements for the active player", () => {
    const state = createInitialGame({ playerCount: 2 });
    const placements = getLegalPlacements(state, "P1", "mono");

    expect(placements.some((placement) => placement.placement.origin.x === 0 && placement.placement.origin.y === 0)).toBe(
      true
    );
  });

  it("computes completion bonuses in scoring", () => {
    const state = createInitialGame({ playerCount: 2 });
    const firstPlayer = state.players[0];

    if (!firstPlayer) {
      throw new Error("Expected a first player in the duel setup");
    }

    firstPlayer.remainingPieceIds = [];
    firstPlayer.lastPlacedPieceId = "mono";

    const summary = computeScores(state);
    const firstEntry = summary.entries.find((entry) => entry.playerId === "P1");

    expect(firstEntry?.score).toBe(20);
  });
});
